const romInput = document.getElementById("romInput");

romInput.addEventListener("change", function () {

    const file = romInput.files[0];

    if (!file) {
        return;
    }

    console.log("ROM selecionada:", file.name);

    // Cria uma URL temporária para a ROM
    const romURL = URL.createObjectURL(file);

    iniciarEmulador(romURL, file.name);
});


function iniciarEmulador(romURL, nomeArquivo) {

    // Limpa o emulador anterior
    document.getElementById("game").innerHTML = "";

    // Configurações do EmulatorJS
    window.EJS_player = "#game";

    window.EJS_gameName =
        nomeArquivo.replace(/\.[^/.]+$/, "");

    window.EJS_biosUrl = "";

    window.EJS_gameUrl = romURL;

    window.EJS_core = "snes";

    window.EJS_mouse = false;

    window.EJS_multitap = false;

    window.EJS_startOnLoaded = true;

    // CDN oficial do EmulatorJS
    window.EJS_pathtodata =
        "https://cdn.emulatorjs.org/4.2.2/data/";

    // Carrega o EmulatorJS
    const script = document.createElement("script");

    script.src =
        "https://cdn.emulatorjs.org/4.2.2/data/loader.js";

    script.onload = function () {

        console.log("EmulatorJS carregado.");

    };

    script.onerror = function () {

        console.error(
            "Não foi possível carregar o EmulatorJS."
        );

    };

    document.body.appendChild(script);
}
// =========================
// BOTÃO TELA CHEIA
// =========================

const fullscreenButton =
    document.getElementById("fullscreenButton");

fullscreenButton.addEventListener("click", function () {

    const game = document.getElementById("game");

    if (!document.fullscreenElement) {

        game.requestFullscreen().catch(function (error) {

            console.error(
                "Erro ao entrar em tela cheia:",
                error
            );

        });

    } else {

        document.exitFullscreen();

    }

});
// =========================
// SALVAR STATE
// =========================

const saveStateButton =
    document.getElementById("saveStateButton");

saveStateButton.addEventListener("click", async function () {

    if (!window.EJS_emulator) {
        alert("O emulador ainda não está pronto.");
        return;
    }

    try {

        const state =
            await window.EJS_emulator.gameManager.getState();

        if (!state) {
            alert("Não foi possível salvar o State.");
            return;
        }

        const blob = new Blob(
            [state],
            { type: "application/octet-stream" }
        );

        const url =
            URL.createObjectURL(blob);

        const link =
            document.createElement("a");

        link.href = url;
        link.download = "snes-save.state";

        link.click();

        URL.revokeObjectURL(url);

        console.log("State salvo com sucesso.");

    } catch (error) {

        console.error("Erro ao salvar State:", error);

        alert("Erro ao salvar o State.");
    }

});


// =========================
// CARREGAR STATE
// =========================

const loadStateButton =
    document.getElementById("loadStateButton");

const stateInput =
    document.createElement("input");

stateInput.type = "file";
stateInput.accept = ".state";
stateInput.style.display = "none";

document.body.appendChild(stateInput);


loadStateButton.addEventListener("click", function () {

    if (!window.EJS_emulator) {
        alert("O emulador ainda não está pronto.");
        return;
    }

    stateInput.click();

});


stateInput.addEventListener("change", async function () {

    const file = stateInput.files[0];

    if (!file) {
        return;
    }

    try {

        const state =
            new Uint8Array(
                await file.arrayBuffer()
            );

        window.EJS_emulator.gameManager.loadState(state);

        console.log("State carregado com sucesso.");

    } catch (error) {

        console.error("Erro ao carregar State:", error);

        alert("Erro ao carregar o State.");
    }

});
