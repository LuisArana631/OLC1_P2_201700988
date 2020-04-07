/*
import {tipo} from "./token";
import {token} from "./token";
*/
 class scanner{
    
    /*
    private listaToken:Array<token>;
    private estado:number;
    private linea:number;
    */

    startScanner(){

        let entrada;
        let elementoEntrada = document.getElementById('txtEntradaC');        
        if(elementoEntrada){
            entrada = elementoEntrada.innerHTML;                        
        }
        entrada += "#";
        let estado:number = 0;
        let auxLexico:string = "";
        let linea:number = 1;

        let caracter:any;             
        for(let i=0; i<entrada.length; i++){
            caracter = entrada.charAt(i);
            console.log(caracter);
        }
    }    

}

 let scannerFun = new scanner();

 let elementButon = document.getElementById('btnTraducir');
if(elementButon){    
    elementButon.addEventListener('click', scannerFun.startScanner ,false);
}
