const target =
    document.getElementById("targetZelda");

const pivotAvo =
    document.getElementById("pivotAvo");

const pivotPai =
    document.getElementById("pivotPai");

const objeto =
    document.getElementById("objectEntity");

const modelo =
    document.getElementById("heroModelObject");

const audio =
    document.getElementById("arAudio");

const fullscreenButton =
    document.getElementById("fullscreenButton");


const parametros =
    new URLSearchParams(window.location.search);

const pasta =
    parametros.get("pasta") || "zelda";

const CONFIG_URL =
    `./marcadores/${pasta}/config.json`;


const VELOCIDADE_ROTACAO =
    0.01;


let config = null;

let marcadorVisivel =
    false;

let arrastando =
    false;

let ultimoX =
    0;


/* ============================================================
   FUNÇÕES
============================================================ */


function numero(valor) {

    const n =
        Number(valor);

    return Number.isFinite(n)
        ? n
        : 0;

}


function vetorZero() {

    return {
        x: 0,
        y: 0,
        z: 0
    };

}


/* ============================================================
   APLICAR CONFIGURAÇÃO
============================================================ */


function aplicarConfiguracao() {

    if (!config) {
        return;
    }


    /* --------------------------------------------------------
       PIVOT AVÔ
    -------------------------------------------------------- */

    const avoPosition =
        config.pivotAvo?.position ||
        vetorZero();

    const avoRotation =
        config.pivotAvo?.rotation ||
        vetorZero();


    pivotAvo.object3D.position.set(

        numero(avoPosition.x),

        numero(avoPosition.y),

        numero(avoPosition.z)

    );


    pivotAvo.object3D.rotation.set(

        THREE.MathUtils.degToRad(
            numero(avoRotation.x)
        ),

        THREE.MathUtils.degToRad(
            numero(avoRotation.y)
        ),

        THREE.MathUtils.degToRad(
            numero(avoRotation.z)
        )

    );


    /* --------------------------------------------------------
       PIVOT PAI
    -------------------------------------------------------- */

    const paiPosition =
        config.pivotPai?.position ||
        vetorZero();

    const paiRotation =
        config.pivotPai?.rotation ||
        vetorZero();


    pivotPai.object3D.position.set(

        numero(paiPosition.x),

        numero(paiPosition.y),

        numero(paiPosition.z)

    );


    pivotPai.object3D.rotation.set(

        THREE.MathUtils.degToRad(
            numero(paiRotation.x)
        ),

        THREE.MathUtils.degToRad(
            numero(paiRotation.y)
        ),

        THREE.MathUtils.degToRad(
            numero(paiRotation.z)
        )

    );


    /* --------------------------------------------------------
       OBJETO
    -------------------------------------------------------- */

    const objectPosition =
        config.position ||
        vetorZero();

    const objectRotation =
        config.rotation ||
        vetorZero();


    objeto.object3D.position.set(

        numero(objectPosition.x),

        numero(objectPosition.y),

        numero(objectPosition.z)

    );


    objeto.object3D.rotation.set(

        THREE.MathUtils.degToRad(
            numero(objectRotation.x)
        ),

        THREE.MathUtils.degToRad(
            numero(objectRotation.y)
        ),

        THREE.MathUtils.degToRad(
            numero(objectRotation.z)
        )

    );


    /* --------------------------------------------------------
       ESCALA
    -------------------------------------------------------- */

    const escala =
        Number(config.scale);

    const escalaFinal =
        Number.isFinite(escala)
            ? escala
            : 1;


    objeto.object3D.scale.set(

        escalaFinal,
        escalaFinal,
        escalaFinal

    );


    /* --------------------------------------------------------
       ÁUDIO
    -------------------------------------------------------- */

    if (config.audio) {

        audio.src =
            `./marcadores/${pasta}/${config.audio}`;

        audio.preload =
            "auto";

        audio.load();

    }


    console.log(
        "AR: configuração aplicada ao marcador"
    );

}


