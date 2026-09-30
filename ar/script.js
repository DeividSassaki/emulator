const scene =
    document.getElementById("scene");

const target =
    document.getElementById("targetZelda");

const pivotAvo =
    document.getElementById("pivotAvo");

const pivotPai =
    document.getElementById("pivotPai");

const objeto =
    document.getElementById("objectEntity");

const modelo =
    document.getElementById("heroModelObject");

const audio =
    document.getElementById("arAudio");

const fullscreenButton =
    document.getElementById("fullscreenButton");

const freezeButton =
    document.getElementById("freezeButton");


const parametros =
    new URLSearchParams(window.location.search);

const pasta =
    parametros.get("pasta") || "zelda";


const CONFIG_URL =
    `./marcadores/${pasta}/config.json`;


/* ============================================================
   CONTROLES
   ============================================================ */

const VELOCIDADE_ROTACAO =
    0.01;

const VELOCIDADE_ESCALA =
    0.005;

const ESCALA_MINIMA =
    0.2;

const ESCALA_MAXIMA =
    3.5;


/* ============================================================
   ESTADO
   ============================================================ */

let config = null;

let marcadorVisivel =
    false;

let congelado =
    false;


/* ============================================================
   CONTROLE DE TOQUE
   ============================================================ */

let arrastando =
    false;

let ultimoX =
    0;

let ultimoY =
    0;


/* ============================================================
   CONTROLE DE PINÇA
   ============================================================ */

let usandoPinch =
    false;

let distanciaInicialPinch =
    0;

let escalaInicialPinch =
    1;


/* ============================================================
   OBJETO CONGELADO
   ============================================================ */

let frozenPivot =
    null;

let frozenObject =
    null;

let frozenModel =
    null;

let frozenAmbientLight =
    null;

let frozenDirectionalLight =
    null;


/* ============================================================
   FUNÇÕES AUXILIARES
   ============================================================ */

function numero(valor) {

    const n =
        Number(valor);

    return Number.isFinite(n)
        ? n
        : 0;
}


function vetorZero() {

    return {
        x: 0,
        y: 0,
        z: 0
    };
}


/* ============================================================
   PIVOT ATIVO
   ============================================================ */

function obterPivotAtivo() {

    if (
        congelado &&
        frozenPivot
    ) {

        return frozenPivot.object3D;
    }


    return pivotPai.object3D;
}


/* ============================================================
   OBJETO ATIVO
   ============================================================ */

function obterObjetoAtivo() {

    if (
        congelado &&
        frozenObject
    ) {

        return frozenObject.object3D;
    }


    return objeto.object3D;
}


/* ============================================================
   APLICAR CONFIGURAÇÃO
   ============================================================ */

function aplicarConfiguracao() {

    if (!config) {
        return;
    }


    /* --------------------------------------------------------
       PIVOT AVÔ
       -------------------------------------------------------- */

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


    /* --------------------------------------------------------
       PIVOT PAI
       -------------------------------------------------------- */

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


    /* --------------------------------------------------------
       OBJETO
       -------------------------------------------------------- */

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


    /* --------------------------------------------------------
       ESCALA
       -------------------------------------------------------- */

    const escala =
        Number(config.scale);

    const escalaFinal =
        Number.isFinite(escala)
            ? escala
            : 1;


    objeto.object3D.scale.set(

        escalaFinal,

        escalaFinal,

        escalaFinal

    );


    /* --------------------------------------------------------
       ÁUDIO
       -------------------------------------------------------- */

    if (config.audio) {

        audio.src =
            `./marcadores/${pasta}/${config.audio}`;

        audio.preload =
            "auto";

        audio.load();
    }


    console.log(
        "AR: configuração aplicada ao marcador"
    );
}


/* ============================================================
   CARREGAR CONFIGURAÇÃO
   ============================================================ */

async function carregarConfig() {

    try {

        const resposta =
            await fetch(
                `${CONFIG_URL}?${Date.now()}`
            );


        if (!resposta.ok) {

            throw new Error(
                "config.json não encontrado"
            );
        }


        config =
            await resposta.json();


        console.log(
            "AR: config.json carregado"
        );

    } catch (erro) {

        console.error(
            "Erro ao carregar config.json:",
            erro
        );
    }
}


/* ============================================================
   DISTÂNCIA ENTRE OS DEDOS
   ============================================================ */

function distanciaEntreDedos(touches) {

    const dx =
        touches[0].clientX -
        touches[1].clientX;

    const dy =
        touches[0].clientY -
        touches[1].clientY;


    return Math.sqrt(
        dx * dx +
        dy * dy
    );
}


/* ============================================================
   CRIAR OBJETO CONGELADO
   ============================================================ */

