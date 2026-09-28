/* =========================================================
   ELEMENTOS
========================================================= */

const modelo =
    document.getElementById("heroModelObject");

const pivot =
    document.getElementById("heroPivot");

const target =
    document.getElementById("targetZelda");

const botaoFullscreen =
    document.getElementById("fullscreen");


/* =========================================================
   CONFIG
========================================================= */

const AR_CONFIG =
    "./marcadores/zelda/config.json";


let configuracao =
    null;


/* =========================================================
   ROTAÇÃO PELO DEDO
========================================================= */

const VELOCIDADE_ROTACAO =
    0.01;


/* =========================================================
   ÁUDIO
========================================================= */

let audio = null;


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


        configuracao =
            await resposta.json();


        console.log(
            "Configuração:",
            configuracao
        );


        aplicarConfiguracao();

        prepararAudio();


    } catch (erro) {

        console.error(
            "Erro ao carregar config.json:",
            erro
        );

    }

}


/* =========================================================
   APLICAR CONFIGURAÇÃO
========================================================= */

function aplicarConfiguracao() {

    if (
        !modelo ||
        !pivot
    ) {

        console.error(
            "Pivot ou modelo não encontrado."
        );

        return;

    }


    /* =====================================================
       VALORES
    ====================================================== */

    const position =
        configuracao.position || {
            x: 0,
            y: 0,
            z: 0
        };


    const rotation =
        configuracao.rotation || {
            x: 0,
            y: 0,
            z: 0
        };


    const pivotPosition =
        configuracao.pivot || {
            x: 0,
            y: 0,
            z: 0
        };


    const pivotRotation =
        configuracao.pivotRotation || {
            x: 0,
            y: 0,
            z: 0
        };


    const scale =
        Number(
            configuracao.scale ?? 1
        );


    /* =====================================================
       PIVOT

       O pivot recebe exatamente a posição
       calibrada.
    ====================================================== */

    pivot.object3D.position.set(

        Number(pivotPosition.x) || 0,

        Number(pivotPosition.y) || 0,

        Number(pivotPosition.z) || 0

    );


    /* =====================================================
       ROTAÇÃO INICIAL DO PIVOT
    ====================================================== */

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

       O modelo está DENTRO do pivot.

       Portanto precisamos transformar a posição
       absoluta salva no config para uma posição
       relativa ao pivot.
    ====================================================== */

    const posicaoModelo =
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


    const quaternionPivot =
        new THREE.Quaternion();


    pivot.object3D.getWorldQuaternion(
        quaternionPivot
    );


    const posicaoLocal =
        posicaoModelo
            .sub(posicaoPivot)
            .applyQuaternion(
                quaternionPivot.clone().invert()
            );


    modelo.object3D.position.copy(
        posicaoLocal
    );


    /* =====================================================
       ROTAÇÃO DO PRÓPRIO OBJETO
    ====================================================== */

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
    ====================================================== */

    modelo.object3D.scale.set(

        scale,
        scale,
        scale

    );


    console.log(
        "Configuração aplicada."
    );

}


/* =========================================================
   MODELO CARREGADO
========================================================= */

modelo.addEventListener(
    "model-loaded",
    () => {

        console.log(
            "GLB carregado com sucesso."
        );


        aplicarConfiguracao();

    }
);


/* =========================================================
   ERRO NO GLB
========================================================= */

modelo.addEventListener(
    "model-error",
    (evento) => {

        console.error(
            "ERRO AO CARREGAR GLB:",
            evento
        );

    }
);


/* =========================================================
   ÁUDIO
========================================================= */

function prepararAudio() {

    if (
        !configuracao ||
        !configuracao.audio
    ) {

        return;

    }


    const caminhoAudio =
        new URL(

            configuracao.audio,

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
        "Áudio:",
        caminhoAudio
    );

}


/* =========================================================
   TOCAR ÁUDIO
========================================================= */

async function tocarAudio() {

    if (!audio) {

        return;

    }


    try {

        await audio.play();

    } catch (erro) {

        console.log(
            "Áudio bloqueado:",
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

let tocando =
    false;


let ultimoX =
    0;


/* =========================================================
   TOUCH START
========================================================= */

document.addEventListener(
    "touchstart",
    (evento) => {

        if (
            evento.target.closest("button")
        ) {

            return;

        }


        if (
            evento.touches.length !== 1
        ) {

            return;

        }


        tocando =
            true;


        ultimoX =
            evento.touches[0].clientX;


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
            !tocando ||
            evento.touches.length !== 1
        ) {

            return;

        }


        const atualX =
            evento.touches[0].clientX;


        const deltaX =
            atualX -
            ultimoX;


        /*
           O DEDO GIRA O PIVOT.

           Eixo X, conforme você pediu.
        */

        pivot.object3D.rotation.x -=
            deltaX *
            VELOCIDADE_ROTACAO;


        ultimoX =
            atualX;


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

        tocando =
            false;

    }
);


/* =========================================================
   TOUCH CANCEL
========================================================= */

document.addEventListener(
    "touchcancel",
    () => {

        tocando =
            false;

    }
);


/* =========================================================
   INICIAR
========================================================= */

carregarConfiguracao();