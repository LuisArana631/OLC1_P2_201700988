function download(filename, text) {
    var element = document.createElement('a');
    element.style.display = 'none';
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

document.getElementById("btn-reporte").addEventListener("click", function() {
    var text = document.getElementById("txtSalidaP").value;
    var filename = "TraduccionPython.py"

    download(filename, text);
}, false);