const target = document.getElementById("targetZelda");

const pivot = document.getElementById("pivotEntity");

const objeto = document.getElementById("objectEntity");

const status = document.getElementById("status");

const configuracao =
    document.getElementById("configuracao");


// ============================================================
// BOTÕES
// ============================================================

const botaoPivot =
    document.getElementById("botaoPivot");

const botaoObjeto =
    document.getElementById("botaoObjeto");

const botaoRotacao =
    document.getElementById("botaoRotacao");

const botaoMovimento =
    document.getElementById("botaoMovimento");

const botaoResetar =
    document.getElementById("resetar");

const botaoCopiar =
    document.getElementById("copiarJSON");


// ============================================================
// SLIDERS
// ============================================================

const sliderX =
    document.getElementById("sliderX");

const sliderY =
    document.getElementById("sliderY");

const sliderZ =
    document.getElementById("sliderZ");

const sliderEscala =
    document.getElementById("sliderEscala");


// ============================================================
// VALORES
// ============================================================

const valorX =
    document.getElementById("valorX");

const valorY =
    document.getElementById("valorY");

const valorZ =
    document.getElementById("valorZ");

const valorEscala =
    document.getElementById("valorEscala");

const labelX =
    document.getElementById("labelX");

const labelY =
    document.getElementById("labelY");

const labelZ =
    document.getElementById("labelZ");


// ============================================================
// ESTADO
// ============================================================

let elementoSelecionado = "pivot";

let controleSelecionado = "rotacao";

let config = null;


// ============================================================
// PASTA
// ============================================================

const parametros =
    new URLSearchParams(
        window.location.search
    );

const pasta =
    parametros.get("pasta") || "zelda";


// ============================================================
// CONFIGURAÇÃO PADRÃO
// ============================================================

const configPadrao = {

    modelo: "Hero of Time.glb",

    imagem: null,

    video: null,

    position: {
        x: 0,
        y: 0,
        z: 0
    },

    rotation: {
        x: 0,
        y: 0,
        z: 0
    },

    scale: 1,

    pivot: {
        x: 0,
        y: 0,
        z: 0
    },

    pivotRotation: {
        x: 0,
        y: 0,
        z: 0
    },

    audio: "musica.mp3"

};


// ============================================================
// COPIAR OBJETO
// ============================================================

function copiar(obj) {

    return JSON.parse(
        JSON.stringify(obj)
    );

}


// ============================================================
// GARANTIR CAMPOS
// ============================================================

function garantirConfiguracao() {

    if (!config.position) {

        config.position = {
            x: 0,
            y: 0,
            z: 0
        };

    }


    if (!config.rotation) {

        config.rotation = {
            x: 0,
            y: 0,
            z: 0
        };

    }


    if (!config.pivot) {

        config.pivot = {
            x: 0,
            y: 0,
            z: 0
        };

    }


    if (!config.pivotRotation) {

        config.pivotRotation = {
            x: 0,
            y: 0,
            z: 0
        };

    }


    if (config.scale === undefined) {

        config.scale = 1;

    }


    if (config.modelo === undefined) {

        config.modelo = null;

    }


    if (config.imagem === undefined) {

        config.imagem = null;

    }


    if (config.video === undefined) {

        config.video = null;

    }


    if (config.audio === undefined) {

        config.audio = null;

    }

}


// ============================================================
// CAMINHO DO RECURSO
// ============================================================

function caminhoRecurso(nome) {

    if (!nome) {

        return null;

    }

    return (
        `../marcadores/${pasta}/${nome}`
    );

}


// ============================================================
// CRIAR GLB
// ============================================================

