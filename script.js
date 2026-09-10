const romInput = document.getElementById("romInput");

// =====================================================
// CARREGAR ROM PELO BOTÃO
// =====================================================

romInput.addEventListener("change", function () {

```
const file = romInput.files[0];

if (!file) {
    return;
}

console.log("ROM selecionada:", file.name);

const romURL = URL.createObjectURL(file);

iniciarEmulador(romURL, file.name);
```

});

// =====================================================
// CARREGAR ROM PELA URL
// Exemplo:
// ?rom=https://servidor.com/jogo.zip
// =====================================================

const parametros = new URLSearchParams(window.location.search);

const romURL = parametros.get("rom");

if (romURL) {

```
console.log("ROM encontrada na URL:");
console.log(romURL);

let nomeArquivo = "jogo";

try {

    nomeArquivo = decodeURIComponent(
        romURL
            .split("/")
            .pop()
            .split("?")[0]
    );

} catch (erro) {

    console.log("Não foi possível obter o nome do arquivo.");

}

iniciarEmulador(romURL, nomeArquivo);
```

}

// =====================================================
// INICIAR EMULADOR
// =====================================================

function iniciarEmulador(romURL, nomeArquivo) {

```
const game = document.getElementById("game");

// Limpa o emulador anterior
game.innerHTML = "";

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


// =================================================
// BOTÕES DO EMULATORJS
// =================================================

window.EJS_Buttons = {

    fullscreen: true,

    saveState: true,

    loadState: true,

    quickSave: true,

    quickLoad: true,

    restart: true,

    playPause: true,

    mute: true,

    settings: true,

    volume: true

};


// =================================================
// QUANDO O EMULADOR ESTIVER PRONTO
// =================================================

window.EJS_ready = function () {

    console.log("EmulatorJS pronto!");

};


// =================================================
// CDN DO EMULATORJS
// =================================================

window.EJS_pathtodata =
    "https://cdn.emulatorjs.org/4.2.2/data/";


// =================================================
// CARREGAR LOADER
// =================================================

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
```

}
