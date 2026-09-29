const target = document.getElementById("targetZelda");
const pivot = document.getElementById("pivotEntity");
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

// ============================================================
// CONFIG
// ============================================================

async function carregarConfig() {

try {

    const resposta =
        await fetch(`${CONFIG_URL}?${Date.now()}`);

    if (!resposta.ok) {
        throw new Error("Erro ao carregar config.json");
    }

    config = await resposta.json();

    aplicarConfiguracao();

} catch (erro) {

    console.error(
        "Erro na configuração:",
        erro
    );

}

}

// ============================================================
// APLICAR CONFIG
// ============================================================

function aplicarConfiguracao() {

if (!config) {
    return;
}


// --------------------------------------------------------
// PIVOT
// --------------------------------------------------------

const posicaoPivot =
    new THREE.Vector3(
        Number(config.pivot?.x ?? 0),
        Number(config.pivot?.y ?? 0),
        Number(config.pivot?.z ?? 0)
    );


const rotacaoPivot =
    new THREE.Euler(
        THREE.MathUtils.degToRad(
            Number(config.pivotRotation?.x ?? 0)
        ),
        THREE.MathUtils.degToRad(
            Number(config.pivotRotation?.y ?? 0)
        ),
        THREE.MathUtils.degToRad(
            Number(config.pivotRotation?.z ?? 0)
        ),
        "XYZ"
    );


const quaternionPivot =
    new THREE.Quaternion()
        .setFromEuler(rotacaoPivot);


// --------------------------------------------------------
// OBJETO
// --------------------------------------------------------

const posicaoObjeto =
    new THREE.Vector3(
        Number(config.position?.x ?? 0),
        Number(config.position?.y ?? 0),
        Number(config.position?.z ?? 0)
    );


const rotacaoObjeto =
    new THREE.Euler(
        THREE.MathUtils.degToRad(
            Number(config.rotation?.x ?? 0)
        ),
        THREE.MathUtils.degToRad(
            Number(config.rotation?.y ?? 0)
        ),
        THREE.MathUtils.degToRad(
            Number(config.rotation?.z ?? 0)
        ),
        "XYZ"
    );


const quaternionObjeto =
    new THREE.Quaternion()
        .setFromEuler(rotacaoObjeto);


// --------------------------------------------------------
// CONVERTER OBJETO PARA O SISTEMA DO PIVOT
// --------------------------------------------------------

const inversaPivot =
    quaternionPivot.clone().invert();


const posicaoLocal =
    posicaoObjeto
        .clone()
        .sub(posicaoPivot)
        .applyQuaternion(inversaPivot);


const quaternionLocal =
    inversaPivot
        .clone()
        .multiply(quaternionObjeto);


// --------------------------------------------------------
// APLICAR PIVOT
// --------------------------------------------------------

pivot.object3D.position.copy(
    posicaoPivot
);

pivot.object3D.quaternion.copy(
    quaternionPivot
);


// --------------------------------------------------------
// OBJETO VIRA FILHO DO PIVOT
// --------------------------------------------------------

pivot.object3D.add(
    objeto.object3D
);


objeto.object3D.position.copy(
    posicaoLocal
);

objeto.object3D.quaternion.copy(
    quaternionLocal
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

    console.log("Marcador encontrado");

    tentarTocarAudio();

}

);

// ============================================================
// MARCADOR PERDIDO
// ============================================================

target.addEventListener(
"targetLost",
() => {

    marcadorVisivel = false;

    console.log("Marcador perdido");

}

);

// ============================================================
// ÁUDIO
// ============================================================

function tentarTocarAudio() {

if (!audio.src) {
    return;
}

audio.currentTime = 0;

audio.play().catch(
    () => {
        console.log(
            "Áudio aguardando interação do usuário."
        );
    }
);

}

// ============================================================
// TOQUE / ROTAÇÃO
// ============================================================

let tocando = false;
let ultimoX = 0;

document.addEventListener(
"touchstart",
evento => {

    if (evento.touches.length !== 1) {
        return;
    }

    tocando = true;

    ultimoX =
        evento.touches[0].clientX;


    // O primeiro toque também libera o áudio
    if (marcadorVisivel) {
        tentarTocarAudio();
    }

},
{
    passive: true
}

);

document.addEventListener(
"touchmove",
evento => {

    if (
        !tocando ||
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


    pivot.object3D.rotation.x -=
        deltaX * VELOCIDADE_ROTACAO;

},
{
    passive: true
}

);

document.addEventListener(
"touchend",
() => {

    tocando = false;

},
{
    passive: true
}

);

// ============================================================
// FULLSCREEN
// ============================================================

fullscreenButton.addEventListener(
"click",
async () => {

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

// ============================================================
// INICIAR
// ============================================================

carregarConfig();