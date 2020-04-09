"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var errorSintactico = /** @class */ (function () {
    function errorSintactico(valor, linea, columna, error) {
        this.valor = valor;
        this.linea = linea;
        this.columna = columna;
        this.error = error;
    }
    Object.defineProperty(errorSintactico.prototype, "Valor", {
        get: function () {
            return this.valor;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(errorSintactico.prototype, "Linea", {
        get: function () {
            return this.linea;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(errorSintactico.prototype, "Columna", {
        get: function () {
            return this.columna;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(errorSintactico.prototype, "Error", {
        get: function () {
            return this.error;
        },
        enumerable: true,
        configurable: true
    });
    return errorSintactico;
}());
exports.errorSintactico = errorSintactico;
