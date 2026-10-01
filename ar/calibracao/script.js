const parametros = new URLSearchParams(window.location.search);
const pasta = parametros.get("pasta") || "zelda";
const configURL = `../marcadores/${pasta}/config.json`;

const sceneContainer = document.getElementById("sceneContainer");
const titulo = document.getElementById("titulo");
const status = document.getElementById("status");

const botaoPivotAvo = document.getElementById("botaoPivotAvo");
const botaoPivotPai = document.getElementById("botaoPivotPai");
const botaoObjeto = document.getElementById("botaoObjeto");

const botaoRotacao = document.getElementById("botaoRotacao");
const botaoMovimento = document.getElementById("botaoMovimento");

const sliderX = document.getElementById("sliderX");
const sliderY = document.getElementById("sliderY");
const sliderZ = document.getElementById("sliderZ");

const valorX = document.getElementById("valorX");
const valorY = document.getElementById("valorY");
const valorZ = document.getElementById("valorZ");

const labelX = document.getElementById("labelX");
const labelY = document.getElementById("labelY");
const labelZ = document.getElementById("labelZ");

const sliderEscala = document.getElementById("sliderEscala");
const valorEscala = document.getElementById("valorEscala");
const controleEscala = document.getElementById("controleEscala");
const grupoEscala = document.getElementById("grupoEscala");

const resetar = document.getElementById("resetar");
const copiarJSON = document.getElementById("copiarJSON");
const configuracao = document.getElementById("configuracao");

let configuracaoBase = null;
let scene = null;
let target = null;
let pivotAvo = null;
let pivotPai = null;
let objeto = null;
let modelo = null;

let elementoSelecionado = "pivotAvo";
let modoControle = "rotacao";

function numero(valor) {
    const n = Number(valor);
    return Number.isFinite(n) ? n : 0;
}

function arredondar(valor, casas = 2) {
    return Number(Number(valor).toFixed(casas));
}

function vetorZero() {
    return { x: 0, y: 0, z: 0 };
}

function arquivoURL(nomeArquivo) {
    return `../marcadores/${pasta}/${encodeURIComponent(nomeArquivo || "")}`;
}

function obterElementoSelecionado() {
    if (elementoSelecionado === "pivotAvo") {
        return pivotAvo?.object3D || null;
    }

    if (elementoSelecionado === "pivotPai") {
        return pivotPai?.object3D || null;
    }

    return objeto?.object3D || null;
}

function selecionarElemento(elemento) {
    elementoSelecionado = elemento;

    botaoPivotAvo.classList.toggle("ativo", elemento === "pivotAvo");
    botaoPivotPai.classList.toggle("ativo", elemento === "pivotPai");
    botaoObjeto.classList.toggle("ativo", elemento === "objeto");

    atualizarInterface();
}

function selecionarModo(modo) {
    modoControle = modo;

    botaoRotacao.classList.toggle("ativo", modo === "rotacao");
    botaoMovimento.classList.toggle("ativo", modo === "movimento");

    atualizarInterface();
}

