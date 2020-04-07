import {tipo} from "./token";
import {token} from "./token";

class scanner{
    /*
    private listaToken:Array<token>;
    private estado:number;
    private linea:number;
    */

    startScanner(){
        console.log("Puto el que lo lea");
    }

    public constructor(){        
        
        let entrada = "#";
        let estado:number = 0;
        let auxLexico:string = "";
        let linea:number = 1;

        let caracter:any;

        let elementPuto = document.getElementById('txtSalidaP');
        if (elementPuto) {
            elementPuto.innerText = entrada;
        }        

        for(let i=0; i<entrada.length; i++){
            
        }
    }

    

}

let elementButon = document.getElementById('btnTraducir');
if(elementButon){    
    elementButon.addEventListener('click',  ,false);
}
