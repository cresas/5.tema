//impide zoom navegador con ctrl + ruleta
document.addEventListener('keydown', function(e) {    
    if((event.keyCode == 107 && event.ctrlKey == true) || (event.keyCode == 109 && event.ctrlKey == true))
    {
        event.preventDefault(); 
    }

    document.addEventListener('wheel', function(e) {    
        if(e.ctrlKey == true)
        {
            e.preventDefault(); 
        }
    }, {passive: false});
});
document.addEventListener('gesturestart', e => e.preventDefault());
document.addEventListener('gesturechange', e => e.preventDefault());
document.addEventListener('gestureend', e => e.preventDefault());
document.addEventListener('keydown', function(e) {
    if(e.keyCode == 107 || e.keyCode == 187 || e.keyCode == 109 || e.keyCode == 189){
        if(e.ctrlKey == true) {
            e.preventDefault();
        }
    }
});

const alphabets = [];

const buildAlphabet = ( alphabet ) => {
    if (alphabets[alphabet] === undefined) {
        const dictionary = {
            latin:      [{ start: 65, end: 65, weigth: 3 },
                        { start: 66, end: 68 },
                        { start: 69, end: 69, weigth: 3 },
                        { start: 70, end: 72 },
                        { start: 73, end: 73, weigth: 3 },
                        { start: 74, end: 78 },
                        { start: 79, end: 79, weigth: 3 },
                        { start: 80, end: 84 },
                        { start: 85, end: 85, weigth: 3 },
                        { start: 86, end: 90 }],
            numbers:    [{ start: 48, end: 57 }],            
            han:        [{ start: 19968, end: 40959 }],
            katakana:   [{ start: 12449, end: 12538 }],
            hiragana:   [{ start: 12353, end: 12436 }],
            bopomofo:   [{ start: 12549, end: 12585 }],
            hangul:     [{ start: 4352, end: 4370 },
                        { start: 4449, end: 4469 },
                        { start: 4520, end: 4546 }],
            devanagari: [{ start: 2308, end: 2361 }],
            bengali:    [{ start: 2437, end: 2444 },
                        { start: 2447, end: 2448 },
                        { start: 2451, end: 2472 },
                        { start: 2474, end: 2480},
                        { start: 2482, end: 2482},
                        { start: 2486, end: 2489}],
            thai:       [{ start: 3585, end: 3630 }],
            ethiopic:   [{ start: 4608, end: 4680 },
                        { start: 4682, end: 4685 },
                        { start: 4688, end: 4694 },
                        { start: 4696, end: 4696 },
                        { start: 4698, end: 4701 },
                        { start: 4704, end: 4744 },
                        { start: 4746, end: 4749 },
                        { start: 4752, end: 4784 },
                        { start: 4786, end: 4789 },
                        { start: 4792, end: 4798 },
                        { start: 4800, end: 4800 },
                        { start: 4802, end: 4805 },
                        { start: 4808, end: 4822 },
                        { start: 4824, end: 4880 },
                        { start: 4882, end: 4885 },
                        { start: 4888, end: 4954 }],
            arabic:     [{ start: 1569, end: 1569 },
                        { start: 1575, end: 1594 },
                        { start: 1601, end: 1610 }],     
            hebrew:     [{ start: 1488, end: 1514 }],
            greek:      [{ start: 913, end: 929 },
                        { start: 931, end: 937 }],
            cyrillic:   [{ start: 1040, end: 1071 }]
        }
        const rangeBlock = [];
        if (dictionary[ alphabet ].length > 1) {
            let initialRangeBlock = 0;
            dictionary[ alphabet ].forEach(( range, indexRange ) => {
                let weigth;
                if (range.weigth === undefined) {
                    weigth = range.end - range.start;
                } else {
                    weigth = range.weigth - 1;
                }
                rangeBlock[indexRange] = initialRangeBlock + weigth;
                initialRangeBlock += weigth + 1;
            });
        } else {
            rangeBlock[0] = 0;
        }
        alphabets[ alphabet ] = {
            dictionary: dictionary[ alphabet ],
            range: rangeBlock
        };
    }
}

