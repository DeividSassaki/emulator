const parametros = new URLSearchParams(window.location.search);
const pasta = parametros.get("pasta") || "zelda";
const configURL = `./marcadores/${pasta}/config.json`;

const container = document.getElementById("arContainer");
const audio = document.getElementById("arAudio");
const freezeButton = document.getElementById("freezeButton");
const fullscreenButton = document.getElementById("fullscreenButton");

const VELOCIDADE_ROTACAO = 0.01;
const ESCALA_MINIMA = 0.2;
const ESCALA_MAXIMA = 3.5;

let config = null;
let scene = null;
let target = null;
let pivotAvo = null;
let pivotPai = null;
let objeto = null;
let modelo = null;

let marcadorVisivel = false;
let modeloCarregado = false;
let congelado = false;

let frozenPivot = null;
let frozenObject = null;
let frozenModel = null;
let frozenAmbientLight = null;
let frozenDirectionalLight = null;

let arrastando = false;
let ultimoX = 0;
let ultimoY = 0;

let usandoPinch = false;
let distanciaInicialPinch = 0;
let escalaInicialPinch = 1;

function numero(valor) {
    const n = Number(valor);
    return Number.isFinite(n) ? n : 0;
}

function vetorZero() {
    return { x: 0, y: 0, z: 0 };
}

function arquivoURL(nomeArquivo) {
    return `./marcadores/${pasta}/${encodeURIComponent(nomeArquivo || "")}`;
}

function obterPivotAtivo() {
    if (congelado && frozenPivot) {
        return frozenPivot.object3D;
    }
    return pivotPai.object3D;
}

function obterObjetoAtivo() {
    if (congelado && frozenObject) {
        return frozenObject.object3D;
    }
    return objeto.object3D;
}

function aplicarConfiguracao() {
    if (!config || !pivotAvo || !pivotPai || !objeto) {
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

    const escala = Number(config.scale);
    const escalaFinal = Number.isFinite(escala) ? escala : 1;

    objeto.object3D.scale.set(
        escalaFinal,
        escalaFinal,
        escalaFinal
    );

    if (config.audio) {
        audio.src = arquivoURL(config.audio);
        audio.preload = "auto";
        audio.load();
    }
}

function distanciaEntreDedos(touches) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.hypot(dx, dy);
}

function criarCena() {
    const marcadorArquivo = config.marcador || "targets.mind";
    const modeloArquivo = config.modelo || "";

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
    scene.setAttribute("renderer", "colorManagement: true; physicallyCorrectLights: true;");
    scene.setAttribute("vr-mode-ui", "enabled: false");
    scene.setAttribute("device-orientation-permission-ui", "enabled: false");

    const camera = document.createElement("a-camera");
    camera.setAttribute("position", "0 0 0");
    camera.setAttribute("look-controls", "enabled: false");
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

    pivotPai = document.createElement("a-entity");
    pivotPai.id = "pivotPai";
    pivotPai.setAttribute("position", "0 0 0");
    pivotPai.setAttribute("rotation", "0 0 0");

    objeto = document.createElement("a-entity");
    objeto.id = "objectEntity";
    objeto.setAttribute("position", "0 0 0");
    objeto.setAttribute("rotation", "0 0 0");
    objeto.setAttribute("scale", "1 1 1");

    modelo = document.createElement("a-gltf-model");
    modelo.id = "heroModelObject";
    modelo.setAttribute("src", "#heroModel");
    modelo.setAttribute("position", "0 0 0");
    modelo.setAttribute("rotation", "0 0 0");

    objeto.appendChild(modelo);
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

    container.appendChild(scene);

    if (config.nome) {
        document.title = config.nome;
    }

    modelo.addEventListener("model-loaded", () => {
        modeloCarregado = true;
        atualizarBotaoFreeze();
    });

    target.addEventListener("targetFound", () => {
        marcadorVisivel = true;
        if (!congelado) {
            aplicarConfiguracao();
        }
        atualizarBotaoFreeze();
        tocarAudio();
    });

    target.addEventListener("targetLost", () => {
        marcadorVisivel = false;
        arrastando = false;
        usandoPinch = false;
        atualizarBotaoFreeze();
    });
}

