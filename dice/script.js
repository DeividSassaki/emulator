import * as THREE from "https://esm.sh/three@0.186.0";
import { ColladaLoader } from "https://esm.sh/three@0.186.0/examples/jsm/loaders/ColladaLoader.js?deps=three@0.186.0";


// ============================================================
// CONFIGURAÇÕES
// ============================================================

const DURACAO_ROLAGEM = 2200;
const TEMPO_ASSENTAR = 450;


// ============================================================
// ELEMENTOS DA PÁGINA
// ============================================================

const container = document.getElementById("dado3d");
const dadoAtual = document.getElementById("dadoAtual");
const resultado = document.getElementById("resultado");
const total = document.getElementById("total");
const resetar = document.getElementById("resetar");
const telaCheia = document.getElementById("telaCheia");

const botoesDados = document.querySelectorAll("[data-dado]");


// ============================================================
// THREE.JS
// ============================================================

const cena = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    35,
    container.clientWidth / container.clientHeight,
    0.1,
    100
);

camera.position.set(0, 0.8, 5.5);
camera.lookAt(0, 0, 0);


const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

renderer.setSize(
    container.clientWidth,
    container.clientHeight
);

renderer.shadowMap.enabled = true;

container.appendChild(renderer.domElement);


// ============================================================
// ILUMINAÇÃO
// ============================================================

const luzAmbiente = new THREE.AmbientLight(
    0xffffff,
    2.2
);

cena.add(luzAmbiente);


const luzPrincipal = new THREE.DirectionalLight(
    0xffffff,
    3
);

luzPrincipal.position.set(3, 5, 4);
luzPrincipal.castShadow = true;

cena.add(luzPrincipal);


const luzFrontal = new THREE.DirectionalLight(
    0xffffff,
    1.5
);

luzFrontal.position.set(-3, 2, 5);

cena.add(luzFrontal);


// ============================================================
// CHÃO
// ============================================================

const geometriaChao = new THREE.CircleGeometry(
    2.2,
    64
);

const materialChao = new THREE.MeshStandardMaterial({
    color: 0x111111,
    roughness: 0.8,
    metalness: 0
});

const chao = new THREE.Mesh(
    geometriaChao,
    materialChao
);

chao.rotation.x = -Math.PI / 2;
chao.position.y = -1.15;

chao.receiveShadow = true;

cena.add(chao);


// ============================================================
// VARIÁVEIS
// ============================================================

let dado3D = null;

let ladosAtuais = 6;

let rolando = false;

// D6 começa selecionado
let dadoSelecionado = true;

let totalAtual = 0;

let modeloOriginal = null;


// ============================================================
// CAMINHOS
// ============================================================

function caminhoModelo(lados) {
    return `Dice_models/d${lados}.dae`;
}


function caminhoTextura(lados) {
    return `Maps_numbered/d${lados}_Numbers.png`;
}


// ============================================================
// ORIENTAÇÃO BASE
// ============================================================

function orientacaoBase(lados) {

    const rotacoes = {

        4: {
            x: 0,
            y: 0,
            z: 0
        },

        6: {
            x: 0,
            y: 0,
            z: 0
        },

        8: {
            x: 0,
            y: 0,
            z: 0
        },

        10: {
            x: 0,
            y: 0,
            z: 0
        },

        12: {
            x: 0,
            y: 0,
            z: 0
        },

        20: {
            x: 0,
            y: 0,
            z: 0
        }

    };

    return rotacoes[lados] || rotacoes[6];
}


// ============================================================
// APLICAR ORIENTAÇÃO BASE
// ============================================================

function aplicarOrientacaoBase() {

    if (!dado3D) return;

    const rotacao = orientacaoBase(ladosAtuais);

    dado3D.rotation.set(
        rotacao.x,
        rotacao.y,
        rotacao.z
    );
}


// ============================================================
// ATUALIZAR BOTÃO SELECIONADO
// ============================================================

function atualizarBotaoSelecionado(lados) {

    botoesDados.forEach((botao) => {

        const valor =
            Number(botao.dataset.dado);

        if (valor === lados) {

            botao.classList.add("selecionado");

        } else {

            botao.classList.remove("selecionado");

        }

    });
}


// ============================================================
// LIMPAR MODELO
// ============================================================

function limparModelo(objeto) {

    if (!objeto) return;

    objeto.traverse((parte) => {

        if (!parte.isMesh) return;

        if (parte.geometry) {
            parte.geometry.dispose();
        }

        if (parte.material) {

            if (Array.isArray(parte.material)) {

                parte.material.forEach((material) => {

                    if (material.map) {
                        material.map.dispose();
                    }

                    material.dispose();

                });

            } else {

                if (parte.material.map) {
                    parte.material.map.dispose();
                }

                parte.material.dispose();

            }

        }

    });
}


// ============================================================
// AJUSTAR TAMANHO
// ============================================================