const getRandomLetter = ( alphabet ) => {
    buildAlphabet( alphabet );
    let idBlock = 0;
    if (alphabets[ alphabet ].range.length > 1) {
        const randomIndex = Math.trunc( Math.random() * ( alphabets[ alphabet ].range[ alphabets[ alphabet ].range.length - 1 ] + 1 ) );
        let i = 0;
        do {
            idBlock = i;
            i++;
        } while (( i < alphabets[ alphabet ].range.length ) && ( randomIndex > alphabets[ alphabet ].range[ i - 1 ] ));
    }
    const code = Math.trunc( Math.random() * ( alphabets[ alphabet ].dictionary[idBlock].end - alphabets[ alphabet ].dictionary[idBlock].start + 1 ) ) + alphabets[ alphabet ].dictionary[idBlock].start;
    return String.fromCharCode(code)
}

function pruebaRendimiento(bootloader) {
    var fps = 0;
    var i = 0;
    var suma = 0;
    var count = 0;

    window.requestAnimFrame = (function(){
        return  window.requestAnimationFrame || 
        window.webkitRequestAnimationFrame   || 
        window.mozRequestAnimationFrame      || 
        window.oRequestAnimationFrame        || 
        window.msRequestAnimationFrame       || 
        function(callback, element){
            window.setTimeout(function(){
                callback(+new Date);
            }, 1000 / 60);
        };
    })();

    var lastRun;
    var game_running = true;
    var show_fps = false;
    function gameLoop(){
        if(!lastRun) {
            lastRun = new Date().getTime();
            requestAnimFrame(gameLoop);
            return;
        }
        var delta = (new Date().getTime() - lastRun)/1000;
        lastRun = new Date().getTime();
        fps = 1/delta;
        if (show_fps) {
            bootloader.bajarRendimineto=0;
            if((suma/count)<24){
                bootloader.bajarRendimineto=1;
                document.getElementById('Ntf').classList.add('act');
                document.getElementById('ftr').style['z-index']=500;
                bootloader.time.addEvent({
                    delay: 5000,
                    callback: () => {
                        document.getElementById('Ntf').classList.remove('act');
                        document.getElementById('ftr').style['z-index']='';
                    }
                });
            }
        }

        if (game_running) requestAnimFrame(gameLoop);
        if(i<10){
            i++;
        }else {
            if(i<30){
                count++;
                suma+=fps;
                i++;
            }else {
                show_fps = true;
                game_running = false;
            }
        }
    }
    gameLoop();
}

const createImageComponent = (bootloader, id, source, clickTap, hoverLongpress) => {
    let imageComponent = document.createElement('div');
    imageComponent.setAttribute('id', 'gImg--' + id);
    imageComponent.classList.add('g__img');

    let imageBox = document.createElement('div');
    imageBox.classList.add('g__img__bx');

    let imageElement = document.createElement('img');
    imageElement.setAttribute('id', 'img--' + id);
    imageElement.setAttribute('alt', id);
    imageElement.setAttribute('src', source);

    let lupa = document.createElement('span');
    lupa.classList.add('g__img__ico');
    lupa.innerHTML = bootloader.cache.html.get('imgLupa');
    imageElement.imgLupa = lupa;

    imageBox.appendChild(imageElement);
    imageBox.appendChild(lupa);

    imageComponent.appendChild(imageBox);

    if(!document.getElementById('gImgCntr')) {
        let imageCntr = document.createElement('div');
        imageCntr.setAttribute('id', 'gImgCntr');
        imageCntr.classList.add('g__img__cntr');

        let imageCntrWp = document.createElement('div');
        imageCntrWp.setAttribute('id', 'gImgCntrWp');
        imageCntrWp.classList.add('g__img__cntr__wp');
        imageCntrWp.innerHTML = bootloader.cache.html.get('imgLoading');
        imageCntr.appendChild(imageCntrWp);

        let fbRoot = document.getElementById('fb-root');
        fbRoot.parentElement.insertBefore(imageCntr, fbRoot);
    }

    if(hoverLongpress){  
        imageElement.onpointerover = function() {
            // if(typeof bootloader.ocultarRespuesta !== 'undefined') bootloader.ocultarRespuesta.remove();
            var imgBig = document.createElement('img');
            imgBig.setAttribute('id', 'imgBig--' + id);
            imgBig.setAttribute('src', source);
            
            document.getElementById('gImgCntrWp').appendChild(imgBig);
            document.getElementById('gImgCntr').classList.add('act');
        }

        imageElement.onpointerout = function() {
            //eliminar img de imageCntrWp
            Array.from(document.getElementById('gImgCntr').getElementsByTagName('img')).forEach((element) => {
                element.remove();
            });
            document.getElementById('gImgCntr').classList.remove('act');
        }
    }

    if(clickTap){  
        document.getElementById('gImgCntr').classList.add('clktp');
        imageElement.addEventListener('click', () => {
            // if(typeof bootloader.ocultarRespuesta !== 'undefined') bootloader.ocultarRespuesta.remove();
            var imgBig = document.createElement('img');
            imgBig.setAttribute('id', 'imgBig--' + id);
            imgBig.setAttribute('src', source);
            
            document.getElementById('gImgCntrWp').appendChild(imgBig);
            document.getElementById('gImgCntr').classList.add('act');
        });

        imageElement.oncontextmenu = function(e) {
            e.preventDefault();
            // if(typeof bootloader.ocultarRespuesta !== 'undefined') bootloader.ocultarRespuesta.remove();
            var imgBig = document.createElement('img');
            imgBig.setAttribute('id', 'imgBig--' + id);
            imgBig.setAttribute('src', source);
            
            document.getElementById('gImgCntrWp').appendChild(imgBig);
            document.getElementById('gImgCntr').classList.add('act');
        }

        document.getElementById('gImgCntr').onpointerdown = function(e) {
            //eliminar img de imageCntrWp
            Array.from(this.getElementsByTagName('img')).forEach((element) => {
                element.remove();
            });
            this.classList.remove('act');
            e.stopPropagation();
        }
    }

    return imageComponent;
}

