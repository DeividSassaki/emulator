import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.186.0/build/three.module.js";

import { ColladaLoader } from "https://cdn.jsdelivr.net/npm/three@0.186.0/examples/jsm/loaders/ColladaLoader.js";


// =====================================================
// ELEMENTOS
// =====================================================

const container = document.getElementById("dado3d");

const resultadoElemento = document.getElementById("resultado");
const totalElemento = document.getElementById("total");
const dadoAtualElemento = document.getElementById("dadoAtual");

const botoesDados = document.querySelectorAll(".dado-btn");

const botaoResetar = document.getElementById("resetar");
const botaoTelaCheia = document.getElementById("telaCheia");


// =====================================================
// VARIÁVEIS
// =====================================================

let dadoSelecionado = 6;

let resultado = null;

let total = 0;

let dado3D = null;

let rolando = false;

let animationFrame = null;


// =====================================================
// CENA
// =====================================================

const cena = new THREE.Scene();


// =====================================================
// CÂMERA
// =====================================================

const camera = new THREE.PerspectiveCamera(
    38,
    container.clientWidth / container.clientHeight,
    0.1,
    100
);

camera.position.set(0, 0.3, 6);


// =====================================================
// RENDERIZADOR
// =====================================================

const renderizador = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});

renderizador.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

renderizador.setSize(
    container.clientWidth,
    container.clientHeight
);

renderizador.shadowMap.enabled = true;

container.appendChild(renderizador.domElement);


// =====================================================
// ILUMINAÇÃO
// =====================================================

const luzAmbiente = new THREE.AmbientLight(
    0xffffff,
    2
);

cena.add(luzAmbiente);


const luzPrincipal = new THREE.DirectionalLight(
    0xffffff,
    4
);

luzPrincipal.position.set(
    4,
    6,
    6
);

luzPrincipal.castShadow = true;

cena.add(luzPrincipal);


const luzFrontal = new THREE.DirectionalLight(
    0xffffff,
    2
);

luzFrontal.position.set(
    -4,
    2,
    5
);

cena.add(luzFrontal);


// =====================================================
// CHÃO
// =====================================================

const chao = new THREE.Mesh(

    new THREE.CircleGeometry(2.3, 64),

    new THREE.MeshStandardMaterial({
        color: 0x111111,
        roughness: 0.8
    })

);

chao.rotation.x = -Math.PI / 2;

chao.position.y = -1.45;

chao.receiveShadow = true;

cena.add(chao);


// =====================================================
// LOADER
// =====================================================

const loader = new ColladaLoader();

const textureLoader = new THREE.TextureLoader();


// =====================================================
// CAMINHOS
// =====================================================

function caminhoModelo(lados) {

    return `Dice_models/d${lados}.dae`;

}


function caminhoTextura(lados) {

    return `Maps_numbered/d${lados}_Numbers.png`;

}


// =====================================================
// REMOVER DADO ATUAL
// =====================================================

function removerDado() {

    if (!dado3D) {
        return;
    }


    cena.remove(dado3D);


    dado3D.traverse(objeto => {

        if (!objeto.isMesh) {
            return;
        }


        if (objeto.geometry) {
            objeto.geometry.dispose();
        }


        if (objeto.material) {

            if (Array.isArray(objeto.material)) {

                objeto.material.forEach(material => {

                    if (material.map) {
                        material.map.dispose();
                    }

                    material.dispose();

                });

            } else {

                if (objeto.material.map) {
                    objeto.material.map.dispose();
                }

                objeto.material.dispose();

            }

        }

    });


    dado3D = null;
}


// =====================================================
// CARREGAR DADO
// =====================================================

