"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ast = void 0;
const Declaracion_1 = require("../Instrucciones/Declaracion");
const Fmain_1 = require("../Instrucciones/Fmain");
const Funcion_1 = require("../Instrucciones/Funcion");
const Errores_1 = require("./Errores");
const Nodo_1 = require("./Nodo");
class Ast {
    constructor(lista_instrucciones) {
        this.lista_instrucciones = lista_instrucciones;
    }
    traducir(controlador, ts) {
        ts.sizeActual.push(0);
        for (let instruccion of this.lista_instrucciones) {
            if (instruccion instanceof Funcion_1.Funcion) {
                ts.setStack(0);
                let funcion = instruccion;
                funcion.agregarFuncionTS(ts);
            }
        }
        let cantidadGlobales = 0;
        for (let instruccion of this.lista_instrucciones) {
            if (instruccion instanceof Declaracion_1.Declaracion) {
                instruccion.traducir(controlador, ts);
                instruccion.posicion = ts.getHeap();
                cantidadGlobales++;
            }
        }
        let c3d = `#include <stdio.h> //Importar para el uso de Printf 
float heap[16384]; //Estructura para heap 
float stack[16394]; //Estructura para stack 
float p; //Puntero P 
float h; //Puntero H 
`;
        for (let i = 0; i < cantidadGlobales; i++) {
            c3d += `heap[${i}] = 0\n`;
            c3d += `h = h + 1 \n`;
        }
        for (let instruccion of this.lista_instrucciones) {
            if (instruccion instanceof Fmain_1.Fmain) {
                c3d += instruccion.traducir(controlador, ts);
            }
            ;
        }
        return c3d;
    }
    ejecutar(controlador, ts) {
        let bandera_start = false;
        //1era pasada vamos a guardar las funciones y métodos del programa
        for (let instruccion of this.lista_instrucciones) {
            if (instruccion instanceof Funcion_1.Funcion) {
                let funcion = instruccion;
                funcion.agregarFuncionTS(ts);
            }
        }
        //Vamos a recorrer las instrucciones que vienen desde la gramática
        //2da pasada. Se ejecuta las declaraciones de variables
        for (let instruccion of this.lista_instrucciones) {
            if (instruccion instanceof Declaracion_1.Declaracion) {
                instruccion.ejecutar(controlador, ts);
            }
        }
        //3era pasada ejecutamos las demás instrucciones
        for (let instruccion of this.lista_instrucciones) {
            if (instruccion instanceof Fmain_1.Fmain && !bandera_start) {
                instruccion.ejecutar(controlador, ts);
                bandera_start = true;
            }
            else if (!(instruccion instanceof Declaracion_1.Declaracion) && !(instruccion instanceof Funcion_1.Funcion) && bandera_start) {
                instruccion.ejecutar(controlador, ts);
            }
            else if (bandera_start) {
                let error = new Errores_1.Errores("Semantico", `Solo se puede colocar un main.`, 0, 0);
                controlador.errores.push(error);
                controlador.append(`ERROR: Semántico, Solo se puede colocar un main.`);
                console.log("no se puede");
            }
        }
        if (bandera_start == false) {
            let error = new Errores_1.Errores("Semantico", `Se debe colocar un void main() para correr el programa.`, 0, 0);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, Se debe colocar un void main() para correr el programa.`);
        }
    }
    recorrer() {
        let raiz = new Nodo_1.Nodo("INICIO", "");
        for (let inst of this.lista_instrucciones) {
            raiz.AddHijo(inst.recorrer());
        }
        return raiz;
    }
}
exports.Ast = Ast;