function criarModeloGLB(nome) {

    if (!nome) {

        return;

    }


    const modelo =
        document.createElement(
            "a-gltf-model"
        );


    modelo.id =
        "heroModelObject";


    modelo.setAttribute(
        "src",
        caminhoRecurso(nome)
    );


    modelo.setAttribute(
        "position",
        "0 0 0"
    );


    modelo.setAttribute(
        "rotation",
        "0 0 0"
    );


    modelo.setAttribute(
        "scale",
        "1 1 1"
    );


    objeto.appendChild(modelo);


    modelo.addEventListener(
        "model-loaded",
        () => {

            status.textContent =
                `GLB carregado: ${nome}`;

        }
    );


    modelo.addEventListener(
        "model-error",
        () => {

            status.textContent =
                `Erro ao carregar GLB: ${nome}`;

        }
    );

}


// ============================================================
// CRIAR IMAGEM
// ============================================================

function criarImagem(nome) {

    if (!nome) {

        return;

    }


    const imagem =
        document.createElement(
            "a-image"
        );


    imagem.id =
        "recursoImagem";


    imagem.setAttribute(
        "src",
        caminhoRecurso(nome)
    );


    imagem.setAttribute(
        "position",
        "0 0 0"
    );


    imagem.setAttribute(
        "rotation",
        "0 0 0"
    );


    imagem.setAttribute(
        "width",
        "1"
    );


    imagem.setAttribute(
        "height",
        "1"
    );


    objeto.appendChild(imagem);

}


// ============================================================
// CRIAR VÍDEO
// ============================================================

function criarVideo(nome) {

    if (!nome) {

        return;

    }


    const video =
        document.createElement(
            "video"
        );


    video.id =
        "recursoVideo";


    video.src =
        caminhoRecurso(nome);


    video.loop = true;

    video.muted = true;

    video.playsInline = true;

    video.setAttribute(
        "playsinline",
        ""
    );


    video.preload =
        "auto";


    document
        .querySelector("a-assets")
        .appendChild(video);


    const entidade =
        document.createElement(
            "a-video"
        );


    entidade.id =
        "videoAR";


    entidade.setAttribute(
        "src",
        "#recursoVideo"
    );


    entidade.setAttribute(
        "position",
        "0 0 0"
    );


    entidade.setAttribute(
        "rotation",
        "0 0 0"
    );


    entidade.setAttribute(
        "width",
        "1"
    );


    entidade.setAttribute(
        "height",
        "1"
    );


    objeto.appendChild(entidade);

}


// ============================================================
// CARREGAR RECURSOS
// ============================================================

function carregarRecursos() {

    objeto.innerHTML = "";


    if (config.modelo) {

        criarModeloGLB(
            config.modelo
        );

    }


    if (config.imagem) {

        criarImagem(
            config.imagem
        );

    }


    if (config.video) {

        criarVideo(
            config.video
        );

    }


    if (
        !config.modelo &&
        !config.imagem &&
        !config.video
    ) {

        status.textContent =
            "Nenhum recurso visual configurado.";

    }

}


// ============================================================
// CARREGAR CONFIG
// ============================================================

async function carregarConfig() {

    try {

        const resposta =
            await fetch(
                `../marcadores/${pasta}/config.json?${Date.now()}`
            );


        if (!resposta.ok) {

            throw new Error(
                "config.json não encontrado"
            );

        }


        config =
            await resposta.json();


        garantirConfiguracao();


        carregarRecursos();


        aplicarConfiguracao();


        status.textContent =
            `Configuração carregada: ${pasta}`;

    }

    catch (erro) {

        console.error(erro);


        config =
            copiar(configPadrao);


        carregarRecursos();


        aplicarConfiguracao();


        status.textContent =
            "Usando configuração padrão";

    }

}


// ============================================================
// APLICAR CONFIGURAÇÃO
// ============================================================

