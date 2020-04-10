import {token, tipo} from "./token";
import {iniciarScanner} from "./scanner";
import {errorSintactico} from "./errorSintactico";
import { variableItem } from './variableItem';

class parser{
    private listaErrores:Array<errorSintactico>;
    private auxListaTokens:Array<token>;
    private traduccionPyton:Array<string>;
    private listaVariables:Array<variableItem>;

    constructor(){
        this.listaErrores = new Array;
        this.auxListaTokens = iniciarScanner();
        this.traduccionPyton = new Array;
        this.listaVariables = new Array;
    }

    public startParse():void{       
        let estado:number = 0;
        let tipoActual:string = "";
        let idActual:Array<string> = new Array;
        let esMain:boolean = false;

        console.log("cantidad de tokens: " + this.auxListaTokens.length);
        this.auxListaTokens.forEach(item => {
            switch(estado){
                case 0: //Estado inicial para encontrar que hacer
                    if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                        this.addComentario(item);
                    }else if(this.esImprimir(item)){    //Si es console ir al estado 1    
                        estado = 1;
                    }else if(this.esSentenciaRepeticion(item)){ //Si es sentencia de repeticion ir a estado 2 agregar palabra si es for o while, si es do ir a estado 7
                        if(item.Tipo === tipo.for){
                            this.traduccionPyton.push(item.Valor); //Ir a estado 2 para manejar for
                            estado = 2;
                        }else if(item.Tipo === tipo.while){ //Ir a estado 7 para manejar while
                            this.traduccionPyton.push(item.Valor);
                            estado = 7;
                        }else{  //Ir a estado 8 para manejar do while
                            this.traduccionPyton.push("while True");
                            estado = 8;
                        }
                    }else if(this.esSentenciaControl(item)){    //Si es sentencia de control ir a estado 3
                        if(item.Tipo === tipo.if){
                            this.traduccionPyton.push(item.Valor);
                            estado = 3;
                        }else{
                            this.traduccionPyton.push("def switch")
                            estado = 10;
                        }                        
                    }else if(this.esMetodo(item)){  //Cambiar la palabra void por def e ir al estado 4
                        this.traduccionPyton.push("def");
                        estado = 4;
                    }else if(this.esTipoDato(item)){    //Ir al estado 5 si es un tipo de dato
                        estado = 5;
                        tipoActual = item.Valor;
                    }else{
                        let error = "Se esperaba (Comentario|Impresion de Consola|Sentencia de control|Sentencia de Repeticion|Metodo|Tipo de dato) pero se encontró (" + item.getTipoExtend() + ")";
                        this.addError(item, error)
                    }
                    break;
                case 1: //Manejar el imprimir consola
                    if(item.Tipo === tipo.PUNTO){   //Debemos encontrar un punto para poder avanzar al estado 6                        
                        estado = 6;
                    }else if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                        this.addComentario(item);
                    }else{
                        let error = "Se esperaba un (.) para acceder a los metodos de Console pero se encontro (" + item.getTipoExtend() + ")";
                        this.addError(item,error);
                    }
                    break;
                case 2: //Manejar la sentencia de repeticion (for)
                    if(item.Tipo === tipo.PARENTESIS_ABRE){
                        estado  = 9;
                    }else if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                        this.addComentario(item);
                    }else{
                        let error = "Se esperaba un (() para manejar el ciclo for pero se encontro (" + item.getTipoExtend() + ")";
                        this.addError(item,error);
                    }
                    break;
                case 3: //Para manejar las sentencias de control (if)
                    if(item.Tipo === tipo.PARENTESIS_ABRE){
                        estado = 10;
                    }else if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                        this.addComentario(item);
                    }else{
                        let error = "Se esperaba un (() para if pero se encontro (" + item.getTipoExtend() + ")";
                        this.addError(item,error);
                    }
                    break;
                case 4: //Manejar las funciones void/def
                    if(item.Tipo === tipo.identificador || item.Tipo === tipo.main){ //Si es identificador | main evaluar como metodo o no
                        if(item.Tipo === tipo.main){
                            esMain = true;
                        }
                        estado = 11;
                        this.traduccionPyton.push(item.Valor);                
                    }else if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                        this.addComentario(item);
                    }else{
                        let error = "Se esperaba un (identificador|main) para continuar pero se encontro (" + item.getTipoExtend() + ")";
                        this.addError(item,error);
                    }
                    break;
                case 5: //Manejar cuando viene un tipo de dato
                    if(item.Tipo === tipo.identificador){
                        estado = 12;
                        idActual.push(item.Valor);
                    }else if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                        this.addComentario(item);
                    }else{
                        let error = "Se esperaba un (identificador|main) para continuar pero se encontro (" + item.getTipoExtend() + ")";
                        this.addError(item,error);
                    }
                    break;
                case 6: //Imprimir consola llevamos Console.
                    if(item.Tipo === tipo.WRITE){
                        estado = 13;
                        this.traduccionPyton.push("print");
                    }else if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                        this.addComentario(item);
                    }else{
                        let error = "Se esperaba un (Write) para acceder escribir en consola pero se encontro (" + item.getTipoExtend() + ")";
                        this.addError(item,error);
                    }
                    break;  
                case 7: //Manejar while
                    if(item.Tipo === tipo.PARENTESIS_ABRE){
                        estado  = 14;
                    }else if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                        this.addComentario(item);
                    }else{
                        let error = "Se esperaba un (() para manejar el ciclo while pero se encontro (" + item.getTipoExtend() + ")";
                        this.addError(item,error);
                    }
                    break;
                case 8: //Manejar do-while
                    if(item.Tipo === tipo.LLAVE_ABRE){
                        this.traduccionPyton.push(":");
                        estado  = 15;
                    }else if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                        this.addComentario(item);
                    }else{
                        let error = "Se esperaba un ({) para manejar el ciclo do-while pero se encontro (" + item.getTipoExtend() + ")";
                        this.addError(item,error);
                    }
                    break;
                case 9: //Manejar for (parametros)
                    if(item.Tipo === tipo.int){
                        estado = 16;                        
                    }else if(item.Tipo === tipo.identificador){
                        estado = 17;
                        this.listaVariables.push(new variableItem(item.Valor,"undefined","int"));
                    }else if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                        this.addComentario(item);
                    }else{
                        let error = "Se esperaba un (int|identificador) para manejar el ciclo for pero se encontro (" + item.getTipoExtend() + ")";
                        this.addError(item,error);
                    }
                    break;
                case 10: //Manejar parametros de if
                    if(item.Tipo  === tipo.identificador || item.Tipo === tipo.numero || item.Tipo === tipo.cadena){
                        estado = 18;
                        this.traduccionPyton.push(item.Valor);
                    }else if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                        this.addComentario(item);
                    }else{
                        let error = "Se esperaba un (identificador|numero|cadena) para manejar la condicion if pero se encontro (" + item.getTipoExtend() + ")";
                        this.addError(item,error);
                    }
                    break;
                case 11:  //Manejar la funcion por medio de void
                    if(item.Tipo === tipo.PARENTESIS_ABRE){ //Encontramos una funcion
                        this.traduccionPyton.push(item.Valor);
                        estado = 19;
                    }else if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                        this.addComentario(item);
                    }else{
                        let error = "Se esperaba un ((|identificador) para manejar la condicion if pero se encontro (" + item.getTipoExtend() + ")";
                        this.addError(item,error);
                    }
                    break;
                case 12:
                    if(item.Tipo === tipo.PARENTESIS_ABRE){ //Encontramos una funcion 
                        estado = 20;
                        this.traduccionPyton.push("def "+idActual[0]+"(");
                        idActual.pop();
                    }else if(item.Tipo === tipo.COMA){ //Se encontra una lista de identificadores
                        estado = 21;
                    }else if(item.Tipo === tipo.IGUAL){ //Se encontro una asignacion 
                        estado = 22;
                    }else if(item.Tipo === tipo.PUNTO_COMA){ //Se encontro una variable sin dato
                        this.traduccionPyton.push("var "+idActual[0]);
                        this.listaVariables.push(new variableItem(idActual[0],"undefined",tipoActual));
                        idActual.pop();
                        estado = 0;
                    }else if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                        this.addComentario(item);
                    }else{
                        let error = "Se esperaba un ((|,|=|;) pero se encontro (" + item.getTipoExtend() + ")";
                        this.addError(item,error);
                    }                    
                    break;
                case 13: //Continuar Console.Write()
                    if(item.Tipo === tipo.PARENTESIS_ABRE){ //Encontramos una funcion
                        estado = 23;
                    }else if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                        this.addComentario(item);
                    }else{
                        let error = "Se esperaba un (() para manejar el Console.Write pero se encontro (" + item.getTipoExtend() + ")";
                        this.addError(item,error);
                    }
                    break;
                case 14: //Ya estamos dentro de los parametros del while 
                    if(item.Tipo === tipo.identificador || item.Tipo === tipo.numero){
                        estado = 24;
                        this.traduccionPyton.push(item.Valor);
                    }else if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                        this.addComentario(item);
                    }else{
                        let error = "Se esperaba un (identificador|numero) para manejar el ciclo while pero se encontro (" + item.getTipoExtend() + ")";
                        this.addError(item,error);
                    }
                    break;
                case 15:    //Estamos dentro del do-while

                    break;
                case 16:    //Estamos en el for encontramos un int
                    if(item.Tipo === tipo.identificador){                        
                        estado = 17;              
                        this.listaVariables.push(new variableItem(item.Valor,"undefined","int"));
                    }else if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                        this.addComentario(item);
                    }else{
                        let error = "Se esperaba un (identificador) para manejar el ciclo for pero se encontro (" + item.getTipoExtend() + ")";
                        this.addError(item,error);
                    }
                    break;
                case 17: //Estamos en el for al encontrar un identificador
                    if(item.Tipo  === tipo.IGUAL){
                        estado = 25;
                    }else if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                        this.addComentario(item);
                    }else{
                        let error = "Se esperaba un (=) para manejar el ciclo for pero se encontro (" + item.getTipoExtend() + ")";
                        this.addError(item,error);
                    }
                    break;
                case 18:  //Estamos en esta parte del if(18
                    if(this.esRelacional(item)){
                        this.traduccionPyton.push(item.Valor);
                        estado = 26;
                    }else if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                        this.addComentario(item);
                    }else{  
                        let error = "Se esperaba un signo relacional para manejar el if for pero se encontro (" + item.getTipoExtend() + ")";
                        this.addError(item,error);
                    }
                    break;
                case 19: //void asf(
                    if(esMain){
                        if(item.Tipo === tipo.PARENTESIS_CIERRA){
                            this.traduccionPyton.push(item.Valor);
                            estado = 27;
                        }else if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                            this.addComentario(item);
                        }else{  
                            let error = "Se esperaba un ) para manejar el main pero se encontro (" + item.getTipoExtend() + ")";
                            this.addError(item,error);
                        }
                    }else{
                        if(item.Tipo === tipo.PARENTESIS_CIERRA){
                            this.traduccionPyton.push(item.Valor);
                            estado = 27;
                        }else if(this.esTipoDato(item)){
                            estado = 28;                            
                        }else if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                            this.addComentario(item);
                        }else{  
                            let error = "Se esperaba un ()|Tipo de dato) para manejar la funcion pero se encontro (" + item.getTipoExtend() + ")";
                            this.addError(item,error);
                        }
                    }
                    break;
                case 20:
                    if(item.Tipo === tipo.PARENTESIS_CIERRA){
                        this.traduccionPyton.push(item.Valor);
                    }else if(this.esTipoDato(item)){
                        estado = 29;
                    }else if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                        this.addComentario(item);
                    }else{  
                        let error = "Se esperaba un ()|Tipo de dato) para manejar el ciclo for pero se encontro (" + item.getTipoExtend() + ")";
                        this.addError(item,error);
                    }
                    break;
                case 21:
                    
                    break;
            }            
        });
    }

    private addError(tokenActual:token, tipoError:string):void{        
        this.listaErrores.push(new errorSintactico(tokenActual.Valor, tokenActual.Linea, tokenActual.Colummna, tipoError));
    }

    private addComentario(tokenActual:token):void{
        let cadena:string;
        if(tokenActual.Tipo === tipo.Comentario_Lineal){
            cadena = tokenActual.Valor.replace("//","#");
        }else{
            cadena = tokenActual.Valor.replace("/*","'''");            
            cadena = tokenActual.Valor.replace("*/","'''"); 
        }
        this.traduccionPyton.push(cadena);
    }

    private esRelacional(tokenActual:token):boolean{
        if(tokenActual.Tipo === tipo.MAYOR || tokenActual.Tipo === tipo.MENOR || tokenActual.Tipo === tipo.MAYOR_IGUAL || tokenActual.Tipo === tipo.MENOR_IGUAL || tokenActual.Tipo === tipo.DISTINTO || tokenActual.Tipo === tipo.IGUAL_IGUAL){
            return true;            
        }
        return false;
        
    }

    private esComentario(tokenActual:token):boolean{
        if(tokenActual.Tipo === tipo.Comentario_Lineal || tokenActual.Tipo === tipo.Comentario_Multilinea){
            return true;
        }
        return false;
    }

    private esImprimir(tokenActual:token):boolean{
        if(tokenActual.Tipo === tipo.CONSOLE){
            return true;
        }
        return false;
    }

    private esSentenciaRepeticion(tokenActual:token):boolean{
        if(tokenActual.Tipo === tipo.for || tokenActual.Tipo === tipo.while || tokenActual.Tipo === tipo.do){
            return true;
        }
        return false;
    }

    private esSentenciaControl(tokenActual:token):boolean{
        if(tokenActual.Tipo === tipo.if || tokenActual.Tipo === tipo.switch){
            return true;
        }
        return false;
    }

    private esMetodo(tokenActual:token):boolean{
        if(tokenActual.Tipo === tipo.void){
            return true;
        }
        return false;
    }

    private esTipoDato(tokenActual:token):boolean{
        if(tokenActual.Tipo === tipo.int || tokenActual.Tipo === tipo.double || tokenActual.Tipo === tipo.char || tokenActual.Tipo === tipo.bool || tokenActual.Tipo  === tipo.string){
            return true;
        }
        return false;
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