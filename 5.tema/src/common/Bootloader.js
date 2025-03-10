// const dataCache = document.getElementById('datosGenerales').getAttribute('data-cache');
// const gameName = activityData.type;
// let DB;
// if (dataCache == '0') {
//     DB = await import(`../../src/specific/share/share.js`);
// } else {
//     const dataResources = document.getElementById('datosGenerales').getAttribute('data-resources');
//     DB = await import(`${dataResources}jsobfuscated/activities/${gameName}/share/share.js?v=${dataCache}`);
// }
// const db = DB.default;
// let bootloader;

//sonido juego
document.getElementById('sndG').addEventListener('change', function(){
    db.sonidoJuego = document.getElementById('sndG').checked ? 1 : 0;
});
//sonido actividad
document.getElementById('sndCtv').addEventListener('change', function(){
    if(document.getElementById('sndCtv').checked){
        db.sonidoActividad = 1;
    }else{
        document.getElementById('g__modal').classList.add('act');
    }
});
document.getElementById('no__sndCtv').addEventListener('click', function() {
    document.getElementById('sndCtv').checked=true;
    document.getElementById('g__modal').classList.remove('act');
});
document.getElementById('si__sndCtv').addEventListener('click', function() {
    db.sonidoActividad = 0;
    document.getElementById('g__modal').classList.remove('act');
});
document.getElementById('close__modal').addEventListener('click', function(){
    document.getElementById('sndCtv').checked=true;
    document.getElementById('g__modal').classList.remove('act');
}); 

class CommonBootloader extends Phaser.Scene {
    constructor(name) {
        super(name);
    }
    
    setHTML() {}

    setGameData() {}

    setAudio() {}

    setMultimedia() {}

    setEvents() {}

    setFullScreen() {}

    iniciarJuego(bootloader) {}

    create() {
        pruebaRendimiento(this);
        this.timerRendimiento = this.time.addEvent({
            delay: 100,
            callback: () => {
                if(typeof this.bajarRendimineto !== 'undefined'){
                    this.timerRendimiento.remove();
                    
                    if(this.bajarRendimineto){
                        db.sonidoJuego=0;
                        document.body.classList.add('g__gpu--sllow');
                    }
                }
            },
            repeat: -1
        });

        //gameData comun
        db.ventanaExit = 0;
        db.pantallaFinal = 0;
        this.finish = false;
        this.moving = false;
        this.imgFull = false;
        this.ordenPreguntas = Array();
        for(var i=1;i<=db.preguntas.length;i++){
            this.ordenPreguntas.push(i);
        }
        db.preguntasMaximasReal = db.preguntas.length;
        db.vidas=db.vidasTotales;
        this.setGameData();

        //HTML comun
        document.getElementById('gTt').innerHTML = this.toHTML(db.titulo);
        if(db.vidasInfinitas){  
            document.getElementById('gLvs').innerHTML = "&#8734;";
        }else{
            document.getElementById('gLvs').innerHTML = db.vidas;
        }
        if ((document.fullScreenElement !== undefined && document.fullScreenElement === null) || (document.msFullscreenElement !== undefined && document.msFullscreenElement === null) || (document.mozFullScreen !== undefined && !document.mozFullScreen) || (document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen)) {
            document.getElementById('gFsc').classList.remove('act');
        }else{
            document.getElementById('gFsc').classList.add('act');
        }
        document.body.classList.add('act');
        this.setHTML();

        this.setFullScreen();

        this.intro = this.sound.add('intro');
        this.gameWin = this.sound.add('gameWin');
        this.gameOver = this.sound.add('gameOver');
        this.countdown = this.sound.add('countdown');
        this.setAudio();

        this.setMultimedia();

        this.renderer.off(Phaser.Renderer.Events.RESIZE);
        this.outOfTime = new Event('outoftime');
        this.setEvents();

        document.getElementById('gCntr').style.zIndex='';
        //tiempo
        this.cuentaAtras = true;
        this.commonTimedEvent = this.time.addEvent({ 
            delay: 1000, 
            callback: () => {
                if((db.vidasInfinitas || db.vidas>0) && !this.finish){
                    if(db.pantallaFinal){
                        //le ha dado al boton salir
                        if(!db.vidasInfinitas){
                            db.vidas=1;
                        }else{
                            db.vidas=0;
                        }

                        document.getElementById('gQstSkMedWp').classList.remove('act');
                        this.moving = true;

                        // vidaMenos(this, '');
                        // this.timedEvent.destroy();
                    }
                    if(typeof db.lastTime === 'undefined'){ db.lastTime=Math.floor(Date.now() / 1000);}
                    //comprobar que el tiempo va con el real y no ha parado el juego
                    if(Math.floor(Date.now() / 1000) - db.lastTime > 1){
                        db.tiempo+=(Math.floor(Date.now() / 1000) - db.lastTime)-1;
                        if(db.tieneTiempoPregunta){
                            this.tiempoPregunta-=(Math.floor(Date.now() / 1000) - db.lastTime)+1;
                            if(this.tiempoPregunta<=0) {this.tiempoPregunta=1;}
                        }
                    }
                    db.lastTime=Math.floor(Date.now() / 1000);
                    
                    db.tiempo+=1;
                    var seconds = Math.round(db.tiempo);
                    var hour = Math.floor(seconds / 3600);
                    hour = (hour < 10)? '0' + hour : hour;
                    var minute = Math.floor((seconds / 60) % 60);
                    minute = (minute < 10)? '0' + minute : minute;
                    var second = seconds % 60;
                    second = (second < 10)? '0' + second : second;
                    document.getElementById('gClkLl').innerHTML =  hour + ':' + minute + ':' + second;
                    document.getElementById('gClkLlLY').innerHTML =  minute + ':' + second;

                    if (db.tieneTiempoPregunta) {
                        if (this.tiempoPregunta >= 0) {
                            document.getElementById('gClkQstNr').innerHTML = Math.round(this.tiempoPregunta);
                            if (!isNaN(db.preguntas[this.ordenPreguntas[db.preguntaActual] - 1].tiempo)) {
                                this.setProgress(Math.round(100 - (this.tiempoPregunta / (db.preguntas[this.ordenPreguntas[db.preguntaActual] - 1].tiempo / 100))));
                            } else {
                                this.setProgress(Math.round(100 - (this.tiempoPregunta / (db.tiempoPregunta / 100))));
                            }
                            this.tiempoPregunta--;
                        } else {
                            if (db.tieneTiempoPregunta) {
                                window.dispatchEvent(this.outOfTime);
                            }
                        }
                    }
                }
            }, 
            callbackScope: this, 
            repeat: -1,
        });
        this.iniciarJuego(this);
    }

    setProgress(percent) {
        var circle = document.getElementById('gClk').getElementsByTagName('circle')[0];//.querySelector('circle');
        var radius = circle.r.baseVal.value;
        var circumference = radius * 2 * Math.PI;

        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = `${circumference}`;

        const offset = circumference - percent / 100 * circumference;
        circle.style.strokeDashoffset = offset;
    }

    reproduceAudio(audioNom, retardo = 0, volumen = 1) {
        if(db.sonidoJuego) {
            audioNom.play({
                delay: retardo,
                volume: volumen
            });
        }
    }

    between(x, min, max) {
        return x >= min && x <= max;
    }

    toHTML(text) {
        text = text.replaceAll('\\','\\\\');
        text = text.replaceAll('"','\"');
        text = text.replaceAll('>','&gt;');
        text = text.replaceAll('<','&lt;');
        text = text.replaceAll("\n",'<br>');
        return text;
    }
}

window.commonBootloader = CommonBootloader;

// export default Bootloader;