function congelarObjeto() {

    if (congelado) {
        return;
    }


    if (!marcadorVisivel) {
        return;
    }


    /*
     * Garante que o GLB já carregou.
     */

    if (
        !modelo.object3D ||
        !modelo.object3D.children.length
    ) {

        console.warn(
            "AR: modelo ainda não está carregado"
        );

        return;
    }


    scene.object3D.updateMatrixWorld(
        true
    );


    /* --------------------------------------------------------
       CRIA O PIVOT CONGELADO
       -------------------------------------------------------- */

    const pivotElemento =
        document.createElement("a-entity");


    const objetoElemento =
        document.createElement("a-entity");


    scene.appendChild(
        pivotElemento
    );


    pivotElemento.appendChild(
        objetoElemento
    );


    frozenPivot =
        pivotElemento;

    frozenObject =
        objetoElemento;


    /* --------------------------------------------------------
       COPIA A TRANSFORMAÇÃO MUNDIAL DO PIVOT PAI
       -------------------------------------------------------- */

    const posicaoMundo =
        new THREE.Vector3();

    const quaternionMundo =
        new THREE.Quaternion();

    const escalaMundo =
        new THREE.Vector3();


    pivotPai.object3D.getWorldPosition(
        posicaoMundo
    );


    pivotPai.object3D.getWorldQuaternion(
        quaternionMundo
    );


    pivotPai.object3D.getWorldScale(
        escalaMundo
    );


    frozenPivot.object3D.position.copy(
        posicaoMundo
    );


    frozenPivot.object3D.quaternion.copy(
        quaternionMundo
    );


    frozenPivot.object3D.scale.copy(
        escalaMundo
    );


    /* --------------------------------------------------------
       COPIA A TRANSFORMAÇÃO LOCAL DO OBJETO
       -------------------------------------------------------- */

    frozenObject.object3D.position.copy(
        objeto.object3D.position
    );


    frozenObject.object3D.quaternion.copy(
        objeto.object3D.quaternion
    );


    frozenObject.object3D.scale.copy(
        objeto.object3D.scale
    );


    /* --------------------------------------------------------
       COPIA O GLB REALMENTE CARREGADO
       -------------------------------------------------------- */

    frozenModel =
        modelo.object3D.clone(true);


    frozenObject.object3D.add(
        frozenModel
    );


    /* --------------------------------------------------------
       CRIA LUZES PARA O OBJETO CONGELADO
       -------------------------------------------------------- */

    frozenAmbientLight =
        new THREE.AmbientLight(
            0xffffff,
            2
        );


    frozenDirectionalLight =
        new THREE.DirectionalLight(
            0xffffff,
            3
        );


    frozenDirectionalLight.position.set(
        1,
        3,
        2
    );


    scene.object3D.add(
        frozenAmbientLight
    );


    scene.object3D.add(
        frozenDirectionalLight
    );


    /* --------------------------------------------------------
       ESCONDE O OBJETO ORIGINAL
       -------------------------------------------------------- */

    objeto.object3D.visible =
        false;


    /*
     * Mantém as luzes originais
     * desligadas enquanto congelado.
     */

    const luzes =
        target.querySelectorAll(
            "a-light"
        );


    luzes.forEach(
        luz => {

            luz.object3D.visible =
                false;

        }
    );


    congelado =
        true;


    arrastando =
        false;

    usandoPinch =
        false;


    freezeButton.classList.add(
        "frozen"
    );


    freezeButton.disabled =
        false;


    console.log(
        "AR: objeto congelado"
    );
}


/* ============================================================
   DESCONGELAR
   ============================================================ */