function atualizarBotaoFreeze() {
    if (!freezeButton) {
        return;
    }

    if (congelado) {
        freezeButton.disabled = false;
        freezeButton.classList.add("frozen");
        return;
    }

    freezeButton.classList.remove("frozen");
    freezeButton.disabled = !(marcadorVisivel && modeloCarregado);
}

function tocarAudio() {
    if (!audio.src) {
        return;
    }

    audio.play().catch(() => {});
}

function criarLuzesCongeladas() {
    frozenAmbientLight = document.createElement("a-light");
    frozenAmbientLight.setAttribute("type", "ambient");
    frozenAmbientLight.setAttribute("intensity", "2");

    frozenDirectionalLight = document.createElement("a-light");
    frozenDirectionalLight.setAttribute("type", "directional");
    frozenDirectionalLight.setAttribute("intensity", "3");
    frozenDirectionalLight.setAttribute("position", "1 3 2");

    scene.appendChild(frozenAmbientLight);
    scene.appendChild(frozenDirectionalLight);
}

function removerLuzesCongeladas() {
    if (frozenAmbientLight?.parentNode) {
        frozenAmbientLight.parentNode.removeChild(frozenAmbientLight);
    }

    if (frozenDirectionalLight?.parentNode) {
        frozenDirectionalLight.parentNode.removeChild(frozenDirectionalLight);
    }

    frozenAmbientLight = null;
    frozenDirectionalLight = null;
}

function congelarObjeto() {
    if (congelado || !marcadorVisivel || !modeloCarregado) {
        return;
    }

    scene.object3D.updateMatrixWorld(true);

    frozenPivot = document.createElement("a-entity");
    frozenObject = document.createElement("a-entity");

    scene.appendChild(frozenPivot);
    frozenPivot.appendChild(frozenObject);

    const posicaoMundo = new THREE.Vector3();
    const quaternionMundo = new THREE.Quaternion();
    const escalaMundo = new THREE.Vector3();

    pivotPai.object3D.getWorldPosition(posicaoMundo);
    pivotPai.object3D.getWorldQuaternion(quaternionMundo);
    pivotPai.object3D.getWorldScale(escalaMundo);

    frozenPivot.object3D.position.copy(posicaoMundo);
    frozenPivot.object3D.quaternion.copy(quaternionMundo);
    frozenPivot.object3D.scale.copy(escalaMundo);

    frozenObject.object3D.position.copy(objeto.object3D.position);
    frozenObject.object3D.quaternion.copy(objeto.object3D.quaternion);
    frozenObject.object3D.scale.copy(objeto.object3D.scale);

    frozenModel = modelo.object3D.clone(true);
    frozenObject.object3D.add(frozenModel);

    objeto.object3D.visible = false;

    const luzes = target.querySelectorAll("a-light");
    luzes.forEach(luz => {
        luz.object3D.visible = false;
    });

    criarLuzesCongeladas();

    congelado = true;
    arrastando = false;
    usandoPinch = false;

    atualizarBotaoFreeze();
}

function descongelarObjeto() {
    if (!congelado || !marcadorVisivel) {
        return;
    }

    if (frozenPivot?.parentNode) {
        frozenPivot.parentNode.removeChild(frozenPivot);
    }

    removerLuzesCongeladas();

    objeto.object3D.visible = true;

    const luzes = target.querySelectorAll("a-light");
    luzes.forEach(luz => {
        luz.object3D.visible = true;
    });

    frozenPivot = null;
    frozenObject = null;
    frozenModel = null;

    congelado = false;
    arrastando = false;
    usandoPinch = false;

    aplicarConfiguracao();
    atualizarBotaoFreeze();
}

