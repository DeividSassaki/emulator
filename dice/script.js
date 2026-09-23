// =========================
// CONFIGURAÇÃO
// =========================

let dadoSelecionado = 6;
let total = 0;

const botoesDados = document.querySelectorAll(".dado-btn");
const botaoRolar = document.getElementById("rolar");
const botaoResetar = document.getElementById("resetar");

const dado3d = document.getElementById("dado3d");
const numeroDado = document.getElementById("numeroDado");

const resultado = document.getElementById("resultado");
const totalElemento = document.getElementById("total");


// =========================
// SELECIONAR DADO
// =========================

botoesDados.forEach(botao => {

    botao.addEventListener("click", () => {

        dadoSelecionado = Number(botao.dataset.dado);

        // Remove seleção dos outros
        botoesDados.forEach(b => {
            b.classList.remove("selecionado");
        });

        // Marca o escolhido
        botao.classList.add("selecionado");

        // Mostra a quantidade de lados no dado
        numeroDado.textContent = dadoSelecionado;

    });

});


// =========================
// ROLAR DADO
// =========================

botaoRolar.addEventListener("click", () => {

    // Impede clicar durante a animação
    botaoRolar.disabled = true;

    // Sorteia número
    const valor = Math.floor(
        Math.random() * dadoSelecionado
    ) + 1;

    // Reinicia animação
    dado3d.classList.remove("rolando");

    void dado3d.offsetWidth;

    dado3d.classList.add("rolando");


    // Depois da animação mostra resultado
    setTimeout(() => {

        numeroDado.textContent = valor;

        resultado.textContent = valor;

        total += valor;

        totalElemento.textContent = total;

        botaoRolar.disabled = false;

    }, 900);

});


// =========================
// RESETAR
// =========================

botaoResetar.addEventListener("click", () => {

    total = 0;

    resultado.textContent = "—";

    totalElemento.textContent = "0";

    numeroDado.textContent = dadoSelecionado;

});


// =========================
// D6 INICIAL
// =========================

document
    .querySelector('[data-dado="6"]')
    .classList.add("selecionado");
