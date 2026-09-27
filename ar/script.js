/* =========================================================
   ELEMENTOS
========================================================= */

const scene =
    document.getElementById("scene");

const botaoFullscreen =
    document.getElementById("fullscreen");

const modelo =
    document.getElementById("heroModelObject");


/* =========================================================
   CONFIGURAÇÃO DA ROTAÇÃO
========================================================= */

/*
   Escolha o eixo que será usado para girar o modelo:

   "x" = frente / trás
   "y" = esquerda / direita
   "z" = inclinação lateral

   Começando em X, como você pediu.
*/

const EIXO_ROTACAO = "x";


/*
   Sensibilidade da rotação.
*/

const VELOCIDADE_ROTACAO = 0.01;


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


/* =========================================================
   CONTROLE POR TOQUE
========================================================= */

let toqueAtivo = false;

let ultimoX = 0;

let ultimoY = 0;


/* =========================================================
   TOUCH START
========================================================= */

document.addEventListener(
    "touchstart",
    (evento) => {

        /*
           Não interfere no botão de tela cheia.
        */

        if (
            evento.target.closest(
                "button"
            )
        ) {

            return;

        }


        /*
           Usamos somente um dedo para rotação.
        */

        if (
            evento.touches.length !== 1
        ) {

            return;

        }


        const toque =
            evento.touches[0];


        toqueAtivo = true;


        ultimoX =
            toque.clientX;

        ultimoY =
            toque.clientY;


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

        /*
           Somente um dedo.
        */

        if (
            !toqueAtivo ||
            evento.touches.length !== 1
        ) {

            return;

        }


        const toque =
            evento.touches[0];


        const deltaX =
            toque.clientX -
            ultimoX;


        const deltaY =
            toque.clientY -
            ultimoY;


        /*
           Dependendo do eixo escolhido,
           usamos o movimento apropriado.
        */

        if (
            EIXO_ROTACAO === "x"
        ) {

            modelo.object3D.rotation.x +=
                deltaY *
                VELOCIDADE_ROTACAO;

        }


        else if (
            EIXO_ROTACAO === "y"
        ) {

            modelo.object3D.rotation.y +=
                deltaX *
                VELOCIDADE_ROTACAO;

        }


        else if (
            EIXO_ROTACAO === "z"
        ) {

            modelo.object3D.rotation.z +=
                deltaX *
                VELOCIDADE_ROTACAO;

        }


        ultimoX =
            toque.clientX;

        ultimoY =
            toque.clientY;


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
    () => {

        toqueAtivo = false;

    }
);


/* =========================================================
   TOUCH CANCEL
========================================================= */

document.addEventListener(
    "touchcancel",
    () => {

        toqueAtivo = false;

    }
);