function atualizarInterface() {
    const elemento = obterElementoSelecionado();

    if (!elemento) {
        return;
    }

    if (modoControle === "rotacao") {
        labelX.textContent = "Rotação X";
        labelY.textContent = "Rotação Y";
        labelZ.textContent = "Rotação Z";

        sliderX.min = -360;
        sliderX.max = 360;
        sliderX.step = 0.1;

        sliderY.min = -360;
        sliderY.max = 360;
        sliderY.step = 0.1;

        sliderZ.min = -360;
        sliderZ.max = 360;
        sliderZ.step = 0.1;

        sliderX.value = arredondar(THREE.MathUtils.radToDeg(elemento.rotation.x), 1);
        sliderY.value = arredondar(THREE.MathUtils.radToDeg(elemento.rotation.y), 1);
        sliderZ.value = arredondar(THREE.MathUtils.radToDeg(elemento.rotation.z), 1);

        valorX.textContent = Number(sliderX.value).toFixed(2);
        valorY.textContent = Number(sliderY.value).toFixed(2);
        valorZ.textContent = Number(sliderZ.value).toFixed(2);
    } else {
        labelX.textContent = "Posição X";
        labelY.textContent = "Posição Y";
        labelZ.textContent = "Posição Z";

        sliderX.min = -5;
        sliderX.max = 5;
        sliderX.step = 0.001;

        sliderY.min = -5;
        sliderY.max = 5;
        sliderY.step = 0.001;

        sliderZ.min = -5;
        sliderZ.max = 5;
        sliderZ.step = 0.001;

        sliderX.value = arredondar(elemento.position.x, 3);
        sliderY.value = arredondar(elemento.position.y, 3);
        sliderZ.value = arredondar(elemento.position.z, 3);

        valorX.textContent = Number(sliderX.value).toFixed(3);
        valorY.textContent = Number(sliderY.value).toFixed(3);
        valorZ.textContent = Number(sliderZ.value).toFixed(3);
    }

    const mostrarEscala = elementoSelecionado === "objeto";
    controleEscala.style.display = mostrarEscala ? "block" : "none";
    grupoEscala.style.display = mostrarEscala ? "block" : "none";

    if (mostrarEscala) {
        const escala = objeto.object3D.scale.x;
        sliderEscala.value = arredondar(escala, 2);
        valorEscala.textContent = Number(sliderEscala.value).toFixed(2);
    }

    atualizarJSON();
}

function alterarEixo(eixo, valor) {
    const elemento = obterElementoSelecionado();

    if (!elemento) {
        return;
    }

    const numeroValor = Number(valor);

    if (modoControle === "rotacao") {
        elemento.rotation[eixo] = THREE.MathUtils.degToRad(numeroValor);
    } else {
        elemento.position[eixo] = numeroValor;
    }

    atualizarInterface();
}

function resetarTudo() {
    pivotAvo.object3D.position.set(0, 0, 0);
    pivotAvo.object3D.rotation.set(0, 0, 0);

    pivotPai.object3D.position.set(0, 0, 0);
    pivotPai.object3D.rotation.set(0, 0, 0);

    objeto.object3D.position.set(0, 0, 0);
    objeto.object3D.rotation.set(0, 0, 0);
    objeto.object3D.scale.set(1, 1, 1);

    atualizarInterface();
}

function gerarConfiguracao() {
    const avo = pivotAvo.object3D;
    const pai = pivotPai.object3D;
    const obj = objeto.object3D;

    const resultado = {
        nome: configuracaoBase?.nome || "AR",
        modelo: configuracaoBase?.modelo ?? null,
        marcador: configuracaoBase?.marcador ?? "targets.mind",

        pivotAvo: {
            position: {
                x: arredondar(avo.position.x, 4),
                y: arredondar(avo.position.y, 4),
                z: arredondar(avo.position.z, 4)
            },
            rotation: {
                x: arredondar(THREE.MathUtils.radToDeg(avo.rotation.x), 2),
                y: arredondar(THREE.MathUtils.radToDeg(avo.rotation.y), 2),
                z: arredondar(THREE.MathUtils.radToDeg(avo.rotation.z), 2)
            }
        },

        pivotPai: {
            position: {
                x: arredondar(pai.position.x, 4),
                y: arredondar(pai.position.y, 4),
                z: arredondar(pai.position.z, 4)
            },
            rotation: {
                x: arredondar(THREE.MathUtils.radToDeg(pai.rotation.x), 2),
                y: arredondar(THREE.MathUtils.radToDeg(pai.rotation.y), 2),
                z: arredondar(THREE.MathUtils.radToDeg(pai.rotation.z), 2)
            }
        },

        position: {
            x: arredondar(obj.position.x, 4),
            y: arredondar(obj.position.y, 4),
            z: arredondar(obj.position.z, 4)
        },

        rotation: {
            x: arredondar(THREE.MathUtils.radToDeg(obj.rotation.x), 2),
            y: arredondar(THREE.MathUtils.radToDeg(obj.rotation.y), 2),
            z: arredondar(THREE.MathUtils.radToDeg(obj.rotation.z), 2)
        },

        scale: arredondar(obj.scale.x, 4)
    };

    if (Object.prototype.hasOwnProperty.call(configuracaoBase || {}, "audio")) {
        resultado.audio = configuracaoBase.audio;
    }

    if (Object.prototype.hasOwnProperty.call(configuracaoBase || {}, "imagem")) {
        resultado.imagem = configuracaoBase.imagem;
    }

    if (Object.prototype.hasOwnProperty.call(configuracaoBase || {}, "video")) {
        resultado.video = configuracaoBase.video;
    }

    return resultado;
}

