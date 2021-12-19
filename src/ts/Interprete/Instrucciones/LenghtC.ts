import { Errores } from "../AST/Errores";
import { Nodo } from "../AST/Nodo";
import { Controlador } from "../Controlador";
import { Expresion } from "../Interfaces/Expresion";
import { TablaSimbolos } from "../TablaSimbolos/TablaSimbolos";
import { tipo } from "../TablaSimbolos/Tipo";



export class LenghtC implements Expresion{

    public id : string;
    public linea: number;
    public columna: number;

    constructor (id: string, linea:number, columna:number){
        this.id = id;
        this.linea = linea;
        this.columna = columna;
    }

    getTipo(controlador: Controlador, ts: TablaSimbolos): tipo {
        return tipo.ENTERO;
    }

    getValor(controlador: Controlador, ts: TablaSimbolos) {

        let simbolo = ts.getSimbolo( this.id );
        let valorSimbolo: any = simbolo.getValor();

        if( simbolo.simbolo === 1 || simbolo.simbolo === 4) {

            return valorSimbolo.length;

        } else {

            let error = new Errores("Semantico",`La expresión no es de tipo cadena, solo se puede usar Lenght con cadenas`,this.linea,this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, La expresión no es de tipo cadena. En la linea ${this.linea} y columna ${this.columna}`);
            return tipo.ERROR;

        }

    }
    recorrer(): Nodo {
        let padre = new Nodo("length","");
        padre.AddHijo(new Nodo(this.id,""));
        padre.AddHijo(new Nodo(".",""));
        padre.AddHijo(new Nodo("length",""));
        padre.AddHijo(new Nodo("(",""));
        padre.AddHijo(new Nodo(")",""));
        return padre;
    }

<<<<<<< HEAD
}
=======
    traducir(controlador: Controlador, ts: TablaSimbolos): String {
        throw new Error("Method not implemented.");
    }

}
>>>>>>> b6266c72539562951b400d23c83c3aa92fe73c04
