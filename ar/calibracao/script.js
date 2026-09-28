const scene = document.getElementById("scene");
const target = document.getElementById("targetZelda");

const pivot = document.getElementById("heroPivot");
const modelo = document.getElementById("heroModelObject");
const pivotVisual = document.getElementById("pivotVisual");

const status = document.getElementById("status");


// --------------------------------------------------
// CONFIGURAÇÃO
// --------------------------------------------------

const pasta =
    new URLSearchParams(window.location.search).get("pasta") || "zelda";

let config = null;


// --------------------------------------------------
// ELEMENTOS DOS CONTROLES
// --------------------------------------------------

const pivotX = document.getElementById("pivotX");
const pivotY = document.getElementById("pivotY");
const pivotZ = document.getElementById("pivotZ");

const rotX = document.getElementById("rotX");
const rotY = document.getElementById("rotY");
const rotZ = document.getElementById("rotZ");

const posX = document.getElementById("posX");
const posY = document.getElementById("posY");
const posZ = document.getElementById("posZ");

const escala = document.getElementById("escala");


// --------------------------------------------------
// VALORES
// --------------------------------------------------

const valorPivot = document.getElementById("valorPivot");
const valorRotacao = document.getElementById("valorRotacao");
const valorPosicao = document.getElementById("valorPosicao");
const valorEscala = document.getElementById("valorEscala");


// --------------------------------------------------
// GRUPOS
// --------------------------------------------------

const grupoPivot = document.getElementById("grupoPivot");
const grupoRotacao = document.getElementById("grupoRotacao");
const grupoPosicao = document.getElementById("grupoPosicao");


// --------------------------------------------------
// CONVERSÃO
// --------------------------------------------------

function grausParaRad(graus) {
    return graus * Math.PI / 180;
}


// --------------------------------------------------
// APLICAR CONFIGURAÇÃO
// --------------------------------------------------

function aplicarConfig() {

    if (!config) return;

    if (!config.position) {
        config.position = {
            x: 0,
            y: 0,
            z: 0
        };
    }

    if (!config.rotation) {
        config.rotation = {
            x: 0,
            y: 0,
            z: 0
        };
    }

    if (!config.pivot) {
        config.pivot = {
            x: 0,
            y: 0,
            z: 0
        };
    }

    if (typeof config.scale !== "number") {
        config.scale = 1;
    }


    // ----------------------------------------------
    // PIVOT
    // ----------------------------------------------

    pivot.object3D.position.set(
        config.pivot.x,
        config.pivot.y,
        config.pivot.z
    );


    // ----------------------------------------------
    // POSIÇÃO DO MODELO
    // ----------------------------------------------

    modelo.object3D.position.set(
        config.position.x - config.pivot.x,
        config.position.y - config.pivot.y,
        config.position.z - config.pivot.z
    );


    // ----------------------------------------------
    // ROTAÇÃO
    // ----------------------------------------------

    modelo.object3D.rotation.set(
        grausParaRad(config.rotation.x),
        grausParaRad(config.rotation.y),
        grausParaRad(config.rotation.z)
    );


    // ----------------------------------------------
    // ESCALA
    // ----------------------------------------------

    modelo.object3D.scale.set(
        config.scale,
        config.scale,
        config.scale
    );


    atualizarControles();
}


// --------------------------------------------------
// ATUALIZAR CONTROLES
// --------------------------------------------------

function atualizarControles() {

    pivotX.value = config.pivot.x;
    pivotY.value = config.pivot.y;
    pivotZ.value = config.pivot.z;

    rotX.value = config.rotation.x;
    rotY.value = config.rotation.y;
    rotZ.value = config.rotation.z;

    posX.value = config.position.x;
    posY.value = config.position.y;
    posZ.value = config.position.z;

    escala.value = config.scale;


    atualizarTextos();
}


// --------------------------------------------------
// TEXTOS DOS VALORES
// --------------------------------------------------

function atualizarTextos() {

    valorPivot.textContent =
        `Pivot: X ${Number(config.pivot.x).toFixed(2)} | ` +
        `Y ${Number(config.pivot.y).toFixed(2)} | ` +
        `Z ${Number(config.pivot.z).toFixed(2)}`;


    valorRotacao.textContent =
        `Rotação: X ${Number(config.rotation.x).toFixed(0)}° | ` +
        `Y ${Number(config.rotation.y).toFixed(0)}° | ` +
        `Z ${Number(config.rotation.z).toFixed(0)}°`;


    valorPosicao.textContent =
        `Posição: X ${Number(config.position.x).toFixed(2)} | ` +
        `Y ${Number(config.position.y).toFixed(2)} | ` +
        `Z ${Number(config.position.z).toFixed(2)}`;


    valorEscala.textContent =
        `Escala: ${Number(config.scale).toFixed(2)}`;
}


// --------------------------------------------------
// PIVOT
// --------------------------------------------------

function atualizarPivot() {

    config.pivot.x = Number(pivotX.value);
    config.pivot.y = Number(pivotY.value);
    config.pivot.z = Number(pivotZ.value);

    aplicarConfig();
}


