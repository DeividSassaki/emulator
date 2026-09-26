import * as THREE from
    "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

import { GLTFLoader } from
    "https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/loaders/GLTFLoader.js";


/* =========================================================
   ELEMENTOS DA PÁGINA
========================================================= */

const camera = document.getElementById("camera");
const botao = document.getElementById("iniciar");
const mensagem = document.getElementById("mensagem");
const canvas = document.getElementById("canvas3d");
const fullscreen = document.getElementById("fullscreen");


/* =========================================================
   MODELO
========================================================= */

const MODELO =
    "./modelos/Hero%20of%20Time%20by%20Anonymous%20-%202yiMbN3bdIe.glb";


/*
   Tamanho inicial do modelo.

   Se ficar muito grande:
   diminua para 0.8, 0.6 etc.

   Se ficar pequeno:
   aumente para 1.5, 2.0 etc.
*/

const TAMANHO_INICIAL = 1;


/* =========================================================
   THREE.JS
========================================================= */

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
});

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.outputColorSpace = THREE.SRGBColorSpace;


/* =========================================================
   CÂMERA 3D
========================================================= */

const camera3D = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.01,
    100
);

camera3D.position.set(
    0,
    0,
    5
);


/* =========================================================
   LUZES
========================================================= */

const luzAmbiente = new THREE.HemisphereLight(
    0xffffff,
    0x444444,
    2
);

scene.add(luzAmbiente);


const luzDirecional = new THREE.DirectionalLight(
    0xffffff,
    3
);

luzDirecional.position.set(
    3,
    5,
    4
);

scene.add(luzDirecional);


/* =========================================================
   GRUPO DO OBJETO
========================================================= */

const objeto = new THREE.Group();

scene.add(objeto);


/* =========================================================
   CARREGAR GLB
========================================================= */

const loader = new GLTFLoader();

loader.load(
    MODELO,

    (gltf) => {

        const modelo = gltf.scene;

        /*
           Centraliza o modelo
        */

        const caixa = new THREE.Box3()
            .setFromObject(modelo);

        const centro = caixa.getCenter(
            new THREE.Vector3()
        );

        modelo.position.sub(centro);


        /*
           Normaliza o tamanho.

           Isso evita que um modelo vindo de outro
           site fique gigantesco ou minúsculo.
        */

        const tamanho = caixa.getSize(
            new THREE.Vector3()
        );

        const maior =
            Math.max(
                tamanho.x,
                tamanho.y,
                tamanho.z
            );

        if (maior > 0) {

            const escala =
                2 / maior;

            modelo.scale.setScalar(escala);

        }


        /*
           Escala inicial
        */

        objeto.scale.setScalar(
            TAMANHO_INICIAL
        );


        /*
           Pequena posição para deixar o objeto
           centralizado na câmera
        */

        objeto.position.set(
            0,
            0,
            0
        );


        objeto.add(modelo);


        /*
           Se o modelo tiver animação,
           guardamos o mixer.
        */

        if (gltf.animations.length > 0) {

            mixer = new THREE.AnimationMixer(
                modelo
            );

            gltf.animations.forEach(
                (animacao) => {

                    mixer
                        .clipAction(animacao)
                        .play();

                }
            );

        }


        console.log(
            "Modelo carregado:",
            MODELO
        );

    },

    undefined,

    (erro) => {

        console.error(
            "Erro ao carregar o modelo:",
            erro
        );

        mensagem.innerHTML =
            "Erro ao carregar o modelo 3D.";

    }
);


/* =========================================================
   ANIMAÇÃO
========================================================= */

let mixer = null;

const clock = new THREE.Clock();


function animar() {

    requestAnimationFrame(animar);

    const delta =
        clock.getDelta();

    if (mixer) {
        mixer.update(delta);
    }

    renderer.render(
        scene,
        camera3D
    );
}


animar();


/* =========================================================
   CÂMERA DO CELULAR
========================================================= */

let stream = null;


