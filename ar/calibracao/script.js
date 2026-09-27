/* =========================================================
   ELEMENTOS
========================================================= */

const scene =
    document.getElementById("scene");

const botaoIniciar =
    document.getElementById("iniciar");

const status =
    document.getElementById("status");

const modelo =
    document.getElementById("heroModelObject");


/* =========================================================
   SLIDERS DE POSIÇÃO
========================================================= */

const sliderX =
    document.getElementById("sliderX");

const sliderY =
    document.getElementById("sliderY");

const sliderZ =
    document.getElementById("sliderZ");


/* =========================================================
   SLIDERS DE ROTAÇÃO
========================================================= */

const sliderRotacaoX =
    document.getElementById("sliderRotacaoX");

const sliderRotacaoY =
    document.getElementById("sliderRotacaoY");

const sliderRotacaoZ =
    document.getElementById("sliderRotacaoZ");


/* =========================================================
   SLIDER DE TAMANHO
========================================================= */

const sliderEscala =
    document.getElementById("sliderEscala");


/* =========================================================
   VALORES EXIBIDOS
========================================================= */

const valorX =
    document.getElementById("valorX");

const valorY =
    document.getElementById("valorY");

const valorZ =
    document.getElementById("valorZ");


const valorRotacaoX =
    document.getElementById("valorRotacaoX");

const valorRotacaoY =
    document.getElementById("valorRotacaoY");

const valorRotacaoZ =
    document.getElementById("valorRotacaoZ");


const valorEscala =
    document.getElementById("valorEscala");


const configuracao =
    document.getElementById("configuracao");


/* =========================================================
   BOTÕES
========================================================= */

const botaoResetar =
    document.getElementById("resetar");

const botaoCopiar =
    document.getElementById("copiar");


/* =========================================================
   SISTEMA AR
========================================================= */

let arSystem = null;


/* =========================================================
   VALORES PADRÃO
========================================================= */

const PADRAO = {

    x: 0,

    y: 0,

    z: 0.1,

    rotacaoX: 0,

    rotacaoY: 0,

    rotacaoZ: 0,

    escala: 2

};


/* =========================================================
   CENA PRONTA
========================================================= */

scene.addEventListener(
    "loaded",
    () => {

        arSystem =
            scene.systems[
                "mindar-image-system"
            ];


        console.log(
            "MindAR pronto."
        );


        atualizarModelo();

    }
);


/* =========================================================
   MODELO CARREGADO
========================================================= */

modelo.addEventListener(
    "model-loaded",
    () => {

        console.log(
            "Hero of Time.glb carregado."
        );


        atualizarModelo();


        status.textContent =
            "Modelo carregado. Inicie a câmera.";

    }
);


/* =========================================================
   ERRO AO CARREGAR MODELO
========================================================= */

modelo.addEventListener(
    "model-error",
    (evento) => {

        console.error(
            "Erro ao carregar GLB:",
            evento
        );


        status.textContent =
            "Erro ao carregar o modelo.";

    }
);


/* =========================================================
   INICIAR CÂMERA
========================================================= */

botaoIniciar.addEventListener(
    "click",
    async () => {

        try {

            if (!arSystem) {

                status.textContent =
                    "Preparando câmera...";

                return;

            }


            status.textContent =
                "Iniciando câmera...";


            await arSystem.start();


            status.textContent =
                "Aponte para o marcador.";


            botaoIniciar.style.display =
                "none";

        } catch (erro) {

            console.error(
                "Erro ao iniciar câmera:",
                erro
            );


            status.textContent =
                "Erro ao iniciar a câmera.";

        }

    }
);


/* =========================================================
   MARCADOR ENCONTRADO
========================================================= */

const target =
    document.getElementById("targetZelda");


target.addEventListener(
    "targetFound",
    () => {

        status.textContent =
            "✅ Marcador encontrado.";

    }
);


target.addEventListener(
    "targetLost",
    () => {

        status.textContent =
            "Aponte novamente para o marcador.";

    }
);


/* =========================================================
   ATUALIZA MODELO
========================================================= */

