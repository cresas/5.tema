document.getElementById('infoGame').innerHTML = document.getElementById('infoGameReal').innerHTML;
const printElement = document.getElementById('print');
if (printElement) {
    printElement.href = activityData.urlPrint;
}
class Comun extends Phaser.Scene {
    constructor() {
        super('Comun');
    }
    init(data) {
        this.game = data.game;
        this.db = data.db;
        this.fromStartButton = data.fromStartButton;
        //datos generales no se usa: type, description, author
        this.db.titulo = activityData.name;
        this.db.results = activityData.results; //type url token
        if (typeof this.db.results.url !== 'undefined') {
            this.db.results.urlGame = this.db.results.url.replace('recursos-educativos', 'juego');
        }
        this.db.resources = activityData.resources;
        this.db.mensajeFinal = activityData.data.TEXTO_FINAL;
    }

    preload() {
        this.ticking = this.sound.add('ticking');
    }
    create() {
        var db = this.db;
        var phas = this;
        if (smartyData.publi == 1) {
            if (!document.body.classList.contains('g__bnn')) { document.body.classList.add('g__bnn') }
        }

        if (smartyData.showCookiesNotice) {
            if (!document.body.classList.contains('g__cook')) { document.body.classList.add('g__cook') }
        }
        if (activityData.data.COLOR_BOTONES && activityData.data.COLOR_BOTONES != '') {
            if (!document.body.classList.contains('g__colbtn')) { document.body.classList.add('g__colbtn') }
        }
        if (activityData.data.COLOR_FONDO && activityData.data.COLOR_FONDO != '') {
            if (!document.body.classList.contains('g__colback')) { document.body.classList.add('g__colback') }
        }
        if (activityData.data.OCULTAR_REDES && activityData.data.OCULTAR_REDES != 0) {
            if (!document.body.classList.contains('g__shrhidden')) { document.body.classList.add('g__shrhidden') }
        }
        if (activityData.data.OCULTAR_RESPUESTAS && activityData.data.OCULTAR_RESPUESTAS != 0) {
            if (!document.body.classList.contains('g__srchidden')) { document.body.classList.add('g__srchidden') }
        }
        if (activityData.data.OCULTAR_REINICIAR && activityData.data.OCULTAR_REINICIAR != 0) {
            if (!document.body.classList.contains('g__reinihidden')) { document.body.classList.add('g__reinihidden') }
        }
        if (activityData.data.BACKGROUND && activityData.data.BACKGROUND != '') {
            if (!document.body.classList.contains('g__pht')) { document.body.classList.add('g__pht') }
            if (activityData.data.BACKGROUND.substr(0, 5) == 'blob:') {
                document.getElementById('bk').style = "background-image: url(" + activityData.data.BACKGROUND + ");"
            } else {
                document.getElementById('bk').style = "background-image: url(" + db.resources + activityData.data.BACKGROUND + ");"
            }

        }

        //idioma
        document.getElementById('traduccion').innerHTML = db.lang.traduccion;
        /// document.getElementById('btn__txt__cm').innerHTML=db.lang.comenzar;
        document.getElementById('btn__txt__opc').innerHTML = db.lang.opciones;
        document.getElementById('btn__txt__rt').innerHTML = db.lang.reintentar;
        document.getElementById('g__cnt__end__shr__hd').innerHTML = db.lang.compartir;
        document.getElementById('g__cnt__end__rnk__pts__hd').innerHTML = db.lang.puntos;
        document.getElementById('g__cnt__end__rnk__tm__hd').innerHTML = db.lang.tiempo;
        document.getElementById('g__cnt__end__rnk__hts__hd').innerHTML = db.lang.aciertos;
        document.getElementById('btn__txt__rslt').innerHTML = db.lang.resultado;
        document.getElementById('g__cnt__end__src__tbl__hd').innerHTML = db.lang.resultadoActividad;
        document.getElementById('g__cnt__end__src__tbl__wrp__nb').innerHTML = db.lang.numero;
        document.getElementById('g__cnt__end__src__tbl__wrp__nf').innerHTML = db.lang.cuestionario;
        document.getElementById('g__rte__hd').innerHTML = db.lang.valorar;
        document.getElementById('g__rte__sb').innerHTML = db.lang.ayudanos;
        document.getElementById('omtVal').innerHTML = db.lang.omitir;
        document.getElementById('g__fdb__fst__tt').innerHTML = db.lang.ganado;
        document.getElementById('g__fdb__wn__tt').innerHTML = db.lang.conseguido;
        document.getElementById('g__fdb__fst__sb').innerHTML = db.lang.enhorabuena;
        document.getElementById('g__fdb__wn__sb').innerHTML = db.lang.enhorabuena;
        document.getElementById('g__fdb__ls__tt').innerHTML = db.lang.perdido;
        document.getElementById('g__fdb__tbl__pts__tt').innerHTML = db.lang.puntosMin;
        document.getElementById('g__fdb__tbl__lvs__tt__vd').innerHTML = db.lang.vidas;
        document.getElementById('g__fdb__tbl__tt__tt').innerHTML = db.lang.total + '<br>' + db.lang.puntosMin;
        // document.getElementById('g__opt__hd__tt').innerHTML=db.lang.opciones;
        // document.getElementById('g__opt__wrp__drp__hd__tt__snd').innerHTML=db.lang.sonido;
        // document.getElementById('btn__toggle__tx__jg').innerHTML=db.lang.sonidoJuego;
        // document.getElementById('btn__toggle__tx__act').innerHTML=db.lang.sonidoActividad;
        // document.getElementById('g__opt__wrp__drp__hd__tt__inf').innerHTML=db.lang.informacion;
        // document.getElementById('btn__txt__prnt').innerHTML=db.lang.imprimirActividad;
        // document.getElementById('btn__txt__vlv').innerHTML=db.lang.volver;
        // document.getElementById('g__modal__generic__hdg__1').innerHTML=db.lang.sonidoDesactivar;
        // document.getElementById('no__sndCtv').innerHTML=db.lang.no;
        // document.getElementById('si__sndCtv').innerHTML=db.lang.si;
        document.getElementById('hd__lvs__tt').innerHTML = db.lang.vidas;
        document.getElementById('hd__pts__tt').innerHTML = db.lang.puntos;
        if (document.getElementById('edu__ldg__tx__nf')) { document.getElementById('edu__ldg__tx__nf').innerHTML = db.lang.cargando; }
        document.getElementById('btn__txt__trm').innerHTML = db.lang.terminar;
        // document.getElementById('g__modal__generic__hdg__2').innerHTML=db.lang.seguroAbandonar;
        // document.getElementById('no__sndCtv_exit').innerHTML=db.lang.no;
        // document.getElementById('si__sndCtv_exit').innerHTML=db.lang.si;
        document.getElementById('ntf__wrp__hd').innerHTML = db.lang.infoGPU;
        document.getElementById('ntf__wrp__txt').innerHTML = db.lang.efectosLimitados;
        if (document.getElementById('activityLogin__identified')) {
            document.getElementById('activityLogin__identified').innerHTML = db.lang.activityLogin_identificado;
            document.getElementById('activityLogin__identified2').innerHTML = db.lang.activityLogin_identificado2;
        } else if (document.getElementById('activityLogin__notIdentified')) {
            document.getElementById('activityLogin__notIdentified').innerHTML = db.lang.activityLogin_no_identificado;
            document.getElementById('activityLogin__notIdentified').title = db.lang.activityLogin_no_identificado;
        }

        if (db.vidasInfinitas) {
            if (!document.getElementById('hd__lvs').classList.contains('non')) { document.getElementById('hd__lvs').classList.add('non') }
        }
        if (db.tiempo == 0) {
            db.inGame = 0;

            //inicio automatico
            if (smartyData.faststart) {
                if (smartyData.publiVideo !== false) {
                    setTimeout(playTerminaAnuncio, 500, phas, db)
                } else {
                    playTerminaAnuncio(phas, db);
                }
            } else {
                document.getElementById('gClk').classList.remove('act');

                //imprimir

                document.getElementById('ftr').classList.add('fscbtn');
            }

            //notificacion
            document.getElementById('g__close__modal__notifi__exit').onclick = function () {
                document.getElementById('Ntf').classList.remove('act');
                document.getElementById('ftr').style['z-index'] = '';
            }
        } else {
            if (!phas.sys.game.device.os.desktop && smartyData.editor != 'true') {
                cancelFullscreen();
            }
            document.getElementById('g').style.setProperty('z-index', '4');
            db.pantallaFinal = 1;
            //Enviar datos
            finalizar(db);
            document.getElementById('modal__exit').classList.remove('act');
            if (db.modoArcade) {
                document.getElementById('g__fdb__tbl__tt__nb').innerHTML = '0';
            }
            document.getElementById('resultList').innerHTML = '<div class="g__cnt__end__src__tbl__wrp__hd"><div class="g__cnt__end__src__tbl__wrp__nb">' + db.lang.numero + '</div><div class="g__cnt__end__src__tbl__wrp__nf">' + db.lang.cuestionario + '</div></div>';

            document.getElementById('g').classList.remove('act');
            //feedback win
            document.getElementById('g__fdb').classList.add('act');
            /* ESTA PUESTO PARA QUE SIEMPRE SALGA EL CONFETI YA QUE YA NO HAY POSICION */
            var posicion = 1;
            if (db.vidas <= 0) {
                //gameover
                document.getElementById('g__fdb__ls').classList.add('act');
                /*if(typeof db.mensajeFinal !== 'undefined' && db.mensajeFinal!=''){
                    document.getElementById('g__fdb__ls').getElementsByClassName('g__fdb__fst__msg')[2].innerHTML=db.mensajeFinal;
                    document.getElementById('g__fdb__ls').getElementsByClassName('g__fdb__fst__msg')[2].classList.add('act');
                }*/
            } else {
                if (posicion != 1) {
                    //gameend
                    document.getElementById('g__fdb__wn').classList.add('act');
                    document.getElementById('g__fdb__bg').classList.add('act');
                    if (typeof db.mensajeFinal !== 'undefined' && db.mensajeFinal != '') {
                        document.getElementById('g__fdb__wn').getElementsByClassName('g__fdb__fst__msg')[1].innerHTML = db.mensajeFinal;
                        document.getElementById('g__fdb__wn').getElementsByClassName('g__fdb__fst__msg')[1].classList.add('act');
                    }
                } else {
                    //gamewin
                    document.getElementById('g__fdb__fst').classList.add('act');
                    document.getElementById('g__fdb__bg').classList.add('act');
                    if (typeof db.mensajeFinal !== 'undefined' && db.mensajeFinal != '') {
                        document.getElementById('g__fdb__fst').getElementsByClassName('g__fdb__fst__msg')[0].innerHTML = db.mensajeFinal;
                        document.getElementById('g__fdb__fst').getElementsByClassName('g__fdb__fst__msg')[0].classList.add('act');
                    }

                    //confeti
                    document.getElementById('g__fdb__award').classList.add('act');
                    for (var x = 150; x > 0; x--) {
                        var xChild = document.createElement('div');
                        xChild.setAttribute('class', 'g__fdb__award__itm-' + x);
                        document.getElementById('g__fdb__award').appendChild(xChild);
                    }

                }
            }
            //titulo
            document.getElementById('g__cnt__end__src__tbl__sb').innerHTML = db.titulo;

            //vidas
            document.getElementById('g__fdb__tbl__lvs__tt').innerHTML = db.vidas;

            //tiempo
            var seconds = Math.round(db.tiempo);
            var hour = Math.floor(seconds / 3600);
            hour = (hour < 10) ? '0' + hour : hour;
            var minute = Math.floor((seconds / 60) % 60);
            minute = (minute < 10) ? '0' + minute : minute;
            var second = seconds % 60;
            second = (second < 10) ? '0' + second : second;
            document.getElementById('tiempo').innerHTML = hour + ':' + minute + ':' + second;

            incluirResultados(db, this.game);

            //puntos
            if (!db.modoArcade) { document.getElementById('g__fdb').classList.add('nrml') }
            if (db.modoArcade) {
                if (!db.vidasInfinitas) {
                    document.getElementById('puntos').innerHTML = db.puntos + Math.round((db.puntosPregunta * db.preguntasMaximasReal) * db.vidas / db.vidasTotales);
                } else {
                    document.getElementById('puntos').innerHTML = db.puntos + Math.round((db.puntosPregunta * db.preguntasMaximasReal));
                }
            } else {
                document.getElementById('puntos').innerHTML = Math.round(db.puntos);  //Math.floor(db.puntos* 1000) / 1000;
            }
            // animacion puntos
            phas.time.addEvent({
                delay: 2800,
                callback: () => {
                    if (db.modoArcade) {
                        if (!db.vidasInfinitas) {
                            var velocidadPuntos = Math.ceil((Math.floor(db.puntos * 1000) / 1000 + Math.round((db.puntosPregunta * db.preguntasMaximasReal) * db.vidas / db.vidasTotales)) / 250);
                        } else {
                            var velocidadPuntos = Math.ceil((Math.floor(db.puntos * 1000) / 1000 + Math.round((db.puntosPregunta * db.preguntasMaximasReal))) / 250);
                        }
                    } else {
                        var velocidadPuntos = Math.floor(((Math.floor(db.puntos * 1000) / 1000) / 150) * 1000) / 1000;
                        velocidadPuntos.toFixed(3);
                    }
                    //if(velocidadPuntos<1) velocidadPuntos=1; 
                    if (db.sonidoJuego) { phas.ticking.play(); }
                    if (db.modoArcade) {
                        incluirPuntos(document.getElementById('g__fdb__tbl__pts__nb'), 0, (Math.floor(db.puntos * 1000) / 1000), true, velocidadPuntos, phas, db);
                    } else {
                        incluirPuntos(document.getElementById('g__fdb__tbl__pts__nb'), 0, (Math.floor(db.puntos * 1000) / 1000).toFixed(3), true, velocidadPuntos, phas, db);
                    }
                    if (db.modoArcade) {
                        if (db.vidas) { document.getElementById('g__fdb__tbl__lvs__nb').classList.add('act'); }
                        if (!db.vidasInfinitas) {
                            incluirPuntos(document.getElementById('g__fdb__tbl__lvs__nb'), 0, Math.round((db.puntosPregunta * db.preguntasMaximasReal) * db.vidas / db.vidasTotales), true, velocidadPuntos, phas, db);
                        } else {
                            incluirPuntos(document.getElementById('g__fdb__tbl__lvs__nb'), 0, Math.round((db.puntosPregunta * db.preguntasMaximasReal)), true, velocidadPuntos, phas, db);
                        }
                    }
                    if (db.modoArcade) {
                        if (!db.vidasInfinitas) {
                            incluirPuntos(document.getElementById('g__fdb__tbl__tt__nb'), 0, db.puntos + Math.round((db.puntosPregunta * db.preguntasMaximasReal) * db.vidas / db.vidasTotales), false, velocidadPuntos, phas, db);
                        } else {
                            incluirPuntos(document.getElementById('g__fdb__tbl__tt__nb'), 0, db.puntos + Math.round((db.puntosPregunta * db.preguntasMaximasReal)), false, velocidadPuntos, phas, db);
                        }
                    } else {
                        incluirPuntos(document.getElementById('g__fdb__tbl__tt__nb'), 0, (Math.floor(db.puntos * 1000) / 1000).toFixed(3), false, velocidadPuntos, phas, db);
                    }
                }
            })

            //valoracion
            document.getElementById('star5').onclick = function () {
                valorarActividad(5);
            }
            document.getElementById('star4').onclick = function () {
                valorarActividad(4);
            }
            document.getElementById('star3').onclick = function () {
                valorarActividad(3);
            }
            document.getElementById('star2').onclick = function () {
                valorarActividad(2);
            }
            document.getElementById('star1').onclick = function () {
                valorarActividad(1);
            }
            document.getElementById('omtVal').onclick = function () {
                valorarActividad(0);
            }


            //reintentar
            document.getElementById('rnt').onclick = function () {
                try {
                    parent.recargaActividad();
                } catch (error) {
                }
                if (location.href.split('?').length >= 2) {
                    if (location.href.split('?')[1].includes('faststart=1')) {
                        location.reload();
                    } else {
                        location = location.href + "&faststart=" + 1;
                    }
                } else {
                    location = location.href.split('?')[0] + "?faststart=" + 1;
                }
            }

            //ver resultados
            document.getElementById('rslt').onclick = function () {
                if (document.getElementById('g__cnt__end__scr__btn').classList.contains('act')) {
                    document.getElementById('g__cnt__end__scr__btn').classList.remove('act');
                } else {
                    document.getElementById('g__cnt__end__scr__btn').classList.add('act');
                }
            }

            //redes sociales
            document.getElementById('resultShareFb').onclick = function () {
                var urlShare = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURI(db.results.urlGame);
                window.open(urlShare);
            }
            // document.getElementById('resultShareTw').onclick = function () {
            //     var msg = db.lang.msgShareResultado;
            //     msg = msg.replace('[puntuacion]', Math.round(db.puntos));
            //     var time = db.tiempo;
            //     var minutes = Math.floor(time / 60);
            //     var seconds = time - minutes * 60;
            //     if (minutes < 10) { minutes = "0" + minutes; }
            //     if (seconds < 10) { seconds = "0" + seconds; }
            //     msg = msg.replace('[tiempo]', (minutes + ':' + seconds));
            //     msg = msg.replace('[nomactividad]', smartyData.nomActividad);
            //     var urlShare = 'https://twitter.com/intent/tweet?hashtags=Educaplay&text=' + msg + '&url=' + encodeURI(db.results.urlGame);
            //     window.open(urlShare);
            // }
        }

        document.getElementById('exitBtn').addEventListener('click', function () {
            activityData.ventanaExit = 1;
            document.getElementById('modal__exit').classList.add('act');
        });

        document.getElementById('close__modal_exit').addEventListener('click', function () {
            activityData.ventanaExit = 0;
            document.getElementById('modal__exit').classList.remove('act');
        });

        document.getElementById('no__sndCtv_exit').addEventListener('click', function () {
            activityData.ventanaExit = 0;
            document.getElementById('modal__exit').classList.remove('act');
        });

        // document.getElementById('si__sndCtv_exit').addEventListener('click', function() {
        //     activityData.ventanaExit = 0;
        //     activityData.pantallaFinal=1;
        //     document.getElementById('modal__exit').classList.remove('act');
        // });
        //teclas
        document.body.addEventListener("keydown", function (e) {

            //intro
            if (e.keyCode === 13) {
                if (document.getElementById('modal__exit').classList.contains('act') && !activityData.inGame) {
                    activityData.ventanaExit = 0;
                    activityData.pantallaFinal = 1;
                    document.getElementById('modal__exit').classList.remove('act');
                }
            }
            //esc
            else if (e.keyCode === 27) {

                if (!document.getElementById('modal__exit').classList.contains('act')) {
                    activityData.ventanaExit = 1;
                    document.getElementById('modal__exit').classList.add('act');
                } else {
                    activityData.ventanaExit = 0;
                    document.getElementById('modal__exit').classList.remove('act');
                }
            }
        });

        //teclas
        document.body.addEventListener("keydown", function (e) {
            //intro
            if (e.keyCode === 13) {
                if (db.pantallaFinal) {
                    //reintentar
                    try {
                        parent.recargaActividad();
                    } catch (error) {
                    }
                    if (location.href.split('?').length >= 2) {
                        if (location.href.split('?')[1].includes('faststart=1')) {
                            location.reload();
                        } else {
                            location = location.href + "&faststart=" + 1;
                        }
                    } else {
                        location = location.href.split('?')[0] + "?faststart=" + 1;
                    }
                }
            }
        })
        if (this.fromStartButton) {
            play(phas);
        }
    }
}

