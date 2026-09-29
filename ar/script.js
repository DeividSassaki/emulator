/* =========================================================
   PASTA
========================================================= */

const parametros =
    new URLSearchParams(
        window.location.search
    );


const pasta =
    parametros.get("pasta") || "zelda";


const CONFIG_URL =
    `./marcadores/${pasta}/config.json`;


/* =========================================================
   ELEMENTOS
========================================================= */

const container =
    document.getElementById(
        "ar-container"
    );


const botaoFullscreen =
    document.getElementById(
        "fullscreen"
    );


/* =========================================================
   VARIÁVEIS AR
========================================================= */

let scene = null;

let target = null;

let pivot = null;

let modelo = null;

let audio = null;

let config = null;


/* =========================================================
   ESTADO
========================================================= */

let marcadorEncontrado =
    false;


/* =========================================================
   COPIAR CONFIG
========================================================= */

function copiar(obj) {

    return JSON.parse(
        JSON.stringify(obj)
    );

}


/* =========================================================
   CAMINHO DE ARQUIVO
========================================================= */

function caminhoArquivo(nome) {

    if (!nome) {
        return "";
    }


    return `./marcadores/${pasta}/${encodeURIComponent(nome)}`;

}


/* =========================================================
   CARREGAR CONFIG
========================================================= */

async function carregarConfig() {

    try {

        console.log(
            "Carregando:",
            CONFIG_URL
        );


        const resposta =
            await fetch(
                `${CONFIG_URL}?${Date.now()}`
            );


        if (!resposta.ok) {

            throw new Error(
                `Erro HTTP ${resposta.status}`
            );

        }


        config =
            await resposta.json();


        console.log(
            "Configuração carregada:",
            config
        );


        document.title =
            config.nome || "AR";


        criarCena();


    } catch (erro) {

        console.error(
            "Erro ao carregar config.json:",
            erro
        );

    }

}


/* =========================================================
   CRIAR CENA
========================================================= */