function descongelarObjeto() {

    if (!congelado) {
        return;
    }


    /*
     * Para voltar ao marcador,
     * precisamos que ele esteja visível.
     */

    if (!marcadorVisivel) {

        console.log(
            "AR: encontre o marcador para descongelar"
        );

        return;
    }


    scene.object3D.updateMatrixWorld(
        true
    );


    pivotAvo.object3D.updateMatrixWorld(
        true
    );


    frozenPivot.object3D.updateMatrixWorld(
        true
    );


    /* --------------------------------------------------------
       TRANSFORMAÇÃO DO PIVOT CONGELADO
       PARA O SISTEMA DO PIVOT AVÔ
       -------------------------------------------------------- */

    const matrizLocal =
        new THREE.Matrix4();


    matrizLocal
        .copy(
            pivotAvo.object3D.matrixWorld
        )
        .invert()
        .multiply(
            frozenPivot.object3D.matrixWorld
        );


    const novaPosicao =
        new THREE.Vector3();

    const novoQuaternion =
        new THREE.Quaternion();

    const novaEscala =
        new THREE.Vector3();


    matrizLocal.decompose(
        novaPosicao,
        novoQuaternion,
        novaEscala
    );


    /* --------------------------------------------------------
       RESTAURA O PIVOT PAI
       -------------------------------------------------------- */

    pivotPai.object3D.position.copy(
        novaPosicao
    );


    pivotPai.object3D.quaternion.copy(
        novoQuaternion
    );


    pivotPai.object3D.scale.copy(
        novaEscala
    );


    /* --------------------------------------------------------
       RESTAURA O OBJETO
       -------------------------------------------------------- */

    objeto.object3D.position.copy(
        frozenObject.object3D.position
    );


    objeto.object3D.quaternion.copy(
        frozenObject.object3D.quaternion
    );


    objeto.object3D.scale.copy(
        frozenObject.object3D.scale
    );


    /* --------------------------------------------------------
       REMOVE O GLB CONGELADO
       -------------------------------------------------------- */

    if (frozenModel) {

        frozenObject.object3D.remove(
            frozenModel
        );

    }


    /* --------------------------------------------------------
       REMOVE AS LUZES CONGELADAS
       -------------------------------------------------------- */

    if (frozenAmbientLight) {

        scene.object3D.remove(
            frozenAmbientLight
        );

    }


    if (frozenDirectionalLight) {

        scene.object3D.remove(
            frozenDirectionalLight
        );

    }


    /* --------------------------------------------------------
       REMOVE OS ELEMENTOS CONGELADOS
       -------------------------------------------------------- */

    if (
        frozenPivot &&
        frozenPivot.parentNode
    ) {

        frozenPivot.parentNode.removeChild(
            frozenPivot
        );

    }


    frozenPivot =
        null;

    frozenObject =
        null;

    frozenModel =
        null;

    frozenAmbientLight =
        null;

    frozenDirectionalLight =
        null;


    /* --------------------------------------------------------
       MOSTRA O OBJETO ORIGINAL
       -------------------------------------------------------- */

    objeto.object3D.visible =
        true;


    const luzes =
        target.querySelectorAll(
            "a-light"
        );


    luzes.forEach(
        luz => {

            luz.object3D.visible =
                true;

        }
    );


    congelado =
        false;


    arrastando =
        false;

    usandoPinch =
        false;


    freezeButton.classList.remove(
        "frozen"
    );


    freezeButton.disabled =
        false;


    console.log(
        "AR: objeto descongelado"
    );
}


/* ============================================================
   BOTÃO FREEZE
   ============================================================ */

if (freezeButton) {

    freezeButton.addEventListener(
        "click",
        evento => {

            evento.stopPropagation();


            if (congelado) {

                descongelarObjeto();

            } else {

                congelarObjeto();

            }

        }
    );
}


/* ============================================================
   MARCADOR ENCONTRADO
   ============================================================ */

target.addEventListener(
    "targetFound",
    () => {

        marcadorVisivel =
            true;


        console.log(
            "AR: marcador encontrado"
        );


        /*
         * Só aplica a configuração
         * quando não estiver congelado.
         */

        if (!congelado) {

            aplicarConfiguracao();

        }


        freezeButton.disabled =
            false;


        tocarAudio();

    }
);


/* ============================================================
   MARCADOR PERDIDO
   ============================================================ */

target.addEventListener(
    "targetLost",
    () => {

        marcadorVisivel =
            false;


        arrastando =
            false;


        /*
         * Quando congelado, o FREEZE
         * continua disponível.
         */

        if (!congelado) {

            freezeButton.disabled =
                true;

        }


        console.log(
            "AR: marcador perdido"
        );

    }
);


/* ============================================================
   ÁUDIO
   ============================================================ */

function tocarAudio() {

    if (!audio.src) {

        console.log(
            "AR: nenhum áudio configurado"
        );

        return;
    }


    audio.play()

        .then(() => {

            console.log(
                "AR: áudio reproduzindo"
            );

        })

        .catch(() => {

            console.log(
                "AR: áudio aguardando interação"
            );

        });
}


/* ============================================================
   TOQUE PARA LIBERAR ÁUDIO
   ============================================================ */

document.addEventListener(
    "touchstart",
    evento => {

        if (
            evento.target.closest(
                "#freezeButton, #fullscreenButton"
            )
        ) {

            return;
        }


        if (marcadorVisivel) {

            tocarAudio();

        }

    },
    {
        passive: true,
        capture: true
    }
);


/* ============================================================
   INÍCIO DO TOQUE
   ============================================================ */

