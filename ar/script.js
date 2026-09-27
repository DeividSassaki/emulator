/* =========================================================
   ELEMENTOS
========================================================= */

const scene =
    document.getElementById("scene");

const botaoIniciar =
    document.getElementById("iniciar");

const botaoFullscreen =
    document.getElementById("fullscreen");

const mensagem =
    document.getElementById("mensagem");

const modelo =
    document.getElementById("heroModelObject");


/* =========================================================
   CONFIGURAÇÃO DO MODELO
========================================================= */

/*
   Aumente este valor para deixar o modelo maior.

   1 = tamanho de referência
   2 = maior
   3 = ainda maior
*/

const TAMANHO_MODELO = 2;


/*
   Limites do pinch
*/

const ESCALA_MINIMA = 0.2;
const ESCALA_MAXIMA = 4;


/* =========================================================
   ESTADO
========================================================= */

let arSystem = null;

let modeloCarregado = false;

let modeloEncontrado = false;


/* =========================================================
   CARREGAMENTO DO MODELO
========================================================= */

modelo.addEventListener(
    "model-loaded",
    () => {

        console.log(
            "Hero of Time.glb carregado."
        );


        modeloCarregado = true;


        try {

            const THREE =
                AFRAME.THREE;


            const object =
                modelo.getObject3D("mesh");


            if (!object) {

                console.error(
                    "O modelo carregou, mas o mesh não foi encontrado."
                );

                mensagem.textContent =
                    "Erro: modelo sem mesh.";

                return;

            }


            /* =============================================
               DESCOBRE O TAMANHO ORIGINAL
            ============================================= */

            let caixa =
                new THREE.Box3()
                    .setFromObject(object);


            const tamanho =
                caixa.getSize(
                    new THREE.Vector3()
                );


            const maior =
                Math.max(
                    tamanho.x,
                    tamanho.y,
                    tamanho.z
                );


            console.log(
                "Tamanho original do modelo:",
                tamanho
            );


            if (maior <= 0) {

                console.error(
                    "O modelo possui tamanho inválido."
                );

                mensagem.textContent =
                    "Erro: tamanho do modelo inválido.";

                return;

            }


            /* =============================================
               DEFINE TAMANHO
            ============================================= */

            const escala =
                TAMANHO_MODELO / maior;


            object.scale.setScalar(
                escala
            );


            object.updateMatrixWorld(
                true
            );


            /* =============================================
               RECALCULA A CAIXA
            ============================================= */

            caixa =
                new THREE.Box3()
                    .setFromObject(object);


            const centro =
                caixa.getCenter(
                    new THREE.Vector3()
                );


            /* =============================================
               CENTRALIZA MODELO
            ============================================= */

            object.position.x -=
                centro.x;

            object.position.y -=
                centro.y;

            object.position.z -=
                centro.z;


            modelo.setAttribute(
                "visible",
                true
            );


            console.log(
                "Modelo ajustado. Escala:",
                escala
            );


            if (modeloEncontrado) {

                mensagem.textContent =
                    "✅ Marcador encontrado!";

            }


        } catch (erro) {

            console.error(
                "Erro ao ajustar modelo:",
                erro
            );

            mensagem.textContent =
                "Erro ao ajustar o modelo.";

        }

    }
);


/* =========================================================
   ERRO NO MODELO
========================================================= */

modelo.addEventListener(
    "model-error",
    (evento) => {

        console.error(
            "ERRO AO CARREGAR O GLB:",
            evento
        );


        mensagem.innerHTML =
            "❌ Não foi possível carregar o <b>Hero of Time.glb</b>.";

    }
);


/* =========================================================
   CENA PRONTA
========================================================= */

scene.addEventListener(
    "loaded",
    () => {

        arSystem =
            scene.systems[
                "mindar-image-system"
            ];


        console.log(
            "MindAR pronto."
        );

    }
);


/* =========================================================
   INICIAR AR
========================================================= */

botaoIniciar.addEventListener(
    "click",
    async () => {

        try {

            if (!arSystem) {

                mensagem.textContent =
                    "Preparando câmera...";

                return;

            }


            mensagem.textContent =
                "Iniciando câmera...";


            await arSystem.start();


            mensagem.innerHTML =
                "Aponte a câmera para o <b>marcador</b>.";


            botaoIniciar.style.display =
                "none";


        } catch (erro) {

            console.error(
                "Erro ao iniciar AR:",
                erro
            );


            mensagem.innerHTML =
                "Não foi possível iniciar a câmera.<br>" +
                "<small>" +
                erro.message +
                "</small>";


            botaoIniciar.textContent =
                "📷 Tentar novamente";

        }

    }
);


/* =========================================================
   MARCADOR ENCONTRADO
========================================================= */