/* ============================================================
   CARREGAR CONFIGURAÇÃO
============================================================ */


async function carregarConfig() {

    try {

        const resposta =
            await fetch(
                `${CONFIG_URL}?${Date.now()}`
            );


        if (!resposta.ok) {

            throw new Error(
                "config.json não encontrado"
            );

        }


        config =
            await resposta.json();


        console.log(
            "AR: config.json carregado"
        );


    } catch (erro) {

        console.error(
            "Erro ao carregar config.json:",
            erro
        );

    }

}


/* ============================================================
   MARCADOR ENCONTRADO
============================================================ */


target.addEventListener(
    "targetFound",
    () => {

        marcadorVisivel =
            true;


        console.log(
            "AR: marcador encontrado"
        );


        /*
         * A configuração é aplicada AQUI.
         *
         * Isso permite que cada marcador tenha
         * sua própria posição, rotação e pivots.
         */

        aplicarConfiguracao();


        tocarAudio();

    }
);


/* ============================================================
   MARCADOR PERDIDO
============================================================ */


target.addEventListener(
    "targetLost",
    () => {

        marcadorVisivel =
            false;


        arrastando =
            false;


        console.log(
            "AR: marcador perdido"
        );

    }
);


/* ============================================================
   ÁUDIO
============================================================ */


function tocarAudio() {

    if (!audio.src) {

        console.log(
            "AR: nenhum áudio configurado"
        );

        return;

    }


    audio.play()

        .then(() => {

            console.log(
                "AR: áudio reproduzindo"
            );

        })

        .catch(() => {

            console.log(
                "AR: áudio aguardando interação"
            );

        });

}


/* ============================================================
   TOQUE PARA LIBERAR ÁUDIO
============================================================ */


document.addEventListener(

    "touchstart",

    () => {

        if (marcadorVisivel) {

            tocarAudio();

        }

    },

    {
        passive: true,
        once: false
    }

);


/* ============================================================
   INÍCIO DO ARRASTO
============================================================ */


document.addEventListener(

    "touchstart",

    evento => {

        if (!marcadorVisivel) {
            return;
        }


        if (
            evento.touches.length !== 1
        ) {

            return;

        }


        arrastando =
            true;


        ultimoX =
            evento.touches[0].clientX;

    },

    {
        passive: true,
        capture: true
    }

);


/* ============================================================
   ARRASTAR

   O PIVOT PAI GIRA DIRETAMENTE NO EIXO Y.
============================================================ */


document.addEventListener(

    "touchmove",

    evento => {

        if (
            !marcadorVisivel ||
            !arrastando ||
            evento.touches.length !== 1
        ) {

            return;

        }


        const atualX =
            evento.touches[0].clientX;


        const deltaX =
            atualX - ultimoX;


        ultimoX =
            atualX;


        const angulo =
            deltaX *
            VELOCIDADE_ROTACAO;


        /*
         * Agora o giro acontece diretamente
         * no Pivot Pai.
         *
         * O GLB está dentro dele.
         */

        pivotPai.object3D.rotation.y +=
            angulo;

    },

    {
        passive: true,
        capture: true
    }

);


/* ============================================================
   FIM DO ARRASTO
============================================================ */


document.addEventListener(

    "touchend",

    () => {

        arrastando =
            false;

    },

    {
        passive: true,
        capture: true
    }

);


document.addEventListener(

    "touchcancel",

    () => {

        arrastando =
            false;

    },

    {
        passive: true,
        capture: true
    }

);


/* ============================================================
   FULLSCREEN
============================================================ */


if (fullscreenButton) {

    fullscreenButton.addEventListener(

        "click",

        async evento => {

            evento.stopPropagation();


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
                    "Erro no fullscreen:",
                    erro
                );

            }

        }

    );

}


/* ============================================================
   INÍCIO
============================================================ */


carregarConfig();