/* =========================================================
   PARÂMETROS DA URL
========================================================= */

const parametros =
    new URLSearchParams(
        window.location.search
    );

const pasta =
    parametros.get("pasta") || "zelda";


/* =========================================================
   ELEMENTOS DA INTERFACE
========================================================= */

const container =
    document.getElementById("ar-container");

const botaoIniciar =
    document.getElementById("iniciar");

const status =
    document.getElementById("status");

const sliderX =
    document.getElementById("sliderX");

const sliderY =
    document.getElementById("sliderY");

const sliderZ =
    document.getElementById("sliderZ");

const sliderEscala =
    document.getElementById("sliderEscala");

const valorX =
    document.getElementById("valorX");

const valorY =
    document.getElementById("valorY");

const valorZ =
    document.getElementById("valorZ");

const valorEscala =
    document.getElementById("valorEscala");

const labelX =
    document.getElementById("labelX");

const labelY =
    document.getElementById("labelY");

const labelZ =
    document.getElementById("labelZ");

const nomeControle =
    document.getElementById("nomeControle");

const botaoPivot =
    document.getElementById("botaoPivot");

const botaoRotacao =
    document.getElementById("botaoRotacao");

const botaoPosicao =
    document.getElementById("botaoPosicao");

const botaoResetar =
    document.getElementById("resetar");

const botaoSalvar =
    document.getElementById("salvar");

const configuracao =
    document.getElementById("configuracao");


/* =========================================================
   CONFIGURAÇÃO
========================================================= */

const CONFIG_URL =
    `../marcadores/${pasta}/config.json`;


let config = {

    modelo:
        "Hero of Time.glb",

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

    audio:
        "musica.mp3"

};


let configOriginal = null;


/* =========================================================
   VARIÁVEIS AR
========================================================= */

let scene = null;
let arSystem = null;

let target = null;
let pivot = null;
let modelo = null;
let pivotVisual = null;

let modoAtual =
    "pivot";

let modeloEncontrado =
    false;


/* =========================================================
   CARREGAR CONFIGURAÇÃO
========================================================= */

async function carregarConfig() {

    try {

        const resposta =
            await fetch(
                CONFIG_URL,
                {
                    cache: "no-store"
                }
            );


        if (!resposta.ok) {

            throw new Error(
                "Não foi possível carregar config.json."
            );

        }


        const dados =
            await resposta.json();


        config = {

            ...config,

            ...dados,

            position: {

                ...config.position,

                ...(dados.position || {})

            },

            rotation: {

                ...config.rotation,

                ...(dados.rotation || {})

            },

            pivot: {

                ...config.pivot,

                ...(dados.pivot || {})

            }

        };


        configOriginal =
            JSON.parse(
                JSON.stringify(config)
            );


        criarCena();


    }

    catch (erro) {

        console.error(
            "Erro ao carregar configuração:",
            erro
        );

        status.textContent =
            "❌ Erro ao carregar config.json.";

    }

}


/* =========================================================
   CRIAR CENA AR
========================================================= */

