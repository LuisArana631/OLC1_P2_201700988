"use strict";
var token = /** @class */ (function() {
    function token(tipo, valor, linea) {
        this.tipoToken = tipo;
        this.valor = valor;
        this.linea = linea;
    }
    token.prototype.getTipo = function() {
        return this.tipoToken;
    };
    token.prototype.getValor = function() {
        return this.valor;
    };
    token.prototype.getLinea = function() {
        return this.valor;
    };
    token.prototype.getTipoExtend = function() {
        switch (this.tipoToken) {
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
            case tipo.DISTINTO:
                return "Distinto";
            case tipo.identificador:
                return "Identificador";
            case tipo.numero:
                return "Numero";
            case tipo.cadena:
                return "Cadena";
        }
    };
    return token;
}());
var tipo;
(function(tipo) {
    /* Comentarios */
    tipo[tipo["Comentario_Lineal"] = 0] = "Comentario_Lineal";
    tipo[tipo["Comentario_Multilinea"] = 1] = "Comentario_Multilinea";
    /* Pralabras Reservadas */
    tipo[tipo["int"] = 2] = "int";
    tipo[tipo["double"] = 3] = "double";
    tipo[tipo["char"] = 4] = "char";
    tipo[tipo["bool"] = 5] = "bool";
    tipo[tipo["string"] = 6] = "string";
    tipo[tipo["void"] = 7] = "void";
    tipo[tipo["main"] = 8] = "main";
    tipo[tipo["if"] = 9] = "if";
    tipo[tipo["else"] = 10] = "else";
    tipo[tipo["CONSOLE"] = 11] = "CONSOLE";
    tipo[tipo["WRITE"] = 12] = "WRITE";
    tipo[tipo["switch"] = 13] = "switch";
    tipo[tipo["case"] = 14] = "case";
    tipo[tipo["break"] = 15] = "break";
    tipo[tipo["for"] = 16] = "for";
    tipo[tipo["while"] = 17] = "while";
    tipo[tipo["do"] = 18] = "do";
    tipo[tipo["return"] = 19] = "return";
    tipo[tipo["continue"] = 20] = "continue";
    /* Token de signos */
    tipo[tipo["IGUAL"] = 21] = "IGUAL";
    tipo[tipo["PUNTO_COMA"] = 22] = "PUNTO_COMA";
    tipo[tipo["COMA"] = 23] = "COMA";
    tipo[tipo["SUMA"] = 24] = "SUMA";
    tipo[tipo["RESTA"] = 25] = "RESTA";
    tipo[tipo["MULTIPLICACION"] = 26] = "MULTIPLICACION";
    tipo[tipo["DIVISION"] = 27] = "DIVISION";
    tipo[tipo["AND"] = 28] = "AND";
    tipo[tipo["OR"] = 29] = "OR";
    tipo[tipo["NOT"] = 30] = "NOT";
    tipo[tipo["PARENTESIS_ABRE"] = 31] = "PARENTESIS_ABRE";
    tipo[tipo["PARENTESIS_CIERRA"] = 32] = "PARENTESIS_CIERRA";
    tipo[tipo["DOS_PUNTOS"] = 33] = "DOS_PUNTOS";
    tipo[tipo["LLAVE_ABRE"] = 34] = "LLAVE_ABRE";
    tipo[tipo["LLAVE_CIERRA"] = 35] = "LLAVE_CIERRA";
    tipo[tipo["MAYOR"] = 36] = "MAYOR";
    tipo[tipo["MENOR"] = 37] = "MENOR";
    tipo[tipo["MAYOR_IGUAL"] = 38] = "MAYOR_IGUAL";
    tipo[tipo["MENOR_IGUAL"] = 39] = "MENOR_IGUAL";
    tipo[tipo["DISTINTO"] = 40] = "DISTINTO";
    /* Tokens extras */
    tipo[tipo["identificador"] = 41] = "identificador";
    tipo[tipo["numero"] = 42] = "numero";
    tipo[tipo["cadena"] = 43] = "cadena";
})(tipo || (tipo = {}));