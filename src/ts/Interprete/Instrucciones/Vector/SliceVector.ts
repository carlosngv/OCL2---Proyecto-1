import { Errores } from "../../AST/Errores";
import { Nodo } from "../../AST/Nodo";
import { Controlador } from "../../Controlador";
import { Expresion } from "../../Interfaces/Expresion";
import { Instruccion } from "../../Interfaces/Instruccion";
import { TablaSimbolos } from "../../TablaSimbolos/TablaSimbolos";
import { tipo } from "../../TablaSimbolos/Tipo";




export class SliceVector implements Expresion{

    public id: string;
    public inicio : Expresion;
    public final : Expresion;
    public linea: number;
    public columna: number
    public slicedVector: string;

    constructor(id: string, inicio :Expresion, final: Expresion, linea:number, columna:number){
        this.id = id;
        this.inicio = inicio
        this.final = final
        this.linea = linea
        this.columna = columna
    }
    getTipo(controlador: Controlador, ts: TablaSimbolos): tipo {
        return tipo.CADENA;
    }
    getValor(controlador: Controlador, ts: TablaSimbolos) {
        this.ejecutar(controlador, ts);
        return this.slicedVector;
    }
    ejecutar(controlador: Controlador, ts: TablaSimbolos) {
        let inicio = this.inicio.getValor(controlador, ts);
        let tipoInicio = this.inicio.getTipo(controlador, ts);
        let fin = this.final.getValor(controlador, ts);

        if(tipoInicio === tipo.CADENA) {
            if( inicio === 'begin') inicio = 0;
        }

        console.log('inicio: ', inicio);
        console.log('fin: ', fin);

        let valoresVector = this.getValoresVector( ts );


        if(fin === 'end') inicio = valoresVector.length - 1;

        let slicedVector = valoresVector.slice(inicio, fin);
        console.log('SLICED VECTOR:', slicedVector);
        this.slicedVector = String(slicedVector);
    }

    getValoresVector(ts: TablaSimbolos) {

        let simAux = ts.getSimbolo(this.id);

        if(simAux?.simbolo == 4){

            let valoresVector = simAux.valor;
            return valoresVector;

        }

        return null;

    }

    recorrer(): Nodo {
        throw new Error("Method not implemented.");
    }

    traducir(controlador: Controlador, ts: TablaSimbolos) :String {
        return 'slice';
    }
}
