// ============================================================
// AR PRINCIPAL
//
// HIERARQUIA:
//
// MARCADOR
//    ↓
// PIVOT AVÔ
//    ↓
// PIVOT PAI
//    ↓
// OBJETO
//    ↓
// GLB
//
// O GLB usa o Pivot Pai como referência.
// ============================================================


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


// ============================================================
// CONFIGURAÇÃO
// ============================================================

const parametros =
    new URLSearchParams(
        window.location.search
    );


const pasta =
    parametros.get("pasta") ||
    "zelda";


const CONFIG_URL =
    `./marcadores/${pasta}/config.json`;


const VELOCIDADE_ROTACAO =
    0.01;


// ============================================================
// ESTADO
// ============================================================

let config = null;

let marcadorVisivel = false;

let arrastando = false;

let ultimoX = 0;


// ============================================================
// CARREGAR CONFIGURAÇÃO
// ============================================================

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


        aplicarConfiguracao();


    } catch (erro) {

        console.error(
            "Erro ao carregar config.json:",
            erro
        );

    }

}


// ============================================================
// APLICAR CONFIGURAÇÃO
// ============================================================

function aplicarConfiguracao() {

    if (!config) {
        return;
    }


    // ========================================================
    // PIVOT AVÔ
    //
    // Referência direta do marcador.
    // ========================================================

    const pivotAvoPosition =
        config.pivotAvo?.position;


    const pivotAvoRotation =
        config.pivotAvo?.rotation;


    if (pivotAvoPosition) {

        pivotAvo.object3D.position.set(

            Number(
                pivotAvoPosition.x ?? 0
            ),

            Number(
                pivotAvoPosition.y ?? 0
            ),

            Number(
                pivotAvoPosition.z ?? 0
            )

        );

    } else if (config.pivot) {

        // Compatibilidade com o
        // formato antigo.

        pivotAvo.object3D.position.set(

            Number(
                config.pivot.x ?? 0
            ),

            Number(
                config.pivot.y ?? 0
            ),

            Number(
                config.pivot.z ?? 0
            )

        );

    } else {

        pivotAvo.object3D.position.set(
            0,
            0,
            0
        );

    }


    if (pivotAvoRotation) {

        pivotAvo.object3D.rotation.set(

            THREE.MathUtils.degToRad(
                Number(
                    pivotAvoRotation.x ?? 0
                )
            ),

            THREE.MathUtils.degToRad(
                Number(
                    pivotAvoRotation.y ?? 0
                )
            ),

            THREE.MathUtils.degToRad(
                Number(
                    pivotAvoRotation.z ?? 0
                )
            )

        );

    } else if (config.pivotRotation) {

        // Compatibilidade com o
        // formato antigo.

        pivotAvo.object3D.rotation.set(

            THREE.MathUtils.degToRad(
                Number(
                    config.pivotRotation.x ?? 0
                )
            ),

            THREE.MathUtils.degToRad(
                Number(
                    config.pivotRotation.y ?? 0
                )
            ),

            THREE.MathUtils.degToRad(
                Number(
                    config.pivotRotation.z ?? 0
                )
            )

        );

    } else {

        pivotAvo.object3D.rotation.set(
            0,
            0,
            0
        );

    }


    // ========================================================
    // PIVOT PAI
    //
    // Referência do Pivot Avô.
    // ========================================================

    const pivotPaiPosition =
        config.pivotPai?.position;


    const pivotPaiRotation =
        config.pivotPai?.rotation;


    pivotPai.object3D.position.set(

        Number(
            pivotPaiPosition?.x ?? 0
        ),

        Number(
            pivotPaiPosition?.y ?? 0
        ),

        Number(
            pivotPaiPosition?.z ?? 0
        )

    );


    pivotPai.object3D.rotation.set(

        THREE.MathUtils.degToRad(
            Number(
                pivotPaiRotation?.x ?? 0
            )
        ),

        THREE.MathUtils.degToRad(
            Number(
                pivotPaiRotation?.y ?? 0
            )
        ),

        THREE.MathUtils.degToRad(
            Number(
                pivotPaiRotation?.z ?? 0
            )
        )

    );


    // ========================================================
    // OBJETO
    //
    // Referência do Pivot Pai.
    // ========================================================

    objeto.object3D.position.set(

        Number(
            config.position?.x ?? 0
        ),

        Number(
            config.position?.y ?? 0
        ),

        Number(
            config.position?.z ?? 0
        )

    );


    objeto.object3D.rotation.set(

        THREE.MathUtils.degToRad(
            Number(
                config.rotation?.x ?? 0
            )
        ),

        THREE.MathUtils.degToRad(
            Number(
                config.rotation?.y ?? 0
            )
        ),

        THREE.MathUtils.degToRad(
            Number(
                config.rotation?.z ?? 0
            )
        )

    );


    // ========================================================
    // ESCALA
    // ========================================================

    const escala =
        Number(
            config.scale ?? 1
        );


    objeto.object3D.scale.set(
        escala,
        escala,
        escala
    );


    // ========================================================
    // ÁUDIO
    // ========================================================

    if (config.audio) {

        audio.src =
            `./marcadores/${pasta}/${config.audio}`;


        audio.preload =
            "auto";


        audio.load();

    }

}


