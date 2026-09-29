const target = document.getElementById("targetZelda");
const objeto = document.getElementById("objectEntity");
const modelo = document.getElementById("heroModelObject");
const audio = document.getElementById("arAudio");
const fullscreenButton = document.getElementById("fullscreenButton");

const parametros = new URLSearchParams(window.location.search);
const pasta = parametros.get("pasta") || "zelda";

const CONFIG_URL =
"./marcadores/${pasta}/config.json";

const VELOCIDADE_ROTACAO = 0.01;

let config = null;
let marcadorVisivel = false;
let arrastando = false;
let ultimoX = 0;

// ============================================================
// CONFIGURAÇÃO
// ============================================================

async function carregarConfig() {

try {

    const resposta =
        await fetch(`${CONFIG_URL}?${Date.now()}`);

    if (!resposta.ok) {
        throw new Error("Não foi possível carregar config.json");
    }

    config = await resposta.json();

    aplicarConfiguracao();

} catch (erro) {

    console.error(
        "Erro ao carregar config.json:",
        erro
    );

}

}

// ============================================================
// APLICAR CONFIGURAÇÃO
// ============================================================

function aplicarConfiguracao() {

if (!config) {
    return;
}


// --------------------------------------------------------
// POSIÇÃO DO OBJETO
// EXATAMENTE COMO NA CALIBRAÇÃO
// --------------------------------------------------------

objeto.object3D.position.set(
    Number(config.position?.x ?? 0),
    Number(config.position?.y ?? 0),
    Number(config.position?.z ?? 0)
);


// --------------------------------------------------------
// ROTAÇÃO DO OBJETO
// EXATAMENTE COMO NA CALIBRAÇÃO
// --------------------------------------------------------

objeto.object3D.rotation.set(
    THREE.MathUtils.degToRad(
        Number(config.rotation?.x ?? 0)
    ),
    THREE.MathUtils.degToRad(
        Number(config.rotation?.y ?? 0)
    ),
    THREE.MathUtils.degToRad(
        Number(config.rotation?.z ?? 0)
    )
);


// --------------------------------------------------------
// ESCALA
// --------------------------------------------------------

const escala =
    Number(config.scale ?? 1);

modelo.object3D.scale.set(
    escala,
    escala,
    escala
);


// --------------------------------------------------------
// ÁUDIO
// --------------------------------------------------------

if (config.audio) {

    audio.src =
        `./marcadores/${pasta}/${config.audio}`;

    audio.preload = "auto";

    audio.load();

}

}

// ============================================================
// MARCADOR ENCONTRADO
// ============================================================

target.addEventListener(
"targetFound",
() => {

    marcadorVisivel = true;

    console.log("AR: marcador encontrado");

    // Tentativa automática.
    // Pode ser bloqueada pelo navegador.
    tocarAudio();

}

);

// ============================================================
// MARCADOR PERDIDO
// ============================================================

target.addEventListener(
"targetLost",
() => {

    marcadorVisivel = false;

    console.log("AR: marcador perdido");

}

);

// ============================================================
// ÁUDIO
// ============================================================

function tocarAudio() {

if (!audio.src) {
    console.log("AR: nenhum áudio configurado");
    return;
}


audio.play().then(
    () => {

        console.log(
            "AR: áudio reproduzindo"
        );

    }
).catch(
    erro => {

        console.log(
            "AR: áudio bloqueado até interação do usuário"
        );

    }
);

}

// ============================================================
// TOQUE
// ============================================================

document.addEventListener(
"touchstart",
evento => {

    if (evento.touches.length !== 1) {
        return;
    }


    arrastando = true;

    ultimoX =
        evento.touches[0].clientX;


    // ----------------------------------------------------
    // O toque do usuário libera o áudio no celular
    // ----------------------------------------------------

    if (marcadorVisivel) {
        tocarAudio();
    }

},
{
    passive: true,
    capture: true
}

);

// ============================================================
// MOVIMENTO DO DEDO
// ============================================================

document.addEventListener(
"touchmove",
evento => {

    if (
        !arrastando ||
        evento.touches.length !== 1
    ) {
        return;
    }


    const atualX =
        evento.touches[0].clientX;


    const deltaX =
        atualX - ultimoX;


    ultimoX =
        atualX;


    // ----------------------------------------------------
    // GIRA A PRÓPRIA PEÇA
    //
    // Não mexemos na posição.
    // Não mexemos no config.json.
    // ----------------------------------------------------

    objeto.object3D.rotation.x -=
        deltaX * VELOCIDADE_ROTACAO;

},
{
    passive: true,
    capture: true
}

);

// ============================================================
// FIM DO TOQUE
// ============================================================

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

// ============================================================
// FULLSCREEN
// ============================================================

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

            console.error(
                "Erro no fullscreen:",
                erro
            );

        }

    }
);

}

// ============================================================
// INICIAR
// ============================================================

carregarConfig();