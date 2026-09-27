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
   CONFIGURAÇÃO
========================================================= */

const AR_CONFIG =
    "./marcadores/zelda/config.json";


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
   CARREGAR CONFIGURAÇÃO
========================================================= */

async function carregarConfiguracao() {

    try {

        const resposta =
            await fetch(AR_CONFIG, {
                cache: "no-store"
            });


        if (!resposta.ok) {

            throw new Error(
                "Não foi possível carregar config.json"
            );

        }


        const config =
            await resposta.json();


        aplicarConfiguracao(config);


        console.log(
            "Configuração AR carregada:",
            config
        );

    } catch (erro) {

        console.error(
            "Erro ao carregar config.json:",
            erro
        );


        console.log(
            "Usando configuração padrão."
        );


        aplicarConfiguracao(
            CONFIG_PADRAO
        );

    }

}


/* =========================================================
   APLICAR CONFIGURAÇÃO
========================================================= */

function aplicarConfiguracao(config) {

    if (!modelo) {

        console.error(
            "Modelo não encontrado."
        );

        return;

    }


    /* =====================================================
       POSIÇÃO
    ====================================================== */

    const x =
        Number(
            config.position?.x ??
            CONFIG_PADRAO.position.x
        );

    const y =
        Number(
            config.position?.y ??
            CONFIG_PADRAO.position.y
        );

    const z =
        Number(
            config.position?.z ??
            CONFIG_PADRAO.position.z
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
            config.rotation?.x ??
            CONFIG_PADRAO.rotation.x
        );

    const rotacaoY =
        Number(
            config.rotation?.y ??
            CONFIG_PADRAO.rotation.y
        );

    const rotacaoZ =
        Number(
            config.rotation?.z ??
            CONFIG_PADRAO.rotation.z
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
            config.scale ??
            CONFIG_PADRAO.scale
        );


    modelo.setAttribute(
        "scale",
        `${escala} ${escala} ${escala}`
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

    }
);


/* =========================================================
   ERRO AO CARREGAR MODELO
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
   CARREGA CONFIGURAÇÃO
========================================================= */

carregarConfiguracao();
