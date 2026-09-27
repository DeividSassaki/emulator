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
   AJUSTE DO MODELO
========================================================= */

AFRAME.registerComponent("fit-model", {

    schema: {

        tamanho: {
            type: "number",
            default: 2
        }

    },

    init() {

        this.el.addEventListener(
            "model-loaded",
            () => {

                console.log(
                    "Hero of Time.glb carregado."
                );


                const THREE =
                    AFRAME.THREE;


                const object =
                    this.el.getObject3D("mesh");


                if (!object) {

                    console.error(
                        "Modelo carregado, mas o mesh não foi encontrado."
                    );

                    mensagem.textContent =
                        "Erro ao carregar o modelo.";

                    return;

                }


                /* =============================================
                   TAMANHO ORIGINAL
                ============================================= */

                const caixa =
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


                if (maior <= 0) {

                    console.error(
                        "Tamanho inválido do modelo."
                    );

                    return;

                }


                /* =============================================
                   DEFINE TAMANHO
                ============================================= */

                const escala =
                    this.data.tamanho / maior;


                object.scale.setScalar(
                    escala
                );


                object.updateMatrixWorld(
                    true
                );


                /* =============================================
                   CENTRALIZA
                ============================================= */

                const novaCaixa =
                    new THREE.Box3()
                        .setFromObject(object);


                const centro =
                    novaCaixa.getCenter(
                        new THREE.Vector3()
                    );


                object.position.x -=
                    centro.x;

                object.position.y -=
                    centro.y;

                object.position.z -=
                    centro.z;


                console.log(
                    "Modelo ajustado. Tamanho:",
                    this.data.tamanho
                );

            }
        );

    }

});


/* =========================================================
   SISTEMA MINDAR
========================================================= */

let arSystem = null;


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
   INICIAR CÂMERA
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

        mensagem.textContent =
            "✅ Marcador encontrado!";


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
           DOIS DEDOS = ZOOM
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
                        0.2,
                        Math.min(
                            4,
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
           UM DEDO = ROTAÇÃO SOMENTE NO EIXO X
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


            /* Limite da rotação */

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


        if (toques.size < 2) {

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
   DISTÂNCIA ENTRE OS DEDOS
========================================================= */

function distanciaEntre(a, b) {

    return Math.hypot(
        b.x - a.x,
        b.y - a.y
    );

}
