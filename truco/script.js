let placarNos = 0;
let placarEles = 0;

let vitoriasNos = 0;
let vitoriasEles = 0;

let vencedorPendente = null;


function atualizarPlacar() {

    document.getElementById("nos").textContent = placarNos;
    document.getElementById("eles").textContent = placarEles;

    document.getElementById("vitoriasNos").textContent = vitoriasNos;
    document.getElementById("vitoriasEles").textContent = vitoriasEles;

    document.getElementById("btnNosMais").disabled =
        placarNos >= 12 || vencedorPendente !== null;

    document.getElementById("btnElesMais").disabled =
        placarEles >= 12 || vencedorPendente !== null;

    document.getElementById("btnNosMenos").disabled =
        placarNos <= 0 || vencedorPendente !== null;

    document.getElementById("btnElesMenos").disabled =
        placarEles <= 0 || vencedorPendente !== null;

    atualizarSimbolos();
}


function atualizarSimbolos() {

    const simboloNos = document.getElementById("simboloNos");
    const simboloEles = document.getElementById("simboloEles");

    if (vitoriasNos > vitoriasEles) {

        simboloNos.textContent = "🏆";
        simboloEles.textContent = "❌";

    } else if (vitoriasEles > vitoriasNos) {

        simboloNos.textContent = "❌";
        simboloEles.textContent = "🏆";

    } else {

        simboloNos.textContent = "❌";
        simboloEles.textContent = "❌";
    }
}


function adicionarPonto(time) {

    if (vencedorPendente !== null) {
        return;
    }

    if (time === "nos" && placarNos < 12) {

        placarNos++;

        if (placarNos === 12) {
            abrirConfirmacao("nos");
        }
    }

    if (time === "eles" && placarEles < 12) {

        placarEles++;

        if (placarEles === 12) {
            abrirConfirmacao("eles");
        }
    }

    atualizarPlacar();
}


function removerPonto(time) {

    if (vencedorPendente !== null) {
        return;
    }

    if (time === "nos" && placarNos > 0) {
        placarNos--;
    }

    if (time === "eles" && placarEles > 0) {
        placarEles--;
    }

    atualizarPlacar();
}


function abrirConfirmacao(time) {

    vencedorPendente = time;

    const nome = obterNome(time);

    document.getElementById("mensagemVitoria").textContent =
        nome + " venceu a partida?";

    document.getElementById("confirmacao")
        .classList.remove("oculto");

    atualizarPlacar();
}


function confirmarVitoria() {

    if (vencedorPendente === null) {
        return;
    }

    if (vencedorPendente === "nos") {
        vitoriasNos++;
    }

    if (vencedorPendente === "eles") {
        vitoriasEles++;
    }

    placarNos = 0;
    placarEles = 0;

    vencedorPendente = null;

    document.getElementById("confirmacao")
        .classList.add("oculto");

    atualizarPlacar();
}


function cancelarVitoria() {

    vencedorPendente = null;

    document.getElementById("confirmacao")
        .classList.add("oculto");

    atualizarPlacar();
}


function zerarPartida() {

    placarNos = 0;
    placarEles = 0;

    vencedorPendente = null;

    document.getElementById("confirmacao")
        .classList.add("oculto");

    atualizarPlacar();
}


function obterNome(time) {

    if (time === "nos") {

        const seletor = document.getElementById("seletorNos");

        return seletor.value;
    }

    if (time === "eles") {

        const seletor = document.getElementById("seletorEles");

        return seletor.value;
    }

    return "";
}


function configurarSeletor(idSeletor, idInput) {

    const seletor = document.getElementById(idSeletor);
    const input = document.getElementById(idInput);

    seletor.addEventListener("change", function () {

        if (seletor.value === "personalizado") {

            input.value = "";
            input.classList.add("mostrar");
            input.focus();

        } else {

            input.classList.remove("mostrar");
            input.value = "";
        }
    });


    input.addEventListener("keydown", function(event) {

        if (event.key !== "Enter") {
            return;
        }

        event.preventDefault();

        const nome = input.value.trim();

        if (nome === "") {
            return;
        }

        /*
         * Procura se já existe uma opção com esse nome.
         */
        let opcaoExistente = Array.from(seletor.options)
            .find(opcao => opcao.value === nome);

        /*
         * Se não existir, cria uma nova opção.
         */
        if (!opcaoExistente) {

            opcaoExistente = document.createElement("option");

            opcaoExistente.value = nome;
            opcaoExistente.textContent = nome;

            seletor.appendChild(opcaoExistente);
        }

        /*
         * Coloca o nome dentro do próprio botão/seletor.
         */
        seletor.value = nome;

        /*
         * Esconde o campo de digitação.
         */
        input.classList.remove("mostrar");
        input.value = "";

        /*
         * Atualiza a confirmação caso ela esteja aberta.
         */
        if (vencedorPendente !== null) {

            const nomeVencedor = obterNome(vencedorPendente);

            document.getElementById("mensagemVitoria").textContent =
                nomeVencedor + " venceu a partida?";
        }
    });
}


function alternarTelaCheia() {

    if (!document.fullscreenElement) {

        document.documentElement
            .requestFullscreen()
            .catch(() => {});

    } else {

        document.exitFullscreen()
            .catch(() => {});
    }
}


configurarSeletor("seletorNos", "nomeNos");
configurarSeletor("seletorEles", "nomeEles");

atualizarPlacar();