function aplicarConfiguracao() {


    // ========================================================
    // PIVOT
    //
    // REFERÊNCIA:
    // MARCADOR
    // ========================================================

    pivot.object3D.position.set(

        Number(config.pivot.x),

        Number(config.pivot.y),

        Number(config.pivot.z)

    );


    pivot.object3D.rotation.set(

        THREE.MathUtils.degToRad(
            Number(config.pivotRotation.x)
        ),

        THREE.MathUtils.degToRad(
            Number(config.pivotRotation.y)
        ),

        THREE.MathUtils.degToRad(
            Number(config.pivotRotation.z)
        )

    );


    // ========================================================
    // OBJETO
    //
    // REFERÊNCIA:
    // PIVOT
    //
    // Estes valores agora são LOCAIS ao pivot.
    // ========================================================

    objeto.object3D.position.set(

        Number(config.position.x),

        Number(config.position.y),

        Number(config.position.z)

    );


    objeto.object3D.rotation.set(

        THREE.MathUtils.degToRad(
            Number(config.rotation.x)
        ),

        THREE.MathUtils.degToRad(
            Number(config.rotation.y)
        ),

        THREE.MathUtils.degToRad(
            Number(config.rotation.z)
        )

    );


    objeto.object3D.scale.set(

        Number(config.scale),

        Number(config.scale),

        Number(config.scale)

    );


    atualizarInterface();

    atualizarJSON();

}


// ============================================================
// ATUALIZAR INTERFACE
// ============================================================

function atualizarInterface() {

    let dados;


    if (
        elementoSelecionado ===
        "pivot"
    ) {

        if (
            controleSelecionado ===
            "rotacao"
        ) {

            dados =
                config.pivotRotation;

        }

        else {

            dados =
                config.pivot;

        }

    }

    else {

        if (
            controleSelecionado ===
            "rotacao"
        ) {

            dados =
                config.rotation;

        }

        else {

            dados =
                config.position;

        }

    }


    sliderX.value =
        dados.x;

    sliderY.value =
        dados.y;

    sliderZ.value =
        dados.z;


    valorX.textContent =
        Number(
            dados.x
        ).toFixed(2);


    valorY.textContent =
        Number(
            dados.y
        ).toFixed(2);


    valorZ.textContent =
        Number(
            dados.z
        ).toFixed(2);


    valorEscala.textContent =
        Number(
            config.scale
        ).toFixed(2);


    atualizarLabels();

}


// ============================================================
// LABELS
// ============================================================

function atualizarLabels() {

    const nome =
        elementoSelecionado ===
        "pivot"
            ? "Pivot"
            : "Objeto";


    if (
        controleSelecionado ===
        "rotacao"
    ) {

        labelX.textContent =
            `${nome} Rotação X`;

        labelY.textContent =
            `${nome} Rotação Y`;

        labelZ.textContent =
            `${nome} Rotação Z`;


        sliderX.min = -360;
        sliderX.max = 360;

        sliderY.min = -360;
        sliderY.max = 360;

        sliderZ.min = -360;
        sliderZ.max = 360;

    }

    else {

        labelX.textContent =
            `${nome} Movimento X`;

        labelY.textContent =
            `${nome} Movimento Y`;

        labelZ.textContent =
            `${nome} Movimento Z`;


        sliderX.min = -5;
        sliderX.max = 5;

        sliderY.min = -5;
        sliderY.max = 5;

        sliderZ.min = -5;
        sliderZ.max = 5;

    }

}


// ============================================================
// SELECIONAR ELEMENTO
// ============================================================

function selecionarElemento(
    elemento
) {

    elementoSelecionado =
        elemento;


    botaoPivot.classList.toggle(
        "ativo",
        elemento === "pivot"
    );


    botaoObjeto.classList.toggle(
        "ativo",
        elemento === "objeto"
    );


    atualizarInterface();

}


// ============================================================
// SELECIONAR CONTROLE
// ============================================================

function selecionarControle(
    controle
) {

    controleSelecionado =
        controle;


    botaoRotacao.classList.toggle(
        "ativo",
        controle === "rotacao"
    );


    botaoMovimento.classList.toggle(
        "ativo",
        controle === "movimento"
    );


    atualizarInterface();

}


// ============================================================
// BOTÕES
// ============================================================

botaoPivot.addEventListener(
    "click",
    () => {

        selecionarElemento(
            "pivot"
        );

    }
);


botaoObjeto.addEventListener(
    "click",
    () => {

        selecionarElemento(
            "objeto"
        );

    }
);