function playTerminaAnuncio(phas, db) {
    if (smartyData.publiVideo !== false) {
        if (document.getElementById('videoplayer').style.display == 'none') {
            db.inGame = 1;
            play(phas);
        } else {
            setTimeout(playTerminaAnuncio, 100, phas, db);
        }
    } else {
        db.inGame = 1;
        play(phas);
    }
}

function play(phas) {
    if (!phas.sys.game.device.os.desktop && smartyData.editor != 'true') {
        if (document.body.requestFullScreen) {
            document.body.requestFullScreen();
        } else if (document.body.mozRequestFullScreen) {
            document.body.mozRequestFullScreen();
        } else if (document.body.webkitRequestFullScreen) {
            document.body.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        } else if (document.body.msRequestFullscreen) {
            document.body.msRequestFullscreen();
        } else {
            window.parent.postMessage({ type: 'activity-fullscreenrequest' });
        }
        document.getElementById('gFsc').classList.add('act');
    }
    document.getElementById('g').style.zIndex = '';
    document.getElementById('g__bg').classList.remove('act');
    document.getElementById('g__hd').classList.remove('act');
    document.getElementById('g__hdg').classList.remove('act');
    document.getElementById('g__cnt__ini').classList.remove('act');
    document.getElementById('options').classList.remove('act');


    phas.time.addEvent({
        delay: 200,
        callback: () => {
            document.getElementById('g__cntdwn').classList.add('act');
            phas.time.addEvent({
                delay: 1000,
                callback: () => {
                    document.getElementById('g__cntdwn__hd').innerHTML = '2';
                    phas.time.addEvent({
                        delay: 1000,
                        callback: () => {
                            document.getElementById('g__cntdwn__hd').innerHTML = '1';
                            phas.time.addEvent({
                                delay: 1000,
                                callback: () => {
                                    document.getElementById('g__cntdwn__hd').innerHTML = '0';
                                    document.getElementById('g__cntdwn').classList.remove('act');
                                    if (document.body.classList.contains('gmv')) document.body.classList.remove('gmv');
                                    phas.scene.start('Bootloader');
                                }
                            })
                        }
                    })
                }
            })
        }
    })
}

