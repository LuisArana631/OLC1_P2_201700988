"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var errorItem = /** @class */ (function () {
    function errorItem(no, tipo, linea, columna, descripcion) {
        this.no = no;
        this.tipo = tipo;
        this.linea = linea;
        this.columna = columna;
        this.descripcion = descripcion;
    }
    Object.defineProperty(errorItem.prototype, "No", {
        get: function () {
            return this.no;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(errorItem.prototype, "Tipo", {
        get: function () {
            return this.tipo;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(errorItem.prototype, "Linea", {
        get: function () {
            return this.linea;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(errorItem.prototype, "Columna", {
        get: function () {
            return this.columna;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(errorItem.prototype, "Descripcion", {
        get: function () {
            return this.descripcion;
        },
        enumerable: true,
        configurable: true
    });
    return errorItem;
}());
exports.errorItem = errorItem;
