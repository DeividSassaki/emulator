// ============================================================
// CALIBRAÇÃO AR
//
// MARCADOR
//    ↓
// PIVOT AVÔ
//    ↓
// PIVOT PAI
//    ↓
// GLB
//
// Cada transformação é local ao seu próprio pai.
// ============================================================


const target =
    document.getElementById("targetZelda");

const pivotAvo =
    document.getElementById("pivotAvo");

const pivotPai =
    document.getElementById("pivotPai");

const objeto =
    document.getElementById("objectEntity");


// ============================================================
// INTERFACE
// ============================================================

const status =
    document.getElementById("status");

const botaoPivotAvo =
    document.getElementById("botaoPivotAvo");

const botaoPivotPai =
    document.getElementById("botaoPivotPai");

const botaoObjeto =
    document.getElementById("botaoObjeto");

const botaoRotacao =
    document.getElementById("botaoRotacao");

const botaoMovimento =
    document.getElementById("botaoMovimento");

const sliderX =
    document.getElementById("sliderX");

const sliderY =
    document.getElementById("sliderY");

const sliderZ =
    document.getElementById("sliderZ");

const valorX =
    document.getElementById("valorX");

const valorY =
    document.getElementById("valorY");

const valorZ =
    document.getElementById("valorZ");

const labelX =
    document.getElementById("labelX");

const labelY =
    document.getElementById("labelY");

const labelZ =
    document.getElementById("labelZ");

const sliderEscala =
    document.getElementById("sliderEscala");

const valorEscala =
    document.getElementById("valorEscala");

const controleEscala =
    document.getElementById("controleEscala");

const grupoEscala =
    document.getElementById("grupoEscala");

const resetar =
    document.getElementById("resetar");

const copiarJSON =
    document.getElementById("copiarJSON");

const configuracao =
    document.getElementById("configuracao");


// ============================================================
// ESTADO
// ============================================================

let configuracaoBase = null;

let elementoSelecionado =
    "pivotAvo";

let modoControle =
    "rotacao";


// ============================================================
// FUNÇÕES
// ============================================================

function numero(valor) {

    const n = Number(valor);

    return Number.isFinite(n)
        ? n
        : 0;
}


function arredondar(
    valor,
    casas = 2
) {

    return Number(
        Number(valor).toFixed(casas)
    );

}


function vetorZero() {

    return {
        x: 0,
        y: 0,
        z: 0
    };

}


// ============================================================
// ELEMENTO SELECIONADO
// ============================================================

function obterElementoSelecionado() {

    if (
        elementoSelecionado ===
        "pivotAvo"
    ) {

        return pivotAvo.object3D;

    }

    if (
        elementoSelecionado ===
        "pivotPai"
    ) {

        return pivotPai.object3D;

    }

    return objeto.object3D;

}


// ============================================================
// SELEÇÃO DO ELEMENTO
// ============================================================

function selecionarElemento(
    elemento
) {

    elementoSelecionado =
        elemento;


    botaoPivotAvo.classList.toggle(
        "ativo",
        elemento === "pivotAvo"
    );


    botaoPivotPai.classList.toggle(
        "ativo",
        elemento === "pivotPai"
    );


    botaoObjeto.classList.toggle(
        "ativo",
        elemento === "objeto"
    );


    atualizarInterface();

}


// ============================================================
// SELEÇÃO DO MODO
// ============================================================

function selecionarModo(
    modo
) {

    modoControle =
        modo;


    botaoRotacao.classList.toggle(
        "ativo",
        modo === "rotacao"
    );


    botaoMovimento.classList.toggle(
        "ativo",
        modo === "movimento"
    );


    atualizarInterface();

}


// ============================================================
// INTERFACE
// ============================================================

