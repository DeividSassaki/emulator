import * as THREE from "https://esm.sh/three@0.186.0";

import {
    ColladaLoader
} from "https://esm.sh/three@0.186.0/examples/jsm/loaders/ColladaLoader.js?deps=three@0.186.0";


// ============================================================
// CONFIGURAÇÃO
// ============================================================

// Para calibrar outro dado:
// 4  = D4
// 6  = D6
// 8  = D8
// 10 = D10
// 12 = D12
// 20 = D20

const LADOS = 8;


// ============================================================
// ROTAÇÃO BASE
// ============================================================

const ROTACAO_BASE = {

    x: 20.05,
    y: 28.65,
    z: 2.86

};


// ============================================================
// PASSOS DOS BOTÕES
// ============================================================

// Movimento em unidades do Three.js
const PASSO_MOVIMENTO = 0.05;

// Rotação dos botões em graus
const PASSO_ROTACAO = 1;


// ============================================================
// SENSIBILIDADE DO MOUSE
// ============================================================

// Quantos graus o dado gira para cada pixel arrastado.
//
// Aumente para girar mais rápido.
// Diminua para ter mais precisão.
//
// Exemplos:
// 0.2 = bem preciso
// 0.5 = padrão
// 1.0 = bem rápido

const SENSIBILIDADE_MOUSE = 0.5;


// ============================================================
// ELEMENTOS
// ============================================================

const container =
    document.getElementById("dado3d");

const posicaoElemento =
    document.getElementById("posicao");

const rotacaoElemento =
    document.getElementById("rotacao");

const ajusteElemento =
    document.getElementById("ajuste");


// ============================================================
// THREE.JS
// ============================================================

const cena =
    new THREE.Scene();


const camera =
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


// ============================================================
// RENDERIZADOR
// ============================================================

const renderer =
    new THREE.WebGLRenderer({

        antialias: true,

        alpha: true

    });


renderer.setPixelRatio(

    Math.min(

        window.devicePixelRatio || 1,

        2

    )

);


renderer.setSize(

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


renderer.outputColorSpace =
    THREE.SRGBColorSpace;


container.appendChild(

    renderer.domElement

);


// ============================================================
// CONFIGURAÇÃO DO CANVAS PARA MOUSE/TOQUE
// ============================================================

// Evita seleção de texto e comportamentos do navegador
// enquanto estamos arrastando o dado.

renderer.domElement.style.touchAction =
    "none";

renderer.domElement.style.userSelect =
    "none";

renderer.domElement.style.webkitUserSelect =
    "none";

renderer.domElement.style.cursor =
    "grab";


// ============================================================
// ILUMINAÇÃO
// ============================================================

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


// ============================================================
// CHÃO
// ============================================================

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


cena.add(

    chao

);


// ============================================================
// LOADERS
// ============================================================

const loader =
    new ColladaLoader();


const textureLoader =
    new THREE.TextureLoader();


// ============================================================
// DADO
// ============================================================

let dado3D = null;


// ============================================================
// ESTADO DA POSIÇÃO
// ============================================================

const estado = {

    x: 0,
    y: 0,
    z: 0

};


// ============================================================
// ESTADO DA ROTAÇÃO
// ============================================================

const rotacao = {

    x: ROTACAO_BASE.x,
    y: ROTACAO_BASE.y,
    z: ROTACAO_BASE.z

};


// ============================================================
// CONVERTER GRAUS PARA RADIANOS
// ============================================================

function rad(graus) {

    return graus * Math.PI / 180;

}


// ============================================================
// CAMINHO DO MODELO
// ============================================================

function caminhoModelo() {

    return `../Dice_models/d${LADOS}.dae`;

}


function caminhoTextura() {

    return `../Maps_numbered/d${LADOS}_Numbers.png`;

}


// ============================================================
// CENTRALIZAR / ESCALAR
// ============================================================

function ajustarModelo(objeto) {

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

}


// ============================================================
// APLICAR TEXTURA
// ============================================================

function aplicarTextura(

    objeto,
    textura

) {

    textura.colorSpace =
        THREE.SRGBColorSpace;


    textura.flipY =
        true;


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


            mesh.material =
                new THREE.MeshStandardMaterial({

                    map: textura,

                    color: 0xffffff,

                    roughness: 0.38,

                    metalness: 0.04

                });

        }

    );

}