// ============================================================
// MARCADOR ENCONTRADO
// ============================================================

target.addEventListener(
    "targetFound",
    () => {

        marcadorVisivel =
            true;


        console.log(
            "AR: marcador encontrado"
        );


        tocarAudio();

    }
);


// ============================================================
// MARCADOR PERDIDO
// ============================================================

target.addEventListener(
    "targetLost",
    () => {

        marcadorVisivel =
            false;


        console.log(
            "AR: marcador perdido"
        );

    }
);


// ============================================================
// ÁUDIO
// ============================================================

function tocarAudio() {

    if (!audio.src) {

        console.log(
            "AR: nenhum áudio configurado"
        );

        return;

    }


    audio.play()

        .then(
            () => {

                console.log(
                    "AR: áudio reproduzindo"
                );

            }
        )

        .catch(
            () => {

                console.log(
                    "AR: áudio aguardando interação"
                );

            }
        );

}


// ============================================================
// TOQUE
//
// Também permite iniciar o áudio depois
// de uma interação do usuário.
// ============================================================

document.addEventListener(
    "touchstart",
    () => {

        if (marcadorVisivel) {

            tocarAudio();

        }

    },
    {
        passive: true,
        once: false
    }
);


// ============================================================
// INÍCIO DO ARRASTO
//
// O usuário arrasta horizontalmente para
// girar o PIVOT PAI.
// ============================================================

document.addEventListener(
    "touchstart",
    evento => {

        if (
            evento.touches.length !== 1
        ) {

            return;

        }


        arrastando =
            true;


        ultimoX =
            evento.touches[0].clientX;

    },
    {
        passive: true,
        capture: true
    }
);


// ============================================================
// ARRASTO
//
// ANTES:
//
// calculava a posição do GLB
// matematicamente.
//
// AGORA:
//
// gira diretamente o Pivot Pai.
//
// Portanto:
//
// Pivot Pai
//     ↓
//     GLB
//
// O GLB gira exatamente em torno
// do eixo calibrado.
// ============================================================

document.addEventListener(
    "touchmove",
    evento => {

        if (
            !arrastando ||
            evento.touches.length !== 1
        ) {

            return;

        }


        const atualX =
            evento.touches[0].clientX;


        const deltaX =
            atualX -
            ultimoX;


        ultimoX =
            atualX;


        const angulo =
            deltaX *
            VELOCIDADE_ROTACAO;


        pivotPai.object3D.rotation.y +=
            angulo;

    },
    {
        passive: true,
        capture: true
    }
);


// ============================================================
// FIM DO ARRASTO
// ============================================================

document.addEventListener(
    "touchend",
    () => {

        arrastando =
            false;

    },
    {
        passive: true,
        capture: true
    }
);


document.addEventListener(
    "touchcancel",
    () => {

        arrastando =
            false;

    },
    {
        passive: true,
        capture: true
    }
);


// ============================================================
// TELA CHEIA
// ============================================================

if (fullscreenButton) {

    fullscreenButton.addEventListener(
        "click",
        async evento => {

            evento.stopPropagation();


            try {

                if (
                    !document.fullscreenElement
                ) {

                    await document.documentElement.requestFullscreen();

                } else {

                    await document.exitFullscreen();

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


// ============================================================
// INICIAR
// ============================================================

carregarConfig();