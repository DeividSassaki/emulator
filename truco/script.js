let placarNos = 0;
let placarEles = 0;

function atualizarPlacar() {
document.getElementById("nos").textContent = placarNos;
document.getElementById("eles").textContent = placarEles;

```
document.getElementById("btnNosMais").disabled = placarNos >= 12;
document.getElementById("btnElesMais").disabled = placarEles >= 12;

document.getElementById("btnNosMenos").disabled = placarNos <= 0;
document.getElementById("btnElesMenos").disabled = placarEles <= 0;
```

}

function adicionarPonto(time) {
if (time === "nos" && placarNos < 12) {
placarNos++;
}

```
if (time === "eles" && placarEles < 12) {
    placarEles++;
}

atualizarPlacar();
```

}

function removerPonto(time) {
if (time === "nos" && placarNos > 0) {
placarNos--;
}

```
if (time === "eles" && placarEles > 0) {
    placarEles--;
}

atualizarPlacar();
```

}

function zerarJogo() {
placarNos = 0;
placarEles = 0;

```
atualizarPlacar();
```

}

function alternarTelaCheia() {
if (!document.fullscreenElement) {
document.documentElement.requestFullscreen().catch(() => {});
} else {
document.exitFullscreen().catch(() => {});
}
}

atualizarPlacar();
