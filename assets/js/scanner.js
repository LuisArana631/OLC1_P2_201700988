"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var scanner = /** @class */ (function () {
    function scanner() {
        var entrada = "#";
        var estado = 0;
        var auxLexico = "";
        var linea = 1;
        var caracter;
        var elementPuto = document.getElementById('txtSalidaP');
        if (elementPuto) {
            elementPuto.innerText = entrada;
        }
        for (var i = 0; i < entrada.length; i++) {
        }
    }
    /*
    private listaToken:Array<token>;
    private estado:number;
    private linea:number;
    */
    scanner.prototype.startScanner = function () {
        console.log("Puto el que lo lea");
    };
    return scanner;
}());
var elementButon = document.getElementById('btnTraducir');
if (elementButon) {
    elementButon.addEventListener('click', false);
}
