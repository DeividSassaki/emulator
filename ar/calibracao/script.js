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
   CONTROLES
========================================================= */

const sliderX =
    document.getElementById("sliderX");

const sliderY =
    document.getElementById("sliderY");

const sliderZ =
    document.getElementById("sliderZ");

const sliderRotacaoX =
    document.getElementById("sliderRotacaoX");

const sliderEscala =
    document.getElementById("sliderEscala");


/* =========================================================
   VALORES VISUAIS
========================================================= */

const valorX =
    document.getElementById("valorX");

const valorY =
    document.getElementById("valorY");

const valorZ =
    document.getElementById("valorZ");

const valorRotacaoX =
    document.getElementById("valorRotacaoX");

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
   CONFIGURAÇÃO INICIAL
========================================================= */

const PADRAO = {

    x: 0,

    y: 0,

    z: 0.1,

    rotacaoX: 0,

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
   ATUALIZAR MODELO
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

    const escala =
        Number(sliderEscala.value);


    /* ================================================
       POSIÇÃO
    ================================================= */

    modelo.object3D.position.x =
        x;

    modelo.object3D.position.y =
        y;

    modelo.object3D.position.z =
        z;


    /* ================================================
       ROTAÇÃO X
    ================================================= */

    modelo.object3D.rotation.x =
        rotacaoX *
        Math.PI /
        180;


    /* ================================================
       ESCALA
    ================================================= */

    modelo.object3D.scale.set(
        escala,
        escala,
        escala
    );


    /* ================================================
       MOSTRA VALORES
    ================================================= */

    valorX.textContent =
        x.toFixed(2);

    valorY.textContent =
        y.toFixed(2);

    valorZ.textContent =
        z.toFixed(2);

    valorRotacaoX.textContent =
        rotacaoX + "°";

    valorEscala.textContent =
        escala.toFixed(2);


    atualizarConfiguracao();

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

sliderEscala.addEventListener(
    "input",
    atualizarModelo
);


/* =========================================================
   CONFIGURAÇÃO FINAL
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

    const escala =
        Number(sliderEscala.value);


    configuracao.textContent =
`position="${x.toFixed(2)} ${y.toFixed(2)} ${z.toFixed(2)}"
rotation="${rotacaoX} 0 0"
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
   PRIMEIRA ATUALIZAÇÃO
========================================================= */

atualizarModelo();