function atualizarInterface() {

    const elemento =
        obterElementoSelecionado();


    if (!elemento) {
        return;
    }


    if (
        modoControle ===
        "rotacao"
    ) {

        labelX.textContent =
            "Rotação X";

        labelY.textContent =
            "Rotação Y";

        labelZ.textContent =
            "Rotação Z";


        sliderX.min = -360;
        sliderX.max = 360;
        sliderX.step = 0.1;

        sliderY.min = -360;
        sliderY.max = 360;
        sliderY.step = 0.1;

        sliderZ.min = -360;
        sliderZ.max = 360;
        sliderZ.step = 0.1;


        sliderX.value =
            arredondar(
                THREE.MathUtils.radToDeg(
                    elemento.rotation.x
                ),
                1
            );


        sliderY.value =
            arredondar(
                THREE.MathUtils.radToDeg(
                    elemento.rotation.y
                ),
                1
            );


        sliderZ.value =
            arredondar(
                THREE.MathUtils.radToDeg(
                    elemento.rotation.z
                ),
                1
            );


        valorX.textContent =
            Number(
                sliderX.value
            ).toFixed(2);


        valorY.textContent =
            Number(
                sliderY.value
            ).toFixed(2);


        valorZ.textContent =
            Number(
                sliderZ.value
            ).toFixed(2);

    } else {

        labelX.textContent =
            "Posição X";

        labelY.textContent =
            "Posição Y";

        labelZ.textContent =
            "Posição Z";


        sliderX.min = -5;
        sliderX.max = 5;
        sliderX.step = 0.001;

        sliderY.min = -5;
        sliderY.max = 5;
        sliderY.step = 0.001;

        sliderZ.min = -5;
        sliderZ.max = 5;
        sliderZ.step = 0.001;


        sliderX.value =
            arredondar(
                elemento.position.x,
                3
            );


        sliderY.value =
            arredondar(
                elemento.position.y,
                3
            );


        sliderZ.value =
            arredondar(
                elemento.position.z,
                3
            );


        valorX.textContent =
            Number(
                sliderX.value
            ).toFixed(3);


        valorY.textContent =
            Number(
                sliderY.value
            ).toFixed(3);


        valorZ.textContent =
            Number(
                sliderZ.value
            ).toFixed(3);

    }


    const mostrarEscala =
        elementoSelecionado ===
        "objeto";


    controleEscala.style.display =
        mostrarEscala
            ? "block"
            : "none";


    grupoEscala.style.display =
        mostrarEscala
            ? "block"
            : "none";


    if (mostrarEscala) {

        const escala =
            objeto.object3D.scale.x;


        sliderEscala.value =
            arredondar(
                escala,
                2
            );


        valorEscala.textContent =
            Number(
                sliderEscala.value
            ).toFixed(2);

    }


    atualizarJSON();

}


// ============================================================
// ALTERAR EIXO
// ============================================================

function alterarEixo(
    eixo,
    valor
) {

    const elemento =
        obterElementoSelecionado();


    if (!elemento) {
        return;
    }


    const numeroValor =
        Number(valor);


    if (
        modoControle ===
        "rotacao"
    ) {

        elemento.rotation[eixo] =
            THREE.MathUtils.degToRad(
                numeroValor
            );

    } else {

        elemento.position[eixo] =
            numeroValor;

    }


    atualizarInterface();

}


// ============================================================
// SLIDERS
// ============================================================

sliderX.addEventListener(
    "input",
    function () {

        alterarEixo(
            "x",
            this.value
        );

    }
);


sliderY.addEventListener(
    "input",
    function () {

        alterarEixo(
            "y",
            this.value
        );

    }
);


sliderZ.addEventListener(
    "input",
    function () {

        alterarEixo(
            "z",
            this.value
        );

    }
);


// ============================================================
// ESCALA
// ============================================================

sliderEscala.addEventListener(
    "input",
    function () {

        const escala =
            Number(this.value);


        objeto.object3D.scale.set(
            escala,
            escala,
            escala
        );


        valorEscala.textContent =
            escala.toFixed(2);


        atualizarJSON();

    }
);


// ============================================================
// RESET
// ============================================================

function resetarTudo() {

    pivotAvo.object3D.position.set(
        0,
        0,
        0
    );

    pivotAvo.object3D.rotation.set(
        0,
        0,
        0
    );


    pivotPai.object3D.position.set(
        0,
        0,
        0
    );

    pivotPai.object3D.rotation.set(
        0,
        0,
        0
    );


    objeto.object3D.position.set(
        0,
        0,
        0
    );

    objeto.object3D.rotation.set(
        0,
        0,
        0
    );

    objeto.object3D.scale.set(
        1,
        1,
        1
    );


    atualizarInterface();

}


