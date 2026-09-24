import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.186.0/build/three.module.js";


// =====================================================
// ELEMENTOS
// =====================================================

const container = document.getElementById("dado3d");

const resultadoElemento = document.getElementById("resultado");
const totalElemento = document.getElementById("total");
const dadoAtualElemento = document.getElementById("dadoAtual");

const botoesDados = document.querySelectorAll(".dado-btn");
const botaoResetar = document.getElementById("resetar");
const botaoTelaCheia = document.getElementById("telaCheia");


// =====================================================
// VARIÁVEIS
// =====================================================

let dadoSelecionado = 6;

let resultado = null;

let total = 0;

let dado3D = null;

let rolando = false;

let animationFrame = null;

let movimento = {
    inicio: 0,
    duracao: 1300,

    xInicial: 0,
    yInicial: 0,

    xFinal: 0,
    yFinal: 0,

    rotX: 0,
    rotY: 0,
    rotZ: 0
};


// =====================================================
// THREE.JS
// =====================================================

const cena = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    38,
    container.clientWidth / container.clientHeight,
    0.1,
    100
);

camera.position.set(0, 0.3, 6.5);


const renderizador = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});

renderizador.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

renderizador.setSize(
    container.clientWidth,
    container.clientHeight
);

renderizador.shadowMap.enabled = true;

container.appendChild(renderizador.domElement);


// =====================================================
// ILUMINAÇÃO
// =====================================================

const luzAmbiente = new THREE.AmbientLight(
    0xffffff,
    2.2
);

cena.add(luzAmbiente);


const luzPrincipal = new THREE.DirectionalLight(
    0xffffff,
    4
);

luzPrincipal.position.set(
    3,
    5,
    6
);

luzPrincipal.castShadow = true;

cena.add(luzPrincipal);


const luzFrontal = new THREE.DirectionalLight(
    0xffffff,
    2
);

luzFrontal.position.set(
    -4,
    2,
    4
);

cena.add(luzFrontal);


// =====================================================
// CHÃO
// =====================================================

const chao = new THREE.Mesh(

    new THREE.CircleGeometry(2.2, 64),

    new THREE.MeshStandardMaterial({
        color: 0x111111,
        roughness: 0.8,
        metalness: 0
    })

);

chao.rotation.x = -Math.PI / 2;

chao.position.y = -1.35;

chao.receiveShadow = true;

cena.add(chao);


// =====================================================
// MATERIAL DO DADO
// =====================================================

function criarMaterial() {

    return new THREE.MeshStandardMaterial({

        color: 0xffffff,

        roughness: 0.35,

        metalness: 0.05,

        flatShading: true

    });

}


// =====================================================
// D10 PERSONALIZADO
// =====================================================

function criarD10() {

    const vertices = [];

    const faces = [];

    const raio = 1.15;

    const raioAnel = 0.82;

    const alturaAnel = 0.42;

    const alturaTopo = 1.25;

    const alturaBase = -1.25;


    // topo
    vertices.push(
        0,
        alturaTopo,
        0
    );


    // anel superior
    for (let i = 0; i < 5; i++) {

        const angulo =
            (i * Math.PI * 2 / 5) +
            Math.PI / 10;

        vertices.push(
            Math.cos(angulo) * raioAnel,
            alturaAnel,
            Math.sin(angulo) * raioAnel
        );

    }


    // anel inferior
    for (let i = 0; i < 5; i++) {

        const angulo =
            (i * Math.PI * 2 / 5);

        vertices.push(
            Math.cos(angulo) * raioAnel,
            -alturaAnel,
            Math.sin(angulo) * raioAnel
        );

    }


    // base
    vertices.push(
        0,
        alturaBase,
        0
    );


    // 5 faces superiores
    for (let i = 0; i < 5; i++) {

        const a = 0;

        const b = 1 + i;

        const c = 1 + ((i + 1) % 5);

        faces.push(
            a, b, c
        );

    }


    // 5 faces inferiores
    for (let i = 0; i < 5; i++) {

        const a = 11;

        const b = 6 + ((i + 1) % 5);

        const c = 6 + i;

        faces.push(
            a, b, c
        );

    }


    const geometria =
        new THREE.BufferGeometry();

    geometria.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(
            vertices,
            3
        )
    );

    geometria.setIndex(faces);

    geometria.computeVertexNormals();


    return geometria;
}


