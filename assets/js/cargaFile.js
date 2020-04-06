"use strict";
var _a;

function leerArchivo(e) {
    var file = e.target.files[0];
    if (!file) {
        return;
    }
    var lector = new FileReader();
    lector.onload = function(e) {
        var _a;
        var contenido = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
        mostrarContenido(contenido);
    };
    lector.readAsText(file);
}

function mostrarContenido(contenidoFile) {
    var element = document.getElementById('txtEntradaC');
    if (element) {
        element.value = contenidoFile;
    }
}
(_a = document.getElementById('file-input')) === null || _a === void 0 ? void 0 : _a.addEventListener('change', leerArchivo, false);