import {token, tipo} from "./token";
import {iniciarScanner} from "./scanner";
import {errorSintactico} from "./errorSintactico";
import { variableItem } from './variableItem';
import {errorItem} from "./erroresList";

class parser{
    private listaErrores:Array<errorSintactico>;
    private auxListaTokens:Array<token>;
    private traduccionPyton:Array<string>;
    private listaVariables:Array<variableItem>;
    private ambosErrores:Array<errorItem>;

    get AmbosErrores():Array<errorItem>{
        return this.ambosErrores;
    }
    
    constructor(){
        this.listaErrores = new Array;
        this.auxListaTokens = iniciarScanner();
        this.traduccionPyton = new Array;
        this.listaVariables = new Array;
        this.ambosErrores = new  Array;
    }

    public startParse():void{
        let estado:number = 0;
        let tipoActual:string = "";
        let idActual:Array<string> = new Array;
        let esMain:boolean = false;
        let esRepeticion:boolean = false;
        let esControl:boolean = false;
        let esDoWhile:boolean = false;
        let esSwitch:boolean = false;
        let switchActual:string = "";
        let sentenciaTraducia:string = "";

        console.log("cantidad de tokens: " + this.auxListaTokens.length);
        this.auxListaTokens.forEach(item => {
          if(item.Tipo === tipo.ERROR_LEXICO){
            //Ignorar
          }else{
            switch(estado){
                case 0: //Estado inicial para encontrar que hacer
                    if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                        this.addComentario(item);
                    }else if(this.esImprimir(item)){    //Si es console ir al estado 1
                        estado = 1;
                    }else if(this.esSentenciaRepeticion(item)){ //Si es sentencia de repeticion ir a estado 2 agregar palabra si es for o while, si es do ir a estado 7
                        if(item.Tipo === tipo.for){
                            sentenciaTraducia = "for"; //Ir a estado 2 para manejar for
                            estado = 2;
                        }else if(item.Tipo === tipo.while){ //Ir a estado 7 para manejar while
                            sentenciaTraducia = "while ";
                            if(esDoWhile){
                                estado = 15;
                                esDoWhile = false;
                            }else{
                                estado = 7;
                            }
                        }else{  //Ir a estado 8 para manejar do while
                            sentenciaTraducia = "while True";
                            estado = 8;
                            esDoWhile = true;
                        }
                        esRepeticion = true;
                    }else if(this.esSentenciaControl(item)){    //Si es sentencia de control ir a estado 3
                        esControl = true;
                        if(item.Tipo === tipo.if){
                            sentenciaTraducia = "if ";
                            estado = 3;
                        }else{
                            sentenciaTraducia = "def switch";                            
                            estado = 36;
                            esSwitch = true;
                        }
                    }else if(this.esMetodo(item)){  //Cambiar la palabra void por def e ir al estado 4
                        sentenciaTraducia = "def ";                        
                        estado = 4;
                    }else if(this.esTipoDato(item)){    //Ir al estado 5 si es un tipo de dato
                        estado = 5;
                        tipoActual = item.Valor;
                    }else if(item.Tipo === tipo.LLAVE_CIERRA){
                        if(esRepeticion){
                            esRepeticion = false;
                        }else if(esControl){
                            esControl = false;
                        }else if(esSwitch){
                            this.traduccionPyton.push("}");
                            esSwitch  = false;
                        }else if(esMain){                            
                            this.traduccionPyton.push("if_name_=\"_main_\":");
                            this.traduccionPyton.push(" main()");
                            esMain = false;
                        }
                    }else if(item.Tipo === tipo.else){                        
                        estado = 54;
                    }else if(item.Tipo === tipo.return){
                        estado = 56;
                    }else if(item.Tipo === tipo.break){
                        if(esRepeticion){
                            this.traduccionPyton.push("break");
                        }else{
                            let error = "Se esperaba (Comentario|Impresion de Consola|Sentencia de control|Sentencia de Repeticion|Metodo|Tipo de dato) pero se encontró (" + item.getTipoExtend() + ")";
                            this.addError(item, error);
                        }
                    }else if(item.Tipo === tipo.continue){
                        if(esRepeticion){
                            this.traduccionPyton.push("continue");
                        }else{
                            let error = "Se esperaba (Comentario|Impresion de Consola|Sentencia de control|Sentencia de Repeticion|Metodo|Tipo de dato) pero se encontró (" + item.getTipoExtend() + ")";
                            this.addError(item, error);
                        }
                    }else if(item.Tipo === tipo.case){
                        if(esSwitch){
                            estado = 68;                           
                        }else{
                            let error = "Se esperaba (Comentario|Impresion de Consola|Sentencia de control|Sentencia de Repeticion|Metodo|Tipo de dato) pero se encontró (" + item.getTipoExtend() + ")";
                            this.addError(item, error)
                        }
                    }else if(item.Tipo === tipo.default){
                        if(esSwitch){
                            estado = 70;                           
                            sentenciaTraducia = "default:";
                        }else{
                            let error = "Se esperaba (Comentario|Impresion de Consola|Sentencia de control|Sentencia de Repeticion|Metodo|Tipo de dato) pero se encontró (" + item.getTipoExtend() + ")";
                            this.addError(item, error)
                        }
                    }else{
                        let error = "Se esperaba (Comentario|Impresion de Consola|Sentencia de control|Sentencia de Repeticion|Metodo|Tipo de dato) pero se encontró (" + item.getTipoExtend() + ")";
                        this.addError(item, error);
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
                        sentenciaTraducia += item.Valor;
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
                        sentenciaTraducia += "print";
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
                        sentenciaTraducia+=":";
                        this.traduccionPyton.push(sentenciaTraducia);
                        sentenciaTraducia = "";
                        esDoWhile = true;
                        estado = 0;
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
                        sentenciaTraducia += " "+item.Valor + " in range(";                        
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
                        sentenciaTraducia += item.Valor;
                    }else if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                        this.addComentario(item);
                    }else{
                        let error = "Se esperaba un (identificador|numero|cadena) para manejar la condicion if pero se encontro (" + item.getTipoExtend() + ")";
                        this.addError(item,error);
                    }
                    break;
                case 11:  //Manejar la funcion por medio de void
                    if(item.Tipo === tipo.PARENTESIS_ABRE){ //Encontramos una funcion
                        sentenciaTraducia += item.Valor;
                        estado = 19;
                    }else if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                        this.addComentario(item);
                    }else{
                        let error = "Se esperaba un ((|identificador) para manejar la condicion if pero se encontro (" + item.getTipoExtend() + ")";
                        this.addError(item,error);
                    }
                    break;
                case 12: //Encontramos un tipo de dato y necesitamos saber si es variable o funcion
                    if(item.Tipo === tipo.PARENTESIS_ABRE){ //Encontramos una funcion
                        estado = 20;
                        sentenciaTraducia += "def "+idActual[0]+"(";                        
                        idActual.pop();
                    }else if(item.Tipo === tipo.COMA){ //Se encontra una lista de identificadores
                        estado = 21;
                    }else if(item.Tipo === tipo.IGUAL){ //Se encontro una asignacion
                        estado = 22;
                    }else if(item.Tipo === tipo.PUNTO_COMA){ //Se encontro una variable sin dato                        
                        this.traduccionPyton.push("var "+idActual[0]);
                        this.listaVariables.push(new variableItem(idActual[0],"undefined",tipoActual));
                        sentenciaTraducia = "";
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
                        sentenciaTraducia += "(";
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
                        sentenciaTraducia += item.Valor;
                    }else if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                        this.addComentario(item);
                    }else{
                        let error = "Se esperaba un (identificador|numero) para manejar el ciclo while pero se encontro (" + item.getTipoExtend() + ")";
                        this.addError(item,error);
                    }
                    break;
                case 15:    //Estamos dentro del do-while
                    if(item.Tipo === tipo.PARENTESIS_ABRE){
                        estado = 59;
                        sentenciaTraducia = "if (";
                    }else if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                        this.addComentario(item);
                    }else{
                        let error = "Se esperaba un ( para manejar el ciclo while pero se encontro (" + item.getTipoExtend() + ")";
                        this.addError(item,error);
                    }
                    break;
                case 16:    //Estamos en el for encontramos un int
                    if(item.Tipo === tipo.identificador){
                        estado = 17;
                        sentenciaTraducia += " "+item.Valor + " in range(";
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
                        sentenciaTraducia += item.Valor;
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
                            sentenciaTraducia += item.Valor;
                            estado = 27;
                        }else if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                            this.addComentario(item);
                        }else{
                            let error = "Se esperaba un ) para manejar el main pero se encontro (" + item.getTipoExtend() + ")";
                            this.addError(item,error);
                        }
                    }else{
                        if(item.Tipo === tipo.PARENTESIS_CIERRA){
                            sentenciaTraducia += item.Valor;
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
                case 20: //Esto es una funcion
                    if(item.Tipo === tipo.PARENTESIS_CIERRA){
                        sentenciaTraducia += item.Valor;
                        estado = 38;
                    }else if(this.esTipoDato(item)){
                        estado = 29;
                    }else if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                        this.addComentario(item);
                    }else{
                        let error = "Se esperaba un ()|Tipo de dato) para manejar el ciclo for pero se encontro (" + item.getTipoExtend() + ")";
                        this.addError(item,error);
                    }
                    break;
                case 21: //Si encontramos una lista de identificadores
                    if(item.Tipo === tipo.identificador){//Si es identificador ir al siguiente estado
                      estado = 30;
                      idActual.push(item.Valor);
                    }else if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                        this.addComentario(item);
                    }else{
                        let error = "Se esperaba un (identificador) para la lista de identificadores pero se encontro (" + item.getTipoExtend() + ")";
                        this.addError(item,error);
                    }
                    break;
                case 22: //Asignacion de las variable
                    if(item.Tipo === tipo.cadena || item.Tipo === tipo.numero || item.Tipo === tipo.identificador){
                        let variables:string = "var ";
                        let conteo:number = 1;
                        idActual.forEach(idItem => {
                            if(conteo < idActual.length){
                                variables += idItem + ","
                            }else{
                                variables += idItem;
                            }
                            this.listaVariables.push(new variableItem(idItem,item.Valor,tipoActual));
                            conteo++;
                        });
                        idActual.length = 0;
                        variables += " = " + item.Valor;
                        this.traduccionPyton.push(variables);
                        sentenciaTraducia = "";
                        estado = 31;
                    }else if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                        this.addComentario(item);
                    }else{
                        let error = "Se esperaba un (cadena|numero|identificador) para manejar las variables pero se encontro (" + item.getTipoExtend() + ")";
                        this.addError(item,error);
                    }
                    break;
                case 23://Parametro del console.write()
                    if(item.Tipo === tipo.cadena || item.Tipo === tipo.identificador||item.Tipo === tipo.numero){
                        sentenciaTraducia += item.Valor;
                        estado = 53;
                    }else if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                        this.addComentario(item);
                    }else{
                        let error = "Se esperaba un (cadena|identificador) para manejar el ciclo for pero se encontro (" + item.getTipoExtend() + ")";
                        this.addError(item,error);
                    }
                    break;
                case 24: //Validar funcione en el while
                    if(this.esRelacional(item)){
                        sentenciaTraducia += item.Valor;
                        estado = 33;
                    }else if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                        this.addComentario(item);
                    }else{
                        let error = "Se esperaba un (signo relacional) para manejar el ciclo while pero se encontro (" + item.getTipoExtend() + ")";
                        this.addError(item,error);
                    }
                    break;
                case 25: //Encontrar el numero de la variable en el for
                    if(item.Tipo === tipo.numero){
                        estado = 34;
                        sentenciaTraducia+=item.Valor;
                    }else if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                        this.addComentario(item);
                    }else{
                        let error = "Se esperaba un (numero) para manejar el ciclo for pero se encontro (" + item.getTipoExtend() + ")";
                        this.addError(item,error);
                    }
                    break;
                case 26:    //Validar if
                    if(item.Tipo  === tipo.identificador || item.Tipo === tipo.numero || item.Tipo === tipo.cadena){
                        estado = 35;
                        sentenciaTraducia += item.Valor;
                    }else if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                        this.addComentario(item);
                    }else{
                        let error = "Se esperaba un (identificador|numero|cadena) para manejar la condicion if pero se encontro (" + item.getTipoExtend() + ")";
                        this.addError(item,error);
                    }
                    break;
                case 27:    //Terminar con la funcion def
                    if(item.Tipo === tipo.LLAVE_ABRE){
                        sentenciaTraducia += ":";
                        this.traduccionPyton.push(sentenciaTraducia);
                        sentenciaTraducia = "";
                        estado = 0;
                    }else if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                        this.addComentario(item);
                    }else{
                        let error = "Se esperaba un (identificador|numero|cadena) para manejar la condicion pero se encontro (" + item.getTipoExtend() + ")";
                        this.addError(item,error);
                    }
                    break;
                case 28: //Debemos encontrar una variable en el void
                    if(item.Tipo === tipo.identificador){
                        sentenciaTraducia += item.Valor;
                        estado = 37;
                    }else if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                        this.addComentario(item);
                    }else{
                        let error = "Se esperaba un (identificador|numero|cadena) para manejar la condicion pero se encontro (" + item.getTipoExtend() + ")";
                        this.addError(item,error);
                    }
                    break;
                case 29: //Debemos encontrar el identificador
                    if(item.Tipo === tipo.identificador){
                        sentenciaTraducia += item.Valor;
                        estado = 39;
                    }else if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                        this.addComentario(item);
                    }else{
                        let error = "Se esperaba un (identificador|numero|cadena) para manejar la condicion pero se encontro (" + item.getTipoExtend() + ")";
                        this.addError(item,error);
                    }
                    break;
                case 30: //Se debe encontrar una coma y regresar al estado de identificador
                    if(item.Tipo === tipo.COMA){
                        estado = 21;
                        sentenciaTraducia += item.Valor;
                    }else if(item.Tipo === tipo.IGUAL){
                        estado = 22;
                        sentenciaTraducia += item.Valor;
                    }else if(item.Tipo === tipo.PUNTO_COMA){
                        estado = 0;
                        let variables:string = "var ";
                        let conteo:number = 1;
                        idActual.forEach(idItem => {
                            if(conteo < idActual.length){
                                variables += idItem + ","
                            }else{
                                variables += idItem;
                            }
                            this.listaVariables.push(new variableItem(idItem,"undefined",tipoActual));
                            conteo++;
                        });
                        idActual.length = 0;
                        this.traduccionPyton.push(variables);
                        sentenciaTraducia = "";
                    }else if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                        this.addComentario(item);
                    }else{
                        let error = "Se esperaba un (,|=|;) para manejar la condicion if pero se encontro (" + item.getTipoExtend() + ")";
                        this.addError(item,error);
                    }
                    break;
                case 31:    //Necesitamos un punto y coma para terminar las variables
                    if(item.Tipo === tipo.PUNTO_COMA){
                        estado = 0;                        
                        sentenciaTraducia = "";
                    }else if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                        this.addComentario(item);
                    }else{
                        let error = "Se esperaba un (;) para manejar las variables pero se encontro (" + item.getTipoExtend() + ")";
                        this.addError(item,error);
                    }
                    break;
                case 32: //Varias cadenas concatenadas o parentesis final
                    if(item.Tipo === tipo.SUMA){
                        this.traduccionPyton.push(",");
                        estado = 23;
                    }else if(item.Tipo === tipo.PARENTESIS_CIERRA){
                        this.traduccionPyton.push(item.Valor);
                        estado = 40;
                    }else if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                        this.addComentario(item);
                    }else{
                        let error = "Se esperaba un (+|)) para manejar Console.Write() pero se encontro (" + item.getTipoExtend() + ")";
                        this.addError(item,error);
                    }
                    break;
                case 33:    //Encontrar un identificador
                    if(item.Tipo === tipo.identificador){
                        sentenciaTraducia += item.Valor;
                        estado = 41;
                    }else if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                        this.addComentario(item);
                    }else{
                        let error = "Se esperaba un (identificador) para manejar para el ciclo while pero se encontro (" + item.getTipoExtend() + ")";
                        this.addError(item,error);
                    }
                    break;
                case 34: //Terminar la primer sentencia del for (int i=0;)
                    if(item.Tipo === tipo.PUNTO_COMA){
                        estado = 42;
                    }else if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                        this.addComentario(item);
                    }else{
                        let error = "Se esperaba un (;) para manejar para el ciclo while pero se encontro (" + item.getTipoExtend() + ")";
                        this.addError(item,error);
                    }
                    break;
                case 35:    //Validar if con más contenido
                    if(item.Tipo === tipo.OR || item.Tipo === tipo.AND){
                        estado = 10;
                        sentenciaTraducia +=" " + item.Valor +" ";
                    }else if(item.Tipo === tipo.PARENTESIS_CIERRA){
                        estado = 38;
                    }else if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                        this.addComentario(item);
                    }else{
                        let error = "Se esperaba un ()|OR|AND) para manejar para el ciclo while pero se encontro (" + item.getTipoExtend() + ")";
                        this.addError(item,error);
                    }
                    break;
                case 36:    //Para controlar el def switch, solo hemos encontrado la palabra switch
                    if(item.Tipo === tipo.PARENTESIS_ABRE){
                        sentenciaTraducia += item.Valor;
                        estado = 64;
                    }else if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                        this.addComentario(item);
                    }else{
                        let error = "Se esperaba un ( para manejar para el ciclo while pero se encontro (" + item.getTipoExtend() + ")";
                        this.addError(item,error);
                    }
                    break;
                case 37: //Para la declaracion de parametros de funcion void
                    if(item.Tipo === tipo.COMA){
                        sentenciaTraducia += item.Valor;
                        estado =43;
                    }else if(item.Tipo === tipo.PARENTESIS_CIERRA){
                        sentenciaTraducia += item.Valor;
                        estado = 27;
                    }else if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                        this.addComentario(item);
                    }else{
                        let error = "Se esperaba un (,) para manejar la funcion pero se encontro (" + item.getTipoExtend() + ")";
                        this.addError(item,error);
                    }
                    break;
                case 38:    //Terminar la declaracion de un void
                    if(item.Tipo === tipo.LLAVE_ABRE){
                        sentenciaTraducia += ":";
                        this.traduccionPyton.push(sentenciaTraducia);
                        sentenciaTraducia = "";
                        estado = 0;
                    }else if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                        this.addComentario(item);
                    }else{
                        let error = "Se esperaba un (}) iniciar segmento del void pero se encontro (" + item.getTipoExtend() + ")";
                        this.addError(item,error);
                    }
                    break;
                case 39:    //Manejar los parametros de funcion por tipo de dato
                    if(item.Tipo === tipo.COMA){
                        estado = 44;
                    }else if(item.Tipo === tipo.PARENTESIS_CIERRA){                    
                        sentenciaTraducia += item.Valor;
                        estado = 38;
                    }else if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                        this.addComentario(item);
                    }else{
                        let error = "Se esperaba un (,) para manejar parametros de funcion pero se encontro (" + item.getTipoExtend() + ")";
                        this.addError(item,error);
                    }
                    break;
                case 40:    //Terminar la sentencia de console.write
                    if(item.Tipo === tipo.PUNTO_COMA){
                        estado = 0;
                    }else if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                        this.addComentario(item);
                    }else{
                        let error = "Se esperaba un (;) para terminar el Console.Write pero se encontro (" + item.getTipoExtend() + ")";
                        this.addError(item,error);
                    }
                    break;
                case 41:    //Terminar el ciclo while con )
                    if(tipo.PARENTESIS_CIERRA){                        
                        estado = 45;
                    }else if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                        this.addComentario(item);
                    }else{
                        let error = "Se esperaba un ()) para manejar el ciclo while pero se encontro (" + item.getTipoExtend() + ")";
                        this.addError(item,error);
                    }
                    break;
                case 42:    //Encontrar un identificador del for(int i=0; i <- ese dato)
                    if(item.Tipo === tipo.identificador){                        
                        estado = 46;
                    }else if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                        this.addComentario(item);
                    }else{
                        let error = "Se esperaba un (identificador) para manejar el ciclo for pero se encontro (" + item.getTipoExtend() + ")";
                        this.addError(item,error);
                    }
                    break;
                case 43:    //Controlar los parametros
                    if(this.esTipoDato(item)){
                        estado = 28;
                    }else if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                        this.addComentario(item);
                    }else{
                        let error = "Se esperaba un (tipo de dato) para manejar los parametros pero se encontro (" + item.getTipoExtend() + ")";
                        this.addError(item,error);
                    }
                    break;
                case 44:    //Controlar los parametros
                    if(this.esTipoDato(item)){
                        estado = 28;
                    }else if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                        this.addComentario(item);
                    }else{
                        let error = "Se esperaba un (tipo de dato) para manejar los parametros pero se encontro (" + item.getTipoExtend() + ")";
                        this.addError(item,error);
                    }
                    break;
                case 45:    //Encontrar llave de apertura para terminar de traducir el ciclo while
                    if(item.Tipo === tipo.LLAVE_ABRE){
                        sentenciaTraducia += ":";
                        this.traduccionPyton.push(sentenciaTraducia);
                        sentenciaTraducia = "";
                        estado = 0;
                    }else if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                        this.addComentario(item);
                    }else{
                        let error = "Se esperaba un (tipo de dato) para manejar los parametros pero se encontro (" + item.getTipoExtend() + ")";
                        this.addError(item,error);
                    }
                    break;
                case 46:    //Encontrar variable del for segundo parametro
                    if(item.Tipo === tipo.MAYOR || item.Tipo === tipo.MENOR ||item.Tipo === tipo.MAYOR_IGUAL || item.Tipo === tipo.MENOR_IGUAL){
                        estado = 47;
                    }else if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                        this.addComentario(item);
                    }else{
                        let error = "Se esperaba un (tipo de dato) para manejar los parametros pero se encontro (" + item.getTipoExtend() + ")";
                        this.addError(item,error);
                    }
                    break;
                case 47: //Encontrar condicion del for
                    if(item.Tipo === tipo.identificador || item.Tipo === tipo.numero){
                        sentenciaTraducia+=","+item.Valor+")";                        
                        estado = 48;
                    }else if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                        this.addComentario(item);
                    }else{
                        let error = "Se esperaba un (tipo de dato) para manejar los parametros pero se encontro (" + item.getTipoExtend() + ")";
                        this.addError(item,error);
                    }
                    break;
                case 48: //Encontrar limite del for
                    if(item.Tipo === tipo.PUNTO_COMA){
                        sentenciaTraducia+=":";
                        estado = 49;
                    }else if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                        this.addComentario(item);
                    }else{
                        let error = "Se esperaba un (;) para manejar los parametros pero se encontro (" + item.getTipoExtend() + ")";
                        this.addError(item,error);
                    }
                    break;
                case 49: //Econtrar punto y coma para el tipo for
                    if(item.Tipo === tipo.identificador){
                        estado = 50;
                    }else if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                        this.addComentario(item);
                    }else{
                        let error = "Se esperaba un (identificador) para manejar los parametros pero se encontro (" + item.getTipoExtend() + ")";
                        this.addError(item,error);
                    }
                    break;
                case 50: //Encontrar identificador del ultimo parametro for
                    if(item.Tipo == tipo.DECREMENTO || item.Tipo === tipo.INCREMENTO){
                        estado = 51;
                    }else if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                        this.addComentario(item);
                    }else{
                        let error = "Se esperaba un (++|--) para manejar los parametros pero se encontro (" + item.getTipoExtend() + ")";
                        this.addError(item,error);
                    }
                    break;
                case 51:
                    if(item.Tipo === tipo.PARENTESIS_CIERRA){
                        estado = 52;
                    }else if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                        this.addComentario(item);
                    }else{
                        let error = "Se esperaba un ) para manejar los parametros pero se encontro (" + item.getTipoExtend() + ")";
                        this.addError(item,error);
                    }
                    break;
                case 52:
                    if(item.Tipo === tipo.LLAVE_ABRE){
                        estado = 0;
                        this.traduccionPyton.push(sentenciaTraducia);
                        sentenciaTraducia = "";
                    }else if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                        this.addComentario(item);
                    }else{
                        let error = "Se esperaba un { para manejar los parametros pero se encontro (" + item.getTipoExtend() + ")";
                        this.addError(item,error);
                    }
                    break;
                case 53:
                    if(item.Tipo === tipo.SUMA){
                        sentenciaTraducia += ",";
                        estado = 23;
                    }else if(item.Tipo === tipo.PARENTESIS_CIERRA){
                        sentenciaTraducia += item.Valor;
                        estado  = 65; 
                    }else if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                        this.addComentario(item);
                    }else{
                        let error = "Se esperaba un if para manejar los parametros pero se encontro (" + item.getTipoExtend() + ")";
                        this.addError(item,error);
                    }
                    break;
                case 54:
                    if(item.Tipo === tipo.if){
                        sentenciaTraducia = "elif ";                        
                        estado = 55;
                    }else if(item.Tipo === tipo.LLAVE_ABRE){
                        this.traduccionPyton.push("else{");
                        estado = 0;                    
                    }else if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                        this.addComentario(item);
                    }else{
                        let error = "Se esperaba un if para manejar los parametros pero se encontro (" + item.getTipoExtend() + ")";
                        this.addError(item,error);
                    }
                    break;
                case 55:
                    if(item.Tipo === tipo.PARENTESIS_ABRE){
                        estado = 10;
                    }else if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                        this.addComentario(item);
                    }else{
                        let error = "Se esperaba un ( para manejar los parametros pero se encontro (" + item.getTipoExtend() + ")";
                        this.addError(item,error);
                    }
                    break;
                case 56:
                    if(item.Tipo === tipo.PUNTO_COMA){
                        this.traduccionPyton.push("return");
                        estado = 0;
                    }else if(item.Tipo === tipo.numero || item.Tipo === tipo.identificador || item.Tipo === tipo.cadena){
                        sentenciaTraducia += "return " +  item.Valor;                        
                        estado = 57;
                    }else if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                        this.addComentario(item);
                    }else{
                        let error = "Se esperaba un (;) para manejar los parametros pero se encontro (" + item.getTipoExtend() + ")";
                        this.addError(item,error);
                    }
                    break;
                case 57:
                    if(item.Tipo === tipo.SUMA || item.Tipo === tipo.RESTA || item.Tipo === tipo.DIVISION || item.Tipo === tipo.MULTIPLICACION){
                        sentenciaTraducia += item.Valor;                        
                        estado = 58;
                    }else if(item.Tipo === tipo.PUNTO_COMA){
                        this.traduccionPyton.push(sentenciaTraducia);
                        sentenciaTraducia = "";
                        estado = 0;
                    }else if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                        this.addComentario(item);
                    }else{
                        let error = "Se esperaba un (+|-|/|*|;) para manejar los parametros pero se encontro (" + item.getTipoExtend() + ")";
                        this.addError(item,error);
                    }
                    break;
                case 58:
                    if(item.Tipo === tipo.numero || item.Tipo === tipo.identificador || item.Tipo === tipo.cadena){
                        sentenciaTraducia += item.Valor;                        
                        estado = 57;
                    }else if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                        this.addComentario(item);
                    }else{
                        let error = "Se esperaba un (;) para manejar los parametros pero se encontro (" + item.getTipoExtend() + ")";
                        this.addError(item,error);
                    }
                    break;
                case 59:                    
                    if(item.Tipo === tipo.identificador || item.Tipo === tipo.numero){
                        estado  = 60;
                        sentenciaTraducia += item.Valor;
                    }else if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                        this.addComentario(item);
                    }else{
                        let error = "Se esperaba un (identificador|numero) para manejar los parametros pero se encontro (" + item.getTipoExtend() + ")";
                        this.addError(item,error);
                    }
                    break;
                case 60:
                    if(this.esRelacional(item)){                    
                        estado  = 61;
                        sentenciaTraducia += item.Valor;
                    }else if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                        this.addComentario(item);
                    }else{
                        let error = "Se esperaba un (<|>|>=|<=|!=|==) para manejar los parametros pero se encontro (" + item.getTipoExtend() + ")";
                        this.addError(item,error);
                    }
                    break;
                case 61:
                    if(item.Tipo === tipo.identificador || item.Tipo === tipo.numero){
                        estado  = 62;
                        sentenciaTraducia += item.Valor;
                    }else if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                        this.addComentario(item);
                    }else{
                        let error = "Se esperaba un (identificador|numero) para manejar los parametros pero se encontro (" + item.getTipoExtend() + ")";
                        this.addError(item,error);
                    }
                    break;
                case 62:
                    if(item.Tipo === tipo.PARENTESIS_CIERRA){
                        estado  = 63;
                        sentenciaTraducia += item.Valor;
                    }else if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                        this.addComentario(item);
                    }else{
                        let error = "Se esperaba un ) para manejar los parametros pero se encontro (" + item.getTipoExtend() + ")";
                        this.addError(item,error);
                    }
                    break;
                case 63:
                    if(item.Tipo === tipo.PUNTO_COMA){
                        estado  = 0;                                        
                        this.traduccionPyton.push(sentenciaTraducia);
                        this.traduccionPyton.push("break");
                        sentenciaTraducia = "";
                    }else if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                        this.addComentario(item);
                    }else{
                        let error = "Se esperaba un ; para manejar los parametros pero se encontro (" + item.getTipoExtend() + ")";
                        this.addError(item,error);
                    }
                    break;
                case 64:
                    if(item.Tipo === tipo.identificador || item.Tipo === tipo.numero){
                        sentenciaTraducia += item.Valor;
                        estado = 74;
                    }else if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                        this.addComentario(item);
                    }else{
                        let error = "Se esperaba un ()|OR|AND) para manejar para el ciclo while pero se encontro (" + item.getTipoExtend() + ")";
                        this.addError(item,error);
                    }
                    break;
                case 65:
                    if(item.Tipo === tipo.PUNTO_COMA){
                        if(esSwitch){
                            sentenciaTraducia += ",";
                        }
                        this.traduccionPyton.push(sentenciaTraducia);
                        sentenciaTraducia = "";
                        estado  = 0;                        
                    }else if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                        this.addComentario(item);
                    }else{
                        let error = "Se esperaba un ; para manejar para el console.write pero se encontro (" + item.getTipoExtend() + ")";
                        this.addError(item,error);
                    }
                    break;
                case 66:
                    if(item.Tipo === tipo.LLAVE_ABRE){
                        estado = 67;
                        sentenciaTraducia += ":";
                        this.traduccionPyton.push(sentenciaTraducia);
                        this.traduccionPyton.push("switcher = {");   
                        sentenciaTraducia = "";
                    }else if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                        this.addComentario(item);
                    }else{
                        let error = "Se esperaba un { para manejar para el switch pero se encontro (" + item.getTipoExtend() + ")";
                        this.addError(item,error);
                    }
                    break;
                case 67:
                    if(item.Tipo === tipo.case){
                        estado = 68;                        
                    }else if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                        this.addComentario(item);
                    }else{
                        let error = "Se esperaba un case para manejar para el ciclo while pero se encontro (" + item.getTipoExtend() + ")";
                        this.addError(item,error);
                    }
                    break;
                case 68:
                    if(item.Tipo === tipo.numero){
                        estado = 69;
                        switchActual = item.Valor;
                    }else if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                        this.addComentario(item);
                    }else{
                        let error = "Se esperaba un numero para manejar para el ciclo while pero se encontro (" + item.getTipoExtend() + ")";
                        this.addError(item,error);
                    }
                    break;
                case 69:
                    if(item.Tipo === tipo.DOS_PUNTOS){
                        estado  = 70;
                        sentenciaTraducia = switchActual+": ";
                    }else if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                        this.addComentario(item);
                    }else{
                        let error = "Se esperaba un numero para manejar para el ciclo while pero se encontro (" + item.getTipoExtend() + ")";
                        this.addError(item,error);
                    }
                    break;      
                case 70:
                    if(item.Tipo === tipo.identificador){
                        sentenciaTraducia += item.Valor;
                        estado  = 71;
                    }else if(tipo.CONSOLE){                        
                        estado = 1;//Eajsflkasjfasfasfasfas----------------------------------------------------------------------
                    }else if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                        this.addComentario(item);
                    }else{
                        let error = "Se esperaba un numero para manejar para el ciclo while pero se encontro (" + item.getTipoExtend() + ")";
                        this.addError(item,error);
                    }
                    break;
                case 71:
                    if(item.Tipo === tipo.IGUAL){
                        sentenciaTraducia += item.Valor;
                        estado  = 72;
                    }else if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                        this.addComentario(item);
                    }else{
                        let error = "Se esperaba un numero para manejar para el ciclo while pero se encontro (" + item.getTipoExtend() + ")";
                        this.addError(item,error);
                    }
                    break;
                case 72:
                    if(item.Tipo === tipo.numero || item.Tipo === tipo.cadena){
                        sentenciaTraducia+=item.Valor;
                        estado  = 73;
                    }else if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                        this.addComentario(item);
                    }else{
                        let error = "Se esperaba un numero para manejar para el ciclo while pero se encontro (" + item.getTipoExtend() + ")";
                        this.addError(item,error);
                    }
                    break;
                case 73:
                    if(item.Tipo === tipo.PUNTO_COMA){
                        sentenciaTraducia+=",";
                        this.traduccionPyton.push(sentenciaTraducia);
                        estado = 0;
                    }else if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                        this.addComentario(item);
                    }else{
                        let error = "Se esperaba un numero para manejar para el ciclo while pero se encontro (" + item.getTipoExtend() + ")";
                        this.addError(item,error);
                    }
                    break;   
                case 74:
                    if(item.Tipo === tipo.PARENTESIS_CIERRA){
                        sentenciaTraducia += item.Valor;
                        estado= 66;
                    }
                    else if(this.esComentario(item)){    //Si es comentario solo traducir y agregarlo
                        this.addComentario(item);
                    }else{
                        let error = "Se esperaba un numero para manejar para el ciclo while pero se encontro (" + item.getTipoExtend() + ")";
                        this.addError(item,error);
                    }
                    break;
            }
          }
        });

        console.log("errores Lexicos: "+this.auxListaTokens.length);
        console.log("errores Sintacticos: "+this.listaErrores.length);
    }    

    public cargarPageErrores():void{             
        
        let conteo:number = 1;            
        this.auxListaTokens.forEach(element => {
        if(element.getTipoExtend() === "Error lexico"){            
                this.ambosErrores.push(new errorItem(conteo+"","Lexico",element.Linea+"",element.Colummna+"",element.getTipoExtend()));
                conteo++;
            }                
        });        
        
        this.listaErrores.forEach(error => {
            this.ambosErrores.push(new errorItem(conteo+"","Sintactico",error.Linea+"",error.Columna+"",error.Error));
            conteo++;
        });  
        

        let tabError = window.open("reporte.html","errorPage"); 
        let table:HTMLTableElement = <HTMLTableElement> tabError?.window.document.getElementById('tablaErrores');
        if(table){
            console.log("Encontramos la tabla");
            this.AmbosErrores.forEach(item => {
                let newRow = table.insertRow(table.rows.length);

                let no = newRow.insertCell(0);
                let tipo = newRow.insertCell(1);
                let linea = newRow.insertCell(2);
                let columna = newRow.insertCell(3);
                let descripcion = newRow.insertCell(4);

                no.innerHTML = item.No;
                tipo.innerHTML = item.Tipo;
                linea.innerHTML = item.Linea;
                columna.innerHTML = item.Columna;
                descripcion.innerHTML = item.Descripcion;
            });
        }

        
    }

    public pintarVariables():void{
        let tabla:HTMLTableElement = <HTMLTableElement> document.getElementById('tablaVariables');
        this.listaVariables.forEach(varItem => {
            let newRow = tabla.insertRow(tabla.rows.length);

            let nombre = newRow.insertCell(0);
            let tipo = newRow.insertCell(1);
            let linea = newRow.insertCell(2);

            nombre.innerHTML = varItem.ID;
            tipo.innerHTML = varItem.Tipo;
            linea.innerHTML = varItem.Valor;
        });
    }

    public mostrarTraduccion():void{
        console.log("-----------------------------")      
        let traduccion:string = "";
        this.traduccionPyton.forEach(element => {
            traduccion += element  + "\n";
            console.log(element);
        });

        let elementoEntrada = document.getElementById('txtSalidaP');
        if(elementoEntrada){
            elementoEntrada.innerHTML =traduccion;
        }
      
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
            cadena = cadena.replace("*/","'''");
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
    parserFun.mostrarTraduccion();    
    parserFun.pintarVariables();  
    
    parserFun.cargarPageErrores();       
    
}    

let elementButon = document.getElementById('btnTraducir');
if(elementButon){
    elementButon.addEventListener('click', iniciarParser ,false);
}