function iniciarToque(evento) {
    if (evento.target.closest("#freezeButton, #fullscreenButton")) {
        return;
    }

    if (!marcadorVisivel && !congelado) {
        return;
    }

    if (evento.touches.length === 2) {
        arrastando = false;
        usandoPinch = true;
        distanciaInicialPinch = distanciaEntreDedos(evento.touches);
        escalaInicialPinch = obterObjetoAtivo().scale.x;
        return;
    }

    if (evento.touches.length === 1) {
        usandoPinch = false;
        arrastando = true;
        ultimoX = evento.touches[0].clientX;
        ultimoY = evento.touches[0].clientY;
    }
}

function moverToque(evento) {
    if (!marcadorVisivel && !congelado) {
        return;
    }

    if (evento.touches.length === 2 && usandoPinch) {
        const distanciaAtual = distanciaEntreDedos(evento.touches);

        if (distanciaInicialPinch <= 0) {
            return;
        }

        let novaEscala = escalaInicialPinch * (distanciaAtual / distanciaInicialPinch);
        novaEscala = Math.max(ESCALA_MINIMA, Math.min(ESCALA_MAXIMA, novaEscala));

        const escala = obterObjetoAtivo().scale;
        escala.set(novaEscala, novaEscala, novaEscala);
        return;
    }

    if (evento.touches.length !== 1 || !arrastando) {
        return;
    }

    const atualX = evento.touches[0].clientX;
    const atualY = evento.touches[0].clientY;

    const deltaX = atualX - ultimoX;
    const deltaY = atualY - ultimoY;

    ultimoX = atualX;
    ultimoY = atualY;

    const pivot = obterPivotAtivo();

    pivot.rotation.y += deltaX * VELOCIDADE_ROTACAO;
    pivot.rotation.x += deltaY * VELOCIDADE_ROTACAO;
}

function terminarToque(evento) {
    if (evento.touches.length === 0) {
        arrastando = false;
        usandoPinch = false;
        return;
    }

    if (evento.touches.length === 1) {
        usandoPinch = false;
        arrastando = true;
        ultimoX = evento.touches[0].clientX;
        ultimoY = evento.touches[0].clientY;
    }
}

function configurarEventosInterface() {
    freezeButton.addEventListener("click", evento => {
        evento.stopPropagation();
        if (congelado) {
            descongelarObjeto();
        } else {
            congelarObjeto();
        }
    });

    fullscreenButton.addEventListener("click", async evento => {
        evento.stopPropagation();
        try {
            if (!document.fullscreenElement) {
                await document.documentElement.requestFullscreen();
            } else {
                await document.exitFullscreen();
            }
        } catch (erro) {
            console.error("Erro no fullscreen:", erro);
        }
    });

    document.addEventListener("touchstart", iniciarToque, {
        passive: true,
        capture: true
    });

    document.addEventListener("touchmove", moverToque, {
        passive: true,
        capture: true
    });

    document.addEventListener("touchend", terminarToque, {
        passive: true,
        capture: true
    });

    document.addEventListener("touchcancel", () => {
        arrastando = false;
        usandoPinch = false;
    }, {
        passive: true,
        capture: true
    });
}

async function carregarConfig() {
    try {
        const resposta = await fetch(`${configURL}?${Date.now()}`);

        if (!resposta.ok) {
            throw new Error(`Erro HTTP ${resposta.status}`);
        }

        config = await resposta.json();

        criarCena();
        aplicarConfiguracao();

        console.log("AR carregado:", pasta);
        console.log("Modelo:", config.modelo);
        console.log("Marcador:", config.marcador);
    } catch (erro) {
        console.error("Erro ao carregar AR:", erro);
        freezeButton.disabled = true;
    }
}

configurarEventosInterface();
carregarConfig();
