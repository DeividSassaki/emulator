const romInput = document.getElementById("romInput");

romInput.addEventListener("change", function () {

    const file = romInput.files[0];

    if (!file) {
        return;
    }

    console.log("ROM selecionada:", file.name);

    const romURL = URL.createObjectURL(file);

    iniciarEmulador(romURL, file.name);
});


function iniciarEmulador(romURL, nomeArquivo) {

    document.getElementById("game").innerHTML = "";

    window.EJS_player = "#game";

    window.EJS_gameName =
        nomeArquivo.replace(/\.[^/.]+$/, "");

    window.EJS_biosUrl = "";

    window.EJS_gameUrl = romURL;

    window.EJS_core = "snes";

    window.EJS_mouse = false;

    window.EJS_multitap = false;

    window.EJS_startOnLoaded = true;

    window.EJS_pathtodata =
        "https://cdn.emulatorjs.org/4.2.2/data/";

    const script = document.createElement("script");

    script.src =
        "https://cdn.emulatorjs.org/4.2.2/data/loader.js";

    script.onload = function () {
        console.log("EmulatorJS carregado.");
    };

    script.onerror = function () {
        console.error("Não foi possível carregar o EmulatorJS.");
    };

    document.body.appendChild(script);
}
