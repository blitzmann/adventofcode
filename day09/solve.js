const fs = require('fs');
const path = require("path");
const input = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString();
class IntCode {
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

    constructor(program, input) {
        this.program = program.split(',').map(Number);
        this.input = input;
        this.outputs = [];
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

        let i = 0;
        while (true) {
            const instruction = this.program[i].toString().split('');
            const op = parseInt(instruction.slice(instruction.length - 2).join(''));
            if (op === 99) {
                break;
            }
            const modes = instruction.slice(0, instruction.length - 2).reverse().map(Number)
            const func = this.opFunctions.get(op);
            var params = this.program.slice(i + 1, i + 1 + (func.length - 1))
            // set the next instruction based on return of the function or automatically based on the number of parameters
            i = (func(...params, modes) - 1) || (i + (func.length - 1));
            i++;
        }
    }
}

// tests
// var test1input = "109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99"
// const test1 = new IntCode(test1input);
// console.log(`Test 1: ` + (test1.outputs.join(',') === test1input ? 'pass' : 'fail'))
// var test2input = "1102,34915192,34915192,7,4,7,99,0"
// const test2 = new IntCode(test2input);
// console.log(`Test 2: ` + (test2.outputs[test2.outputs.length-1].toString().length === 16 ? 'pass' : 'fail'))
// var test3input = "104,1125899906842624,99"
// const test3 = new IntCode(test3input);
// console.log(`Test 2: ` + (test3.outputs[test2.outputs.length-1] === 1125899906842624 ? 'pass' : 'fail'))
// console.log()
const part1 = new IntCode(input, 1);
console.log(`Part 1: ${(part1.outputs[part1.outputs.length - 1])}`)

const part2 = new IntCode(input, 2);
console.log(`Part 2: ${(part2.outputs[part2.outputs.length - 1])}`)
// const part2 = new IntCode(input, 5);
// console.log(`Part 2: ${(part2.outputs[part2.outputs.length - 1])}`)