function atualizarModelo() {

    if (!modelo) {
        return;
    }


    const x =
        Number(sliderX.value);

    const y =
        Number(sliderY.value);

    const z =
        Number(sliderZ.value);


    const rotacaoX =
        Number(sliderRotacaoX.value);

    const rotacaoY =
        Number(sliderRotacaoY.value);

    const rotacaoZ =
        Number(sliderRotacaoZ.value);


    const escala =
        Number(sliderEscala.value);


    /* =====================================================
       POSIÇÃO
    ====================================================== */

    modelo.object3D.position.set(
        x,
        y,
        z
    );


    /* =====================================================
       ROTAÇÃO
    ====================================================== */

    modelo.object3D.rotation.set(
        grausParaRadiano(rotacaoX),
        grausParaRadiano(rotacaoY),
        grausParaRadiano(rotacaoZ)
    );


    /* =====================================================
       TAMANHO
    ====================================================== */

    modelo.object3D.scale.set(
        escala,
        escala,
        escala
    );


    /* =====================================================
       MOSTRA VALORES
    ====================================================== */

    valorX.textContent =
        x.toFixed(2);

    valorY.textContent =
        y.toFixed(2);

    valorZ.textContent =
        z.toFixed(2);


    valorRotacaoX.textContent =
        rotacaoX + "°";

    valorRotacaoY.textContent =
        rotacaoY + "°";

    valorRotacaoZ.textContent =
        rotacaoZ + "°";


    valorEscala.textContent =
        escala.toFixed(2);


    atualizarConfiguracao();

}


/* =========================================================
   CONVERSÃO
========================================================= */

function grausParaRadiano(graus) {

    return graus *
        Math.PI /
        180;

}


/* =========================================================
   EVENTOS DOS SLIDERS
========================================================= */

sliderX.addEventListener(
    "input",
    atualizarModelo
);

sliderY.addEventListener(
    "input",
    atualizarModelo
);

sliderZ.addEventListener(
    "input",
    atualizarModelo
);


sliderRotacaoX.addEventListener(
    "input",
    atualizarModelo
);

sliderRotacaoY.addEventListener(
    "input",
    atualizarModelo
);

sliderRotacaoZ.addEventListener(
    "input",
    atualizarModelo
);


sliderEscala.addEventListener(
    "input",
    atualizarModelo
);


/* =========================================================
   MOSTRA CONFIGURAÇÃO
========================================================= */

function atualizarConfiguracao() {

    const x =
        Number(sliderX.value);

    const y =
        Number(sliderY.value);

    const z =
        Number(sliderZ.value);


    const rotacaoX =
        Number(sliderRotacaoX.value);

    const rotacaoY =
        Number(sliderRotacaoY.value);

    const rotacaoZ =
        Number(sliderRotacaoZ.value);


    const escala =
        Number(sliderEscala.value);


    configuracao.textContent =
`position="${x.toFixed(2)} ${y.toFixed(2)} ${z.toFixed(2)}"
rotation="${rotacaoX} ${rotacaoY} ${rotacaoZ}"
scale="${escala.toFixed(2)} ${escala.toFixed(2)} ${escala.toFixed(2)}"`;

}


/* =========================================================
   RESETAR
========================================================= */

botaoResetar.addEventListener(
    "click",
    () => {

        sliderX.value =
            PADRAO.x;

        sliderY.value =
            PADRAO.y;

        sliderZ.value =
            PADRAO.z;


        sliderRotacaoX.value =
            PADRAO.rotacaoX;

        sliderRotacaoY.value =
            PADRAO.rotacaoY;

        sliderRotacaoZ.value =
            PADRAO.rotacaoZ;


        sliderEscala.value =
            PADRAO.escala;


        atualizarModelo();

    }
);


/* =========================================================
   COPIAR CONFIGURAÇÃO
========================================================= */

botaoCopiar.addEventListener(
    "click",
    async () => {

        const texto =
            configuracao.textContent;


        try {

            await navigator.clipboard.writeText(
                texto
            );


            botaoCopiar.textContent =
                "✅ Copiado!";


            setTimeout(
                () => {

                    botaoCopiar.textContent =
                        "📋 Copiar configuração";

                },
                1500
            );

        } catch (erro) {

            console.error(
                erro
            );


            alert(
                texto
            );

        }

    }
);


/* =========================================================
   INICIALIZA
========================================================= */

atualizarModelo();
