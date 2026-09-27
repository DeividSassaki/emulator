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
   ARQUIVO DE CONFIGURAÇÃO
========================================================= */

/*
   A posição, rotação e tamanho do modelo
   ficam neste arquivo.
*/

const AR_CONFIG =
    "./marcadores/zelda/config.json";


/* =========================================================
   EIXO DE ROTAÇÃO POR TOQUE
========================================================= */

/*
   "x" = rotação no eixo X
   "y" = rotação no eixo Y
   "z" = rotação no eixo Z

   Começando em X.
*/

const EIXO_ROTACAO = "x";


/*
   Sensibilidade da rotação por toque.
*/

const VELOCIDADE_ROTACAO = 0.01;


/* =========================================================
   CONFIGURAÇÃO PADRÃO
========================================================= */

const CONFIG_PADRAO = {

    position: {

        x: 0,
        y: 0,
        z: 0

    },

    rotation: {

        x: 0,
        y: 0,
        z: 0

    },

    scale: 1

};


/* =========================================================
   CONFIGURAÇÃO CARREGADA
========================================================= */

let configuracaoCarregada =
    CONFIG_PADRAO;


/* =========================================================
   CARREGAR CONFIG.JSON
========================================================= */

async function carregarConfiguracao() {

    try {

        const resposta =
            await fetch(
                AR_CONFIG,
                {
                    cache: "no-store"
                }
            );


        if (!resposta.ok) {

            throw new Error(
                "Não foi possível carregar o config.json."
            );

        }


        configuracaoCarregada =
            await resposta.json();


        console.log(
            "Configuração carregada:",
            configuracaoCarregada
        );


        /*
           Caso o modelo já tenha carregado,
           aplica imediatamente.
        */

        if (
            modelo.hasLoaded
        ) {

            aplicarConfiguracao();

        }

    } catch (erro) {

        console.error(
            "Erro ao carregar config.json:",
            erro
        );


        configuracaoCarregada =
            CONFIG_PADRAO;


        if (
            modelo.hasLoaded
        ) {

            aplicarConfiguracao();

        }

    }

}


/* =========================================================
   APLICAR CONFIGURAÇÃO AO MODELO
========================================================= */

function aplicarConfiguracao() {

    if (!modelo) {

        return;

    }


    /* =====================================================
       POSIÇÃO
    ====================================================== */

    const x =
        Number(
            configuracaoCarregada
                .position?.x
            ??
            CONFIG_PADRAO
                .position.x
        );


    const y =
        Number(
            configuracaoCarregada
                .position?.y
            ??
            CONFIG_PADRAO
                .position.y
        );


    const z =
        Number(
            configuracaoCarregada
                .position?.z
            ??
            CONFIG_PADRAO
                .position.z
        );


    modelo.setAttribute(
        "position",
        `${x} ${y} ${z}`
    );


    /* =====================================================
       ROTAÇÃO
    ====================================================== */

    const rotacaoX =
        Number(
            configuracaoCarregada
                .rotation?.x
            ??
            CONFIG_PADRAO
                .rotation.x
        );


    const rotacaoY =
        Number(
            configuracaoCarregada
                .rotation?.y
            ??
            CONFIG_PADRAO
                .rotation.y
        );


    const rotacaoZ =
        Number(
            configuracaoCarregada
                .rotation?.z
            ??
            CONFIG_PADRAO
                .rotation.z
        );


    modelo.setAttribute(
        "rotation",
        `${rotacaoX} ${rotacaoY} ${rotacaoZ}`
    );


    /* =====================================================
       ESCALA
    ====================================================== */

    const escala =
        Number(
            configuracaoCarregada.scale
            ??
            CONFIG_PADRAO.scale
        );


    modelo.setAttribute(
        "scale",
        `${escala} ${escala} ${escala}`
    );


    console.log(
        "Configuração aplicada ao modelo:"
    );

    console.log(
        "Posição:",
        x,
        y,
        z
    );

    console.log(
        "Rotação:",
        rotacaoX,
        rotacaoY,
        rotacaoZ
    );

    console.log(
        "Escala:",
        escala
    );

}


/* =========================================================
   MODELO CARREGADO
========================================================= */

modelo.addEventListener(
    "model-loaded",
    () => {

        console.log(
            "Hero of Time.glb carregado."
        );


        /*
           Só aplica a configuração depois
           que o GLB realmente terminou de carregar.
        */

        aplicarConfiguracao();

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
   MARCADOR
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

            if (
                !document.fullscreenElement
            ) {

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
   ROTAÇÃO POR TOQUE
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
           Não interfere no botão.
        */

        if (
            evento.target.closest(
                "button"
            )
        ) {

            return;

        }


        /*
           Apenas um dedo.
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


        /* =================================================
           ROTAÇÃO X
        ================================================== */

        if (
            EIXO_ROTACAO === "x"
        ) {

            modelo.object3D.rotation.x -=
                deltaX *
                VELOCIDADE_ROTACAO;

        }


        /* =================================================
           ROTAÇÃO Y
        ================================================== */

        else if (
            EIXO_ROTACAO === "y"
        ) {

            modelo.object3D.rotation.y -=
                deltaY *
                VELOCIDADE_ROTACAO;

        }


        /* =================================================
           ROTAÇÃO Z
        ================================================== */

        else if (
            EIXO_ROTACAO === "z"
        ) {

            modelo.object3D.rotation.z -=
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


/* =========================================================
   INICIA CONFIGURAÇÃO
========================================================= */

carregarConfiguracao();
