"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var token_1 = require("./token");
var scanner = /** @class */ (function () {
    function scanner() {
        this.listaToken = new Array;
        this.auxLexico = "";
        this.estado = 0;
    }
    Object.defineProperty(scanner.prototype, "ListaToken", {
        get: function () {
            return this.listaToken;
        },
        enumerable: true,
        configurable: true
    });
    scanner.prototype.startScanner = function () {
        var entrada;
        var elementoEntrada = document.getElementById('txtEntradaC');
        if (elementoEntrada) {
            entrada = elementoEntrada.value;
        }
        console.log(entrada);
        entrada += "#";
        var linea = 1;
        var columna = 1;
        var caracter;
        var asciiChar;
        console.log("caracteres en cadena: " + entrada.length);
        for (var i = 0; i < entrada.length; i++) {
            caracter = entrada.charAt(i);
            asciiChar = caracter.charCodeAt(0);
            console.log(this.estado + " -> " + caracter + " -> ASCII(" + asciiChar + ")");
            switch (this.estado) {
                case 0:
                    this.auxLexico += caracter;
                    if (this.esNumero(caracter)) {
                        this.estado = 10;
                    }
                    else if (asciiChar === 47) { // Char /
                        this.estado = 1;
                    }
                    else if (asciiChar === 34) { //Char "
                        this.estado = 2;
                    }
                    else if (asciiChar === 39) { //Char '
                        this.estado = 2;
                    }
                    else if (asciiChar === 61) { //Char =
                        this.estado = 3;
                    }
                    else if (asciiChar === 59) { //Char ;
                        this.addToken(23 /* PUNTO_COMA */, caracter, linea, columna);
                    }
                    else if (asciiChar === 44) { //Char ,
                        this.addToken(24 /* COMA */, caracter, linea, columna);
                    }
                    else if (asciiChar === 43) { //Char +
                        this.estado = 16;
                    }
                    else if (asciiChar === 45) { //Char -
                        this.estado = 17;
                    }
                    else if (asciiChar === 42) { //Char *
                        this.addToken(27 /* MULTIPLICACION */, caracter, linea, columna);
                    }
                    else if (asciiChar === 38) { // Char &
                        this.estado = 4;
                    }
                    else if (asciiChar === 124) { //Char |
                        this.estado = 5;
                    }
                    else if (asciiChar === 33) { //Char  !
                        this.estado = 6;
                    }
                    else if (asciiChar === 40) { //Char (
                        this.addToken(32 /* PARENTESIS_ABRE */, caracter, linea, columna);
                    }
                    else if (asciiChar === 41) { //Char )
                        this.addToken(33 /* PARENTESIS_CIERRA */, caracter, linea, columna);
                    }
                    else if (asciiChar === 58) { //Char :
                        this.addToken(34 /* DOS_PUNTOS */, caracter, linea, columna);
                    }
                    else if (asciiChar === 123) { //Char {
                        this.addToken(35 /* LLAVE_ABRE */, caracter, linea, columna);
                    }
                    else if (asciiChar === 125) { //Char }
                        this.addToken(36 /* LLAVE_CIERRA */, caracter, linea, columna);
                    }
                    else if (asciiChar === 62) { //Char >
                        this.estado = 7;
                    }
                    else if (asciiChar === 60) { // Char <
                        this.estado = 8;
                    }
                    else if (asciiChar === 46) { //Char .
                        this.addToken(43 /* PUNTO */, caracter, linea, columna);
                    }
                    else if (this.esLetra(caracter)) {
                        this.estado = 9;
                    }
                    else if (asciiChar === 95) { //Char _
                        this.estado = 9;
                    }
                    else if (asciiChar === 10) { // Salto de linea
                        linea++;
                        columna = 0;
                        this.limpiarVariables();
                    }
                    else if (asciiChar === 32 || asciiChar === 9 || asciiChar === 13) { //Espacio y tabulador
                        //Ignorar
                        this.limpiarVariables();
                    }
                    else if (asciiChar === 35 && i === entrada.length - 1) {
                        //Ignorar caracter final
                    }
                    else {
                        this.addToken(49 /* ERROR_LEXICO */, caracter, linea, columna);
                    }
                    break;
                case 1:
                    if (asciiChar === 47) { //Char /
                        this.auxLexico += caracter;
                        this.estado = 11;
                    }
                    else if (asciiChar === 42) { //Char *
                        this.auxLexico += caracter;
                        this.estado = 12;
                    }
                    else {
                        this.addToken(28 /* DIVISION */, this.auxLexico, linea, columna);
                        i--;
                    }
                    break;
                case 2:
                    if (asciiChar === 34 || asciiChar === 39) { //Char "
                        this.auxLexico += caracter;
                        this.addToken(48 /* cadena */, this.auxLexico, linea, columna);
                    }
                    else {
                        this.auxLexico += caracter;
                    }
                    break;
                case 3:
                    if (asciiChar === 61) { //Char =
                        this.auxLexico += caracter;
                        this.addToken(41 /* IGUAL_IGUAL */, this.auxLexico, linea, columna);
                    }
                    else {
                        this.addToken(22 /* IGUAL */, this.auxLexico, linea, columna);
                        i--;
                    }
                    break;
                case 4:
                    if (asciiChar === 38) { //Char &
                        this.auxLexico += caracter;
                        this.addToken(29 /* AND */, this.auxLexico, linea, columna);
                    }
                    else if (asciiChar === 103) { //Char g
                        this.auxLexico += caracter;
                        this.estado = 18;
                    }
                    else if (asciiChar === 108) { //Char l
                        this.auxLexico += caracter;
                        this.estado = 19;
                    }
                    else {
                        this.addToken(49 /* ERROR_LEXICO */, this.auxLexico, linea, columna);
                        i--;
                    }
                    break;
                case 5:
                    if (asciiChar === 124) { //Char |
                        this.auxLexico += caracter;
                        this.addToken(30 /* OR */, this.auxLexico, linea, columna);
                    }
                    else {
                        this.addToken(49 /* ERROR_LEXICO */, this.auxLexico, linea, columna);
                        i--;
                    }
                    break;
                case 6:
                    if (asciiChar === 61) { //Char =
                        this.auxLexico += caracter;
                        this.addToken(42 /* DISTINTO */, this.auxLexico, linea, columna);
                    }
                    else {
                        this.addToken(31 /* NOT */, this.auxLexico, linea, columna);
                        i--;
                    }
                    break;
                case 7:
                    if (asciiChar === 61) { //Char =
                        this.auxLexico += caracter;
                        this.addToken(39 /* MAYOR_IGUAL */, this.auxLexico, linea, columna);
                    }
                    else {
                        this.addToken(37 /* MAYOR */, this.auxLexico, linea, columna);
                        i--;
                    }
                    break;
                case 8:
                    if (asciiChar === 61) { //Char =
                        this.auxLexico += caracter;
                        this.addToken(40 /* MENOR_IGUAL */, this.auxLexico, linea, columna);
                    }
                    else {
                        this.addToken(38 /* MENOR */, this.auxLexico, linea, columna);
                        i--;
                    }
                    break;
                case 9:
                    if (this.esNumero(caracter)) {
                        this.auxLexico += caracter;
                    }
                    else if (this.auxLexico === "int") {
                        this.addToken(2 /* int */, this.auxLexico, linea, columna);
                        i--;
                    }
                    else if (this.auxLexico === "double") {
                        this.addToken(3 /* double */, this.auxLexico, linea, columna);
                        i--;
                    }
                    else if (this.auxLexico === "char") {
                        this.addToken(4 /* char */, this.auxLexico, linea, columna);
                        i--;
                    }
                    else if (this.auxLexico === "bool") {
                        this.addToken(5 /* bool */, this.auxLexico, linea, columna);
                        i--;
                    }
                    else if (this.auxLexico === "string") {
                        this.addToken(6 /* string */, this.auxLexico, linea, columna);
                        i--;
                    }
                    else if (this.auxLexico === "void") {
                        this.addToken(7 /* void */, this.auxLexico, linea, columna);
                        i--;
                    }
                    else if (this.auxLexico === "main") {
                        this.addToken(8 /* main */, this.auxLexico, linea, columna);
                        i--;
                    }
                    else if (this.auxLexico === "if") {
                        this.addToken(9 /* if */, this.auxLexico, linea, columna);
                        i--;
                    }
                    else if (this.auxLexico === "else") {
                        this.addToken(10 /* else */, this.auxLexico, linea, columna);
                        i--;
                    }
                    else if (this.auxLexico === "Console") {
                        this.addToken(11 /* CONSOLE */, this.auxLexico, linea, columna);
                        i--;
                    }
                    else if (this.auxLexico === "Write") {
                        this.addToken(12 /* WRITE */, this.auxLexico, linea, columna);
                        i--;
                    }
                    else if (this.auxLexico === "switch") {
                        this.addToken(13 /* switch */, this.auxLexico, linea, columna);
                        i--;
                    }
                    else if (this.auxLexico === "case") {
                        this.addToken(14 /* case */, this.auxLexico, linea, columna);
                        i--;
                    }
                    else if (this.auxLexico === "break") {
                        this.addToken(15 /* break */, this.auxLexico, linea, columna);
                        i--;
                    }
                    else if (this.auxLexico === "for") {
                        this.addToken(16 /* for */, this.auxLexico, linea, columna);
                        i--;
                    }
                    else if (this.auxLexico === "while") {
                        this.addToken(18 /* do */, this.auxLexico, linea, columna);
                        i--;
                    }
                    else if (this.auxLexico === "do") {
                        var auxCaracter = entrada.charAt(i + 1);
                        console.log(auxCaracter);
                        if (auxCaracter === "b") {
                            this.auxLexico += caracter;
                            //omitir el do
                        }
                        else {
                            this.addToken(18 /* do */, this.auxLexico, linea, columna);
                            i--;
                        }
                    }
                    else if (this.auxLexico === "return") {
                        this.addToken(19 /* return */, this.auxLexico, linea, columna);
                        i--;
                    }
                    else if (this.auxLexico === "continue") {
                        this.addToken(20 /* continue */, this.auxLexico, linea, columna);
                        i--;
                    }
                    else if (this.auxLexico === "default") {
                        this.addToken(21 /* default */, this.auxLexico, linea, columna);
                        i--;
                    }
                    else if (this.esLetra(caracter)) {
                        this.auxLexico += caracter;
                    }
                    else if (asciiChar === 95) { //Char _
                        this.auxLexico += caracter;
                    }
                    else {
                        this.addToken(46 /* identificador */, this.auxLexico, linea, columna);
                        i--;
                    }
                    break;
                case 10:
                    if (this.esNumero(caracter)) {
                        this.auxLexico += caracter;
                    }
                    else if (asciiChar === 46) { //Char .
                        this.auxLexico += caracter;
                        this.estado = 13;
                    }
                    else {
                        this.addToken(47 /* numero */, this.auxLexico, linea, columna);
                        i--;
                    }
                    break;
                case 11:
                    if (asciiChar === 10) { //Salto de linea
                        this.addToken(0 /* Comentario_Lineal */, this.auxLexico, linea, columna);
                    }
                    else {
                        this.auxLexico += caracter;
                    }
                    break;
                case 12:
                    this.auxLexico += caracter;
                    if (asciiChar === 42) { //Char *
                        this.estado = 14;
                    }
                    break;
                case 13:
                    if (this.esNumero(caracter)) {
                        this.auxLexico += caracter;
                        this.estado = 15;
                    }
                    else {
                        this.addToken(49 /* ERROR_LEXICO */, this.auxLexico, linea, columna);
                        i--;
                    }
                    break;
                case 14:
                    if (asciiChar === 47) { //Char /
                        this.auxLexico += caracter;
                        this.addToken(1 /* Comentario_Multilinea */, this.auxLexico, linea, columna);
                    }
                    else {
                        this.auxLexico += caracter;
                        this.estado = 12;
                    }
                    break;
                case 15:
                    if (this.esNumero(caracter)) {
                        this.auxLexico += caracter;
                    }
                    else {
                        this.addToken(47 /* numero */, this.auxLexico, linea, columna);
                        i--;
                    }
                    break;
                case 16:
                    if (asciiChar === 43) { //Char +
                        this.auxLexico += caracter;
                        this.addToken(44 /* INCREMENTO */, this.auxLexico, linea, columna);
                    }
                    else {
                        this.addToken(25 /* SUMA */, this.auxLexico, linea, columna);
                        i--;
                    }
                    break;
                case 17:
                    if (asciiChar === 45) { //Char -
                        this.auxLexico += caracter;
                        this.addToken(45 /* DECREMENTO */, this.auxLexico, linea, columna);
                    }
                    else {
                        this.addToken(26 /* RESTA */, this.auxLexico, linea, columna);
                        i--;
                    }
                    break;
                case 18:
                    if (asciiChar === 116) { //Char t
                        this.auxLexico += caracter;
                        this.estado = 20;
                    }
                    else {
                        this.addToken(49 /* ERROR_LEXICO */, this.auxLexico, linea, columna);
                        i--;
                    }
                    break;
                case 19:
                    if (asciiChar === 116) { //Char t
                        this.auxLexico += caracter;
                        this.estado = 21;
                    }
                    else {
                        this.addToken(49 /* ERROR_LEXICO */, this.auxLexico, linea, columna);
                        i--;
                    }
                    break;
                case 20:
                    if (asciiChar === 59) { //Char ;
                        this.auxLexico += caracter;
                        this.estado = 7;
                    }
                    else {
                        this.addToken(49 /* ERROR_LEXICO */, this.auxLexico, linea, columna);
                        i--;
                    }
                    break;
                case 21:
                    if (asciiChar === 59) { //Char ;
                        this.auxLexico += caracter;
                        this.estado = 8;
                    }
                    else {
                        this.addToken(49 /* ERROR_LEXICO */, this.auxLexico, linea, columna);
                        i--;
                    }
                    break;
            }
            columna++;
        }
        console.log("Se ha analizado el archivo");
    };
    scanner.prototype.mostrarAnalisisLexico = function () {
        console.log("mostrando analisis lexico");
        this.listaToken.forEach(function (item) {
            console.log(item.getTipoExtend() + " -> " + item.Valor + " -> " + item.Linea + "\n");
        });
    };
    scanner.prototype.esNumero = function (caracter) {
        var ascii = caracter.charCodeAt(0);
        if (ascii > 47 && ascii < 58) {
            return true;
        }
        else {
            return false;
        }
    };
    scanner.prototype.esLetra = function (caracter) {
        var ascii = caracter.toUpperCase().charCodeAt(0);
        if (ascii > 64 && ascii < 91) {
            return true;
        }
        else {
            return false;
        }
    };
    scanner.prototype.addToken = function (tokenType, dato, linea, columna) {
        this.listaToken.push(new token_1.token(tokenType, dato, linea, columna));
        this.limpiarVariables();
    };
    scanner.prototype.limpiarVariables = function () {
        this.auxLexico = "";
        this.estado = 0;
    };
    return scanner;
}());
function iniciarScanner() {
    var scannerFun = new scanner();
    scannerFun.startScanner();
    scannerFun.mostrarAnalisisLexico();
    return scannerFun.ListaToken;
}
exports.iniciarScanner = iniciarScanner;
