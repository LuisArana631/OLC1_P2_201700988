"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var token = /** @class */ (function () {
    function token(tipo, valor, linea, columna) {
        this.tipoToken = tipo;
        this.valor = valor;
        this.linea = linea;
        this.columna = columna;
    }
    Object.defineProperty(token.prototype, "Tipo", {
        get: function () {
            return this.tipoToken;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(token.prototype, "Valor", {
        get: function () {
            return this.valor;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(token.prototype, "Linea", {
        get: function () {
            return this.linea;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(token.prototype, "Colummna", {
        get: function () {
            return this.columna;
        },
        enumerable: true,
        configurable: true
    });
    token.prototype.getTipoExtend = function () {
        switch (this.tipoToken) {
            case 0 /* Comentario_Lineal */:
                return "Comentario lineal";
            case 1 /* Comentario_Multilinea */:
                return "Comentario multilinea";
            case 2 /* int */:
                return "int - Palabra reservada";
            case 3 /* double */:
                return "double - Palabra reservada";
            case 4 /* char */:
                return "char - Palabra reservada";
            case 5 /* bool */:
                return "bool - Palabra reservada";
            case 6 /* string */:
                return "string - Palabra reservada";
            case 7 /* void */:
                return "void - Palabra reservada";
            case 8 /* main */:
                return "main - Palabra reservada";
            case 9 /* if */:
                return "if - Palabra reservada";
            case 10 /* else */:
                return "else - Palabra reservada";
            case 11 /* CONSOLE */:
                return "CONSOLE - Palabra reservada";
            case 12 /* WRITE */:
                return "WRITE - Palabra reservada";
            case 13 /* switch */:
                return "switch - Palabra reservada";
            case 14 /* case */:
                return "case - Palabras reservada";
            case 15 /* break */:
                return "break - Palabra reservada";
            case 16 /* for */:
                return "for - Palabra reservada";
            case 17 /* while */:
                return "while - Palabra reservada";
            case 18 /* do */:
                return "do - Palabra reservada";
            case 19 /* return */:
                return "return - Palabra reservada";
            case 20 /* continue */:
                return "continue - Palabra reservada";
            case 21 /* default */:
                return "default - Palabrea reservada";
            case 22 /* IGUAL */:
                return "Igual";
            case 23 /* PUNTO_COMA */:
                return "Punto y coma";
            case 24 /* COMA */:
                return "Coma";
            case 25 /* SUMA */:
                return "Suma";
            case 26 /* RESTA */:
                return "Resta";
            case 27 /* MULTIPLICACION */:
                return "Multiplicacion";
            case 28 /* DIVISION */:
                return "Division";
            case 29 /* AND */:
                return "And";
            case 30 /* OR */:
                return "Or";
            case 31 /* NOT */:
                return "Not";
            case 32 /* PARENTESIS_ABRE */:
                return "Parentesis abre";
            case 33 /* PARENTESIS_CIERRA */:
                return "Parentesis cierra";
            case 34 /* DOS_PUNTOS */:
                return "Dos puntos";
            case 35 /* LLAVE_ABRE */:
                return "Llave abre";
            case 36 /* LLAVE_CIERRA */:
                return "Llave cierra";
            case 37 /* MAYOR */:
                return "Mayor";
            case 38 /* MENOR */:
                return "Menor";
            case 39 /* MAYOR_IGUAL */:
                return "Mayor igual";
            case 40 /* MENOR_IGUAL */:
                return "Menor igual";
            case 41 /* IGUAL_IGUAL */:
                return "Doble igual";
            case 42 /* DISTINTO */:
                return "Distinto";
            case 43 /* PUNTO */:
                return "Punto";
            case 44 /* INCREMENTO */:
                return "Incremento";
            case 45 /* DECREMENTO */:
                return "Decremento";
            case 46 /* identificador */:
                return "Identificador";
            case 47 /* numero */:
                return "Numero";
            case 48 /* cadena */:
                return "Cadena";
            case 49 /* ERROR_LEXICO */:
                return "Error lexico";
        }
    };
    return token;
}());
exports.token = token;