botao.addEventListener(
    "click",
    async () => {

        try {

            mensagem.textContent =
                "Solicitando acesso à câmera...";


            stream =
                await navigator.mediaDevices.getUserMedia({

                    video: {
                        facingMode: {
                            ideal: "environment"
                        }
                    },

                    audio: false

                });


            camera.srcObject = stream;

            await camera.play();


            mensagem.textContent =
                "Câmera funcionando!";


            botao.style.display =
                "none";


        } catch (erro) {

            console.error(erro);

            mensagem.innerHTML =
                "Não foi possível abrir a câmera.<br>" +
                "<small>" +
                erro.name +
                "</small>";

            botao.textContent =
                "📷 Tentar novamente";

        }

    }
);


/* =========================================================
   TELA CHEIA
========================================================= */

fullscreen.addEventListener(
    "click",
    async () => {

        try {

            if (!document.fullscreenElement) {

                await document.documentElement
                    .requestFullscreen();

            } else {

                await document.exitFullscreen();

            }

        } catch (erro) {

            console.error(
                "Erro ao entrar em tela cheia:",
                erro
            );

        }

    }
);


/* =========================================================
   CONTROLE POR TOQUE
========================================================= */

let toques = new Map();

let distanciaInicial = 0;

let escalaInicial = TAMANHO_INICIAL;

let ultimoX = 0;
let ultimoY = 0;


/*
   GIRAR COM UM DEDO
*/

canvas.addEventListener(
    "pointerdown",
    (evento) => {

        toques.set(
            evento.pointerId,
            evento
        );

        canvas.setPointerCapture(
            evento.pointerId
        );


        if (toques.size === 1) {

            ultimoX =
                evento.clientX;

            ultimoY =
                evento.clientY;

        }


        if (toques.size === 2) {

            const pontos =
                [...toques.values()];

            distanciaInicial =
                distanciaEntre(
                    pontos[0],
                    pontos[1]
                );

            escalaInicial =
                objeto.scale.x;

        }

    }
);


/*
   MOVIMENTO
*/

canvas.addEventListener(
    "pointermove",
    (evento) => {

        if (!toques.has(
            evento.pointerId
        )) {
            return;
        }


        toques.set(
            evento.pointerId,
            evento
        );


        /*
           DOIS DEDOS = ESCALA
        */

        if (toques.size === 2) {

            const pontos =
                [...toques.values()];

            const distanciaAtual =
                distanciaEntre(
                    pontos[0],
                    pontos[1]
                );


            if (distanciaInicial > 0) {

                let novaEscala =
                    escalaInicial *
                    (
                        distanciaAtual /
                        distanciaInicial
                    );


                /*
                   Limites de tamanho
                */

                novaEscala =
                    THREE.MathUtils.clamp(
                        novaEscala,
                        0.3,
                        4
                    );


                objeto.scale.setScalar(
                    novaEscala
                );

            }

            return;
        }


        /*
           UM DEDO = GIRAR
        */

        if (toques.size === 1) {

            const deltaX =
                evento.clientX -
                ultimoX;

            const deltaY =
                evento.clientY -
                ultimoY;


            objeto.rotation.y +=
                deltaX * 0.01;

            objeto.rotation.x +=
                deltaY * 0.01;


            /*
               Limita a rotação vertical
               para não ficar invertendo
            */

            objeto.rotation.x =
                THREE.MathUtils.clamp(
                    objeto.rotation.x,
                    -Math.PI / 2,
                    Math.PI / 2
                );


            ultimoX =
                evento.clientX;

            ultimoY =
                evento.clientY;

        }

    }
);


/*
   SOLTOU O DEDO
*/

canvas.addEventListener(
    "pointerup",
    (evento) => {

        toques.delete(
            evento.pointerId
        );

    }
);


canvas.addEventListener(
    "pointercancel",
    (evento) => {

        toques.delete(
            evento.pointerId
        );

    }
);


/* =========================================================
   DISTÂNCIA ENTRE DOIS DEDOS
========================================================= */

function distanciaEntre(a, b) {

    return Math.hypot(
        b.clientX - a.clientX,
        b.clientY - a.clientY
    );

}


/* =========================================================
   REDIMENSIONAR
========================================================= */

window.addEventListener(
    "resize",
    () => {

        camera3D.aspect =
            window.innerWidth /
            window.innerHeight;

        camera3D.updateProjectionMatrix();


        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

    }
);
