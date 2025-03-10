// const dataCache = document.getElementById('datosGenerales').getAttribute('data-cache');
// const gameName = activityData.type;
// let specificDB;
// if (dataCache == '0') {
//     specificDB = await import(`../../src/specific/share/share.js`);
// } else {
//     const dataResources = document.getElementById('datosGenerales').getAttribute('data-resources');
//     specificDB = await import(`${dataResources}jsobfuscated/activities/${gameName}/share/share.js?v=${dataCache}`);
// }

const db = window.db;//specificDB.default;

db.juego = "";

db.sonidoJuego = 1;
db.sonidoActividad = 1;

db.titulo = '';
db.tieneTiempoPregunta = 0;
db.tiempoPregunta = 0;
db.vidasTotales = 0;

db.data = {
        "m":{
            "s": 0
        },
        "r": []
    };
    
db.preguntaActual = 0;
db.puntos = 0;
db.tiempo = 0;
db.preguntas = [];

window.db = db;

// export default db;