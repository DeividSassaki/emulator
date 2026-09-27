/* =========================================================
   ELEMENTOS
========================================================= */

const scene =
    document.getElementById("scene");

const botaoFullscreen =
    document.getElementById("fullscreen");


/* =========================================================
   MODELO
========================================================= */

const modelo =
    document.getElementById("heroModelObject");


/* =========================================================
   MODELO CARREGADO
========================================================= */

modelo.addEventListener(
    "model-loaded",
    () => {

        console.log(
            "Hero of Time.glb carregado."
        );

    }
);


/* =========================================================
   ERRO NO MODELO
========================================================= */

modelo.addEventListener(
    "model-error",
    (evento) => {

        console.error(
            "Erro ao carregar Hero of Time.glb:",
            evento
        );

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

                await document.documentElement.requestFullscreen();

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
