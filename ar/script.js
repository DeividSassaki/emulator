```javascript
const params = new URLSearchParams(window.location.search);
const pasta = params.get("pasta") || "zelda";

const CONFIG_URL = `./marcadores/${encodeURIComponent(pasta)}/config.json`;

const scene = document.getElementById("scene");
const target = document.getElementById("arTarget");
const pivot = document.getElementById("arPivot");
const model = document.getElementById("arModelObject");
const modelAsset = document.getElementById("arModel");
const fullscreenButton = document.getElementById("fullscreen");

let config = null;
let audio = null;
let mindarStarted = false;


/* =========================================================
   CAMINHO DOS ARQUIVOS
   ========================================================= */

function caminhoArquivo(nome) {

    if (!nome) return "";

    return `./marcadores/${encodeURIComponent(pasta)}/${nome
        .split("/")
        .map(parte => encodeURIComponent(parte))
        .join("/")}`;
}


/* =========================================================
   NÚMEROS
   ========================================================= */

function numero(valor, padrao = 0) {

    const n = Number(valor);

    return Number.isFinite(n) ? n : padrao;
}


/* =========================================================
   APLICAR CONFIGURAÇÃO
   ========================================================= */

function aplicarConfiguracao() {

    if (!config) return;


    /* -----------------------------
       PIVÔ
    ----------------------------- */

    if (config.pivot) {

        pivot.object3D.position.set(
            numero(config.pivot.x),
            numero(config.pivot.y),
            numero(config.pivot.z)
        );
    }


    if (config.pivotRotation) {

        pivot.object3D.rotation.set(
            THREE.MathUtils.degToRad(
                numero(config.pivotRotation.x)
            ),

            THREE.MathUtils.degToRad(
                numero(config.pivotRotation.y)
            ),

            THREE.MathUtils.degToRad(
                numero(config.pivotRotation.z)
            )
        );
    }


    /* -----------------------------
       MODELO
    ----------------------------- */

    if (config.position) {

        model.object3D.position.set(
            numero(config.position.x),
            numero(config.position.y),
            numero(config.position.z)
        );
    }


    if (config.rotation) {

        model.object3D.rotation.set(
            THREE.MathUtils.degToRad(
                numero(config.rotation.x)
            ),

            THREE.MathUtils.degToRad(
                numero(config.rotation.y)
            ),

            THREE.MathUtils.degToRad(
                numero(config.rotation.z)
            )
        );
    }


    /* -----------------------------
       ESCALA
    ----------------------------- */

    if (config.scale !== undefined) {

        const escala = numero(config.scale, 1);

        model.object3D.scale.set(
            escala,
            escala,
            escala
        );
    }
}


/* =========================================================
   ÁUDIO
   ========================================================= */

function prepararAudio() {

    if (!config || !config.audio) return;

    const audioURL = caminhoArquivo(config.audio);

    audio = new Audio(audioURL);

    audio.loop = true;
    audio.preload = "auto";
    audio.volume = 1;

    audio.addEventListener("error", () => {

        console.warn(
            "Não foi possível carregar o áudio:",
            audioURL
        );
    });
}


function tocarAudio() {

    if (!audio) return;

    audio.play().catch(() => {
        console.warn(
            "O navegador bloqueou o áudio até uma interação do usuário."
        );
    });
}


function pararAudio() {

    if (!audio) return;

    audio.pause();
}


/* =========================================================
   EVENTOS DO MARCADOR
   ========================================================= */

target.addEventListener("targetFound", () => {

    console.log("Marcador encontrado.");

    tocarAudio();
});


target.addEventListener("targetLost", () => {

    console.log("Marcador perdido.");

    pararAudio();
});


/* =========================================================
   INICIAR MINDAR
   ========================================================= */

async function iniciarMindAR() {

    if (mindarStarted) return;

    if (!config) return;


    const marcador =
        config.marcador || "targets.mind";

    const marcadorURL =
        caminhoArquivo(marcador);


    console.log(
        "Iniciando MindAR com:",
        marcadorURL
    );


    /*
     * Configura o MindAR antes de iniciar.
     */

    scene.setAttribute(
        "mindar-image",
        `
        imageTargetSrc: ${marcadorURL};
        autoStart: false;
        missTolerance: 20;
        filterMinCF: 0.0001;
        filterBeta: 1000;
        uiLoading: no;
        uiError: no;
        uiScanning: no;
        `
    );


    /*
     * Espera o A-Frame terminar de carregar.
     */

    if (!scene.hasLoaded) {

        await new Promise(resolve => {

            scene.addEventListener(
                "loaded",
                resolve,
                { once: true }
            );
        });
    }


    /*
     * Pega o sistema MindAR.
     */

    const sistema =
        scene.systems["mindar-image-system"];


    if (!sistema) {

        console.error(
            "MindAR não foi encontrado na cena."
        );

        return;
    }


    try {

        await sistema.start();

        mindarStarted = true;

        console.log(
            "MindAR iniciado com sucesso."
        );

    } catch (erro) {

        console.error(
            "Erro ao iniciar câmera/MindAR:",
            erro
        );
    }
}


/* =========================================================
   CARREGAR CONFIG.JSON
   ========================================================= */

async function carregarConfiguracao() {

    try {

        console.log(
            "Carregando configuração:",
            CONFIG_URL
        );


        const resposta = await fetch(
            CONFIG_URL,
            {
                cache: "no-store"
            }
        );


        if (!resposta.ok) {

            throw new Error(
                `Erro HTTP ${resposta.status}`
            );
        }


        config = await resposta.json();


        console.log(
            "Configuração carregada:",
            config
        );


        /* -----------------------------
           TÍTULO
        ----------------------------- */

        document.title =
            config.nome || "AR";


        /* -----------------------------
           MODELO
        ----------------------------- */

        if (!config.modelo) {

            throw new Error(
                "O config.json não possui 'modelo'."
            );
        }


        const modeloURL =
            caminhoArquivo(config.modelo);


        console.log(
            "Carregando modelo:",
            modeloURL
        );


        modelAsset.setAttribute(
            "src",
            modeloURL
        );


        /* -----------------------------
           ÁUDIO
        ----------------------------- */

        prepararAudio();


        /* -----------------------------
           MODELO CARREGADO
        ----------------------------- */

        model.addEventListener(
            "model-loaded",
            () => {

                console.log(
                    "GLB carregado."
                );

                aplicarConfiguracao();

            },
            { once: true }
        );


        /*
         * Se o GLB já tiver carregado.
         */

        if (model.hasLoaded) {

            aplicarConfiguracao();
        }


        /* -----------------------------
           INICIAR CÂMERA
        ----------------------------- */

        await iniciarMindAR();

    } catch (erro) {

        console.error(
            "Erro ao carregar configuração:",
            erro
        );
    }
}


/* =========================================================
   ROTAÇÃO COM O DEDO
   ========================================================= */

let tocandoTela = false;
let ultimoX = 0;

const VELOCIDADE_ROTACAO = 0.01;


window.addEventListener(
    "touchstart",
    evento => {

        if (evento.touches.length !== 1) return;

        tocandoTela = true;

        ultimoX =
            evento.touches[0].clientX;
    },
    { passive: true }
);


window.addEventListener(
    "touchmove",
    evento => {

        if (!tocandoTela) return;

        if (evento.touches.length !== 1) return;


        const atualX =
            evento.touches[0].clientX;


        const deltaX =
            atualX - ultimoX;


        ultimoX = atualX;


        pivot.object3D.rotation.x -=
            deltaX * VELOCIDADE_ROTACAO;
    },
    { passive: true }
);


window.addEventListener(
    "touchend",
    () => {

        tocandoTela = false;
    },
    { passive: true }
);


/* =========================================================
   TELA CHEIA
   ========================================================= */

fullscreenButton.addEventListener(
    "click",
    async () => {

        try {

            if (!document.fullscreenElement) {

                await document.documentElement
                    .requestFullscreen();

            } else {

                await document.exitFullscreen();
            }

        } catch (erro) {

            console.warn(
                "Não foi possível ativar tela cheia:",
                erro
            );
        }
    }
);


/* =========================================================
   INÍCIO
   ========================================================= */

if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        carregarConfiguracao,
        { once: true }
    );

} else {

    carregarConfiguracao();
}
```