function carregarDado(lados) {

    removerDado();


    dadoAtualElemento.textContent =
        `D${lados}`;


    const caminhoDado =
        caminhoModelo(lados);


    const caminhoMapa =
        caminhoTextura(lados);


    loader.load(

        caminhoDado,

        function (resultadoCollada) {

            dado3D =
                resultadoCollada.scene;


            // -----------------------------------------
            // CARREGAR TEXTURA DOS NÚMEROS
            // -----------------------------------------

            textureLoader.load(

                caminhoMapa,

                function (textura) {

                    textura.colorSpace =
                        THREE.SRGBColorSpace;


                    dado3D.traverse(objeto => {

                        if (!objeto.isMesh) {
                            return;
                        }


                        objeto.castShadow = true;

                        objeto.receiveShadow = true;


                        // --------------------------------
                        // MATERIAL
                        // --------------------------------

                        if (Array.isArray(objeto.material)) {

                            objeto.material =
                                objeto.material.map(material => {

                                    const novoMaterial =
                                        new THREE.MeshStandardMaterial({

                                            map: textura,

                                            color: 0xffffff,

                                            roughness: 0.4,

                                            metalness: 0.05

                                        });


                                    return novoMaterial;

                                });

                        } else {

                            objeto.material =
                                new THREE.MeshStandardMaterial({

                                    map: textura,

                                    color: 0xffffff,

                                    roughness: 0.4,

                                    metalness: 0.05

                                });

                        }

                    });


                    // --------------------------------
                    // AJUSTAR TAMANHO
                    // --------------------------------

                    const caixa =
                        new THREE.Box3().setFromObject(dado3D);


                    const tamanho =
                        new THREE.Vector3();


                    caixa.getSize(tamanho);


                    const maior =
                        Math.max(
                            tamanho.x,
                            tamanho.y,
                            tamanho.z
                        );


                    if (maior > 0) {

                        const escala =
                            2.3 / maior;

                        dado3D.scale.setScalar(
                            escala
                        );

                    }


                    // --------------------------------
                    // CENTRALIZAR
                    // --------------------------------

                    const centro =
                        new THREE.Vector3();


                    caixa.getCenter(centro);

                    dado3D.position.sub(centro);


                    dado3D.position.y = 0;


                    // --------------------------------
                    // ROTAÇÃO INICIAL
                    // --------------------------------

                    dado3D.rotation.set(
                        0.4,
                        0.5,
                        0
                    );


                    cena.add(dado3D);

                },

                undefined,

                function (erro) {

                    console.error(
                        "Erro ao carregar textura:",
                        caminhoMapa,
                        erro
                    );

                }

            );

        },

        undefined,

        function (erro) {

            console.error(
                "Erro ao carregar dado:",
                caminhoDado,
                erro
            );

        }

    );

}


// =====================================================
// SELECIONAR DADO
// =====================================================

function selecionarDado(lados) {

    dadoSelecionado =
        lados;


    botoesDados.forEach(botao => {

        const valor =
            Number(botao.dataset.dado);


        botao.classList.toggle(
            "selecionado",
            valor === lados
        );

    });


    carregarDado(lados);

}


// =====================================================
// ROLAR DADO
// =====================================================

