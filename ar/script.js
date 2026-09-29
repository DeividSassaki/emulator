const scene = document.getElementById("scene");

const target = document.getElementById("targetZelda");

const pivot = document.getElementById("pivotEntity");

const objeto = document.getElementById("objectEntity");

const modelo = document.getElementById("heroModelObject");

const audio = document.getElementById("arAudio");

const fullscreenButton =
document.getElementById("fullscreenButton");

// ============================================================
// CONFIGURAÇÃO
// ============================================================

const parametros =
new URLSearchParams(window.location.search);

const pasta =
parametros.get("pasta") || "zelda";

const CONFIG_URL =
"./marcadores/${pasta}/config.json";

// ============================================================
// VELOCIDADE DA ROTAÇÃO
// ============================================================

const VELOCIDADE_ROTACAO = 0.01;

// ============================================================
// CONFIGURAÇÃO
// ============================================================

let config = null;

// ============================================================
// CARREGAR CONFIG
// ============================================================

async function carregarConfig() {

try {

    const resposta =
        await fetch(
            `${CONFIG_URL}?${Date.now()}`
        );

    if (!resposta.ok) {

        throw new Error(
            "Não foi possível carregar config.json"
        );

    }

    config = await resposta.json();

    aplicarConfiguracao();

} catch (erro) {

    console.error(
        "Erro ao carregar configuração:",
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
// PIVOT
// --------------------------------------------------------

const pivotPosition =
    new THREE.Vector3(
        Number(config.pivot?.x || 0),
        Number(config.pivot?.y || 0),
        Number(config.pivot?.z || 0)
    );


const pivotEuler =
    new THREE.Euler(
        THREE.MathUtils.degToRad(
            Number(config.pivotRotation?.x || 0)
        ),
        THREE.MathUtils.degToRad(
            Number(config.pivotRotation?.y || 0)
        ),
        THREE.MathUtils.degToRad(
            Number(config.pivotRotation?.z || 0)
        ),
        "XYZ"
    );


const pivotQuaternion =
    new THREE.Quaternion()
        .setFromEuler(pivotEuler);


pivot.object3D.position.copy(
    pivotPosition
);

pivot.object3D.quaternion.copy(
    pivotQuaternion
);


// --------------------------------------------------------
// POSIÇÃO ORIGINAL DO OBJETO
// --------------------------------------------------------

const objectPosition =
    new THREE.Vector3(
        Number(config.position?.x || 0),
        Number(config.position?.y || 0),
        Number(config.position?.z || 0)
    );


const objectEuler =
    new THREE.Euler(
        THREE.MathUtils.degToRad(
            Number(config.rotation?.x || 0)
        ),
        THREE.MathUtils.degToRad(
            Number(config.rotation?.y || 0)
        ),
        THREE.MathUtils.degToRad(
            Number(config.rotation?.z || 0)
        ),
        "XYZ"
    );


const objectQuaternion =
    new THREE.Quaternion()
        .setFromEuler(objectEuler);


// --------------------------------------------------------
// TRANSFORMAR A POSIÇÃO DO OBJETO
// PARA COORDENADAS LOCAIS DO PIVOT
// --------------------------------------------------------

const inversaPivot =
    pivotQuaternion.clone().invert();


const localPosition =
    objectPosition
        .clone()
        .sub(pivotPosition)
        .applyQuaternion(inversaPivot);


const localQuaternion =
    inversaPivot
        .clone()
        .multiply(objectQuaternion);


// --------------------------------------------------------
// COLOCAR O OBJETO DENTRO DO PIVOT
// --------------------------------------------------------

pivot.object3D.add(
    objeto.object3D
);


objeto.object3D.position.copy(
    localPosition
);


objeto.object3D.quaternion.copy(
    localQuaternion
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

    console.log(
        "Marcador encontrado"
    );


    if (audio && audio.src) {

        audio.currentTime = 0;

        audio.play().catch(
            erro => {

                console.log(
                    "Navegador bloqueou o áudio:",
                    erro
                );

            }
        );

    }

}

);

// ============================================================
// MARCADOR PERDIDO
// ============================================================

target.addEventListener(
"targetLost",
() => {

    console.log(
        "Marcador perdido"
    );

}

);

// ============================================================
// ROTAÇÃO POR TOQUE
// ============================================================

let tocando = false;

let ultimoX = 0;

document.addEventListener(
"touchstart",
evento => {

    if (
        evento.touches.length !== 1
    ) {
        return;
    }


    tocando = true;

    ultimoX =
        evento.touches[0].clientX;

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


    // Rotação do pivot no eixo X

    pivot.object3D.rotation.x -=
        deltaX *
        VELOCIDADE_ROTACAO;

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

        const elemento =
            document.documentElement;


        if (!document.fullscreenElement) {

            await elemento.requestFullscreen();

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