let placarNos = 0;
let placarEles = 0;

function atualizarPlacar() {
    document.getElementById("nos").textContent = placarNos;
    document.getElementById("eles").textContent = placarEles;

    document.getElementById("btnNos").disabled = placarNos >= 12;
    document.getElementById("btnEles").disabled = placarEles >= 12;
}

function adicionarPonto(time) {
    if (time === "nos") {
        if (placarNos < 12) {
            placarNos++;
        }
    }

    if (time === "eles") {
        if (placarEles < 12) {
            placarEles++;
        }
    }

    atualizarPlacar();
}

function zerarJogo() {
    placarNos = 0;
    placarEles = 0;

    atualizarPlacar();
}

function alternarTelaCheia() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
    } else {
        document.exitFullscreen().catch(() => {});
    }
}

atualizarPlacar();
