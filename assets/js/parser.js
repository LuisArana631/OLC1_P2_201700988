"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var scanner_1 = require("./scanner");
var errorSintactico_1 = require("./errorSintactico");
var variableItem_1 = require("./variableItem");
var erroresList_1 = require("./erroresList");
var parser = /** @class */ (function () {
    function parser() {
        this.listaErrores = new Array;
        this.auxListaTokens = scanner_1.iniciarScanner();
        this.traduccionPyton = new Array;
        this.listaVariables = new Array;
        this.ambosErrores = new Array;
        this.htmlExtend = new Array;
    }
    Object.defineProperty(parser.prototype, "AmbosErrores", {
        get: function () {
            return this.ambosErrores;
        },
        enumerable: true,
        configurable: true
    });
    parser.prototype.startParse = function () {
        var _this = this;
        var estado = 0;
        var tipoActual = "";
        var idActual = new Array;
        var esMain = false;
        var esRepeticion = false;
        var esControl = false;
        var esDoWhile = false;
        var esSwitch = false;
        var switchActual = "";
        var sentenciaTraducia = "";
        console.log("cantidad de tokens: " + this.auxListaTokens.length);
        this.auxListaTokens.forEach(function (item) {
            //Insertar los textos del html
            if (item.Tipo === 48 /* cadena */) {
                //Validar que tenga comillas simples
                if (item.Valor.indexOf("'") != -1) {
                    var cadenaSinComillas = item.Valor.replace("'", "");
                    _this.htmlExtend.push(cadenaSinComillas);
                }
            }
            if (item.Tipo === 49 /* ERROR_LEXICO */) {
                //Ignorar
            }
            else {
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
                                sentenciaTraducia = "for"; //Ir a estado 2 para manejar for
                                estado = 2;
                            }
                            else if (item.Tipo === 17 /* while */) { //Ir a estado 7 para manejar while
                                sentenciaTraducia = "while ";
                                if (esDoWhile) {
                                    estado = 15;
                                    esDoWhile = false;
                                }
                                else {
                                    estado = 7;
                                }
                            }
                            else { //Ir a estado 8 para manejar do while
                                sentenciaTraducia = "while True";
                                estado = 8;
                                esDoWhile = true;
                            }
                            esRepeticion = true;
                        }
                        else if (_this.esSentenciaControl(item)) { //Si es sentencia de control ir a estado 3
                            esControl = true;
                            if (item.Tipo === 9 /* if */) {
                                sentenciaTraducia = "if ";
                                estado = 3;
                            }
                            else {
                                sentenciaTraducia = "def switch";
                                estado = 36;
                                esSwitch = true;
                            }
                        }
                        else if (_this.esMetodo(item)) { //Cambiar la palabra void por def e ir al estado 4
                            sentenciaTraducia = "def ";
                            estado = 4;
                        }
                        else if (_this.esTipoDato(item)) { //Ir al estado 5 si es un tipo de dato
                            estado = 5;
                            tipoActual = item.Valor;
                        }
                        else if (item.Tipo === 36 /* LLAVE_CIERRA */) {
                            if (esRepeticion) {
                                esRepeticion = false;
                            }
                            else if (esControl) {
                                esControl = false;
                            }
                            else if (esSwitch) {
                                _this.traduccionPyton.push("}");
                                esSwitch = false;
                            }
                            else if (esMain) {
                                _this.traduccionPyton.push("if_name_=\"_main_\":");
                                _this.traduccionPyton.push(" main()");
                                esMain = false;
                            }
                        }
                        else if (item.Tipo === 10 /* else */) {
                            estado = 54;
                        }
                        else if (item.Tipo === 19 /* return */) {
                            estado = 56;
                        }
                        else if (item.Tipo === 15 /* break */) {
                            if (esRepeticion) {
                                _this.traduccionPyton.push("break");
                            }
                            else {
                                var error = "Se esperaba (Comentario|Impresion de Consola|Sentencia de control|Sentencia de Repeticion|Metodo|Tipo de dato) pero se encontró (" + item.getTipoExtend() + ")";
                                _this.addError(item, error);
                            }
                        }
                        else if (item.Tipo === 20 /* continue */) {
                            if (esRepeticion) {
                                _this.traduccionPyton.push("continue");
                            }
                            else {
                                var error = "Se esperaba (Comentario|Impresion de Consola|Sentencia de control|Sentencia de Repeticion|Metodo|Tipo de dato) pero se encontró (" + item.getTipoExtend() + ")";
                                _this.addError(item, error);
                            }
                        }
                        else if (item.Tipo === 14 /* case */) {
                            if (esSwitch) {
                                estado = 68;
                            }
                            else {
                                var error = "Se esperaba (Comentario|Impresion de Consola|Sentencia de control|Sentencia de Repeticion|Metodo|Tipo de dato) pero se encontró (" + item.getTipoExtend() + ")";
                                _this.addError(item, error);
                            }
                        }
                        else if (item.Tipo === 21 /* default */) {
                            if (esSwitch) {
                                estado = 70;
                                sentenciaTraducia = "default:";
                            }
                            else {
                                var error = "Se esperaba (Comentario|Impresion de Consola|Sentencia de control|Sentencia de Repeticion|Metodo|Tipo de dato) pero se encontró (" + item.getTipoExtend() + ")";
                                _this.addError(item, error);
                            }
                        }
                        else {
                            var error = "Se esperaba (Comentario|Impresion de Consola|Sentencia de control|Sentencia de Repeticion|Metodo|Tipo de dato) pero se encontró (" + item.getTipoExtend() + ")";
                            _this.addError(item, error);
                        }
                        break;
                    case 1: //Manejar el imprimir consola
                        if (item.Tipo === 43 /* PUNTO */) { //Debemos encontrar un punto para poder avanzar al estado 6
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
                        if (item.Tipo === 32 /* PARENTESIS_ABRE */) {
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
                        if (item.Tipo === 32 /* PARENTESIS_ABRE */) {
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
                        if (item.Tipo === 46 /* identificador */ || item.Tipo === 8 /* main */) { //Si es identificador | main evaluar como metodo o no
                            if (item.Tipo === 8 /* main */) {
                                esMain = true;
                            }
                            estado = 11;
                            sentenciaTraducia += item.Valor;
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
                        if (item.Tipo === 46 /* identificador */) {
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
                            sentenciaTraducia += "print";
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
                        if (item.Tipo === 32 /* PARENTESIS_ABRE */) {
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
                        if (item.Tipo === 35 /* LLAVE_ABRE */) {
                            sentenciaTraducia += ":";
                            _this.traduccionPyton.push(sentenciaTraducia);
                            sentenciaTraducia = "";
                            esDoWhile = true;
                            estado = 0;
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
                        else if (item.Tipo === 46 /* identificador */) {
                            estado = 17;
                            sentenciaTraducia += " " + item.Valor + " in range(";
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
                        if (item.Tipo === 46 /* identificador */ || item.Tipo === 47 /* numero */ || item.Tipo === 48 /* cadena */) {
                            estado = 18;
                            sentenciaTraducia += item.Valor;
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
                        if (item.Tipo === 32 /* PARENTESIS_ABRE */) { //Encontramos una funcion
                            sentenciaTraducia += item.Valor;
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
                    case 12: //Encontramos un tipo de dato y necesitamos saber si es variable o funcion
                        if (item.Tipo === 32 /* PARENTESIS_ABRE */) { //Encontramos una funcion
                            estado = 20;
                            sentenciaTraducia += "def " + idActual[0] + "(";
                            idActual.pop();
                        }
                        else if (item.Tipo === 24 /* COMA */) { //Se encontra una lista de identificadores
                            estado = 21;
                        }
                        else if (item.Tipo === 22 /* IGUAL */) { //Se encontro una asignacion
                            estado = 22;
                        }
                        else if (item.Tipo === 23 /* PUNTO_COMA */) { //Se encontro una variable sin dato                        
                            _this.traduccionPyton.push("var " + idActual[0]);
                            _this.listaVariables.push(new variableItem_1.variableItem(idActual[0], "undefined", tipoActual));
                            sentenciaTraducia = "";
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
                        if (item.Tipo === 32 /* PARENTESIS_ABRE */) { //Encontramos una funcion
                            estado = 23;
                            sentenciaTraducia += "(";
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
                        if (item.Tipo === 46 /* identificador */ || item.Tipo === 47 /* numero */) {
                            estado = 24;
                            sentenciaTraducia += item.Valor;
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
                        if (item.Tipo === 32 /* PARENTESIS_ABRE */) {
                            estado = 59;
                            sentenciaTraducia = "if (";
                        }
                        else if (_this.esComentario(item)) { //Si es comentario solo traducir y agregarlo
                            _this.addComentario(item);
                        }
                        else {
                            var error = "Se esperaba un ( para manejar el ciclo while pero se encontro (" + item.getTipoExtend() + ")";
                            _this.addError(item, error);
                        }
                        break;
                    case 16: //Estamos en el for encontramos un int
                        if (item.Tipo === 46 /* identificador */) {
                            estado = 17;
                            sentenciaTraducia += " " + item.Valor + " in range(";
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
                        if (item.Tipo === 22 /* IGUAL */) {
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
                            sentenciaTraducia += item.Valor;
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
                            if (item.Tipo === 33 /* PARENTESIS_CIERRA */) {
                                sentenciaTraducia += item.Valor;
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
                            if (item.Tipo === 33 /* PARENTESIS_CIERRA */) {
                                sentenciaTraducia += item.Valor;
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
                    case 20: //Esto es una funcion
                        if (item.Tipo === 33 /* PARENTESIS_CIERRA */) {
                            sentenciaTraducia += item.Valor;
                            estado = 38;
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
                    case 21: //Si encontramos una lista de identificadores
                        if (item.Tipo === 46 /* identificador */) { //Si es identificador ir al siguiente estado
                            estado = 30;
                            idActual.push(item.Valor);
                        }
                        else if (_this.esComentario(item)) { //Si es comentario solo traducir y agregarlo
                            _this.addComentario(item);
                        }
                        else {
                            var error = "Se esperaba un (identificador) para la lista de identificadores pero se encontro (" + item.getTipoExtend() + ")";
                            _this.addError(item, error);
                        }
                        break;
                    case 22: //Asignacion de las variable
                        if (item.Tipo === 48 /* cadena */ || item.Tipo === 47 /* numero */ || item.Tipo === 46 /* identificador */) {
                            var variables_1 = "var ";
                            var conteo_1 = 1;
                            idActual.forEach(function (idItem) {
                                if (conteo_1 < idActual.length) {
                                    variables_1 += idItem + ",";
                                }
                                else {
                                    variables_1 += idItem;
                                }
                                _this.listaVariables.push(new variableItem_1.variableItem(idItem, item.Valor, tipoActual));
                                conteo_1++;
                            });
                            idActual.length = 0;
                            variables_1 += " = " + item.Valor;
                            _this.traduccionPyton.push(variables_1);
                            sentenciaTraducia = "";
                            estado = 31;
                        }
                        else if (_this.esComentario(item)) { //Si es comentario solo traducir y agregarlo
                            _this.addComentario(item);
                        }
                        else {
                            var error = "Se esperaba un (cadena|numero|identificador) para manejar las variables pero se encontro (" + item.getTipoExtend() + ")";
                            _this.addError(item, error);
                        }
                        break;
                    case 23: //Parametro del console.write()
                        if (item.Tipo === 48 /* cadena */ || item.Tipo === 46 /* identificador */ || item.Tipo === 47 /* numero */) {
                            sentenciaTraducia += item.Valor;
                            estado = 53;
                        }
                        else if (_this.esComentario(item)) { //Si es comentario solo traducir y agregarlo
                            _this.addComentario(item);
                        }
                        else {
                            var error = "Se esperaba un (cadena|identificador) para manejar el ciclo for pero se encontro (" + item.getTipoExtend() + ")";
                            _this.addError(item, error);
                        }
                        break;
                    case 24: //Validar funcione en el while
                        if (_this.esRelacional(item)) {
                            sentenciaTraducia += item.Valor;
                            estado = 33;
                        }
                        else if (_this.esComentario(item)) { //Si es comentario solo traducir y agregarlo
                            _this.addComentario(item);
                        }
                        else {
                            var error = "Se esperaba un (signo relacional) para manejar el ciclo while pero se encontro (" + item.getTipoExtend() + ")";
                            _this.addError(item, error);
                        }
                        break;
                    case 25: //Encontrar el numero de la variable en el for
                        if (item.Tipo === 47 /* numero */) {
                            estado = 34;
                            sentenciaTraducia += item.Valor;
                        }
                        else if (_this.esComentario(item)) { //Si es comentario solo traducir y agregarlo
                            _this.addComentario(item);
                        }
                        else {
                            var error = "Se esperaba un (numero) para manejar el ciclo for pero se encontro (" + item.getTipoExtend() + ")";
                            _this.addError(item, error);
                        }
                        break;
                    case 26: //Validar if
                        if (item.Tipo === 46 /* identificador */ || item.Tipo === 47 /* numero */ || item.Tipo === 48 /* cadena */) {
                            estado = 35;
                            sentenciaTraducia += item.Valor;
                        }
                        else if (_this.esComentario(item)) { //Si es comentario solo traducir y agregarlo
                            _this.addComentario(item);
                        }
                        else {
                            var error = "Se esperaba un (identificador|numero|cadena) para manejar la condicion if pero se encontro (" + item.getTipoExtend() + ")";
                            _this.addError(item, error);
                        }
                        break;
                    case 27: //Terminar con la funcion def
                        if (item.Tipo === 35 /* LLAVE_ABRE */) {
                            sentenciaTraducia += ":";
                            _this.traduccionPyton.push(sentenciaTraducia);
                            sentenciaTraducia = "";
                            estado = 0;
                        }
                        else if (_this.esComentario(item)) { //Si es comentario solo traducir y agregarlo
                            _this.addComentario(item);
                        }
                        else {
                            var error = "Se esperaba un (identificador|numero|cadena) para manejar la condicion pero se encontro (" + item.getTipoExtend() + ")";
                            _this.addError(item, error);
                        }
                        break;
                    case 28: //Debemos encontrar una variable en el void
                        if (item.Tipo === 46 /* identificador */) {
                            sentenciaTraducia += item.Valor;
                            estado = 37;
                        }
                        else if (_this.esComentario(item)) { //Si es comentario solo traducir y agregarlo
                            _this.addComentario(item);
                        }
                        else {
                            var error = "Se esperaba un (identificador|numero|cadena) para manejar la condicion pero se encontro (" + item.getTipoExtend() + ")";
                            _this.addError(item, error);
                        }
                        break;
                    case 29: //Debemos encontrar el identificador
                        if (item.Tipo === 46 /* identificador */) {
                            sentenciaTraducia += item.Valor;
                            estado = 39;
                        }
                        else if (_this.esComentario(item)) { //Si es comentario solo traducir y agregarlo
                            _this.addComentario(item);
                        }
                        else {
                            var error = "Se esperaba un (identificador|numero|cadena) para manejar la condicion pero se encontro (" + item.getTipoExtend() + ")";
                            _this.addError(item, error);
                        }
                        break;
                    case 30: //Se debe encontrar una coma y regresar al estado de identificador
                        if (item.Tipo === 24 /* COMA */) {
                            estado = 21;
                            sentenciaTraducia += item.Valor;
                        }
                        else if (item.Tipo === 22 /* IGUAL */) {
                            estado = 22;
                            sentenciaTraducia += item.Valor;
                        }
                        else if (item.Tipo === 23 /* PUNTO_COMA */) {
                            estado = 0;
                            var variables_2 = "var ";
                            var conteo_2 = 1;
                            idActual.forEach(function (idItem) {
                                if (conteo_2 < idActual.length) {
                                    variables_2 += idItem + ",";
                                }
                                else {
                                    variables_2 += idItem;
                                }
                                _this.listaVariables.push(new variableItem_1.variableItem(idItem, "undefined", tipoActual));
                                conteo_2++;
                            });
                            idActual.length = 0;
                            _this.traduccionPyton.push(variables_2);
                            sentenciaTraducia = "";
                        }
                        else if (_this.esComentario(item)) { //Si es comentario solo traducir y agregarlo
                            _this.addComentario(item);
                        }
                        else {
                            var error = "Se esperaba un (,|=|;) para manejar la condicion if pero se encontro (" + item.getTipoExtend() + ")";
                            _this.addError(item, error);
                        }
                        break;
                    case 31: //Necesitamos un punto y coma para terminar las variables
                        if (item.Tipo === 23 /* PUNTO_COMA */) {
                            estado = 0;
                            sentenciaTraducia = "";
                        }
                        else if (_this.esComentario(item)) { //Si es comentario solo traducir y agregarlo
                            _this.addComentario(item);
                        }
                        else {
                            var error = "Se esperaba un (;) para manejar las variables pero se encontro (" + item.getTipoExtend() + ")";
                            _this.addError(item, error);
                        }
                        break;
                    case 32: //Varias cadenas concatenadas o parentesis final
                        if (item.Tipo === 25 /* SUMA */) {
                            _this.traduccionPyton.push(",");
                            estado = 23;
                        }
                        else if (item.Tipo === 33 /* PARENTESIS_CIERRA */) {
                            _this.traduccionPyton.push(item.Valor);
                            estado = 40;
                        }
                        else if (_this.esComentario(item)) { //Si es comentario solo traducir y agregarlo
                            _this.addComentario(item);
                        }
                        else {
                            var error = "Se esperaba un (+|)) para manejar Console.Write() pero se encontro (" + item.getTipoExtend() + ")";
                            _this.addError(item, error);
                        }
                        break;
                    case 33: //Encontrar un identificador
                        if (item.Tipo === 46 /* identificador */) {
                            sentenciaTraducia += item.Valor;
                            estado = 41;
                        }
                        else if (_this.esComentario(item)) { //Si es comentario solo traducir y agregarlo
                            _this.addComentario(item);
                        }
                        else {
                            var error = "Se esperaba un (identificador) para manejar para el ciclo while pero se encontro (" + item.getTipoExtend() + ")";
                            _this.addError(item, error);
                        }
                        break;
                    case 34: //Terminar la primer sentencia del for (int i=0;)
                        if (item.Tipo === 23 /* PUNTO_COMA */) {
                            estado = 42;
                        }
                        else if (_this.esComentario(item)) { //Si es comentario solo traducir y agregarlo
                            _this.addComentario(item);
                        }
                        else {
                            var error = "Se esperaba un (;) para manejar para el ciclo while pero se encontro (" + item.getTipoExtend() + ")";
                            _this.addError(item, error);
                        }
                        break;
                    case 35: //Validar if con más contenido
                        if (item.Tipo === 30 /* OR */ || item.Tipo === 29 /* AND */) {
                            estado = 10;
                            sentenciaTraducia += " " + item.Valor + " ";
                        }
                        else if (item.Tipo === 33 /* PARENTESIS_CIERRA */) {
                            estado = 38;
                        }
                        else if (_this.esComentario(item)) { //Si es comentario solo traducir y agregarlo
                            _this.addComentario(item);
                        }
                        else {
                            var error = "Se esperaba un ()|OR|AND) para manejar para el ciclo while pero se encontro (" + item.getTipoExtend() + ")";
                            _this.addError(item, error);
                        }
                        break;
                    case 36: //Para controlar el def switch, solo hemos encontrado la palabra switch
                        if (item.Tipo === 32 /* PARENTESIS_ABRE */) {
                            sentenciaTraducia += item.Valor;
                            estado = 64;
                        }
                        else if (_this.esComentario(item)) { //Si es comentario solo traducir y agregarlo
                            _this.addComentario(item);
                        }
                        else {
                            var error = "Se esperaba un ( para manejar para el ciclo while pero se encontro (" + item.getTipoExtend() + ")";
                            _this.addError(item, error);
                        }
                        break;
                    case 37: //Para la declaracion de parametros de funcion void
                        if (item.Tipo === 24 /* COMA */) {
                            sentenciaTraducia += item.Valor;
                            estado = 43;
                        }
                        else if (item.Tipo === 33 /* PARENTESIS_CIERRA */) {
                            sentenciaTraducia += item.Valor;
                            estado = 27;
                        }
                        else if (_this.esComentario(item)) { //Si es comentario solo traducir y agregarlo
                            _this.addComentario(item);
                        }
                        else {
                            var error = "Se esperaba un (,) para manejar la funcion pero se encontro (" + item.getTipoExtend() + ")";
                            _this.addError(item, error);
                        }
                        break;
                    case 38: //Terminar la declaracion de un void
                        if (item.Tipo === 35 /* LLAVE_ABRE */) {
                            sentenciaTraducia += ":";
                            _this.traduccionPyton.push(sentenciaTraducia);
                            sentenciaTraducia = "";
                            estado = 0;
                        }
                        else if (_this.esComentario(item)) { //Si es comentario solo traducir y agregarlo
                            _this.addComentario(item);
                        }
                        else {
                            var error = "Se esperaba un (}) iniciar segmento del void pero se encontro (" + item.getTipoExtend() + ")";
                            _this.addError(item, error);
                        }
                        break;
                    case 39: //Manejar los parametros de funcion por tipo de dato
                        if (item.Tipo === 24 /* COMA */) {
                            estado = 44;
                        }
                        else if (item.Tipo === 33 /* PARENTESIS_CIERRA */) {
                            sentenciaTraducia += item.Valor;
                            estado = 38;
                        }
                        else if (_this.esComentario(item)) { //Si es comentario solo traducir y agregarlo
                            _this.addComentario(item);
                        }
                        else {
                            var error = "Se esperaba un (,) para manejar parametros de funcion pero se encontro (" + item.getTipoExtend() + ")";
                            _this.addError(item, error);
                        }
                        break;
                    case 40: //Terminar la sentencia de console.write
                        if (item.Tipo === 23 /* PUNTO_COMA */) {
                            estado = 0;
                        }
                        else if (_this.esComentario(item)) { //Si es comentario solo traducir y agregarlo
                            _this.addComentario(item);
                        }
                        else {
                            var error = "Se esperaba un (;) para terminar el Console.Write pero se encontro (" + item.getTipoExtend() + ")";
                            _this.addError(item, error);
                        }
                        break;
                    case 41: //Terminar el ciclo while con )
                        if (33 /* PARENTESIS_CIERRA */) {
                            estado = 45;
                        }
                        else if (_this.esComentario(item)) { //Si es comentario solo traducir y agregarlo
                            _this.addComentario(item);
                        }
                        else {
                            var error = "Se esperaba un ()) para manejar el ciclo while pero se encontro (" + item.getTipoExtend() + ")";
                            _this.addError(item, error);
                        }
                        break;
                    case 42: //Encontrar un identificador del for(int i=0; i <- ese dato)
                        if (item.Tipo === 46 /* identificador */) {
                            estado = 46;
                        }
                        else if (_this.esComentario(item)) { //Si es comentario solo traducir y agregarlo
                            _this.addComentario(item);
                        }
                        else {
                            var error = "Se esperaba un (identificador) para manejar el ciclo for pero se encontro (" + item.getTipoExtend() + ")";
                            _this.addError(item, error);
                        }
                        break;
                    case 43: //Controlar los parametros
                        if (_this.esTipoDato(item)) {
                            estado = 28;
                        }
                        else if (_this.esComentario(item)) { //Si es comentario solo traducir y agregarlo
                            _this.addComentario(item);
                        }
                        else {
                            var error = "Se esperaba un (tipo de dato) para manejar los parametros pero se encontro (" + item.getTipoExtend() + ")";
                            _this.addError(item, error);
                        }
                        break;
                    case 44: //Controlar los parametros
                        if (_this.esTipoDato(item)) {
                            estado = 28;
                        }
                        else if (_this.esComentario(item)) { //Si es comentario solo traducir y agregarlo
                            _this.addComentario(item);
                        }
                        else {
                            var error = "Se esperaba un (tipo de dato) para manejar los parametros pero se encontro (" + item.getTipoExtend() + ")";
                            _this.addError(item, error);
                        }
                        break;
                    case 45: //Encontrar llave de apertura para terminar de traducir el ciclo while
                        if (item.Tipo === 35 /* LLAVE_ABRE */) {
                            sentenciaTraducia += ":";
                            _this.traduccionPyton.push(sentenciaTraducia);
                            sentenciaTraducia = "";
                            estado = 0;
                        }
                        else if (_this.esComentario(item)) { //Si es comentario solo traducir y agregarlo
                            _this.addComentario(item);
                        }
                        else {
                            var error = "Se esperaba un (tipo de dato) para manejar los parametros pero se encontro (" + item.getTipoExtend() + ")";
                            _this.addError(item, error);
                        }
                        break;
                    case 46: //Encontrar variable del for segundo parametro
                        if (item.Tipo === 37 /* MAYOR */ || item.Tipo === 38 /* MENOR */ || item.Tipo === 39 /* MAYOR_IGUAL */ || item.Tipo === 40 /* MENOR_IGUAL */) {
                            estado = 47;
                        }
                        else if (_this.esComentario(item)) { //Si es comentario solo traducir y agregarlo
                            _this.addComentario(item);
                        }
                        else {
                            var error = "Se esperaba un (tipo de dato) para manejar los parametros pero se encontro (" + item.getTipoExtend() + ")";
                            _this.addError(item, error);
                        }
                        break;
                    case 47: //Encontrar condicion del for
                        if (item.Tipo === 46 /* identificador */ || item.Tipo === 47 /* numero */) {
                            sentenciaTraducia += "," + item.Valor + ")";
                            estado = 48;
                        }
                        else if (_this.esComentario(item)) { //Si es comentario solo traducir y agregarlo
                            _this.addComentario(item);
                        }
                        else {
                            var error = "Se esperaba un (tipo de dato) para manejar los parametros pero se encontro (" + item.getTipoExtend() + ")";
                            _this.addError(item, error);
                        }
                        break;
                    case 48: //Encontrar limite del for
                        if (item.Tipo === 23 /* PUNTO_COMA */) {
                            sentenciaTraducia += ":";
                            estado = 49;
                        }
                        else if (_this.esComentario(item)) { //Si es comentario solo traducir y agregarlo
                            _this.addComentario(item);
                        }
                        else {
                            var error = "Se esperaba un (;) para manejar los parametros pero se encontro (" + item.getTipoExtend() + ")";
                            _this.addError(item, error);
                        }
                        break;
                    case 49: //Econtrar punto y coma para el tipo for
                        if (item.Tipo === 46 /* identificador */) {
                            estado = 50;
                        }
                        else if (_this.esComentario(item)) { //Si es comentario solo traducir y agregarlo
                            _this.addComentario(item);
                        }
                        else {
                            var error = "Se esperaba un (identificador) para manejar los parametros pero se encontro (" + item.getTipoExtend() + ")";
                            _this.addError(item, error);
                        }
                        break;
                    case 50: //Encontrar identificador del ultimo parametro for
                        if (item.Tipo == 45 /* DECREMENTO */ || item.Tipo === 44 /* INCREMENTO */) {
                            estado = 51;
                        }
                        else if (_this.esComentario(item)) { //Si es comentario solo traducir y agregarlo
                            _this.addComentario(item);
                        }
                        else {
                            var error = "Se esperaba un (++|--) para manejar los parametros pero se encontro (" + item.getTipoExtend() + ")";
                            _this.addError(item, error);
                        }
                        break;
                    case 51:
                        if (item.Tipo === 33 /* PARENTESIS_CIERRA */) {
                            estado = 52;
                        }
                        else if (_this.esComentario(item)) { //Si es comentario solo traducir y agregarlo
                            _this.addComentario(item);
                        }
                        else {
                            var error = "Se esperaba un ) para manejar los parametros pero se encontro (" + item.getTipoExtend() + ")";
                            _this.addError(item, error);
                        }
                        break;
                    case 52:
                        if (item.Tipo === 35 /* LLAVE_ABRE */) {
                            estado = 0;
                            _this.traduccionPyton.push(sentenciaTraducia);
                            sentenciaTraducia = "";
                        }
                        else if (_this.esComentario(item)) { //Si es comentario solo traducir y agregarlo
                            _this.addComentario(item);
                        }
                        else {
                            var error = "Se esperaba un { para manejar los parametros pero se encontro (" + item.getTipoExtend() + ")";
                            _this.addError(item, error);
                        }
                        break;
                    case 53:
                        if (item.Tipo === 25 /* SUMA */) {
                            sentenciaTraducia += ",";
                            estado = 23;
                        }
                        else if (item.Tipo === 33 /* PARENTESIS_CIERRA */) {
                            sentenciaTraducia += item.Valor;
                            estado = 65;
                        }
                        else if (_this.esComentario(item)) { //Si es comentario solo traducir y agregarlo
                            _this.addComentario(item);
                        }
                        else {
                            var error = "Se esperaba un if para manejar los parametros pero se encontro (" + item.getTipoExtend() + ")";
                            _this.addError(item, error);
                        }
                        break;
                    case 54:
                        if (item.Tipo === 9 /* if */) {
                            sentenciaTraducia = "elif ";
                            estado = 55;
                        }
                        else if (item.Tipo === 35 /* LLAVE_ABRE */) {
                            _this.traduccionPyton.push("else{");
                            estado = 0;
                        }
                        else if (_this.esComentario(item)) { //Si es comentario solo traducir y agregarlo
                            _this.addComentario(item);
                        }
                        else {
                            var error = "Se esperaba un if para manejar los parametros pero se encontro (" + item.getTipoExtend() + ")";
                            _this.addError(item, error);
                        }
                        break;
                    case 55:
                        if (item.Tipo === 32 /* PARENTESIS_ABRE */) {
                            estado = 10;
                        }
                        else if (_this.esComentario(item)) { //Si es comentario solo traducir y agregarlo
                            _this.addComentario(item);
                        }
                        else {
                            var error = "Se esperaba un ( para manejar los parametros pero se encontro (" + item.getTipoExtend() + ")";
                            _this.addError(item, error);
                        }
                        break;
                    case 56:
                        if (item.Tipo === 23 /* PUNTO_COMA */) {
                            _this.traduccionPyton.push("return");
                            estado = 0;
                        }
                        else if (item.Tipo === 47 /* numero */ || item.Tipo === 46 /* identificador */ || item.Tipo === 48 /* cadena */) {
                            sentenciaTraducia += "return " + item.Valor;
                            estado = 57;
                        }
                        else if (_this.esComentario(item)) { //Si es comentario solo traducir y agregarlo
                            _this.addComentario(item);
                        }
                        else {
                            var error = "Se esperaba un (;) para manejar los parametros pero se encontro (" + item.getTipoExtend() + ")";
                            _this.addError(item, error);
                        }
                        break;
                    case 57:
                        if (item.Tipo === 25 /* SUMA */ || item.Tipo === 26 /* RESTA */ || item.Tipo === 28 /* DIVISION */ || item.Tipo === 27 /* MULTIPLICACION */) {
                            sentenciaTraducia += item.Valor;
                            estado = 58;
                        }
                        else if (item.Tipo === 23 /* PUNTO_COMA */) {
                            _this.traduccionPyton.push(sentenciaTraducia);
                            sentenciaTraducia = "";
                            estado = 0;
                        }
                        else if (_this.esComentario(item)) { //Si es comentario solo traducir y agregarlo
                            _this.addComentario(item);
                        }
                        else {
                            var error = "Se esperaba un (+|-|/|*|;) para manejar los parametros pero se encontro (" + item.getTipoExtend() + ")";
                            _this.addError(item, error);
                        }
                        break;
                    case 58:
                        if (item.Tipo === 47 /* numero */ || item.Tipo === 46 /* identificador */ || item.Tipo === 48 /* cadena */) {
                            sentenciaTraducia += item.Valor;
                            estado = 57;
                        }
                        else if (_this.esComentario(item)) { //Si es comentario solo traducir y agregarlo
                            _this.addComentario(item);
                        }
                        else {
                            var error = "Se esperaba un (;) para manejar los parametros pero se encontro (" + item.getTipoExtend() + ")";
                            _this.addError(item, error);
                        }
                        break;
                    case 59:
                        if (item.Tipo === 46 /* identificador */ || item.Tipo === 47 /* numero */) {
                            estado = 60;
                            sentenciaTraducia += item.Valor;
                        }
                        else if (_this.esComentario(item)) { //Si es comentario solo traducir y agregarlo
                            _this.addComentario(item);
                        }
                        else {
                            var error = "Se esperaba un (identificador|numero) para manejar los parametros pero se encontro (" + item.getTipoExtend() + ")";
                            _this.addError(item, error);
                        }
                        break;
                    case 60:
                        if (_this.esRelacional(item)) {
                            estado = 61;
                            sentenciaTraducia += item.Valor;
                        }
                        else if (_this.esComentario(item)) { //Si es comentario solo traducir y agregarlo
                            _this.addComentario(item);
                        }
                        else {
                            var error = "Se esperaba un (<|>|>=|<=|!=|==) para manejar los parametros pero se encontro (" + item.getTipoExtend() + ")";
                            _this.addError(item, error);
                        }
                        break;
                    case 61:
                        if (item.Tipo === 46 /* identificador */ || item.Tipo === 47 /* numero */) {
                            estado = 62;
                            sentenciaTraducia += item.Valor;
                        }
                        else if (_this.esComentario(item)) { //Si es comentario solo traducir y agregarlo
                            _this.addComentario(item);
                        }
                        else {
                            var error = "Se esperaba un (identificador|numero) para manejar los parametros pero se encontro (" + item.getTipoExtend() + ")";
                            _this.addError(item, error);
                        }
                        break;
                    case 62:
                        if (item.Tipo === 33 /* PARENTESIS_CIERRA */) {
                            estado = 63;
                            sentenciaTraducia += item.Valor;
                        }
                        else if (_this.esComentario(item)) { //Si es comentario solo traducir y agregarlo
                            _this.addComentario(item);
                        }
                        else {
                            var error = "Se esperaba un ) para manejar los parametros pero se encontro (" + item.getTipoExtend() + ")";
                            _this.addError(item, error);
                        }
                        break;
                    case 63:
                        if (item.Tipo === 23 /* PUNTO_COMA */) {
                            estado = 0;
                            _this.traduccionPyton.push(sentenciaTraducia);
                            _this.traduccionPyton.push("break");
                            sentenciaTraducia = "";
                        }
                        else if (_this.esComentario(item)) { //Si es comentario solo traducir y agregarlo
                            _this.addComentario(item);
                        }
                        else {
                            var error = "Se esperaba un ; para manejar los parametros pero se encontro (" + item.getTipoExtend() + ")";
                            _this.addError(item, error);
                        }
                        break;
                    case 64:
                        if (item.Tipo === 46 /* identificador */ || item.Tipo === 47 /* numero */) {
                            sentenciaTraducia += item.Valor;
                            estado = 74;
                        }
                        else if (_this.esComentario(item)) { //Si es comentario solo traducir y agregarlo
                            _this.addComentario(item);
                        }
                        else {
                            var error = "Se esperaba un ()|OR|AND) para manejar para el ciclo while pero se encontro (" + item.getTipoExtend() + ")";
                            _this.addError(item, error);
                        }
                        break;
                    case 65:
                        if (item.Tipo === 23 /* PUNTO_COMA */) {
                            if (esSwitch) {
                                sentenciaTraducia += ",";
                            }
                            _this.traduccionPyton.push(sentenciaTraducia);
                            sentenciaTraducia = "";
                            estado = 0;
                        }
                        else if (_this.esComentario(item)) { //Si es comentario solo traducir y agregarlo
                            _this.addComentario(item);
                        }
                        else {
                            var error = "Se esperaba un ; para manejar para el console.write pero se encontro (" + item.getTipoExtend() + ")";
                            _this.addError(item, error);
                        }
                        break;
                    case 66:
                        if (item.Tipo === 35 /* LLAVE_ABRE */) {
                            estado = 67;
                            sentenciaTraducia += ":";
                            _this.traduccionPyton.push(sentenciaTraducia);
                            _this.traduccionPyton.push("switcher = {");
                            sentenciaTraducia = "";
                        }
                        else if (_this.esComentario(item)) { //Si es comentario solo traducir y agregarlo
                            _this.addComentario(item);
                        }
                        else {
                            var error = "Se esperaba un { para manejar para el switch pero se encontro (" + item.getTipoExtend() + ")";
                            _this.addError(item, error);
                        }
                        break;
                    case 67:
                        if (item.Tipo === 14 /* case */) {
                            estado = 68;
                        }
                        else if (_this.esComentario(item)) { //Si es comentario solo traducir y agregarlo
                            _this.addComentario(item);
                        }
                        else {
                            var error = "Se esperaba un case para manejar para el ciclo while pero se encontro (" + item.getTipoExtend() + ")";
                            _this.addError(item, error);
                        }
                        break;
                    case 68:
                        if (item.Tipo === 47 /* numero */) {
                            estado = 69;
                            switchActual = item.Valor;
                        }
                        else if (_this.esComentario(item)) { //Si es comentario solo traducir y agregarlo
                            _this.addComentario(item);
                        }
                        else {
                            var error = "Se esperaba un numero para manejar para el ciclo while pero se encontro (" + item.getTipoExtend() + ")";
                            _this.addError(item, error);
                        }
                        break;
                    case 69:
                        if (item.Tipo === 34 /* DOS_PUNTOS */) {
                            estado = 70;
                            sentenciaTraducia = switchActual + ": ";
                        }
                        else if (_this.esComentario(item)) { //Si es comentario solo traducir y agregarlo
                            _this.addComentario(item);
                        }
                        else {
                            var error = "Se esperaba un numero para manejar para el ciclo while pero se encontro (" + item.getTipoExtend() + ")";
                            _this.addError(item, error);
                        }
                        break;
                    case 70:
                        if (item.Tipo === 46 /* identificador */) {
                            sentenciaTraducia += item.Valor;
                            estado = 71;
                        }
                        else if (11 /* CONSOLE */) {
                            estado = 1; //Eajsflkasjfasfasfasfas----------------------------------------------------------------------
                        }
                        else if (_this.esComentario(item)) { //Si es comentario solo traducir y agregarlo
                            _this.addComentario(item);
                        }
                        else {
                            var error = "Se esperaba un numero para manejar para el ciclo while pero se encontro (" + item.getTipoExtend() + ")";
                            _this.addError(item, error);
                        }
                        break;
                    case 71:
                        if (item.Tipo === 22 /* IGUAL */) {
                            sentenciaTraducia += item.Valor;
                            estado = 72;
                        }
                        else if (_this.esComentario(item)) { //Si es comentario solo traducir y agregarlo
                            _this.addComentario(item);
                        }
                        else {
                            var error = "Se esperaba un numero para manejar para el ciclo while pero se encontro (" + item.getTipoExtend() + ")";
                            _this.addError(item, error);
                        }
                        break;
                    case 72:
                        if (item.Tipo === 47 /* numero */ || item.Tipo === 48 /* cadena */) {
                            sentenciaTraducia += item.Valor;
                            estado = 73;
                        }
                        else if (_this.esComentario(item)) { //Si es comentario solo traducir y agregarlo
                            _this.addComentario(item);
                        }
                        else {
                            var error = "Se esperaba un numero para manejar para el ciclo while pero se encontro (" + item.getTipoExtend() + ")";
                            _this.addError(item, error);
                        }
                        break;
                    case 73:
                        if (item.Tipo === 23 /* PUNTO_COMA */) {
                            sentenciaTraducia += ",";
                            _this.traduccionPyton.push(sentenciaTraducia);
                            estado = 0;
                        }
                        else if (_this.esComentario(item)) { //Si es comentario solo traducir y agregarlo
                            _this.addComentario(item);
                        }
                        else {
                            var error = "Se esperaba un numero para manejar para el ciclo while pero se encontro (" + item.getTipoExtend() + ")";
                            _this.addError(item, error);
                        }
                        break;
                    case 74:
                        if (item.Tipo === 33 /* PARENTESIS_CIERRA */) {
                            sentenciaTraducia += item.Valor;
                            estado = 66;
                        }
                        else if (_this.esComentario(item)) { //Si es comentario solo traducir y agregarlo
                            _this.addComentario(item);
                        }
                        else {
                            var error = "Se esperaba un numero para manejar para el ciclo while pero se encontro (" + item.getTipoExtend() + ")";
                            _this.addError(item, error);
                        }
                        break;
                }
            }
        });
        console.log("errores Lexicos: " + this.auxListaTokens.length);
        console.log("errores Sintacticos: " + this.listaErrores.length);
    };
    parser.prototype.cargarPageErrores = function () {
        var _this = this;
        var conteo = 1;
        this.auxListaTokens.forEach(function (element) {
            if (element.getTipoExtend() === "Error lexico") {
                _this.ambosErrores.push(new erroresList_1.errorItem(conteo + "", "Lexico", element.Linea + "", element.Colummna + "", element.Valor));
                conteo++;
            }
        });
        this.listaErrores.forEach(function (error) {
            _this.ambosErrores.push(new erroresList_1.errorItem(conteo + "", "Sintactico", error.Linea + "", error.Columna + "", error.Error));
            conteo++;
        });
        var table = document.getElementById('tablaErrores');
        if (table) {
            console.log("Encontramos la tabla");
            this.AmbosErrores.forEach(function (item) {
                var newRow = table.insertRow(table.rows.length);
                var no = newRow.insertCell(0);
                var tipo = newRow.insertCell(1);
                var linea = newRow.insertCell(2);
                var columna = newRow.insertCell(3);
                var descripcion = newRow.insertCell(4);
                no.innerHTML = item.No;
                tipo.innerHTML = item.Tipo;
                linea.innerHTML = item.Linea;
                columna.innerHTML = item.Columna;
                descripcion.innerHTML = item.Descripcion;
            });
        }
    };
    parser.prototype.pintarVariables = function () {
        var tabla = document.getElementById('tablaVariables');
        this.listaVariables.forEach(function (varItem) {
            var newRow = tabla.insertRow(tabla.rows.length);
            var nombre = newRow.insertCell(0);
            var tipo = newRow.insertCell(1);
            var linea = newRow.insertCell(2);
            nombre.innerHTML = varItem.ID;
            tipo.innerHTML = varItem.Tipo;
            linea.innerHTML = varItem.Valor;
        });
    };
    parser.prototype.mostrarTraduccion = function () {
        console.log("-----------------------------");
        var traduccion = "";
        this.traduccionPyton.forEach(function (element) {
            traduccion += element + "\n";
            console.log(element);
        });
        var elementoEntrada = document.getElementById('txtSalidaP');
        if (elementoEntrada) {
            elementoEntrada.value = traduccion;
        }
    };
    parser.prototype.addError = function (tokenActual, tipoError) {
        this.listaErrores.push(new errorSintactico_1.errorSintactico(tokenActual.Valor, tokenActual.Linea, tokenActual.Colummna, tipoError + " = " + tokenActual.Valor));
    };
    parser.prototype.addComentario = function (tokenActual) {
        var cadena;
        if (tokenActual.Tipo === 0 /* Comentario_Lineal */) {
            cadena = tokenActual.Valor.replace("//", "#");
        }
        else {
            cadena = tokenActual.Valor.replace("/*", "'''");
            cadena = cadena.replace("*/", "'''");
        }
        this.traduccionPyton.push(cadena);
    };
    parser.prototype.esRelacional = function (tokenActual) {
        if (tokenActual.Tipo === 37 /* MAYOR */ || tokenActual.Tipo === 38 /* MENOR */ || tokenActual.Tipo === 39 /* MAYOR_IGUAL */ || tokenActual.Tipo === 40 /* MENOR_IGUAL */ || tokenActual.Tipo === 42 /* DISTINTO */ || tokenActual.Tipo === 41 /* IGUAL_IGUAL */) {
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
    parser.prototype.pintarHTML = function () {
        var txtHTML = document.getElementById('txthtml');
        if (txtHTML) {
            var htmltxt_1 = "";
            this.htmlExtend.forEach(function (element) {
                htmltxt_1 += element + "\n";
            });
            txtHTML.value = htmltxt_1;
        }
    };
    return parser;
}());
function iniciarParser() {
    var parserFun = new parser();
    parserFun.startParse();
    parserFun.mostrarTraduccion();
    parserFun.pintarVariables();
    parserFun.cargarPageErrores();
    parserFun.pintarHTML();
}
exports.iniciarParser = iniciarParser;
var elementButon = document.getElementById('btnTraducir');
if (elementButon) {
    elementButon.addEventListener('click', iniciarParser, false);
}
