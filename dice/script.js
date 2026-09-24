import * as THREE from "https://esm.sh/three@0.186.0";
import {
    ColladaLoader
} from "https://esm.sh/three@0.186.0/examples/jsm/loaders/ColladaLoader.js?deps=three@0.186.0";


// ============================================================
// CONFIGURAÇÕES DA ROLAGEM
// ============================================================

const DURACAO_ROLAGEM = 2200;
const TEMPO_ASSENTAR = 500;


// ============================================================
// MODO DE AJUSTE
// ============================================================
//
// Durante os testes:
//
// const FORCAR_RESULTADO = 1;
//
// fará o dado sempre parar no número 1.
//
// Quando terminar todos os ajustes:
//
// const FORCAR_RESULTADO = null;
//
// ============================================================

const FORCAR_RESULTADO = null;


// ============================================================
// ORIENTAÇÃO BASE DO MODELO
// ============================================================
//
// O modelo atualmente começa aproximadamente em:
//
// X = 0.35 rad
// Y = 0.50 rad
// Z = 0.05 rad
//
// Aqui transformamos isso em graus.
//

const ROTACAO_BASE_GRAUS = {

    x: 20.05,
    y: 28.65,
    z: 2.86

};


// ============================================================
// AJUSTE DE CADA FACE
// ============================================================
//
// IMPORTANTE:
//
// Você só precisa mexer AQUI.
//
// Cada dado possui uma tabela própria.
//
// X = inclina para frente/trás
// Y = gira para os lados
// Z = gira/inclina no próprio eixo
//
// Os valores abaixo são ajustes em relação à
// orientação base.
//
// Exemplo:
//
// 1: { x: 90, y: 0, z: 0 }
//
// significa que, para o número 1 ficar para cima,
// será acrescentado 90 graus no eixo X.
//
// ============================================================

const AJUSTES_FACES = {

    // --------------------------------------------------------
    // D4
    // --------------------------------------------------------

    4: {

        1: { x: 92, y: 0, z: 0 },

        2: { x: 0, y: 0, z: 0 },

        3: { x: 92, y: 0, z: 90 },

        4: { x: 92, y: 40, z: 0 }

    },


    // --------------------------------------------------------
    // D6
    // --------------------------------------------------------

    6: {

        1: { x: 0, y: 0, z: 0 },

        2: { x: 0, y: 0, z: 0 },

        3: { x: 0, y: 0, z: 0 },

        4: { x: 0, y: 0, z: 0 },

        5: { x: 0, y: 0, z: 0 },

        6: { x: 0, y: 0, z: 0 }

    },


    // --------------------------------------------------------
    // D8
    // --------------------------------------------------------

    8: {

        1: { x: 0, y: 0, z: 0 },

        2: { x: 0, y: 0, z: 0 },

        3: { x: 0, y: 0, z: 0 },

        4: { x: 0, y: 0, z: 0 },

        5: { x: 0, y: 0, z: 0 },

        6: { x: 0, y: 0, z: 0 },

        7: { x: 0, y: 0, z: 0 },

        8: { x: 0, y: 0, z: 0 }

    },


    // --------------------------------------------------------
    // D10
    // --------------------------------------------------------

    10: {

        1: { x: 0, y: 0, z: 0 },

        2: { x: 0, y: 0, z: 0 },

        3: { x: 0, y: 0, z: 0 },

        4: { x: 0, y: 0, z: 0 },

        5: { x: 0, y: 0, z: 0 },

        6: { x: 0, y: 0, z: 0 },

        7: { x: 0, y: 0, z: 0 },

        8: { x: 0, y: 0, z: 0 },

        9: { x: 0, y: 0, z: 0 },

        10: { x: 0, y: 0, z: 0 }

    },


    // --------------------------------------------------------
    // D12
    // --------------------------------------------------------

    12: {

        1: { x: 0, y: 0, z: 0 },

        2: { x: 0, y: 0, z: 0 },

        3: { x: 0, y: 0, z: 0 },

        4: { x: 0, y: 0, z: 0 },

        5: { x: 0, y: 0, z: 0 },

        6: { x: 0, y: 0, z: 0 },

        7: { x: 0, y: 0, z: 0 },

        8: { x: 0, y: 0, z: 0 },

        9: { x: 0, y: 0, z: 0 },

        10: { x: 0, y: 0, z: 0 },

        11: { x: 0, y: 0, z: 0 },

        12: { x: 0, y: 0, z: 0 }

    },


    // --------------------------------------------------------
    // D20
    // --------------------------------------------------------

    20: {

        1: { x: 0, y: 0, z: 0 },

        2: { x: 0, y: 0, z: 0 },

        3: { x: 0, y: 0, z: 0 },

        4: { x: 0, y: 0, z: 0 },

        5: { x: 0, y: 0, z: 0 },

        6: { x: 0, y: 0, z: 0 },

        7: { x: 0, y: 0, z: 0 },

        8: { x: 0, y: 0, z: 0 },

        9: { x: 0, y: 0, z: 0 },

        10: { x: 0, y: 0, z: 0 },

        11: { x: 0, y: 0, z: 0 },

        12: { x: 0, y: 0, z: 0 },

        13: { x: 0, y: 0, z: 0 },

        14: { x: 0, y: 0, z: 0 },

        15: { x: 0, y: 0, z: 0 },

        16: { x: 0, y: 0, z: 0 },

        17: { x: 0, y: 0, z: 0 },

        18: { x: 0, y: 0, z: 0 },

        19: { x: 0, y: 0, z: 0 },

        20: { x: 0, y: 0, z: 0 }

    }

};