// ============================================================
// CARREGAR DADO
// ============================================================

function carregarDado() {

    loader.load(

        caminhoModelo(),

        (collada) => {

            dado3D =
                collada.scene;


            ajustarModelo(

                dado3D

            );


            dado3D.position.set(

                0,
                0,
                0

            );


            dado3D.rotation.set(

                rad(rotacao.x),
                rad(rotacao.y),
                rad(rotacao.z)

            );


            textureLoader.load(

                caminhoTextura(),

                (textura) => {

                    aplicarTextura(

                        dado3D,
                        textura

                    );


                    cena.add(

                        dado3D

                    );


                    atualizarInterface();

                },

                undefined,

                () => {

                    console.warn(

                        "Textura não encontrada."

                    );


                    cena.add(

                        dado3D

                    );


                    atualizarInterface();

                }

            );

        },

        undefined,

        (erro) => {

            console.error(

                "Erro carregando modelo:",

                erro

            );

        }

    );

}


// ============================================================
// ATUALIZAR POSIÇÃO
// ============================================================

function aplicarPosicao() {

    if (!dado3D) {

        return;

    }


    dado3D.position.x =
        estado.x;


    dado3D.position.y =
        estado.y;


    dado3D.position.z =
        estado.z;

}


// ============================================================
// ATUALIZAR ROTAÇÃO
// ============================================================

function aplicarRotacao() {

    if (!dado3D) {

        return;

    }


    dado3D.rotation.x =
        rad(
            rotacao.x
        );


    dado3D.rotation.y =
        rad(
            rotacao.y
        );


    dado3D.rotation.z =
        rad(
            rotacao.z
        );

}


// ============================================================
// ATUALIZAR INTERFACE
// ============================================================

function atualizarInterface() {

    posicaoElemento.innerHTML =

        `X = ${estado.x.toFixed(4)}<br>` +

        `Y = ${estado.y.toFixed(4)}<br>` +

        `Z = ${estado.z.toFixed(4)}`;


    rotacaoElemento.innerHTML =

        `X = ${rotacao.x.toFixed(2)}°<br>` +

        `Y = ${rotacao.y.toFixed(2)}°<br>` +

        `Z = ${rotacao.z.toFixed(2)}°`;


    const ajusteX =

        rotacao.x -
        ROTACAO_BASE.x;


    const ajusteY =

        rotacao.y -
        ROTACAO_BASE.y;


    const ajusteZ =

        rotacao.z -
        ROTACAO_BASE.z;


    ajusteElemento.innerHTML =

        `x: ${ajusteX.toFixed(2)},<br>` +

        `y: ${ajusteY.toFixed(2)},<br>` +

        `z: ${ajusteZ.toFixed(2)}`;

}


// ============================================================
// MOVIMENTAR
// ============================================================

function mover(

    eixo,
    quantidade

) {

    estado[eixo] +=
        quantidade;


    aplicarPosicao();


    atualizarInterface();

}


// ============================================================
// ROTACIONAR
// ============================================================

function girar(

    eixo,
    quantidade

) {

    rotacao[eixo] +=
        quantidade;


    aplicarRotacao();


    atualizarInterface();

}


// ============================================================
// CONTROLE POR ARRASTE DO MOUSE / TOQUE
// ============================================================

// false = não está arrastando
let arrastando =
    false;


// 0 = botão esquerdo
// 2 = botão direito
let botaoArraste =
    0;


let ultimoX =
    0;


let ultimoY =
    0;


// ------------------------------------------------------------
// COMEÇAR ARRASTE
// ------------------------------------------------------------

renderer.domElement.addEventListener(

    "pointerdown",

    (evento) => {

        // Somente botão esquerdo ou direito
        if (

            evento.button !== 0 &&
            evento.button !== 2

        ) {

            return;

        }


        arrastando =
            true;


        botaoArraste =
            evento.button;


        ultimoX =
            evento.clientX;


        ultimoY =
            evento.clientY;


        renderer.domElement.style.cursor =
            "grabbing";


        renderer.domElement.setPointerCapture(

            evento.pointerId

        );


        evento.preventDefault();

    }

);


