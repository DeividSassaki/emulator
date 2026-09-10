```javascript
const romInput = document.getElementById("romInput");


// ============================================================
// CARREGAR ROM PELO BOTÃO
// ============================================================

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


// ============================================================
// VERIFICA SE EXISTE UMA ROM NA URL
// ============================================================

const parametros = new URLSearchParams(window.location.search);
const romURL = parametros.get("rom");

if (romURL) {

    console.log("ROM encontrada na URL:");
    console.log(romURL);

    // Tenta descobrir o nome do arquivo
    let nomeArquivo = "jogo";

    try {
        nomeArquivo =
            decodeURIComponent(
                romURL.split("/").pop().split("?")[0]
            );
    } catch (e) {
        console.log("Não foi possível obter o nome do arquivo.");
    }

    iniciarEmulador(romURL, nomeArquivo);
}


// ============================================================
// INICIAR EMULADOR
// ============================================================

function iniciarEmulador(romURL, nomeArquivo) {

    // Limpa o emulador anterior
    document.getElementById("game").innerHTML = "";

    // Remove controles antigos
    removerControles();


    // ========================================================
    // CONFIGURAÇÕES DO EMULATORJS
    // ========================================================

    window.EJS_player = "#game";

    window.EJS_gameName =
        nomeArquivo.replace(/\.[^/.]+$/, "");

    window.EJS_biosUrl = "";

    window.EJS_gameUrl = romURL;

    window.EJS_core = "snes";

    window.EJS_mouse = false;

    window.EJS_multitap = false;

    window.EJS_startOnLoaded = true;


    // ========================================================
    // CDN DO EMULATORJS
    // ========================================================

    window.EJS_pathtodata =
        "https://cdn.emulatorjs.org/4.2.2/data/";


    // ========================================================
    // QUANDO O EMULADOR ESTIVER PRONTO
    // ========================================================

    window.EJS_ready = function () {

        console.log("EmulatorJS pronto.");

        criarControles();

    };


    // ========================================================
    // CARREGA O EMULATORJS
    // ========================================================

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


// ============================================================
// CRIAR BOTÕES
// ============================================================

function criarControles() {

    // Evita criar duas vezes
    if (document.getElementById("emulatorControls")) {
        return;
    }


    const controles =
        document.createElement("div");

    controles.id = "emulatorControls";

    controles.style.display = "flex";
    controles.style.justifyContent = "center";
    controles.style.flexWrap = "wrap";
    controles.style.gap = "10px";
    controles.style.marginTop = "15px";
    controles.style.marginBottom = "15px";


    // ========================================================
    // BOTÃO TELA CHEIA
    // ========================================================

    const fullscreenButton =
        document.createElement("button");

    fullscreenButton.textContent =
        "⛶ Tela cheia";

    fullscreenButton.className =
        "button";

    fullscreenButton.onclick = function () {

        if (
            window.EJS_emulator &&
            window.EJS_emulator.toggleFullscreen
        ) {

            window.EJS_emulator.toggleFullscreen();

        } else {

            const game =
                document.getElementById("game");

            if (game.requestFullscreen) {
                game.requestFullscreen();
            }
        }
    };


    // ========================================================
    // BOTÃO SALVAR ESTADO
    // ========================================================

    const saveButton =
        document.createElement("button");

    saveButton.textContent =
        "💾 Salvar estado";

    saveButton.className =
        "button";

    saveButton.onclick = async function () {

        if (
            !window.EJS_emulator ||
            !window.EJS_emulator.gameManager
        ) {

            alert("O emulador ainda não está pronto.");

            return;
        }


        try {

            const state =
                await window.EJS_emulator
                    .gameManager
                    .getState();


            // Guarda o estado no navegador
            const dados =
                Array.from(state);

            localStorage.setItem(
                "snes_save_state",
                JSON.stringify(dados)
            );


            mostrarMensagem(
                "💾 Estado salvo!"
            );


        } catch (erro) {

            console.error(
                "Erro ao salvar estado:",
                erro
            );

            alert(
                "Não foi possível salvar o estado."
            );
        }
    };


    // ========================================================
    // BOTÃO CARREGAR ESTADO
    // ========================================================

    const loadButton =
        document.createElement("button");

    loadButton.textContent =
        "📂 Carregar estado";

    loadButton.className =
        "button";

    loadButton.onclick = async function () {

        if (
            !window.EJS_emulator ||
            !window.EJS_emulator.gameManager
        ) {

            alert("O emulador ainda não está pronto.");

            return;
        }


        const salvo =
            localStorage.getItem(
                "snes_save_state"
            );


        if (!salvo) {

            alert(
                "Nenhum estado salvo foi encontrado."
            );

            return;
        }


        try {

            const dados =
                JSON.parse(salvo);

            const state =
                new Uint8Array(dados);


            window.EJS_emulator
                .gameManager
                .loadState(state);


            mostrarMensagem(
                "📂 Estado carregado!"
            );


        } catch (erro) {

            console.error(
                "Erro ao carregar estado:",
                erro
            );

            alert(
                "Não foi possível carregar o estado."
            );
        }
    };


    // ========================================================
    // ADICIONA OS BOTÕES
    // ========================================================

    controles.appendChild(
        fullscreenButton
    );

    controles.appendChild(
        saveButton
    );

    controles.appendChild(
        loadButton
    );


    // Coloca os controles depois do emulador
    document
        .getElementById("game")
        .after(controles);
}


// ============================================================
// REMOVER CONTROLES
// ============================================================

function removerControles() {

    const controles =
        document.getElementById(
            "emulatorControls"
        );

    if (controles) {
        controles.remove();
    }
}


// ============================================================
// MENSAGEM
// ============================================================

function mostrarMensagem(texto) {

    const mensagem =
        document.createElement("div");

    mensagem.textContent = texto;

    mensagem.style.position = "fixed";
    mensagem.style.bottom = "30px";
    mensagem.style.left = "50%";
    mensagem.style.transform =
        "translateX(-50%)";

    mensagem.style.background =
        "#333";

    mensagem.style.color =
        "white";

    mensagem.style.padding =
        "10px 18px";

    mensagem.style.borderRadius =
        "6px";

    mensagem.style.zIndex =
        "99999";

    document.body.appendChild(
        mensagem
    );


    setTimeout(function () {

        mensagem.remove();

    }, 2000);
}
```
