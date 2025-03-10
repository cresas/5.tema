const commonPreload = window.commonPreload;

let caja = document.createElement('div');
caja.setAttribute('id', "gCj");
caja.classList.add("g__cj");
caja.classList.add("g__cj--op"); 
caja.style.setProperty('display', 'none');
document.body.appendChild(caja); 

document.getElementById('opInfo2').innerHTML=activityData.lang.opInfo2;
document.getElementById('opInfo7').innerHTML=activityData.lang.opInfo7;
document.getElementById('opInfo9').innerHTML=activityData.lang.opInfo9;
document.getElementById('opInfo12').innerHTML=activityData.lang.opInfo12;

class Preload extends commonPreload {
    constructor() {
        super('Preload');
    }

    loadLanguage() {
        //idioma
        db.logo=assetsURLs.specificImg + db.lang.logoOrdenarPalabras;
        db.juego=db.lang.juegoOp;
    }

    loadGameData() {
        db.puntosMax=100;
        if(activityData.data.MAXIMO!='no'){
            db.tieneTiempoPregunta=1;
            db.tiempoPregunta=activityData.data.TIEMPO;
        }else{
            if(!document.body.classList.contains('g__noend')) {document.body.classList.add('g__noend')}
        }

        if(activityData.data.ALEATORIO=='si'){
            db.preguntasOrdenadas=0;
        }
        if(activityData.data.SENSIBLE_ACENTOS=='si'){
            db.sensibleAcentos=1;
        }

        var i=0;
        var multimedia=[];
        var sinEnunciado=true;
        activityData.data.PREGUNTAS.filter(screen => screen.RESPUESTAS[0].RESPUESTA.split(' ').length > 1).forEach(function(preg){
            var pregImagen='';
            var pregAudio='';
            var pregVideo='';
            
            if(preg.MULTIMEDIA){
                if(preg.MULTIMEDIA_TIPO=='image'){
                    if(!multimedia.includes(preg.MULTIMEDIA)){multimedia.push(preg.MULTIMEDIA);}
                    pregImagen=preg.MULTIMEDIA;
                }else if(preg.MULTIMEDIA_TIPO=='audio'){
                    if(!multimedia.includes(preg.MULTIMEDIA)){multimedia.push(preg.MULTIMEDIA);}
                    pregAudio=preg.MULTIMEDIA;
                }else if(preg.MULTIMEDIA_TIPO=='youtube'){
                    pregVideo="https://www.youtube.com/embed/".concat(preg.MULTIMEDIA);
                }
            }

            if(preg.ENUNCIADO!='' || pregImagen!='' || pregAudio!='' || pregVideo!=''){
                sinEnunciado=false;
            }
            

            if(preg.RESPUESTAS[0].RESPUESTA.length>=2){
                db.preguntas[i]={
                    pregunta: {
                        texto: preg.ENUNCIADO,
                        imagen: pregImagen,
                        audio: pregAudio,
                        video: pregVideo,
                    },
                    respuesta: {
                        texto : preg.RESPUESTAS[0].RESPUESTA
                    }
                };
                i++;
            }
        });

        if(sinEnunciado){
            document.getElementById('gCj').classList.add('fll');
        }

        let prel = this;
        multimedia.forEach(function(elemento) {
            prel.cambiaABlob(elemento);
        });
    }

    loadHTML() {
        this.load.html('letra', assetsURLs.specificHTML + 'letra.html');
        this.load.html('letraxxxl', assetsURLs.specificHTML + 'letraxxxl.html');
        this.load.html('letraxxl', assetsURLs.specificHTML + 'letraxxl.html');
        this.load.html('letraxl', assetsURLs.specificHTML + 'letraxl.html');
        this.load.html('letral', assetsURLs.specificHTML + 'letral.html');
        this.load.html('letram', assetsURLs.specificHTML + 'letram.html');
        this.load.html('letras', assetsURLs.specificHTML + 'letras.html');
        this.load.html('letraxs', assetsURLs.specificHTML + 'letraxs.html');
    }

    loadAudio() {
        //carga audios
        this.load.audio('cargarLetra', assetsURLs.specificAudio + 'carga-letra.mp3');
        this.load.audio('mouseHover', assetsURLs.specificAudio + 'mouse-hover.mp3');
        this.load.audio('moverLetra', assetsURLs.specificAudio + 'mover-letra.mp3');
        this.load.audio('letraOk', assetsURLs.specificAudio + 'letra-ok.mp3');
        this.load.audio('letraError', assetsURLs.specificAudio + 'letra-error.mp3');
        this.load.audio('correctWord', assetsURLs.specificAudio + 'correct-word.mp3');
        this.load.audio('letraSalida', assetsURLs.specificAudio + 'letras-salida.mp3');
        this.load.audio('pointsUp', assetsURLs.specificAudio + 'points-up.mp3');
        this.load.audio('enunciado', assetsURLs.specificAudio + 'enunciado.mp3');
        this.load.audio('blank', assetsURLs.specificAudio + 'blank-act.mp3');
    }

    loadEvents() {
        let prel = this;
        if(document.getElementById('play').classList.contains('prss') || location.href.includes('faststart=1')) {
            db.inGame=1;
            loadAndPlay(prel);
        } else {
            db.hacerClick = ()  => {

                db.inGame=1;
                loadAndPlay(prel);

            }

            document.getElementById('play').addEventListener('click',db.hacerClick);

            db.pulsarEnter = (e) => {
                //intro
                if(e.keyCode===13){

                    if(!document.getElementById('g__opt').classList.contains('act') && !db.pantallaFinal && !db.inGame){ 
                        if(smartyData.publiVideo !== false){
                            if(document.getElementById('videoplayer').style.display=='none'){
                                db.inGame=1;
                                loadAndPlay(prel);
                            }
                        }else{
                            db.inGame=1;
                            loadAndPlay(prel);
                        }
                    }
                }
            }
            document.body.addEventListener("keydown", db.pulsarEnter ,{once:true});
        }
    }

}

const loadAndPlay = (preload) => {
    const startEvent = new Event("activity-start");
    window.dispatchEvent(startEvent);

    if(preload.load.progress < 1) {
        document.getElementById('g__bg').classList.remove('act');
        document.getElementById('g__hd').classList.remove('act');
        document.getElementById('g__hdg').classList.remove('act');
        document.getElementById('g__cnt__ini').classList.remove('act');
        document.getElementById('eduLdg').classList.add('act');

        preload.load.on('progress', function(progress){
            if(Math.round(progress*100)!=100) document.getElementById('edu_ldg_prc').innerHTML=db.lang.cargando+' '+String(Math.round(progress*100))+'%';
        });

        preload.load.on('complete', () => {
            preload.time.addEvent({
                delay: 1000,
                callback: ()=>{
                    document.getElementById('edu_ldg_prc').innerHTML=db.lang.cargando+' 100%';
                    preload.time.addEvent({
                        delay: 200,
                        callback: ()=>{
                            document.getElementById('eduLdg').classList.remove('act');
                            document.getElementById('g__bg').classList.add('act');
                            preload.scene.start('Comun', { game: 'ordenarPalabras', db: db, fromStartButton: true});
                        }
                    })
                }
            })
        });
    } else {
        document.getElementById('eduLdg').classList.remove('act');
        preload.scene.start('Comun', { game: 'ordenarPalabras', db: db, fromStartButton: true});
    }
}

// export default Preload;
window.preload = Preload;