// =====================================================
// CRIAR GEOMETRIA
// =====================================================

function criarGeometria(lados) {

    switch (lados) {

        case 4:
            return new THREE.TetrahedronGeometry(
                1.35,
                0
            );

        case 6:
            return new THREE.BoxGeometry(
                1.9,
                1.9,
                1.9
            );

        case 8:
            return new THREE.OctahedronGeometry(
                1.45,
                0
            );

        case 10:
            return criarD10();

        case 12:
            return new THREE.DodecahedronGeometry(
                1.35,
                0
            );

        case 20:
            return new THREE.IcosahedronGeometry(
                1.45,
                0
            );

        default:
            return new THREE.BoxGeometry(
                1.9,
                1.9,
                1.9
            );
    }
}


// =====================================================
// CRIAR DADO
// =====================================================

function criarDado(lados) {

    const geometria =
        criarGeometria(lados);

    const material =
        criarMaterial();

    const novoDado =
        new THREE.Mesh(
            geometria,
            material
        );

    novoDado.castShadow = true;

    novoDado.receiveShadow = true;

    return novoDado;
}


// =====================================================
// MOSTRAR DADO
// =====================================================

function mostrarDado(lados) {

    if (dado3D) {

        cena.remove(dado3D);

        dado3D.geometry.dispose();

        dado3D.material.dispose();

    }


    dado3D = criarDado(lados);

    cena.add(dado3D);


    dado3D.rotation.x = 0.35;

    dado3D.rotation.y = 0.45;

    dado3D.rotation.z = 0;


    dado3D.position.set(
        0,
        0,
        0
    );


    dadoAtualElemento.textContent =
        `D${lados}`;
}


// =====================================================
// SELECIONAR DADO
// =====================================================

function selecionarDado(lados) {

    dadoSelecionado = lados;

    botoesDados.forEach(botao => {

        const valor =
            Number(botao.dataset.dado);

        botao.classList.toggle(
            "selecionado",
            valor === lados
        );

    });


    mostrarDado(lados);
}


// =====================================================
// ROLAR
// =====================================================

function rolarDado() {

    if (rolando) {
        return;
    }


    rolando = true;


    resultado =
        Math.floor(
            Math.random() * dadoSelecionado
        ) + 1;


    resultadoElemento.textContent =
        resultado;


    total += resultado;

    totalElemento.textContent =
        total;


    movimento.inicio =
        performance.now();


    movimento.xInicial =
        dado3D.position.x;

    movimento.yInicial =
        dado3D.position.y;


    movimento.xFinal =
        (Math.random() * 3.2) - 1.6;

    movimento.yFinal =
        0.3 +
        Math.random() * 0.8;


    movimento.rotX =
        (Math.random() * 8 + 8) *
        (Math.random() < 0.5 ? -1 : 1);

    movimento.rotY =
        (Math.random() * 10 + 10) *
        (Math.random() < 0.5 ? -1 : 1);

    movimento.rotZ =
        (Math.random() * 8 + 8) *
        (Math.random() < 0.5 ? -1 : 1);


    animarRolagem();
}


// =====================================================
// ANIMAÇÃO DA ROLAGEM
// =====================================================