botaoRotacao.addEventListener(
    "click",
    () => {

        selecionarControle(
            "rotacao"
        );

    }
);


botaoMovimento.addEventListener(
    "click",
    () => {

        selecionarControle(
            "movimento"
        );

    }
);


// ============================================================
// SLIDERS
// ============================================================

sliderX.addEventListener(
    "input",
    () => {

        alterarValor(
            "x",
            Number(sliderX.value)
        );

    }
);


sliderY.addEventListener(
    "input",
    () => {

        alterarValor(
            "y",
            Number(sliderY.value)
        );

    }
);


sliderZ.addEventListener(
    "input",
    () => {

        alterarValor(
            "z",
            Number(sliderZ.value)
        );

    }
);


// ============================================================
// ALTERAR VALOR
// ============================================================

function alterarValor(
    eixo,
    valor
) {


    if (
        elementoSelecionado ===
        "pivot"
    ) {

        if (
            controleSelecionado ===
            "rotacao"
        ) {

            config.pivotRotation[eixo] =
                valor;


            pivot.object3D.rotation[eixo] =
                THREE.MathUtils.degToRad(
                    valor
                );

        }

        else {

            config.pivot[eixo] =
                valor;


            pivot.object3D.position[eixo] =
                valor;

        }

    }

    else {

        if (
            controleSelecionado ===
            "rotacao"
        ) {

            config.rotation[eixo] =
                valor;


            objeto.object3D.rotation[eixo] =
                THREE.MathUtils.degToRad(
                    valor
                );

        }

        else {

            config.position[eixo] =
                valor;


            objeto.object3D.position[eixo] =
                valor;

        }

    }


    atualizarInterface();

    atualizarJSON();

}


// ============================================================
// ESCALA
// ============================================================

sliderEscala.addEventListener(
    "input",
    () => {

        config.scale =
            Number(
                sliderEscala.value
            );


        objeto.object3D.scale.set(

            config.scale,

            config.scale,

            config.scale

        );


        valorEscala.textContent =
            config.scale.toFixed(2);


        atualizarJSON();

    }
);


// ============================================================
// RESET
// ============================================================
//
// IMPORTANTE:
//
// NÃO volta ao config.json.
//
// Coloca tudo em ZERO:
//
// Pivot:
// posição = 0,0,0
// rotação = 0,0,0
//
// Objeto:
// posição = 0,0,0
// rotação = 0,0,0
//
// Escala = 1
// ============================================================

botaoResetar.addEventListener(
    "click",
    () => {


        config.pivot = {

            x: 0,
            y: 0,
            z: 0

        };


        config.pivotRotation = {

            x: 0,
            y: 0,
            z: 0

        };


        config.position = {

            x: 0,
            y: 0,
            z: 0

        };


        config.rotation = {

            x: 0,
            y: 0,
            z: 0

        };


        config.scale = 1;


        aplicarConfiguracao();


        status.textContent =
            "Tudo foi zerado.";

    }
);


// ============================================================
// MOSTRAR JSON
// ============================================================

function atualizarJSON() {

    configuracao.textContent =
        JSON.stringify(
            config,
            null,
            2
        );

}


// ============================================================
// COPIAR JSON
// ============================================================

botaoCopiar.addEventListener(
    "click",
    async () => {

        try {

            await navigator.clipboard.writeText(
                configuracao.textContent
            );


            status.textContent =
                "JSON copiado para a área de transferência.";

        }

        catch (erro) {

            console.error(
                erro
            );


            status.textContent =
                "Não foi possível copiar o JSON.";

        }

    }
);


// ============================================================
// MARCADOR
// ============================================================

target.addEventListener(
    "targetFound",
    () => {

        status.textContent =
            `Marcador encontrado — ${pasta}`;

    }
);


target.addEventListener(
    "targetLost",
    () => {

        status.textContent =
            "Marcador perdido";

    }
);


// ============================================================
// INICIAR
// ============================================================

carregarConfig();