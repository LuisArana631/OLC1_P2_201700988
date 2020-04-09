"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var scanner_1 = require("./scanner");
var parser = /** @class */ (function () {
    function parser() {
        this.listaErrores = new Array;
        this.auxListaTokens = scanner_1.iniciarScanner();
        this.traduccionPyton = new Array;
    }
    parser.prototype.startParse = function () {
        var estado = 0;
        this.auxListaTokens.forEach(function (item) {
            switch (estado) {
                case 0:
            }
        });
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
