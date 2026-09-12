// =========================
// CONFIGURAÇÃO
// =========================

const romInput = document.getElementById("romInput");
const romUrlInput = document.getElementById("romUrl");
const openUrlButton = document.getElementById("openUrlButton");
const fullscreenButton = document.getElementById("fullscreenButton");
const saveStateButton = document.getElementById("saveStateButton");
const loadStateButton = document.getElementById("loadStateButton");
const gamesList = document.getElementById("gamesList");

const GAMES_FOLDER = "file";

let nomeRomAtual = "snes";
let emulatorScript = null;


// =========================
// CARREGAR ROM DO COMPUTADOR
// =========================

romInput.addEventListener("change", function () {
    const file = romInput.files[0];

    if (!file) {
        return;
    }

    const romURL = URL.createObjectURL(file);

    iniciarEmulador(romURL, file.name);
});


// =========================
// ABRIR ROM POR URL
// =========================

openUrlButton.addEventListener("click", function () {
    const url = romUrlInput.value.trim();

    if (!url) {
        alert("Cole a URL da ROM primeiro.");
        return;
    }

    iniciarEmulador(url, obterNomeArquivo(url));
});


// =========================
// ABRIR ROM PELO LINK ?rom=
// =========================

const parametros = new URLSearchParams(window.location.search);
const romPorLink = parametros.get("rom");

if (romPorLink) {
    iniciarEmulador(romPorLink, obterNomeArquivo(romPorLink));
}


// =========================
// INICIAR EMULADOR
// =========================

function iniciarEmulador(romURL, nomeArquivo) {
    const game = document.getElementById("game");

    game.innerHTML = "";

    nomeRomAtual = nomeArquivo.replace(/\.[^/.]+$/, "");

    window.EJS_player = "#game";
    window.EJS_gameName = nomeRomAtual;
    window.EJS_biosUrl = "";
    window.EJS_gameUrl = romURL;
    window.EJS_core = "snes";
    window.EJS_mouse = false;
    window.EJS_multitap = false;
    window.EJS_startOnLoaded = true;
    window.EJS_pathtodata =
        "https://cdn.emulatorjs.org/4.2.2/data/";

    // Evita adicionar vários loaders ao abrir mais de uma ROM.
    if (emulatorScript) {
        emulatorScript.remove();
    }

    emulatorScript = document.createElement("script");
    emulatorScript.src =
        "https://cdn.emulatorjs.org/4.2.2/data/loader.js";

    emulatorScript.onload = function () {
        console.log("EmulatorJS carregado.");
    };

    emulatorScript.onerror = function () {
        console.error("Não foi possível carregar o EmulatorJS.");
    };

    document.body.appendChild(emulatorScript);
}


// =========================
// TELA CHEIA
// =========================

fullscreenButton.addEventListener("click", function () {
    const game = document.getElementById("game");

    if (!document.fullscreenElement) {
        game.requestFullscreen().catch(function (error) {
            console.error("Erro ao entrar em tela cheia:", error);
        });
    } else {
        document.exitFullscreen();
    }
});


// =========================
// SALVAR STATE
// =========================

saveStateButton.addEventListener("click", async function () {
    if (!window.EJS_emulator) {
        alert("O emulador ainda não está carregado.");
        return;
    }

    try {
        let state =
            await window.EJS_emulator.gameManager.getState();

        if (!state) {
            alert("Não foi possível salvar o State.");
            return;
        }

        const blob = new Blob(
            [state],
            { type: "application/octet-stream" }
        );

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = criarNomeDoState();

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(function () {
            URL.revokeObjectURL(url);
        }, 1000);

    } catch (error) {
        console.error("Erro ao salvar State:", error);
        alert("Não foi possível salvar o State.");
    }
});


// =========================
// CARREGAR STATE
// =========================

const stateInput = document.createElement("input");

stateInput.type = "file";
stateInput.accept = ".state";
stateInput.hidden = true;

document.body.appendChild(stateInput);

