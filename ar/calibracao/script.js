/* =========================================================
   PASTA
========================================================= */

const parametros =
    new URLSearchParams(window.location.search);

const pasta =
    parametros.get("pasta") || "zelda";

const CONFIG_URL =
    `../marcadores/${pasta}/config.json`;


/* =========================================================
   ELEMENTOS
========================================================= */

const scene =
    document.getElementById("scene");

const target =
    document.getElementById("targetZelda");

const pivot =
    document.getElementById("heroPivot");

const modelo =
    document.getElementById("heroModelObject");

const pivotVisual =
    document.getElementById("pivotVisual");

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
   BOTÕES
========================================================= */

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
   MODO ATUAL
========================================================= */

let modoAtual =
    "pivot";


/* =========================================================
   CONFIGURAÇÃO
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


let configOriginal = null;


/* =========================================================
   GRAUS → RADIANOS
========================================================= */

function grausParaRad(graus) {

    return graus * Math.PI / 180;

}


/* =========================================================
   APLICAR PIVOT
========================================================= */

function aplicarPivot() {

    /*
     * O pivot representa o ponto ao redor do qual
     * o modelo será rotacionado.
     */

    pivot.object3D.position.set(

        Number(config.pivot.x),
        Number(config.pivot.y),
        Number(config.pivot.z)

    );

}


/* =========================================================
   APLICAR ROTAÇÃO
========================================================= */

function aplicarRotacao() {

    /*
     * A rotação agora pertence ao PIVOT,
     * e não diretamente ao modelo.
     *
     * Isso faz o modelo girar ao redor
     * do cubo de calibração.
     */

    pivot.object3D.rotation.set(

        grausParaRad(
            Number(config.rotation.x)
        ),

        grausParaRad(
            Number(config.rotation.y)
        ),

        grausParaRad(
            Number(config.rotation.z)
        )

    );

}


/* =========================================================
   APLICAR POSIÇÃO
========================================================= */

function aplicarPosicao() {

    /*
     * "position" representa a posição desejada
     * do modelo no espaço do marcador.
     *
     * Como o modelo está dentro do pivot,
     * transformamos essa posição em posição local.
     */

    modelo.object3D.position.set(

        Number(config.position.x)
        -
        Number(config.pivot.x),

        Number(config.position.y)
        -
        Number(config.pivot.y),

        Number(config.position.z)
        -
        Number(config.pivot.z)

    );

}


/* =========================================================
   APLICAR ESCALA
========================================================= */

function aplicarEscala() {

    const escala =
        Number(config.scale);

    modelo.object3D.scale.set(
        escala,
        escala,
        escala
    );

}


/* =========================================================
   APLICAR TUDO
========================================================= */

function aplicarModelo() {

    if (!config) {
        return;
    }

    aplicarPivot();

    aplicarRotacao();

    aplicarPosicao();

    aplicarEscala();

}


/* =========================================================
   CARREGAR CONFIG.JSON
========================================================= */

