// =========================
// CONFIGURAÇÃO
// =========================

const romInput = document.getElementById("romInput");
const romUrlInput = document.getElementById("romUrl");
const openUrlButton = document.getElementById("openUrlButton");
const folderButton = document.getElementById("folderButton");

const fullscreenButton = document.getElementById("fullscreenButton");
const saveStateButton = document.getElementById("saveStateButton");
const loadStateButton = document.getElementById("loadStateButton");

const gamesList = document.getElementById("gamesList");
const mainMenu = document.getElementById("mainMenu");
const gameMenu = document.getElementById("gameMenu");
const gamesSection = document.getElementById("gamesSection");
const pageTitle = document.getElementById("pageTitle");

const GAMES_FOLDER = "file";

let nomeRomAtual = "snes";
let emulatorScript = null;


// =========================
// ROTA ATUAL
// =========================

function obterBaseDoSite() {
    const partes = window.location.pathname
        .split("/")
        .filter(Boolean);

    return partes.length > 0
        ? "/" + partes[0] + "/"
        : "/";
}

function obterSlugDaPagina() {
    const partes = window.location.pathname
        .split("/")
        .filter(Boolean);

    return partes.length > 1
        ? decodeURIComponent(partes[1]).toLowerCase()
        : "";
}

const slugAtual = obterSlugDaPagina();

const parametros = new URLSearchParams(
    window.location.search
);

const romPorLink = parametros.get("rom");

const paginaDeJogoPorSlug =
    slugAtual !== "";

const paginaComRomExterna =
    Boolean(romPorLink);

// =========================
// NORMALIZAR URLS DO ARCHIVE.ORG
// =========================

function normalizarUrlRom(url) {
    try {
        const u = new URL(url);

        // O endpoint /cors/ do Archive.org permite que o navegador
        // faça a requisição cross-origin em arquivos diretos.
        // Não alteramos URLs de arquivos dentro de ZIPs.
        if (u.hostname === "archive.org" && u.pathname.startsWith("/download/")) {
            const partes = u.pathname.split("/").filter(Boolean);

            if (partes.length >= 3) {
                const caminhoArquivo = partes.slice(2).join("/");
                const caminhoMaiusculo = decodeURIComponent(caminhoArquivo).toUpperCase();

                // Arquivo direto: .../download/id/jogo.smc
                // Arquivo dentro de ZIP: .../download/id/arquivo.ZIP/jogo.smc
                const arquivoDireto = !caminhoMaiusculo.includes(".ZIP/");

                if (arquivoDireto) {
                    u.pathname = "/cors/" + partes.slice(1).join("/");
                    return u.toString();
                }
            }
        }
    } catch (e) {
        // Mantém a URL original quando ela não for uma URL válida.
    }

    return url;
}


// =========================
// CONTROLES
// =========================

// Página inicial: mostra somente os controles para escolher/carregar ROM.
// Página de jogo: mostra somente os 3 controles do emulador.
const gameElement = document.getElementById("game");

function mostrarPaginaPrincipal() {
    mainMenu.style.setProperty("display", "block", "important");
    gamesSection.style.setProperty("display", "none", "important");
    gameMenu.style.setProperty("display", "none", "important");
    gameElement.style.setProperty("display", "none", "important");
}

function mostrarPaginaDoJogo() {
    mainMenu.style.setProperty("display", "none", "important");
    gamesSection.style.setProperty("display", "none", "important");
    gameMenu.style.setProperty("display", "block", "important");
    gameElement.style.setProperty("display", "block", "important");
}

if (paginaDeJogoPorSlug || paginaComRomExterna) {
    mostrarPaginaDoJogo();
} else {
    mostrarPaginaPrincipal();
}


// =========================
// CARREGAR ROM DO COMPUTADOR
// =========================

romInput.addEventListener("change", function () {
    const file = romInput.files[0];

    if (!file) {
        return;
    }

    const romURL = URL.createObjectURL(file);

    mostrarPaginaDoJogo();

    iniciarEmulador(
        romURL,
        file.name
    );
});


// =========================
// ABRIR ROM POR URL
// =========================

openUrlButton.addEventListener(
    "click",
    function () {

        const url =
            normalizarUrlRom(romUrlInput.value.trim());

        if (!url) {
            alert(
                "Cole a URL da ROM primeiro."
            );
            return;
        }

        mostrarPaginaDoJogo();

        iniciarEmulador(
            url,
            obterNomeArquivo(url)
        );
    }
);


// =========================
// MOSTRAR JOGOS DA PASTA /file
// =========================

folderButton.addEventListener("click", function () {
    gamesSection.style.setProperty("display", "block", "important");
    carregarListaDeJogos();
});


// =========================
// ABRIR ROM PELO ?rom=
// =========================

if (romPorLink) {

    pageTitle.textContent =
        obterNomeArquivo(
            romPorLink
        ).replace(
            /\.[^/.]+$/,
            ""
        );

    iniciarEmulador(
        normalizarUrlRom(romPorLink),
        obterNomeArquivo(
            romPorLink
        )
    );
}


