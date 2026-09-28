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
let modeloCarregado = false;

let tocando = false;


/* =========================================================
   FUNÇÕES
   ========================================================= */

function numero(valor, padrao = 0) {
    const n = Number(valor);
    return Number.isFinite(n) ? n : padrao;
}


function caminhoArquivo(nome) {
    if (!nome) return "";

    return `./marcadores/${encodeURIComponent(pasta)}/${nome
        .split("/")
        .map(parte => encodeURIComponent(parte))
        .join("/")}`;
}


function aplicarConfiguracao() {

    if (!config) return;

    /* -----------------------------------------------------
       PIVÔ
       ----------------------------------------------------- */

    if (config.pivot) {

        pivot.object3D.position.set(
            numero(config.pivot.x),
            numero(config.pivot.y),
            numero(config.pivot.z)
        );
    }

    if (config.pivotRotation) {

        pivot.object3D.rotation.set(
            THREE.MathUtils.degToRad(numero(config.pivotRotation.x)),
            THREE.MathUtils.degToRad(numero(config.pivotRotation.y)),
            THREE.MathUtils.degToRad(numero(config.pivotRotation.z))
        );
    }


    /* -----------------------------------------------------
       MODELO
       ----------------------------------------------------- */

    if (config.position) {

        model.object3D.position.set(
            numero(config.position.x),
            numero(config.position.y),
            numero(config.position.z)
        );
    }


    if (config.rotation) {

        model.object3D.rotation.set(
            THREE.MathUtils.degToRad(numero(config.rotation.x)),
            THREE.MathUtils.degToRad(numero(config.rotation.y)),
            THREE.MathUtils.degToRad(numero(config.rotation.z))
        );
    }


    /* -----------------------------------------------------
       ESCALA
       ----------------------------------------------------- */

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

    if (!config || !config.audio) {
        return;
    }

    const audioURL = caminhoArquivo(config.audio);

    audio = new Audio(audioURL);

    audio.loop = true;
    audio.preload = "auto";

    audio.volume = 1;

    audio.addEventListener("error", () => {
        console.warn("Não foi possível carregar o áudio:", audioURL);
    });
}


function tocarAudio() {

    if (!audio) return;

    const promessa = audio.play();

    if (promessa !== undefined) {

        promessa
            .then(() => {
                tocando = true;
            })
            .catch(() => {
                /*
                 * Alguns navegadores podem bloquear o áudio
                 * até existir interação do usuário.
                 */
            });
    }
}


function pararAudio() {

    if (!audio) return;

    audio.pause();
    tocando = false;
}


/* =========================================================
   MINDAR
   ========================================================= */

async function iniciarMindAR() {

    if (mindarStarted) return;

    const marcador = config.marcador || "targets.mind";

    const marcadorURL = caminhoArquivo(marcador);

    /*
     * Aqui colocamos o marcador vindo do JSON.
     * Não existe mais caminho fixo para Zelda no HTML.
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


    const sistema = scene.systems["mindar-image-system"];

    if (!sistema) {

        console.error("Sistema MindAR não encontrado.");
        return;
    }


    try {

        await sistema.start();

        mindarStarted = true;

        console.log("MindAR iniciado.");
        console.log("Marcador:", marcadorURL);

    } catch (erro) {

        console.error("Erro ao iniciar MindAR:", erro);
    }
}


/* =========================================================
   CARREGAR CONFIGURAÇÃO
   ========================================================= */

async function carregarConfiguracao() {

    try {

        const resposta = await fetch(CONFIG_URL, {
            cache: "no-store"
        });

        if (!resposta.ok) {

            throw new Error(
                `Erro HTTP ${resposta.status} ao carregar ${CONFIG_URL}`
            );
        }

        config = await resposta.json();

        console.log("Configuração carregada:", config);


        /* -------------------------------------------------
           TÍTULO
           ------------------------------------------------- */

        if (config.nome) {
            document.title = config.nome;
        } else {
            document.title = "AR";
        }


        /* -------------------------------------------------
           MODELO
           ------------------------------------------------- */

        if (!config.modelo) {

            throw new Error(
                "O config.json não possui o campo 'modelo'."
            );
        }

        const modeloURL = caminhoArquivo(config.modelo);

        modelAsset.setAttribute("src", modeloURL);

        console.log("Modelo:", modeloURL);


        /* -------------------------------------------------
           ÁUDIO
           ------------------------------------------------- */

        prepararAudio();


        /* -------------------------------------------------
           EVENTOS
           ------------------------------------------------- */

        target.addEventListener("targetFound", () => {

            console.log("Marcador encontrado.");

            tocarAudio();
        });


        target.addEventListener("targetLost", () => {

            console.log("Marcador perdido.");

            pararAudio();
        });


        /* -------------------------------------------------
           MODELO CARREGADO
           ------------------------------------------------- */

        model.addEventListener("model-loaded", () => {

            modeloCarregado = true;

            console.log("Modelo carregado.");

            aplicarConfiguracao();
        });


        /*
         * Se o modelo já estiver carregado antes do evento,
         * aplicamos mesmo assim.
         */

        if (model.hasLoaded) {

            modeloCarregado = true;

            aplicarConfiguracao();
        }


        /* -------------------------------------------------
           INICIAR MINDAR
           ------------------------------------------------- */

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
    (evento) => {

        if (evento.touches.length !== 1) return;

        tocandoTela = true;

        ultimoX = evento.touches[0].clientX;
    },
    { passive: true }
);


window.addEventListener(
    "touchmove",
    (evento) => {

        if (!tocandoTela) return;

        if (evento.touches.length !== 1) return;

        const atualX = evento.touches[0].clientX;

        const deltaX = atualX - ultimoX;

        ultimoX = atualX;

        /*
         * Rotação do PIVÔ.
         *
         * O modelo gira em torno do pivô calibrado.
         */

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

fullscreenButton.addEventListener("click", async () => {

    try {

        if (!document.fullscreenElement) {

            await document.documentElement.requestFullscreen();

        } else {

            await document.exitFullscreen();
        }

    } catch (erro) {

        console.warn(
            "Não foi possível ativar tela cheia:",
            erro
        );
    }
});


/* =========================================================
   INÍCIO
   ========================================================= */

carregarConfiguracao();
```