function rolarDado() {

    if (rolando || !dado3D) {
        return;
    }


    rolando = true;


    // -----------------------------------------------
    // RESULTADO
    // -----------------------------------------------

    resultado =
        Math.floor(
            Math.random() * dadoSelecionado
        ) + 1;


    resultadoElemento.textContent =
        resultado;


    total += resultado;


    totalElemento.textContent =
        total;


    // -----------------------------------------------
    // POSIÇÃO INICIAL
    // -----------------------------------------------

    const inicioX =
        dado3D.position.x;

    const inicioY =
        dado3D.position.y;


    const inicioRotX =
        dado3D.rotation.x;

    const inicioRotY =
        dado3D.rotation.y;

    const inicioRotZ =
        dado3D.rotation.z;


    // -----------------------------------------------
    // MOVIMENTO
    // -----------------------------------------------

    const finalX =
        (Math.random() * 3) - 1.5;


    const finalY =
        0;


    const rotacaoX =
        (Math.random() * 10 + 12) *
        (Math.random() < 0.5 ? -1 : 1);


    const rotacaoY =
        (Math.random() * 10 + 12) *
        (Math.random() < 0.5 ? -1 : 1);


    const rotacaoZ =
        (Math.random() * 10 + 12) *
        (Math.random() < 0.5 ? -1 : 1);


    const inicio =
        performance.now();


    const duracao =
        1500;


    // -----------------------------------------------
    // ANIMAÇÃO
    // -----------------------------------------------

    function animarRolagem(agora) {

        const tempo =
            agora - inicio;


        const progresso =
            Math.min(
                tempo / duracao,
                1
            );


        const suavizado =
            1 -
            Math.pow(
                1 - progresso,
                3
            );


        // movimento horizontal

        dado3D.position.x =
            THREE.MathUtils.lerp(
                inicioX,
                finalX,
                suavizado
            );


        // salto

        const salto =
            Math.sin(
                progresso * Math.PI
            );


        dado3D.position.y =
            THREE.MathUtils.lerp(
                inicioY,
                finalY,
                suavizado
            ) +
            salto * 1.2;


        // rotação

        dado3D.rotation.x =
            inicioRotX +
            rotacaoX *
            suavizado;


        dado3D.rotation.y =
            inicioRotY +
            rotacaoY *
            suavizado;


        dado3D.rotation.z =
            inicioRotZ +
            rotacaoZ *
            suavizado;


        if (progresso < 1) {

            animationFrame =
                requestAnimationFrame(
                    animarRolagem
                );

        } else {

            rolando = false;


            dado3D.position.x = 0;

            dado3D.position.y = 0;

        }

    }


    animationFrame =
        requestAnimationFrame(
            animarRolagem
        );

}


// =====================================================
// BOTÕES DOS DADOS
// =====================================================

botoesDados.forEach(botao => {

    botao.addEventListener(
        "click",
        () => {

            const lados =
                Number(
                    botao.dataset.dado
                );


            // Se escolheu outro dado,
            // troca o modelo e já rola.

            if (lados !== dadoSelecionado) {

                selecionarDado(lados);

                // espera o modelo carregar
                setTimeout(() => {

                    rolarDado();

                }, 250);

                return;

            }


            // Se já está selecionado,
            // rola novamente.

            rolarDado();

        }
    );

});


// =====================================================
// RESETAR
// =====================================================

botaoResetar.addEventListener(
    "click",
    () => {

        total = 0;

        resultado = null;


        resultadoElemento.textContent =
            "—";


        totalElemento.textContent =
            "0";


        if (dado3D && !rolando) {

            dado3D.position.set(
                0,
                0,
                0
            );

            dado3D.rotation.set(
                0.4,
                0.5,
                0
            );

        }

    }
);


// =====================================================
// TELA CHEIA
// =====================================================

botaoTelaCheia.addEventListener(
    "click",
    async () => {

        try {

            if (!document.fullscreenElement) {

                await document.documentElement.requestFullscreen();

            } else {

                await document.exitFullscreen();

            }

        } catch (erro) {

            console.error(
                "Tela cheia não disponível:",
                erro
            );

        }

    }
);


// =====================================================
// TEXTO DO BOTÃO DE TELA CHEIA
// =====================================================

document.addEventListener(
    "fullscreenchange",
    () => {

        if (document.fullscreenElement) {

            botaoTelaCheia.textContent =
                "⛶ SAIR DA TELA CHEIA";

        } else {

            botaoTelaCheia.textContent =
                "⛶ TELA CHEIA";

        }

    }
);


// =====================================================
// REDIMENSIONAMENTO
// =====================================================

window.addEventListener(
    "resize",
    () => {

        const largura =
            container.clientWidth;


        const altura =
            container.clientHeight;


        camera.aspect =
            largura / altura;


        camera.updateProjectionMatrix();


        renderizador.setSize(
            largura,
            altura
        );

    }
);


// =====================================================
// LOOP
// =====================================================

function animar() {

    requestAnimationFrame(
        animar
    );


    renderizador.render(
        cena,
        camera
    );

}


// =====================================================
// INICIAR
// =====================================================

selecionarDado(6);

animar();