class ImageComponent {
    constructor({bootloader, id, source}) {
        this.node = document.createElement('div');
        this.node.setAttribute('id', 'gImg--' + id);
        this.node.classList.add('g__img');

        let imageBox = document.createElement('div');
        imageBox.classList.add('g__img__bx');

        this.imageElement = document.createElement('img');
        this.imageElement.setAttribute('id', 'img--' + id);
        this.imageElement.setAttribute('alt', id);
        this.imageElement.setAttribute('src', source);

        this.lupa = document.createElement('span');
        this.lupa.classList.add('g__img__ico');
        this.lupa.innerHTML = bootloader.cache.html.get('imgLupa');

        imageBox.appendChild(this.imageElement);
        imageBox.appendChild(this.lupa);

        this.node.appendChild(imageBox);

        this.imageCntr = document.getElementById('gImgCntr');
        if(this.imageCntr === null) {
            this.imageCntr = document.createElement('div');
            this.imageCntr.setAttribute('id', 'gImgCntr');
            this.imageCntr.classList.add('g__img__cntr');

            let imageCntrWp = document.createElement('div');
            imageCntrWp.setAttribute('id', 'gImgCntrWp');
            imageCntrWp.classList.add('g__img__cntr__wp');
            imageCntrWp.innerHTML = bootloader.cache.html.get('imgLoading');
            this.imageCntr.appendChild(imageCntrWp);

            let fbRoot = document.getElementById('fb-root');
            fbRoot.parentElement.insertBefore(this.imageCntr, fbRoot);

            this.imageCntr.addEventListener('click', (e) => {
                this.close();
                e.stopPropagation();
            });
        }
    }

    open = () => {
        let imgBig = this.imageElement.cloneNode(true);
        this.imageCntr.childNodes[0].appendChild(imgBig);
        this.imageCntr.classList.add('act');
        this.imageCntr.style.setProperty('pointer-events', 'auto');
    }

    close = () => {
        Array.from(this.imageCntr.getElementsByTagName('img')).forEach(element => element.remove());
        this.imageCntr.classList.remove('act');
        this.imageCntr.style.setProperty('pointer-events', 'none');
    }
}