resetar.addEventListener(
    "click",
    resetarTudo
);


// ============================================================
// COPIAR JSON
// ============================================================

copiarJSON.addEventListener(
    "click",
    async function () {

        const texto =
            configuracao.textContent;


        try {

            await navigator.clipboard.writeText(
                texto
            );


            const original =
                copiarJSON.textContent;


            copiarJSON.textContent =
                "✓ JSON Copiado";


            setTimeout(
                function () {

                    copiarJSON.textContent =
                        original;

                },
                1500
            );

        } catch (erro) {

            console.error(erro);

            alert(
                "Não foi possível copiar o JSON."
            );

        }

    }
);


// ============================================================
// GERAR JSON
// ============================================================

function gerarConfiguracao() {

    const avo =
        pivotAvo.object3D;

    const pai =
        pivotPai.object3D;

    const obj =
        objeto.object3D;


    const resultado = {

        nome:
            configuracaoBase?.nome ||
            "AR",


        modelo:
            configuracaoBase?.modelo ??
            null,


        marcador:
            configuracaoBase?.marcador ??
            "targets.mind",


        pivotAvo: {

            position: {

                x: arredondar(
                    avo.position.x,
                    4
                ),

                y: arredondar(
                    avo.position.y,
                    4
                ),

                z: arredondar(
                    avo.position.z,
                    4
                )

            },


            rotation: {

                x: arredondar(
                    THREE.MathUtils.radToDeg(
                        avo.rotation.x
                    ),
                    2
                ),

                y: arredondar(
                    THREE.MathUtils.radToDeg(
                        avo.rotation.y
                    ),
                    2
                ),

                z: arredondar(
                    THREE.MathUtils.radToDeg(
                        avo.rotation.z
                    ),
                    2
                )

            }

        },


        pivotPai: {

            position: {

                x: arredondar(
                    pai.position.x,
                    4
                ),

                y: arredondar(
                    pai.position.y,
                    4
                ),

                z: arredondar(
                    pai.position.z,
                    4
                )

            },


            rotation: {

                x: arredondar(
                    THREE.MathUtils.radToDeg(
                        pai.rotation.x
                    ),
                    2
                ),

                y: arredondar(
                    THREE.MathUtils.radToDeg(
                        pai.rotation.y
                    ),
                    2
                ),

                z: arredondar(
                    THREE.MathUtils.radToDeg(
                        pai.rotation.z
                    ),
                    2
                )

            }

        },


        position: {

            x: arredondar(
                obj.position.x,
                4
            ),

            y: arredondar(
                obj.position.y,
                4
            ),

            z: arredondar(
                obj.position.z,
                4
            )

        },


        rotation: {

            x: arredondar(
                THREE.MathUtils.radToDeg(
                    obj.rotation.x
                ),
                2
            ),

            y: arredondar(
                THREE.MathUtils.radToDeg(
                    obj.rotation.y
                ),
                2
            ),

            z: arredondar(
                THREE.MathUtils.radToDeg(
                    obj.rotation.z
                ),
                2
            )

        },


        scale:
            arredondar(
                obj.scale.x,
                4
            )

    };


    if (
        configuracaoBase &&
        Object.prototype.hasOwnProperty.call(
            configuracaoBase,
            "audio"
        )
    ) {

        resultado.audio =
            configuracaoBase.audio;

    }


    if (
        configuracaoBase &&
        Object.prototype.hasOwnProperty.call(
            configuracaoBase,
            "imagem"
        )
    ) {

        resultado.imagem =
            configuracaoBase.imagem;

    }


    if (
        configuracaoBase &&
        Object.prototype.hasOwnProperty.call(
            configuracaoBase,
            "video"
        )
    ) {

        resultado.video =
            configuracaoBase.video;

    }


    return resultado;

}


// ============================================================
// MOSTRAR JSON
// ============================================================

