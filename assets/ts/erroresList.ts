export class errorItem{
    private no:string;
    private tipo:string;
    private linea:string;
    private columna:string;
    private descripcion:string;

    constructor(no:string, tipo:string, linea:string, columna:string, descripcion:string){
        this.no = no;
        this.tipo = tipo;
        this.linea = linea;
        this.columna = columna;
        this.descripcion = descripcion;
    }

    get No():string{
        return this.no;
    }

    get Tipo():string{
        return this.tipo;
    }

    get Linea():string{
        return this.linea;
    }

    get Columna():string{
        return this.columna;
    }

    get Descripcion():string{
        return this.descripcion;
    }
}
