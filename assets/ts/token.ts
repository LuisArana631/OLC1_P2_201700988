class token{
        
}

enum tipo{
    /* Comentarios */
    Comentario_Lineal,
    Comentario_Multilinea,
    /* Pralabras Reservadas */
    int,
    double,
    char,
    bool,
    string,
    void,
    main,
    if,
    else,
    CONSOLE,
    WRITE,
    switch,
    case,
    break,
    for,
    while,
    do,
    return,
    continue,
    /* Token de signos */
    IGUAL,
    PUNTO_COMA,
    COMA,
    OPERADOR,
    PARENTESIS_ABRE,
    PARENTESIS_CIERRA,
    DOS_PUNTOS,
    LLAVE_ABRE,
    LLAVE_CIERRA,
    MAYOR,
    MENOR,
    /* Tokens extras */
    identificador,
    numero,
    cadena,

}