import {token, tipo} from "./token";

 class scanner{    
    private listaToken:Array<token>;
    private auxLexico:string;
    private estado:number;

    constructor(){
        this.listaToken = new Array;
        this.auxLexico = "";
        this.estado = 0;
    }

    public startScanner():void{        

        let entrada;
        let elementoEntrada = document.getElementById('txtEntradaC');
        if(elementoEntrada){
            entrada = elementoEntrada.innerHTML;
        }

        entrada += "#";
        let linea:number = 1;

        let caracter:any;
        for(let i=0; i<entrada.length; i++){
            caracter = entrada.charAt(i);

            switch(this.estado){
                case 0:                 
                    this.auxLexico += caracter;   
                    if(isNaN(caracter)){                        
                        if(caracter === "/"){                            
                            this.estado = 1;
                        }else if(caracter === "\""){                            
                            this.estado = 2;
                        }else if(caracter === "="){                            
                            this.estado = 3;        
                        }else if(caracter === ";"){
                            this.addToken(tipo.PUNTO_COMA, caracter, linea);
                        }else if(caracter === ","){
                            this.addToken(tipo.COMA, caracter, linea);
                        }else if(caracter === "+"){
                            this.addToken(tipo.SUMA, caracter, linea);                            
                        }else if(caracter === "-"){
                            this.addToken(tipo.RESTA, caracter, linea);
                        }else if(caracter === "*"){
                            this.addToken(tipo.MULTIPLICACION, caracter, linea);
                        }else if(caracter === "&"){
                            this.estado = 4;
                        }else if(caracter === "|"){
                            this.estado = 5;
                        }else if(caracter === "!"){
                            this.estado = 6;
                        }else if(caracter === "("){
                            this.addToken(tipo.PARENTESIS_ABRE, caracter, linea);
                        }else if(caracter === ")"){
                            this.addToken(tipo.PARENTESIS_CIERRA, caracter, linea);
                        }else if(caracter === ":"){
                            this.addToken(tipo.DOS_PUNTOS, caracter, linea);
                        }else if(caracter === "{"){
                            this.addToken(tipo.LLAVE_ABRE, caracter, linea);
                        }else if(caracter === "}"){
                            this.addToken(tipo.LLAVE_CIERRA, caracter, linea);
                        }else if(caracter === ">"){
                            this.estado = 7;
                        }else if(caracter === "<"){
                            this.estado = 8;
                        }else if(this.esLetra(caracter)){
                            this.estado = 9;
                        }else if(caracter === "\n"){
                            linea++;
                        }else if(caracter === " " || caracter === "\t"){
                            //Ignorar                        
                        }else if(caracter === "#"){
                            console.log("final");
                        }else{
                            this.addToken(tipo.ERROR_LEXICO, caracter, linea);
                        }
                    }else{
                        this.estado = 10;
                    }
                    break;
                case 1: 
                    if(caracter === "/"){
                        this.auxLexico += caracter;
                        this.estado = 11;
                    }else if(caracter === "*"){
                        this.auxLexico += caracter;
                        this.estado = 12;
                    }else{
                        this.addToken(tipo.DIVISION, this.auxLexico, linea);
                        i--;
                    }
                    break;
                case 2:
                    if(caracter === "="){
                        this.auxLexico += caracter;
                        this.addToken(tipo.IGUAL_IGUAL, this.auxLexico, linea);
                    }else{
                        this.addToken(tipo.IGUAL, this.auxLexico, linea);
                        i--;
                    }
                    break;
            }
        }
        
        let textoSalida = "salida";
        console.log("mostrando analisis lexico");

        this.listaToken.forEach(item => {            
            textoSalida += item.getTipoExtend+" -> "+item.Valor+" -> "+item.Linea+"\n";
            console.log(item.Valor);
        });

        let elementButon = document.getElementById('txtSalidaP');
        if(elementButon){    
            elementButon.innerHTML = textoSalida;
        } 

    }    


    
    private esLetra(caracter:any):boolean{
        let ascii = caracter.toUpperCase().charCodeAt(0);
        if(ascii > 64 && ascii < 91){
            return true;
        }else{
            return false;
        }
    }

    private addToken(tokenType:tipo, dato:string, linea:number):void{        
        this.listaToken.push(new token(tokenType,dato,linea));
        this.limpiarVariables();
    }

    private limpiarVariables():void{
        this.auxLexico = "";
        this.estado = 0;
    }
}


let scannerFun = new scanner();

let elementButon = document.getElementById('btnTraducir');
if(elementButon){    
    elementButon.addEventListener('click', scannerFun.startScanner ,false);    
}


