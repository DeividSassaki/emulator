const target = document.getElementById("targetZelda");

const pivot = document.getElementById("pivotEntity");
const objeto = document.getElementById("objectEntity");
const modelo = document.getElementById("heroModelObject");
const audio = document.getElementById("arAudio");
const fullscreenButton = document.getElementById("fullscreenButton");

const parametros = new URLSearchParams(window.location.search);
const pasta = parametros.get("pasta") || "zelda";

const CONFIG_URL = `./marcadores/${pasta}/config.json`;
const VELOCIDADE_ROTACAO = 0.01;

let config = null;
let marcadorVisivel = false;
let arrastando = false;
let ultimoX = 0;

async function carregarConfig() {
    try {
        const resposta = await fetch(`${CONFIG_URL}?${Date.now()}`);

        if (!resposta.ok) {
            throw new Error("config.json não encontrado");
        }

        config = await resposta.json();
        aplicarConfiguracao();
    } catch (erro) {
        console.error("Erro ao carregar config.json:", erro);
    }
}

function aplicarConfiguracao() {
    if (!config) {
        return;
    }

    pivot.object3D.position.set(
        Number(config.pivot?.x ?? 0),
        Number(config.pivot?.y ?? 0),
        Number(config.pivot?.z ?? 0)
    );

    pivot.object3D.rotation.set(
        THREE.MathUtils.degToRad(Number(config.pivotRotation?.x ?? 0)),
        THREE.MathUtils.degToRad(Number(config.pivotRotation?.y ?? 0)),
        THREE.MathUtils.degToRad(Number(config.pivotRotation?.z ?? 0))
    );

    objeto.object3D.position.set(
        Number(config.position?.x ?? 0),
        Number(config.position?.y ?? 0),
        Number(config.position?.z ?? 0)
    );

    objeto.object3D.rotation.set(
        THREE.MathUtils.degToRad(Number(config.rotation?.x ?? 0)),
        THREE.MathUtils.degToRad(Number(config.rotation?.y ?? 0)),
        THREE.MathUtils.degToRad(Number(config.rotation?.z ?? 0))
    );

    const escala = Number(config.scale ?? 1);

    modelo.object3D.scale.set(
        escala,
        escala,
        escala
    );

    if (config.audio) {
        audio.src = `./marcadores/${pasta}/${config.audio}`;
        audio.preload = "auto";
        audio.load();
    }
}

target.addEventListener("targetFound", () => {
    marcadorVisivel = true;
    console.log("AR: marcador encontrado");
    tocarAudio();
});

target.addEventListener("targetLost", () => {
    marcadorVisivel = false;
    console.log("AR: marcador perdido");
});

function tocarAudio() {
    if (!audio.src) {
        console.log("AR: nenhum áudio configurado");
        return;
    }

    audio.play()
        .then(() => {
            console.log("AR: áudio reproduzindo");
        })
        .catch(() => {
            console.log("AR: áudio aguardando interação");
        });
}

document.addEventListener(
    "touchstart",
    () => {
        if (marcadorVisivel) {
            tocarAudio();
        }
    },
    {
        passive: true,
        once: false
    }
);

document.addEventListener(
    "touchstart",
    evento => {
        if (evento.touches.length !== 1) {
            return;
        }

        arrastando = true;
        ultimoX = evento.touches[0].clientX;
    },
    {
        passive: true,
        capture: true
    }
);

document.addEventListener(
    "touchmove",
    evento => {
        if (!arrastando || evento.touches.length !== 1) {
            return;
        }

        const atualX = evento.touches[0].clientX;
        const deltaX = atualX - ultimoX;
        ultimoX = atualX;

        const angulo = deltaX * VELOCIDADE_ROTACAO;

        const pos = objeto.object3D.position;
        const posPivot = pivot.object3D.position;

        const dx = pos.x - posPivot.x;
        const dz = pos.z - posPivot.z;

        const cos = Math.cos(angulo);
        const sin = Math.sin(angulo);

        const novoX = dx * cos - dz * sin;
        const novoZ = dx * sin + dz * cos;

        objeto.object3D.position.x = posPivot.x + novoX;
        objeto.object3D.position.z = posPivot.z + novoZ;

        objeto.object3D.rotation.y += angulo;
    },
    {
        passive: true,
        capture: true
    }
);

document.addEventListener(
    "touchend",
    () => {
        arrastando = false;
    },
    {
        passive: true,
        capture: true
    }
);

document.addEventListener(
    "touchcancel",
    () => {
        arrastando = false;
    },
    {
        passive: true,
        capture: true
    }
);

if (fullscreenButton) {
    fullscreenButton.addEventListener(
        "click",
        async evento => {
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
        }
    );
}

carregarConfig();