// =========================
// INICIAR EMULADOR
// =========================

function iniciarEmulador(
    romURL,
    nomeArquivo
) {

    const game =
        document.getElementById("game");

    game.innerHTML = "";

    nomeRomAtual =
        nomeArquivo.replace(
            /\.[^/.]+$/,
            ""
        );

    window.EJS_player =
        "#game";

    window.EJS_gameName =
        nomeRomAtual;

    window.EJS_biosUrl =
        "";

    window.EJS_gameUrl =
        romURL;

    window.EJS_core =
        "snes";

    window.EJS_mouse =
        false;

    window.EJS_multitap =
        false;

    window.EJS_startOnLoaded =
        true;

    window.EJS_pathtodata =
        "https://cdn.emulatorjs.org/4.2.2/data/";

    if (emulatorScript) {
        emulatorScript.remove();
    }

    emulatorScript =
        document.createElement(
            "script"
        );

    emulatorScript.src =
        "https://cdn.emulatorjs.org/4.2.2/data/loader.js";

    emulatorScript.onload =
        function () {
            console.log(
                "EmulatorJS carregado."
            );
        };

    emulatorScript.onerror =
        function () {
            console.error(
                "Não foi possível carregar o EmulatorJS."
            );
        };

    document.body.appendChild(
        emulatorScript
    );
}


// =========================
// TELA CHEIA
// =========================

fullscreenButton.addEventListener(
    "click",
    async function () {

        const game =
            document.getElementById("game");

        if (!document.fullscreenElement) {

            try {

                await game.requestFullscreen();

                if (
                    screen.orientation &&
                    screen.orientation.lock
                ) {

                    try {

                        await screen.orientation.lock(
                            "landscape"
                        );

                    } catch (error) {

                        console.warn(
                            "Não foi possível travar a orientação em paisagem:",
                            error
                        );
                    }
                }

            } catch (error) {

                console.error(
                    "Erro ao entrar em tela cheia:",
                    error
                );
            }

        } else {

            if (
                screen.orientation &&
                screen.orientation.unlock
            ) {

                try {

                    screen.orientation.unlock();

                } catch (error) {

                    console.warn(
                        "Não foi possível liberar a orientação:",
                        error
                    );
                }
            }

            await document.exitFullscreen();
        }
    }
);


// =========================
// SAIR DO FULLSCREEN
// =========================

document.addEventListener(
    "fullscreenchange",
    function () {

        if (
            !document.fullscreenElement &&
            screen.orientation &&
            screen.orientation.unlock
        ) {

            try {

                screen.orientation.unlock();

            } catch (error) {

                console.warn(
                    "Não foi possível liberar a orientação:",
                    error
                );
            }
        }
    }
);


// =========================
// SALVAR STATE
// =========================

saveStateButton.addEventListener(
    "click",
    async function () {

        if (!window.EJS_emulator) {

            alert(
                "O emulador ainda não está carregado."
            );

            return;
        }

        try {

            const state =
                await window.EJS_emulator
                    .gameManager
                    .getState();

            if (!state) {

                alert(
                    "Não foi possível salvar o State."
                );

                return;
            }

            const blob =
                new Blob(
                    [state],
                    {
                        type:
                            "application/octet-stream"
                    }
                );

            const url =
                URL.createObjectURL(
                    blob
                );

            const link =
                document.createElement(
                    "a"
                );

            link.href = url;

            link.download =
                criarNomeDoState();

            document.body.appendChild(
                link
            );

            link.click();

            document.body.removeChild(
                link
            );

            setTimeout(
                function () {

                    URL.revokeObjectURL(
                        url
                    );

                },
                1000
            );

        } catch (error) {

            console.error(
                "Erro ao salvar State:",
                error
            );

            alert(
                "Não foi possível salvar o State."
            );
        }
    }
);


// =========================
// CARREGAR STATE
// =========================

const stateInput =
    document.createElement(
        "input"
    );

stateInput.type = "file";
stateInput.accept = ".state";
stateInput.hidden = true;

document.body.appendChild(
    stateInput
);

loadStateButton.addEventListener(
    "click",
    function () {

        if (!window.EJS_emulator) {

            alert(
                "O emulador ainda não está carregado."
            );

            return;
        }

        stateInput.value = "";
        stateInput.click();
    }
);

stateInput.addEventListener(
    "change",
    async function () {

        const file =
            stateInput.files[0];

        if (!file) {
            return;
        }

        try {

            const state =
                new Uint8Array(
                    await file.arrayBuffer()
                );

            window.EJS_emulator
                .gameManager
                .loadState(state);

            console.log(
                "State carregado com sucesso."
            );

        } catch (error) {

            console.error(
                "Erro ao carregar State:",
                error
            );

            alert(
                "Não foi possível carregar o State."
            );
        }
    }
);


// =========================
// SLUG DO JOGO
// =========================