function atualizarJSON() {
    if (!configuracaoBase || !pivotAvo || !pivotPai || !objeto) {
        return;
    }

    configuracao.textContent = JSON.stringify(
        gerarConfiguracao(),
        null,
        2
    );
}

function aplicarConfiguracao(config) {
    if (!pivotAvo || !pivotPai || !objeto) {
        return;
    }

    const avoPosition = config.pivotAvo?.position || vetorZero();
    const avoRotation = config.pivotAvo?.rotation || vetorZero();

    pivotAvo.object3D.position.set(
        numero(avoPosition.x),
        numero(avoPosition.y),
        numero(avoPosition.z)
    );

    pivotAvo.object3D.rotation.set(
        THREE.MathUtils.degToRad(numero(avoRotation.x)),
        THREE.MathUtils.degToRad(numero(avoRotation.y)),
        THREE.MathUtils.degToRad(numero(avoRotation.z))
    );

    const paiPosition = config.pivotPai?.position || vetorZero();
    const paiRotation = config.pivotPai?.rotation || vetorZero();

    pivotPai.object3D.position.set(
        numero(paiPosition.x),
        numero(paiPosition.y),
        numero(paiPosition.z)
    );

    pivotPai.object3D.rotation.set(
        THREE.MathUtils.degToRad(numero(paiRotation.x)),
        THREE.MathUtils.degToRad(numero(paiRotation.y)),
        THREE.MathUtils.degToRad(numero(paiRotation.z))
    );

    const objectPosition = config.position || vetorZero();
    const objectRotation = config.rotation || vetorZero();

    objeto.object3D.position.set(
        numero(objectPosition.x),
        numero(objectPosition.y),
        numero(objectPosition.z)
    );

    objeto.object3D.rotation.set(
        THREE.MathUtils.degToRad(numero(objectRotation.x)),
        THREE.MathUtils.degToRad(numero(objectRotation.y)),
        THREE.MathUtils.degToRad(numero(objectRotation.z))
    );

    const escala = numero(config.scale) || 1;

    objeto.object3D.scale.set(
        escala,
        escala,
        escala
    );

    atualizarInterface();
}