document.addEventListener(
    "touchstart",
    evento => {

        /*
         * Ignora os botões.
         */

        if (
            evento.target.closest(
                "#freezeButton, #fullscreenButton"
            )
        ) {

            return;
        }


        /*
         * Sem marcador e sem freeze,
         * não fazemos nada.
         */

        if (
            !marcadorVisivel &&
            !congelado
        ) {

            return;
        }


        /* ----------------------------------------------------
           DOIS DEDOS = PINÇA
           ---------------------------------------------------- */

        if (
            evento.touches.length === 2
        ) {

            arrastando =
                false;


            usandoPinch =
                true;


            distanciaInicialPinch =
                distanciaEntreDedos(
                    evento.touches
                );


            escalaInicialPinch =
                obterObjetoAtivo()
                    .scale
                    .x;


            return;
        }


        /* ----------------------------------------------------
           UM DEDO = ROTAÇÃO
           ---------------------------------------------------- */

        if (
            evento.touches.length === 1
        ) {

            usandoPinch =
                false;


            arrastando =
                true;


            ultimoX =
                evento.touches[0].clientX;


            ultimoY =
                evento.touches[0].clientY;

        }

    },
    {
        passive: true,
        capture: true
    }
);


/* ============================================================
   MOVIMENTO
   ============================================================ */

document.addEventListener(
    "touchmove",
    evento => {

        /*
         * Sem marcador e sem freeze,
         * não mexemos no objeto.
         */

        if (
            !marcadorVisivel &&
            !congelado
        ) {

            return;
        }


        /* ----------------------------------------------------
           PINÇA = ESCALA
           ---------------------------------------------------- */

        if (
            evento.touches.length === 2 &&
            usandoPinch
        ) {

            const distanciaAtual =
                distanciaEntreDedos(
                    evento.touches
                );


            if (
                distanciaInicialPinch <= 0
            ) {

                return;
            }


            const proporcao =
                distanciaAtual /
                distanciaInicialPinch;


            let novaEscala =
                escalaInicialPinch *
                proporcao;


            novaEscala =
                Math.max(
                    ESCALA_MINIMA,
                    Math.min(
                        ESCALA_MAXIMA,
                        novaEscala
                    )
                );


            /*
             * Escala somente no objeto.
             */

            obterObjetoAtivo()
                .scale
                .set(
                    novaEscala,
                    novaEscala,
                    novaEscala
                );


            return;
        }


        /* ----------------------------------------------------
           UM DEDO = X / Y
           ---------------------------------------------------- */

        if (
            evento.touches.length !== 1 ||
            !arrastando
        ) {

            return;
        }


        const atualX =
            evento.touches[0].clientX;


        const atualY =
            evento.touches[0].clientY;


        const deltaX =
            atualX - ultimoX;


        const deltaY =
            atualY - ultimoY;


        ultimoX =
            atualX;


        ultimoY =
            atualY;


        const pivot =
            obterPivotAtivo();


        /*
         * ESQUERDA / DIREITA
         * = Y
         */

        pivot.rotation.y +=
            deltaX *
            VELOCIDADE_ROTACAO;


        /*
         * CIMA / BAIXO
         * = X
         */

        pivot.rotation.x +=
            deltaY *
            VELOCIDADE_ROTACAO;

    },
    {
        passive: true,
        capture: true
    }
);


/* ============================================================
   FIM DO TOQUE
   ============================================================ */

document.addEventListener(
    "touchend",
    evento => {

        if (
            evento.touches.length === 0
        ) {

            arrastando =
                false;

            usandoPinch =
                false;


            return;
        }


        /*
         * Saiu da pinça e sobrou um dedo.
         * Reinicia o arrasto sem salto.
         */

        if (
            evento.touches.length === 1
        ) {

            usandoPinch =
                false;


            arrastando =
                true;


            ultimoX =
                evento.touches[0].clientX;


            ultimoY =
                evento.touches[0].clientY;

        }

    },
    {
        passive: true,
        capture: true
    }
);


/* ============================================================
   CANCELAMENTO
   ============================================================ */

document.addEventListener(
    "touchcancel",
    () => {

        arrastando =
            false;

        usandoPinch =
            false;

    },
    {
        passive: true,
        capture: true
    }
);


/* ============================================================
   FULLSCREEN
   ============================================================ */

if (fullscreenButton) {

    fullscreenButton.addEventListener(
        "click",
        async evento => {

            evento.stopPropagation();


            try {

                if (
                    !document.fullscreenElement
                ) {

                    await document
                        .documentElement
                        .requestFullscreen();

                } else {

                    await document
                        .exitFullscreen();

                }

            } catch (erro) {

                console.error(
                    "Erro no fullscreen:",
                    erro
                );

            }

        }
    );
}


/* ============================================================
   INÍCIO
   ============================================================ */

carregarConfig();