let attemptRegistered = 0;

function valorarActividad(valoracion) {
    if (valoracion > 0) {
        var xhr = new XMLHttpRequest();
        if (smartyData.tokenID == '') {
            xhr.open("PUT", smartyData.urlValorar + '?anonymousToken=' + smartyData.anonymousToken, true);
        } else {
            xhr.open("PUT", smartyData.urlValorar + '?token=' + smartyData.tokenID, true);
        }
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
        xhr.send("rating=" + valoracion + "&attempt=" + attemptRegistered);
    }
    document.getElementById('g__rte').classList.remove('act');
}

function incluirPuntos(elemento, puntos, puntosMaximos, aux, velocidadPuntos, phas, db) {
    if (puntos < puntosMaximos) {
        if (aux) {
            elemento.innerHTML = '+' + String(Math.floor((puntos + velocidadPuntos)));
        } else {
            elemento.innerHTML = String((Math.floor((puntos + velocidadPuntos) * 1000) / 1000));
        }
        setTimeout(incluirPuntos, 1, elemento, Math.floor((puntos + velocidadPuntos) * 1000) / 1000, puntosMaximos, aux, velocidadPuntos, phas, db);
    } else {
        if (aux) {
            elemento.innerHTML = '+' + String(puntosMaximos);
        } else {
            elemento.innerHTML = String(puntosMaximos);
            if (db.sonidoJuego) { phas.ticking.stop(); }

            if (smartyData.valorar) {
                //valoraciones
                document.getElementById('g__rte').classList.add('act');
            }
            //contenedor final
            document.getElementById('g__cnt__end').classList.add('act');
        }
    }
}

function finalizar(db) {
    if (db.results.type == 'SCORM') {
        _finalizarSCORM(db);
    } else if (db.results.type == 'ADR') {
        _finalizarADR(db);
    } else if (db.results.type == 'url') {
        _finalizarScript(db);
    }
    //retos
    try {
        parent.finActividad();
    } catch (error) {

    }
}

function _finalizarADR(db) {
    const roundedPoints = Math.round(db.puntos);
    window.parent.finalizarActividadExportadoNew(window.location.href, db.titulo, roundedPoints, db.tiempo);
}

function _finalizarSCORM(db) {
    var registroRealizado = false;

    var finalizado = 1;
    var finOK = 1;
    if (db.puntos == 0) { finOK = 0; }
    var inicializadoScorm = false;
    try {
        inicializadoScorm = adrInicializar();
        if (inicializadoScorm) {
            adrSetValue("tiempo", 0);
            var estado = adrComprobarEstado();
            if (!estado) {
                adrSetValue("minimo", 0);
                adrSetValue("maximo", 100);
                adrSetValue("resultado", 0);
                adrSetValue("estado", "noFinalizado");
            }
            adrCommit();
        }
    } catch (error) {
        inicializadoScorm = false;
    }

    var estado = false;
    var commitScorm = false;
    var finalizadoScorm = false;
    var aux = '';
    if (!registroRealizado) {
        if (inicializadoScorm) {
            aux = db.tiempo;
            adrSetValue("tiempo", aux * 1000);
            estado = adrComprobarEstado();
            //Compruebo si la actividad ya se ha registrado
            if (!estado) {
                //Compruebo si el alumno ha finalizado o no la actividad
                if (finalizado) {
                    if (finOK == 1) {
                        adrSetValue("estado", "finalizadoOK");
                    }
                    else {
                        adrSetValue("estado", "finalizadoERROR");
                    }
                } else {
                    adrSetValue("estado", "noFinalizado");
                }
                adrSetValue("resultado", Math.round(db.puntos));
            }
            commitScorm = adrCommit();
            finalizadoScorm = adrFinalizar();
            //Compruebo que el registro se ha realizado de forma correcta
            if ((commitScorm) && (finalizadoScorm)) {
                registroRealizado = true;
            }
        }
    }
}