async function carregarConfig() {

    try {

        status.textContent =
            `Carregando ${pasta}...`;


        const resposta =
            await fetch(
                CONFIG_URL,
                {
                    cache: "no-store"
                }
            );


        if (!resposta.ok) {

            throw new Error(
                `HTTP ${resposta.status}`
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


        aplicarModelo();

        carregarSliders();

        atualizarConfiguracao();


        status.textContent =
            `📷 Câmera ativa — ${pasta}. Aponte para o marcador.`;


    } catch (erro) {

        console.error(
            "Erro ao carregar config.json:",
            erro
        );


        status.textContent =
            "❌ Erro ao carregar config.json.";

    }

}


/* =========================================================
   CARREGAR SLIDERS
========================================================= */

function carregarSliders() {

    if (!config) {
        return;
    }


    if (modoAtual === "pivot") {

        sliderX.value =
            config.pivot.x;

        sliderY.value =
            config.pivot.y;

        sliderZ.value =
            config.pivot.z;

    }


    if (modoAtual === "rotacao") {

        sliderX.value =
            config.rotation.x;

        sliderY.value =
            config.rotation.y;

        sliderZ.value =
            config.rotation.z;

    }


    if (modoAtual === "posicao") {

        sliderX.value =
            config.position.x;

        sliderY.value =
            config.position.y;

        sliderZ.value =
            config.position.z;

    }


    sliderEscala.value =
        config.scale;


    atualizarValoresTela();

}


/* =========================================================
   ATUALIZAR VALORES
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
   SLIDER X
========================================================= */

sliderX.addEventListener(
    "input",
    () => {

        const valor =
            Number(sliderX.value);


        if (modoAtual === "pivot") {

            config.pivot.x =
                valor;

            aplicarPivot();

            aplicarPosicao();

        }


        if (modoAtual === "rotacao") {

            config.rotation.x =
                valor;

            aplicarRotacao();

        }


        if (modoAtual === "posicao") {

            config.position.x =
                valor;

            aplicarPosicao();

        }


        atualizarValoresTela();

        atualizarConfiguracao();

    }
);


/* =========================================================
   SLIDER Y
========================================================= */

sliderY.addEventListener(
    "input",
    () => {

        const valor =
            Number(sliderY.value);


        if (modoAtual === "pivot") {

            config.pivot.y =
                valor;

            aplicarPivot();

            aplicarPosicao();

        }


        if (modoAtual === "rotacao") {

            config.rotation.y =
                valor;

            aplicarRotacao();

        }


        if (modoAtual === "posicao") {

            config.position.y =
                valor;

            aplicarPosicao();

        }


        atualizarValoresTela();

        atualizarConfiguracao();

    }
);


/* =========================================================
   SLIDER Z
========================================================= */

sliderZ.addEventListener(
    "input",
    () => {

        const valor =
            Number(sliderZ.value);


        if (modoAtual === "pivot") {

            config.pivot.z =
                valor;

            aplicarPivot();

            aplicarPosicao();

        }


        if (modoAtual === "rotacao") {

            config.rotation.z =
                valor;

            aplicarRotacao();

        }


        if (modoAtual === "posicao") {

            config.position.z =
                valor;

            aplicarPosicao();

        }


        atualizarValoresTela();

        atualizarConfiguracao();

    }
);


/* =========================================================
   ESCALA
========================================================= */

sliderEscala.addEventListener(
    "input",
    () => {

        config.scale =
            Number(
                sliderEscala.value
            );


        aplicarEscala();

        atualizarValoresTela();

        atualizarConfiguracao();

    }
);


/* =========================================================
   BOTÕES DE MODO
========================================================= */

botaoPivot.addEventListener(
    "click",
    () => {

        definirModo("pivot");

    }
);


botaoRotacao.addEventListener(
    "click",
    () => {

        definirModo("rotacao");

    }
);


botaoPosicao.addEventListener(
    "click",
    () => {

        definirModo("posicao");

    }
);


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


        aplicarModelo();

        carregarSliders();

        atualizarConfiguracao();

    }
);


/* =========================================================
   MOSTRAR CONFIG
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
   SALVAR
========================================================= */

botaoSalvar.addEventListener(
    "click",
    () => {

        const blob =
            new Blob(

                [
                    JSON.stringify(
                        config,
                        null,
                        2
                    )
                ],

                {
                    type:
                        "application/json"
                }

            );


        const url =
            URL.createObjectURL(
                blob
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


        link.remove();


        URL.revokeObjectURL(
            url
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
            "TARGET FOUND"
        );


        status.textContent =
            "✅ Marcador encontrado.";

    }
);


/* =========================================================
   MARCADOR PERDIDO
========================================================= */

target.addEventListener(
    "targetLost",
    () => {

        console.log(
            "TARGET LOST"
        );


        status.textContent =
            "Aponte novamente para o marcador.";

    }
);


/* =========================================================
   MODELO CARREGADO
========================================================= */

modelo.addEventListener(
    "model-loaded",
    () => {

        console.log(
            "GLB CARREGADO COM SUCESSO"
        );


        aplicarModelo();


        status.textContent =
            "✅ Modelo 3D carregado.";

    }
);


/* =========================================================
   ERRO NO MODELO
========================================================= */

modelo.addEventListener(
    "model-error",
    evento => {

        console.error(
            "ERRO AO CARREGAR GLB:",
            evento
        );


        status.textContent =
            "❌ Erro ao carregar o GLB.";

    }
);


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

scene.addEventListener(
    "loaded",
    () => {

        console.log(
            "A-Frame carregado."
        );


        carregarConfig();

    }
);