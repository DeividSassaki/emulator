const target = document.getElementById("targetZelda");
const pivot = document.getElementById("pivotEntity");
const objeto = document.getElementById("objectEntity");
const modelo = document.getElementById("heroModelObject");
const audio = document.getElementById("arAudio");
const fullscreenButton = document.getElementById("fullscreenButton");

// ============================================================
// PASTA
// ============================================================

const parametros =
new URLSearchParams(window.location.search);

const pasta =
parametros.get("pasta") || "zelda";

// ============================================================
// CONFIG
// ============================================================

const CONFIG_URL =
"./marcadores/${pasta}/config.json";

const VELOCIDADE_ROTACAO = 0.01;

// ============================================================
// ESTADO
// ============================================================

let config = null;

let marcadorVisivel = false;

let arrastando = false;

let ultimoX = 0;

// ============================================================
// CARREGAR CONFIGURAÇÃO
// ============================================================

async function carregarConfig() {

try {

    const resposta =
        await fetch(
            `${CONFIG_URL}?${Date.now()}`
        );


    if (!resposta.ok) {

        throw new Error(
            "config.json não encontrado"
        );

    }


    config =
        await resposta.json();


    aplicarConfiguracao();


    console.log(
        "AR: configuração carregada",
        config
    );


} catch (erro) {

    console.error(
        "AR: erro ao carregar config.json",
        erro
    );

}

}

// ============================================================
// APLICAR CONFIGURAÇÃO
//
// EXATAMENTE COMO NA CALIBRAÇÃO
// ============================================================

function aplicarConfiguracao() {

if (!config) {
    return;
}


// ========================================================
// PIVOT
// ========================================================

pivot.object3D.position.set(

    Number(config.pivot?.x ?? 0),

    Number(config.pivot?.y ?? 0),

    Number(config.pivot?.z ?? 0)

);


pivot.object3D.rotation.set(

    THREE.MathUtils.degToRad(
        Number(config.pivotRotation?.x ?? 0)
    ),

    THREE.MathUtils.degToRad(
        Number(config.pivotRotation?.y ?? 0)
    ),

    THREE.MathUtils.degToRad(
        Number(config.pivotRotation?.z ?? 0)
    )

);


// ========================================================
// OBJETO
// ========================================================

objeto.object3D.position.set(

    Number(config.position?.x ?? 0),

    Number(config.position?.y ?? 0),

    Number(config.position?.z ?? 0)

);


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


// ========================================================
// ESCALA
// ========================================================

const escala =
    Number(config.scale ?? 1);


modelo.object3D.scale.set(
    escala,
    escala,
    escala
);


// ========================================================
// ÁUDIO
// ========================================================

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

    console.log(
        "AR: marcador encontrado"
    );


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

    console.log(
        "AR: marcador perdido"
    );

}

);

// ============================================================
// ÁUDIO
// ============================================================

function tocarAudio() {

if (!audio.src) {

    console.log(
        "AR: nenhum áudio configurado"
    );

    return;

}


audio.play()
    .then(() => {

        console.log(
            "AR: áudio reproduzindo"
        );

    })
    .catch(() => {

        console.log(
            "AR: áudio aguardando interação"
        );

    });

}

// ============================================================
// TOQUE
// ============================================================

document.addEventListener(
"touchstart",
evento => {

    if (
        evento.touches.length !== 1
    ) {

        return;

    }


    arrastando = true;


    ultimoX =
        evento.touches[0].clientX;


    // Tenta liberar o áudio através
    // da interação do usuário.

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
// MOVIMENTO
//
// PIVOT E OBJETO CONTINUAM INDEPENDENTES.
//
// O pivot é usado somente como ponto
// de referência para calcular a órbita.
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


    const angulo =
        deltaX * VELOCIDADE_ROTACAO;


    // ====================================================
    // POSIÇÃO ATUAL
    // ====================================================

    const pos =
        objeto.object3D.position;


    const posPivot =
        pivot.object3D.position;


    // ====================================================
    // DISTÂNCIA ENTRE OBJETO E PIVOT
    // ====================================================

    const dx =
        pos.x - posPivot.x;


    const dz =
        pos.z - posPivot.z;


    // ====================================================
    // ROTAÇÃO DA POSIÇÃO AO REDOR DO PIVOT
    // ====================================================

    const cos =
        Math.cos(angulo);

    const sin =
        Math.sin(angulo);


    const novoX =
        dx * cos - dz * sin;


    const novoZ =
        dx * sin + dz * cos;


    objeto.object3D.position.x =
        posPivot.x + novoX;


    objeto.object3D.position.z =
        posPivot.z + novoZ;


    // ====================================================
    // ROTAÇÃO DO PRÓPRIO OBJETO
    // ====================================================

    objeto.object3D.rotation.y +=
        angulo;

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

            if (
                !document.fullscreenElement
            ) {

                await document
                    .documentElement
                    .requestFullscreen();

            } else {

                await document.exitFullscreen();

            }

        } catch (erro) {

            console.error(
                "AR: erro no fullscreen",
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