const target =
    document.getElementById("targetZelda");


target.addEventListener(
    "targetFound",
    () => {

        modeloEncontrado = true;


        if (modeloCarregado) {

            mensagem.textContent =
                "✅ Marcador encontrado!";

        } else {

            mensagem.textContent =
                "Marcador encontrado. Carregando modelo...";

        }


        console.log(
            "Marcador encontrado."
        );

    }
);


/* =========================================================
   MARCADOR PERDIDO
========================================================= */

target.addEventListener(
    "targetLost",
    () => {

        modeloEncontrado = false;


        mensagem.textContent =
            "Aponte novamente para o marcador.";


        console.log(
            "Marcador perdido."
        );

    }
);


/* =========================================================
   TELA CHEIA
========================================================= */

botaoFullscreen.addEventListener(
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

let escalaInicial = 1;

let ultimoY = 0;


/* =========================================================
   TOUCH START
========================================================= */

document.addEventListener(
    "touchstart",
    (evento) => {

        /*
           Não interfere nos botões.
        */

        if (
            evento.target.closest(
                "button"
            )
        ) {

            return;

        }


        for (
            const toque
            of evento.changedTouches
        ) {

            toques.set(
                toque.identifier,
                {
                    x: toque.clientX,
                    y: toque.clientY
                }
            );

        }


        /* ================================================
           UM DEDO
        ================================================= */

        if (toques.size === 1) {

            const primeiro =
                [...toques.values()][0];


            ultimoY =
                primeiro.y;

        }


        /* ================================================
           DOIS DEDOS
        ================================================= */

        if (toques.size === 2) {

            const pontos =
                [...toques.values()];


            distanciaInicial =
                distanciaEntre(
                    pontos[0],
                    pontos[1]
                );


            escalaInicial =
                modelo.object3D.scale.x;

        }


        evento.preventDefault();

    },
    {
        passive: false
    }
);


/* =========================================================
   TOUCH MOVE
========================================================= */

document.addEventListener(
    "touchmove",
    (evento) => {

        if (toques.size === 0) {

            return;

        }


        for (
            const toque
            of evento.changedTouches
        ) {

            if (
                toques.has(
                    toque.identifier
                )
            ) {

                toques.set(
                    toque.identifier,
                    {
                        x: toque.clientX,
                        y: toque.clientY
                    }
                );

            }

        }


        /* ================================================
           DOIS DEDOS = ESCALA
        ================================================= */

        if (toques.size === 2) {

            const pontos =
                [...toques.values()];


            const distanciaAtual =
                distanciaEntre(
                    pontos[0],
                    pontos[1]
                );


            if (
                distanciaInicial > 0
            ) {

                let novaEscala =
                    escalaInicial *
                    (
                        distanciaAtual /
                        distanciaInicial
                    );


                novaEscala =
                    Math.max(
                        ESCALA_MINIMA,
                        Math.min(
                            ESCALA_MAXIMA,
                            novaEscala
                        )
                    );


                modelo.object3D
                    .scale
                    .setScalar(
                        novaEscala
                    );

            }


            evento.preventDefault();

            return;

        }


        /* ================================================
           UM DEDO = ROTAÇÃO SOMENTE EM X
        ================================================= */

        if (toques.size === 1) {

            const toque =
                [...toques.values()][0];


            const deltaY =
                toque.y -
                ultimoY;


            modelo.object3D
                .rotation
                .x +=
                deltaY * 0.01;


            /*
               Limita a rotação para não virar
               completamente de cabeça para baixo.
            */

            modelo.object3D
                .rotation
                .x =
                Math.max(
                    -Math.PI / 2,
                    Math.min(
                        Math.PI / 2,
                        modelo.object3D
                            .rotation
                            .x
                    )
                );


            ultimoY =
                toque.y;

        }


        evento.preventDefault();

    },
    {
        passive: false
    }
);


/* =========================================================
   TOUCH END
========================================================= */

document.addEventListener(
    "touchend",
    (evento) => {

        for (
            const toque
            of evento.changedTouches
        ) {

            toques.delete(
                toque.identifier
            );

        }


        if (
            toques.size < 2
        ) {

            distanciaInicial = 0;

        }

    }
);


/* =========================================================
   TOUCH CANCEL
========================================================= */

document.addEventListener(
    "touchcancel",
    (evento) => {

        for (
            const toque
            of evento.changedTouches
        ) {

            toques.delete(
                toque.identifier
            );

        }


        distanciaInicial = 0;

    }
);


/* =========================================================
   DISTÂNCIA ENTRE DOIS DEDOS
========================================================= */

function distanciaEntre(a, b) {

    return Math.hypot(
        b.x - a.x,
        b.y - a.y
    );

}
