const scene = document.getElementById("scene");
const target = document.getElementById("target");
const modelo = document.getElementById("modelo");
const cubo = document.getElementById("cubo");
const status = document.getElementById("status");


// --------------------------------------------------
// CENA CARREGADA
// --------------------------------------------------

scene.addEventListener("loaded", () => {

    console.log("A-Frame carregado.");

    status.textContent = "📷 Aponte para o marcador.";

});


// --------------------------------------------------
// MARCADOR ENCONTRADO
// --------------------------------------------------

target.addEventListener("targetFound", () => {

    console.log("================================");
    console.log("MARCADOR ENCONTRADO");
    console.log("================================");

    status.textContent = "✅ MARCADOR ENCONTRADO";

});


// --------------------------------------------------
// MARCADOR PERDIDO
// --------------------------------------------------

target.addEventListener("targetLost", () => {

    console.log("Marcador perdido.");

    status.textContent = "📷 Aponte para o marcador.";

});


// --------------------------------------------------
// MODELO CARREGADO
// --------------------------------------------------

modelo.addEventListener("model-loaded", () => {

    console.log("================================");
    console.log("MODELO 3D CARREGADO");
    console.log("================================");

    status.textContent = "✅ MARCADOR + MODELO 3D";

});


modelo.addEventListener("model-error", (evento) => {

    console.error("================================");
    console.error("ERRO NO MODELO 3D");
    console.error(evento);
    console.error("================================");

    status.textContent = "❌ ERRO AO CARREGAR GLB";

});