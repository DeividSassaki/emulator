import * as THREE from "https://esm.sh/three@0.186.0";
import { ColladaLoader } from "https://esm.sh/three@0.186.0/examples/jsm/loaders/ColladaLoader.js?deps=three@0.186.0";


const container = document.getElementById("dado3d");
const resultadoElemento = document.getElementById("resultado");
const totalElemento = document.getElementById("total");
const dadoAtualElemento = document.getElementById("dadoAtual");

const botoesDados = document.querySelectorAll(".dado-btn");

const botaoResetar = document.getElementById("resetar");
const botaoTelaCheia = document.getElementById("telaCheia");


let dadoSelecionado = 6;
let resultado = null;
let total = 0;

let dado3D = null;
let rolando = false;

let animacaoRolagem = null;
let carregamentoId = 0;


// =====================================================
// ERRO
// =====================================================

function mensagemErro(texto) {

    console.error(texto);

    if (dadoAtualElemento) {
        dadoAtualElemento.textContent = texto;
    }

}


// =====================================================
// TELA CHEIA
// =====================================================
// Registramos o botão antes da inicialização do 3D.
// Assim, um problema no modelo não impede o botão de funcionar.
// =====================================================

if (botaoTelaCheia) {

    botaoTelaCheia.addEventListener("click", async () => {

        try {

            if (!document.fullscreenElement) {

                if (!document.documentElement.requestFullscreen) {

                    throw new Error(
                        "Tela cheia não é suportada neste navegador."
                    );

                }

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

    });


    document.addEventListener(
        "fullscreenchange",
        () => {

            botaoTelaCheia.textContent =
                document.fullscreenElement
                    ? "⛶ SAIR DA TELA CHEIA"
                    : "⛶ TELA CHEIA";

        }
    );

}


// =====================================================
// VERIFICAR CONTAINER
// =====================================================

if (!container) {

    throw new Error(
        'Elemento #dado3d não encontrado.'
    );

}


// =====================================================
// VARIÁVEIS DO THREE
// =====================================================

let cena;
let camera;
let renderizador;

let loader;
let textureLoader;


// =====================================================
// INICIALIZAÇÃO DO THREE
// =====================================================

try {

    cena = new THREE.Scene();


    // -------------------------------------------------
    // CÂMERA
    // -------------------------------------------------

    camera = new THREE.PerspectiveCamera(
        38,

        Math.max(
            container.clientWidth,
            1
        ) /
        Math.max(
            container.clientHeight,
            1
        ),

        0.1,
        100
    );


    camera.position.set(
        0,
        0.3,
        6
    );


    // -------------------------------------------------
    // RENDERIZADOR
    // -------------------------------------------------

    renderizador =
        new THREE.WebGLRenderer({

            antialias: true,
            alpha: true,

            powerPreference:
                "high-performance"

        });


    renderizador.setPixelRatio(

        Math.min(
            window.devicePixelRatio || 1,
            2
        )

    );


    renderizador.setSize(

        Math.max(
            container.clientWidth,
            1
        ),

        Math.max(
            container.clientHeight,
            1
        ),

        false

    );


    renderizador.outputColorSpace =
        THREE.SRGBColorSpace;


    renderizador.shadowMap.enabled =
        true;


    container.innerHTML = "";

    container.appendChild(
        renderizador.domElement
    );


    // =================================================
    // ILUMINAÇÃO
    // =================================================

    const luzAmbiente =
        new THREE.AmbientLight(
            0xffffff,
            2.2
        );

    cena.add(
        luzAmbiente
    );


    const luzPrincipal =
        new THREE.DirectionalLight(
            0xffffff,
            4
        );


    luzPrincipal.position.set(
        4,
        6,
        6
    );


    luzPrincipal.castShadow =
        true;


    cena.add(
        luzPrincipal
    );


    const luzFrontal =
        new THREE.DirectionalLight(
            0xffffff,
            2
        );


    luzFrontal.position.set(
        -4,
        2,
        5
    );


    cena.add(
        luzFrontal
    );


    // =================================================
    // CHÃO
    // =================================================

    const chao =
        new THREE.Mesh(

            new THREE.CircleGeometry(
                2.3,
                64
            ),

            new THREE.MeshStandardMaterial({

                color: 0x111111,

                roughness: 0.85,

                metalness: 0

            })

        );


    chao.rotation.x =
        -Math.PI / 2;


    chao.position.y =
        -1.45;


    chao.receiveShadow =
        true;


    cena.add(
        chao
    );


    // =================================================
    // LOADERS
    // =================================================

    loader =
        new ColladaLoader();


    textureLoader =
        new THREE.TextureLoader();


} catch (erro) {

    console.error(
        "Erro ao iniciar o motor 3D:",
        erro
    );

    mensagemErro(
        "ERRO NO 3D"
    );

}


// =====================================================
// CAMINHO DO MODELO
// =====================================================

function caminhoModelo(lados) {

    return `Dice_models/d${lados}.dae`;

}


// =====================================================
// CAMINHO DA TEXTURA
// =====================================================

function caminhoTextura(lados) {

    return `Maps_numbered/d${lados}_Numbers.png`;

}


// =====================================================
// REMOVER DADO
// =====================================================

function limparDado() {

    if (!dado3D || !cena) {

        return;

    }


    cena.remove(
        dado3D
    );


    dado3D.traverse(
        (objeto) => {

            if (!objeto.isMesh) {

                return;

            }


            // -------------------------------
            // GEOMETRIA
            // -------------------------------

            if (objeto.geometry) {

                objeto.geometry.dispose();

            }


            // -------------------------------
            // MATERIAL
            // -------------------------------

            const materiais =
                Array.isArray(
                    objeto.material
                )

                    ? objeto.material

                    : [
                        objeto.material
                    ];


            materiais.forEach(
                (material) => {

                    if (!material) {

                        return;

                    }


                    if (material.map) {

                        material.map.dispose();

                    }


                    material.dispose();

                }
            );

        }
    );


    dado3D = null;

}


// =====================================================
// CENTRALIZAR E AJUSTAR TAMANHO
// =====================================================

function centralizarEAjustarTamanho(
    objeto
) {

    let caixa =
        new THREE.Box3().setFromObject(
            objeto
        );


    const tamanho =
        new THREE.Vector3();


    const centro =
        new THREE.Vector3();


    caixa.getSize(
        tamanho
    );


    const maior =
        Math.max(
            tamanho.x,
            tamanho.y,
            tamanho.z
        );


    if (maior > 0) {

        objeto.scale.setScalar(
            2.3 / maior
        );

    }


    // Atualiza a caixa depois da escala.

    caixa =
        new THREE.Box3().setFromObject(
            objeto
        );


    caixa.getCenter(
        centro
    );


    objeto.position.sub(
        centro
    );


    objeto.position.y =
        0;

}


// =====================================================
// APLICAR TEXTURA
// =====================================================

function aplicarTexturaNumerada(
    objeto,
    textura
) {

    textura.colorSpace =
        THREE.SRGBColorSpace;


    textura.flipY =
        false;


    textura.wrapS =
        THREE.ClampToEdgeWrapping;


    textura.wrapT =
        THREE.ClampToEdgeWrapping;


    textura.anisotropy =
        4;


    objeto.traverse(
        (mesh) => {

            if (!mesh.isMesh) {

                return;

            }


            mesh.castShadow =
                true;


            mesh.receiveShadow =
                true;


            const novoMaterial =
                new THREE.MeshStandardMaterial({

                    map: textura,

                    color: 0xffffff,

                    roughness: 0.38,

                    metalness: 0.04

                });


            const antigos =
                Array.isArray(
                    mesh.material
                )

                    ? mesh.material

                    : [
                        mesh.material
                    ];


            antigos.forEach(
                (material) => {

                    if (material) {

                        material.dispose();

                    }

                }
            );


            mesh.material =
                novoMaterial;

        }
    );

}


// =====================================================
// CARREGAR DADO
// =====================================================

function carregarDado(lados) {

    if (
        !loader ||
        !textureLoader ||
        !renderizador
    ) {

        mensagemErro(
            "ERRO NO 3D"
        );

        return;

    }


    const idAtual =
        ++carregamentoId;


    rolando =
        false;


    if (animacaoRolagem) {

        cancelAnimationFrame(
            animacaoRolagem
        );

        animacaoRolagem =
            null;

    }


    limparDado();


    dadoAtualElemento.textContent =
        `D${lados}`;


    const caminhoDado =
        caminhoModelo(
            lados
        );


    const caminhoMapa =
        caminhoTextura(
            lados
        );


    // =================================================
    // MODELO
    // =================================================

    loader.load(

        caminhoDado,


        (resultadoCollada) => {

            if (
                idAtual !==
                carregamentoId
            ) {

                return;

            }


            const modelo =
                resultadoCollada?.scene;


            if (!modelo) {

                mensagemErro(
                    `D${lados} SEM MODELO`
                );

                return;

            }


            dado3D =
                modelo;


            centralizarEAjustarTamanho(
                dado3D
            );


            dado3D.rotation.set(

                0.35,
                0.5,
                0.05

            );


            // =========================================
            // TEXTURA
            // =========================================

            textureLoader.load(

                caminhoMapa,


                (textura) => {

                    if (
                        idAtual !==
                        carregamentoId
                    ) {

                        textura.dispose();

                        return;

                    }


                    aplicarTexturaNumerada(
                        dado3D,
                        textura
                    );


                    cena.add(
                        dado3D
                    );

                },


                undefined,


                (erro) => {

                    console.error(

                        "Erro ao carregar textura:",
                        caminhoMapa,
                        erro

                    );


                    if (
                        idAtual !==
                        carregamentoId
                    ) {

                        return;

                    }


                    // Mesmo sem textura,
                    // mostra o modelo.

                    dado3D.traverse(
                        (mesh) => {

                            if (
                                !mesh.isMesh
                            ) {

                                return;

                            }


                            mesh.material =
                                new THREE.MeshStandardMaterial({

                                    color: 0x3a3a3a,

                                    roughness: 0.4,

                                    metalness: 0.05

                                });

                        }
                    );


                    cena.add(
                        dado3D
                    );


                    console.warn(

                        `D${lados} abriu sem a textura numerada.`

                    );

                }

            );

        },


        undefined,


        (erro) => {

            console.error(

                "Erro ao carregar dado:",
                caminhoDado,
                erro

            );


            if (
                idAtual ===
                carregamentoId
            ) {

                dado3D =
                    null;


                mensagemErro(
                    `ERRO AO ABRIR D${lados}`
                );

            }

        }

    );

}


// =====================================================
// SELECIONAR DADO
// =====================================================

function selecionarDado(lados) {

    dadoSelecionado =
        lados;


    botoesDados.forEach(
        (botao) => {

            botao.classList.toggle(

                "selecionado",

                Number(
                    botao.dataset.dado
                ) === lados

            );

        }
    );


    carregarDado(
        lados
    );

}


// =====================================================
// ROLAR DADO
// =====================================================

function rolarDado() {

    if (
        rolando ||
        !dado3D
    ) {

        return;

    }


    rolando =
        true;


    // ================================================
    // RESULTADO
    // ================================================

    resultado =
        Math.floor(

            Math.random() *
            dadoSelecionado

        ) + 1;


    resultadoElemento.textContent =
        resultado;


    total +=
        resultado;


    totalElemento.textContent =
        total;


    // ================================================
    // POSIÇÃO INICIAL
    // ================================================

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


    // ================================================
    // POSIÇÃO FINAL
    // ================================================

    const finalX =
        THREE.MathUtils.randFloat(
            -1.5,
            1.5
        );


    const rotX =
        THREE.MathUtils.randFloat(
            12,
            22
        ) *
        (
            Math.random() < 0.5
                ? -1
                : 1
        );


    const rotY =
        THREE.MathUtils.randFloat(
            12,
            22
        ) *
        (
            Math.random() < 0.5
                ? -1
                : 1
        );


    const rotZ =
        THREE.MathUtils.randFloat(
            12,
            22
        ) *
        (
            Math.random() < 0.5
                ? -1
                : 1
        );


    // ================================================
    // TEMPO
    // ================================================

    const inicio =
        performance.now();


    const duracao =
        1500;


    // ================================================
    // ANIMAÇÃO
    // ================================================

    function animarRolagem(
        agora
    ) {

        if (!dado3D) {

            rolando =
                false;

            return;

        }


        const progresso =
            Math.min(

                (
                    agora -
                    inicio
                ) /
                duracao,

                1

            );


        const suavizado =
            1 -
            Math.pow(
                1 - progresso,
                3
            );


        const salto =
            Math.sin(
                progresso *
                Math.PI
            );


        // --------------------------------------------
        // MOVIMENTO HORIZONTAL
        // --------------------------------------------

        dado3D.position.x =
            THREE.MathUtils.lerp(

                inicioX,
                finalX,
                suavizado

            );


        // --------------------------------------------
        // SALTO
        // --------------------------------------------

        dado3D.position.y =
            THREE.MathUtils.lerp(

                inicioY,
                0,
                suavizado

            ) +
            salto *
            1.2;


        // --------------------------------------------
        // ROTAÇÃO
        // --------------------------------------------

        dado3D.rotation.x =
            inicioRotX +
            rotX *
            suavizado;


        dado3D.rotation.y =
            inicioRotY +
            rotY *
            suavizado;


        dado3D.rotation.z =
            inicioRotZ +
            rotZ *
            suavizado;


        // --------------------------------------------
        // CONTINUAR
        // --------------------------------------------

        if (
            progresso <
            1
        ) {

            animacaoRolagem =
                requestAnimationFrame(
                    animarRolagem
                );

        } else {

            rolando =
                false;


            dado3D.position.x =
                0;


            dado3D.position.y =
                0;


            animacaoRolagem =
                null;

        }

    }


    animacaoRolagem =
        requestAnimationFrame(
            animarRolagem
        );

}


// =====================================================
// BOTÕES DOS DADOS
// =====================================================

botoesDados.forEach(
    (botao) => {

        botao.addEventListener(

            "click",

            () => {

                const lados =
                    Number(
                        botao.dataset.dado
                    );


                // --------------------------------------
                // OUTRO DADO
                // --------------------------------------

                if (
                    lados !==
                    dadoSelecionado
                ) {

                    selecionarDado(
                        lados
                    );


                    setTimeout(
                        () => {

                            rolarDado();

                        },
                        500
                    );


                } else {

                    // ----------------------------------
                    // MESMO DADO
                    // ----------------------------------

                    rolarDado();

                }

            }

        );

    }
);


// =====================================================
// RESETAR
// =====================================================

if (botaoResetar) {

    botaoResetar.addEventListener(

        "click",

        () => {

            // ------------------------------------------
            // CANCELAR ANIMAÇÃO
            // ------------------------------------------

            if (animacaoRolagem) {

                cancelAnimationFrame(
                    animacaoRolagem
                );

                animacaoRolagem =
                    null;

            }


            rolando =
                false;


            // ------------------------------------------
            // ZERAR VALORES
            // ------------------------------------------

            total =
                0;


            resultado =
                null;


            resultadoElemento.textContent =
                "—";


            totalElemento.textContent =
                "0";


            // ------------------------------------------
            // RESETAR DADO
            // ------------------------------------------

            if (dado3D) {

                dado3D.position.set(
                    0,
                    0,
                    0
                );


                dado3D.rotation.set(
                    0.35,
                    0.5,
                    0.05
                );

            }

        }

    );

}


// =====================================================
// REDIMENSIONAMENTO
// =====================================================

window.addEventListener(

    "resize",

    () => {

        if (
            !camera ||
            !renderizador
        ) {

            return;

        }


        const largura =
            Math.max(
                container.clientWidth,
                1
            );


        const altura =
            Math.max(
                container.clientHeight,
                1
            );


        camera.aspect =
            largura /
            altura;


        camera.updateProjectionMatrix();


        renderizador.setSize(

            largura,
            altura,
            false

        );

    }

);


// =====================================================
// LOOP PRINCIPAL
// =====================================================

function animar() {

    requestAnimationFrame(
        animar
    );


    if (
        renderizador &&
        cena &&
        camera
    ) {

        renderizador.render(
            cena,
            camera
        );

    }

}


// =====================================================
// INICIAR
// =====================================================

selecionarDado(
    6
);


animar();
