import * as THREE from "https://esm.sh/three@0.186.0";
import { ColladaLoader } from "https://esm.sh/three@0.186.0/examples/jsm/loaders/ColladaLoader.js?deps=three@0.186.0";


// =====================================================
// ELEMENTOS
// =====================================================

const container = document.getElementById("dado3d");
const resultadoElemento = document.getElementById("resultado");
const totalElemento = document.getElementById("total");
const dadoAtualElemento = document.getElementById("dadoAtual");

const botoesDados =
    document.querySelectorAll(".dado-btn");

const botaoResetar =
    document.getElementById("resetar");

const botaoTelaCheia =
    document.getElementById("telaCheia");


// =====================================================
// ESTADO
// =====================================================

let dadoSelecionado = 6;

let resultado = null;

let total = 0;

let dado3D = null;

let rolando = false;

let animacaoRolagem = null;

let carregamentoId = 0;


// =====================================================
// THREE.JS
// =====================================================

let cena;

let camera;

let renderizador;

let loader;

let textureLoader;


// =====================================================
// TELA CHEIA
// =====================================================

if (botaoTelaCheia) {

    botaoTelaCheia.addEventListener(
        "click",
        async () => {

            try {

                if (!document.fullscreenElement) {

                    await document
                        .documentElement
                        .requestFullscreen();

                } else {

                    await document.exitFullscreen();

                }

            } catch (erro) {

                console.error(
                    "Erro na tela cheia:",
                    erro
                );

            }

        }
    );


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
// INICIAR THREE
// =====================================================

try {

    cena = new THREE.Scene();


    camera =
        new THREE.PerspectiveCamera(
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
    // LUZ
    // =================================================

    const luzAmbiente =
        new THREE.AmbientLight(
            0xffffff,
            2.5
        );

    cena.add(
        luzAmbiente
    );


    const luzPrincipal =
        new THREE.DirectionalLight(
            0xffffff,
            3.5
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
        "Erro iniciando Three.js:",
        erro
    );

}


// =====================================================
// CAMINHO DOS MODELOS
// =====================================================

function caminhoModelo(lados) {

    return `Dice_models/d${lados}.dae`;

}


// =====================================================
// CAMINHO DAS TEXTURAS
// =====================================================

function caminhoTextura(lados) {

    return `Maps_numbered/d${lados}_Numbers.png`;

}


// =====================================================
// ORIENTAÇÃO BASE DE CADA DADO
// =====================================================
//
// IMPORTANTE:
// Os modelos .dae já possuem uma orientação própria.
// Não usamos mais uma rotação aleatória permanente.
//
// Se algum modelo específico precisar de correção,
// podemos ajustar individualmente aqui.
//
// =====================================================

function orientacaoBase(lados) {

    const rotacoes = {

        4: {
            x: 0,
            y: 0,
            z: 0
        },

        6: {
            x: 0,
            y: 0,
            z: 0
        },

        8: {
            x: 0,
            y: 0,
            z: 0
        },

        10: {
            x: 0,
            y: 0,
            z: 0
        },

        12: {
            x: 0,
            y: 0,
            z: 0
        },

        20: {
            x: 0,
            y: 0,
            z: 0
        }

    };


    return (
        rotacoes[lados] ||
        rotacoes[6]
    );

}


// =====================================================
// APLICAR ORIENTAÇÃO BASE
// =====================================================

function aplicarOrientacaoBase() {

    if (!dado3D) {

        return;

    }


    const rotacao =
        orientacaoBase(
            dadoSelecionado
        );


    dado3D.rotation.set(

        rotacao.x,

        rotacao.y,

        rotacao.z

    );

}


// =====================================================
// LIMPAR DADO
// =====================================================

function limparDado() {

    if (
        !dado3D ||
        !cena
    ) {

        return;

    }


    cena.remove(
        dado3D
    );


    dado3D.traverse(
        objeto => {

            if (
                !objeto.isMesh
            ) {

                return;

            }


            if (
                objeto.geometry
            ) {

                objeto.geometry.dispose();

            }


            const materiais =
                Array.isArray(
                    objeto.material
                )

                    ? objeto.material

                    : [
                        objeto.material
                    ];


            materiais.forEach(
                material => {

                    if (!material) {

                        return;

                    }


                    if (
                        material.map
                    ) {

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
// CENTRALIZAR MODELO
// =====================================================

function ajustarModelo(objeto) {

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


    if (
        maior > 0
    ) {

        objeto.scale.setScalar(
            2.3 / maior
        );

    }


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
// TEXTURA
// =====================================================

function aplicarTextura(
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
        mesh => {

            if (
                !mesh.isMesh
            ) {

                return;

            }


            mesh.castShadow =
                true;


            mesh.receiveShadow =
                true;


            const material =
                new THREE.MeshStandardMaterial({

                    map: textura,

                    color: 0xffffff,

                    roughness: 0.35,

                    metalness: 0.02

                });


            mesh.material =
                material;

        }
    );

}


// =====================================================
// CARREGAR DADO
// =====================================================

function carregarDado(lados) {

    if (
        !loader ||
        !textureLoader
    ) {

        return;

    }


    const id =
        ++carregamentoId;


    rolando =
        false;


    if (
        animacaoRolagem
    ) {

        cancelAnimationFrame(
            animacaoRolagem
        );

        animacaoRolagem =
            null;

    }


    limparDado();


    dadoAtualElemento.textContent =
        `D${lados}`;


    const modelo =
        caminhoModelo(
            lados
        );


    const mapa =
        caminhoTextura(
            lados
        );


    // =================================================
    // MODELO
    // =================================================

    loader.load(

        modelo,


        collada => {

            if (
                id !==
                carregamentoId
            ) {

                return;

            }


            dado3D =
                collada.scene;


            ajustarModelo(
                dado3D
            );


            // IMPORTANTE:
            // orientação inicial neutra
            aplicarOrientacaoBase();


            // =========================================
            // TEXTURA
            // =========================================

            textureLoader.load(

                mapa,


                textura => {

                    if (
                        id !==
                        carregamentoId
                    ) {

                        textura.dispose();

                        return;

                    }


                    aplicarTextura(
                        dado3D,
                        textura
                    );


                    cena.add(
                        dado3D
                    );

                },


                undefined,


                erro => {

                    console.error(
                        "Erro na textura:",
                        mapa,
                        erro
                    );


                    // Mesmo sem textura,
                    // mostrar o modelo.

                    dado3D.traverse(
                        mesh => {

                            if (
                                !mesh.isMesh
                            ) {

                                return;

                            }


                            mesh.material =
                                new THREE.MeshStandardMaterial({

                                    color: 0xffffff,

                                    roughness: 0.35,

                                    metalness: 0.02

                                });

                        }
                    );


                    cena.add(
                        dado3D
                    );

                }

            );

        },


        undefined,


        erro => {

            console.error(
                "Erro carregando modelo:",
                modelo,
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


    botoesDados.forEach(
        botao => {

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


    // =================================================
    // RESULTADO
    // =================================================

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


    // =================================================
    // POSIÇÃO INICIAL
    // =================================================

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


    // =================================================
    // MOVIMENTO
    // =================================================

    const finalX =
        THREE.MathUtils.randFloat(
            -1.4,
            1.4
        );


    const voltasX =
        THREE.MathUtils.randFloat(
            2.5,
            4.5
        );


    const voltasY =
        THREE.MathUtils.randFloat(
            2.5,
            4.5
        );


    const voltasZ =
        THREE.MathUtils.randFloat(
            2.5,
            4.5
        );


    const sinalX =
        Math.random() < 0.5
            ? -1
            : 1;


    const sinalY =
        Math.random() < 0.5
            ? -1
            : 1;


    const sinalZ =
        Math.random() < 0.5
            ? -1
            : 1;


    const finalRotX =
        inicioRotX +
        voltasX *
        Math.PI *
        2 *
        sinalX;


    const finalRotY =
        inicioRotY +
        voltasY *
        Math.PI *
        2 *
        sinalY;


    const finalRotZ =
        inicioRotZ +
        voltasZ *
        Math.PI *
        2 *
        sinalZ;


    // =================================================
    // TEMPO
    // =================================================

    const inicio =
        performance.now();


    const duracao =
        1500;


    // =================================================
    // ANIMAÇÃO
    // =================================================

    function animar(agora) {

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


        // ---------------------------------------------
        // DESACELERAÇÃO
        // ---------------------------------------------

        const suavizado =
            1 -
            Math.pow(
                1 - progresso,
                4
            );


        // ---------------------------------------------
        // SALTO
        // ---------------------------------------------

        const salto =
            Math.sin(
                progresso *
                Math.PI
            );


        // ---------------------------------------------
        // MOVIMENTO HORIZONTAL
        // ---------------------------------------------

        dado3D.position.x =
            THREE.MathUtils.lerp(

                inicioX,

                finalX,

                suavizado

            );


        // ---------------------------------------------
        // MOVIMENTO VERTICAL
        // ---------------------------------------------

        dado3D.position.y =
            salto *
            1.25;


        // ---------------------------------------------
        // ROTAÇÃO
        // ---------------------------------------------

        dado3D.rotation.x =
            THREE.MathUtils.lerp(

                inicioRotX,

                finalRotX,

                suavizado

            );


        dado3D.rotation.y =
            THREE.MathUtils.lerp(

                inicioRotY,

                finalRotY,

                suavizado

            );


        dado3D.rotation.z =
            THREE.MathUtils.lerp(

                inicioRotZ,

                finalRotZ,

                suavizado

            );


        // ---------------------------------------------
        // CONTINUAR
        // ---------------------------------------------

        if (
            progresso <
            1
        ) {

            animacaoRolagem =
                requestAnimationFrame(
                    animar
                );

            return;

        }


        // =================================================
        // FIM DA ROLAGEM
        // =================================================

        dado3D.position.x =
            0;


        dado3D.position.y =
            0;


        // MUITO IMPORTANTE:
        //
        // Em vez de deixar o dado na rotação
        // aleatória em que terminou,
        // voltamos para a orientação base.
        //
        // Isso impede o D4 de terminar apoiado
        // na ponta.
        // =================================================

        aplicarOrientacaoBase();


        rolando =
            false;


        animacaoRolagem =
            null;

    }


    animacaoRolagem =
        requestAnimationFrame(
            animar
        );

}


// =====================================================
// BOTÕES DOS DADOS
// =====================================================

botoesDados.forEach(
    botao => {

        botao.addEventListener(
            "click",
            () => {

                const lados =
                    Number(
                        botao.dataset.dado
                    );


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

            if (
                animacaoRolagem
            ) {

                cancelAnimationFrame(
                    animacaoRolagem
                );

                animacaoRolagem =
                    null;

            }


            rolando =
                false;


            resultado =
                null;


            total =
                0;


            resultadoElemento.textContent =
                "—";


            totalElemento.textContent =
                "0";


            if (dado3D) {

                dado3D.position.set(
                    0,
                    0,
                    0
                );


                aplicarOrientacaoBase();

            }

        }
    );

}


// =====================================================
// REDIMENSIONAR
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
// LOOP
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
// INICIAR D6
// =====================================================

selecionarDado(
    6
);


animar();
