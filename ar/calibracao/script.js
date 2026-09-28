/* =========================================================
   ELEMENTOS
========================================================= */

const scene =
    document.getElementById("scene");

const botaoIniciar =
    document.getElementById("iniciar");

const status =
    document.getElementById("status");

const modelo =
    document.getElementById("heroModelObject");

const pivot =
    document.getElementById("heroPivot");


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
   SISTEMA AR
========================================================= */

let arSystem = null;


/* =========================================================
   MODO ATUAL
========================================================= */

let modoAtual = "pivot";


/* =========================================================
   CONFIGURAÇÃO
========================================================= */

const CONFIG_URL =
    "../marcadores/zelda/config.json";


let config = {

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

let posicaoOriginal = {
    x: 0,
    y: 0,
    z: 0
};


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


        posicaoOriginal = {
            ...config.position
        };


        carregarSliders();


        atualizarModelo();


        status.textContent =
            "Configuração carregada. Inicie a câmera.";


    } catch (erro) {

        console.error(
            "Erro ao carregar config.json:",
            erro
        );


        status.textContent =
            "Usando configuração padrão.";

        carregarSliders();

        atualizarModelo();

    }

}


/* =========================================================
   CARREGAR VALORES NOS SLIDERS
========================================================= */

function carregarSliders() {

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

    modoAtual = modo;


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
   CENA PRONTA
========================================================= */

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


        carregarConfig();

    }
);


/* =========================================================
   MODELO CARREGADO
========================================================= */

modelo.addEventListener(
    "model-loaded",
    () => {

        console.log(
            "Hero of Time.glb carregado."
        );


        atualizarModelo();

    }
);


/* =========================================================
   ERRO MODELO
========================================================= */

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
   MARCADOR
========================================================= */

const target =
    document.getElementById(
        "targetZelda"
    );


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


/* =========================================================
   ATUALIZAR MODELO
========================================================= */

function atualizarModelo() {

    if (!modelo || !pivot) {

        return;

    }


    const x =
        Number(sliderX.value);

    const y =
        Number(sliderY.value);

    const z =
        Number(sliderZ.value);


    const escala =
        Number(sliderEscala.value);


    /* =====================================================
       POSIÇÃO
    ====================================================== */

    if (modoAtual === "posicao") {

        config.position.x = x;
        config.position.y = y;
        config.position.z = z;

    }


    /* =====================================================
       ROTAÇÃO
    ====================================================== */

    if (modoAtual === "rotacao") {

        config.rotation.x = x;
        config.rotation.y = y;
        config.rotation.z = z;

    }


    /* =====================================================
       PIVOT
    ====================================================== */

    if (modoAtual === "pivot") {

        config.pivot.x = x;
        config.pivot.y = y;
        config.pivot.z = z;

    }


    /* =====================================================
       ESCALA
    ====================================================== */

    config.scale =
        escala;


    /* =====================================================
       APLICA ROTAÇÃO
    ====================================================== */

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
    ====================================================== */

    modelo.object3D.scale.set(
        config.scale,
        config.scale,
        config.scale
    );


    /* =====================================================
       PIVOT

       O pivot fica na posição configurada.

       O modelo recebe o deslocamento inverso,
       mantendo sua posição visual original.

       Quando o pivot gira, o modelo gira
       ao redor desse ponto.
    ====================================================== */

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
    ====================================================== */

    valorX.textContent =
        Number(sliderX.value)
            .toFixed(2);


    valorY.textContent =
        Number(sliderY.value)
            .toFixed(2);


    valorZ.textContent =
        Number(sliderZ.value)
            .toFixed(2);


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

    return graus *
        Math.PI /
        180;

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

        config.position = {
            ...posicaoOriginal
        };

        config.rotation = {
            x: 0,
            y: 0,
            z: 0
        };

        config.scale = 1;

        config.pivot = {
            x: 0,
            y: 0,
            z: 0
        };


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


        link.href = url;

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