const sha256 = async (str) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const buffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(buffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

function _finalizarScript(db) {
    let registroRealizado = false;
    const roundedPoints = Math.round(db.puntos);
    let signature = roundedPoints.toString() + db.tiempo.toString() + db.results.token;
    const token = smartyData.tokenID;
    const anonymousToken = smartyData.anonymousToken;
    if (token != '') {
        signature += token;
    } else if (anonymousToken != '') {
        signature += anonymousToken;
    }
    signature += 'G7GtgTT';
    sha256(signature).then(signatureHash => {
        let urlQS = '';
        if (token != '') {
            urlQS += (urlQS == '') ? '?' : '&';
            urlQS += 'token=' + token;
        } else if (anonymousToken != '') {
            urlQS += (urlQS == '') ? '?' : '&';
            urlQS += 'anonymousToken=' + anonymousToken;
        }
        const url = db.results.url + urlQS;
        let params = {
            score: roundedPoints,
            time: db.tiempo,
            token: db.results.token,
            tokenSignature: signatureHash,
            data: JSON.stringify(db.data)
        };
        if (smartyData.environment) {
            params = {
                ...params,
                environment: smartyData.environment,
                state: smartyData.state,
                signature: smartyData.signature
            };
            if (smartyData.environment == 'lti') {
                params = {
                    ...params,
                    oauth_consumer_key: smartyData.oauth_consumer_key,
                    lis_outcome_service_url: smartyData.lis_outcome_service_url,
                    lis_result_sourcedid: smartyData.lis_result_sourcedid
                };
            }
        }
        fetch(url, {
            method: 'POST',
            headers: {
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams(params)
        }).then(response => {
            if (response.ok) {
                registroRealizado = true;
                return response.json();
            }
        }).then(response => {
            if (response.redirect !== false) {
                setTimeout(() => { window.location.href = response.redirect; }, 4000);
            } else {
                attemptRegistered = parseInt(response.attempt);
            }
        }).catch(error => {
        });
    });
}

function incluirResultados(db, game) {
    switch (game) {
        case 'jump':
            //actiertos
            var aciertos = 0;
            var iterate = 1;
            db.data.r.forEach(function (preg) {
                if (preg.s) {
                    aciertos++;
                }
                //incluir respuesta
                var aChild = document.createElement('div');
                if (preg.s) {
                    aChild.setAttribute('class', 'g__cnt__end__src__tbl__wrp__rw--' + String(iterate));
                } else {
                    aChild.setAttribute('class', 'g__cnt__end__src__tbl__wrp__rw--' + String(iterate) + ' wrng');
                }

                var bChild = document.createElement('div');
                bChild.setAttribute('class', 'g__cnt__end__src__tbl__wrp__nb');
                bChild.innerHTML = "<span>" + String(iterate) + "</span>";
                aChild.appendChild(bChild);

                var cChild = document.createElement('div');
                cChild.setAttribute('class', 'g__cnt__end__src__tbl__wrp__nf');
                var dChild = document.createElement('div');
                dChild.setAttribute('class', 'g__cnt__end__src__tbl__wrp__nf__qst');
                //incluir datos pregunta
                if (!db.modoGrupos) {
                    dChild.innerHTML = "<span class='g__cnt__end__src__tbl__wrp__nf__qst__tt'>" + db.preguntas[preg.i].pregunta.texto + "</span>";
                } else {
                    if (preg.s) {
                        var aux = preg.a.split('-');
                        var grupoAux = aux[0];
                    } else {
                        var aux = preg.c.split('-');
                        var grupoAux = aux[0];
                    }
                    dChild.innerHTML = "<span class='g__cnt__end__src__tbl__wrp__nf__qst__tt'>" + db.gruposEnunciado + db.grupos[grupoAux].enunciado.texto + "</span>";
                }
                if (!db.modoGrupos) {
                    if (db.preguntas[preg.i].pregunta.imagen != '') {
                        var spanImgChild = document.createElement('span');
                        spanImgChild.setAttribute('class', 'g__cnt__end__src__tbl__wrp__nf__qst__mg');
                        var imgChild = document.createElement('img');
                        if (db.preguntas[preg.i].pregunta.imagen.substr(0, 5) == 'blob:') {
                            imgChild.setAttribute('src', db.preguntas[preg.i].pregunta.imagen);
                        } else {
                            imgChild.setAttribute('src', db.resources + db.preguntas[preg.i].pregunta.imagen);
                        }
                        spanImgChild.appendChild(imgChild);
                        dChild.appendChild(spanImgChild);
                    } else if (db.preguntas[preg.i].pregunta.audio != '') {
                        var spanAudioChild = document.createElement('span');
                        spanAudioChild.setAttribute('class', 'g__cnt__end__src__tbl__wrp__nf__qst__sd');
                        var audioChild = document.createElement('audio');
                        audioChild.setAttribute('controls', '');

                        var sourceChild = document.createElement('source');
                        if (db.preguntas[preg.i].pregunta.audio.substr(0, 5) == 'blob:') {
                            sourceChild.setAttribute('src', db.preguntas[preg.i].pregunta.audio);
                        } else {
                            sourceChild.setAttribute('src', db.resources + db.preguntas[preg.i].pregunta.audio);
                        }

                        sourceChild.setAttribute('type', 'audio/mp3');
                        sourceChild.innerHTML = 'Tu navegador no soporta audio HTML5.';
                        audioChild.appendChild(sourceChild);
                        spanAudioChild.appendChild(audioChild);
                        dChild.appendChild(spanAudioChild);
                    }
                } else {
                    if (preg.s) {
                        var aux = preg.a.split('-');
                        var grupoAux = aux[0];
                    } else {
                        var aux = preg.c.split('-');
                        var grupoAux = aux[0];
                    }
                    if (db.grupos[grupoAux].enunciado.imagen != '') {
                        var spanImgChild = document.createElement('span');
                        spanImgChild.setAttribute('class', 'g__cnt__end__src__tbl__wrp__nf__qst__mg');
                        var imgChild = document.createElement('img');
                        if (db.grupos[grupoAux].enunciado.imagen.substr(0, 5) == 'blob:') {
                            imgChild.setAttribute('src', db.grupos[grupoAux].enunciado.imagen);
                        } else {
                            imgChild.setAttribute('src', db.resources + db.grupos[grupoAux].enunciado.imagen);
                        }
                        spanImgChild.appendChild(imgChild);
                        dChild.appendChild(spanImgChild);
                    } else if (db.grupos[grupoAux].enunciado.audio != '') {
                        var spanAudioChild = document.createElement('span');
                        spanAudioChild.setAttribute('class', 'g__cnt__end__src__tbl__wrp__nf__qst__sd');
                        var audioChild = document.createElement('audio');
                        audioChild.setAttribute('controls', '');

                        var sourceChild = document.createElement('source');
                        if (db.grupos[grupoAux].enunciado.audio.substr(0, 5) == 'blob:') {
                            sourceChild.setAttribute('src', db.grupos[grupoAux].enunciado.audio);
                        } else {
                            sourceChild.setAttribute('src', db.resources + db.grupos[grupoAux].enunciado.audio);
                        }

                        sourceChild.setAttribute('type', 'audio/mp3');
                        sourceChild.innerHTML = 'Tu navegador no soporta audio HTML5.';
                        audioChild.appendChild(sourceChild);
                        spanAudioChild.appendChild(audioChild);
                        dChild.appendChild(spanAudioChild);
                    }
                }
                cChild.appendChild(dChild);
                var eChild = document.createElement('div');
                eChild.setAttribute('class', 'g__cnt__end__src__tbl__wrp__nf__nsw');
                //incluir datos respuesta
                if (preg.a != '') {
                    if (!db.modoGrupos) {
                        if (db.preguntas[preg.i][preg.a].texto != '') {
                            if (preg.s) {
                                eChild.innerHTML = "<span class='g__cnt__end__src__tbl__wrp__nf__nsw__tt'>" + db.preguntas[preg.i][preg.a].texto + "<span>";
                            } else {
                                eChild.innerHTML = "<span class='g__cnt__end__src__tbl__wrp__nf__nsw__tt wrng'>" + db.preguntas[preg.i][preg.a].texto + "<span>";
                            }
                        }
                        if (db.preguntas[preg.i][preg.a].imagen != '') {
                            var spanImgChild = document.createElement('span');
                            spanImgChild.setAttribute('class', 'g__cnt__end__src__tbl__wrp__nf__nsw__mg');
                            if (!preg.s) spanImgChild.setAttribute('class', 'g__cnt__end__src__tbl__wrp__nf__nsw__mg wrng');
                            var imgChild = document.createElement('img');
                            if (db.preguntas[preg.i][preg.a].imagen.substr(0, 5) == 'blob:') {
                                imgChild.setAttribute('src', db.preguntas[preg.i][preg.a].imagen);
                            } else {
                                imgChild.setAttribute('src', db.resources + db.preguntas[preg.i][preg.a].imagen);
                            }
                            spanImgChild.appendChild(imgChild);
                            eChild.appendChild(spanImgChild);
                        }
                    } else {
                        var aux = preg.a.split('-');
                        var grupoAux = aux[0];
                        var elementoAux = aux[1];

                        if (db.grupos[grupoAux].elementos[elementoAux].texto != '') {
                            if (preg.s) {
                                eChild.innerHTML = "<span class='g__cnt__end__src__tbl__wrp__nf__nsw__tt'>" + db.grupos[grupoAux].elementos[elementoAux].texto + "<span>";
                            } else {
                                eChild.innerHTML = "<span class='g__cnt__end__src__tbl__wrp__nf__nsw__tt wrng'>" + db.grupos[grupoAux].elementos[elementoAux].texto + "<span>";
                            }
                        }
                        if (db.grupos[grupoAux].elementos[elementoAux].imagen != '') {
                            var spanImgChild = document.createElement('span');
                            spanImgChild.setAttribute('class', 'g__cnt__end__src__tbl__wrp__nf__nsw__mg');
                            if (!preg.s) spanImgChild.setAttribute('class', 'g__cnt__end__src__tbl__wrp__nf__nsw__mg wrng');
                            var imgChild = document.createElement('img');
                            if (db.grupos[grupoAux].elementos[elementoAux].imagen.substr(0, 5) == 'blob:') {
                                imgChild.setAttribute('src', db.grupos[grupoAux].elementos[elementoAux].imagen);
                            } else {
                                imgChild.setAttribute('src', db.resources + db.grupos[grupoAux].elementos[elementoAux].imagen);
                            }
                            spanImgChild.appendChild(imgChild);
                            eChild.appendChild(spanImgChild);
                        }

                    }

                }
                if (!preg.s) {
                    //incluir datos respuesta correcta
                    if (!db.modoGrupos) {
                        if (db.preguntas[preg.i][db.preguntas[preg.i].correcta].texto != '') {
                            eChild.innerHTML += "<span class='g__cnt__end__src__tbl__wrp__nf__nsw__tt'>" + db.preguntas[preg.i][db.preguntas[preg.i].correcta].texto + "</span>";
                        }
                        if (db.preguntas[preg.i][db.preguntas[preg.i].correcta].imagen != '') {
                            var spanImgChild = document.createElement('span');
                            spanImgChild.setAttribute('class', 'g__cnt__end__src__tbl__wrp__nf__nsw__mg');
                            var imgChild = document.createElement('img');
                            if (db.preguntas[preg.i][db.preguntas[preg.i].correcta].imagen.substr(0, 5) == 'blob:') {
                                imgChild.setAttribute('src', db.preguntas[preg.i][db.preguntas[preg.i].correcta].imagen);
                            } else {
                                imgChild.setAttribute('src', db.resources + db.preguntas[preg.i][db.preguntas[preg.i].correcta].imagen);
                            }
                            spanImgChild.appendChild(imgChild);
                            eChild.appendChild(spanImgChild);
                        }
                    } else {
                        var aux = preg.c.split('-');
                        var grupoAux = aux[0];
                        var elementoAux = aux[1];

                        if (db.grupos[grupoAux].elementos[elementoAux].texto != '') {
                            eChild.innerHTML += "<span class='g__cnt__end__src__tbl__wrp__nf__nsw__tt'>" + db.grupos[grupoAux].elementos[elementoAux].texto + "</span>";
                        }
                        if (db.grupos[grupoAux].elementos[elementoAux].imagen != '') {
                            var spanImgChild = document.createElement('span');
                            spanImgChild.setAttribute('class', 'g__cnt__end__src__tbl__wrp__nf__nsw__mg');
                            var imgChild = document.createElement('img');
                            if (db.grupos[grupoAux].elementos[elementoAux].imagen.substr(0, 5) == 'blob:') {
                                imgChild.setAttribute('src', db.grupos[grupoAux].elementos[elementoAux].imagen);
                            } else {
                                imgChild.setAttribute('src', db.resources + db.grupos[grupoAux].elementos[elementoAux].imagen);
                            }
                            spanImgChild.appendChild(imgChild);
                            eChild.appendChild(spanImgChild);
                        }

                    }
                }
                cChild.appendChild(eChild);
                aChild.appendChild(cChild);

                var fChild = document.createElement('div');
                fChild.setAttribute('class', 'g__cnt__end__src__tbl__wrp__i');
                if (preg.s) {
                    fChild.innerHTML = '<svg width="18" height="13" viewBox="0 0 18 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 1L6 12L1 7" stroke="#9BD84C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg> ';
                } else {
                    fChild.innerHTML = '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 1L1 13" stroke="#C2371A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M1 1L13 13" stroke="#C2371A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
                }
                aChild.appendChild(fChild);
                document.getElementById('resultList').appendChild(aChild);
                iterate++;
            });

            if (db.modoArcade && db.modoInfinito) {
                document.getElementById('actiertos').innerHTML = aciertos;
            } else {
                document.getElementById('actiertos').innerHTML = aciertos + ' <span class="g__cnt__end__rnk__hts__nb--ll">/ ' + db.data.r.length + '</span>';
            }
            break;
        case 'completar':
            var aciertos = 0;
            let respuestas = [];
            db.data.r.forEach(result => {
                let [preg, gap] = result.i.split(':');
                if (respuestas[preg] == undefined) {
                    respuestas[preg] = [];
                }
                if (respuestas[preg][gap] == undefined) {
                    respuestas[preg][gap] = [];
                }
                respuestas[preg][gap].push(result);
            });

            respuestas.forEach((pantalla, index) => {
                let screenContainer = document.createElement('div');
                screenContainer.setAttribute('id', 'screen_' + (index + 1));

                let pageTitle = document.createElement('div');
                pageTitle.setAttribute('class', 'screen__title');
                pageTitle.innerHTML = db.lang.pagina + " " + (index + 1);
                screenContainer.appendChild(pageTitle);

                pantalla.forEach((hueco, index) => {
                    let respWp = document.createElement('div');
                    respWp.setAttribute('class', 'g__cnt__end__src__tbl__wrp__rw--' + (index + 1));

                    let numberWp = document.createElement('div');
                    numberWp.setAttribute('class', 'g__cnt__end__src__tbl__wrp__nb');
                    numberWp.innerHTML = "<span>" + (index + 1) + "</span>";
                    respWp.appendChild(numberWp);

                    let wordWp = document.createElement('div');
                    wordWp.setAttribute('class', 'g__cnt__end__src__tbl__wrp__nf__qst');
                    wordWp.innerHTML = "<span class='g__cnt__end__src__tbl__wrp__nf__qst__tt'>" + hueco[hueco.length - 1].a + "</span>";
                    respWp.appendChild(wordWp);

                    let svgWp = document.createElement('div');
                    svgWp.setAttribute('class', 'g__cnt__end__src__tbl__wrp__i');

                    if (hueco[hueco.length - 1].s === 1) {
                        aciertos++;
                        svgWp.innerHTML = '<svg width="18" height="13" viewBox="0 0 18 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 1L6 12L1 7" stroke="#9BD84C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg> ';
                    } else {
                        respWp.classList.add('wrg');
                        svgWp.innerHTML = '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 1L1 13" stroke="#C2371A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M1 1L13 13" stroke="#C2371A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
                    }
                    respWp.appendChild(svgWp);
                    screenContainer.appendChild(respWp);

                    if (hueco.length > 1) {
                        for (let err = 0; err < hueco.length - 1; err++) {
                            let respWpErr = document.createElement('div');
                            respWpErr.setAttribute('class', 'g__cnt__end__src__tbl__wrp__rw--' + (index + 1) + ' wrg');

                            let numberWpErr = document.createElement('div');
                            numberWpErr.setAttribute('class', 'g__cnt__end__src__tbl__wrp__nb');
                            numberWpErr.innerHTML = "<span>" + (index + 1) + "</span>";
                            respWpErr.appendChild(numberWpErr);

                            let wordWpErr = document.createElement('div');
                            wordWpErr.setAttribute('class', 'g__cnt__end__src__tbl__wrp__nf__qst');

                            wordWpErr.innerHTML = "<span class='g__cnt__end__src__tbl__wrp__nf__qst__tt'>" + hueco[err].a + "</span>";
                            respWpErr.appendChild(wordWpErr);

                            let svgWpErr = document.createElement('div');
                            svgWpErr.setAttribute('class', 'g__cnt__end__src__tbl__wrp__i');
                            svgWpErr.innerHTML = '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 1L1 13" stroke="#C2371A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M1 1L13 13" stroke="#C2371A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
                            respWpErr.appendChild(svgWpErr);

                            screenContainer.appendChild(respWpErr);
                        }
                    }
                });
                document.getElementById('resultList').appendChild(screenContainer);
            });

            if (db.modoArcade && db.modoInfinito) {
                document.getElementById('actiertos').innerHTML = aciertos;
            } else {
                document.getElementById('actiertos').innerHTML = aciertos + ' <span class="g__cnt__end__rnk__hts__nb--ll">/ ' + db.huecosTotales + '</span>';
            }

            break;
        case 'ordenarLetras':
        case 'ordenarPalabras':
            var aciertos = 0;
            var iterate = 1;
            var lastIncorrect = -1;
            var respuestasContestadas = Array();
            db.data.r.forEach(function (preg) {
                if (!respuestasContestadas.includes(preg.i)) {
                    respuestasContestadas.push(preg.i);
                }
                if (preg.s) {
                    aciertos++;
                } else {
                    if (lastIncorrect != preg.i) {
                        //Incluir primero el correcto
                        db.data.r.forEach(function (pregCorrect) {
                            if (pregCorrect.s && pregCorrect.i == preg.i) {
                                var aChild = document.createElement('div');
                                aChild.setAttribute('class', 'g__cnt__end__src__tbl__wrp__rw--' + String(iterate));

                                var bChild = document.createElement('div');
                                bChild.setAttribute('class', 'g__cnt__end__src__tbl__wrp__nb');
                                bChild.innerHTML = "<span>" + String(pregCorrect.i + 1) + "</span>";
                                aChild.appendChild(bChild);

                                var cChild = document.createElement('div');
                                cChild.setAttribute('class', 'g__cnt__end__src__tbl__wrp__nf');
                                var dChild = document.createElement('div');
                                dChild.setAttribute('class', 'g__cnt__end__src__tbl__wrp__nf__qst');


                                dChild.innerHTML = "<span class='g__cnt__end__src__tbl__wrp__nf__qst__tt'>" + db.preguntas[pregCorrect.i].pregunta.texto + "</span>";
                                if (db.preguntas[pregCorrect.i].pregunta.imagen != '') {
                                    var spanImgChild = document.createElement('span');
                                    spanImgChild.setAttribute('class', 'g__cnt__end__src__tbl__wrp__nf__qst__mg');
                                    var imgChild = document.createElement('img');
                                    if (db.preguntas[pregCorrect.i].pregunta.imagen.substr(0, 5) == 'blob:') {
                                        imgChild.setAttribute('src', db.preguntas[pregCorrect.i].pregunta.imagen);
                                    } else {
                                        imgChild.setAttribute('src', db.resources + db.preguntas[pregCorrect.i].pregunta.imagen);
                                    }
                                    spanImgChild.appendChild(imgChild);
                                    dChild.appendChild(spanImgChild);
                                } else if (db.preguntas[pregCorrect.i].pregunta.audio != '') {
                                    var spanAudioChild = document.createElement('span');
                                    spanAudioChild.setAttribute('class', 'g__cnt__end__src__tbl__wrp__nf__qst__sd');
                                    var audioChild = document.createElement('audio');
                                    audioChild.setAttribute('controls', '');

                                    var sourceChild = document.createElement('source');
                                    if (db.preguntas[pregCorrect.i].pregunta.audio.substr(0, 5) == 'blob:') {
                                        sourceChild.setAttribute('src', db.preguntas[pregCorrect.i].pregunta.audio);
                                    } else {
                                        sourceChild.setAttribute('src', db.resources + db.preguntas[pregCorrect.i].pregunta.audio);
                                    }

                                    sourceChild.setAttribute('type', 'audio/mp3');
                                    sourceChild.innerHTML = 'Tu navegador no soporta audio HTML5.';
                                    audioChild.appendChild(sourceChild);
                                    spanAudioChild.appendChild(audioChild);
                                    dChild.appendChild(spanAudioChild);
                                } else if (db.preguntas[pregCorrect.i].pregunta.video != '') {
                                    var spanVideoChild = document.createElement('span');
                                    spanVideoChild.setAttribute('class', 'g__cnt__end__src__tbl__wrp__nf__qst__vd');
                                    var videoChild = document.createElement('iframe');
                                    videoChild.setAttribute('src', db.preguntas[pregCorrect.i].pregunta.video);
                                    videoChild.setAttribute('allowfullscreen', '');
                                    videoChild.setAttribute('webkitallowfullscreen', '');
                                    videoChild.setAttribute('mozallowfullscreen', '');
                                    videoChild.setAttribute('width', '1600');
                                    videoChild.setAttribute('height', '900');
                                    videoChild.setAttribute('frameborder', '0');

                                    spanVideoChild.appendChild(videoChild);
                                    dChild.appendChild(spanVideoChild);
                                }
                                cChild.appendChild(dChild);

                                var eChild = document.createElement('div');
                                eChild.setAttribute('class', 'g__cnt__end__src__tbl__wrp__nf__nsw');
                                eChild.innerHTML = "<span class='g__cnt__end__src__tbl__wrp__nf__nsw__tt'>" + pregCorrect.a + "<span>";
                                cChild.appendChild(eChild);
                                aChild.appendChild(cChild);

                                var fChild = document.createElement('div');
                                fChild.setAttribute('class', 'g__cnt__end__src__tbl__wrp__i');
                                fChild.innerHTML = '<svg width="18" height="13" viewBox="0 0 18 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 1L6 12L1 7" stroke="#9BD84C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg> ';
                                aChild.appendChild(fChild);
                                document.getElementById('resultList').appendChild(aChild);
                                iterate++;
                            }
                        });
                    }
                }

                if (lastIncorrect == preg.i && preg.s) {
                    //ya he mostrado la correcta al principio
                } else {

                    var aChild = document.createElement('div');
                    if (preg.s) {
                        aChild.setAttribute('class', 'g__cnt__end__src__tbl__wrp__rw--' + String(iterate));
                    } else {
                        aChild.setAttribute('class', 'g__cnt__end__src__tbl__wrp__rw--' + String(iterate) + ' wrng');
                    }

                    var bChild = document.createElement('div');
                    bChild.setAttribute('class', 'g__cnt__end__src__tbl__wrp__nb');
                    if (preg.s) {
                        bChild.innerHTML = "<span>" + String(preg.i + 1) + "</span>";
                    }
                    aChild.appendChild(bChild);

                    var cChild = document.createElement('div');
                    cChild.setAttribute('class', 'g__cnt__end__src__tbl__wrp__nf');
                    if (preg.s) {
                        var dChild = document.createElement('div');
                        dChild.setAttribute('class', 'g__cnt__end__src__tbl__wrp__nf__qst');
                        dChild.innerHTML = "<span class='g__cnt__end__src__tbl__wrp__nf__qst__tt'>" + db.preguntas[preg.i].pregunta.texto + "</span>";
                        if (db.preguntas[preg.i].pregunta.imagen != '') {
                            var spanImgChild = document.createElement('span');
                            spanImgChild.setAttribute('class', 'g__cnt__end__src__tbl__wrp__nf__qst__mg');
                            var imgChild = document.createElement('img');
                            if (db.preguntas[preg.i].pregunta.imagen.substr(0, 5) == 'blob:') {
                                imgChild.setAttribute('src', db.preguntas[preg.i].pregunta.imagen);
                            } else {
                                imgChild.setAttribute('src', db.resources + db.preguntas[preg.i].pregunta.imagen);
                            }
                            spanImgChild.appendChild(imgChild);
                            dChild.appendChild(spanImgChild);
                        } else if (db.preguntas[preg.i].pregunta.audio != '') {
                            var spanAudioChild = document.createElement('span');
                            spanAudioChild.setAttribute('class', 'g__cnt__end__src__tbl__wrp__nf__qst__sd');
                            var audioChild = document.createElement('audio');
                            audioChild.setAttribute('controls', '');

                            var sourceChild = document.createElement('source');
                            if (db.preguntas[preg.i].pregunta.audio.substr(0, 5) == 'blob:') {
                                sourceChild.setAttribute('src', db.preguntas[preg.i].pregunta.audio);
                            } else {
                                sourceChild.setAttribute('src', db.resources + db.preguntas[preg.i].pregunta.audio);
                            }

                            sourceChild.setAttribute('type', 'audio/mp3');
                            sourceChild.innerHTML = 'Tu navegador no soporta audio HTML5.';
                            audioChild.appendChild(sourceChild);
                            spanAudioChild.appendChild(audioChild);
                            dChild.appendChild(spanAudioChild);
                        } else if (db.preguntas[preg.i].pregunta.video != '') {
                            var spanVideoChild = document.createElement('span');
                            spanVideoChild.setAttribute('class', 'g__cnt__end__src__tbl__wrp__nf__qst__vd');
                            var videoChild = document.createElement('iframe');
                            videoChild.setAttribute('src', db.preguntas[preg.i].pregunta.video);
                            videoChild.setAttribute('allowfullscreen', '');
                            videoChild.setAttribute('webkitallowfullscreen', '');
                            videoChild.setAttribute('mozallowfullscreen', '');
                            videoChild.setAttribute('width', '1600');
                            videoChild.setAttribute('height', '900');
                            videoChild.setAttribute('frameborder', '0');

                            spanVideoChild.appendChild(videoChild);
                            dChild.appendChild(spanVideoChild);
                        }
                        cChild.appendChild(dChild);
                    }

                    var eChild = document.createElement('div');
                    eChild.setAttribute('class', 'g__cnt__end__src__tbl__wrp__nf__nsw');
                    if (preg.s) {
                        eChild.innerHTML = "<span class='g__cnt__end__src__tbl__wrp__nf__nsw__tt'>" + preg.a + "<span>";
                    } else {
                        eChild.innerHTML = "<span class='g__cnt__end__src__tbl__wrp__nf__nsw__tt wrng'>" + preg.a + "<span>";
                    }
                    if (!preg.s) {
                        //incluir datos respuesta correcta
                        eChild.innerHTML += "<span class='g__cnt__end__src__tbl__wrp__nf__nsw__tt'>" + db.preguntas[preg.i].respuesta.texto + "</span>";
                    }
                    cChild.appendChild(eChild);
                    aChild.appendChild(cChild);

                    var fChild = document.createElement('div');
                    fChild.setAttribute('class', 'g__cnt__end__src__tbl__wrp__i');
                    if (preg.s) {
                        fChild.innerHTML = '<svg width="18" height="13" viewBox="0 0 18 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 1L6 12L1 7" stroke="#9BD84C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg> ';
                    } else {
                        fChild.innerHTML = '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 1L1 13" stroke="#C2371A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M1 1L13 13" stroke="#C2371A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
                    }
                    aChild.appendChild(fChild);
                    document.getElementById('resultList').appendChild(aChild);

                    iterate++;
                    if (!preg.s) {
                        lastIncorrect = preg.i;
                    }
                }
            });

            if (db.modoArcade && db.modoInfinito) {
                document.getElementById('actiertos').innerHTML = aciertos;
            } else {
                document.getElementById('actiertos').innerHTML = aciertos + ' <span class="g__cnt__end__rnk__hts__nb--ll">/ ' + respuestasContestadas.length + '</span>';
            }
            break;

        case 'Sopa':

            let contadorindex = 0;
            let correctas = [];
            let numpantallas = db.numPaginas;
            for (let i = 0; i < numpantallas; i++) {

                let screenContainer = document.createElement('div');
                screenContainer.setAttribute('id', 'screen_' + (i + 1));
                screenContainer.setAttribute('class', 'g__cnt__end__src__tbl__wrp__scrn');

                let pageTitle = document.createElement('div');
                pageTitle.setAttribute('class', 'screen__title');
                pageTitle.setAttribute('class', 'g__cnt__end__src__tbl__wrp__scrn__hd');
                pageTitle.innerHTML = db.lang.pagina + " " + (i + 1);
                screenContainer.appendChild(pageTitle);

                if (db.resultados) {

                    db.resultados.filter(elemento => elemento.pantalla == i).forEach((elemento, index) => {

                        //correctas
                        if (elemento.idenunciado !== "") {

                            correctas.push(elemento.valor);
                            let respWp = document.createElement('div');
                            respWp.setAttribute('class', 'g__cnt__end__src__tbl__wrp__rw--' + (contadorindex++));
                            respWp.setAttribute('class', 'g__cnt__end__src__tbl__wrp__scrn__item');

                            let numberWp = document.createElement('div');
                            numberWp.setAttribute('class', 'g__cnt__end__src__tbl__wrp__nb');
                            numberWp.innerHTML = "<span>" + (contadorindex) + "</span>";
                            respWp.appendChild(numberWp);

                            let wordWp = document.createElement('div');
                            wordWp.setAttribute('class', 'g__cnt__end__src__tbl__wrp__nf__qst');
                            wordWp.innerHTML = "<span class='g__cnt__end__src__tbl__wrp__nf__qst__tt'>" + elemento.valor + "</span>";
                            respWp.appendChild(wordWp);

                            let svgWp = document.createElement('div');
                            svgWp.setAttribute('class', 'g__cnt__end__src__tbl__wrp__i');
                            svgWp.innerHTML = '<svg width="18" height="13" viewBox="0 0 18 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 1L6 12L1 7" stroke="#9BD84C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg> ';
                            respWp.appendChild(svgWp);
                            screenContainer.appendChild(respWp);


                        }

                    })
                }
                //incorrectas 

                for (let o = 0; o < db.preguntas[i].RESPUESTAS.length; o++) {
                    if (db.preguntas[i].RESPUESTAS[o].RESPUESTA !== '') {

                        if (!correctas.includes(db.preguntas[i].RESPUESTAS[o].RESPUESTA)) {
                            let respWpErr = document.createElement('div');
                            respWpErr.setAttribute('class', 'g__cnt__end__src__tbl__wrp__rw--' + (contadorindex++) + ' wrg');
                            respWpErr.classList.add('g__cnt__end__src__tbl__wrp__scrn__item');
                            let numberWpErr = document.createElement('div');
                            numberWpErr.setAttribute('class', 'g__cnt__end__src__tbl__wrp__nb');
                            numberWpErr.innerHTML = "<span>" + (contadorindex) + "</span>";
                            respWpErr.appendChild(numberWpErr);

                            let wordWpErr = document.createElement('div');
                            wordWpErr.setAttribute('class', 'g__cnt__end__src__tbl__wrp__nf__qst');

                            wordWpErr.innerHTML = "<span class='g__cnt__end__src__tbl__wrp__nf__qst__tt'>" + db.preguntas[i].RESPUESTAS[o].RESPUESTA + "</span>";
                            respWpErr.appendChild(wordWpErr);

                            let svgWpErr = document.createElement('div');
                            svgWpErr.setAttribute('class', 'g__cnt__end__src__tbl__wrp__i');
                            svgWpErr.innerHTML = '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 1L1 13" stroke="#C2371A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M1 1L13 13" stroke="#C2371A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
                            respWpErr.appendChild(svgWpErr);

                            screenContainer.appendChild(respWpErr);


                        } else {

                            correctas.filter((item) => item !== db.preguntas[i].RESPUESTAS[o].RESPUESTA)

                        }

                    }

                }



                correctas = [];
                contadorindex = 0;
                document.getElementById('resultList').appendChild(screenContainer);
            }


            break;

        case 'Crucigrama':


            let contador = 0;
            let screenContainer = document.createElement('div');

            for (let pantalla = 0; pantalla < db.preguntas.length; pantalla++) {

                let respuestasBuscar = [];


                for (let i = 0; i < db.preguntas[pantalla].PREGUNTAS.length; i++) {

                    if (db.preguntas[pantalla].PREGUNTAS[i].RESPUESTAS[0].RESPUESTA !== '') {
                        respuestasBuscar.push(db.preguntas[pantalla].PREGUNTAS[i].RESPUESTAS[0].RESPUESTA);
                    }

                }

                screenContainer.setAttribute('id', 'screen_' + (pantalla + 1));
                screenContainer.setAttribute('class', 'g__cnt__end__src__tbl__wrp__scrn');

                let pageTitle = document.createElement('div');
                pageTitle.setAttribute('class', 'screen__title');
                pageTitle.setAttribute('class', 'g__cnt__end__src__tbl__wrp__scrn__hd');
                pageTitle.innerHTML = db.lang.pagina + " " + (pantalla + 1);
                screenContainer.appendChild(pageTitle);

                let dataCopy = db.data.r;

                /*dataCopy.forEach(answer => {
                    let correct = dataCopy.filter(answ => answ.s === 1 && answ.i.split(':')[1] === answer.i.split(':')[1])[0];
                    if (correct !== undefined) {
                        answer.i = pantalla + ':' + db.data.r.indexOf(correct);
                    }
                });*/

                for (let palabras = 0; palabras < db.preguntas[pantalla].distribution.words.length; palabras++) {

                    for (let cont = 0; cont < dataCopy.length; cont++) {

                        if (typeof dataCopy[cont].i === 'string') {

                            let aux = dataCopy[cont].i.split(':');

                            //incorrectas 
                            if (parseInt(aux[0]) === pantalla && parseInt(aux[1]) === palabras && dataCopy[cont].s === 0) {

                                let respWpErr = document.createElement('div');
                                respWpErr.setAttribute('class', 'g__cnt__end__src__tbl__wrp__rw--' + (contador++) + ' wrg');
                                respWpErr.classList.add('g__cnt__end__src__tbl__wrp__scrn__item');
                                // let numberWpErr = document.createElement('div');
                                // numberWpErr.setAttribute('class', 'g__cnt__end__src__tbl__wrp__nb');
                                // numberWpErr.innerHTML="<span>" + (contador) + "</span>";
                                // respWpErr.appendChild(numberWpErr);

                                let wordWpErr = document.createElement('div');
                                wordWpErr.setAttribute('class', 'g__cnt__end__src__tbl__wrp__nf__qst');

                                wordWpErr.innerHTML = "<span class='g__cnt__end__src__tbl__wrp__nf__qst__tt'>" + dataCopy[cont].a + "</span>";
                                respWpErr.appendChild(wordWpErr);

                                let svgWpErr = document.createElement('div');
                                svgWpErr.setAttribute('class', 'g__cnt__end__src__tbl__wrp__i');
                                svgWpErr.innerHTML = '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 1L1 13" stroke="#C2371A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M1 1L13 13" stroke="#C2371A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
                                respWpErr.appendChild(svgWpErr);

                                screenContainer.appendChild(respWpErr);
                            }
                        }

                    }

                    for (let cont = 0; cont < dataCopy.length; cont++) {

                        if (typeof dataCopy[cont].i === 'string') {

                            let aux = dataCopy[cont].i.split(':');


                            //correctas
                            if (parseInt(aux[0]) === pantalla && parseInt(aux[1]) === palabras && dataCopy[cont].s === 1) {


                                let respWp = document.createElement('div');
                                respWp.setAttribute('class', 'g__cnt__end__src__tbl__wrp__rw--' + (contador++));
                                respWp.setAttribute('class', 'g__cnt__end__src__tbl__wrp__scrn__item');

                                // let numberWp = document.createElement('div');
                                // numberWp.setAttribute('class', 'g__cnt__end__src__tbl__wrp__nb');
                                // numberWp.innerHTML="<span>" + (contador) + "</span>";
                                // respWp.appendChild(numberWp);

                                let wordWp = document.createElement('div');
                                wordWp.setAttribute('class', 'g__cnt__end__src__tbl__wrp__nf__qst');
                                wordWp.innerHTML = "<span class='g__cnt__end__src__tbl__wrp__nf__qst__tt'>" + dataCopy[cont].a + "</span>";
                                respWp.appendChild(wordWp);

                                let svgWp = document.createElement('div');
                                svgWp.setAttribute('class', 'g__cnt__end__src__tbl__wrp__i');
                                svgWp.innerHTML = '<svg width="18" height="13" viewBox="0 0 18 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 1L6 12L1 7" stroke="#9BD84C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg> ';
                                respWp.appendChild(svgWp);
                                screenContainer.appendChild(respWp);
                                let indiceEliminar = respuestasBuscar.indexOf(dataCopy[cont].a);
                                if (indiceEliminar > -1) {
                                    respuestasBuscar.splice(indiceEliminar, 1);
                                }
                            }

                        }
                    }



                }

                for (let i = 0; i < respuestasBuscar.length; i++) {

                    let respWpErr = document.createElement('div');
                    respWpErr.setAttribute('class', 'g__cnt__end__src__tbl__wrp__rw--' + (contador++) + ' wrg');
                    respWpErr.classList.add('g__cnt__end__src__tbl__wrp__scrn__item');
                    // let numberWpErr = document.createElement('div');
                    // numberWpErr.setAttribute('class', 'g__cnt__end__src__tbl__wrp__nb');
                    // numberWpErr.innerHTML="<span>" + (contador) + "</span>";
                    // respWpErr.appendChild(numberWpErr);

                    let wordWpErr = document.createElement('div');
                    wordWpErr.setAttribute('class', 'g__cnt__end__src__tbl__wrp__nf__qst');

                    wordWpErr.innerHTML = "<span class='g__cnt__end__src__tbl__wrp__nf__qst__tt'>" + respuestasBuscar[i] + "</span>";
                    respWpErr.appendChild(wordWpErr);

                    let svgWpErr = document.createElement('div');
                    svgWpErr.setAttribute('class', 'g__cnt__end__src__tbl__wrp__i');
                    svgWpErr.innerHTML = '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 1L1 13" stroke="#C2371A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M1 1L13 13" stroke="#C2371A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
                    respWpErr.appendChild(svgWpErr);

                    screenContainer.appendChild(respWpErr);

                }

                contador = 0;
            }

            document.getElementById('resultList').appendChild(screenContainer);

            break;
        case 'relacionarColumnas':
        case 'relacionarMosaico':
            var aciertos = 0;
            let totalPairs = 0;
            let currentScreen = 0;
            const resultList = document.getElementById('resultList');
            let memoryScreenContainer = document.createElement('div');
            memoryScreenContainer.setAttribute('id', 'screen_1');

            let pageTitle = document.createElement('div');
            pageTitle.setAttribute('class', 'screen__title');
            pageTitle.innerHTML = db.lang.pagina + " 1";
            memoryScreenContainer.appendChild(pageTitle);

            db.data.r.forEach(result => {
                let [pregI, pairI, elemI] = result.i.split(':');
                let [pregA, pairA, elemA] = result.a.split(':');
                if (pregI != currentScreen) {
                    resultList.appendChild(memoryScreenContainer);

                    memoryScreenContainer = document.createElement('div');
                    // memoryScreenContainer.setAttribute('id', 'screen_' + Number(pregI) + 1);

                    let pageTitle = document.createElement('div');
                    pageTitle.setAttribute('class', 'screen__title');
                    pageTitle.innerHTML = db.lang.pagina + " " + (Number(pregI) + 1);
                    memoryScreenContainer.appendChild(pageTitle);

                    currentScreen = pregI;
                }

                let respWp = document.createElement('div');
                respWp.setAttribute('class', 'g__cnt__end__src__tbl__wrp__rw');

                [db.preguntas[pregI].PREGUNTAS[pairI].RESPUESTAS[elemI], db.preguntas[pregA].PREGUNTAS[pairA].RESPUESTAS[elemA]].forEach(elem => {
                    let wordWp = document.createElement('div');
                    wordWp.setAttribute('class', 'g__cnt__end__src__tbl__wrp__nf__qst');
                    switch (elem.MULTIMEDIA_TIPO) {
                        case 'image':
                            let img = document.createElement('img');
                            img.setAttribute('src', db.resources + elem.MULTIMEDIA);
                            wordWp.appendChild(img);
                            break;
                        case 'audio':
                            let audio = document.createElement('audio');
                            audio.setAttribute('src', db.resources + elem.MULTIMEDIA);
                            wordWp.appendChild(audio);
                            break;
                    }
                    if (!(elem.MULTIMEDIA && elem.MULTIMEDIA_SOLO)) {
                        let pText = document.createElement('span');
                        pText.classList.add('g__cnt__end__src__tbl__wrp__nf__qst__tt');
                        pText.innerHTML = elem.RESPUESTA;
                        wordWp.appendChild(pText);
                    }
                    respWp.appendChild(wordWp);
                });

                let svgWp = document.createElement('div');
                svgWp.setAttribute('class', 'g__cnt__end__src__tbl__wrp__i');

                if (result.s === 1) {
                    aciertos++;
                    svgWp.innerHTML = '<svg width="18" height="13" viewBox="0 0 18 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 1L6 12L1 7" stroke="#9BD84C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg> ';
                } else {
                    respWp.classList.add('wrg');
                    svgWp.innerHTML = '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 1L1 13" stroke="#C2371A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M1 1L13 13" stroke="#C2371A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
                }
                respWp.appendChild(svgWp);
                memoryScreenContainer.appendChild(respWp);
            });

            document.getElementById('resultList').appendChild(memoryScreenContainer);

            db.preguntas.forEach(preg => totalPairs += preg.PREGUNTAS.length);
            document.getElementById('actiertos').innerHTML = aciertos + ' <span class="g__cnt__end__rnk__hts__nb--ll">/ ' + totalPairs + '</span>';
            break;
    }
}

const cancelFullscreen = () => {
    try {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
        else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        }
        else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        } else {
            window.parent.postMessage({ type: 'activity-fullscreenexit' });
        }
    } catch (error) {
        console.error(error);
    }
}

