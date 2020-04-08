export class token{
    private tipoToken:tipo;
    private valor:string;
    private linea:number;

    constructor(tipo:tipo, valor:string, linea:number){
        this.tipoToken = tipo;
        this.valor  = valor;
        this.linea = linea;
    }

   get Tipo():tipo{
        return this.tipoToken;
    }

    get Valor():string{
        return this.valor;
    }

    get Linea():number{
        return this.linea;
    }

    public getTipoExtend():string{
        switch(this.tipoToken){
            case tipo.Comentario_Lineal:
                return "Comentario lineal";
            case tipo.Comentario_Multilinea:
                return "Comentario multilinea";
            case tipo.int:
                return "int - Palabra reservada";
            case tipo.double:
                return "double - Palabra reservada";
            case tipo.char:
                return "char - Palabra reservada";
            case tipo.bool:
                return "bool - Palabra reservada";
            case tipo.string:
                return "string - Palabra reservada";
            case tipo.void:
                return "void - Palabra reservada";
            case tipo.main:
                return "main - Palabra reservada";
            case tipo.if:
                return "if - Palabra reservada";
            case tipo.else:
                return "else - Palabra reservada";
            case tipo.CONSOLE:
                return "CONSOLE - Palabra reservada";
            case tipo.WRITE:
                return "WRITE - Palabra reservada";
            case tipo.switch:
                return "switch - Palabra reservada";
            case tipo.case:
                return "case - Palabras reservada";
            case tipo.break:
                return "break - Palabra reservada";
            case tipo.for:
                return "for - Palabra reservada";
            case tipo.while:
                return "while - Palabra reservada";
            case tipo.do:
                return "do - Palabra reservada";
            case tipo.return:
                return "return - Palabra reservada";
            case tipo.continue:
                return "continue - Palabra reservada";
            case tipo.IGUAL:
                return "Igual";
            case tipo.PUNTO_COMA:
                return "Punto y coma";
            case tipo.COMA:
                return "Coma";
            case tipo.SUMA:
                return "Suma";
            case tipo.RESTA:
                return "Resta";
            case tipo.MULTIPLICACION:
                return "Multiplicacion";
            case tipo.DIVISION:
                return "Division";
            case tipo.AND:
                return "And";
            case tipo.OR:
                return "Or";
            case tipo.NOT:
                return "Not";
            case tipo.PARENTESIS_ABRE:
                return "Parentesis abre";
            case tipo.PARENTESIS_CIERRA:
                return "Parentesis cierra";
            case tipo.DOS_PUNTOS:
                return "Dos puntos";
            case tipo.LLAVE_ABRE:
                return "Llave abre";
            case tipo.LLAVE_CIERRA:
                return "Llave cierra";
            case tipo.MAYOR:
                return "Mayor";
            case tipo.MENOR:
                return "Menor";
            case tipo.MAYOR_IGUAL:
                return "Mayor igual";
            case tipo.MENOR_IGUAL:
                return "Menor igual";
            case tipo.IGUAL_IGUAL:
                return "Doble igual";
            case tipo.DISTINTO:
                return "Distinto";
            case tipo.identificador:
                return "Identificador";
            case tipo.numero:
                return "Numero";
            case tipo.cadena:
                return "Cadena";
            case tipo.ERROR_LEXICO:
                return "Error lexico";
        }

    }

}

export const enum tipo{
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
    IGUAL,  //=
    PUNTO_COMA, //;
    COMA,   //,
    SUMA,   //+
    RESTA,  //-
    MULTIPLICACION, //*
    DIVISION,   ///
    AND,    //&&
    OR, //||
    NOT,    //!
    PARENTESIS_ABRE,    //(
    PARENTESIS_CIERRA,  //)
    DOS_PUNTOS, //:
    LLAVE_ABRE, //{
    LLAVE_CIERRA,   //}
    MAYOR,  //>
    MENOR,  //<
    MAYOR_IGUAL,    //>=
    MENOR_IGUAL,    //<=
    IGUAL_IGUAL,    //==
    DISTINTO,   //!=
    /* Tokens extras */
    identificador,
    numero,
    cadena,
    /* Error lexico */
    ERROR_LEXICO
}
