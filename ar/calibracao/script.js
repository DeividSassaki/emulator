/* =========================================================
   ELEMENTOS
========================================================= */

const scene =
    document.getElementById("scene");

const botaoIniciar =
    document.getElementById("iniciar");

const status =
    document.getElementById("status");


/* =========================================================
   SLIDERS
========================================================= */

const sliderX =
    document.getElementById("sliderX");

const sliderY =
    document.getElementById("sliderY");

const sliderZ =
    document.getElementById("sliderZ");

const sliderEscala =
    document.getElementById("sliderEscala");


/* =========================================================
   VALORES
========================================================= */

const valorX =
    document.getElementById("valorX");

const valorY =
    document.getElementById("valorY");

const valorZ =
    document.getElementById("valorZ");

const valorEscala =
    document.getElementById("valorEscala");


/* =========================================================
   LABELS
========================================================= */

const labelX =
    document.getElementById("labelX");

const labelY =
    document.getElementById("labelY");

const labelZ =
    document.getElementById("labelZ");

const nomeControle =
    document.getElementById("nomeControle");


/* =========================================================
   BOTÕES DE MODO
========================================================= */

const botaoPivot =
    document.getElementById("botaoPivot");

const botaoRotacao =
    document.getElementById("botaoRotacao");

const botaoPosicao =
    document.getElementById("botaoPosicao");


/* =========================================================
   OUTROS BOTÕES
========================================================= */

const botaoResetar =
    document.getElementById("resetar");

const botaoSalvar =
    document.getElementById("salvar");

const configuracao =
    document.getElementById("configuracao");


/* =========================================================
   PASTA DO MODELO
========================================================= */

const parametros =
    new URLSearchParams(
        window.location.search
    );

const pasta =
    parametros.get("pasta") || "zelda";


/* =========================================================
   CAMINHO DA CONFIGURAÇÃO
========================================================= */

const CONFIG_URL =
    `../marcadores/${pasta}/config.json`;


/* =========================================================
   CONFIGURAÇÃO PADRÃO
========================================================= */

let config = {

    modelo: "Hero of Time.glb",

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

    audio: "musica.mp3"

};


/* =========================================================
   CONFIGURAÇÃO ORIGINAL
========================================================= */

let configOriginal = null;


/* =========================================================
   OBJETOS AR
========================================================= */

let target = null;

let pivot = null;

let modelo = null;

let pivotVisual = null;

let arSystem = null;


/* =========================================================
   MODO ATUAL
========================================================= */

let modoAtual = "pivot";


/* =========================================================
   CARREGAR CONFIG.JSON
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


    } catch (erro) {

        console.error(
            "Erro ao carregar config.json:",
            erro
        );


        status.textContent =
            "Erro ao carregar config.json.";

    }

}


/* =========================================================
   CRIAR CENA AR
========================================================= */

function criarCena() {

    const caminhoMind =
        `../marcadores/${pasta}/targets.mind`;


    scene.setAttribute(
        "mindar-image",
        `
        imageTargetSrc: ${caminhoMind};
        autoStart: false;
        missTolerance: 20;
        uiLoading: no;
        uiError: no;
        uiScanning: no;
        `
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
        "targetAR"
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
        `../marcadores/${pasta}/${config.modelo}`;


    modelo.setAttribute(
        "gltf-model",
        `url(${caminhoModelo})`
    );


    modelo.setAttribute(
        "visible",
        "true"
    );


    /* =====================================================
       HIERARQUIA
    ===================================================== */

    pivot.appendChild(
        pivotVisual
    );

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
       LUZES
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
        luzAmbiente
    );

    scene.appendChild(
        luzDirecional
    );


    /* =====================================================
       EVENTOS DO MODELO
    ===================================================== */

    modelo.addEventListener(
        "model-loaded",
        () => {

            console.log(
                `${config.modelo} carregado.`
            );

            atualizarModelo();

            status.textContent =
                `Modelo carregado: ${config.modelo}`;

        }
    );


    modelo.addEventListener(
        "model-error",
        (evento) => {

            console.error(
                "Erro ao carregar GLB:",
                evento
            );

            status.textContent =
                "Erro ao carregar o modelo.";

        }
    );


    /* =====================================================
       EVENTOS DO MARCADOR
    ===================================================== */

    target.addEventListener(
        "targetFound",
        () => {

            status.textContent =
                "✅ Marcador encontrado.";

        }
    );


    target.addEventListener(
        "targetLost",
        () => {

            status.textContent =
                "Aponte novamente para o marcador.";

        }
    );


    /* =====================================================
       SISTEMA MINDAR
    ===================================================== */

    scene.addEventListener(
        "loaded",
        () => {

            arSystem =
                scene.systems[
                    "mindar-image-system"
                ];

            console.log(
                "MindAR pronto."
            );

        }
    );


    carregarSliders();

    atualizarModelo();

    status.textContent =
        `Configuração carregada: ${pasta}`;

}


/* =========================================================
   INICIAR CÂMERA
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
                "Aponte para o marcador.";


            botaoIniciar.style.display =
                "none";


        } catch (erro) {

            console.error(
                "Erro ao iniciar câmera:",
                erro
            );


            status.textContent =
                "Erro ao iniciar a câmera.";

        }

    }
);


/* =========================================================
   CARREGAR VALORES NOS SLIDERS
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

    atualizarModelo();

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
       ROTAÇÃO
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


    modelo.object3D.position.set(

        config.position.x -
            config.pivot.x,

        config.position.y -
            config.pivot.y,

        config.position.z -
            config.pivot.z

    );


    /* =====================================================
       MOSTRAR VALORES
    ===================================================== */

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
        config.scale.toFixed(2);


    atualizarConfiguracao();

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
   MOSTRAR CONFIGURAÇÃO
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