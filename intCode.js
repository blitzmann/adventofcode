
class IntCode {
    constructor(program) {
        this.program = program.split(',').map(Number);
        this.outputs = [];
        this.i = 0;
        this.relativeBase = 0;

        this.opFunctions = new Map([
            // Mapping of opcode and the functions that determine their results 
            // These functions return undefined or Integer
            //   If undefined, automatically increments by parameter count to next intruction. 
            //   If Integer, determine thes jump index for the next instruction
            [1, (param1, param2, param3, modes) => {
                const value1 = this.getValue(param1, modes[0])
                const value2 =  this.getValue(param2, modes[1])
                this.setValue(param3, modes[2], value1 + value2);
            }],
            [2, (param1, param2, param3, modes) => {
                const value1 =  this.getValue(param1, modes[0])
                const value2 =  this.getValue(param2, modes[1])
                this.setValue(param3, modes[2], value1 * value2);
            }],
            [3, (param1, modes) => {
                this.setValue(param1, modes[0], this.input);
                this.input = undefined;
            }],
            [4, (param1, modes) => {
                const value1 = this.getValue(param1, modes[0])
                this.outputs.push(value1);
            }],
            [5, (param1, param2, modes) => {
                const value1 =  this.getValue(param1, modes[0])
                const value2 =  this.getValue(param2, modes[1])
                if (value1 !== 0) {
                    return value2;       
                }
            }],
            [6, (param1, param2, modes) => {
                const value1 = this.getValue(param1, modes[0])
                const value2 = this.getValue(param2,  modes[1])
                if (value1 === 0) {
                    return value2;
                }
            }],
            [7, (param1, param2, param3, modes) => {
                const value1 =  this.getValue(param1, modes[0])
                const value2 =  this.getValue(param2, modes[1])
                this.setValue(param3, modes[2], value1 < value2 ? 1 : 0);
            }],
            [8, (param1, param2, param3, modes) => {
                const value1 = this.getValue(param1, modes[0])
                const value2 = this.getValue(param2, modes[1])
                this.setValue(param3, modes[2], value1 === value2 ? 1 : 0);
            }],
            [9, (param1, modes) => {
                this.relativeBase += this.getValue(param1, modes[0]);
            }],
        ]);
        return this;
    }

    get last() {
        return this.outputs[this.outputs.length - 1]
    }

    getValue(param, mode) {
        if (mode === 1) { //immidiate
            return param || 0
        }
        if (mode === 2) { // relative
            return this.program[this.relativeBase + param] || 0
        } 
        return this.program[param] || 0 // position
    }

    setValue(param, mode, value){
        this.program[mode === 2 ? this.relativeBase + param : param] = value;
    }

    Run(input) {
        this.input = input

        while (true) {
            const instruction = this.program[this.i].toString().split('');

            const op = parseInt(instruction.slice(instruction.length - 2).join(''));
            if (op === 99) {
                return;
            }
            if (op === 3 && this.input === undefined) {
                break;
            }
            const modes = instruction.slice(0, instruction.length - 2).reverse().map(Number)
            const func = this.opFunctions.get(op);
            var params = this.program.slice(this.i + 1, this.i + 1 + (func.length - 1))

            // set the next instruction based on return of the function or automatically based on the number of parameters
            this.i = (func(...params, modes) - 1) || (this.i + (func.length - 1));
            this.i++
        }
        return this;
    }
}

module.exports = IntCode;