// ------------------------------------------------------------
// ARRASTAR
// ------------------------------------------------------------

renderer.domElement.addEventListener(

    "pointermove",

    (evento) => {

        if (!arrastando) {

            return;

        }


        const deltaX =
            evento.clientX -
            ultimoX;


        const deltaY =
            evento.clientY -
            ultimoY;


        ultimoX =
            evento.clientX;


        ultimoY =
            evento.clientY;


        // ====================================================
        // BOTÃO ESQUERDO
        // ====================================================
        //
        // Horizontal = eixo Y
        // Vertical   = eixo X
        //

        if (botaoArraste === 0) {

            girar(

                "y",

                deltaX *
                SENSIBILIDADE_MOUSE

            );


            girar(

                "x",

                -deltaY *
                SENSIBILIDADE_MOUSE

            );

        }


        // ====================================================
        // BOTÃO DIREITO
        // ====================================================
        //
        // Horizontal = eixo Z
        //
        // O movimento vertical é ignorado.
        //

        if (botaoArraste === 2) {

            girar(

                "z",

                deltaX *
                SENSIBILIDADE_MOUSE

            );

        }


        evento.preventDefault();

    }

);


// ------------------------------------------------------------
// TERMINAR ARRASTE
// ------------------------------------------------------------

function terminarArraste(

    evento

) {

    if (!arrastando) {

        return;

    }


    arrastando =
        false;


    renderer.domElement.style.cursor =
        "grab";


    try {

        renderer.domElement.releasePointerCapture(

            evento.pointerId

        );

    } catch (erro) {

        // Ignora caso o pointer capture já tenha sido liberado

    }


}


// Mouse / toque liberado
renderer.domElement.addEventListener(

    "pointerup",

    terminarArraste

);


// Caso o navegador cancele o toque
renderer.domElement.addEventListener(

    "pointercancel",

    terminarArraste

);


// Caso o mouse saia da janela
window.addEventListener(

    "blur",

    () => {

        arrastando =
            false;


        renderer.domElement.style.cursor =
            "grab";

    }

);


// ------------------------------------------------------------
// DESABILITAR MENU DO BOTÃO DIREITO NO CANVAS
// ------------------------------------------------------------

renderer.domElement.addEventListener(

    "contextmenu",

    (evento) => {

        evento.preventDefault();

    }

);


// ============================================================
// CONFIGURAR BOTÕES
// ============================================================

function configurarBotao(

    id,
    funcao,
    eixo,
    passo

) {

    const botao =
        document.getElementById(id);


    if (!botao) {

        return;

    }


    // --------------------------------------------------------
    // CLIQUE ESQUERDO = +
    // --------------------------------------------------------

    botao.addEventListener(

        "click",

        () => {

            funcao(

                eixo,
                passo

            );

        }

    );


    // --------------------------------------------------------
    // CLIQUE DIREITO = -
    // --------------------------------------------------------

    botao.addEventListener(

        "contextmenu",

        (evento) => {

            evento.preventDefault();


            funcao(

                eixo,
                -passo

            );

        }

    );

}


// ============================================================
// BOTÕES DE MOVIMENTO
// ============================================================

configurarBotao(

    "mx",
    mover,
    "x",
    PASSO_MOVIMENTO

);


configurarBotao(

    "my",
    mover,
    "y",
    PASSO_MOVIMENTO

);


configurarBotao(

    "mz",
    mover,
    "z",
    PASSO_MOVIMENTO

);


// ============================================================
// BOTÕES DE ROTAÇÃO
// ============================================================

// Eles continuam funcionando.
// Assim você pode usar mouse ou botões.

configurarBotao(

    "rx",
    girar,
    "x",
    PASSO_ROTACAO

);


configurarBotao(

    "ry",
    girar,
    "y",
    PASSO_ROTACAO

);


configurarBotao(

    "rz",
    girar,
    "z",
    PASSO_ROTACAO

);


// ============================================================
// REDIMENSIONAR
// ============================================================

function redimensionar() {

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


    renderer.setSize(

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


    renderer.render(

        cena,
        camera

    );

}


// ============================================================
// INICIAR
// ============================================================

redimensionar();


carregarDado();


renderizar();
