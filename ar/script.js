/* =========================================================
   PASTA
========================================================= */

const parametros =
    new URLSearchParams(window.location.search);

const pasta =
    parametros.get("pasta") || "zelda";


const CONFIG_URL =
    `./marcadores/${encodeURIComponent(pasta)}/config.json`;


/* =========================================================
   CONTAINER
========================================================= */

const container =
    document.getElementById("ar-container");


const botaoFullscreen =
    document.getElementById("fullscreen");


/* =========================================================
   VARIÁVEIS
========================================================= */

let scene = null;
let target = null;
let pivot = null;
let objeto = null;
let modelo = null;
let audio = null;
let config = null;


/* =========================================================
   ESTADO
========================================================= */

let marcadorEncontrado = false;

let audioDesbloqueado = false;


/* =========================================================
   CAMINHO DE ARQUIVO
========================================================= */

function caminhoArquivo(nome) {

    if (!nome) {
        return "";
    }


    return `./marcadores/${encodeURIComponent(pasta)}/${nome
        .split("/")
        .map(parte => encodeURIComponent(parte))
        .join("/")}`;
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


        /*
         * Não mostramos o nome na página.
         * O título fica simplesmente AR.
         */

        document.title = "AR";


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
       CENA
    ===================================================== */

    scene =
        document.createElement("a-scene");


    scene.setAttribute(
        "id",
        "scene"
    );


    /*
     * Muito importante:
     * mesma configuração estrutural da calibração.
     */

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
    ===================================================== */

    const marcador =
        config.marcador || "targets.mind";


    const caminhoMarcador =
        caminhoArquivo(marcador);


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
       CÂMERA
    ===================================================== */

    const camera =
        document.createElement("a-camera");


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
       ASSETS
    ===================================================== */

    const assets =
        document.createElement("a-assets");


    const assetModelo =
        document.createElement("a-asset-item");


    assetModelo.setAttribute(
        "id",
        "arModel"
    );


    assetModelo.setAttribute(
        "src",
        caminhoArquivo(config.modelo)
    );


    assets.appendChild(
        assetModelo
    );


    scene.appendChild(
        assets
    );


    /* =====================================================
       TARGET
    ===================================================== */

    target =
        document.createElement("a-entity");


    target.setAttribute(
        "id",
        "arTarget"
    );


    target.setAttribute(
        "mindar-image-target",
        "targetIndex: 0"
    );


    /* =====================================================
       PIVÔ INVISÍVEL
    ===================================================== */

    pivot =
        document.createElement("a-entity");


    pivot.setAttribute(
        "id",
        "arPivot"
    );


    /*
     * O pivô não possui absolutamente
     * nenhum objeto visual.
     *
     * Ele serve apenas como centro
     * de transformação.
     */


    /* =====================================================
       OBJETO
    ===================================================== */

    objeto =
        document.createElement("a-entity");


    objeto.setAttribute(
        "id",
        "arObject"
    );


    /* =====================================================
       MODELO
    ===================================================== */

    modelo =
        document.createElement("a-gltf-model");


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
       HIERARQUIA

       TARGET
          └── PIVÔ
                └── OBJETO
                      └── GLB
    ===================================================== */

    objeto.appendChild(
        modelo
    );


    pivot.appendChild(
        objeto
    );


    target.appendChild(
        pivot
    );


    /* =====================================================
       LUZES
    ===================================================== */

    const luzAmbiente =
        document.createElement("a-light");


    luzAmbiente.setAttribute(
        "type",
        "ambient"
    );


    luzAmbiente.setAttribute(
        "intensity",
        "2"
    );


    target.appendChild(
        luzAmbiente
    );


    const luzDirecional =
        document.createElement("a-light");


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


    target.appendChild(
        luzDirecional
    );


    /* =====================================================
       CONFIGURAR EVENTOS
    ===================================================== */

    scene.addEventListener(
        "loaded",
        cenaPronta,
        { once: true }
    );


    /* =====================================================
       COLOCAR CENA NO DOM
    ===================================================== */

    container.appendChild(
        scene
    );

}


/* =========================================================
   CENA PRONTA
========================================================= */

