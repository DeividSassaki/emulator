const scene = document.getElementById("scene");

const target = document.getElementById("targetZelda");

const pivot = document.getElementById("pivotEntity");

const objeto = document.getElementById("objectEntity");

const modelo = document.getElementById("heroModelObject");

const status = document.getElementById("status");

const configuracao = document.getElementById("configuracao");


// ============================================================
// BOTÕES
// ============================================================

const botaoPivot = document.getElementById("botaoPivot");
const botaoObjeto = document.getElementById("botaoObjeto");

const botaoRotacao = document.getElementById("botaoRotacao");
const botaoMovimento = document.getElementById("botaoMovimento");

const botaoResetar = document.getElementById("resetar");
const botaoSalvar = document.getElementById("salvar");


// ============================================================
// SLIDERS
// ============================================================

const sliderX = document.getElementById("sliderX");
const sliderY = document.getElementById("sliderY");
const sliderZ = document.getElementById("sliderZ");

const sliderEscala = document.getElementById("sliderEscala");


// ============================================================
// VALORES
// ============================================================

const valorX = document.getElementById("valorX");
const valorY = document.getElementById("valorY");
const valorZ = document.getElementById("valorZ");

const valorEscala = document.getElementById("valorEscala");

const labelX = document.getElementById("labelX");
const labelY = document.getElementById("labelY");
const labelZ = document.getElementById("labelZ");


// ============================================================
// ESTADO
// ============================================================

let elementoSelecionado = "pivot";

let controleSelecionado = "rotacao";

let configOriginal = null;

let config = null;


// ============================================================
// PASTA
// ============================================================

const parametros = new URLSearchParams(window.location.search);

const pasta = parametros.get("pasta") || "zelda";


// ============================================================
// CONFIGURAÇÃO PADRÃO
// ============================================================

const configPadrao = {

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

    pivotRotation: {
        x: 0,
        y: 0,
        z: 0
    },

    audio: "musica.mp3"

};


// ============================================================
// COPIAR CONFIG
// ============================================================

function copiar(obj) {

    return JSON.parse(JSON.stringify(obj));

}


// ============================================================
// CARREGAR CONFIG
// ============================================================

async function carregarConfig() {

    try {

        const resposta = await fetch(
            `../marcadores/${pasta}/config.json?${Date.now()}`
        );


        if (!resposta.ok) {

            throw new Error("config.json não encontrado");

        }


        config = await resposta.json();


        configOriginal = copiar(config);


        // Garantir campos novos

        if (!config.pivot) {

            config.pivot = {
                x: 0,
                y: 0,
                z: 0
            };

        }


        if (!config.pivotRotation) {

            config.pivotRotation = {
                x: 0,
                y: 0,
                z: 0
            };

        }


        if (config.scale === undefined) {

            config.scale = 1;

        }


        aplicarConfiguracao();


        status.textContent =
            `Configuração carregada: ${pasta}`;


    } catch (erro) {

        console.error(erro);


        config = copiar(configPadrao);

        configOriginal = copiar(config);


        aplicarConfiguracao();


        status.textContent =
            "Usando configuração padrão";


    }

}


// ============================================================
// APLICAR CONFIGURAÇÃO
// ============================================================

function aplicarConfiguracao() {


    // --------------------------------------------------------
    // PIVOT
    // --------------------------------------------------------

    pivot.object3D.position.set(
        config.pivot.x,
        config.pivot.y,
        config.pivot.z
    );


    pivot.object3D.rotation.set(
        THREE.MathUtils.degToRad(config.pivotRotation.x),
        THREE.MathUtils.degToRad(config.pivotRotation.y),
        THREE.MathUtils.degToRad(config.pivotRotation.z)
    );


    // --------------------------------------------------------
    // OBJETO
    // --------------------------------------------------------

    objeto.object3D.position.set(
        config.position.x,
        config.position.y,
        config.position.z
    );


    objeto.object3D.rotation.set(
        THREE.MathUtils.degToRad(config.rotation.x),
        THREE.MathUtils.degToRad(config.rotation.y),
        THREE.MathUtils.degToRad(config.rotation.z)
    );


    modelo.object3D.scale.set(
        config.scale,
        config.scale,
        config.scale
    );


    atualizarInterface();

    atualizarJSON();

}


// ============================================================
// ATUALIZAR INTERFACE
// ============================================================

function atualizarInterface() {

    let dados;


    if (elementoSelecionado === "pivot") {

        if (controleSelecionado === "rotacao") {

            dados = config.pivotRotation;

        } else {

            dados = config.pivot;

        }

    } else {

        if (controleSelecionado === "rotacao") {

            dados = config.rotation;

        } else {

            dados = config.position;

        }

    }


    sliderX.value = dados.x;
    sliderY.value = dados.y;
    sliderZ.value = dados.z;


    valorX.textContent =
        Number(dados.x).toFixed(2);

    valorY.textContent =
        Number(dados.y).toFixed(2);

    valorZ.textContent =
        Number(dados.z).toFixed(2);


    valorEscala.textContent =
        Number(config.scale).toFixed(2);


    atualizarLabels();

}


// ============================================================
// LABELS
// ============================================================