function ColorToHex(color) {
    var hexadecimal = color.toString(16);
    return hexadecimal.length == 1 ? "0" + hexadecimal : hexadecimal;
}

function ConvertRGBtoHex(red, green, blue) {
    return "#" + ColorToHex(red) + ColorToHex(green) + ColorToHex(blue);
}

function LightenDarkenColor(col, amt) {
    col = col.slice(1);

    var num = parseInt(col, 16);
    var r = (num >> 16) + amt;

    if (r > 255) r = 255;
    else if (r < 0) r = 0;

    var g = ((num >> 8) & 0x00FF) + amt;

    if (g > 255) g = 255;
    else if (g < 0) g = 0;

    var b = (num & 0x0000FF) + amt;

    if (b > 255) b = 255;
    else if (b < 0) b = 0;

    return ConvertRGBtoHex(r, g, b);
}

function agnadirRecursoClase(color, propiedad, clase, subClase = '', subTag = '') {
    Array.prototype.forEach.call(document.getElementsByClassName(clase), function (el) {

        if (subClase != '') {
            Array.prototype.forEach.call(el.getElementsByClassName(subClase), function (el2) {
                el2.style[propiedad] = color;
            });
        } else if (subTag != '') {
            Array.prototype.forEach.call(el.getElementsByTagName(subTag), function (el2) {
                el2.style[propiedad] = color;
            })
        } else {
            el.style[propiedad] = color;
        }

    });
}

window.comun = Comun;