function ajustarModelo(objeto) {

    const caixa =
        new THREE.Box3().setFromObject(objeto);

    const tamanho =
        new THREE.Vector3();

    caixa.getSize(tamanho);

    const maior =
        Math.max(
            tamanho.x,
            tamanho.y,
            tamanho.z
        );

    if (maior > 0) {

        const escala =
            2.0 / maior;

        objeto.scale.setScalar(escala);

    }


    const novaCaixa =
        new THREE.Box3().setFromObject(objeto);

    const centro =
        new THREE.Vector3();

    novaCaixa.getCenter(centro);

    objeto.position.sub(centro);

    objeto.position.y += 0.05;
}


// ============================================================
// APLICAR TEXTURA
// ============================================================

function aplicarTextura(objeto, lados) {

    const loader =
        new THREE.TextureLoader();

    const caminho =
        caminhoTextura(lados);


    loader.load(

        caminho,

        (textura) => {

            textura.colorSpace =
                THREE.SRGBColorSpace;

            textura.anisotropy =
                renderer.capabilities.getMaxAnisotropy();


            objeto.traverse((parte) => {

                if (!parte.isMesh) return;

                const materiais =
                    Array.isArray(parte.material)
                        ? parte.material
                        : [parte.material];


                materiais.forEach((material) => {

                    material.map =
                        textura;

                    material.needsUpdate =
                        true;

                });

            });

        },

        undefined,

        () => {

            console.warn(
                "Não foi possível carregar:",
                caminho
            );

        }

    );
}


// ============================================================
// CARREGAR DADO
// ============================================================

function carregarDado(lados) {

    ladosAtuais = lados;

    dadoSelecionado = true;

    atualizarBotaoSelecionado(lados);


    if (dado3D) {

        cena.remove(dado3D);

        limparModelo(dado3D);

        dado3D = null;

    }


    const loader =
        new ColladaLoader();


    loader.load(

        caminhoModelo(lados),

        (collada) => {

            dado3D =
                collada.scene;

            modeloOriginal =
                dado3D;


            dado3D.traverse((parte) => {

                if (parte.isMesh) {

                    parte.castShadow =
                        true;

                    parte.receiveShadow =
                        true;

                }

            });


            ajustarModelo(
                dado3D
            );


            aplicarOrientacaoBase();


            aplicarTextura(
                dado3D,
                lados
            );


            cena.add(
                dado3D
            );

        },

        undefined,

        (erro) => {

            console.error(
                "Erro ao carregar o dado:",
                erro
            );

        }

    );


    dadoAtual.textContent =
        `D${lados}`;

}


// ============================================================
// BOTÕES DOS DADOS
// ============================================================

botoesDados.forEach((botao) => {

    botao.addEventListener(
        "click",
        () => {

            if (rolando) return;


            const lados =
                Number(
                    botao.dataset.dado
                );


            // Seleciona imediatamente
            // o botão clicado.

            atualizarBotaoSelecionado(
                lados
            );


            dadoSelecionado =
                true;


            carregarDado(
                lados
            );

        }
    );

});


// ============================================================
// EASING
// ============================================================

function easeOutCubic(t) {

    return 1 -
        Math.pow(
            1 - t,
            3
        );

}


// ============================================================
// ROLAR DADO
// ============================================================

