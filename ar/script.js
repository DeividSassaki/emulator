/* =========================================================
   ELEMENTOS
========================================================= */

const scene =
    document.getElementById("scene");

const botaoFullscreen =
    document.getElementById("fullscreen");

const modelo =
    document.getElementById("heroModelObject");

const pivot =
    document.getElementById("heroPivot");


/* =========================================================
   ARQUIVO DE CONFIGURAÇÃO
========================================================= */

const AR_CONFIG =
    "./marcadores/zelda/config.json";


/* =========================================================
   EIXO DE ROTAÇÃO POR TOQUE
========================================================= */

/*
   "x" = rotação no eixo X
   "y" = rotação no eixo Y
   "z" = rotação no eixo Z

   O padrão agora é Y.

   O motivo é que o Y representa o eixo vertical,
   então o modelo gira como uma peça em pé sobre
   uma base, sem usar o eixo local inclinado do GLB.
*/

const EIXO_ROTACAO = "z";


/*
   Velocidade da rotação.
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

    scale: 1,

    audio: null

};


/* =========================================================
   CONFIGURAÇÃO CARREGADA
========================================================= */

let configuracaoCarregada =
    CONFIG_PADRAO;


/* =========================================================
   ÁUDIO
========================================================= */

let audio = null;

let marcadorEncontrado = false;

let audioPreparado = false;


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


        aplicarConfiguracao();

        prepararAudio();


    } catch (erro) {

        console.error(
            "Erro ao carregar config.json:",
            erro
        );


        configuracaoCarregada =
            CONFIG_PADRAO;


        aplicarConfiguracao();

    }

}


/* =========================================================
   APLICAR CONFIGURAÇÃO
========================================================= */

function aplicarConfiguracao() {

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
       ROTAÇÃO DO GLB
       
       IMPORTANTE:
       Essa rotação continua sendo aplicada somente
       ao GLB.

       O pivot não recebe essa rotação.
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

}


/* =========================================================
   PREPARAR ÁUDIO
========================================================= */

function prepararAudio() {

    /*
       Se não houver áudio no config.json,
       não faz nada.
    */

    if (
        !configuracaoCarregada.audio
    ) {

        console.log(
            "Nenhum áudio configurado."
        );

        return;

    }


    /*
       Monta o caminho do áudio relativo
       ao próprio config.json.
    */

    const caminhoAudio =
        new URL(
            configuracaoCarregada.audio,
            new URL(
                AR_CONFIG,
                window.location.href
            )
        ).href;


    audio =
        new Audio(
            caminhoAudio
        );


    /*
       Carrega o áudio antecipadamente.
    */

    audio.preload = "auto";


    /*
       Quando chegar ao fim, permite que,
       em um próximo targetFound, ele volte
       ao início.
    */

    audio.addEventListener(
        "ended",
        () => {

            console.log(
                "Áudio terminou."
            );

        }
    );


    console.log(
        "Áudio preparado:",
        caminhoAudio
    );

}


/* =========================================================
   DESBLOQUEAR ÁUDIO APÓS INTERAÇÃO
========================================================= */

async function desbloquearAudio() {

    if (
        !audio ||
        audioPreparado
    ) {

        return;

    }


    try {

        /*
           Tentamos iniciar o áudio dentro de uma
           interação do usuário e imediatamente pausamos.
        */

        await audio.play();


        audio.pause();


        audio.currentTime = 0;


        audioPreparado = true;


        console.log(
            "Áudio preparado para reprodução."
        );


    } catch (erro) {

        console.log(
            "Navegador ainda não liberou o áudio.",
            erro
        );

    }

}


/* =========================================================
   TOQUE / CLIQUE DO USUÁRIO
========================================================= */

document.addEventListener(
    "pointerdown",
    () => {

        desbloquearAudio();

    },
    {
        once: false,
        passive: true
    }
);


/* =========================================================
   TOCAR ÁUDIO
========================================================= */

async function tocarAudio() {

    if (!audio) {

        return;

    }


    try {

        /*
           Caso a música tenha terminado,
           começa novamente.
        */

        if (
            audio.ended
        ) {

            audio.currentTime = 0;

        }


        await audio.play();


        console.log(
            "Áudio reproduzindo."
        );


    } catch (erro) {

        console.log(
            "O navegador bloqueou a reprodução automática.",
            erro
        );

    }

}


/* =========================================================
   PAUSAR ÁUDIO
========================================================= */

function pausarAudio() {

    if (!audio) {

        return;

    }


    /*
       Pausa, mas NÃO reinicia.

       Quando o marcador voltar,
       a música continua do mesmo ponto.
    */

    audio.pause();


    console.log(
        "Áudio pausado."
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
   MARCADOR ENCONTRADO
========================================================= */

const target =
    document.getElementById("targetZelda");


target.addEventListener(
    "targetFound",
    () => {

        marcadorEncontrado = true;


        console.log(
            "Marcador encontrado."
        );


        tocarAudio();

    }
);


/* =========================================================
   MARCADOR PERDIDO
========================================================= */

target.addEventListener(
    "targetLost",
    () => {

        marcadorEncontrado = false;


        console.log(
            "Marcador perdido."
        );


        /*
           Pausa, mas NÃO reinicia.
           Ao encontrar novamente, continua
           do mesmo ponto.
        */

        pausarAudio();

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
           Ignora botão.
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


        /*
           Também tenta desbloquear o áudio
           através do toque.
        */

        desbloquearAudio();


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
           EIXO X

           Agora a rotação acontece no PIVOT,
           não no GLB.
        ================================================== */

        if (
            EIXO_ROTACAO === "x"
        ) {

            pivot.object3D.rotation.x -=
                deltaX *
                VELOCIDADE_ROTACAO;

        }


        /* =================================================
           EIXO Y

           Este é o eixo atualmente utilizado.

           O Y é o eixo vertical, portanto o modelo
           gira como uma peça em pé.
        ================================================== */

        else if (
            EIXO_ROTACAO === "y"
        ) {

            pivot.object3D.rotation.y -=
                deltaX *
                VELOCIDADE_ROTACAO;

        }


        /* =================================================
           EIXO Z
        ================================================== */

        else if (
            EIXO_ROTACAO === "z"
        ) {

            pivot.object3D.rotation.z -=
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
   CARREGAR CONFIGURAÇÃO
========================================================= */

carregarConfiguracao();