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

const target =
    document.getElementById("targetZelda");


/* =========================================================
   CONFIGURAÇÃO
========================================================= */

const AR_CONFIG =
    "./marcadores/zelda/config.json";


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

    pivot: {
        x: 0,
        y: 0,
        z: 0
    },

    pivotRotation: {
        x: 0,
        y: 0,
        z: 0
    },

    audio: null

};


let configuracaoCarregada =
    CONFIG_PADRAO;


/* =========================================================
   ROTAÇÃO PELO DEDO
========================================================= */

/*
   O dedo movimenta horizontalmente.

   Esse movimento gira o PIVOT no eixo X.
*/

const EIXO_ROTACAO = "x";


const VELOCIDADE_ROTACAO =
    0.01;


/* =========================================================
   ÁUDIO
========================================================= */

let audio = null;

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
                "Não foi possível carregar config.json."
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

    if (!modelo || !pivot) {

        console.error(
            "Modelo ou pivot não encontrado."
        );

        return;

    }


    /* =====================================================
       VALORES DO CONFIG
    ===================================================== */

    const position =
        configuracaoCarregada.position
        || CONFIG_PADRAO.position;


    const rotation =
        configuracaoCarregada.rotation
        || CONFIG_PADRAO.rotation;


    const pivotPosition =
        configuracaoCarregada.pivot
        || CONFIG_PADRAO.pivot;


    const pivotRotation =
        configuracaoCarregada.pivotRotation
        || CONFIG_PADRAO.pivotRotation;


    const escala =
        Number(
            configuracaoCarregada.scale
            ??
            CONFIG_PADRAO.scale
        );


    /* =====================================================
       POSIÇÃO DO PIVOT
    ===================================================== */

    pivot.object3D.position.set(

        Number(pivotPosition.x) || 0,

        Number(pivotPosition.y) || 0,

        Number(pivotPosition.z) || 0

    );


    /* =====================================================
       ROTAÇÃO INICIAL DO PIVOT
    ===================================================== */

    pivot.object3D.rotation.set(

        THREE.MathUtils.degToRad(
            Number(pivotRotation.x) || 0
        ),

        THREE.MathUtils.degToRad(
            Number(pivotRotation.y) || 0
        ),

        THREE.MathUtils.degToRad(
            Number(pivotRotation.z) || 0
        )

    );


    /* =====================================================
       POSIÇÃO DO MODELO

       O modelo precisa ficar na posição salva no
       config.json.

       Como ele agora está DENTRO do pivot, precisamos
       transformar a posição para o espaço local do pivot.
    ===================================================== */

    const posicaoDesejada =
        new THREE.Vector3(

            Number(position.x) || 0,

            Number(position.y) || 0,

            Number(position.z) || 0

        );


    const posicaoPivot =
        new THREE.Vector3(

            Number(pivotPosition.x) || 0,

            Number(pivotPosition.y) || 0,

            Number(pivotPosition.z) || 0

        );


    const rotacaoPivot =
        new THREE.Quaternion();


    pivot.object3D.getWorldQuaternion(
        rotacaoPivot
    );


    /*
       Como o pivot está diretamente dentro do
       marcador, podemos usar sua rotação para
       transformar a posição para o espaço local.
    */

    const posicaoLocal =
        posicaoDesejada
            .sub(posicaoPivot)
            .applyQuaternion(
                rotacaoPivot.clone().invert()
            );


    modelo.object3D.position.copy(
        posicaoLocal
    );


    /* =====================================================
       ROTAÇÃO DO OBJETO

       Essa é a rotação própria do modelo.

       Ela NÃO é a rotação do pivot.
    ===================================================== */

    modelo.object3D.rotation.set(

        THREE.MathUtils.degToRad(
            Number(rotation.x) || 0
        ),

        THREE.MathUtils.degToRad(
            Number(rotation.y) || 0
        ),

        THREE.MathUtils.degToRad(
            Number(rotation.z) || 0
        )

    );


    /* =====================================================
       ESCALA
    ===================================================== */

    modelo.object3D.scale.set(

        escala,
        escala,
        escala

    );

}


/* =========================================================
   ÁUDIO
========================================================= */

function prepararAudio() {

    if (
        !configuracaoCarregada.audio
    ) {

        console.log(
            "Nenhum áudio configurado."
        );

        return;

    }


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


    audio.preload =
        "auto";


    console.log(
        "Áudio preparado:",
        caminhoAudio
    );

}


/* =========================================================
   DESBLOQUEAR ÁUDIO
========================================================= */

async function desbloquearAudio() {

    if (
        !audio ||
        audioPreparado
    ) {

        return;

    }


    try {

        await audio.play();

        audio.pause();

        audio.currentTime = 0;

        audioPreparado = true;


    } catch (erro) {

        console.log(
            "Áudio ainda bloqueado.",
            erro
        );

    }

}


document.addEventListener(
    "pointerdown",
    () => {

        desbloquearAudio();

    },
    {
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

        if (audio.ended) {

            audio.currentTime = 0;

        }


        await audio.play();


    } catch (erro) {

        console.log(
            "Navegador bloqueou o áudio.",
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


    audio.pause();

}


/* =========================================================
   MODELO CARREGADO
========================================================= */

modelo.addEventListener(
    "model-loaded",
    () => {

        console.log(
            "Modelo carregado."
        );


        aplicarConfiguracao();

    }
);


/* =========================================================
   ERRO DO MODELO
========================================================= */

modelo.addEventListener(
    "model-error",
    (evento) => {

        console.error(
            "Erro ao carregar modelo:",
            evento
        );

    }
);


/* =========================================================
   MARCADOR ENCONTRADO
========================================================= */

target.addEventListener(
    "targetFound",
    () => {

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

        console.log(
            "Marcador perdido."
        );


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

                await document
                    .documentElement
                    .requestFullscreen();


            } else {

                await document
                    .exitFullscreen();

            }

        } catch (erro) {

            console.error(
                "Erro na tela cheia:",
                erro
            );

        }

    }
);


/* =========================================================
   ROTAÇÃO PELO DEDO
========================================================= */

let toqueAtivo =
    false;


let ultimoX =
    0;


/* =========================================================
   TOUCH START
========================================================= */

document.addEventListener(
    "touchstart",
    (evento) => {

        /*
           Não começa a rotação quando o dedo
           estiver sobre o botão de tela cheia.
        */

        if (
            evento.target.closest("button")
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


        toqueAtivo =
            true;


        ultimoX =
            toque.clientX;


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


        /*
           O DEDO GIRA O PIVOT.

           Portanto o modelo inteiro acompanha
           o movimento ao redor do pivot.
        */

        if (
            EIXO_ROTACAO === "x"
        ) {

            pivot.object3D.rotation.x -=
                deltaX *
                VELOCIDADE_ROTACAO;

        }


        ultimoX =
            toque.clientX;


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

        toqueAtivo =
            false;

    }
);


/* =========================================================
   TOUCH CANCEL
========================================================= */

document.addEventListener(
    "touchcancel",
    () => {

        toqueAtivo =
            false;

    }
);


/* =========================================================
   INICIAR
========================================================= */

carregarConfiguracao();