function criarCena() {

    status.textContent =
        `Preparando ${pasta}...`;


    scene =
        document.createElement(
            "a-scene"
        );


    scene.setAttribute(
        "id",
        "scene"
    );


    /*
     * AUTO START
     *
     * A câmera será iniciada automaticamente.
     * Isso evita o problema que estava acontecendo
     * com o botão "Iniciar câmera".
     */

    scene.setAttribute(
        "mindar-image",
        `
        imageTargetSrc: ../marcadores/${pasta}/targets.mind;
        autoStart: true;
        missTolerance: 20;
        filterMinCF: 0.0001;
        filterBeta: 1000;
        uiLoading: no;
        uiError: no;
        uiScanning: no;
        `
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
        "embedded",
        ""
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
       MARCADOR
    ===================================================== */

    target =
        document.createElement(
            "a-entity"
        );

    target.setAttribute(
        "id",
        "target"
    );

    target.setAttribute(
        "mindar-image-target",
        "targetIndex: 0"
    );


    /* =====================================================
       PIVOT
    ===================================================== */

    pivot =
        document.createElement(
            "a-entity"
        );

    pivot.setAttribute(
        "id",
        "heroPivot"
    );

    pivot.setAttribute(
        "position",
        "0 0 0"
    );

    pivot.setAttribute(
        "rotation",
        "0 0 0"
    );


    /* =====================================================
       CUBO DO PIVOT
    ===================================================== */

    pivotVisual =
        document.createElement(
            "a-box"
        );

    pivotVisual.setAttribute(
        "id",
        "pivotVisual"
    );

    pivotVisual.setAttribute(
        "position",
        "0 0 0"
    );

    pivotVisual.setAttribute(
        "width",
        "0.06"
    );

    pivotVisual.setAttribute(
        "height",
        "0.06"
    );

    pivotVisual.setAttribute(
        "depth",
        "0.06"
    );

    pivotVisual.setAttribute(
        "color",
        "red"
    );


    pivot.appendChild(
        pivotVisual
    );


    /* =====================================================
       MODELO
    ===================================================== */

    modelo =
        document.createElement(
            "a-gltf-model"
        );


    modelo.setAttribute(
        "id",
        "heroModelObject"
    );


    const caminhoModelo =
        `../marcadores/${pasta}/${encodeURIComponent(config.modelo)}`;


    modelo.setAttribute(
        "gltf-model",
        `url(${caminhoModelo})`
    );


    modelo.setAttribute(
        "position",
        "0 0 0"
    );


    modelo.setAttribute(
        "rotation",
        "0 0 0"
    );


    modelo.setAttribute(
        "scale",
        "1 1 1"
    );


    modelo.setAttribute(
        "visible",
        "false"
    );


    pivot.appendChild(
        modelo
    );


    target.appendChild(
        pivot
    );


    /* =====================================================
       ILUMINAÇÃO
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
        target
    );

    scene.appendChild(
        luzAmbiente
    );

    scene.appendChild(
        luzDirecional
    );


    container.appendChild(
        scene
    );


    /* =====================================================
       EVENTOS DA CENA
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
        "MindAR pronto."
    );


    arSystem =
        scene.systems[
            "mindar-image-system"
        ];


    if (!arSystem) {

        status.textContent =
            "❌ MindAR não foi iniciado.";

        return;

    }


    /*
     * Começa escondido.
     */

    modeloEncontrado =
        false;


    pivot.setAttribute(
        "visible",
        "false"
    );


    modelo.setAttribute(
        "visible",
        "false"
    );


    pivotVisual.setAttribute(
        "visible",
        "false"
    );


    /* =====================================================
       MODELO CARREGADO
    ===================================================== */

    modelo.addEventListener(
        "model-loaded",
        () => {

            console.log(
                `${config.modelo} carregado.`
            );


            atualizarModelo();


            if (!modeloEncontrado) {

                modelo.setAttribute(
                    "visible",
                    "false"
                );

            }

        }
    );


    modelo.addEventListener(
        "model-error",
        evento => {

            console.error(
                "Erro ao carregar GLB:",
                evento
            );


            status.textContent =
                "❌ Erro ao carregar o modelo.";

        }
    );


    /* =====================================================
       MARCADOR ENCONTRADO
    ===================================================== */

    target.addEventListener(
        "targetFound",
        () => {

            modeloEncontrado =
                true;


            pivot.setAttribute(
                "visible",
                "true"
            );


            modelo.setAttribute(
                "visible",
                "true"
            );


            pivotVisual.setAttribute(
                "visible",
                "true"
            );


            status.textContent =
                "✅ Marcador encontrado.";

        }
    );


    /* =====================================================
       MARCADOR PERDIDO
    ===================================================== */

    target.addEventListener(
        "targetLost",
        () => {

            modeloEncontrado =
                false;


            pivot.setAttribute(
                "visible",
                "false"
            );


            modelo.setAttribute(
                "visible",
                "false"
            );


            pivotVisual.setAttribute(
                "visible",
                "false"
            );


            status.textContent =
                "Aponte novamente para o marcador.";

        }
    );


    carregarSliders();

    atualizarConfiguracao();


    status.textContent =
        `📷 Câmera ativa — ${pasta}. Aponte para o marcador.`;

}


/* =========================================================
   BOTÃO DA CÂMERA
========================================================= */

botaoIniciar.addEventListener(
    "click",
    async () => {

        try {

            if (!arSystem) {

                status.textContent =
                    "Preparando câmera...";

                return;

            }


            status.textContent =
                "Iniciando câmera...";


            await arSystem.start();


            status.textContent =
                `📷 Câmera ativa — ${pasta}. Aponte para o marcador.`;


            botaoIniciar.style.display =
                "none";

        }

        catch (erro) {

            console.error(
                "Erro ao iniciar câmera:",
                erro
            );


            status.textContent =
                "❌ Erro ao iniciar a câmera.";

        }

    }
);


/* =========================================================
   CARREGAR SLIDERS
========================================================= */

function carregarSliders() {

    if (!config) {
        return;
    }


    sliderX.value =

        modoAtual === "pivot"

            ? config.pivot.x

            : modoAtual === "rotacao"

                ? config.rotation.x

                : config.position.x;


    sliderY.value =

        modoAtual === "pivot"

            ? config.pivot.y

            : modoAtual === "rotacao"

                ? config.rotation.y

                : config.position.y;


    sliderZ.value =

        modoAtual === "pivot"

            ? config.pivot.z

            : modoAtual === "rotacao"

                ? config.rotation.z

                : config.position.z;


    sliderEscala.value =
        config.scale;


    atualizarValoresTela();

}


/* =========================================================
   DEFINIR MODO
========================================================= */

function definirModo(modo) {

    modoAtual =
        modo;


    botaoPivot.classList.remove(
        "ativo"
    );

    botaoRotacao.classList.remove(
        "ativo"
    );

    botaoPosicao.classList.remove(
        "ativo"
    );


    if (modo === "pivot") {

        botaoPivot.classList.add(
            "ativo"
        );

        nomeControle.textContent =
            "PIVOT";

        labelX.textContent =
            "Pivot X";

        labelY.textContent =
            "Pivot Y";

        labelZ.textContent =
            "Pivot Z";

    }


    if (modo === "rotacao") {

        botaoRotacao.classList.add(
            "ativo"
        );

        nomeControle.textContent =
            "ROTAÇÃO";

        labelX.textContent =
            "Rotação X";

        labelY.textContent =
            "Rotação Y";

        labelZ.textContent =
            "Rotação Z";

    }


    if (modo === "posicao") {

        botaoPosicao.classList.add(
            "ativo"
        );

        nomeControle.textContent =
            "POSIÇÃO";

        labelX.textContent =
            "Posição X";

        labelY.textContent =
            "Posição Y";

        labelZ.textContent =
            "Posição Z";

    }


    carregarSliders();

}


/* =========================================================
   ATUALIZAR MODELO
========================================================= */

function atualizarModelo() {

    if (
        !modelo ||
        !pivot
    ) {

        return;

    }


    const x =
        Number(
            sliderX.value
        );

    const y =
        Number(
            sliderY.value
        );

    const z =
        Number(
            sliderZ.value
        );

    const escala =
        Number(
            sliderEscala.value
        );


    /* =====================================================
       POSIÇÃO
    ===================================================== */

    if (
        modoAtual === "posicao"
    ) {

        config.position.x =
            x;

        config.position.y =
            y;

        config.position.z =
            z;

    }


    /* =====================================================
       ROTAÇÃO
    ===================================================== */

    if (
        modoAtual === "rotacao"
    ) {

        config.rotation.x =
            x;

        config.rotation.y =
            y;

        config.rotation.z =
            z;

    }


    /* =====================================================
       PIVOT
    ===================================================== */

    if (
        modoAtual === "pivot"
    ) {

        config.pivot.x =
            x;

        config.pivot.y =
            y;

        config.pivot.z =
            z;

    }


    /* =====================================================
       ESCALA
    ===================================================== */

    config.scale =
        escala;


    /* =====================================================
       ROTAÇÃO DO MODELO
    ===================================================== */

    modelo.object3D.rotation.set(

        grausParaRadiano(
            config.rotation.x
        ),

        grausParaRadiano(
            config.rotation.y
        ),

        grausParaRadiano(
            config.rotation.z
        )

    );


    /* =====================================================
       ESCALA
    ===================================================== */

    modelo.object3D.scale.set(

        config.scale,
        config.scale,
        config.scale

    );


    /* =====================================================
       PIVOT
    ===================================================== */

    pivot.object3D.position.set(

        config.pivot.x,
        config.pivot.y,
        config.pivot.z

    );


    /*
     * O modelo é compensado pelo pivot.
     */

    modelo.object3D.position.set(

        config.position.x -
            config.pivot.x,

        config.position.y -
            config.pivot.y,

        config.position.z -
            config.pivot.z

    );


    atualizarValoresTela();

    atualizarConfiguracao();

}


/* =========================================================
   VALORES NA TELA
========================================================= */

function atualizarValoresTela() {

    valorX.textContent =
        Number(
            sliderX.value
        ).toFixed(2);


    valorY.textContent =
        Number(
            sliderY.value
        ).toFixed(2);


    valorZ.textContent =
        Number(
            sliderZ.value
        ).toFixed(2);


    valorEscala.textContent =
        Number(
            sliderEscala.value
        ).toFixed(2);

}


/* =========================================================
   GRAUS → RADIANOS
========================================================= */

function grausParaRadiano(
    graus
) {

    return (
        graus *
        Math.PI /
        180
    );

}


/* =========================================================
   SLIDERS
========================================================= */

sliderX.addEventListener(
    "input",
    atualizarModelo
);

sliderY.addEventListener(
    "input",
    atualizarModelo
);

sliderZ.addEventListener(
    "input",
    atualizarModelo
);

sliderEscala.addEventListener(
    "input",
    atualizarModelo
);


/* =========================================================
   BOTÕES P / R / PO
========================================================= */

botaoPivot.addEventListener(
    "click",
    () => {

        definirModo(
            "pivot"
        );

    }
);


botaoRotacao.addEventListener(
    "click",
    () => {

        definirModo(
            "rotacao"
        );

    }
);


botaoPosicao.addEventListener(
    "click",
    () => {

        definirModo(
            "posicao"
        );

    }
);


/* =========================================================
   CONFIGURAÇÃO NA TELA
========================================================= */

function atualizarConfiguracao() {

    configuracao.textContent =
        JSON.stringify(
            config,
            null,
            2
        );

}


/* =========================================================
   RESETAR
========================================================= */

botaoResetar.addEventListener(
    "click",
    () => {

        if (!configOriginal) {
            return;
        }


        config =
            JSON.parse(
                JSON.stringify(
                    configOriginal
                )
            );


        carregarSliders();

        atualizarModelo();

    }
);


/* =========================================================
   SALVAR CONFIG.JSON
========================================================= */

botaoSalvar.addEventListener(
    "click",
    () => {

        const texto =
            JSON.stringify(
                config,
                null,
                2
            );


        const arquivo =
            new Blob(
                [texto],
                {
                    type:
                        "application/json"
                }
            );


        const url =
            URL.createObjectURL(
                arquivo
            );


        const link =
            document.createElement(
                "a"
            );


        link.href =
            url;


        link.download =
            "config.json";


        document.body.appendChild(
            link
        );


        link.click();


        document.body.removeChild(
            link
        );


        URL.revokeObjectURL(
            url
        );


        botaoSalvar.textContent =
            "✅ Salvo!";


        setTimeout(
            () => {

                botaoSalvar.textContent =
                    "💾 Salvar config.json";

            },
            1500
        );

    }
);


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

definirModo(
    "pivot"
);


carregarConfig();