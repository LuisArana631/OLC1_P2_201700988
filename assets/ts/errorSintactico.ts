export class errorSintactico{
    private valor:string;
    private linea:number;
    private columna:number;
    private error:string;

    constructor(valor:string, linea:number, columna:number, error:string){
        this.valor = valor;
        this.linea = linea;
        this.columna = columna;        
        this.error = error;
    }

    get Valor():string{
        return this.valor;
    }

    get Linea():number{
        return this.linea;
    }

    get Columna():number{
        return this.columna;
    }

    get Error():string{
        return this.error;
    }
    
}