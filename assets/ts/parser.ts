import {token} from "./token";
import {iniciarScanner} from "./scanner";
import {errorSintactico} from "./errorSintactico";

class parser{
    private listaErrores:Array<errorSintactico>;
    private auxListaTokens:Array<token>;
    private traduccionPyton:Array<string>;

    constructor(){
        this.listaErrores = new Array;
        this.auxListaTokens = iniciarScanner();
        this.traduccionPyton = new Array;
    }

    startParse(){       
        let estado = 0;

        this.auxListaTokens.forEach(item => {
            switch(estado){
                case 0:
                    
            }
        });
    }
}

export function iniciarParser(){
    let parserFun = new parser();

    parserFun.startParse();    
}   

let elementButon = document.getElementById('btnTraducir');
if(elementButon){    
    elementButon.addEventListener('click', iniciarParser ,false);    
}