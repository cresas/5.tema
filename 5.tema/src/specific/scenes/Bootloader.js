// const dataCache = document.getElementById('datosGenerales').getAttribute('data-cache');
// let DB;
// let Comun;
// if (dataCache == '0') {
//     DB = await import('../../../src/common/share.js');
//     Comun = await import(`../../../src/common/Bootloader.js`);
// } else {
//     const dataResources = document.getElementById('datosGenerales').getAttribute('data-resources');
//     DB = await import(`${dataResources}jsobfuscated/activities/commonV2/share.js?v=${dataCache}`);
//     Comun = await import(`${dataResources}jsobfuscated/activities/commonV2/Bootloader.js?v=${dataCache}`);
// }
// const db = DB.default;
const comunBootloader = window.commonBootloader;

let bootloader;

class Bootloader extends comunBootloader {
    constructor() {
        super('Bootloader');
        bootloader = this;
    }

    setHTML() {
        document.getElementById('gPts').innerHTML = Math.round(db.puntos);
    }

    setGameData() {
        this.pasarPregunta=0;
        this.isDrag=0;
        this.preguntasCorrectas=Array();
        this.preguntasEmpezadas=Array();
        this.feedbackPuntosArcade = this.add.group();

        this.puntosPalabra =  Math.floor((db.puntosMax / db.preguntas.length) * 1000) / 1000; 

        //Esto sirve para comprobar luego si se hace clic o drag
        this.input.dragDistanceThreshold = 15; 

        if(!db.preguntasOrdenadas){
            this.ordenPreguntas = this.ordenPreguntas.sort(function() {return Math.random() - 0.5});
        }
    }

    setAudio() {
        if(db.sonidoJuego){
            //anado audios
            this.cargarLetra = this.sound.add('cargarLetra');
            this.mouseHover = this.sound.add('mouseHover');
            this.moverLetra = this.sound.add('moverLetra');
            this.letraOk = this.sound.add('letraOk');
            this.letraError = this.sound.add('letraError');
            this.correctWord = this.sound.add('correctWord');
            this.letraSalida = this.sound.add('letraSalida');
            this.pointsUp = this.sound.add('pointsUp'); //FALTA PARA EL ARCADE
            this.enunciado = this.sound.add('enunciado');
            this.blank = this.sound.add('blank');
        }
    }

    setEvents() {
        document.body.removeEventListener("keydown", db.pulsarEnter);
        document.getElementById('play').removeEventListener('click',db.hacerClick);
        
        //quitar imagen al pulsar en cualquir lado
        document.onclick = function(e) {
            var preguntaImg = document.getElementById("sk__impr");
            if (preguntaImg) {
                if(document.getElementById("sk__impr").parentNode.classList.contains('first')){
                    document.getElementById("sk__impr").parentNode.classList.remove('first');
                }else{
                    if(document.getElementById("sk__impr").parentNode.classList.contains('act')){
                        document.getElementById("sk__impr").parentNode.classList.remove('act');
                        document.getElementById('gNsw').classList.remove('act');
                        bootloader.moving=false;
                        bootloader.imgFull=false;
                    }
                }
            }
            var respuestaImg = document.getElementById("nsw__impr");
            if (respuestaImg) {
                if(document.getElementById("nsw__impr").parentNode.classList.contains('first')){
                    document.getElementById("nsw__impr").parentNode.classList.remove('first');
                }else{
                    if(document.getElementById("nsw__impr").parentNode.classList.contains('act')){
                        document.getElementById("nsw__impr").parentNode.classList.remove('act');
                        document.getElementById('gNsw').classList.remove('act');
                        bootloader.moving=false;
                        bootloader.imgFull=false;
                    }
                }
            }
        }
        this.input.on('pointerdown', function (pointer) {    
            var preguntaImg = document.getElementById("sk__impr");
            if (preguntaImg) {
                if(document.getElementById("sk__impr").parentNode.classList.contains('act')){
                    document.getElementById("sk__impr").parentNode.classList.remove('act');
                    document.getElementById('gNsw').classList.remove('act');
                    bootloader.time.addEvent({
                        delay: 200,
                        callback: () => {
                            bootloader.moving=false;
                            bootloader.imgFull=false;
                        }
                    })
                }
            }
        
            var respuestaImg = document.getElementById("nsw__impr");
            if (respuestaImg) {
                if(document.getElementById("nsw__impr").parentNode.classList.contains('act')){
                    document.getElementById("nsw__impr").parentNode.classList.remove('act');
                    document.getElementById('gNsw').classList.remove('act');
                    bootloader.time.addEvent({
                        delay: 200,
                        callback: () => {
                            bootloader.moving=false;
                            bootloader.imgFull=false;
                        }
                    })
                }
            }
        });

        this.renderer.off(Phaser.Renderer.Events.RESIZE);
        this.renderer.on(Phaser.Renderer.Events.RESIZE, () => {
            resize(bootloader);
        });
    }