function criarCena() {

    console.log(
        "Criando cena AR..."
    );


    /* =====================================================
       A-SCENE
    ===================================================== */

    scene =
        document.createElement(
            "a-scene"
        );


    scene.setAttribute(
        "id",
        "scene"
    );


    scene.setAttribute(
        "embedded",
        ""
    );


    scene.setAttribute(
        "color-space",
        "sRGB"
    );


    scene.setAttribute(
        "renderer",
        `
        alpha: true;
        colorManagement: true;
        physicallyCorrectLights: true;
        `
    );


    scene.setAttribute(
        "vr-mode-ui",
        "enabled: false"
    );


    scene.setAttribute(
        "device-orientation-permission-ui",
        "enabled: false"
    );


    /* =====================================================
       MINDAR

       Igual à calibração.
    ===================================================== */

    const marcador =
        config.marcador ||
        "targets.mind";


    const caminhoMarcador =
        `./marcadores/${pasta}/${marcador}`;


    scene.setAttribute(
        "mindar-image",
        `
        imageTargetSrc: ${caminhoMarcador};
        autoStart: true;
        missTolerance: 20;
        filterMinCF: 0.0001;
        filterBeta: 1000;
        uiLoading: no;
        uiError: no;
        uiScanning: no;
        `
    );


    /* =====================================================
       ASSETS
    ===================================================== */

    const assets =
        document.createElement(
            "a-assets"
        );


    const assetModelo =
        document.createElement(
            "a-asset-item"
        );


    assetModelo.setAttribute(
        "id",
        "arModel"
    );


    assetModelo.setAttribute(
        "src",
        caminhoArquivo(
            config.modelo
        )
    );


    assets.appendChild(
        assetModelo
    );


    scene.appendChild(
        assets
    );


    /* =====================================================
       CÂMERA
    ===================================================== */

    const camera =
        document.createElement(
            "a-camera"
        );


    camera.setAttribute(
        "position",
        "0 0 0"
    );


    camera.setAttribute(
        "look-controls",
        "enabled: false"
    );


    scene.appendChild(
        camera
    );


    /* =====================================================
       TARGET
    ===================================================== */

    target =
        document.createElement(
            "a-entity"
        );


    target.setAttribute(
        "id",
        "arTarget"
    );


    target.setAttribute(
        "mindar-image-target",
        "targetIndex: 0"
    );


    /* =====================================================
       PIVÔ

       NÃO POSSUI NENHUM OBJETO VISUAL.

       Ele existe somente para controlar
       a rotação do modelo.
    ===================================================== */

    pivot =
        document.createElement(
            "a-entity"
        );


    pivot.setAttribute(
        "id",
        "arPivot"
    );


    /* =====================================================
       GLB
    ===================================================== */

    modelo =
        document.createElement(
            "a-gltf-model"
        );


    modelo.setAttribute(
        "id",
        "arModelObject"
    );


    modelo.setAttribute(
        "src",
        "#arModel"
    );


    modelo.setAttribute(
        "visible",
        "false"
    );


    /* =====================================================
       PIVÔ → MODELO
    ===================================================== */

    pivot.appendChild(
        modelo
    );


    target.appendChild(
        pivot
    );


    scene.appendChild(
        target
    );


    /* =====================================================
       LUZ AMBIENTE
    ===================================================== */

    const luzAmbiente =
        document.createElement(
            "a-light"
        );


    luzAmbiente.setAttribute(
        "type",
        "ambient"
    );


    luzAmbiente.setAttribute(
        "intensity",
        "2"
    );


    scene.appendChild(
        luzAmbiente
    );


    /* =====================================================
       LUZ DIRECIONAL
    ===================================================== */

    const luzDirecional =
        document.createElement(
            "a-light"
        );


    luzDirecional.setAttribute(
        "type",
        "directional"
    );


    luzDirecional.setAttribute(
        "intensity",
        "3"
    );


    luzDirecional.setAttribute(
        "position",
        "1 3 2"
    );


    scene.appendChild(
        luzDirecional
    );


    /* =====================================================
       COLOCAR CENA
    ===================================================== */

    container.appendChild(
        scene
    );


    /* =====================================================
       CENA PRONTA
    ===================================================== */

    scene.addEventListener(
        "loaded",
        cenaPronta
    );

}


/* =========================================================
   CENA PRONTA
========================================================= */

