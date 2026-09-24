* {
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
}

html,
body {
    margin: 0;
    padding: 0;
    width: 100%;
    min-height: 100%;
}

body {
    background: #000;
    color: #fff;
    font-family: Arial, Helvetica, sans-serif;
    overflow-x: hidden;
}


.container {
    width: 100%;
    max-width: 700px;
    min-height: 100vh;

    margin: 0 auto;

    padding: 15px 12px 25px;

    display: flex;
    flex-direction: column;
    align-items: center;
}


/* =========================
   LOGOS
========================= */

.logos {
    width: 100%;

    display: flex;
    justify-content: center;
    align-items: center;

    gap: 15px;

    margin-bottom: 5px;
}

.logo {
    width: 75px;
    height: 75px;

    object-fit: contain;

    display: block;
}


/* Controle individual */

.logo1 {
    width: 75px;
    height: 75px;
}

.logo2 {
    width: 75px;
    height: 75px;
}

.logo3 {
    width: 75px;
    height: 75px;
}


/* =========================
   TÍTULO
========================= */

h1 {
    margin: 5px 0 18px;

    font-size: 24px;
    line-height: 1;

    text-align: center;

    letter-spacing: 1px;
}


/* =========================
   BOTÕES DOS DADOS
========================= */

.dados {
    width: 100%;

    display: grid;

    grid-template-columns: repeat(3, 1fr);

    gap: 8px;

    margin-bottom: 8px;
}

.dado-btn {
    min-height: 48px;

    border: 2px solid #fff;
    border-radius: 10px;

    background: #000;
    color: #fff;

    font-size: 17px;
    font-weight: bold;

    cursor: pointer;

    transition:
        background 0.15s ease,
        color 0.15s ease,
        transform 0.1s ease;
}

.dado-btn:active {
    transform: scale(0.94);
}

.dado-btn.selecionado {
    background: #fff;
    color: #000;
}


/* =========================
   ÁREA DO DADO
========================= */

.area-dado {
    width: 100%;

    height: 310px;

    position: relative;

    display: flex;
    flex-direction: column;

    justify-content: center;
    align-items: center;

    overflow: hidden;
}


#dado3d {
    width: 100%;
    height: 270px;

    position: relative;
}

#dado3d canvas {
    width: 100% !important;
    height: 100% !important;

    display: block;
}


/* Nome do dado atual */

#dadoAtual {
    position: absolute;

    bottom: 2px;

    font-size: 15px;
    font-weight: bold;

    opacity: 0.75;

    pointer-events: none;
}


/* =========================
   RESULTADO / TOTAL
========================= */

.informacoes {
    width: 100%;

    display: grid;

    grid-template-columns: 1fr 1fr;

    gap: 10px;

    margin-top: 2px;
}


.caixa {
    border: 2px solid #fff;
    border-radius: 10px;

    min-height: 85px;

    display: flex;
    flex-direction: column;

    justify-content: center;
    align-items: center;

    background: #000;
}


.titulo-caixa {
    font-size: 13px;
    font-weight: bold;

    margin-bottom: 5px;

    opacity: 0.8;
}


#resultado,
#total {
    font-size: 32px;
    font-weight: bold;

    line-height: 1;
}


/* =========================
   RESETAR
========================= */

.botao-resetar {
    width: 100%;

    margin-top: 10px;

    min-height: 48px;

    border: 2px solid #fff;
    border-radius: 10px;

    background: #000;
    color: #fff;

    font-size: 16px;
    font-weight: bold;

    cursor: pointer;
}

.botao-resetar:active {
    background: #fff;
    color: #000;
}


/* =========================
   TELA CHEIA
========================= */

.botao-fullscreen {
    width: 100%;

    margin-top: 8px;

    min-height: 46px;

    border: 1px solid #777;
    border-radius: 10px;

    background: #111;
    color: #fff;

    font-size: 15px;
    font-weight: bold;

    cursor: pointer;
}

.botao-fullscreen:active {
    background: #fff;
    color: #000;
}


/* =========================
   DESKTOP
========================= */

@media (min-width: 600px) {

    .container {
        padding-top: 25px;
    }

    .logos {
        gap: 25px;
    }

    .logo {
        width: 90px;
        height: 90px;
    }

    .logo1 {
        width: 90px;
        height: 90px;
    }

    .logo2 {
        width: 90px;
        height: 90px;
    }

    .logo3 {
        width: 90px;
        height: 90px;
    }

    h1 {
        font-size: 28px;
    }

    .dados {
        grid-template-columns: repeat(6, 1fr);
    }

    .dado-btn {
        min-height: 52px;
    }

    .area-dado {
        height: 350px;
    }

    #dado3d {
        height: 320px;
    }
}
