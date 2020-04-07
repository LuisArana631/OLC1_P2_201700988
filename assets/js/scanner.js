"use strict";
/*
import {tipo} from "./token";
import {token} from "./token";
*/
var scanner = /** @class */ (function () {
    function scanner() {
    }
    /*
    private listaToken:Array<token>;
    private estado:number;
    private linea:number;
    */
    scanner.prototype.startScanner = function () {
        var entrada;
        var elementoEntrada = document.getElementById('txtEntradaC');
        if (elementoEntrada) {
            entrada = elementoEntrada.innerHTML;
        }
        entrada += "#";
        var estado = 0;
        var auxLexico = "";
        var linea = 1;
        var caracter;
        for (var i = 0; i < entrada.length; i++) {
            caracter = entrada.charAt(i);
            console.log(caracter);
        }
    };
    return scanner;
}());
var scannerFun = new scanner();
var elementButon = document.getElementById('btnTraducir');
if (elementButon) {
    elementButon.addEventListener('click', scannerFun.startScanner, false);
}
//# sourceMappingURL=scanner.js.map