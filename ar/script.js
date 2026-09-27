/* =========================================================
   ELEMENTOS
========================================================= */

const scene = document.getElementById("scene");

const botaoIniciar =
    document.getElementById("iniciar");

const botaoFullscreen =
    document.getElementById("fullscreen");

const mensagem =
    document.getElementById("mensagem");

const modelo =
    document.getElementById("heroModelObject");


/* =========================================================
   AJUSTE AUTOMÁTICO DO MODELO
========================================================= */

AFRAME.registerComponent("fit-model", {

    schema: {
        tamanho: {
            type: "number",
            default: 0.8
        }
    },

    init() {

        this.el.addEventListener(
            "model-loaded",
            () => {

                const object =
                    this.el.getObject3D("mesh");

                if (!object) {
                    return;
                }


                const THREE =
                    AFRAME.THREE;


                /* -----------------------------------------
                   CALCULA TAMANHO
                ----------------------------------------- */

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
                    return;
                }


                /* -----------------------------------------
                   NORMALIZA TAMANHO
                ----------------------------------------- */

                const escala =
                    this.data.tamanho / maior;


                object.scale.setScalar(
                    escala
                );


                /* -----------------------------------------
                   CENTRALIZA
                ----------------------------------------- */

                const centro =
                    caixa.getCenter(
                        new THREE.Vector3()
                    );


                object.position.sub(
                    centro
                );


                console.log(
                    "Modelo carregado e ajustado."
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
   QUANDO A CENA ESTIVER PRONTA
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
   INICIAR CÂMERA / AR
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


            console.log(
                "AR iniciado."
            );

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

let ultimoX = 0;

let ultimoY = 0;


/* =========================================================
   TOUCH START
========================================================= */

document.addEventListener(
    "touchstart",
    (evento) => {

        /*
           Ignora toque nos botões.
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


        if (toques.size === 1) {

            const primeiro =
                [...toques.values()][0];


            ultimoX =
                primeiro.x;

            ultimoY =
                primeiro.y;

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
                    THREE_CLAMP(
                        novaEscala,
                        0.2,
                        4
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
           UM DEDO = ROTAÇÃO
        ================================================= */

        if (toques.size === 1) {

            const toque =
                [...toques.values()][0];


            const deltaX =
                toque.x -
                ultimoX;


            const deltaY =
                toque.y -
                ultimoY;


            modelo.object3D
                .rotation
                .y +=
                deltaX * 0.01;


            modelo.object3D
                .rotation
                .x +=
                deltaY * 0.01;


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


            ultimoX =
                toque.x;

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
   DISTÂNCIA ENTRE DEDOS
========================================================= */

function distanciaEntre(a, b) {

    return Math.hypot(
        b.x - a.x,
        b.y - a.y
    );

}


/* =========================================================
   CLAMP
========================================================= */

function THREE_CLAMP(
    valor,
    minimo,
    maximo
) {

    return Math.max(
        minimo,
        Math.min(
            maximo,
            valor
        )
    );

}