function atualizarJSON() {

    configuracao.textContent =
        JSON.stringify(
            gerarConfiguracao(),
            null,
            2
        );

}


// ============================================================
// CARREGAR CONFIG.JSON
// ============================================================

async function carregarConfiguracao() {

    try {

        const resposta =
            await fetch(
                "../marcadores/zelda/config.json?" +
                Date.now()
            );


        if (!resposta.ok) {

            throw new Error(
                "Erro HTTP " +
                resposta.status
            );

        }


        const config =
            await resposta.json();


        configuracaoBase =
            config;


        aplicarConfiguracao(
            config
        );


        status.textContent =
            "Configuração carregada.";

    } catch (erro) {

        console.error(
            "Erro ao carregar configuração:",
            erro
        );


        status.textContent =
            "Erro ao carregar config.json.";


        configuracaoBase = {

            nome: "Zelda AR",

            modelo:
                "Hero of Time.glb",

            marcador:
                "targets.mind"

        };


        resetarTudo();

    }

}


// ============================================================
// APLICA CONFIGURAÇÃO
// ============================================================

function aplicarConfiguracao(
    config
) {

    // --------------------------------------------------------
    // PIVOT AVÔ
    // --------------------------------------------------------

    const avoPosition =
        config.pivotAvo?.position ||
        vetorZero();

    const avoRotation =
        config.pivotAvo?.rotation ||
        vetorZero();


    pivotAvo.object3D.position.set(
        numero(avoPosition.x),
        numero(avoPosition.y),
        numero(avoPosition.z)
    );


    pivotAvo.object3D.rotation.set(
        THREE.MathUtils.degToRad(
            numero(avoRotation.x)
        ),

        THREE.MathUtils.degToRad(
            numero(avoRotation.y)
        ),

        THREE.MathUtils.degToRad(
            numero(avoRotation.z)
        )
    );


    // --------------------------------------------------------
    // PIVOT PAI
    // --------------------------------------------------------

    const paiPosition =
        config.pivotPai?.position ||
        vetorZero();

    const paiRotation =
        config.pivotPai?.rotation ||
        vetorZero();


    pivotPai.object3D.position.set(
        numero(paiPosition.x),
        numero(paiPosition.y),
        numero(paiPosition.z)
    );


    pivotPai.object3D.rotation.set(
        THREE.MathUtils.degToRad(
            numero(paiRotation.x)
        ),

        THREE.MathUtils.degToRad(
            numero(paiRotation.y)
        ),

        THREE.MathUtils.degToRad(
            numero(paiRotation.z)
        )
    );


    // --------------------------------------------------------
    // OBJETO
    // --------------------------------------------------------

    const objectPosition =
        config.position ||
        vetorZero();

    const objectRotation =
        config.rotation ||
        vetorZero();


    objeto.object3D.position.set(
        numero(objectPosition.x),
        numero(objectPosition.y),
        numero(objectPosition.z)
    );


    objeto.object3D.rotation.set(
        THREE.MathUtils.degToRad(
            numero(objectRotation.x)
        ),

        THREE.MathUtils.degToRad(
            numero(objectRotation.y)
        ),

        THREE.MathUtils.degToRad(
            numero(objectRotation.z)
        )
    );


    const escala =
        numero(config.scale) || 1;


    objeto.object3D.scale.set(
        escala,
        escala,
        escala
    );


    atualizarInterface();

}


// ============================================================
// BOTÕES
// ============================================================

botaoPivotAvo.addEventListener(
    "click",
    function () {

        selecionarElemento(
            "pivotAvo"
        );

    }
);


botaoPivotPai.addEventListener(
    "click",
    function () {

        selecionarElemento(
            "pivotPai"
        );

    }
);


botaoObjeto.addEventListener(
    "click",
    function () {

        selecionarElemento(
            "objeto"
        );

    }
);


botaoRotacao.addEventListener(
    "click",
    function () {

        selecionarModo(
            "rotacao"
        );

    }
);


botaoMovimento.addEventListener(
    "click",
    function () {

        selecionarModo(
            "movimento"
        );

    }
);


// ============================================================
// INÍCIO
// ============================================================

carregarConfiguracao();