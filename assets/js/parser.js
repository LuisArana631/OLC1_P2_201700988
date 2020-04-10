"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var scanner_1 = require("./scanner");
var errorSintactico_1 = require("./errorSintactico");
var variableItem_1 = require("./variableItem");
var parser = /** @class */ (function () {
    function parser() {
        this.listaErrores = new Array;
        this.auxListaTokens = scanner_1.iniciarScanner();
        this.traduccionPyton = new Array;
        this.listaVariables = new Array;
    }
    parser.prototype.startParse = function () {
        var _this = this;
        var estado = 0;
        var tipoActual = "";
        var idActual = new Array;
        var esMain = false;
        console.log("cantidad de tokens: " + this.auxListaTokens.length);
        this.auxListaTokens.forEach(function (item) {
            switch (estado) {
                case 0: //Estado inicial para encontrar que hacer
                    if (_this.esComentario(item)) { //Si es comentario solo traducir y agregarlo
                        _this.addComentario(item);
                    }
                    else if (_this.esImprimir(item)) { //Si es console ir al estado 1    
                        estado = 1;
                    }
                    else if (_this.esSentenciaRepeticion(item)) { //Si es sentencia de repeticion ir a estado 2 agregar palabra si es for o while, si es do ir a estado 7
                        if (item.Tipo === 16 /* for */) {
                            _this.traduccionPyton.push(item.Valor); //Ir a estado 2 para manejar for
                            estado = 2;
                        }
                        else if (item.Tipo === 17 /* while */) { //Ir a estado 7 para manejar while
                            _this.traduccionPyton.push(item.Valor);
                            estado = 7;
                        }
                        else { //Ir a estado 8 para manejar do while
                            _this.traduccionPyton.push("while True");
                            estado = 8;
                        }
                    }
                    else if (_this.esSentenciaControl(item)) { //Si es sentencia de control ir a estado 3
                        if (item.Tipo === 9 /* if */) {
                            _this.traduccionPyton.push(item.Valor);
                            estado = 3;
                        }
                        else {
                            _this.traduccionPyton.push("def switch");
                            estado = 10;
                        }
                    }
                    else if (_this.esMetodo(item)) { //Cambiar la palabra void por def e ir al estado 4
                        _this.traduccionPyton.push("def");
                        estado = 4;
                    }
                    else if (_this.esTipoDato(item)) { //Ir al estado 5 si es un tipo de dato
                        estado = 5;
                        tipoActual = item.Valor;
                    }
                    else {
                        var error = "Se esperaba (Comentario|Impresion de Consola|Sentencia de control|Sentencia de Repeticion|Metodo|Tipo de dato) pero se encontró (" + item.getTipoExtend() + ")";
                        _this.addError(item, error);
                    }
                    break;
                case 1: //Manejar el imprimir consola
                    if (item.Tipo === 42 /* PUNTO */) { //Debemos encontrar un punto para poder avanzar al estado 6                        
                        estado = 6;
                    }
                    else if (_this.esComentario(item)) { //Si es comentario solo traducir y agregarlo
                        _this.addComentario(item);
                    }
                    else {
                        var error = "Se esperaba un (.) para acceder a los metodos de Console pero se encontro (" + item.getTipoExtend() + ")";
                        _this.addError(item, error);
                    }
                    break;
                case 2: //Manejar la sentencia de repeticion (for)
                    if (item.Tipo === 31 /* PARENTESIS_ABRE */) {
                        estado = 9;
                    }
                    else if (_this.esComentario(item)) { //Si es comentario solo traducir y agregarlo
                        _this.addComentario(item);
                    }
                    else {
                        var error = "Se esperaba un (() para manejar el ciclo for pero se encontro (" + item.getTipoExtend() + ")";
                        _this.addError(item, error);
                    }
                    break;
                case 3: //Para manejar las sentencias de control (if)
                    if (item.Tipo === 31 /* PARENTESIS_ABRE */) {
                        estado = 10;
                    }
                    else if (_this.esComentario(item)) { //Si es comentario solo traducir y agregarlo
                        _this.addComentario(item);
                    }
                    else {
                        var error = "Se esperaba un (() para if pero se encontro (" + item.getTipoExtend() + ")";
                        _this.addError(item, error);
                    }
                    break;
                case 4: //Manejar las funciones void/def
                    if (item.Tipo === 45 /* identificador */ || item.Tipo === 8 /* main */) { //Si es identificador | main evaluar como metodo o no
                        if (item.Tipo === 8 /* main */) {
                            esMain = true;
                        }
                        estado = 11;
                        _this.traduccionPyton.push(item.Valor);
                    }
                    else if (_this.esComentario(item)) { //Si es comentario solo traducir y agregarlo
                        _this.addComentario(item);
                    }
                    else {
                        var error = "Se esperaba un (identificador|main) para continuar pero se encontro (" + item.getTipoExtend() + ")";
                        _this.addError(item, error);
                    }
                    break;
                case 5: //Manejar cuando viene un tipo de dato
                    if (item.Tipo === 45 /* identificador */) {
                        estado = 12;
                        idActual.push(item.Valor);
                    }
                    else if (_this.esComentario(item)) { //Si es comentario solo traducir y agregarlo
                        _this.addComentario(item);
                    }
                    else {
                        var error = "Se esperaba un (identificador|main) para continuar pero se encontro (" + item.getTipoExtend() + ")";
                        _this.addError(item, error);
                    }
                    break;
                case 6: //Imprimir consola llevamos Console.
                    if (item.Tipo === 12 /* WRITE */) {
                        estado = 13;
                        _this.traduccionPyton.push("print");
                    }
                    else if (_this.esComentario(item)) { //Si es comentario solo traducir y agregarlo
                        _this.addComentario(item);
                    }
                    else {
                        var error = "Se esperaba un (Write) para acceder escribir en consola pero se encontro (" + item.getTipoExtend() + ")";
                        _this.addError(item, error);
                    }
                    break;
                case 7: //Manejar while
                    if (item.Tipo === 31 /* PARENTESIS_ABRE */) {
                        estado = 14;
                    }
                    else if (_this.esComentario(item)) { //Si es comentario solo traducir y agregarlo
                        _this.addComentario(item);
                    }
                    else {
                        var error = "Se esperaba un (() para manejar el ciclo while pero se encontro (" + item.getTipoExtend() + ")";
                        _this.addError(item, error);
                    }
                    break;
                case 8: //Manejar do-while
                    if (item.Tipo === 34 /* LLAVE_ABRE */) {
                        _this.traduccionPyton.push(":");
                        estado = 15;
                    }
                    else if (_this.esComentario(item)) { //Si es comentario solo traducir y agregarlo
                        _this.addComentario(item);
                    }
                    else {
                        var error = "Se esperaba un ({) para manejar el ciclo do-while pero se encontro (" + item.getTipoExtend() + ")";
                        _this.addError(item, error);
                    }
                    break;
                case 9: //Manejar for (parametros)
                    if (item.Tipo === 2 /* int */) {
                        estado = 16;
                    }
                    else if (item.Tipo === 45 /* identificador */) {
                        estado = 17;
                        _this.listaVariables.push(new variableItem_1.variableItem(item.Valor, "undefined", "int"));
                    }
                    else if (_this.esComentario(item)) { //Si es comentario solo traducir y agregarlo
                        _this.addComentario(item);
                    }
                    else {
                        var error = "Se esperaba un (int|identificador) para manejar el ciclo for pero se encontro (" + item.getTipoExtend() + ")";
                        _this.addError(item, error);
                    }
                    break;
                case 10: //Manejar parametros de if
                    if (item.Tipo === 45 /* identificador */ || item.Tipo === 46 /* numero */ || item.Tipo === 47 /* cadena */) {
                        estado = 18;
                        _this.traduccionPyton.push(item.Valor);
                    }
                    else if (_this.esComentario(item)) { //Si es comentario solo traducir y agregarlo
                        _this.addComentario(item);
                    }
                    else {
                        var error = "Se esperaba un (identificador|numero|cadena) para manejar la condicion if pero se encontro (" + item.getTipoExtend() + ")";
                        _this.addError(item, error);
                    }
                    break;
                case 11: //Manejar la funcion por medio de void
                    if (item.Tipo === 31 /* PARENTESIS_ABRE */) { //Encontramos una funcion
                        _this.traduccionPyton.push(item.Valor);
                        estado = 19;
                    }
                    else if (_this.esComentario(item)) { //Si es comentario solo traducir y agregarlo
                        _this.addComentario(item);
                    }
                    else {
                        var error = "Se esperaba un ((|identificador) para manejar la condicion if pero se encontro (" + item.getTipoExtend() + ")";
                        _this.addError(item, error);
                    }
                    break;
                case 12:
                    if (item.Tipo === 31 /* PARENTESIS_ABRE */) { //Encontramos una funcion 
                        estado = 20;
                        _this.traduccionPyton.push("def " + idActual[0] + "(");
                        idActual.pop();
                    }
                    else if (item.Tipo === 23 /* COMA */) { //Se encontra una lista de identificadores
                        estado = 21;
                    }
                    else if (item.Tipo === 21 /* IGUAL */) { //Se encontro una asignacion 
                        estado = 22;
                    }
                    else if (item.Tipo === 22 /* PUNTO_COMA */) { //Se encontro una variable sin dato
                        _this.traduccionPyton.push("var " + idActual[0]);
                        _this.listaVariables.push(new variableItem_1.variableItem(idActual[0], "undefined", tipoActual));
                        idActual.pop();
                        estado = 0;
                    }
                    else if (_this.esComentario(item)) { //Si es comentario solo traducir y agregarlo
                        _this.addComentario(item);
                    }
                    else {
                        var error = "Se esperaba un ((|,|=|;) pero se encontro (" + item.getTipoExtend() + ")";
                        _this.addError(item, error);
                    }
                    break;
                case 13: //Continuar Console.Write()
                    if (item.Tipo === 31 /* PARENTESIS_ABRE */) { //Encontramos una funcion
                        estado = 23;
                    }
                    else if (_this.esComentario(item)) { //Si es comentario solo traducir y agregarlo
                        _this.addComentario(item);
                    }
                    else {
                        var error = "Se esperaba un (() para manejar el Console.Write pero se encontro (" + item.getTipoExtend() + ")";
                        _this.addError(item, error);
                    }
                    break;
                case 14: //Ya estamos dentro de los parametros del while 
                    if (item.Tipo === 45 /* identificador */ || item.Tipo === 46 /* numero */) {
                        estado = 24;
                        _this.traduccionPyton.push(item.Valor);
                    }
                    else if (_this.esComentario(item)) { //Si es comentario solo traducir y agregarlo
                        _this.addComentario(item);
                    }
                    else {
                        var error = "Se esperaba un (identificador|numero) para manejar el ciclo while pero se encontro (" + item.getTipoExtend() + ")";
                        _this.addError(item, error);
                    }
                    break;
                case 15: //Estamos dentro del do-while
                    break;
                case 16: //Estamos en el for encontramos un int
                    if (item.Tipo === 45 /* identificador */) {
                        estado = 17;
                        _this.listaVariables.push(new variableItem_1.variableItem(item.Valor, "undefined", "int"));
                    }
                    else if (_this.esComentario(item)) { //Si es comentario solo traducir y agregarlo
                        _this.addComentario(item);
                    }
                    else {
                        var error = "Se esperaba un (identificador) para manejar el ciclo for pero se encontro (" + item.getTipoExtend() + ")";
                        _this.addError(item, error);
                    }
                    break;
                case 17: //Estamos en el for al encontrar un identificador
                    if (item.Tipo === 21 /* IGUAL */) {
                        estado = 25;
                    }
                    else if (_this.esComentario(item)) { //Si es comentario solo traducir y agregarlo
                        _this.addComentario(item);
                    }
                    else {
                        var error = "Se esperaba un (=) para manejar el ciclo for pero se encontro (" + item.getTipoExtend() + ")";
                        _this.addError(item, error);
                    }
                    break;
                case 18: //Estamos en esta parte del if(18
                    if (_this.esRelacional(item)) {
                        _this.traduccionPyton.push(item.Valor);
                        estado = 26;
                    }
                    else if (_this.esComentario(item)) { //Si es comentario solo traducir y agregarlo
                        _this.addComentario(item);
                    }
                    else {
                        var error = "Se esperaba un signo relacional para manejar el if for pero se encontro (" + item.getTipoExtend() + ")";
                        _this.addError(item, error);
                    }
                    break;
                case 19: //void asf(
                    if (esMain) {
                        if (item.Tipo === 32 /* PARENTESIS_CIERRA */) {
                            _this.traduccionPyton.push(item.Valor);
                            estado = 27;
                        }
                        else if (_this.esComentario(item)) { //Si es comentario solo traducir y agregarlo
                            _this.addComentario(item);
                        }
                        else {
                            var error = "Se esperaba un ) para manejar el main pero se encontro (" + item.getTipoExtend() + ")";
                            _this.addError(item, error);
                        }
                    }
                    else {
                        if (item.Tipo === 32 /* PARENTESIS_CIERRA */) {
                            _this.traduccionPyton.push(item.Valor);
                            estado = 27;
                        }
                        else if (_this.esTipoDato(item)) {
                            estado = 28;
                        }
                        else if (_this.esComentario(item)) { //Si es comentario solo traducir y agregarlo
                            _this.addComentario(item);
                        }
                        else {
                            var error = "Se esperaba un ()|Tipo de dato) para manejar la funcion pero se encontro (" + item.getTipoExtend() + ")";
                            _this.addError(item, error);
                        }
                    }
                    break;
                case 20:
                    if (item.Tipo === 32 /* PARENTESIS_CIERRA */) {
                        _this.traduccionPyton.push(item.Valor);
                    }
                    else if (_this.esTipoDato(item)) {
                        estado = 29;
                    }
                    else if (_this.esComentario(item)) { //Si es comentario solo traducir y agregarlo
                        _this.addComentario(item);
                    }
                    else {
                        var error = "Se esperaba un ()|Tipo de dato) para manejar el ciclo for pero se encontro (" + item.getTipoExtend() + ")";
                        _this.addError(item, error);
                    }
                    break;
                case 21:
                    break;
            }
        });
    };
    parser.prototype.addError = function (tokenActual, tipoError) {
        this.listaErrores.push(new errorSintactico_1.errorSintactico(tokenActual.Valor, tokenActual.Linea, tokenActual.Colummna, tipoError));
    };
    parser.prototype.addComentario = function (tokenActual) {
        var cadena;
        if (tokenActual.Tipo === 0 /* Comentario_Lineal */) {
            cadena = tokenActual.Valor.replace("//", "#");
        }
        else {
            cadena = tokenActual.Valor.replace("/*", "'''");
            cadena = tokenActual.Valor.replace("*/", "'''");
        }
        this.traduccionPyton.push(cadena);
    };
    parser.prototype.esRelacional = function (tokenActual) {
        if (tokenActual.Tipo === 36 /* MAYOR */ || tokenActual.Tipo === 37 /* MENOR */ || tokenActual.Tipo === 38 /* MAYOR_IGUAL */ || tokenActual.Tipo === 39 /* MENOR_IGUAL */ || tokenActual.Tipo === 41 /* DISTINTO */ || tokenActual.Tipo === 40 /* IGUAL_IGUAL */) {
            return true;
        }
        return false;
    };
    parser.prototype.esComentario = function (tokenActual) {
        if (tokenActual.Tipo === 0 /* Comentario_Lineal */ || tokenActual.Tipo === 1 /* Comentario_Multilinea */) {
            return true;
        }
        return false;
    };
    parser.prototype.esImprimir = function (tokenActual) {
        if (tokenActual.Tipo === 11 /* CONSOLE */) {
            return true;
        }
        return false;
    };
    parser.prototype.esSentenciaRepeticion = function (tokenActual) {
        if (tokenActual.Tipo === 16 /* for */ || tokenActual.Tipo === 17 /* while */ || tokenActual.Tipo === 18 /* do */) {
            return true;
        }
        return false;
    };
    parser.prototype.esSentenciaControl = function (tokenActual) {
        if (tokenActual.Tipo === 9 /* if */ || tokenActual.Tipo === 13 /* switch */) {
            return true;
        }
        return false;
    };
    parser.prototype.esMetodo = function (tokenActual) {
        if (tokenActual.Tipo === 7 /* void */) {
            return true;
        }
        return false;
    };
    parser.prototype.esTipoDato = function (tokenActual) {
        if (tokenActual.Tipo === 2 /* int */ || tokenActual.Tipo === 3 /* double */ || tokenActual.Tipo === 4 /* char */ || tokenActual.Tipo === 5 /* bool */ || tokenActual.Tipo === 6 /* string */) {
            return true;
        }
        return false;
    };
    return parser;
}());
function iniciarParser() {
    var parserFun = new parser();
    parserFun.startParse();
}
exports.iniciarParser = iniciarParser;
var elementButon = document.getElementById('btnTraducir');
if (elementButon) {
    elementButon.addEventListener('click', iniciarParser, false);
}