function cenaPronta() {

    console.log(
        "Cena A-Frame carregada."
    );


    /* =====================================================
       CONFIGURAR PIVÔ
    ===================================================== */

    if (config.pivot) {

        pivot.object3D.position.set(

            Number(config.pivot.x) || 0,

            Number(config.pivot.y) || 0,

            Number(config.pivot.z) || 0

        );

    }


    /* =====================================================
       ROTAÇÃO INICIAL DO PIVÔ
    ===================================================== */

    if (config.pivotRotation) {

        pivot.object3D.rotation.set(

            THREE.MathUtils.degToRad(
                Number(
                    config.pivotRotation.x
                ) || 0
            ),

            THREE.MathUtils.degToRad(
                Number(
                    config.pivotRotation.y
                ) || 0
            ),

            THREE.MathUtils.degToRad(
                Number(
                    config.pivotRotation.z
                ) || 0
            )

        );

    }


    /* =====================================================
       CONFIGURAR MODELO
    ===================================================== */

    if (config.position) {

        modelo.object3D.position.set(

            Number(
                config.position.x
            ) || 0,

            Number(
                config.position.y
            ) || 0,

            Number(
                config.position.z
            ) || 0

        );

    }


    if (config.rotation) {

        modelo.object3D.rotation.set(

            THREE.MathUtils.degToRad(
                Number(
                    config.rotation.x
                ) || 0
            ),

            THREE.MathUtils.degToRad(
                Number(
                    config.rotation.y
                ) || 0
            ),

            THREE.MathUtils.degToRad(
                Number(
                    config.rotation.z
                ) || 0
            )

        );

    }


    /* =====================================================
       ESCALA
    ===================================================== */

    const escala =
        Number(
            config.scale
        ) || 1;


    modelo.object3D.scale.set(
        escala,
        escala,
        escala
    );


    /* =====================================================
       MODELO CARREGADO
    ===================================================== */

    modelo.addEventListener(
        "model-loaded",
        () => {

            console.log(
                "GLB carregado:",
                config.modelo
            );


            /*
             * O modelo fica invisível até
             * o marcador ser encontrado.
             */

            modelo.setAttribute(
                "visible",
                marcadorEncontrado
            );

        }
    );


    /* =====================================================
       ERRO NO GLB
    ===================================================== */

    modelo.addEventListener(
        "model-error",
        evento => {

            console.error(
                "Erro ao carregar GLB:",
                evento
            );

        }
    );


    /* =====================================================
       MARCADOR ENCONTRADO
    ===================================================== */

    target.addEventListener(
        "targetFound",
        () => {

            console.log(
                "MARCADOR ENCONTRADO"
            );


            marcadorEncontrado =
                true;


            modelo.setAttribute(
                "visible",
                "true"
            );


            tocarMusica();

        }
    );


    /* =====================================================
       MARCADOR PERDIDO
    ===================================================== */

    target.addEventListener(
        "targetLost",
        () => {

            console.log(
                "MARCADOR PERDIDO"
            );


            marcadorEncontrado =
                false;


            modelo.setAttribute(
                "visible",
                "false"
            );


            pararMusica();

        }
    );


    /* =====================================================
       ÁUDIO
    ===================================================== */

    prepararAudio();

}


/* =========================================================
   ÁUDIO
========================================================= */

function prepararAudio() {

    if (!config.audio) {

        console.log(
            "Nenhum áudio configurado."
        );

        return;

    }


    const caminho =
        caminhoArquivo(
            config.audio
        );


    console.log(
        "Áudio:",
        caminho
    );


    audio =
        new Audio(caminho);


    audio.loop = true;

    audio.preload = "auto";

    audio.volume = 1;


    audio.addEventListener(
        "error",
        evento => {

            console.error(
                "Erro ao carregar áudio:",
                evento
            );

        }
    );

}


function tocarMusica() {

    if (!audio) {
        return;
    }


    audio.play()
        .then(
            () => {

                console.log(
                    "Música iniciada."
                );

            }
        )
        .catch(
            erro => {

                console.warn(
                    "Áudio bloqueado pelo navegador:",
                    erro
                );

            }
        );

}


function pararMusica() {

    if (!audio) {
        return;
    }


    audio.pause();

}


/* =========================================================
   TOQUE → ROTAÇÃO DO PIVÔ
========================================================= */

let tocando =
    false;


let ultimoX =
    0;


const VELOCIDADE_ROTACAO =
    0.01;


window.addEventListener(
    "touchstart",
    evento => {

        if (
            evento.touches.length !== 1
        ) {
            return;
        }


        tocando =
            true;


        ultimoX =
            evento.touches[0].clientX;

    },
    {
        passive: true
    }
);


window.addEventListener(
    "touchmove",
    evento => {

        if (!tocando) {
            return;
        }


        if (
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


        /*
         * O PIVÔ gira.
         *
         * Como o GLB está dentro dele,
         * o GLB acompanha a rotação.
         */

        pivot.object3D.rotation.x -=
            deltaX *
            VELOCIDADE_ROTACAO;

    },
    {
        passive: true
    }
);


window.addEventListener(
    "touchend",
    () => {

        tocando =
            false;

    },
    {
        passive: true
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
                "Erro na tela cheia:",
                erro
            );

        }

    }
);


/* =========================================================
   INICIAR
========================================================= */

carregarConfig();
