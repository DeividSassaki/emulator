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

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

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

let totalAtual = 0;

let modeloOriginal = null;


// ============================================================
// CAMINHOS DOS ARQUIVOS
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
//
// Esta orientação é usada somente quando o modelo é carregado.
// NÃO será aplicada novamente depois da rolagem.
//

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
// LIMPAR MODELO ANTERIOR
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
// AJUSTAR TAMANHO DO MODELO
// ============================================================

function ajustarModelo(objeto) {

    const caixa = new THREE.Box3().setFromObject(objeto);

    const tamanho = new THREE.Vector3();

    caixa.getSize(tamanho);

    const maior = Math.max(
        tamanho.x,
        tamanho.y,
        tamanho.z
    );

    if (maior > 0) {

        const escala = 2.0 / maior;

        objeto.scale.setScalar(escala);

    }

    const novaCaixa = new THREE.Box3().setFromObject(objeto);

    const centro = new THREE.Vector3();

    novaCaixa.getCenter(centro);

    objeto.position.sub(centro);

    objeto.position.y += 0.05;

}


// ============================================================
// APLICAR TEXTURA
// ============================================================

function aplicarTextura(objeto, lados) {

    const loader = new THREE.TextureLoader();

    const caminho = caminhoTextura(lados);

    loader.load(

        caminho,

        (textura) => {

            textura.colorSpace = THREE.SRGBColorSpace;

            textura.anisotropy =
                renderer.capabilities.getMaxAnisotropy();

            objeto.traverse((parte) => {

                if (!parte.isMesh) return;

                const materiais =
                    Array.isArray(parte.material)
                        ? parte.material
                        : [parte.material];

                materiais.forEach((material) => {

                    material.map = textura;

                    material.needsUpdate = true;

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

    if (dado3D) {

        cena.remove(dado3D);

        limparModelo(dado3D);

        dado3D = null;

    }

    const loader = new ColladaLoader();

    loader.load(

        caminhoModelo(lados),

        (collada) => {

            dado3D = collada.scene;

            modeloOriginal = dado3D;

            dado3D.traverse((parte) => {

                if (parte.isMesh) {

                    parte.castShadow = true;

                    parte.receiveShadow = true;

                }

            });

            ajustarModelo(dado3D);

            aplicarOrientacaoBase();

            aplicarTextura(
                dado3D,
                lados
            );

            cena.add(dado3D);

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

            carregarDado(lados