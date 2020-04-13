"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var variableItem = /** @class */ (function () {
    function variableItem(id, valor, tipo) {
        this.id = id;
        this.valor = valor;
        this.tipo = tipo;
    }
    Object.defineProperty(variableItem.prototype, "ID", {
        get: function () {
            return this.id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(variableItem.prototype, "Valor", {
        get: function () {
            return this.valor;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(variableItem.prototype, "Tipo", {
        get: function () {
            return this.tipo;
        },
        enumerable: true,
        configurable: true
    });
    return variableItem;
}());
exports.variableItem = variableItem;