// ============================================================
// ELEMENTOS
// ============================================================

const container =
    document.getElementById("dado3d");

const resultadoElemento =
    document.getElementById("resultado");

const totalElemento =
    document.getElementById("total");

const dadoAtualElemento =
    document.getElementById("dadoAtual");

const botoesDados =
    document.querySelectorAll(".dado-btn");

const botaoResetar =
    document.getElementById("resetar");

const botaoTelaCheia =
    document.getElementById("telaCheia");


// ============================================================
// VARIÁVEIS
// ============================================================

let dadoSelecionado = 6;

let resultado = null;

let total = 0;

let dado3D = null;

let rolando = false;

let animacaoRolagem = null;

let carregamentoId = 0;


// ============================================================
// MENSAGEM DE ERRO
// ============================================================

function mensagemErro(texto) {

    console.error(texto);

    if (dadoAtualElemento) {

        dadoAtualElemento.textContent =
            texto;

    }

}


// ============================================================
// TELA CHEIA
// ============================================================

if (botaoTelaCheia) {

    botaoTelaCheia.addEventListener(
        "click",
        async () => {

            try {

                if (
                    !document.fullscreenElement
                ) {

                    if (
                        !document
                            .documentElement
                            .requestFullscreen
                    ) {

                        throw new Error(
                            "Tela cheia não é suportada."
                        );

                    }

                    await document
                        .documentElement
                        .requestFullscreen();

                } else {

                    await document
                        .exitFullscreen();

                }

            } catch (erro) {

                console.error(
                    "Tela cheia:",
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


// ============================================================
// VERIFICAR CONTAINER
// ============================================================

if (!container) {

    throw new Error(
        'Elemento #dado3d não encontrado.'
    );

}


// ============================================================
// THREE.JS
// ============================================================

let cena;

let camera;

let renderizador;

let loader;

let textureLoader;


try {

    cena =
        new THREE.Scene();


    // --------------------------------------------------------
    // CÂMERA
    // --------------------------------------------------------

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


    camera.lookAt(
        0,
        0,
        0
    );


    // --------------------------------------------------------
    // RENDERIZADOR
    // --------------------------------------------------------

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


    // ========================================================
    // ILUMINAÇÃO
    // ========================================================

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


    // ========================================================
    // CHÃO
    // ========================================================

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


    // ========================================================
    // LOADERS
    // ========================================================

    loader =
        new ColladaLoader();


    textureLoader =
        new THREE.TextureLoader();


} catch (erro) {

    console.error(
        "Erro ao iniciar 3D:",
        erro
    );

    mensagemErro(
        "ERRO NO 3D"
    );

}


// ============================================================
// CAMINHO DO MODELO
// ============================================================

function caminhoModelo(lados) {

    return `Dice_models/d${lados}.dae`;

}


// ============================================================
// CAMINHO DA TEXTURA
// ============================================================

function caminhoTextura(lados) {

    return `Maps_numbered/d${lados}_Numbers.png`;

}


// ============================================================
// CONVERTER GRAUS PARA RADIANOS
// ============================================================

function grausParaRadiano(graus) {

    return graus *
        Math.PI /
        180;

}


// ============================================================
// PEGAR ROTAÇÃO FINAL DA FACE
// ============================================================

function obterRotacaoFace(
    lados,
    numero
) {

    const ajuste =
        AJUSTES_FACES[lados]?.[numero];


    if (!ajuste) {

        return {

            x: grausParaRadiano(
                ROTACAO_BASE_GRAUS.x
            ),

            y: grausParaRadiano(
                ROTACAO_BASE_GRAUS.y
            ),

            z: grausParaRadiano(
                ROTACAO_BASE_GRAUS.z
            )

        };

    }


    return {

        x: grausParaRadiano(
            ROTACAO_BASE_GRAUS.x +
            ajuste.x
        ),

        y: grausParaRadiano(
            ROTACAO_BASE_GRAUS.y +
            ajuste.y
        ),

        z: grausParaRadiano(
            ROTACAO_BASE_GRAUS.z +
            ajuste.z
        )

    };

}


// ============================================================
// REMOVER DADO
// ============================================================

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
        (objeto) => {

            if (!objeto.isMesh) {

                return;

            }


            if (objeto.geometry) {

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


    dado3D =
        null;

}


// ============================================================
// CENTRALIZAR E AJUSTAR TAMANHO
// ============================================================

function centralizarEAjustarTamanho(
    objeto
) {

    let caixa =
        new THREE.Box3()
            .setFromObject(
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


    caixa =
        new THREE.Box3()
            .setFromObject(
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


// ============================================================
// APLICAR TEXTURA
// ============================================================

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


// ============================================================
// CARREGAR DADO
// ============================================================

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


            // ------------------------------------------------
            // ORIENTAÇÃO BASE
            // ------------------------------------------------

            dado3D.rotation.set(

                grausParaRadiano(
                    ROTACAO_BASE_GRAUS.x
                ),

                grausParaRadiano(
                    ROTACAO_BASE_GRAUS.y
                ),

                grausParaRadiano(
                    ROTACAO_BASE_GRAUS.z
                )

            );


            // ------------------------------------------------
            // TEXTURA
            // ------------------------------------------------

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


// ============================================================
// SELECIONAR DADO
// ============================================================

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


// ============================================================
// EASING
// ============================================================

function easeOutCubic(t) {

    return 1 -
        Math.pow(
            1 - t,
            3
        );

}


// ============================================================
// EASING MAIS SUAVE
// ============================================================

function easeInOutCubic(t) {

    return t < 0.5

        ? 4 * t * t * t

        : 1 -
          Math.pow(
              -2 * t + 2,
              3
          ) / 2;

}


// ============================================================
// ROLAR DADO
// ============================================================

function rolarDado() {

    if (
        rolando ||
        !dado3D
    ) {

        return;

    }


    rolando =
        true;


    // ========================================================
    // RESULTADO
    // ========================================================

    if (
        FORCAR_RESULTADO !== null &&
        FORCAR_RESULTADO >= 1 &&
        FORCAR_RESULTADO <= dadoSelecionado
    ) {

        resultado =
            FORCAR_RESULTADO;

    } else {

        resultado =
            Math.floor(

                Math.random() *
                dadoSelecionado

            ) + 1;

    }


    resultadoElemento.textContent =
        resultado;


    total +=
        resultado;


    totalElemento.textContent =
        total;


    console.log(
        `D${dadoSelecionado} → resultado ${resultado}`
    );


    // ========================================================
    // ROTAÇÃO INICIAL
    // ========================================================

    const inicioRotX =
        dado3D.rotation.x;

    const inicioRotY =
        dado3D.rotation.y;

    const inicioRotZ =
        dado3D.rotation.z;


    // ========================================================
    // VOLTAS ALEATÓRIAS
    // ========================================================

    const voltasX =
        THREE.MathUtils.randFloat(
            3.5,
            5.5
        );


    const voltasY =
        THREE.MathUtils.randFloat(
            3.5,
            5.5
        );


    const voltasZ =
        THREE.MathUtils.randFloat(
            3.5,
            5.5
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


    // ========================================================
    // POSIÇÃO
    // ========================================================

    const inicioY =
        dado3D.position.y;


    // ========================================================
    // INÍCIO DA ANIMAÇÃO
    // ========================================================

    const inicio =
        performance.now();


    function animar(agora) {

        const tempo =
            agora -
            inicio;


        const progresso =
            Math.min(

                tempo /
                DURACAO_ROLAGEM,

                1

            );


        const suavizado =
            easeOutCubic(
                progresso
            );


        // ----------------------------------------------------
        // ROTAÇÃO X
        // ----------------------------------------------------

        dado3D.rotation.x =
            THREE.MathUtils.lerp(

                inicioRotX,

                finalRotX,

                suavizado

            );


        // ----------------------------------------------------
        // ROTAÇÃO Y
        // ----------------------------------------------------

        dado3D.rotation.y =
            THREE.MathUtils.lerp(

                inicioRotY,

                finalRotY,

                suavizado

            );


        // ----------------------------------------------------
        // ROTAÇÃO Z
        // ----------------------------------------------------

        dado3D.rotation.z =
            THREE.MathUtils.lerp(

                inicioRotZ,

                finalRotZ,

                suavizado

            );


        // ----------------------------------------------------
        // PULO
        // ----------------------------------------------------

        const pulo =
            Math.sin(

                progresso *
                Math.PI

            ) * 0.65;


        dado3D.position.y =
            inicioY +
            pulo;


        if (
            progresso < 1
        ) {

            animacaoRolagem =
                requestAnimationFrame(
                    animar
                );

            return;

        }


        // ====================================================
        // ORIENTAÇÃO FINAL DA FACE
        // ====================================================

        const rotacaoFinal =
            obterRotacaoFace(

                dadoSelecionado,

                resultado

            );


        const quaternionInicio =
            dado3D.quaternion.clone();


        const quaternionAlvo =
            new THREE.Quaternion();


        const eulerAlvo =
            new THREE.Euler(

                rotacaoFinal.x,

                rotacaoFinal.y,

                rotacaoFinal.z,

                "XYZ"

            );


        quaternionAlvo.setFromEuler(
            eulerAlvo
        );


        console.log(
            "Rotação final:",
            {
                x:
                    ROTACAO_BASE_GRAUS.x +
                    AJUSTES_FACES[dadoSelecionado][resultado].x,

                y:
                    ROTACAO_BASE_GRAUS.y +
                    AJUSTES_FACES[dadoSelecionado][resultado].y,

                z:
                    ROTACAO_BASE_GRAUS.z +
                    AJUSTES_FACES[dadoSelecionado][resultado].z

            }
        );


        // ====================================================
        // ASSENTAMENTO FINAL
        // ====================================================

        const inicioAssentamento =
            performance.now();


        const posicaoY =
            dado3D.position.y;


        function assentar(agora2) {

            const tempo2 =
                agora2 -
                inicioAssentamento;


            const progresso2 =
                Math.min(

                    tempo2 /
                    TEMPO_ASSENTAR,

                    1

                );


            const suavizado2 =
                easeInOutCubic(
                    progresso2
                );


            // -----------------------------------------------
            // GIRA PARA A FACE CORRETA
            // -----------------------------------------------

            dado3D.quaternion.slerpQuaternions(

                quaternionInicio,

                quaternionAlvo,

                suavizado2

            );


            // -----------------------------------------------
            // DESCE ATÉ O CHÃO
            // -----------------------------------------------

            dado3D.position.y =
                THREE.MathUtils.lerp(

                    posicaoY,

                    0,

                    easeOutCubic(
                        progresso2
                    )

                );


            if (
                progresso2 < 1
            ) {

                animacaoRolagem =
                    requestAnimationFrame(
                        assentar
                    );

                return;

            }


            // =================================================
            // FINAL
            // =================================================

            dado3D.quaternion.copy(
                quaternionAlvo
            );


            dado3D.position.y =
                0;


            rolando =
                false;


            animacaoRolagem =
                null;

        }


        animacaoRolagem =
            requestAnimationFrame(
                assentar
            );

    }


    animacaoRolagem =
        requestAnimationFrame(
            animar
        );

}


// ============================================================
// BOTÕES DOS DADOS
// ============================================================

botoesDados.forEach(
    (botao) => {

        botao.addEventListener(
            "click",
            () => {

                if (rolando) {

                    return;

                }


                const lados =
                    Number(
                        botao.dataset.dado
                    );


                selecionarDado(
                    lados
                );

            }
        );

    }
);


// ============================================================
// TOQUE NO DADO
// ============================================================

container.addEventListener(
    "pointerdown",
    (evento) => {

        evento.preventDefault();


        if (rolando) {

            return;

        }


        rolarDado();

    }
);


// ============================================================
// RESET
// ============================================================

if (botaoResetar) {

    botaoResetar.addEventListener(
        "click",
        () => {

            if (rolando) {

                return;

            }


            total =
                0;


            resultado =
                null;


            totalElemento.textContent =
                "0";


            resultadoElemento.textContent =
                "-";


            if (dado3D) {

                dado3D.position.set(
                    0,
                    0,
                    0
                );


                dado3D.rotation.set(

                    grausParaRadiano(
                        ROTACAO_BASE_GRAUS.x
                    ),

                    grausParaRadiano(
                        ROTACAO_BASE_GRAUS.y
                    ),

                    grausParaRadiano(
                        ROTACAO_BASE_GRAUS.z
                    )

                );

            }


            selecionarDado(
                dadoSelecionado
            );

        }
    );

}


// ============================================================
// REDIMENSIONAMENTO
// ============================================================

function redimensionar() {

    if (
        !container ||
        !camera ||
        !renderizador
    ) {

        return;

    }


    const largura =
        container.clientWidth;


    const altura =
        container.clientHeight;


    if (
        largura === 0 ||
        altura === 0
    ) {

        return;

    }


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


window.addEventListener(
    "resize",
    redimensionar
);


// ============================================================
// LOOP
// ============================================================

function renderizar() {

    requestAnimationFrame(
        renderizar
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


// ============================================================
// INICIALIZAÇÃO
// ============================================================

redimensionar();


// D6 começa selecionado

botoesDados.forEach(
    (botao) => {

        botao.classList.toggle(

            "selecionado",

            Number(
                botao.dataset.dado
            ) === 6

        );

    }
);


carregarDado(
    6
);


renderizar();
