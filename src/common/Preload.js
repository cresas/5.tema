// const dataCache = document.getElementById('datosGenerales').getAttribute('data-cache');
// const gameName = activityData.type;
// let DB;
// if (dataCache == '0') {
//     DB = await import(`../../src/specific/share/share.js`);
// } else {
//     const dataResources = document.getElementById('datosGenerales').getAttribute('data-resources');
//     DB = await import(`${dataResources}jsobfuscated/activities/${gameName}/share/share.js?v=${dataCache}`);
// }

// const db = window.db;//DB.default;

document.getElementById('jumpInfo1').innerHTML = activityData.lang.jumpInfo1;
document.getElementById('jumpInfo5').innerHTML = activityData.lang.jumpInfo5;
document.getElementById('jumpInfo6').innerHTML = activityData.lang.jumpInfo6;
document.getElementById('jumpInfo8').innerHTML = activityData.lang.jumpInfo8;
document.getElementById('jumpInfo10').innerHTML = activityData.lang.jumpInfo10;
document.getElementById('jumpInfo21').innerHTML = activityData.lang.jumpInfo21;
document.getElementById('jumpInfo22a').innerHTML = activityData.lang.jumpInfo22a;
document.getElementById('jumpInfo22b').innerHTML = activityData.lang.jumpInfo22b;

class CommonPreload extends Phaser.Scene {
    constructor(name) {
        super(name);
    }

    loadLanguage() {}

    loadGameData() {}

    loadHTML() {}

    loadAudio() {}

    loadImages() {}

    loadEvents() {}

    preload() {
        //cargar textos de idiomas
        db.lang = activityData.lang;
        document.getElementById('edu_ldg_prc').innerHTML = db.lang.cargando;
        document.getElementById('edu__ldg__tx__nf').innerHTML = db.lang.cargando;
        this.loadLanguage();

        //cargar datos del juego
        db.resources = activityData.resources;

        db.vidasInfinitas=0;
        if(activityData.data.NUMERO_INTENTOS_INFINITOS=='si'){
            db.vidasInfinitas=1;
        } else {
            document.body.classList.add('g__pnlt');
        }
        db.vidasTotales = activityData.data.NUMERO_INTENTOS;
        this.loadGameData();

        //cargar elementos HTML
        this.load.html('feedbackPuntosArcade', assetsURLs.commonHTML + 'pts-up.html');
        this.load.html('feedbackVida', assetsURLs.commonHTML + 'vida.html');
        this.load.html('imgLupa', assetsURLs.commonHTML + 'imgLupa.html');
        this.load.html('imgLoading', assetsURLs.commonHTML + 'imgLoading.html');
        this.load.html('audioComponent', assetsURLs.commonHTML + 'audioComponent.html');
        this.loadHTML();

        //cargar elementos audio
        this.load.audio('intro', assetsURLs.commonAudio + 'intro.mp3');
        this.load.audio('countdown', assetsURLs.commonAudio + 'countdown.mp3');
        this.load.audio('gameWin', assetsURLs.commonAudio + 'game-win.mp3');
        this.load.audio('gameOver', assetsURLs.commonAudio + 'game-over.mp3');
        this.load.audio('ticking', assetsURLs.commonAudio + 'ticking.mp3');
        this.loadAudio();

        //cargar imagenes
        this.loadImages();

        this.loadEvents();
    }

    //funciones comunes que no intervienen directamente en la carga
    cambiaABlob(elemento){
        const myRequest = new Request(db.resources+elemento);
        fetch(myRequest)
            .then((response) => response.blob())
            .then((myBlob) => {
                let auxPreg = URL.createObjectURL(myBlob);
                db.preguntas.forEach(function(resp,i){
                    if(resp.pregunta.imagen == elemento){
                        db.preguntas[i].pregunta.imagen=auxPreg;
                    }
                    if(resp.pregunta.audio == elemento){
                        db.preguntas[i].pregunta.audio=auxPreg;
                    }
                });
            });
    }

}

window.commonPreload = CommonPreload;

// export default CommonPreload;