// --------------------------------------------------
// ROTAÇÃO
// --------------------------------------------------

function atualizarRotacao() {

    config.rotation.x = Number(rotX.value);
    config.rotation.y = Number(rotY.value);
    config.rotation.z = Number(rotZ.value);

    aplicarConfig();
}


// --------------------------------------------------
// POSIÇÃO
// --------------------------------------------------

function atualizarPosicao() {

    config.position.x = Number(posX.value);
    config.position.y = Number(posY.value);
    config.position.z = Number(posZ.value);

    aplicarConfig();
}


// --------------------------------------------------
// ESCALA
// --------------------------------------------------

function atualizarEscala() {

    config.scale = Number(escala.value);

    aplicarConfig();
}


// --------------------------------------------------
// EVENTOS DOS SLIDERS
// --------------------------------------------------

pivotX.addEventListener("input", atualizarPivot);
pivotY.addEventListener("input", atualizarPivot);
pivotZ.addEventListener("input", atualizarPivot);

rotX.addEventListener("input", atualizarRotacao);
rotY.addEventListener("input", atualizarRotacao);
rotZ.addEventListener("input", atualizarRotacao);

posX.addEventListener("input", atualizarPosicao);
posY.addEventListener("input", atualizarPosicao);
posZ.addEventListener("input", atualizarPosicao);

escala.addEventListener("input", atualizarEscala);


// --------------------------------------------------
// BOTÕES P / R / PO
// --------------------------------------------------

function mostrarGrupo(grupo) {

    grupoPivot.style.display = "none";
    grupoRotacao.style.display = "none";
    grupoPosicao.style.display = "none";

    grupo.style.display = "block";
}


document.getElementById("btnPivot").addEventListener(
    "click",
    () => mostrarGrupo(grupoPivot)
);


document.getElementById("btnRotacao").addEventListener(
    "click",
    () => mostrarGrupo(grupoRotacao)
);


document.getElementById("btnPosicao").addEventListener(
    "click",
    () => mostrarGrupo(grupoPosicao)
);


// --------------------------------------------------
// RESET
// --------------------------------------------------

document.getElementById("btnReset").addEventListener(
    "click",
    () => {

        config.position = {
            x: 0,
            y: 0,
            z: 0
        };

        config.rotation = {
            x: 0,
            y: 0,
            z: 0
        };

        config.pivot = {
            x: 0,
            y: 0,
            z: 0
        };

        config.scale = 1;

        aplicarConfig();
    }
);


// --------------------------------------------------
// SALVAR
// --------------------------------------------------

document.getElementById("btnSalvar").addEventListener(
    "click",
    () => {

        const arquivo = new Blob(
            [
                JSON.stringify(config, null, 2)
            ],
            {
                type: "application/json"
            }
        );


        const url = URL.createObjectURL(arquivo);

        const link = document.createElement("a");

        link.href = url;
        link.download = "config.json";

        document.body.appendChild(link);

        link.click();

        link.remove();

        URL.revokeObjectURL(url);
    }
);


// --------------------------------------------------
// CARREGAR CONFIG.JSON
// --------------------------------------------------

async function carregarConfig() {

    try {

        const resposta = await fetch(
            `../marcadores/${pasta}/config.json?${Date.now()}`
        );


        if (!resposta.ok) {
            throw new Error(
                `HTTP ${resposta.status}`
            );
        }


        config = await resposta.json();


        console.log(
            "Configuração carregada:",
            config
        );


        aplicarConfig();


    } catch (erro) {

        console.error(
            "Erro ao carregar config.json:",
            erro
        );


        status.textContent =
            "❌ Erro ao carregar config.json.";

    }
}


// --------------------------------------------------
// MINDAR
// --------------------------------------------------

target.addEventListener(
    "targetFound",
    () => {

        status.textContent =
            "✅ Marcador encontrado.";

        console.log(
            "Marcador encontrado."
        );
    }
);


target.addEventListener(
    "targetLost",
    () => {

        status.textContent =
            "📷 Aponte a câmera para o marcador.";

        console.log(
            "Marcador perdido."
        );
    }
);


// --------------------------------------------------
// MODELO CARREGADO
// --------------------------------------------------

modelo.addEventListener(
    "model-loaded",
    () => {

        console.log(
            "✅ Modelo 3D carregado."
        );

    }
);


modelo.addEventListener(
    "model-error",
    (evento) => {

        console.error(
            "❌ Erro ao carregar modelo:",
            evento
        );

        status.textContent =
            "❌ Erro ao carregar modelo 3D.";

    }
);


// --------------------------------------------------
// INICIALIZAÇÃO
// --------------------------------------------------

scene.addEventListener(
    "loaded",
    async () => {

        console.log(
            "A-Frame carregado."
        );


        pivotVisual.setAttribute(
            "visible",
            "true"
        );


        modelo.setAttribute(
            "visible",
            "true"
        );


        await carregarConfig();


        // Começa mostrando Pivot
        mostrarGrupo(grupoPivot);

    }
);