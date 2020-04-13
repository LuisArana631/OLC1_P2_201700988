export class variableItem{
    private id:string;
    private valor:string;
    private tipo:string;

    constructor(id:string, valor:string, tipo:string){
        this.id = id;
        this.valor = valor;
        this.tipo = tipo;
    }

    get ID():string{
        return this.id;
    }

    get Valor():string{
        return this.valor;
    }

    get Tipo():string{
        return this.tipo;
    }
}