function animarRolagem(agora) {

    if (!agora) {

        animationFrame =
            requestAnimationFrame(
                animarRolagem
            );

        return;
    }


    const tempo =
        agora - movimento.inicio;


    let progresso =
        Math.min(
            tempo / movimento.duracao,
            1
        );


    // desaceleração suave
    const suavizado =
        1 -
        Math.pow(
            1 - progresso,
            3
        );


    // movimento horizontal
    dado3D.position.x =
        THREE.MathUtils.lerp(
            movimento.xInicial,
            movimento.xFinal,
            suavizado
        );


    // pequeno salto
    const salto =
        Math.sin(
            progresso * Math.PI
        );


    dado3D.position.y =
        THREE.MathUtils.lerp(
            movimento.yInicial,
            movimento.yFinal,
            suavizado
        ) +
        salto * 1.1;


    // rotação
    dado3D.rotation.x =
        0.35 +
        movimento.rotX *
        suavizado;

    dado3D.rotation.y =
        0.45 +
        movimento.rotY *
        suavizado;

    dado3D.rotation.z =
        movimento.rotZ *
        suavizado;


    if (progresso < 1) {

        animationFrame =
            requestAnimationFrame(
                animarRolagem
            );

    } else {

        rolando = false;


        // retorna o dado para o centro
        dado3D.position.x = 0;

        dado3D.position.y = 0;


        // mantém uma posição diferente
        // para não parecer sempre igual
        dado3D.rotation.x =
            Math.random() * Math.PI * 2;

        dado3D.rotation.y =
            Math.random() * Math.PI * 2;

        dado3D.rotation.z =
            Math.random() * Math.PI * 2;

    }
}


// =====================================================
// CLIQUE NOS DADOS
// =====================================================

botoesDados.forEach(botao => {

    botao.addEventListener(
        "click",
        () => {

            const lados =
                Number(botao.dataset.dado);


            // Se for outro dado:
            // apenas seleciona
            if (lados !== dadoSelecionado) {

                selecionarDado(lados);

                return;
            }


            // Se já estiver selecionado:
            // rola
            rolarDado();

        }
    );

});


// =====================================================
// RESETAR
// =====================================================

botaoResetar.addEventListener(
    "click",
    () => {

        total = 0;

        resultado = null;

        totalElemento.textContent = "0";

        resultadoElemento.textContent = "—";


        if (dado3D && !rolando) {

            dado3D.position.set(
                0,
                0,
                0
            );

            dado3D.rotation.set(
                0.35,
                0.45,
                0
            );

        }

    }
);


// =====================================================
// TELA CHEIA
// =====================================================

botaoTelaCheia.addEventListener(
    "click",
    async () => {

        try {

            if (!document.fullscreenElement) {

                await document.documentElement.requestFullscreen();

                botaoTelaCheia.textContent =
                    "⛶ SAIR DA TELA CHEIA";

            } else {

                await document.exitFullscreen();

                botaoTelaCheia.textContent =
                    "⛶ TELA CHEIA";

            }

        } catch (erro) {

            console.log(
                "Tela cheia não disponível:",
                erro
            );

        }

    }
);


// =====================================================
// ATUALIZAR BOTÃO DE TELA CHEIA
// =====================================================

document.addEventListener(
    "fullscreenchange",
    () => {

        if (document.fullscreenElement) {

            botaoTelaCheia.textContent =
                "⛶ SAIR DA TELA CHEIA";

        } else {

            botaoTelaCheia.textContent =
                "⛶ TELA CHEIA";

        }

    }
);


// =====================================================
// REDIMENSIONAMENTO
// =====================================================

window.addEventListener(
    "resize",
    () => {

        const largura =
            container.clientWidth;

        const altura =
            container.clientHeight;


        camera.aspect =
            largura / altura;

        camera.updateProjectionMatrix();


        renderizador.setSize(
            largura,
            altura
        );

    }
);


// =====================================================
// LOOP 3D
// =====================================================

function animar() {

    requestAnimationFrame(animar);

    renderizador.render(
        cena,
        camera
    );

}


// =====================================================
// INICIAR
// =====================================================

selecionarDado(6);

animar();
