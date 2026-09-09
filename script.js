```javascript
// =========================
// ELEMENTOS DA PÁGINA
// =========================

const romInput = document.getElementById("romInput");
const screen = document.getElementById("screen");
const fullscreenButton = document.getElementById("fullscreenButton");

const ctx = screen.getContext("2d");


// =========================
// CONFIGURAÇÃO DA TELA
// =========================

screen.width = 256;
screen.height = 224;


// =========================
// CARREGAR ROM
// =========================

romInput.addEventListener("change", function () {

    const file = romInput.files[0];

    if (!file) {
        return;
    }

    console.log("ROM selecionada:");
    console.log(file.name);
    console.log("Tamanho:", file.size, "bytes");

    // Por enquanto apenas mostramos uma mensagem.
    // O emulador será conectado aqui posteriormente.

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, screen.width, screen.height);

    ctx.fillStyle = "white";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";

    ctx.fillText(
        "ROM carregada",
        screen.width / 2,
        screen.height / 2 - 10
    );

    ctx.fillText(
        file.name,
        screen.width / 2,
        screen.height / 2 + 10
    );

    console.log("Aguardando o core SNES...");
});


// =========================
// TELA CHEIA
// =========================

fullscreenButton.addEventListener("click", function () {

    const container = document.querySelector(".screen-container");

    if (!document.fullscreenElement) {

        container.requestFullscreen().catch(function (error) {
            console.log("Erro ao entrar em tela cheia:", error);
        });

    } else {

        document.exitFullscreen();

    }

});


// =========================
// TECLADO
// =========================

// Mapeamento do teclado para o SNES

const keyboardMap = {

    ArrowUp: "up",
    ArrowDown: "down",
    ArrowLeft: "left",
    ArrowRight: "right",

    z: "b",
    x: "a",

    a: "y",
    s: "x",

    Enter: "start",
    Shift: "select"
};


// =========================
// TECLADO - PRESSIONAR
// =========================

document.addEventListener("keydown", function (event) {

    const key = keyboardMap[event.key];

    if (!key) {
        return;
    }

    event.preventDefault();

    console.log("Pressionou:", key);

    // Posteriormente:
    // emulator.buttonDown(key);
});


// =========================
// TECLADO - SOLTAR
// =========================

document.addEventListener("keyup", function (event) {

    const key = keyboardMap[event.key];

    if (!key) {
        return;
    }

    event.preventDefault();

    console.log("Soltou:", key);

    // Posteriormente:
    // emulator.buttonUp(key);
});


// =========================
// BOTÕES NA TELA
// =========================

const buttons = document.querySelectorAll("[data-key]");

buttons.forEach(function (button) {

    // Pressionar botão

    button.addEventListener("mousedown", function () {

        const key = button.dataset.key;

        console.log("Botão pressionado:", key);

        // Posteriormente:
        // emulator.buttonDown(key);
    });


    // Soltar botão

    button.addEventListener("mouseup", function () {

        const key = button.dataset.key;

        console.log("Botão solto:", key);

        // Posteriormente:
        // emulator.buttonUp(key);
    });


    // Para telas sensíveis ao toque

    button.addEventListener("touchstart", function (event) {

        event.preventDefault();

        const key = button.dataset.key;

        console.log("Touch pressionado:", key);

        // Posteriormente:
        // emulator.buttonDown(key);
    });


    button.addEventListener("touchend", function (event) {

        event.preventDefault();

        const key = button.dataset.key;

        console.log("Touch solto:", key);

        // Posteriormente:
        // emulator.buttonUp(key);
    });

});


// =========================
// INÍCIO
// =========================

console.log("SNES Emulator iniciado.");
console.log("Aguardando ROM...");
```
