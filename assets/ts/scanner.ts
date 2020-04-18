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

    get ListaToken():Array<token>{
        return this.listaToken;
    }

    public startScanner():void{

        let entrada;
        let elementoEntrada:HTMLTextAreaElement = <HTMLTextAreaElement> document.getElementById('txtEntradaC');
        if(elementoEntrada){
            entrada = elementoEntrada.value;
        }

        console.log(entrada);   

        entrada += "#";
        let linea:number = 1;
        let columna:number = 1;

        let caracter:any;
        let asciiChar:number;

        console.log("caracteres en cadena: " + entrada.length);
        for(let i=0; i<entrada.length; i++){
            caracter = entrada.charAt(i);
            asciiChar = caracter.charCodeAt(0);

            console.log(this.estado + " -> " + caracter + " -> ASCII(" + asciiChar + ")");
            switch(this.estado){
                case 0:
                    this.auxLexico += caracter;
                    if(this.esNumero(caracter)){
                        this.estado = 10;
                    }else if(asciiChar === 47){ // Char /
                        this.estado = 1;
                    }else if(asciiChar === 34){ //Char "
                        this.estado = 2;
                    }else if(asciiChar === 39){ //Char '
                        this.estado = 2;
                    }else if(asciiChar === 61){ //Char =
                        this.estado = 3;
                    }else if(asciiChar === 59){ //Char ;
                        this.addToken(tipo.PUNTO_COMA, caracter, linea, columna);
                    }else if(asciiChar === 44){ //Char ,
                        this.addToken(tipo.COMA, caracter, linea, columna);
                    }else if(asciiChar === 43){ //Char +
                        this.estado = 16;
                    }else if(asciiChar === 45){  //Char -
                        this.estado = 17;
                    }else if(asciiChar === 42){ //Char *
                        this.addToken(tipo.MULTIPLICACION, caracter, linea, columna);
                    }else if(asciiChar === 38){ // Char &
                        this.estado = 4;
                    }else if(asciiChar === 124){  //Char |
                        this.estado = 5;
                    }else if(asciiChar === 33){  //Char  !
                        this.estado = 6;
                    }else if(asciiChar === 40){  //Char (
                        this.addToken(tipo.PARENTESIS_ABRE, caracter, linea, columna);
                    }else if(asciiChar === 41){  //Char )
                        this.addToken(tipo.PARENTESIS_CIERRA, caracter, linea, columna);
                    }else if(asciiChar === 58){ //Char :
                        this.addToken(tipo.DOS_PUNTOS, caracter, linea, columna);
                    }else if(asciiChar === 123){ //Char {
                        this.addToken(tipo.LLAVE_ABRE, caracter, linea, columna);
                    }else if(asciiChar === 125){ //Char }
                        this.addToken(tipo.LLAVE_CIERRA, caracter, linea, columna);
                    }else if(asciiChar === 62){ //Char >
                        this.estado = 7;
                    }else if(asciiChar === 60){ // Char <
                        this.estado = 8;
                    }else if(asciiChar === 46){ //Char .
                        this.addToken(tipo.PUNTO, caracter, linea, columna);
                    }else if(this.esLetra(caracter)){
                        this.estado = 9;
                    }else if(asciiChar === 95){ //Char _
                        this.estado = 9;
                    }else if(asciiChar === 10){ // Salto de linea
                        linea++;
                        columna = 0;
                        this.limpiarVariables();
                    }else if(asciiChar === 32 || asciiChar === 9 || asciiChar === 13){ //Espacio y tabulador
                        //Ignorar
                        this.limpiarVariables();
                    }else if(asciiChar === 35 && i === entrada.length-1){
                        //Ignorar caracter final
                    }else{
                        this.addToken(tipo.ERROR_LEXICO, caracter, linea, columna);
                    }
                    break;
                case 1:
                    if(asciiChar === 47){  //Char /
                        this.auxLexico += caracter;
                        this.estado = 11;
                    }else if(asciiChar === 42){  //Char *
                        this.auxLexico += caracter;
                        this.estado = 12;
                    }else{
                        this.addToken(tipo.DIVISION, this.auxLexico, linea, columna);
                        i--;
                    }
                    break;
                case 2:
                    if(asciiChar === 34 || asciiChar === 39){ //Char "
                        this.auxLexico += caracter;
                        this.addToken(tipo.cadena, this.auxLexico,linea, columna);
                    }else{
                        this.auxLexico += caracter;
                    }
                    break;
                case 3:
                    if(asciiChar === 61){ //Char =
                        this.auxLexico += caracter;
                        this.addToken(tipo.IGUAL_IGUAL, this.auxLexico, linea, columna);
                    }else{
                        this.addToken(tipo.IGUAL, this.auxLexico, linea, columna);
                        i--;
                    }
                    break;
                case 4:
                    if(asciiChar === 38){ //Char &
                        this.auxLexico +=caracter;
                        this.addToken(tipo.AND, this.auxLexico, linea, columna);
                    }else if(asciiChar === 103){ //Char g
                        this.auxLexico +=caracter;
                        this.estado = 18;
                    }else if(asciiChar === 108){ //Char l
                        this.auxLexico +=caracter;
                        this.estado =19;
                    }else{
                        this.addToken(tipo.ERROR_LEXICO, this.auxLexico, linea,columna);
                        i--;
                    }
                    break;
                case 5:
                    if(asciiChar === 124){ //Char |
                        this.auxLexico += caracter;
                        this.addToken(tipo.OR,this.auxLexico,linea,columna);
                    }else{
                        this.addToken(tipo.ERROR_LEXICO, this.auxLexico, linea,columna);
                        i--;
                    }
                    break;
                case 6:
                    if(asciiChar === 61){ //Char =
                        this.auxLexico += caracter;
                        this.addToken(tipo.DISTINTO, this.auxLexico, linea, columna);
                    }else {
                        this.addToken(tipo.NOT, this.auxLexico, linea,columna);
                        i--;
                    }
                    break;
                case 7:
                    if(asciiChar === 61){ //Char =
                        this.auxLexico += caracter;
                        this.addToken(tipo.MAYOR_IGUAL, this.auxLexico, linea,columna);
                    }else{
                        this.addToken(tipo.MAYOR, this.auxLexico, linea, columna);
                        i--;
                    }
                    break;
                case 8:
                    if(asciiChar === 61){ //Char =
                        this.auxLexico += caracter;
                        this.addToken(tipo.MENOR_IGUAL, this.auxLexico, linea, columna)
                    }else{
                        this.addToken(tipo.MENOR, this.auxLexico, linea,columna);
                        i--;
                    }
                    break;
                case 9:
                    if(this.esNumero(caracter)){
                        this.auxLexico += caracter;
                    }else if(this.auxLexico === "int"){
                        this.addToken(tipo.int, this.auxLexico, linea, columna);
                        i--;
                    }else if(this.auxLexico === "double"){
                        this.addToken(tipo.double, this.auxLexico, linea, columna);
                        i--;
                    }else if(this.auxLexico ===  "char"){
                        this.addToken(tipo.char, this.auxLexico, linea, columna);
                        i--;
                    }else if(this.auxLexico === "bool"){
                        this.addToken(tipo.bool, this.auxLexico, linea, columna);
                        i--;
                    }else if(this.auxLexico === "string"){
                        this.addToken(tipo.string, this.auxLexico, linea, columna);
                        i--;
                    }else if(this.auxLexico === "void"){
                        this.addToken(tipo.void, this.auxLexico, linea, columna);
                        i--;
                    }else if(this.auxLexico === "main"){
                        this.addToken(tipo.main, this.auxLexico, linea, columna);
                        i--;
                    }else if(this.auxLexico === "if"){
                        this.addToken(tipo.if, this.auxLexico, linea, columna);
                        i--;
                    }else if(this.auxLexico === "else"){
                        this.addToken(tipo.else, this.auxLexico, linea, columna);
                        i--;
                    }else if(this.auxLexico === "Console"){
                        this.addToken(tipo.CONSOLE, this.auxLexico, linea, columna);
                        i--;
                    }else if(this.auxLexico === "Write"){
                        this.addToken(tipo.WRITE, this.auxLexico, linea, columna);
                        i--;
                    }else if(this.auxLexico === "switch"){
                        this.addToken(tipo.switch, this.auxLexico, linea, columna);
                        i--;
                    }else if(this.auxLexico === "case"){
                        this.addToken(tipo.case, this.auxLexico, linea, columna);
                        i--;
                    }else if(this.auxLexico === "break"){
                        this.addToken(tipo.break, this.auxLexico, linea, columna);
                        i--;
                    }else if(this.auxLexico === "for"){
                        this.addToken(tipo.for, this.auxLexico, linea, columna);
                        i--;
                    }else if(this.auxLexico === "while"){
                        this.addToken(tipo.do, this.auxLexico, linea, columna);
                        i--;
                    }else if(this.auxLexico === "do"){
                        let auxCaracter:any = entrada.charAt(i+1);
                        console.log(auxCaracter);
                        if(auxCaracter === "b"){
                            this.auxLexico += caracter;
                            //omitir el do
                        }else{
                            this.addToken(tipo.do, this.auxLexico, linea, columna);
                            i--;
                        }                        
                    }else if(this.auxLexico === "return"){
                        this.addToken(tipo.return, this.auxLexico, linea, columna);
                        i--;
                    }else if(this.auxLexico === "continue"){
                        this.addToken(tipo.continue,  this.auxLexico, linea, columna);
                        i--;
                    }else if(this.auxLexico === "default"){
                        this.addToken(tipo.default,  this.auxLexico, linea, columna);
                        i--;
                    }else  if(this.esLetra(caracter)){
                        this.auxLexico += caracter;
                    }else if(asciiChar === 95){ //Char _
                        this.auxLexico += caracter;
                    }else{
                        this.addToken(tipo.identificador, this.auxLexico, linea,columna);
                        i--;
                    }
                    break;
                case 10:
                    if(this.esNumero(caracter)){
                        this.auxLexico += caracter;
                    }else if(asciiChar === 46){ //Char .
                        this.auxLexico += caracter;
                        this.estado = 13;
                    }else{
                        this.addToken(tipo.numero, this.auxLexico, linea, columna);
                        i--;
                    }
                    break;
                case 11:
                    if(asciiChar === 10){ //Salto de linea
                        this.addToken(tipo.Comentario_Lineal, this.auxLexico, linea, columna);
                    }else{
                        this.auxLexico += caracter;
                    }
                    break;
                case 12:
                    this.auxLexico += caracter;
                    if(asciiChar === 42){  //Char *
                        this.estado = 14;
                    }
                    break;
                case 13:
                    if(this.esNumero(caracter)){
                        this.auxLexico += caracter;
                        this.estado = 15;
                    }else{
                        this.addToken(tipo.ERROR_LEXICO, this.auxLexico, linea, columna);
                        i--;
                    }
                    break;
                case 14:
                    if(asciiChar === 47){ //Char /
                        this.auxLexico += caracter;
                        this.addToken(tipo.Comentario_Multilinea, this.auxLexico, linea,columna);
                    }else{
                        this.auxLexico += caracter;
                        this.estado = 12;
                    }
                    break;
                case 15:
                    if(this.esNumero(caracter)){
                        this.auxLexico += caracter;
                    }else{
                        this.addToken(tipo.numero, this.auxLexico, linea,columna);
                        i--;
                    }
                    break;
                case 16:
                    if(asciiChar === 43){   //Char +
                        this.auxLexico += caracter;
                        this.addToken(tipo.INCREMENTO, this.auxLexico, linea, columna);
                    }else{
                        this.addToken(tipo.SUMA, this.auxLexico, linea, columna);
                        i--;
                    }
                    break;
                case 17:
                    if(asciiChar === 45){   //Char -
                        this.auxLexico += caracter;
                        this.addToken(tipo.DECREMENTO, this.auxLexico, linea, columna);
                    }else{
                        this.addToken(tipo.RESTA, this.auxLexico, linea, columna);
                        i--;
                    }
                    break;
                case 18:
                    if(asciiChar ===  116){ //Char t
                        this.auxLexico +=caracter;
                        this.estado = 20;
                    }else{
                        this.addToken(tipo.ERROR_LEXICO, this.auxLexico, linea,columna);
                        i--;
                    }
                    break;
                case 19:
                    if(asciiChar ===  116){ //Char t
                        this.auxLexico +=caracter;
                        this.estado = 21;
                    }else{
                        this.addToken(tipo.ERROR_LEXICO, this.auxLexico, linea,columna);
                        i--;
                    }
                    break;
                case  20:
                    if(asciiChar ===  59){ //Char ;
                        this.auxLexico += caracter;
                        this.estado = 7
                    }else{
                        this.addToken(tipo.ERROR_LEXICO, this.auxLexico, linea,columna);
                        i--;
                    }
                    break;
                case 21:
                    if(asciiChar ===  59){ //Char ;
                        this.auxLexico += caracter;
                        this.estado = 8;
                    }else{
                        this.addToken(tipo.ERROR_LEXICO, this.auxLexico, linea,columna);
                        i--;
                    }
                    break;
            }

            columna++;
        }

        console.log("Se ha analizado el archivo");

    }

    public mostrarAnalisisLexico():void{      
      console.log("mostrando analisis lexico");
      this.listaToken.forEach(item => {
          console.log(item.getTipoExtend()+" -> "+item.Valor+" -> "+item.Linea+"\n");
      });
    }


    private esNumero(caracter:any):boolean{
        let ascii = caracter.charCodeAt(0);
        if(ascii > 47 && ascii < 58){
            return true;
        }else{
            return false;
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

    private addToken(tokenType:tipo, dato:string, linea:number, columna:number):void{
        this.listaToken.push(new token(tokenType,dato,linea,columna));
        this.limpiarVariables();
    }

    private limpiarVariables():void{
        this.auxLexico = "";
        this.estado = 0;
    }
}



export function iniciarScanner(){
    let scannerFun = new scanner();
    scannerFun.startScanner();
    scannerFun.mostrarAnalisisLexico();

    return scannerFun.ListaToken;
}