function atualizarLabels() {

    const nome =
        elementoSelecionado === "pivot"
            ? "Pivot"
            : "Objeto";


    if (controleSelecionado === "rotacao") {

        labelX.textContent =
            `${nome} Rotação X`;

        labelY.textContent =
            `${nome} Rotação Y`;

        labelZ.textContent =
            `${nome} Rotação Z`;


        sliderX.min = -360;
        sliderX.max = 360;

        sliderY.min = -360;
        sliderY.max = 360;

        sliderZ.min = -360;
        sliderZ.max = 360;


    } else {

        labelX.textContent =
            `${nome} Movimento X`;

        labelY.textContent =
            `${nome} Movimento Y`;

        labelZ.textContent =
            `${nome} Movimento Z`;


        sliderX.min = -5;
        sliderX.max = 5;

        sliderY.min = -5;
        sliderY.max = 5;

        sliderZ.min = -5;
        sliderZ.max = 5;

    }

}


// ============================================================
// SELECIONAR ELEMENTO
// ============================================================

function selecionarElemento(elemento) {

    elementoSelecionado = elemento;


    botaoPivot.classList.toggle(
        "ativo",
        elemento === "pivot"
    );


    botaoObjeto.classList.toggle(
        "ativo",
        elemento === "objeto"
    );


    atualizarInterface();

}


// ============================================================
// SELECIONAR CONTROLE
// ============================================================

function selecionarControle(controle) {

    controleSelecionado = controle;


    botaoRotacao.classList.toggle(
        "ativo",
        controle === "rotacao"
    );


    botaoMovimento.classList.toggle(
        "ativo",
        controle === "movimento"
    );


    atualizarInterface();

}


// ============================================================
// BOTÃO PIVOT
// ============================================================

botaoPivot.addEventListener(
    "click",
    () => {

        selecionarElemento("pivot");

    }
);


// ============================================================
// BOTÃO OBJETO
// ============================================================

botaoObjeto.addEventListener(
    "click",
    () => {

        selecionarElemento("objeto");

    }
);


// ============================================================
// BOTÃO ROTAÇÃO
// ============================================================

botaoRotacao.addEventListener(
    "click",
    () => {

        selecionarControle("rotacao");

    }
);


// ============================================================
// BOTÃO MOVIMENTO
// ============================================================

botaoMovimento.addEventListener(
    "click",
    () => {

        selecionarControle("movimento");

    }
);


// ============================================================
// SLIDER X
// ============================================================

sliderX.addEventListener(
    "input",
    () => {

        alterarValor(
            "x",
            Number(sliderX.value)
        );

    }
);


// ============================================================
// SLIDER Y
// ============================================================

sliderY.addEventListener(
    "input",
    () => {

        alterarValor(
            "y",
            Number(sliderY.value)
        );

    }
);


// ============================================================
// SLIDER Z
// ============================================================

sliderZ.addEventListener(
    "input",
    () => {

        alterarValor(
            "z",
            Number(sliderZ.value)
        );

    }
);


// ============================================================
// ALTERAR X/Y/Z
// ============================================================

function alterarValor(eixo, valor) {


    if (elementoSelecionado === "pivot") {


        if (controleSelecionado === "rotacao") {

            config.pivotRotation[eixo] = valor;


            pivot.object3D.rotation[eixo] =
                THREE.MathUtils.degToRad(valor);


        } else {

            config.pivot[eixo] = valor;


            pivot.object3D.position[eixo] = valor;

        }


    } else {


        if (controleSelecionado === "rotacao") {

            config.rotation[eixo] = valor;


            objeto.object3D.rotation[eixo] =
                THREE.MathUtils.degToRad(valor);


        } else {

            config.position[eixo] = valor;


            objeto.object3D.position[eixo] = valor;

        }

    }


    atualizarInterface();

    atualizarJSON();

}


// ============================================================
// ESCALA
// ============================================================

sliderEscala.addEventListener(
    "input",
    () => {

        config.scale =
            Number(sliderEscala.value);


        modelo.object3D.scale.set(
            config.scale,
            config.scale,
            config.scale
        );


        valorEscala.textContent =
            config.scale.toFixed(2);


        atualizarJSON();

    }
);


// ============================================================
// RESETAR
// ============================================================

botaoResetar.addEventListener(
    "click",
    () => {

        config = copiar(configOriginal);

        aplicarConfiguracao();

        status.textContent =
            "Configuração restaurada.";

    }
);


// ============================================================
// MOSTRAR JSON
// ============================================================

function atualizarJSON() {

    configuracao.textContent =
        JSON.stringify(
            config,
            null,
            2
        );

}


// ============================================================
// SALVAR CONFIG
// ============================================================

botaoSalvar.addEventListener(
    "click",
    () => {

        const arquivo =
            new Blob(
                [
                    JSON.stringify(
                        config,
                        null,
                        2
                    )
                ],
                {
                    type: "application/json"
                }
            );


        const url =
            URL.createObjectURL(arquivo);


        const link =
            document.createElement("a");


        link.href = url;

        link.download =
            "config.json";


        document.body.appendChild(link);

        link.click();

        link.remove();


        URL.revokeObjectURL(url);


        status.textContent =
            "config.json salvo.";

    }
);


// ============================================================
// MARCADOR
// ============================================================

target.addEventListener(
    "targetFound",
    () => {

        status.textContent =
            `Marcador encontrado — ${pasta}`;

    }
);


target.addEventListener(
    "targetLost",
    () => {

        status.textContent =
            "Marcador perdido";

    }
);


// ============================================================
// MODELO CARREGADO
// ============================================================

modelo.addEventListener(
    "model-loaded",
    () => {

        console.log(
            "Modelo carregado."
        );

    }
);


modelo.addEventListener(
    "model-error",
    (evento) => {

        console.error(
            "Erro ao carregar modelo:",
            evento
        );

        status.textContent =
            "Erro ao carregar o modelo.";

    }
);


// ============================================================
// INICIAR
// ============================================================

carregarConfig();