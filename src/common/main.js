// const dataCache = document.getElementById('datosGenerales').getAttribute('data-cache');
// const gameName = activityData.type;
// let Preload;
// let Comun;
// let Bootloader;
// if (dataCache == '0') {
//     Preload = await import(`../../src/specific/scenes/Preload.js`);
//     Comun = await import(`../../src/common/common.js`);
//     Bootloader = await import(`../../src/specific/scenes/Bootloader.js`);
// } else {
//     const dataResources = document.getElementById('datosGenerales').getAttribute('data-resources');
//     Preload = await import(`${dataResources}jsobfuscated/activities/${gameName}/scenes/Preload.js?v=${dataCache}`);
//     Comun = await import(`${dataResources}jsobfuscated/activities/commonV2/common.js?v=${dataCache}`);
//     Bootloader = await import(`${dataResources}jsobfuscated/activities/${gameName}/scenes/Bootloader.js?v=${dataCache}`);
// }

//fullscrean
document.getElementsByClassName('fsc__btn')[0].addEventListener('click', function () {
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
});

//opciones
document.getElementById('options').addEventListener('click', function() {
    if (document.getElementById('g__opt').classList.contains('act')) {
        document.getElementById('g__opt').classList.remove('act');
        document.getElementById('options').classList.remove('prss');
        // document.getElementById('g__cnt__ini').classList.add('act');
    } else {
        document.getElementById('g__opt').classList.add('act');
        document.getElementById('options').classList.add('prss');
        // document.getElementById('g__cnt__ini').classList.remove('act');
    }
});
//desplegable
document.getElementById('infoSound').addEventListener('click', function() {
    var x = document.getElementById('infoSound').getAttribute("aria-expanded");
    x == "true" ? x="false" : x="true";
    document.getElementById('infoSound').setAttribute("aria-expanded", x);
});
document.getElementById('infoInfo').addEventListener('click', function() {
    var x = document.getElementById('infoInfo').getAttribute("aria-expanded");
    x == "true" ? x="false" : x="true";
    document.getElementById('infoInfo').setAttribute("aria-expanded", x);
});

//cerrar options
document.getElementById('return').addEventListener('click', function() {
    document.getElementById('g__opt').classList.remove('act');
});

//teclas
document.body.addEventListener("keydown", function(e) {
    //esc
    if(e.keyCode===27){
        if(document.getElementById('gFsc').classList.contains('act')) {
            document.getElementById('gFsc').classList.remove('act');
        }
        if(document.getElementById('g__opt').classList.contains('act')) {
            document.getElementById('g__opt').classList.remove('act');
        }
        if(document.getElementById('g__rte').classList.contains('act')){
            document.getElementById('g__rte').classList.remove('act');
        }
    }
});

const config = {
    // para establecer tamanos
    scale: {
        mode: Phaser.Scale.RESIZE,
        parent: 'gCntr',
        width: 640,
        height: 640,
    },
    type: Phaser.AUTO, // renderizado
    transparent: true,
    antialias: true,
    roundPixels: true,
    dom: {
        createContainer: true
    },
    banner: { //banner consola
        hidePhaser: true
    },
    scene: [
        window.preload,
        window.comun,
        window.bootloader
        // Preload.default,
        // Comun.default,
        // Bootloader.default
    ],
}

const game = new Phaser.Game(config);