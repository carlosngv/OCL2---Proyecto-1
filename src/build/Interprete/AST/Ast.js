"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Declaracion_1 = __importDefault(require("../Instrucciones/Declaracion"));
const Funcion_1 = __importDefault(require("../Instrucciones/Funcion"));
const StartWith_1 = __importDefault(require("../Instrucciones/StartWith"));
const Errores_1 = __importDefault(require("./Errores"));
const Nodo_1 = __importDefault(require("./Nodo"));
class Ast {
    constructor(lista_instrucciones) {
        this.lista_instrucciones = lista_instrucciones;
    }
    ejecutar(controlador, ts) {
        let bandera_start = false;
        //1era pasada vamos a guardar las funciones y métodos del programa
        for (let instruccion of this.lista_instrucciones) {
            if (instruccion instanceof Funcion_1.default) {
                let funcion = instruccion;
                funcion.agregarFuncionTS(ts);
            }
        }
        //Vamos a recorrer las instrucciones que vienen desde la gramática
        //2da pasada. Se ejecuta las declaraciones de variables
        for (let instruccion of this.lista_instrucciones) {
            if (instruccion instanceof Declaracion_1.default) {
                instruccion.ejecutar(controlador, ts);
            }
        }
        //era pasada ejecutamos las demás instrucciones
        for (let instruccion of this.lista_instrucciones) {
            if (instruccion instanceof StartWith_1.default && !bandera_start) {
                instruccion.ejecutar(controlador, ts);
                bandera_start = true;
            }
            else if (!(instruccion instanceof Declaracion_1.default) && !(instruccion instanceof Funcion_1.default) && bandera_start) {
                instruccion.ejecutar(controlador, ts);
            }
            else if (bandera_start) {
                let error = new Errores_1.default("Semantico", `Solo se puede colocar un startwith.`, 0, 0);
                controlador.errores.push(error);
                controlador.append(`ERROR: Semántico, Solo se puede colocar un startwith.`);
                console.log("no se puede");
            }
        }
    }
    recorrer() {
        let raiz = new Nodo_1.default("INICIO", "");
        for (let inst of this.lista_instrucciones) {
            raiz.AddHijo(inst.recorrer());
        }
        return raiz;
    }
}
exports.default = Ast;