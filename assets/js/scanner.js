"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var token_1 = require("./token");
var scanner = /** @class */ (function () {
    function scanner() {
        this.listaToken = new Array;
        this.auxLexico = "";
        this.estado = 0;
    }
    scanner.prototype.startScanner = function () {
        var entrada;
        var elementoEntrada = document.getElementById('txtEntradaC');
        if (elementoEntrada) {
            entrada = elementoEntrada.innerHTML;
        }
        entrada += "#";
        var linea = 1;
        var caracter;
        for (var i = 0; i < entrada.length; i++) {
            caracter = entrada.charAt(i);
            switch (this.estado) {
                case 0:
                    this.auxLexico += caracter;
                    if (isNaN(caracter)) {
                        if (caracter === "/") {
                            this.estado = 1;
                        }
                        else if (caracter === "\"") {
                            this.estado = 2;
                        }
                        else if (caracter === "=") {
                            this.estado = 3;
                        }
                        else if (caracter === ";") {
                            this.addToken(22 /* PUNTO_COMA */, caracter, linea);
                        }
                        else if (caracter === ",") {
                            this.addToken(23 /* COMA */, caracter, linea);
                        }
                        else if (caracter === "+") {
                            this.addToken(24 /* SUMA */, caracter, linea);
                        }
                        else if (caracter === "-") {
                            this.addToken(25 /* RESTA */, caracter, linea);
                        }
                        else if (caracter === "*") {
                            this.addToken(26 /* MULTIPLICACION */, caracter, linea);
                        }
                        else if (caracter === "&") {
                            this.estado = 4;
                        }
                        else if (caracter === "|") {
                            this.estado = 5;
                        }
                        else if (caracter === "!") {
                            this.estado = 6;
                        }
                        else if (caracter === "(") {
                            this.addToken(31 /* PARENTESIS_ABRE */, caracter, linea);
                        }
                        else if (caracter === ")") {
                            this.addToken(32 /* PARENTESIS_CIERRA */, caracter, linea);
                        }
                        else if (caracter === ":") {
                            this.addToken(33 /* DOS_PUNTOS */, caracter, linea);
                        }
                        else if (caracter === "{") {
                            this.addToken(34 /* LLAVE_ABRE */, caracter, linea);
                        }
                        else if (caracter === "}") {
                            this.addToken(35 /* LLAVE_CIERRA */, caracter, linea);
                        }
                        else if (caracter === ">") {
                            this.estado = 7;
                        }
                        else if (caracter === "<") {
                            this.estado = 8;
                        }
                        else if (this.esLetra(caracter)) {
                            this.estado = 9;
                        }
                        else if (caracter === "\n") {
                            linea++;
                        }
                        else if (caracter === " " || caracter === "\t") {
                            //Ignorar                        
                        }
                        else if (caracter === "#") {
                            console.log("final");
                        }
                        else {
                            this.addToken(45 /* ERROR_LEXICO */, caracter, linea);
                        }
                    }
                    else {
                        this.estado = 10;
                    }
                    break;
                case 1:
                    if (caracter === "/") {
                        this.auxLexico += caracter;
                        this.estado = 11;
                    }
                    else if (caracter === "*") {
                        this.auxLexico += caracter;
                        this.estado = 12;
                    }
                    else {
                        this.addToken(27 /* DIVISION */, this.auxLexico, linea);
                        i--;
                    }
                    break;
                case 2:
                    if (caracter === "=") {
                        this.auxLexico += caracter;
                        this.addToken(40 /* IGUAL_IGUAL */, this.auxLexico, linea);
                    }
                    else {
                        this.addToken(21 /* IGUAL */, this.auxLexico, linea);
                        i--;
                    }
                    break;
            }
        }
        var textoSalida = "salida";
        console.log("mostrando analisis lexico");
        this.listaToken.forEach(function (item) {
            textoSalida += item.getTipoExtend + " -> " + item.Valor + " -> " + item.Linea + "\n";
            console.log(item.Valor);
        });
        var elementButon = document.getElementById('txtSalidaP');
        if (elementButon) {
            elementButon.innerHTML = textoSalida;
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
    scanner.prototype.addToken = function (tokenType, dato, linea) {
        this.listaToken.push(new token_1.token(tokenType, dato, linea));
        this.limpiarVariables();
    };
    scanner.prototype.limpiarVariables = function () {
        this.auxLexico = "";
        this.estado = 0;
    };
    return scanner;
}());
var scannerFun = new scanner();
var elementButon = document.getElementById('btnTraducir');
if (elementButon) {
    elementButon.addEventListener('click', scannerFun.startScanner, false);
}