function rolarDado() {

    if (!dado3D) return;

    if (rolando) return;


    rolando = true;


    // --------------------------------------------------------
    // RESULTADO
    // --------------------------------------------------------

    const valor =
        Math.floor(
            Math.random() *
            ladosAtuais
        ) + 1;


    resultado.textContent =
        valor;


    totalAtual += valor;

    total.textContent =
        totalAtual;


    // --------------------------------------------------------
    // ROTAÇÃO INICIAL
    // --------------------------------------------------------

    const inicioRotX =
        dado3D.rotation.x;

    const inicioRotY =
        dado3D.rotation.y;

    const inicioRotZ =
        dado3D.rotation.z;


    // --------------------------------------------------------
    // VOLTAS
    // --------------------------------------------------------

    const voltasX =
        THREE.MathUtils.randFloat(
            3.5,
            5.5
        );

    const voltasY =
        THREE.MathUtils.randFloat(
            3.5,
            5.5
        );

    const voltasZ =
        THREE.MathUtils.randFloat(
            3.5,
            5.5
        );


    const sinalX =
        Math.random() < 0.5
            ? -1
            : 1;

    const sinalY =
        Math.random() < 0.5
            ? -1
            : 1;

    const sinalZ =
        Math.random() < 0.5
            ? -1
            : 1;


    const finalRotX =
        inicioRotX +
        voltasX *
        Math.PI *
        2 *
        sinalX;


    const finalRotY =
        inicioRotY +
        voltasY *
        Math.PI *
        2 *
        sinalY;


    const finalRotZ =
        inicioRotZ +
        voltasZ *
        Math.PI *
        2 *
        sinalZ;


    // --------------------------------------------------------
    // ALTURA INICIAL
    // --------------------------------------------------------

    const inicioY =
        dado3D.position.y;


    // --------------------------------------------------------
    // ANIMAÇÃO PRINCIPAL
    // --------------------------------------------------------

    const inicio =
        performance.now();


    function animar(agora) {

        const tempo =
            agora - inicio;


        const progresso =
            Math.min(
                tempo /
                DURACAO_ROLAGEM,
                1
            );


        const suavizado =
            easeOutCubic(
                progresso
            );


        // Rotação X

        dado3D.rotation.x =
            THREE.MathUtils.lerp(
                inicioRotX,
                finalRotX,
                suavizado
            );


        // Rotação Y

        dado3D.rotation.y =
            THREE.MathUtils.lerp(
                inicioRotY,
                finalRotY,
                suavizado
            );


        // Rotação Z

        dado3D.rotation.z =
            THREE.MathUtils.lerp(
                inicioRotZ,
                finalRotZ,
                suavizado
            );


        // Pequeno pulo

        const pulo =
            Math.sin(
                progresso *
                Math.PI
            ) * 0.65;


        dado3D.position.y =
            inicioY + pulo;


        if (progresso < 1) {

            requestAnimationFrame(
                animar
            );

            return;

        }


        // ----------------------------------------------------
        // ASSENTAMENTO
        // ----------------------------------------------------

        const inicioAssentamento =
            performance.now();

        const posicaoY =
            dado3D.position.y;


        function assentar(agora2) {

            const tempo2 =
                agora2 -
                inicioAssentamento;


            const progresso2 =
                Math.min(
                    tempo2 /
                    TEMPO_ASSENTAR,
                    1
                );


            const suavizado2 =
                easeOutCubic(
                    progresso2
                );


            dado3D.position.y =
                THREE.MathUtils.lerp(
                    posicaoY,
                    0,
                    suavizado2
                );


            if (progresso2 < 1) {

                requestAnimationFrame(
                    assentar
                );

                return;

            }


            dado3D.position.y = 0;


            // Mantém exatamente a rotação
            // onde terminou.

            rolando = false;

        }


        requestAnimationFrame(
            assentar
        );

    }


    requestAnimationFrame(
        animar
    );

}


// ============================================================
// TOQUE / CLIQUE NO DADO 3D
// ============================================================
//
// Se o dado já estiver selecionado:
//     toca = rola.
//
// Se nenhum dado estiver selecionado:
//     toca = seleciona.
//

container.addEventListener(
    "pointerdown",
    (evento) => {

        evento.preventDefault();


        if (rolando) return;


        // Nenhum dado selecionado:
        // primeiro toque apenas seleciona.

        if (!dadoSelecionado) {

            dadoSelecionado =
                true;


            atualizarBotaoSelecionado(
                ladosAtuais
            );


            dadoAtual.textContent =
                `D${ladosAtuais}`;


            return;

        }


        // Dado já selecionado:
        // toca e rola.

        rolarDado();

    }
);


// ============================================================
// RESETAR
// ============================================================

resetar.addEventListener(
    "click",
    () => {

        if (rolando) return;


        totalAtual = 0;


        total.textContent =
            "0";


        resultado.textContent =
            "-";


        if (dado3D) {

            dado3D.position.set(
                0,
                0,
                0
            );


            aplicarOrientacaoBase();

        }


        // Mantém o tipo de dado atual
        // selecionado após reset.

        dadoSelecionado =
            true;


        atualizarBotaoSelecionado(
            ladosAtuais
        );


        dadoAtual.textContent =
            `D${ladosAtuais}`;

    }
);


// ============================================================
// TELA CHEIA
// ============================================================

telaCheia.addEventListener(
    "click",
    async () => {

        try {

            if (!document.fullscreenElement) {

                await document.documentElement
                    .requestFullscreen();

            } else {

                await document.exitFullscreen();

            }

        } catch (erro) {

            console.error(
                "Erro no modo tela cheia:",
                erro
            );

        }

    }
);


// ============================================================
// REDIMENSIONAR
// ============================================================

function redimensionar() {

    const largura =
        container.clientWidth;

    const altura =
        container.clientHeight;


    if (
        largura === 0 ||
        altura === 0
    ) {

        return;

    }


    camera.aspect =
        largura /
        altura;


    camera.updateProjectionMatrix();


    renderer.setSize(
        largura,
        altura
    );

}


window.addEventListener(
    "resize",
    redimensionar
);


// ============================================================
// LOOP
// ============================================================

function renderizar() {

    requestAnimationFrame(
        renderizar
    );


    renderer.render(
        cena,
        camera
    );

}


// ============================================================
// INICIALIZAÇÃO
// ============================================================

redimensionar();


// D6 começa selecionado visualmente.

atualizarBotaoSelecionado(6);

carregarDado(6);

renderizar();