function criarCena() {
    const marcadorArquivo = configuracaoBase.marcador || "targets.mind";
    const modeloArquivo = configuracaoBase.modelo || "";

    if (!modeloArquivo) {
        throw new Error("config.json não informa o modelo.");
    }

    scene = document.createElement("a-scene");
    scene.id = "scene";
    scene.setAttribute("mindar-image", `
        imageTargetSrc: ${arquivoURL(marcadorArquivo)};
        autoStart: true;
        missTolerance: 20;
        filterMinCF: 0.0001;
        filterBeta: 1000;
        uiLoading: no;
        uiError: no;
        uiScanning: no;
    `);
    scene.setAttribute("embedded", "");
    scene.setAttribute("color-space", "sRGB");
    scene.setAttribute("renderer", "alpha: true; colorManagement: true; physicallyCorrectLights: true;");
    scene.setAttribute("vr-mode-ui", "enabled: false");
    scene.setAttribute("device-orientation-permission-ui", "enabled: false");

    const camera = document.createElement("a-camera");
    camera.setAttribute("position", "0 0 0");
    camera.setAttribute("look-controls", "enabled:false");
    scene.appendChild(camera);

    const assets = document.createElement("a-assets");
    const assetItem = document.createElement("a-asset-item");
    assetItem.id = "heroModel";
    assetItem.setAttribute("src", arquivoURL(modeloArquivo));
    assets.appendChild(assetItem);
    scene.appendChild(assets);

    target = document.createElement("a-entity");
    target.id = "targetZelda";
    target.setAttribute("mindar-image-target", "targetIndex: 0");

    pivotAvo = document.createElement("a-entity");
    pivotAvo.id = "pivotAvo";
    pivotAvo.setAttribute("position", "0 0 0");
    pivotAvo.setAttribute("rotation", "0 0 0");

    const visualPivotAvo = document.createElement("a-entity");
    visualPivotAvo.id = "visualPivotAvo";

    const avoX = document.createElement("a-box");
    avoX.setAttribute("position", "0.075 0 0");
    avoX.setAttribute("width", "0.15");
    avoX.setAttribute("height", "0.008");
    avoX.setAttribute("depth", "0.008");
    avoX.setAttribute("color", "red");

    const avoY = document.createElement("a-box");
    avoY.setAttribute("position", "0 0.075 0");
    avoY.setAttribute("width", "0.008");
    avoY.setAttribute("height", "0.15");
    avoY.setAttribute("depth", "0.008");
    avoY.setAttribute("color", "green");

    const avoZ = document.createElement("a-box");
    avoZ.setAttribute("position", "0 0 0.075");
    avoZ.setAttribute("width", "0.008");
    avoZ.setAttribute("height", "0.008");
    avoZ.setAttribute("depth", "0.15");
    avoZ.setAttribute("color", "blue");

    const avoCentro = document.createElement("a-sphere");
    avoCentro.setAttribute("radius", "0.025");
    avoCentro.setAttribute("color", "yellow");

    visualPivotAvo.appendChild(avoX);
    visualPivotAvo.appendChild(avoY);
    visualPivotAvo.appendChild(avoZ);
    visualPivotAvo.appendChild(avoCentro);
    pivotAvo.appendChild(visualPivotAvo);

    pivotPai = document.createElement("a-entity");
    pivotPai.id = "pivotPai";
    pivotPai.setAttribute("position", "0 0 0");
    pivotPai.setAttribute("rotation", "0 0 0");

    const visualPivotPai = document.createElement("a-entity");
    visualPivotPai.id = "visualPivotPai";

    const paiX = document.createElement("a-box");
    paiX.setAttribute("position", "0.055 0 0");
    paiX.setAttribute("width", "0.11");
    paiX.setAttribute("height", "0.005");
    paiX.setAttribute("depth", "0.005");
    paiX.setAttribute("color", "orange");

    const paiY = document.createElement("a-box");
    paiY.setAttribute("position", "0 0.055 0");
    paiY.setAttribute("width", "0.005");
    paiY.setAttribute("height", "0.11");
    paiY.setAttribute("depth", "0.005");
    paiY.setAttribute("color", "cyan");

    const paiZ = document.createElement("a-box");
    paiZ.setAttribute("position", "0 0 0.055");
    paiZ.setAttribute("width", "0.005");
    paiZ.setAttribute("height", "0.005");
    paiZ.setAttribute("depth", "0.11");
    paiZ.setAttribute("color", "magenta");

    const paiCentro = document.createElement("a-sphere");
    paiCentro.setAttribute("radius", "0.018");
    paiCentro.setAttribute("color", "white");

    visualPivotPai.appendChild(paiX);
    visualPivotPai.appendChild(paiY);
    visualPivotPai.appendChild(paiZ);
    visualPivotPai.appendChild(paiCentro);
    pivotPai.appendChild(visualPivotPai);

    objeto = document.createElement("a-entity");
    objeto.id = "objectEntity";
    objeto.setAttribute("gltf-model", "#heroModel");
    objeto.setAttribute("position", "0 0 0");
    objeto.setAttribute("rotation", "0 0 0");
    objeto.setAttribute("scale", "1 1 1");

    pivotPai.appendChild(objeto);
    pivotAvo.appendChild(pivotPai);
    target.appendChild(pivotAvo);

    const luzAmbient = document.createElement("a-light");
    luzAmbient.setAttribute("type", "ambient");
    luzAmbient.setAttribute("intensity", "2");

    const luzDirectional = document.createElement("a-light");
    luzDirectional.setAttribute("type", "directional");
    luzDirectional.setAttribute("intensity", "3");
    luzDirectional.setAttribute("position", "1 3 2");

    target.appendChild(luzAmbient);
    target.appendChild(luzDirectional);
    scene.appendChild(target);

    if (configuracaoBase.nome) {
        titulo.textContent = `Calibração AR — ${configuracaoBase.nome}`;
    }

    target.addEventListener("targetFound", () => {
        status.textContent = "Marcador encontrado.";
        aplicarConfiguracao(configuracaoBase);
    });

    target.addEventListener("targetLost", () => {
        status.textContent = "Marcador não encontrado.";
    });

    scene.addEventListener("loaded", () => {
        aplicarConfiguracao(configuracaoBase);
        atualizarModeloDeInterface();
        status.textContent = "Configuração carregada. Aponte para o marcador.";
    }, { once: true });

    sceneContainer.appendChild(scene);

    modelo = objeto;
}

