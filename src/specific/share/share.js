window.db = {
    logo: assetsURLs.specificImg + "ordenar-palabras.png", 
    token: "zwsgd1bO",

    preguntasOrdenadas: 1,
    sensibleAcentos: 0,
    letraActual: 0,
    puntosMax: 0,

    separators: [' ','.',',',';',':','=','*','+','-','{','}','[',']','¿','?','¡','!','(',')','/','|','\\'],
    replaceSeparators: new RegExp(/ |\.|,|;|:|:|=|\*|\+|-|{|}|\[|]|¿|\?|¡|!|\(|\)|\/|\||\\/, 'g')
}

// export default db;