function cenaPronta() {

    console.log(
        "Cena A-Frame carregada."
    );


    aplicarConfiguracao();


    prepararAudio();


    /* =====================================================
       GLB CARREGADO
    ===================================================== */

    modelo.addEventListener(
        "model-loaded",
        () => {

            console.log(
                "GLB carregado:",
                config.modelo
            );


            if (marcadorEncontrado) {

                modelo.setAttribute(
                    "visible",
                    "true"
                );

            }

        },
        { once: true }
    );


    /* =====================================================
       ERRO GLB
    ===================================================== */

    modelo.addEventListener(
        "model-error",
        evento => {

            console.error(
                "ERRO AO CARREGAR GLB:",
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
                "================================"
            );

            console.log(
                "MARCADOR ENCONTRADO"
            );

            console.log(
                "================================"
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

}


/* =========================================================
   CONFIGURAÇÃO
========================================================= */

function aplicarConfiguracao() {

    if (!config) {
        return;
    }


    /* =====================================================
       PIVÔ

       Esses valores são os valores salvos
       diretamente pela calibração.
    ===================================================== */

    const pivotPosition =
        new THREE.Vector3(

            Number(config.pivot?.x) || 0,

            Number(config.pivot?.y) || 0,

            Number(config.pivot?.z) || 0

        );


    const pivotEuler =
        new THREE.Euler(

            THREE.MathUtils.degToRad(
                Number(
                    config.pivotRotation?.x
                ) || 0
            ),

            THREE.MathUtils.degToRad(
                Number(
                    config.pivotRotation?.y
                ) || 0
            ),

            THREE.MathUtils.degToRad(
                Number(
                    config.pivotRotation?.z
                ) || 0
            ),

            "XYZ"

        );


    const pivotQuaternion =
        new THREE.Quaternion();


    pivotQuaternion.setFromEuler(
        pivotEuler
    );


    pivot.object3D.position.copy(
        pivotPosition
    );


    pivot.object3D.quaternion.copy(
        pivotQuaternion
    );


    /* =====================================================
       POSIÇÃO DO OBJETO

       A calibração salva a posição do objeto
       no espaço do marcador.

       Como agora o objeto está DENTRO
       do pivô, precisamos converter essa
       posição para o espaço local do pivô.
    ===================================================== */

    const objetoWorldPosition =
        new THREE.Vector3(

            Number(config.position?.x) || 0,

            Number(config.position?.y) || 0,

            Number(config.position?.z) || 0

        );


    const posicaoLocal =
        objetoWorldPosition
            .sub(pivotPosition)
            .applyQuaternion(
                pivotQuaternion.clone().invert()
            );


    objeto.object3D.position.copy(
        posicaoLocal
    );


    /* =====================================================
       ROTAÇÃO DO OBJETO

       Mesma conversão:
       rotação salva pela calibração
       → rotação local do objeto dentro do pivô.
    ===================================================== */

    const objetoEuler =
        new THREE.Euler(

            THREE.MathUtils.degToRad(
                Number(
                    config.rotation?.x
                ) || 0
            ),

            THREE.MathUtils.degToRad(
                Number(
                    config.rotation?.y
                ) || 0
            ),

            THREE.MathUtils.degToRad(
                Number(
                    config.rotation?.z
                ) || 0
            ),

            "XYZ"

        );


    const objetoWorldQuaternion =
        new THREE.Quaternion();


    objetoWorldQuaternion.setFromEuler(
        objetoEuler
    );


    const objetoLocalQuaternion =
        pivotQuaternion
            .clone()
            .invert()
            .multiply(
                objetoWorldQuaternion
            );


    objeto.object3D.quaternion.copy(
        objetoLocalQuaternion
    );


    /* =====================================================
       ESCALA
    ===================================================== */

    const escala =
        Number(config.scale) || 1;


    modelo.object3D.scale.set(
        escala,
        escala,
        escala
    );


    console.log(
        "Pivô:",
        pivotPosition
    );


    console.log(
        "Objeto local:",
        posicaoLocal
    );

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


/* =========================================================
   DESBLOQUEAR ÁUDIO
========================================================= */

function desbloquearAudio() {

    if (!audio) {
        return;
    }


    if (audioDesbloqueado) {
        return;
    }


    const volumeOriginal =
        audio.volume;


    audio.volume = 0;


    audio.play()
        .then(
            () => {

                audio.pause();

                audio.currentTime = 0;

                audio.volume =
                    volumeOriginal;

                audioDesbloqueado =
                    true;

                console.log(
                    "Áudio desbloqueado."
                );


                /*
                 * Caso o marcador já tenha sido
                 * encontrado antes do toque,
                 * começamos a música agora.
                 */

                if (marcadorEncontrado) {

                    tocarMusica();

                }

            }
        )
        .catch(
            () => {

                audio.volume =
                    volumeOriginal;

            }
        );

}


/* =========================================================
   TOCAR MÚSICA
========================================================= */

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
                    "Áudio aguardando interação:",
                    erro
                );

            }
        );

}


/* =========================================================
   PARAR MÚSICA
========================================================= */

function pararMusica() {

    if (!audio) {
        return;
    }


    audio.pause();

}


/* =========================================================
   PRIMEIRA INTERAÇÃO
========================================================= */

window.addEventListener(
    "pointerdown",
    desbloquearAudio,
    {
        passive: true
    }
);


/* =========================================================
   ROTAÇÃO POR TOQUE
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


        /*
         * Também aproveitamos qualquer
         * toque para liberar o áudio.
         */

        desbloquearAudio();


        /*
         * Só gira quando o marcador
         * está sendo reconhecido.
         */

        if (!marcadorEncontrado) {
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


        if (!marcadorEncontrado) {
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
         * O pivô gira.
         *
         * O GLB está dentro dele,
         * portanto acompanha o movimento.
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


            /*
             * Depois de mudar para fullscreen,
             * força uma atualização do tamanho
             * da cena.
             */

            setTimeout(
                () => {

                    if (
                        scene &&
                        scene.resize
                    ) {

                        scene.resize();

                    }

                },
                200
            );


        } catch (erro) {

            console.error(
                "Erro na tela cheia:",
                erro
            );

        }

    }
);


/* =========================================================
   INÍCIO
========================================================= */

carregarConfig();