function atualizarModeloDeInterface() {
    atualizarInterface();
}

function arquivoURL(nomeArquivo) {
    return `../marcadores/${pasta}/${encodeURIComponent(nomeArquivo || "")}`;
}

sliderX.addEventListener("input", () => alterarEixo("x", sliderX.value));
sliderY.addEventListener("input", () => alterarEixo("y", sliderY.value));
sliderZ.addEventListener("input", () => alterarEixo("z", sliderZ.value));

sliderEscala.addEventListener("input", () => {
    if (!objeto) {
        return;
    }

    const escala = Number(sliderEscala.value);
    objeto.object3D.scale.set(escala, escala, escala);
    valorEscala.textContent = escala.toFixed(2);
    atualizarJSON();
});

resetar.addEventListener("click", resetarTudo);

copiarJSON.addEventListener("click", async () => {
    const texto = configuracao.textContent;

    try {
        await navigator.clipboard.writeText(texto);
        const original = copiarJSON.textContent;
        copiarJSON.textContent = "✓ JSON Copiado";

        setTimeout(() => {
            copiarJSON.textContent = original;
        }, 1500);
    } catch (erro) {
        console.error(erro);
        alert("Não foi possível copiar o JSON.");
    }
});

botaoPivotAvo.addEventListener("click", () => selecionarElemento("pivotAvo"));
botaoPivotPai.addEventListener("click", () => selecionarElemento("pivotPai"));
botaoObjeto.addEventListener("click", () => selecionarElemento("objeto"));

botaoRotacao.addEventListener("click", () => selecionarModo("rotacao"));
botaoMovimento.addEventListener("click", () => selecionarModo("movimento"));

async function carregarConfiguracao() {
    try {
        const resposta = await fetch(`${configURL}?${Date.now()}`);

        if (!resposta.ok) {
            throw new Error(`Erro HTTP ${resposta.status}`);
        }

        configuracaoBase = await resposta.json();

        criarCena();
    } catch (erro) {
        console.error("Erro ao carregar configuração:", erro);
        status.textContent = "Erro ao carregar config.json.";
    }
}

carregarConfiguracao();