loadStateButton.addEventListener("click", function () {
    if (!window.EJS_emulator) {
        alert("O emulador ainda não está carregado.");
        return;
    }

    stateInput.value = "";
    stateInput.click();
});

stateInput.addEventListener("change", async function () {
    const file = stateInput.files[0];

    if (!file) {
        return;
    }

    try {
        const state = new Uint8Array(
            await file.arrayBuffer()
        );

        window.EJS_emulator.gameManager.loadState(state);

        console.log("State carregado com sucesso.");

    } catch (error) {
        console.error("Erro ao carregar State:", error);
        alert("Não foi possível carregar o State.");
    }
});


// =========================
// LISTAR JOGOS DA PASTA /file
// =========================

async function carregarListaDeJogos() {
    try {
        // Descobre automaticamente o usuário e o repositório
        // a partir do endereço do GitHub Pages.
        const hostParts = window.location.hostname.split(".");
        const usuario = hostParts[0];

        const caminho = window.location.pathname
            .split("/")
            .filter(Boolean);

        const repositorio = caminho[0];

        if (!usuario || !repositorio) {
            throw new Error("Não foi possível identificar o repositório.");
        }

        const apiURL =
            `https://api.github.com/repos/${usuario}/${repositorio}/contents/${GAMES_FOLDER}`;

        const resposta = await fetch(apiURL);

        if (!resposta.ok) {
            throw new Error(
                `GitHub retornou HTTP ${resposta.status}`
            );
        }

        const arquivos = await resposta.json();

        const jogos = arquivos.filter(function (arquivo) {
            if (arquivo.type !== "file") {
                return false;
            }

            const nome = arquivo.name.toLowerCase();

            return (
                nome.endsWith(".sfc") ||
                nome.endsWith(".smc")
            );
        });

        gamesList.innerHTML = "";

        if (jogos.length === 0) {
            gamesList.innerHTML =
                "<p>Nenhum jogo .sfc ou .smc encontrado na pasta file.</p>";
            return;
        }

        jogos.sort(function (a, b) {
            return a.name.localeCompare(b.name);
        });

        jogos.forEach(function (jogo) {
            const item = document.createElement("div");
            item.className = "game-item";

            const nome = document.createElement("span");
            nome.className = "game-name";
            nome.textContent = jogo.name;

            const botao = document.createElement("button");
            botao.className = "button";
            botao.textContent = "▶ Abrir";

            botao.addEventListener("click", function () {
                iniciarEmulador(
                    jogo.download_url,
                    jogo.name
                );
            });

            item.appendChild(nome);
            item.appendChild(botao);

            gamesList.appendChild(item);
        });

    } catch (error) {
        console.error("Erro ao procurar jogos:", error);

        gamesList.innerHTML =
            "<p>Não foi possível carregar a lista da pasta file.</p>";
    }
}


// =========================
// NOME DO STATE
// Formato: Nome - AAMMDDHHMMSS.state
// =========================

function criarNomeDoState() {
    const agora = new Date();

    const ano =
        String(agora.getFullYear()).slice(-2);

    const mes =
        String(agora.getMonth() + 1).padStart(2, "0");

    const dia =
        String(agora.getDate()).padStart(2, "0");

    const hora =
        String(agora.getHours()).padStart(2, "0");

    const minuto =
        String(agora.getMinutes()).padStart(2, "0");

    const segundo =
        String(agora.getSeconds()).padStart(2, "0");

    return (
        nomeRomAtual +
        " - " +
        ano +
        mes +
        dia +
        hora +
        minuto +
        segundo +
        ".state"
    );
}


// =========================
// OBTER NOME DO ARQUIVO
// =========================

function obterNomeArquivo(url) {
    try {
        const endereco = new URL(url);
        const nome = endereco.pathname.split("/").pop();

        if (nome) {
            return decodeURIComponent(nome);
        }
    } catch (error) {
        console.warn("Não foi possível obter o nome da URL.");
    }

    return "Jogo";
}


// =========================
// INICIAR LISTA DE JOGOS
// =========================

carregarListaDeJogos();