    setFullScreen() {
        //fullscrean
        document.getElementsByClassName('fsc__btn')[0].onclick = function () {
            if ((document.fullScreenElement !== undefined && document.fullScreenElement === null) || (document.msFullscreenElement !== undefined && document.msFullscreenElement === null) || (document.mozFullScreen !== undefined && !document.mozFullScreen) || (document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen)) {
                if (document.body.requestFullScreen) {
                    document.body.requestFullScreen();
                } else if (document.body.mozRequestFullScreen) {
                    document.body.mozRequestFullScreen();
                } else if (document.body.webkitRequestFullScreen) {
                    document.body.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
                } else if (document.body.msRequestFullscreen) {
                    document.body.msRequestFullscreen();
                }
                document.getElementById('gFsc').classList.add('act');
            } else {
                if (document.cancelFullScreen) {
                    document.cancelFullScreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
                document.getElementById('gFsc').classList.remove('act');
            } 
            bootloader.time.addEvent({
                delay: 200,
                callback: () => {
                    resize(bootloader);    
                }
            });
        }
    }

    iniciarJuego(bootloader) {
        //audio inicio
        if(db.sonidoJuego){ bootloader.intro.play({volume:0.3});}

        ///document.getElementById('gCntr').style.zIndex='';

        //tiempo
        // bootloader.tiempoInteraccion=0;
        bootloader.cuentaAtras = true;
        bootloader.timedEvent = bootloader.time.addEvent({ 
            delay: 1000, 
            callback: () => {
                if((db.vidasInfinitas || db.vidas>0) && !bootloader.finish){
                    if(db.pantallaFinal){
                        bootloader.timedEvent.destroy();
                        bootloader.commonTimedEvent.destroy();
                    }

                    // if(document.getElementById('exit').classList.contains('act')){
                    //     if(bootloader.tiempoInteraccion == 0){
                    //         setTimeout(()=>{
                    //             document.getElementById('exit').classList.remove('act');
                    //         }, 1500);
                    //     }
                    // }
                    // bootloader.tiempoInteraccion+=1;
                    
                    if((!bootloader.moving || bootloader.imgFull) && bootloader.cuentaAtras){
                        if(db.tieneTiempoPregunta){
                            // bootloader.tiempoPregunta-=1;
                            if(bootloader.tiempoPregunta==3){
                                if(db.sonidoJuego){ bootloader.countdown.play({volume: 0.3});}
                                document.getElementById('gClk').classList.add('act');
                            }
                        }
                    }

                    // if(!document.getElementById('exit').classList.contains('act')){
                    //     if(bootloader.tiempoInteraccion >= 5){
                    //         document.getElementById('exit').classList.add('act');
                    //     }
                    // }

                    if((db.tieneTiempoPregunta && bootloader.tiempoPregunta==0) && (!bootloader.moving || bootloader.imgFull)){
                        document.getElementById('gQstSkMedWp').classList.remove('act');
                        bootloader.moving = true;
                        //se acaba el tiempo de la pregunta
                        var actual='';
                        var contador=0;
                        bootloader.letras.getChildren().forEach(function (children) {
                            if(children.getChildByID('gPtfTr').classList.contains('wn') || children.getChildByID('gPtfTr').classList.contains('wrg') || children.getChildByID('gPtfTr').classList.contains('wrg1')){
                                actual+=children.name+bootloader.realSeparators[contador];
                            }else{
                                actual+='_'+bootloader.realSeparators[contador];
                            }
                            contador++;
                        });
                        db.data.r.push({
                            "s": 0,
                            "i": bootloader.ordenPreguntas[db.preguntaActual]-1,
                            "a": actual,
                        });
                        
                        vidaMenos(bootloader,1);
                    }
                }
            }, 
            callbackScope: bootloader, 
            repeat: -1,
        });

        // window.addEventListener('pointermove', () => {
        //     bootloader.tiempoInteraccion=0
        // });

        document.getElementById('exit').classList.add('act');

        document.getElementById('si__sndCtv_exit').addEventListener('click', function() {
            db.ventanaExit = 0;
            db.pantallaFinal=1;
            document.getElementById('modal__exit').classList.remove('act');
            
            //delete bootloader.teclas.ENTER;
            bootloader.reproduceAudio(bootloader.gameOver);
            //juego terminado
            document.getElementById('gQst').classList.remove('act');
            //ocultar interface
            document.body.classList.add("gmv");

            db.vidas = 0;

            db.data.m.s=0;
            if (db.puntos < 0) {
                db.puntos = 0;
            } else if (db.puntos > 100) {
                db.puntos = 100.000;
            }
            bootloader.scene.launch('Comun', { game: 'ordenarPalabras', db: db });
            document.body.classList.remove('act'); 
        });
        
        document.getElementById('qst__wp__nav__lft').style.display='none';
        document.getElementById('qst__wp__nav__rght').style.display='none';

        siguientePregunta(bootloader,1);
    }
}

const siguientePregunta = (bootloader,inicio) => {
    if(document.getElementById('gClk').classList.contains('act')){
        document.getElementById('gClk').classList.remove('act');
    }
    bootloader.textoEscrito='';
    bootloader.inicioTextoEscrito=0;
    db.letraActual=0;
    //pasamos de pregunta
    if(!inicio) {
        if(!bootloader.pasarPregunta){
            db.preguntaActual++;
        }
        bootloader.pasarPregunta=0;
        
        for(var i=bootloader.auxLetras.getChildren().length-1; i>=0; i--){
            bootloader.auxLetras.getChildren()[i].destroy();
        }
        bootloader.letras.getChildren().forEach(function (child) {
            child.setAlpha(0);
        });  
        bootloader.groupSeparators.getChildren().forEach(function (child) {
            child.setAlpha(0);
        });      
        for(var i=bootloader.letras.getChildren().length-1; i>=0; i--){
            bootloader.letras.getChildren()[i].destroy();
        }
        for(var i=bootloader.groupSeparators.getChildren().length-1; i>=0; i--){
            bootloader.groupSeparators.getChildren()[i].destroy();
        }

        bootloader.input.off(Phaser.Input.Events.DRAG_START);
        bootloader.input.off(Phaser.Input.Events.DRAG);
        bootloader.input.off(Phaser.Input.Events.DRAG_END);
        bootloader.input.off(Phaser.Input.Events.DRAG_ENTER);
        bootloader.input.off(Phaser.Input.Events.DRAG_LEAVE);
        bootloader.input.off(Phaser.Input.Events.DROP);
    }

    //comprobar si la pregunta ya esta respondida
    var yaCorrecta=false;
    if(bootloader.preguntasCorrectas.includes(db.preguntaActual + 1)){
        yaCorrecta=true;
    }

    bootloader.letrasSolas=0;
    bootloader.letras = bootloader.add.group();
    bootloader.auxLetras = bootloader.add.group();
    bootloader.groupSeparators = bootloader.add.group();
    // document.getElementById('exit').classList.remove('act');

    incluirTexto(db.preguntas[bootloader.ordenPreguntas[db.preguntaActual]-1].pregunta,document.getElementById('gQstSk'),document.getElementById('gQstSkMedWp'),'pregunta',bootloader);
    //modificar el tamaño de gQstSkMedWp
    document.getElementById('gQstSkMedWp').style.width=String(document.getElementById('gQstSkMed').getBoundingClientRect().height * 16 / 9)+'px'; 

    if(!isNaN(db.preguntas[bootloader.ordenPreguntas[db.preguntaActual]-1].tiempo)){
        bootloader.tiempoPregunta = bootloader.tiempoPreguntaOriginal = db.preguntas[bootloader.ordenPreguntas[db.preguntaActual]-1].tiempo;
    }else{
        bootloader.tiempoPregunta = bootloader.tiempoPreguntaOriginal = db.tiempoPregunta;
    }
    document.getElementById('gClkQstNr').innerHTML = Math.round(bootloader.tiempoPregunta);
    bootloader.setProgress(0);

    document.getElementById('gQstNr').innerHTML = db.preguntaActual + 1;
    document.getElementById('gQstNrLl').innerHTML = db.preguntasMaximasReal;

    bootloader.realSeparators = Array();
    bootloader.separatorsInWord = Array();
    bootloader.separatorsInWordReal = Array();
    bootloader.ordenRespuestasAux = Array();
    bootloader.fraseArray=Array();
    bootloader.separatorInicial=0;
    var ultimoI=0;
    var contadorReal=0;
    for (var i = 0; i < db.preguntas[bootloader.ordenPreguntas[db.preguntaActual]-1].respuesta.texto.length; i++) {
        if(db.separators.includes(db.preguntas[bootloader.ordenPreguntas[db.preguntaActual]-1].respuesta.texto.charAt(i))){
            if(db.preguntas[bootloader.ordenPreguntas[db.preguntaActual]-1].respuesta.texto.substring(ultimoI,i)!=''){
                bootloader.fraseArray[contadorReal]=db.preguntas[bootloader.ordenPreguntas[db.preguntaActual]-1].respuesta.texto.substring(ultimoI,i);
                bootloader.ordenRespuestasAux[contadorReal]=db.preguntas[bootloader.ordenPreguntas[db.preguntaActual]-1].respuesta.texto.substring(ultimoI,i);
                var auxI=i;
                var sumarI=0;
                var realSeparator=db.preguntas[bootloader.ordenPreguntas[db.preguntaActual]-1].respuesta.texto.charAt(i);
                while(db.separators.includes(db.preguntas[bootloader.ordenPreguntas[db.preguntaActual]-1].respuesta.texto.charAt(auxI+1))){
                    realSeparator = realSeparator.concat(db.preguntas[bootloader.ordenPreguntas[db.preguntaActual]-1].respuesta.texto.charAt(auxI+1));                
                    auxI++;
                    i++;
                    if(db.separators.includes(db.preguntas[bootloader.ordenPreguntas[db.preguntaActual]-1].respuesta.texto.charAt(auxI+1))){
                        sumarI++;
                    }
                }
                if(sumarI==0){sumarI++;}
                bootloader.realSeparators[contadorReal]=realSeparator;
                ultimoI=i+sumarI;
                contadorReal++;
            }else{
                if(i==0){ bootloader.separatorInicial=1; }
                ultimoI++;
            }
        }
        
        if(db.preguntas[bootloader.ordenPreguntas[db.preguntaActual]-1].respuesta.texto.charAt(i)=='\n'){
            if(!db.separators.includes(db.preguntas[bootloader.ordenPreguntas[db.preguntaActual]-1].respuesta.texto.charAt(i-1))){
                bootloader.fraseArray[contadorReal]=db.preguntas[bootloader.ordenPreguntas[db.preguntaActual]-1].respuesta.texto.substring(ultimoI,i);
                bootloader.ordenRespuestasAux[contadorReal]=db.preguntas[bootloader.ordenPreguntas[db.preguntaActual]-1].respuesta.texto.substring(ultimoI,i);
                bootloader.realSeparators[contadorReal]=' ';
                contadorReal++;
            }
            i++;
            var realSeparator='';
            while(db.separators.includes(db.preguntas[bootloader.ordenPreguntas[db.preguntaActual]-1].respuesta.texto.charAt(i))){
                realSeparator = realSeparator.concat(db.preguntas[bootloader.ordenPreguntas[db.preguntaActual]-1].respuesta.texto.charAt(i));                
                i++;
            }
            ultimoI=i;
            bootloader.separatorsInWord.push(contadorReal);
            bootloader.separatorsInWordReal.push(realSeparator);
        } 
    }
    if(!db.separators.includes(db.preguntas[bootloader.ordenPreguntas[db.preguntaActual]-1].respuesta.texto.substring(ultimoI)) && db.preguntas[bootloader.ordenPreguntas[db.preguntaActual]-1].respuesta.texto.substring(ultimoI)!=''){
        bootloader.fraseArray[contadorReal]=db.preguntas[bootloader.ordenPreguntas[db.preguntaActual]-1].respuesta.texto.substring(ultimoI);
        bootloader.ordenRespuestasAux[contadorReal]=db.preguntas[bootloader.ordenPreguntas[db.preguntaActual]-1].respuesta.texto.substring(ultimoI);
        bootloader.realSeparators[contadorReal]=' ';
    }

    
    if(typeof bootloader.preguntasEmpezadas[db.preguntaActual + 1] !== 'undefined'){
        bootloader.ordenRespuestasAux=bootloader.preguntasEmpezadas[db.preguntaActual + 1];
    }else{
        if(bootloader.separatorsInWord.length){
            //donde deben estar los espacios despues de elimarlos
            var anterior=0;
            var nuevoArray=Array();
            var separatorI=0;
            for (var i = 0; i < bootloader.separatorsInWord.length; i++) {
                //bootloader.separatorsInWord[i]=bootloader.separatorsInWord[i]-i;
                var auxDesordenar = bootloader.ordenRespuestasAux.splice(0,bootloader.separatorsInWord[i]-anterior);
                var correcto='';
                for (var j = 0; j < auxDesordenar.length; j++) {
                    correcto+=auxDesordenar[j]+bootloader.realSeparators[separatorI].charAt(0);
                    separatorI++;
                }
                correcto = correcto.substring(0, correcto.length - 1);
                if(!yaCorrecta){
                    auxDesordenar = auxDesordenar.sort(function() {return Math.random() - 0.5});
                    while(!comprobarPalabrasDesordenadas(auxDesordenar, correcto)){
                        auxDesordenar = auxDesordenar.sort(function() {return Math.random() - 0.5});
                    }
                }
                nuevoArray = nuevoArray.concat(auxDesordenar);
                anterior = bootloader.separatorsInWord[i];
            }

            var correcto='';
            for (var j = 0; j < bootloader.ordenRespuestasAux.length; j++) {
                correcto+=bootloader.ordenRespuestasAux[j]+bootloader.realSeparators[separatorI].charAt(0);
                separatorI++;
            }
            correcto = correcto.substring(0, correcto.length - 1);
            if(!yaCorrecta){
                bootloader.ordenRespuestasAux = bootloader.ordenRespuestasAux.sort(function() {return Math.random() - 0.5});
                while(!comprobarPalabrasDesordenadas(bootloader.ordenRespuestasAux, correcto)){
                    bootloader.ordenRespuestasAux = bootloader.ordenRespuestasAux.sort(function() {return Math.random() - 0.5});
                }
            }
            bootloader.ordenRespuestasAux = nuevoArray.concat(bootloader.ordenRespuestasAux);   
        }else{
            if(!yaCorrecta){
                bootloader.ordenRespuestasAux = bootloader.ordenRespuestasAux.sort(function() {return Math.random() - 0.5});
                while(!comprobarPalabrasDesordenadas(bootloader.ordenRespuestasAux, db.preguntas[bootloader.ordenPreguntas[db.preguntaActual]-1].respuesta.texto)){
                    bootloader.ordenRespuestasAux = bootloader.ordenRespuestasAux.sort(function() {return Math.random() - 0.5});
                }
            }
        }
    }
    var contador=0;
    bootloader.ordenRespuestasAux.forEach(element => {
        contador+=element.length;
    });
    //separadores
    bootloader.realSeparators.forEach(element => {
        contador+=element.length;
    });
    //saltos de linea
    contador+=bootloader.separatorsInWord.length

    var clase = 'g__ol__wp';
    var claseSp = 'g__ol__sp';
    if(contador>300){
        clase = clase.concat('--xs');
        claseSp = claseSp.concat('--xs');
    }else if(contador>200){
        clase = clase.concat('--s');
        claseSp = claseSp.concat('--s');
    }else if(contador>150){
        clase = clase.concat('--m');
        claseSp = claseSp.concat('--m');
    }else if(contador>100){
        clase = clase.concat('--l');
        claseSp = claseSp.concat('--l');
    }else if(contador>50){
        clase = clase.concat('--xl');
        claseSp = claseSp.concat('--xl');
    }else if(contador>25){
        clase = clase.concat('--xxl');
        claseSp = claseSp.concat('--xxl');
    }else {
        clase = clase.concat('--xxxl');
        claseSp = claseSp.concat('--xxxl');
    }
    var palabra=0;
    var encontrado=0;
    var ponerAct=0;
    var letraEnPalabra=0;
    var contadorSeparators = 0;
    var separatorsInWordCount=0;
    if(document.getElementById('gCj').classList.contains('flld')){
        document.getElementById('gCj').classList.remove('flld');
    }
    document.getElementById('gCj').style.display='';
    document.getElementById('gCj').innerHTML='';
    var child = document.createElement('div');
    child.setAttribute('class', 'g__cj__plb'); 
    document.getElementById('gCj').appendChild(child);
    for (var i = 0; i < bootloader.ordenRespuestasAux.length; i++) {
        if(i==0 && bootloader.separatorInicial){
            var child = document.createElement('div');
            child.setAttribute('class', 'g__ol__sp '+claseSp); 
            var j=1;
            var separatorReal=db.preguntas[bootloader.ordenPreguntas[db.preguntaActual]-1].respuesta.texto.charAt(0);
            while(db.separators.includes(db.preguntas[bootloader.ordenPreguntas[db.preguntaActual]-1].respuesta.texto.charAt(j))){
                separatorReal=separatorReal.concat(db.preguntas[bootloader.ordenPreguntas[db.preguntaActual]-1].respuesta.texto.charAt(j));
                j++;
            }
            child.innerHTML='<span>'+bootloader.toHTML(separatorReal)+'</span>';
            document.getElementById('gCj').getElementsByClassName('g__cj__plb')[palabra].appendChild(child);
        }

        if(bootloader.separatorsInWord.includes(i)){
            if(db.preguntas[bootloader.ordenPreguntas[db.preguntaActual]-1].respuesta.texto.charAt(i + contadorSeparators) != ' '){
                var child = document.createElement('div');
                child.setAttribute('class', 'g__ol__sp '+claseSp); 
                child.innerHTML='<span></span>';
                document.getElementById('gCj').getElementsByClassName('g__cj__plb')[palabra].appendChild(child);
            }

            var child = document.createElement('div');
            child.setAttribute('class', 'g__cj__plb'); 
            document.getElementById('gCj').appendChild(child);
            palabra++;
            contadorSeparators++;

            if(bootloader.separatorsInWordReal[separatorsInWordCount]!=''){
                var child = document.createElement('div');
                child.setAttribute('class', 'g__ol__sp '+claseSp); 
                child.innerHTML='<span>'+bootloader.toHTML(bootloader.separatorsInWordReal[separatorsInWordCount])+'</span>';
                document.getElementById('gCj').getElementsByClassName('g__cj__plb')[palabra].appendChild(child);
                separatorsInWordCount++;
            }
        }

        var child = document.createElement('div');
        child.classList.add('g__ol__wp');
        child.classList.add(clase); 
        child.innerHTML='<span>'+bootloader.toHTML(bootloader.ordenRespuestasAux[i])+'</span>';
        document.getElementById('gCj').getElementsByClassName('g__cj__plb')[palabra].appendChild(child);

        if(bootloader.realSeparators[i] != ' '){
            var child = document.createElement('div');
            child.setAttribute('class', 'g__ol__sp '+claseSp); 
            child.innerHTML='<span>'+bootloader.toHTML(bootloader.realSeparators[i])+'</span>';
            document.getElementById('gCj').getElementsByClassName('g__cj__plb')[palabra].appendChild(child);
        }
    }
    palabra=0;
    contadorSeparators = 0;
    for (var i = 0; i < bootloader.ordenRespuestasAux.length; i++) {
        if(bootloader.separatorsInWord.includes(i)){
            palabra++;
            letraEnPalabra=0;
            contadorSeparators++;
        }
        
        var hijo=document.getElementById('gCj').getElementsByClassName('g__cj__plb')[palabra].getElementsByClassName('g__ol__wp')[letraEnPalabra];
        letraEnPalabra++;

        if(contador>300){
            var aux = bootloader.add.dom(hijo.getBoundingClientRect().x + hijo.getBoundingClientRect().width / 2, hijo.getBoundingClientRect().y + hijo.getBoundingClientRect().height / 2).createFromCache('letraxs').setOrigin(0.5, 0.5).setAlpha(0);
            var auxGhost = bootloader.add.dom(hijo.getBoundingClientRect().x + hijo.getBoundingClientRect().width / 2, hijo.getBoundingClientRect().y + hijo.getBoundingClientRect().height / 2).createFromCache('letraxs').setOrigin(0.5, 0.5).setAlpha(0);
        }else if(contador>200){
            var aux = bootloader.add.dom(hijo.getBoundingClientRect().x + hijo.getBoundingClientRect().width / 2, hijo.getBoundingClientRect().y + hijo.getBoundingClientRect().height / 2).createFromCache('letras').setOrigin(0.5, 0.5).setAlpha(0);
            var auxGhost = bootloader.add.dom(hijo.getBoundingClientRect().x + hijo.getBoundingClientRect().width / 2, hijo.getBoundingClientRect().y + hijo.getBoundingClientRect().height / 2).createFromCache('letras').setOrigin(0.5, 0.5).setAlpha(0);
        }else if(contador>150){
            var aux = bootloader.add.dom(hijo.getBoundingClientRect().x + hijo.getBoundingClientRect().width / 2, hijo.getBoundingClientRect().y + hijo.getBoundingClientRect().height / 2).createFromCache('letram').setOrigin(0.5, 0.5).setAlpha(0);
            var auxGhost = bootloader.add.dom(hijo.getBoundingClientRect().x + hijo.getBoundingClientRect().width / 2, hijo.getBoundingClientRect().y + hijo.getBoundingClientRect().height / 2).createFromCache('letram').setOrigin(0.5, 0.5).setAlpha(0);
        }else if(contador>100){
            var aux = bootloader.add.dom(hijo.getBoundingClientRect().x + hijo.getBoundingClientRect().width / 2, hijo.getBoundingClientRect().y + hijo.getBoundingClientRect().height / 2).createFromCache('letral').setOrigin(0.5, 0.5).setAlpha(0);
            var auxGhost = bootloader.add.dom(hijo.getBoundingClientRect().x + hijo.getBoundingClientRect().width / 2, hijo.getBoundingClientRect().y + hijo.getBoundingClientRect().height / 2).createFromCache('letral').setOrigin(0.5, 0.5).setAlpha(0);
        }else if(contador>50){
            var aux = bootloader.add.dom(hijo.getBoundingClientRect().x + hijo.getBoundingClientRect().width / 2, hijo.getBoundingClientRect().y + hijo.getBoundingClientRect().height / 2).createFromCache('letraxl').setOrigin(0.5, 0.5).setAlpha(0);
            var auxGhost = bootloader.add.dom(hijo.getBoundingClientRect().x + hijo.getBoundingClientRect().width / 2, hijo.getBoundingClientRect().y + hijo.getBoundingClientRect().height / 2).createFromCache('letraxl').setOrigin(0.5, 0.5).setAlpha(0);
        }else if(contador>25){
            var aux = bootloader.add.dom(hijo.getBoundingClientRect().x + hijo.getBoundingClientRect().width / 2, hijo.getBoundingClientRect().y + hijo.getBoundingClientRect().height / 2).createFromCache('letraxxl').setOrigin(0.5, 0.5).setAlpha(0);
            var auxGhost = bootloader.add.dom(hijo.getBoundingClientRect().x + hijo.getBoundingClientRect().width / 2, hijo.getBoundingClientRect().y + hijo.getBoundingClientRect().height / 2).createFromCache('letraxxl').setOrigin(0.5, 0.5).setAlpha(0);
        }else {
            var aux = bootloader.add.dom(hijo.getBoundingClientRect().x + hijo.getBoundingClientRect().width / 2, hijo.getBoundingClientRect().y + hijo.getBoundingClientRect().height / 2).createFromCache('letraxxxl').setOrigin(0.5, 0.5).setAlpha(0);
            var auxGhost  = bootloader.add.dom(hijo.getBoundingClientRect().x + hijo.getBoundingClientRect().width / 2, hijo.getBoundingClientRect().y + hijo.getBoundingClientRect().height / 2).createFromCache('letraxxxl').setOrigin(0.5, 0.5).setAlpha(0);
        }
        aux.getChildByID('gPtfTr').style.width=hijo.getBoundingClientRect().width+'px';
        auxGhost.getChildByID('gPtfTr').style.width=hijo.getBoundingClientRect().width+'px';
        aux.name=bootloader.ordenRespuestasAux[i];
        aux.data = new Phaser.Data.DataManager(aux);
        aux.data.set('ordenPalabra',letraEnPalabra-1 );
        aux.data.set('orden',i );
        aux.data.set('palabra',palabra);
        aux.data.set('correct',0);
        aux.data.set('intent',0);

        var letraYaCorrecta=false;
        if(letraEnPalabra==1 && (bootloader.separatorsInWord.includes(i+1) || i==bootloader.ordenRespuestasAux.length-1)){
            aux.getChildByID('gPtfTr').classList.add('non');
            aux.data.set('notCount',1);
            bootloader.letrasSolas++;
            letraYaCorrecta=true;
            aux.setInteractive({cursor: 'pointer'});
            aux.on('pointerup', function (pointer) {
                if(db.sonidoJuego){ bootloader.blank.play({volume:1});}
            });
        }else{
            aux.data.set('notCount',0);
        }

        
        if(typeof bootloader.preguntasEmpezadas[db.preguntaActual + 1] !== 'undefined'){
            if(bootloader.ordenRespuestasAux[i]==db.preguntas[bootloader.ordenPreguntas[db.preguntaActual]-1].respuesta.texto.replace(db.replaceSeparators, "").charAt(i)){
                aux.data.set('correct',1);
                aux.getChildByID('gPtfTr').classList.add('end');
                letraYaCorrecta=true;
            }else{
                if(encontrado==0){
                    if(!bootloader.separatorsInWord.includes(i+1)){
                        db.letraActual=i;
                        aux.getChildByID('gPtfTr').classList.add('act');
                        encontrado=1;
                    }
                }
            }
        }
        aux.getChildByID('gPtfTr').innerHTML='<span>'+bootloader.toHTML(bootloader.ordenRespuestasAux[i])+'</span>';
        auxGhost.setDepth(1);
        auxGhost.getChildByID('gPtfTr').innerHTML='<span>'+bootloader.toHTML(bootloader.ordenRespuestasAux[i])+'</span>';
        auxGhost.getChildByID('gPtfTr').classList.add('tgl');
        bootloader.auxLetras.add(auxGhost);
        if(!yaCorrecta && !letraYaCorrecta){
            aux.setInteractive({cursor: 'pointer'});
            aux.input.dropZone = true;

            if(!ponerAct && !bootloader.separatorsInWord.includes(i+1)){
                aux.getChildByID('gPtfTr').classList.add('act');
                db.letraActual=i;
                ponerAct=1;
            }
            bootloader.input.setDraggable(aux);
        }

        bootloader.letras.add(aux);
        if(!yaCorrecta && !letraYaCorrecta){
            aux.on('pointerup', function (pointer) {
                bootloader.tiempoInteraccion=0;
                if((pointer.upTime - pointer.downTime) < 500 && !bootloader.notPoint && !bootloader.moving && !db.ventanaExit){
                    if(db.letraActual!=this.data.get('orden') ){
                        var dropzone = bootloader.letras.getChildren().find(v => v.data.get('orden') == db.letraActual);
                        if(this.data.get('palabra')==dropzone.data.get('palabra')){
                            //efecto visual cambio de piezas
                            efectoVisualCambio(this,dropzone,bootloader);
                        }else{
                            //if(db.sonidoJuego){ bootloader.blank.play({volume:1});}
                            var hijoClic = this;
                            var encontradoDrop=false;
                            bootloader.letras.getChildren().forEach(function (child) {
                                if(!encontradoDrop && hijoClic.data.get('palabra')==child.data.get('palabra') && !child.data.get('correct')){
                                    db.letraActual=child.data.get('orden');
                                    encontradoDrop=true;
                                }
                            });
                            dropzone = bootloader.letras.getChildren().find(v => v.data.get('orden') == db.letraActual);
                            //efecto visual cambio de piezas
                            efectoVisualCambio(this,dropzone,bootloader);
                        }
                    }else if(db.letraActual==this.data.get('orden')){
                        //caso especial la letras actual es la que corresponde pero no esta en verde y se pulsa
                        if(this.name==db.preguntas[bootloader.ordenPreguntas[db.preguntaActual]-1].respuesta.texto.replace(db.replaceSeparators, "").charAt(db.letraActual)){
                            //solamente si es la correcta
                            var dropzone = bootloader.letras.getChildren().find(v => v.data.get('orden') == db.letraActual);
                            cambiarPalabras(this,dropzone,bootloader);
                        }
                    }
                }   
                bootloader.notPoint=0;         
            });

            aux.on('pointerover', function (pointer) {
                bootloader.tiempoInteraccion=0;
                this.getChildByID('gPtfTr').classList.add('hvr');
                if(!bootloader.isDrag && db.sonidoJuego){ bootloader.mouseHover.play({volume:0.5});}
            });

            aux.on('pointerout', function (pointer) {
                bootloader.tiempoInteraccion=0;
                this.getChildByID('gPtfTr').classList.remove('hvr');
            });
        }else{
            if(!aux.getChildByID('gPtfTr').classList.contains('non')){
                aux.getChildByID('gPtfTr').classList.add('end');
            }
        }
    }


    //añadir a los padres que se crean automaticamente g__ol
    for(var a=0;a<document.getElementById('gCntr').childNodes[0].childNodes.length;a++){
        if(document.getElementById('gCntr').childNodes[0].childNodes[a].childNodes[0].classList.contains('tgl')){
            document.getElementById('gCntr').childNodes[0].childNodes[a].classList.add('g__ol-ghst');
        }else{
            document.getElementById('gCntr').childNodes[0].childNodes[a].classList.add('g__ol');
        }
    }

    var delay=200;
    bootloader.letras.getChildren().forEach(function (child) {
        bootloader.time.addEvent({
            delay: delay,
            callback: ()=>{
                child.setAlpha(1);
                if(db.sonidoJuego){ bootloader.cargarLetra.play({volume:0.5});}
            }
        }); 
        delay+=60; 
    });
    if(document.getElementById('gCj').classList.contains('out')){
        document.getElementById('gCj').classList.remove('out');
    }

    bootloader.auxLetras.getChildren().forEach(function (child) {
        child.setAlpha(1);
        child.setAlpha(0);
    });
    
    bootloader.notPoint=0;
    
    if(!yaCorrecta){
        bootloader.input.on(Phaser.Input.Events.DRAG_START,(pointer, obj, dragX, dragY) => {   
            bootloader.input.manager.setCursor({ cursor: 'grabbing' }); 
            bootloader.input.setDefaultCursor("grabbing");

            var first=true;
            bootloader.letras.getChildren().forEach(function (child) {
                if(child.data.get('palabra')==obj.data.get('palabra') && child.data.get('orden')!=obj.data.get('orden')){
                    if(first){
                        if(!child.getChildByID('gPtfTr').classList.contains('frst')){
                            child.getChildByID('gPtfTr').classList.add('frst');
                        }
                        first=false;  
                    }
                    if(!child.getChildByID('gPtfTr').classList.contains('wn')){
                        child.getChildByID('gPtfTr').classList.add('pss');
                    }
                }
                if(child.getChildByID('gPtfTr').classList.contains('wrg')){
                    child.getChildByID('gPtfTr').classList.remove('wrg');
                }
                if(child.getChildByID('gPtfTr').classList.contains('wrg1')){
                    child.getChildByID('gPtfTr').classList.remove('wrg1');
                }
            });

            bootloader.time.addEvent({
                delay: 200,
                callback: ()=>{
                    if(bootloader.isDrag){
                        document.getElementById('gCj').getElementsByClassName('g__cj__plb')[obj.data.get('palabra')].classList.add('act');
                    }
                }
            });
        
            bootloader.isDrag=1;
            bootloader.tiempoInteraccion=0;
            obj.setDepth(2);
            obj.input.dropZone = false;

            obj.getChildByID('gPtfTr').classList.add('drg');
            if(obj.getChildByID('gPtfTr').classList.contains('wrg')){
                obj.getChildByID('gPtfTr').classList.remove('wrg');
            }
            if(obj.getChildByID('gPtfTr').classList.contains('wrg1')){
                obj.getChildByID('gPtfTr').classList.remove('wrg1');
            }
            if(obj.data.get('orden')==db.letraActual){
                if(obj.getChildByID('gPtfTr').classList.contains('act')){
                    obj.getChildByID('gPtfTr').classList.remove('act');
                }
            }
        });
        bootloader.input.on(Phaser.Input.Events.DRAG,(pointer, obj, dragX, dragY) => {
             bootloader.tiempoInteraccion=0;
             if(typeof bootloader.dropZone!=='undefined'){
                 obj.x=bootloader.dropZone.x;
                 obj.y=bootloader.dropZone.y;
                 bootloader.dropZone.setAlpha(0);
             }else{
                 obj.x=dragX;
                 obj.y=dragY;
             }
            
         });
        bootloader.input.on(Phaser.Input.Events.DRAG_END,(pointer, obj, dropzone) => {
            if(typeof bootloader.timePostCambio !== 'undefined') {
                bootloader.timePostCambio.destroy();
            }else{
                if(typeof bootloader.timePrevCambio !== 'undefined') {bootloader.timePrevCambio.destroy();}
            }
            bootloader.input.setDefaultCursor("auto");
            bootloader.letras.getChildren().forEach(function (child) {
                if(child.getChildByID('gPtfTr').classList.contains('pss')){
                    child.getChildByID('gPtfTr').classList.remove('pss');
                }
                if(child.getChildByID('gPtfTr').classList.contains('frst')){
                    child.getChildByID('gPtfTr').classList.remove('frst');
                }
            });
            document.getElementById('gCj').getElementsByClassName('g__cj__plb')[obj.data.get('palabra')].classList.remove('act');

            bootloader.dropZone=undefined;
            bootloader.isDrag=0;
            bootloader.tiempoInteraccion=0;
            if(!dropzone){
                obj.x=obj.input.dragStartX;
                obj.y=obj.input.dragStartY;
                if(obj.data.get('orden')==db.letraActual){
                    obj.getChildByID('gPtfTr').classList.add('act');
                }
            }else{
                obj.x=obj.input.dragStartX;
                obj.y=obj.input.dragStartY;
            }
            obj.getChildByID('gPtfTr').classList.remove('drg');
            obj.setDepth(1);
            obj.input.dropZone = true;
            bootloader.notPoint=1;
            bootloader.time.addEvent({
                delay: 10,
                callback: ()=>{
                    bootloader.notPoint=0;
                }
            });
        });
        bootloader.input.on(Phaser.Input.Events.DRAG_ENTER,(pointer, obj, dropzone) => {
            if(obj!=dropzone){
                bootloader.notPoint=1;
                bootloader.tiempoInteraccion=0;
                if(obj.data.get('palabra')==dropzone.data.get('palabra')){
                    bootloader.timePrevCambio = bootloader.time.addEvent({
                        delay: 200,
                        callback: ()=>{
                            document.getElementById('gCj').getElementsByClassName('g__cj__plb')[obj.data.get('palabra')].getElementsByClassName('g__ol__wp')[obj.data.get('ordenPalabra')].innerHTML='<span>'+bootloader.toHTML(dropzone.name)+'</span>';
                            document.getElementById('gCj').getElementsByClassName('g__cj__plb')[dropzone.data.get('palabra')].getElementsByClassName('g__ol__wp')[dropzone.data.get('ordenPalabra')].innerHTML='<span>'+bootloader.toHTML(obj.name)+'</span>';

                            var palabra=0;
                            var letraEnPalabra=0;
                            for (var i = 0; i < bootloader.ordenRespuestasAux.length; i++) {
                                if(bootloader.separatorsInWord.includes(i)){
                                    palabra++;
                                    letraEnPalabra=0;
                                }
                                var hijo=document.getElementById('gCj').getElementsByClassName('g__cj__plb')[palabra].getElementsByClassName('g__ol__wp')[letraEnPalabra];
                                letraEnPalabra++;
                                bootloader.letras.getChildren()[i].x=hijo.getBoundingClientRect().x + hijo.getBoundingClientRect().width / 2;
                                bootloader.letras.getChildren()[i].y=hijo.getBoundingClientRect().y + hijo.getBoundingClientRect().height / 2;
                                bootloader.auxLetras.getChildren()[i].x=hijo.getBoundingClientRect().x + hijo.getBoundingClientRect().width / 2;
                                bootloader.auxLetras.getChildren()[i].y=hijo.getBoundingClientRect().y + hijo.getBoundingClientRect().height / 2;
                            }

                            bootloader.dropZone=dropzone;
                            obj.getChildByID('gPtfTr').classList.add('mgn');

                            if(db.sonidoJuego){ bootloader.moverLetra.play({volume:1});}
                            if(dropzone.getChildByID('gPtfTr').classList.contains('wrg')){
                                dropzone.getChildByID('gPtfTr').classList.remove('wrg');
                            }
                            if(dropzone.getChildByID('gPtfTr').classList.contains('wrg1')){
                                dropzone.getChildByID('gPtfTr').classList.remove('wrg1');
                            }
                            if(dropzone.getChildByID('gPtfTr').classList.contains('wrg2')){
                                dropzone.getChildByID('gPtfTr').classList.remove('wrg2');
                            }

                            bootloader.auxLetras.getChildren()[dropzone.data.get('orden')].getChildByID('gPtfTr').innerHTML='<span>'+bootloader.toHTML(dropzone.name)+'</span>';
                            obj.x=dropzone.x;
                            obj.y=dropzone.y;
                            dropzone.setAlpha(0);
                            bootloader.tween = bootloader.tweens.add({
                                targets: [bootloader.auxLetras.getChildren()[dropzone.data.get('orden')]],
                                alpha: 1,
                                duration: 100
                            });

                            bootloader.timeTgl = bootloader.time.addEvent({
                                delay: 100,
                                callback: ()=>{
                                    var hijo=document.getElementById('gCj').getElementsByClassName('g__cj__plb')[obj.data.get('palabra')].getElementsByClassName('g__ol__wp')[obj.data.get('ordenPalabra')]; 
                                    bootloader.auxLetras.getChildren()[dropzone.data.get('orden')].x=hijo.getBoundingClientRect().x + hijo.getBoundingClientRect().width / 2;
                                    bootloader.auxLetras.getChildren()[dropzone.data.get('orden')].y=hijo.getBoundingClientRect().y + hijo.getBoundingClientRect().height / 2;
                                    bootloader.auxLetras.getChildren()[dropzone.data.get('orden')].getChildByID('gPtfTr').classList.remove('tgl');
                                    bootloader.auxLetras.getChildren()[dropzone.data.get('orden')].getChildByID('gPtfTr').classList.add('tglB');
                                    bootloader.timeTgl2 = bootloader.time.addEvent({
                                        delay: 200,
                                        callback: ()=>{
                                            bootloader.auxLetras.getChildren()[dropzone.data.get('orden')].getChildByID('gPtfTr').classList.add('tglmng');
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            }
        });
        bootloader.input.on(Phaser.Input.Events.DRAG_LEAVE,(pointer, obj, dropzone) => {
            if(obj!=dropzone){
                bootloader.notPoint=0;
                bootloader.tiempoInteraccion=0;
                if(obj.data.get('palabra')==dropzone.data.get('palabra')){
                    /*bootloader.timePostCambio = bootloader.time.addEvent({
                        delay: 10,
                        callback: ()=>{*/
                            if(typeof bootloader.timePrevCambio !== 'undefined') {bootloader.timePrevCambio.destroy();}
                            document.getElementById('gCj').getElementsByClassName('g__cj__plb')[obj.data.get('palabra')].getElementsByClassName('g__ol__wp')[obj.data.get('ordenPalabra')].innerHTML='<span>'+bootloader.toHTML(obj.name)+'</span>';
                            document.getElementById('gCj').getElementsByClassName('g__cj__plb')[dropzone.data.get('palabra')].getElementsByClassName('g__ol__wp')[dropzone.data.get('ordenPalabra')].innerHTML='<span>'+bootloader.toHTML(dropzone.name)+'</span>';
                            var palabra=0;
                            var letraEnPalabra=0;
                            for (var i = 0; i < bootloader.ordenRespuestasAux.length; i++) {
                                if(bootloader.separatorsInWord.includes(i)){
                                    palabra++;
                                    letraEnPalabra=0;
                                }
                                
                                var hijo=document.getElementById('gCj').getElementsByClassName('g__cj__plb')[palabra].getElementsByClassName('g__ol__wp')[letraEnPalabra];
                                letraEnPalabra++;
                                bootloader.letras.getChildren()[i].x=hijo.getBoundingClientRect().x + hijo.getBoundingClientRect().width / 2;
                                bootloader.letras.getChildren()[i].y=hijo.getBoundingClientRect().y + hijo.getBoundingClientRect().height / 2;
                                bootloader.auxLetras.getChildren()[i].x=hijo.getBoundingClientRect().x + hijo.getBoundingClientRect().width / 2;
                                bootloader.auxLetras.getChildren()[i].y=hijo.getBoundingClientRect().y + hijo.getBoundingClientRect().height / 2;
                            }


                            bootloader.dropZone=undefined;
                            obj.getChildByID('gPtfTr').classList.remove('mgn');
                            if(db.sonidoJuego){ bootloader.moverLetra.play({volume:1});}
                            
                            if(typeof bootloader.timeTgl !== 'undefined') {bootloader.timeTgl.destroy();}
                            if(typeof bootloader.timeTgl2 !== 'undefined') {bootloader.timeTgl2.destroy();}

                            bootloader.auxLetras.getChildren()[dropzone.data.get('orden')].x=dropzone.x;
                            bootloader.auxLetras.getChildren()[dropzone.data.get('orden')].y=dropzone.y;
                            bootloader.auxLetras.getChildren()[dropzone.data.get('orden')].getChildByID('gPtfTr').classList.remove('tglmng');


                            bootloader.time.addEvent({
                                delay: 200,
                                callback: ()=>{
                                    bootloader.auxLetras.getChildren()[dropzone.data.get('orden')].setAlpha(0);
                                    bootloader.auxLetras.getChildren()[dropzone.data.get('orden')].getChildByID('gPtfTr').classList.remove('tglB');
                                    bootloader.auxLetras.getChildren()[dropzone.data.get('orden')].getChildByID('gPtfTr').classList.add('tgl');
                                    dropzone.setAlpha(1);
                                }
                            });  
                        /*}    
                    });*/
                }
            }
        });
        bootloader.input.on(Phaser.Input.Events.DROP,(pointer, obj, dropzone) => {
            bootloader.tiempoInteraccion=0;
            if(obj.data.get('palabra')==dropzone.data.get('palabra')){
                if(typeof bootloader.timePrevCambio !== 'undefined') {bootloader.timePrevCambio.destroy();}
                if(typeof bootloader.timePostCambio !== 'undefined') {bootloader.timePostCambio.destroy();}
                if(typeof bootloader.timeTgl !== 'undefined') {bootloader.timeTgl.destroy();}
                if(typeof bootloader.timeTgl2 !== 'undefined') {bootloader.timeTgl2.destroy();}
                
                obj.getChildByID('gPtfTr').classList.remove('mgn');
                if(typeof bootloader.tween !== 'undefined') {bootloader.tween.stop();}

                bootloader.auxLetras.getChildren()[dropzone.data.get('orden')].x=dropzone.x;
                bootloader.auxLetras.getChildren()[dropzone.data.get('orden')].y=dropzone.y;
                bootloader.auxLetras.getChildren()[dropzone.data.get('orden')].setAlpha(0);
                bootloader.auxLetras.getChildren()[dropzone.data.get('orden')].getChildByID('gPtfTr').classList.remove('tglmng');
                bootloader.auxLetras.getChildren()[dropzone.data.get('orden')].getChildByID('gPtfTr').classList.remove('tglB');
                bootloader.auxLetras.getChildren()[dropzone.data.get('orden')].getChildByID('gPtfTr').classList.add('tgl');
                cambiarPalabras(obj,dropzone,bootloader);
            }
        });
    }
    bootloader.cuentaAtras = false;
    //mostrar cuestionario

    if(db.preguntas[bootloader.ordenPreguntas[db.preguntaActual]-1].pregunta.texto!='' || 
        db.preguntas[bootloader.ordenPreguntas[db.preguntaActual]-1].pregunta.imagen!='' || 
        db.preguntas[bootloader.ordenPreguntas[db.preguntaActual]-1].pregunta.audio!='' || 
        db.preguntas[bootloader.ordenPreguntas[db.preguntaActual]-1].pregunta.video!=''){
        document.getElementById('gQst').classList.add('act');
    }
    
    bootloader.cuentaAtras = true;
    bootloader.moving = false;   

    resize(bootloader);
}

const cambiarPalabras = (obj,dropzone,bootloader) => {
    var nombreAux = obj.name;
    obj.name=dropzone.name;
    obj.getChildByID('gPtfTr').innerHTML='<span>'+bootloader.toHTML(dropzone.name)+'</span>';
    var elementoObj = document.getElementById('gCj').getElementsByClassName('g__cj__plb')[obj.data.get('palabra')].getElementsByClassName('g__ol__wp')[obj.data.get('ordenPalabra')];
    elementoObj.innerHTML='<span>'+dropzone.name+'</span>';
    dropzone.name=nombreAux;
    dropzone.getChildByID('gPtfTr').innerHTML='<span>'+bootloader.toHTML(nombreAux)+'</span>';
    dropzone.data.set('intent',dropzone.data.get('intent')+1);
    dropzone.setAlpha(1);
    var elementoDropzone = document.getElementById('gCj').getElementsByClassName('g__cj__plb')[dropzone.data.get('palabra')].getElementsByClassName('g__ol__wp')[dropzone.data.get('ordenPalabra')];
    elementoDropzone.innerHTML='<span>'+bootloader.toHTML(nombreAux)+'</span>';
    bootloader.time.addEvent({
        delay: 100,
        callback: ()=>{
            resize(bootloader);
        }
    });

    var letrasPalabra = bootloader.letras.getChildren().length;
    var i=0;
    var palabraCorrecta=1;
    var encontrado=0;
    var delay=0;

    bootloader.letras.getChildren().forEach(function (child) {
        if(child.name==bootloader.fraseArray[i]){
            if(child.getChildByID('gPtfTr').classList.contains('wrg')){
                child.getChildByID('gPtfTr').classList.remove('wrg');
            }
            if(child.getChildByID('gPtfTr').classList.contains('wrg1')){
                child.getChildByID('gPtfTr').classList.remove('wrg1');
            }
            if(child.getChildByID('gPtfTr').classList.contains('drg')){
                child.getChildByID('gPtfTr').classList.remove('drg');
            }
            if(!child.getChildByID('gPtfTr').classList.contains('wn') && !child.getChildByID('gPtfTr').classList.contains('end') && !child.data.get('correct') && !child.data.get('notCount')){
                child.data.set('correct',1);
                if(dropzone.data.get('orden') != child.data.get('orden')){
                    child.data.set('intent',child.data.get('intent')+1);
                }
                //agnadir puntos
                var puntosSubir = Math.floor((bootloader.puntosPalabra / (letrasPalabra - bootloader.letrasSolas)) * 1000) / 1000;
                switch(child.data.get('intent')){
                    case 1:
                        puntosSubir=puntosSubir;
                    break;
                    case 2:
                        puntosSubir=puntosSubir/2;
                    break;
                    case 3:
                        puntosSubir=puntosSubir/4
                    break;
                    default:
                        puntosSubir=0;
                    break;
                }
                //añadir puntos modo normal       
                var elemento = document.getElementById('gCj').getElementsByClassName('g__cj__plb')[child.data.get('palabra')].getElementsByClassName('g__ol__wp')[child.data.get('ordenPalabra')];
                var x = elemento.getBoundingClientRect().x + elemento.getBoundingClientRect().width / 2;
                var y = elemento.getBoundingClientRect().y + elemento.getBoundingClientRect().height / 2;
                var fbPA = bootloader.add.dom(x, y).createFromCache('feedbackPuntosArcade').setOrigin(0.5).setDepth(2).setAlpha(0);
                var puntosExtra = 0;
                
                //solo le queda un hueco por responder
                var correctas = true;
                bootloader.letras.getChildren().forEach(function (child2) {
                    if(child2.data.get('orden') != child.data.get('orden')){
                        if((child2.data.get('correct') != 1 || child2.data.get('intent') != 1) && child2.data.get('notCount')!=1) { correctas=false; }
                    }
                });
                if(correctas){
                    puntosExtra = Math.round((bootloader.puntosPalabra - ((Math.floor((bootloader.puntosPalabra / (letrasPalabra - bootloader.letrasSolas)) * 1000) / 1000) * (letrasPalabra - bootloader.letrasSolas))) * 1000) / 1000
                    //comprobar que es la ultima palabra y hay desviacion en el total de los puntos
                    if(((bootloader.puntosPalabra * db.preguntas.length)!=db.puntosMax) && db.preguntas.length-1 == db.data.r.length){
                        var correctasPalabra=true;
                        db.data.r.forEach(function(preg){
                            if(!preg.s){correctasPalabra=false;}
                        });

                        if(correctasPalabra){
                            puntosExtra+= db.puntosMax - (bootloader.puntosPalabra * db.preguntas.length);
                        }
                    }
                }                
                
                fbPA.getChildByID('gFdbPtsUp').innerHTML = puntosSubir.toFixed(3);;
                db.puntos += puntosSubir;
                db.puntos = Math.round(db.puntos * 1000) / 1000
                
                if (puntosExtra != 0) {
                    fbPA.getChildByID('gFdbPtsUpMin').innerHTML = (Math.round(puntosExtra * 1000) / 1000).toFixed(3);
                    db.puntos += puntosExtra;
                    db.puntos = Math.round(db.puntos * 1000) / 1000
                }
                
                
                bootloader.time.addEvent({
                    delay: delay,
                    callback: ()=>{
                        child.getChildByID('gPtfTr').classList.add('wn');
                        if(db.sonidoJuego){ bootloader.letraOk.play({volume: 0.5});}
                        fbPA.setAlpha(1);
                        fbPA.getChildByID('fdbPts').classList.add('fdb__pts--up');
                    }
                }); 
                document.getElementById('gPts').innerHTML = (Math.floor(db.puntos * 1000) / 1000).toFixed(3);;
                bootloader.feedbackPuntosArcade.add(fbPA);
                delay+=200;
                child.disableInteractive();
                child.off('pointerup');

                //poner wn en gCj 
                elemento.classList.add('wn');
            }
            if(!encontrado) {
                db.letraActual=i;
            }
        }else{
            if(encontrado==0){
                db.letraActual=i;
                encontrado=1;
            }
            
            //saber si es el que se ha movido para si falla marcalo en rojo
            if(dropzone.data.get('orden')==i){
                if(db.vidasInfinitas){
                    child.getChildByID('gPtfTr').classList.add('wrg1');
                }else{
                    if(child.getChildByID('gPtfTr').classList.contains('wrg')){
                        child.getChildByID('gPtfTr').classList.remove('wrg');
                        child.getChildByID('gPtfTr').classList.add('wrg2');
                    }else{
                        if(child.getChildByID('gPtfTr').classList.contains('wrg2')){
                            child.getChildByID('gPtfTr').classList.remove('wrg2');
                        }
                        child.getChildByID('gPtfTr').classList.add('wrg');
                    }
                }
                if(db.sonidoJuego){ bootloader.letraError.play();}
                bootloader.moving=true;
                bootloader.time.addEvent({
                    delay: 1000,
                    callback: ()=>{
                        bootloader.moving=false;
                    }
                }); 

                vidaMenos(bootloader,0);
                var elemento = document.getElementById('gCj').getElementsByClassName('g__cj__plb')[child.data.get('palabra')].getElementsByClassName('g__ol__wp')[child.data.get('ordenPalabra')];
                var x = elemento.getBoundingClientRect().x + elemento.getBoundingClientRect().width / 2;
                var y = elemento.getBoundingClientRect().y + elemento.getBoundingClientRect().height / 2;
                if(!db.vidasInfinitas){
                    var feedbackVida = bootloader.add.dom(x, y).createFromCache('feedbackVida').setOrigin(0.5);
                    feedbackVida.getChildByID('fdb__lv').classList.add('act');
                    bootloader.feedbackPuntosArcade.add(feedbackVida);
                }
                bootloader.time.addEvent({
                    delay: 10,
                    callback: ()=>{
                        var actual='';
                        var contador=0;
                        bootloader.letras.getChildren().forEach(function (children) {
                            if(children.getChildByID('gPtfTr').classList.contains('wn') || children.getChildByID('gPtfTr').classList.contains('wrg') || children.getChildByID('gPtfTr').classList.contains('wrg1') || children.getChildByID('gPtfTr').classList.contains('non')){
                                actual+=children.name+bootloader.realSeparators[contador];
                            }else{
                                actual+='_'+bootloader.realSeparators[contador];
                            }
                            contador++;
                        });
                        db.data.r.push({
                            "s": 0,
                            "i": bootloader.ordenPreguntas[db.preguntaActual]-1,
                            "a": actual,
                        });
                    }
                })
            }else{
                child.getChildByID('gPtfTr').classList.remove('drg');
            }
            palabraCorrecta=0;            
        }
        i++;
    }); 

    
    //

    //actualizo db.letraActual en funcion de que palabra ha pulsado + actualizo gCj con inicio y final por palabra wn--str wn--lst 
    var encontradoCambio=false;
    var palabra=0;
    var empieza=-1;
    var acaba=-1;
    var empiezaPha=-1;
    var acabaPha=-1;
    var i=0;
    bootloader.letras.getChildren().forEach(function (child) {
        if(!encontradoCambio && obj.data.get('palabra')<=child.data.get('palabra') && !child.data.get('correct') && !child.data.get('notCount')){
            db.letraActual=child.data.get('orden');
            encontradoCambio=true;
        }
        if(document.getElementById('gCj').getElementsByClassName('g__cj__plb')[child.data.get('palabra')].getElementsByClassName('g__ol__wp')[child.data.get('ordenPalabra')].classList.contains('wn--str')){
            document.getElementById('gCj').getElementsByClassName('g__cj__plb')[child.data.get('palabra')].getElementsByClassName('g__ol__wp')[child.data.get('ordenPalabra')].classList.remove('wn--str');
        }
        if(document.getElementById('gCj').getElementsByClassName('g__cj__plb')[child.data.get('palabra')].getElementsByClassName('g__ol__wp')[child.data.get('ordenPalabra')].classList.contains('wn--lst')){
            document.getElementById('gCj').getElementsByClassName('g__cj__plb')[child.data.get('palabra')].getElementsByClassName('g__ol__wp')[child.data.get('ordenPalabra')].classList.remove('wn--lst');
        }
        if(child.getChildByID('gPtfTr').classList.contains('wn--str')){
            child.getChildByID('gPtfTr').classList.remove('wn--str')
        }
        if(child.getChildByID('gPtfTr').classList.contains('wn--lst')){
            child.getChildByID('gPtfTr').classList.remove('wn--lst')
        }
        if(palabra!=child.data.get('palabra') || !child.data.get('correct')){
            if(empieza!=-1){
                document.getElementById('gCj').getElementsByClassName('g__cj__plb')[palabra].getElementsByClassName('g__ol__wp')[empieza].classList.add('wn--str');
                bootloader.letras.getChildren()[empiezaPha].getChildByID('gPtfTr').classList.add('wn--str');
            }
            if(acaba!=-1){
                document.getElementById('gCj').getElementsByClassName('g__cj__plb')[palabra].getElementsByClassName('g__ol__wp')[acaba].classList.add('wn--lst');
                bootloader.letras.getChildren()[acabaPha].getChildByID('gPtfTr').classList.add('wn--lst');
            }

            palabra=child.data.get('palabra');
            empieza=-1;
            acaba=-1;
        }
        if(child.data.get('correct')){
            if(empieza==-1){
                empieza=child.data.get('ordenPalabra');
                empiezaPha=i;
            }
            acaba=child.data.get('ordenPalabra');
            acabaPha=i;
        }
        i++;
    });
    if(empieza!=-1){
        document.getElementById('gCj').getElementsByClassName('g__cj__plb')[palabra].getElementsByClassName('g__ol__wp')[empieza].classList.add('wn--str');
        bootloader.letras.getChildren()[empiezaPha].getChildByID('gPtfTr').classList.add('wn--str');
    }
    if(acaba!=-1){
        document.getElementById('gCj').getElementsByClassName('g__cj__plb')[palabra].getElementsByClassName('g__ol__wp')[acaba].classList.add('wn--lst');
        bootloader.letras.getChildren()[acabaPha].getChildByID('gPtfTr').classList.add('wn--lst');
    }

    //añadir clase wn a separadores
    for(var i=0; i<document.getElementById('gCj').getElementsByClassName('g__cj__plb').length; i++) {
        for(var j=0; j<document.getElementById('gCj').getElementsByClassName('g__cj__plb')[i].childNodes.length; j++) {
            if(document.getElementById('gCj').getElementsByClassName('g__cj__plb')[i].childNodes[j].classList.contains('g__ol__sp')){
                if(j==0){
                    if(document.getElementById('gCj').getElementsByClassName('g__cj__plb')[i].childNodes[j+1].classList.contains('wn')
                        || document.getElementById('gCj').getElementsByClassName('g__cj__plb')[i].childNodes[j+1].classList.contains('wn--str')
                        || document.getElementById('gCj').getElementsByClassName('g__cj__plb')[i].childNodes[j+1].classList.contains('wn--lst')){
                            document.getElementById('gCj').getElementsByClassName('g__cj__plb')[i].childNodes[j].classList.add('wn');
                    }
                }else if(j==document.getElementById('gCj').getElementsByClassName('g__cj__plb')[i].childNodes.length-1){
                    if(document.getElementById('gCj').getElementsByClassName('g__cj__plb')[i].childNodes[j-1].classList.contains('wn')
                        || document.getElementById('gCj').getElementsByClassName('g__cj__plb')[i].childNodes[j-1].classList.contains('wn--str')
                        || document.getElementById('gCj').getElementsByClassName('g__cj__plb')[i].childNodes[j-1].classList.contains('wn--lst')){
                            document.getElementById('gCj').getElementsByClassName('g__cj__plb')[i].childNodes[j].classList.add('wn');
                    }
                }else{
                    if((document.getElementById('gCj').getElementsByClassName('g__cj__plb')[i].childNodes[j+1].classList.contains('wn')
                        || document.getElementById('gCj').getElementsByClassName('g__cj__plb')[i].childNodes[j+1].classList.contains('wn--str')
                        || document.getElementById('gCj').getElementsByClassName('g__cj__plb')[i].childNodes[j+1].classList.contains('wn--lst'))
                        && (document.getElementById('gCj').getElementsByClassName('g__cj__plb')[i].childNodes[j-1].classList.contains('wn')
                        || document.getElementById('gCj').getElementsByClassName('g__cj__plb')[i].childNodes[j-1].classList.contains('wn--str')
                        || document.getElementById('gCj').getElementsByClassName('g__cj__plb')[i].childNodes[j-1].classList.contains('wn--lst'))){
                            document.getElementById('gCj').getElementsByClassName('g__cj__plb')[i].childNodes[j].classList.add('wn');
                    }
                }
            }
        }
    }
    
    
    //Eliminar elementos que ya no se van a utilizar
    if(typeof bootloader.timeTgl !== 'undefined') {bootloader.timeTgl.destroy();}

    if(typeof bootloader.timerDelete !== 'undefined') bootloader.timerDelete.remove();
    bootloader.timerDelete = bootloader.time.addEvent({
        delay: delay+500,
        callback: () => {
            //destruir elementos phaser animaciones si los hay (evitar sobrecarga de elementos)
            if(bootloader.feedbackPuntosArcade !== undefined && bootloader.feedbackPuntosArcade.getChildren().length > 0) {
                for(var i=bootloader.feedbackPuntosArcade.getChildren().length-1; i>=0; i--) {
                    bootloader.feedbackPuntosArcade.getChildren()[i].destroy();
                }
            }
        }
    });
    

    bootloader.letras.getChildren().forEach(function (child) {
        if(child.data.get('orden')==db.letraActual){
            child.getChildByID('gPtfTr').classList.add('act');
        }else{
            if(child.getChildByID('gPtfTr').classList.contains('act')){
                child.getChildByID('gPtfTr').classList.remove('act');
            }
        }
    });

    if(palabraCorrecta){
        if(db.sonidoJuego){ bootloader.correctWord.play({volume:1,delay:0.6});}
        bootloader.moving=true;
        var actual='';
        delay+=0;
        //efecto palabra correcta
        var position=0;
        var contador=0;
        bootloader.time.addEvent({
            delay: delay,
            callback: ()=>{
                bootloader.letras.getChildren().forEach(function (children) {   
                    children.getChildByID('gPtfTr').classList.add('wn1');
                });
            }
        });
        bootloader.time.addEvent({
            delay: delay+10,
            callback: ()=>{
                resize(bootloader);
            }
        });
        bootloader.time.addEvent({
            delay: delay,
            callback: ()=>{
                document.getElementById('gCj').classList.add('flld');
            }
        }); 
        bootloader.letras.getChildren().forEach(function (children) {            
            actual+=children.name+bootloader.realSeparators[contador];
            children.getChildByID('gPtfTr').classList.remove('act');

            bootloader.time.addEvent({
                delay: delay,
                callback: ()=>{
                    children.getChildByID('gPtfTr').classList.add('flld');
                }
            }); 
            delay+=50; 
            position++;
            contador++;
        });        
        bootloader.time.addEvent({
            delay: delay+10,
            callback: ()=>{
                resize(bootloader);
            }
        });

        db.data.r.push({
            "s": 1,
            "i": bootloader.ordenPreguntas[db.preguntaActual]-1,
            "a": actual,
        });
        
        delay+=600; 

        bootloader.time.addEvent({
            delay: delay,
            callback: ()=>{
                document.getElementById('gQst').classList.remove('act');
                if(db.sonidoJuego){ bootloader.enunciado.play({volume:0.8});}
            }
        }); 
        delay+=400; 
        //efecto desaparecer
        bootloader.time.addEvent({
            delay: delay,
            callback: ()=>{
                document.getElementById('gCj').classList.add('out');
            }
        });
        bootloader.letras.getChildren().forEach(function (children) {
            bootloader.time.addEvent({
                delay: delay,
                callback: ()=>{
                    children.getChildByID('gPtfTr').classList.add('out');
                    //if(db.sonidoJuego){ bootloader.letraSalida.play();}
                }
            }); 
            delay+=40; 
        });

        bootloader.time.addEvent({
            delay: delay,
            callback: ()=>{
                //comprobar si es la ultima
                if(db.preguntasMaximasReal == db.preguntaActual + 1) {
                    //ultima pregunta ya correcta, hacemos el final
                    ganado(bootloader);
                } else {
                    siguientePregunta(bootloader,0);
                }
            }
        });  
    }
    bootloader.moving=false;
    bootloader.time.addEvent({
        delay: delay+10,
        callback: ()=>{
            resize(bootloader);
        }
    });
}

const comprobarPalabrasDesordenadas = (arrayPalabras,frase) => {
    var letraEnSuLugar = '';
    var numeroEnSuLugar = '';
    //algoritmo para comprobar que hay las letras en su lugar necesarias si no se pueden desordenar todas
    var counterSpecimens = arrayPalabras.map(spec => {
        return {letra: spec, count: 0};
    });
    counterSpecimens.map((countSpec, i) =>{
        const actualSpecLength = arrayPalabras.filter(letra => letra === countSpec.letra).length;
        countSpec.count = actualSpecLength;
        if(actualSpecLength>arrayPalabras.length/2){
            letraEnSuLugar = countSpec['letra'];
            numeroEnSuLugar = actualSpecLength - (arrayPalabras.length - actualSpecLength);
        }
    });


    //convertir frase en un array
    var fraseArray=Array();
    var ultimoI=0;
    var contadorReal=0;
    for (var i = 0; i < frase.length; i++) {
        if(db.separators.includes(frase.charAt(i)) && frase.substring(ultimoI,i)!=''){
            fraseArray[contadorReal]=frase.substring(ultimoI,i);
            ultimoI=i+1;
            contadorReal++;
        }else if (db.separators.includes(frase.charAt(i))){
            ultimoI=i+1;
        }
    }
    if(frase.substring(ultimoI)!=''){
        fraseArray[contadorReal]=frase.substring(ultimoI);
    }

    var desordenadas = true;
    if(letraEnSuLugar!=''){
        for (var i = 0; i < fraseArray.length; i++) {
            if(fraseArray[i]==arrayPalabras[i]){
                if(fraseArray[i]==letraEnSuLugar){
                    if(numeroEnSuLugar==0){
                        desordenadas=false;
                    }else{
                        numeroEnSuLugar--;
                    }
                }else{
                    desordenadas=false;
                }
            }
        }
    }else{
        for (var i = 0; i < fraseArray.length; i++) {
            if(fraseArray[i]==arrayPalabras[i]){
                desordenadas=false;
            }
        }
    }
    
    
    return desordenadas;
}

//funcion que se llama si falla la pregunta o si se le acaba el timepo de respuesta
const vidaMenos = (bootloader,tiempoAcabado) => {    
    if(!db.vidasInfinitas){db.vidas--;}
    if(db.vidasInfinitas){  
        document.getElementById('gLvs').innerHTML = "&#8734;";
    }else{
        document.getElementById('gLvs').innerHTML = db.vidas;
    }
    
    if((!db.vidasInfinitas && db.vidas==0) || db.pantallaFinal){
        if(db.sonidoJuego){ bootloader.gameOver.play({volume:0.05});}

        //juego terminado
        document.getElementById('gQst').classList.remove('act');
        document.getElementById('gQstSkMedWp').innerHTML='';
        //ocultar interface
        document.body.classList.add("gmv");

        bootloader.letras.getChildren().forEach(function (child) {
            child.disableInteractive();
            child.off('pointerup');
            bootloader.add.tween({
                targets: [child],
                alpha: 0,
                duration: 1000
            });
        });

        
        db.data.m.s=0;
        bootloader.time.addEvent({
            delay: 1500,
            callback: ()=>{
                bootloader.scene.launch('Comun', { game: 'ordenarPalabras', db: db});
            }
        })  
    } else{
        if(tiempoAcabado){
            //pasar de pregunta ya que se le ha acabado el tiempo de esta
            //comprobar que quedan preguntas
            if(bootloader.ordenPreguntas.length>db.preguntaActual + 1){
                document.getElementById('gQst').classList.remove('act');
                bootloader.letras.getChildren().forEach(function (child) {
                    child.disableInteractive();
                    child.off('pointerup');
                    bootloader.add.tween({
                        targets: [child],
                        alpha: 0,
                        duration: 1000
                    });
                });
                bootloader.time.addEvent({
                    delay: 1500,
                    callback: ()=>{
                        document.getElementById('gClk').classList.remove('act');
                        siguientePregunta(bootloader,0)
                    }
                }) 
                
            }else{
                if(db.sonidoJuego){ bootloader.gameOver.play({volume:0.05});}
                //juego terminado
                document.getElementById('gQst').classList.remove('act');
                document.getElementById('gQstSkMedWp').innerHTML='';
                //ocultar interface
                document.body.classList.add("gmv");
                bootloader.letras.getChildren().forEach(function (child) {
                    child.disableInteractive();
                    child.off('pointerup');
                    bootloader.add.tween({
                        targets: [child],
                        alpha: 0,
                        duration: 1000
                    });
                });
                bootloader.finish = true;
                db.data.m.s=0;
                bootloader.time.addEvent({
                    delay: 1500,
                    callback: ()=>{
                        bootloader.scene.launch('Comun', { game: 'ordenarPalabras', db: db});
                    }
                }) 
            }
        }
    }
    document.getElementById('gPts').innerHTML = Math.round(db.puntos);
}

const ganado = (bootloader) => {
    if(db.sonidoJuego){ bootloader.gameWin.play({volume:0.1});}
    bootloader.letras.getChildren().forEach(function (child) {
        child.disableInteractive();
        child.off('pointerup');

        bootloader.add.tween({
            targets: [child],
            alpha: 0,
            duration: 1000
        });
    });
    document.getElementById('gQst').classList.remove('act');
    document.getElementById('gQstSkMedWp').innerHTML='';
    bootloader.finish = true;
    db.data.m.s=1
    bootloader.time.addEvent({
        //delay: 800,
        callback: ()=>{
            bootloader.scene.launch('Comun', { game: 'ordenarPalabras', db: db});
            //ocultar interface
            document.body.classList.add("gmv");
        }
    })    
}

const efectoVisualCambio = (obj,dropzone,bootloader) => {
    bootloader.moving=true;
    bootloader.auxLetras.getChildren()[obj.data.get('orden')].getChildByID('gPtfTr').innerHTML='<span>'+bootloader.toHTML(obj.name)+'</span>';
    bootloader.auxLetras.getChildren()[dropzone.data.get('orden')].getChildByID('gPtfTr').innerHTML='<span>'+bootloader.toHTML(dropzone.name)+'</span>';
    bootloader.auxLetras.getChildren()[obj.data.get('orden')].setAlpha(1);
    bootloader.auxLetras.getChildren()[dropzone.data.get('orden')].setAlpha(1);

    obj.setAlpha(0);
    bootloader.time.addEvent({
        delay: 0,
        callback: ()=>{
            for(var a=0;a<document.getElementById('gCntr').childNodes[0].childNodes.length;a++){
                if(document.getElementById('gCntr').childNodes[0].childNodes[a].childNodes[0].classList.contains('tgl')){
                    document.getElementById('gCntr').childNodes[0].childNodes[a].classList.add('g__ol-ghst');
                }
            }

            bootloader.auxLetras.getChildren()[obj.data.get('orden')].x=dropzone.x;
            bootloader.auxLetras.getChildren()[obj.data.get('orden')].y=dropzone.y;
            bootloader.auxLetras.getChildren()[obj.data.get('orden')].getChildByID('gPtfTr').classList.remove('tgl');
            bootloader.auxLetras.getChildren()[obj.data.get('orden')].getChildByID('gPtfTr').classList.add('tglA');
            bootloader.time.addEvent({
                delay: 50,
                callback: ()=>{
                    bootloader.auxLetras.getChildren()[obj.data.get('orden')].getChildByID('gPtfTr').classList.remove('tglA');
                    bootloader.auxLetras.getChildren()[obj.data.get('orden')].getChildByID('gPtfTr').classList.add('tgl');
                    dropzone.setAlpha(0);
                    bootloader.auxLetras.getChildren()[dropzone.data.get('orden')].x=obj.x;
                    bootloader.auxLetras.getChildren()[dropzone.data.get('orden')].y=obj.y;
                    bootloader.auxLetras.getChildren()[dropzone.data.get('orden')].getChildByID('gPtfTr').classList.remove('tgl');
                    bootloader.auxLetras.getChildren()[dropzone.data.get('orden')].getChildByID('gPtfTr').classList.add('tglB');
                    bootloader.time.addEvent({
                        delay: 150,
                        callback: ()=>{
                            bootloader.auxLetras.getChildren()[dropzone.data.get('orden')].getChildByID('gPtfTr').classList.remove('tglB');
                            bootloader.auxLetras.getChildren()[dropzone.data.get('orden')].getChildByID('gPtfTr').classList.add('tgl');
                            bootloader.auxLetras.getChildren()[obj.data.get('orden')].setAlpha(0);
                            bootloader.auxLetras.getChildren()[dropzone.data.get('orden')].setAlpha(0);
                            
                            bootloader.auxLetras.getChildren()[obj.data.get('orden')].x=obj.x;
                            bootloader.auxLetras.getChildren()[obj.data.get('orden')].y=obj.y;
                            bootloader.auxLetras.getChildren()[dropzone.data.get('orden')].x=dropzone.x;
                            bootloader.auxLetras.getChildren()[dropzone.data.get('orden')].y=dropzone.y;

                            obj.setAlpha(1);
                            dropzone.setAlpha(1);
                            cambiarPalabras(obj,dropzone,bootloader);
                        }
                    });
                }
            });
        }
    }); 
    
}

const incluirTexto = (objeto,elemento,elementoExtra,tipo,bootloader,loader='') => {
    elemento.parentNode.className = "";
    elementoExtra.innerHTML='';
    switch(tipo){
        case 'pregunta':
            document.getElementById('gQstSkMedWpLdg').style.display='';
            elemento.parentNode.classList.add('qst__wp__sk');
            var tipoFinal='qst__wp__sk-';
            var tipoId = 'sk';
            break;
    }

    elemento.innerHTML='';
    if(objeto.texto!=''){
        tipoFinal+='-tx';
        elemento.innerHTML=bootloader.toHTML(objeto.texto);
    }

    if(typeof objeto.imagen !== 'undefined' && objeto.imagen!=''){
        var aChild = document.createElement('img');
        aChild.setAttribute('id', tipoId+'__impr'+loader); 
        if(objeto.imagen.substr(0,5)=='blob:'){
            aChild.setAttribute('src', objeto.imagen); 
        }else{
            aChild.setAttribute('src', db.resources+objeto.imagen); 
        }
        aChild.setAttribute('style', 'max-width: '+elemento.parentNode.clientWidth+'px; max-height: '+elemento.parentNode.clientHeight+'px;'); 
        elementoExtra.appendChild(aChild);
        tipoFinal+='-mg';

        document.getElementById(tipoId+'__impr').onload = function() {
            document.getElementById('gQstSkMedWpLdg').style.display='none';
        }

        document.getElementById(tipoId+'__impr').onpointerover = function() {
            var aChild = document.createElement('img');
            aChild.setAttribute('id', tipoId+'__impr'+loader);
            if(objeto.imagen.substr(0,5)=='blob:'){
                aChild.setAttribute('src', objeto.imagen); 
            }else{
                aChild.setAttribute('src', db.resources+objeto.imagen); 
            }
            
            document.getElementById('gQstSkMedWpLprss').appendChild(aChild);
            document.getElementById('gQstSkMedWpLprss').classList.add('act');
        }

        document.getElementById(tipoId+'__impr').onpointerout = function() {
            document.getElementById('gQstSkMedWpLprss').innerHTML='';
            document.getElementById('gQstSkMedWpLprss').classList.remove('act');
        }

        document.getElementById(tipoId+'__impr').addEventListener("contextmenu", function(e){
            e.preventDefault();
            return false;
        }, true);
        
        
    }else if(typeof objeto.audio !== 'undefined' && objeto.audio!=''){
        var aChild = document.createElement('audio');
        aChild.setAttribute('id', 'myAudio'); 
        aChild.setAttribute('controls', ''); 
        if(db.sonidoActividad) aChild.setAttribute('autoplay', ''); 
            
        var bChild = document.createElement('source');
        if(objeto.audio.substr(0,5)=='blob:'){
            bChild.setAttribute('src', objeto.audio); 
        }else{
            bChild.setAttribute('src', db.resources+objeto.audio); 
        }
        bChild.setAttribute('type', 'audio/mp3'); 
        bChild.innerHTML = 'Tu navegador no soporta audio HTML5.';
        aChild.appendChild(bChild);
        elementoExtra.appendChild(aChild);

        if(!db.sonidoActividad) document.getElementById('myAudio').muted=true;

        tipoFinal+='-sd';
    }else if(objeto.video!=''){
        var aChild = document.createElement('iframe');
        aChild.setAttribute('id', tipoId+'__vdpr'); 
        aChild.setAttribute('src', objeto.video); 
        aChild.setAttribute('allowfullscreen', ''); 
        aChild.setAttribute('webkitallowfullscreen', ''); 
        aChild.setAttribute('mozallowfullscreen', ''); 
        aChild.setAttribute('width', '1600'); 
        aChild.setAttribute('height', '900'); 
        aChild.setAttribute('frameborder', '0'); 
        elementoExtra.appendChild(aChild);

        
        tipoFinal+='-vd';


        document.getElementById(tipoId+'__vdpr').onload = function() {
            document.getElementById('gQstSkMedWpLdg').style.display='none';
        }
        document.getElementById(tipoId+'__vdpr').id='';
    }
    elemento.parentNode.classList.add(tipoFinal);


    elemento.classList.remove('tx--s','tx--xs','tx--m','tx--l','tx--xl','tx--xxl');
    if(objeto.texto.length<5){
        elemento.classList.add('tx--s');
    } else if(objeto.texto.length<21){
        elemento.classList.add('tx--xs');
    } else if(objeto.texto.length<51){
        elemento.classList.add('tx--m');
    } else if(objeto.texto.length<151){
        elemento.classList.add('tx--l');
    } else if(objeto.texto.length<251){
        elemento.classList.add('tx--xl');
    } else {
        elemento.classList.add('tx--xxl');
    }
}

const resize = (bootloader) => {
    if(typeof bootloader.letras !== 'undefined' && bootloader.letras.getChildren().length>0){
        var palabra=0;
        var letraEnPalabra=0;
        for (var i = 0; i < bootloader.ordenRespuestasAux.length; i++) {
            if(bootloader.separatorsInWord.includes(i)){
                palabra++;
                letraEnPalabra=0;
            }
            
            var hijo=document.getElementById('gCj').getElementsByClassName('g__cj__plb')[palabra].getElementsByClassName('g__ol__wp')[letraEnPalabra];
            letraEnPalabra++;
            bootloader.letras.getChildren()[i].getChildByID('gPtfTr').style.width=hijo.getBoundingClientRect().width+'px';
            bootloader.letras.getChildren()[i].x=hijo.getBoundingClientRect().x + hijo.getBoundingClientRect().width / 2;
            bootloader.letras.getChildren()[i].y=hijo.getBoundingClientRect().y + hijo.getBoundingClientRect().height / 2;
            bootloader.letras.getChildren()[i].height=hijo.getBoundingClientRect().height;
            bootloader.letras.getChildren()[i].width=hijo.getBoundingClientRect().width;
            bootloader.auxLetras.getChildren()[i].getChildByID('gPtfTr').style.width=hijo.getBoundingClientRect().width+'px';
            bootloader.auxLetras.getChildren()[i].x=hijo.getBoundingClientRect().x + hijo.getBoundingClientRect().width / 2;
            bootloader.auxLetras.getChildren()[i].y=hijo.getBoundingClientRect().y + hijo.getBoundingClientRect().height / 2;
            bootloader.auxLetras.getChildren()[i].height=hijo.getBoundingClientRect().height;
            bootloader.auxLetras.getChildren()[i].width=hijo.getBoundingClientRect().width;      
            if(!bootloader.letras.getChildren()[i].data.get('notCount')){
                bootloader.letras.getChildren()[i].input.hitArea.setTo(-hijo.getBoundingClientRect().width/2,-hijo.getBoundingClientRect().height/4,hijo.getBoundingClientRect().width,hijo.getBoundingClientRect().height);
            }
        }
        
        bootloader.notPoint=0;

    }
}

// export default Bootloader;
window.bootloader = Bootloader;