const createAudioComponent = (bootloader, id, source, autoplay) => {
    let audioElem = document.createElement('div');
    audioElem.setAttribute('id', 'gAudio--' + id);
    audioElem.classList.add('g__audio');
    audioElem.innerHTML = bootloader.cache.html.get('audioComponent');
    audioElem.getElementsByTagName('source')[0].src = source;

    const audio = audioElem.querySelector('.audioPlayer');
    const playButton = audioElem.querySelector("#gAudioCntrsPlay");
    const pauseButton = audioElem.querySelector("#gAudioCntrsPause");
    const circle = audioElem.querySelector('.g__audio__pgrss__ln');
    const circunferencia = 2 * Math.PI * parseFloat(circle.getAttribute('r'));
    let isPlaying = false;

    // Función para activar la reproducción
    const playAudio = () => {
        audio.play();
        isPlaying = true;
        playButton.style.display = "none";
        pauseButton.style.display = "flex";
    }

    // Función para pausar la reproducción
    const pauseAudio = () => {
        audio.pause();
        isPlaying = false;
        pauseButton.style.display = "none";
        playButton.style.display = "flex";
    }

    audio.addEventListener('ended', pauseAudio);

    // Evento para actualizar el progreso de la reproducción
    audio.addEventListener('timeupdate', () => {
        const progress = audio.currentTime / audio.duration * 100;
        const dashoffset = circunferencia * (1 - progress / 100);
        audioElem.getElementsByClassName('g__audio__wp')[0].style.setProperty('--progressAudio', progress);
        audioElem.getElementsByClassName('g__audio__wp')[0].style.setProperty('--dashoffsetAudio', dashoffset);
        circle.style.setProperty('stroke-dashoffset', dashoffset, 'important');
    });

    playButton.addEventListener('click', () => {
        if (!isPlaying) {
            playAudio();
            audio.play();
        }
    });

    audio.addEventListener('playing', () => {
        if (!isUserInteracted) {
            isUserInteracted = true;
        }
    });

    pauseButton.addEventListener('click', () => {
        if (isPlaying) {
            pauseAudio();
            audio.pause();
        }
    });

    let isUserInteracted = false;

    if(!autoplay) {
        audio.removeAttribute('autoplay');
    }

    // Ocultamos el botón de pausa al cargar la página
    if(audio.hasAttribute('autoplay')) {
        playButton.style.display = "none";
        isPlaying = true;
    } else {
        pauseButton.style.display = "none";
    }

    audioElem.getAudioElement = audio;
    return audioElem;
}

class AudioComponent {
    constructor(bootloader, id, source, autoplay) {
        this.node = document.createElement('div');
        this.node.setAttribute('id', 'gAudio--' + id);
        this.node.classList.add('g__audio');
        this.node.innerHTML = bootloader.cache.html.get('audioComponent');
        this.node.getElementsByTagName('source')[0].src = source;

        this.audio = this.node.querySelector('.audioPlayer');
        this.playButton = this.node.querySelector("#gAudioCntrsPlay");
        this.pauseButton = this.node.querySelector("#gAudioCntrsPause");
        this.circle = this.node.querySelector('.g__audio__pgrss__ln');
        this.circunferencia = 2 * Math.PI * parseFloat(this.circle.getAttribute('r'));
        this.isPlaying = false;

        this.audio.addEventListener('ended', this.pauseAudio);

        // Evento para actualizar el progreso de la reproducción
        this.audio.addEventListener('timeupdate', () => {
            const progress = this.audio.currentTime / this.audio.duration * 100;
            const dashoffset = this.circunferencia * (1 - progress / 100);
            this.node.getElementsByClassName('g__audio__wp')[0].style.setProperty('--progressAudio', progress);
            this.node.getElementsByClassName('g__audio__wp')[0].style.setProperty('--dashoffsetAudio', dashoffset);
            this.circle.style.setProperty('stroke-dashoffset', dashoffset, 'important');
        });

        this.playButton.addEventListener('click', (e) => {
            if (!this.isPlaying) {
                this.playAudio();
                this.audio.play();
            }
            e.stopPropagation();
        });
        
        let isUserInteracted = false;

        this.audio.addEventListener('playing', () => {
            if (!isUserInteracted) {
                isUserInteracted = true;
            }
        });

        this.pauseButton.addEventListener('click', (e) => {
            if (this.isPlaying) {
                this.pauseAudio();
                this.audio.pause();
            }
            e.stopPropagation();
        });

        if (!autoplay) {
            this.audio.removeAttribute('autoplay');
        }

        // Ocultamos el botón de pausa al cargar la página
        if (this.audio.hasAttribute('autoplay')) {
            this.playButton.style.display = "none";
            this.isPlaying = true;
        } else {
            this.pauseButton.style.display = "none";
        }
    }

    // Función para activar la reproducción
    playAudio = () => {
        this.audio.play();
        this.isPlaying = true;
        this.playButton.style.display = "none";
        this.pauseButton.style.display = "flex";
    }

    // Función para pausar la reproducción
    pauseAudio = () => {
        this.audio.pause();
        this.isPlaying = false;
        this.pauseButton.style.display = "none";
        this.playButton.style.display = "flex";
    }

    // Función para parar la reproducción
    stopAudio = () => {
        this.audio.pause();
        this.audio.currentTime = 0;
        this.isPlaying = false;
        this.pauseButton.style.display = "none";
        this.playButton.style.display = "flex";
    }

}