function criarSlug(nome) {

    return nome
        .replace(/\.[^/.]+$/, "")
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .toLowerCase()
        .replace(
            /[^a-z0-9]+/g,
            "-"
        )
        .replace(
            /^-+|-+$/g,
            "");
}


// =========================
// LISTAR JOGOS DA PASTA /file
// =========================

async function carregarListaDeJogos() {

    try {

        const partes =
            window.location.pathname
                .split("/")
                .filter(Boolean);

        const usuario =
            window.location.hostname
                .split(".")[0];

        const repositorio =
            partes[0];

        if (
            !usuario ||
            !repositorio
        ) {

            throw new Error(
                "Não foi possível identificar o repositório."
            );
        }

        const apiURL =
            `https://api.github.com/repos/${usuario}/${repositorio}/contents/${GAMES_FOLDER}`;

        const resposta =
            await fetch(apiURL);

        if (!resposta.ok) {

            throw new Error(
                `GitHub retornou HTTP ${resposta.status}`
            );
        }

        const arquivos =
            await resposta.json();

        const jogos =
            arquivos.filter(
                function (arquivo) {

                    if (
                        arquivo.type !== "file"
                    ) {
                        return false;
                    }

                    const nome =
                        arquivo.name.toLowerCase();

                    return (
                        nome.endsWith(".sfc") ||
                        nome.endsWith(".smc") ||
                        nome.endsWith(".zip")
                    );
                }
            );

        jogos.sort(
            function (a, b) {

                return a.name.localeCompare(
                    b.name
                );
            }
        );

        // URL /emulator/nome-do-jogo
        if (paginaDeJogoPorSlug) {

            const jogo =
                jogos.find(
                    function (arquivo) {

                        return (
                            criarSlug(
                                arquivo.name
                            ) === slugAtual
                        );
                    }
                );

            if (!jogo) {

                pageTitle.textContent =
                    "Jogo não encontrado";

                gameMenu.style.display =
                    "block";

                document.getElementById(
                    "game"
                ).innerHTML =
                    "<p style='padding:20px;'>Não foi encontrada uma ROM correspondente a esta URL.</p>";

                return;
            }

            pageTitle.textContent =
                jogo.name.replace(
                    /\.[^/.]+$/,
                    ""
                );

            iniciarEmulador(
                jogo.download_url,
                jogo.name
            );

            return;
        }

        // Página principal
        gamesList.innerHTML = "";

        if (jogos.length === 0) {

            gamesList.innerHTML =
                "<p>Nenhum jogo .sfc, .smc ou .zip encontrado na pasta file.</p>";

            return;
        }

        jogos.forEach(
            function (jogo) {

                const item =
                    document.createElement(
                        "div"
                    );

                item.className =
                    "game-item";

                const nome =
                    document.createElement(
                        "span"
                    );

                nome.className =
                    "game-name";

                nome.textContent =
                    jogo.name;

                const botao =
                    document.createElement(
                        "button"
                    );

                botao.className =
                    "button";

                botao.textContent =
                    "▶ Abrir";

                botao.addEventListener(
                    "click",
                    function () {

                        const slug =
                            criarSlug(
                                jogo.name
                            );

                        history.pushState(
                            {},
                            "",
                            obterBaseDoSite() +
                                slug
                        );

                        mostrarPaginaDoJogo();

                        pageTitle.textContent =
                            jogo.name.replace(
                                /\.[^/.]+$/,
                                ""
                            );

                        iniciarEmulador(
                            jogo.download_url,
                            jogo.name
                        );
                    }
                );

                item.appendChild(nome);
                item.appendChild(botao);

                gamesList.appendChild(item);
            }
        );

    } catch (error) {

        console.error(
            "Erro ao procurar jogos:",
            error
        );

        gamesList.innerHTML =
            "<p>Não foi possível carregar a lista da pasta file.</p>";
    }
}


// =========================
// NOME DO SAVE
// =========================

function criarNomeDoState() {

    const agora =
        new Date();

    const ano =
        String(
            agora.getFullYear()
        ).slice(-2);

    const mes =
        String(
            agora.getMonth() + 1
        ).padStart(2, "0");

    const dia =
        String(
            agora.getDate()
        ).padStart(2, "0");

    const hora =
        String(
            agora.getHours()
        ).padStart(2, "0");

    const minuto =
        String(
            agora.getMinutes()
        ).padStart(2, "0");

    const segundo =
        String(
            agora.getSeconds()
        ).padStart(2, "0");

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
// NOME DE ARQUIVO DA URL
// =========================

function obterNomeArquivo(url) {

    try {

        const endereco =
            new URL(url);

        const nome =
            endereco.pathname
                .split("/")
                .pop();

        if (nome) {

            return decodeURIComponent(
                nome
            );
        }

    } catch (error) {

        console.warn(
            "Não foi possível obter o nome da URL."
        );
    }

    return "Jogo";
}


// =========================
// INICIAR
// =========================

if (paginaDeJogoPorSlug) {
    carregarListaDeJogos();
}
