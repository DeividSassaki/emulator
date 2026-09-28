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
   MODO
========================================================= */

let modoAtual =
    "pivot";



/* =========================================================
   CONFIGURAÇÃO PADRÃO
========================================================= */

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

    scale:
        1,

    pivot: {

        x: 0,
        y: 0,
        z: 0

    },

    audio:
        "musica.mp3"

};



let configOriginal =
    null;



/* =========================================================
   GRAUS → RADIANOS
========================================================= */

function grausParaRad(graus) {

    return graus *
        Math.PI /
        180;

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


    }

    catch (erro) {

        console.error(
            "Erro ao carregar config:",
            erro
        );


        status.textContent =
            "❌ Erro ao carregar config.json.";

    }

}



/* =========================================================
   APLICAR MODELO
========================================================= */

function aplicarModelo() {

    if (!modelo || !pivot) {
        return;
    }


    /* =====================================================
       PIVOT
    ===================================================== */

    pivot.object3D.position.set(

        Number(config.pivot.x),

        Number(config.pivot.y),

        Number(config.pivot.z)

    );


    /* =====================================================
       POSIÇÃO DO MODELO
    ===================================================== */

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


    /* =====================================================
       ROTAÇÃO
    ===================================================== */

    modelo.object3D.rotation.set(

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


    /* =====================================================
       ESCALA
    ===================================================== */

    const escala =
        Number(config.scale);


    modelo.object3D.scale.set(

        escala,
        escala,
        escala

    );

}



/* =========================================================
   SLIDERS
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
   ATUALIZAR VALORES DA TELA
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
   MODO
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
   ALTERAR X
========================================================= */

sliderX.addEventListener(
    "input",
    () => {

        const valor =
            Number(
                sliderX.value
            );


        if (modoAtual === "pivot") {

            config.pivot.x =
                valor;

        }


        if (modoAtual === "rotacao") {

            config.rotation.x =
                valor;

        }


        if (modoAtual === "posicao") {

            config.position.x =
                valor;

        }


        aplicarModelo();

        atualizarValoresTela();

        atualizarConfiguracao();

    }
);



/* =========================================================
   ALTERAR Y
========================================================= */

sliderY.addEventListener(
    "input",
    () => {

        const valor =
            Number(
                sliderY.value
            );


        if (modoAtual === "pivot") {

            config.pivot.y =
                valor;

        }


        if (modoAtual === "rotacao") {

            config.rotation.y =
                valor;

        }


        if (modoAtual === "posicao") {

            config.position.y =
                valor;

        }


        aplicarModelo();

        atualizarValoresTela();

        atualizarConfiguracao();

    }
);



/* =========================================================
   ALTERAR Z
========================================================= */

sliderZ.addEventListener(
    "input",
    () => {

        const valor =
            Number(
                sliderZ.value
            );


        if (modoAtual === "pivot") {

            config.pivot.z =
                valor;

        }


        if (modoAtual === "rotacao") {

            config.rotation.z =
                valor;

        }


        if (modoAtual === "posicao") {

            config.position.z =
                valor;

        }


        aplicarModelo();

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


        aplicarModelo();

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
   SALVAR CONFIG.JSON
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
            "================================"
        );

        console.log(
            "GLB CARREGADO COM SUCESSO"
        );

        console.log(
            config.modelo
        );

        console.log(
            "================================"
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
            "================================"
        );

        console.error(
            "ERRO AO CARREGAR GLB"
        );

        console.error(
            evento
        );

        console.error(
            "================================"
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


        console.log(
            "Cena estática inicializada."
        );


        carregarConfig();

    }
);