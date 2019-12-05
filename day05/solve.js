const fs = require('fs');
const path = require("path");
const input = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString();


class IntCode {

    constructor(program, input) {
        this.program = program.split(',').map(Number);
        this.input = input;
        this.outputs = [];
        this.opFunctions = new Map([
            // Mapping of opcode and the functions that determine their results 
            // These functions return undefined or Integer
            //   If undefined, automatically increments by parameter count to next intruction. 
            //   If Integer, determine thes jump index for the next instruction
            [1, (param1, param2, param3, modes) => {
                const value1 = modes[0] === 1 ? param1 : this.program[param1]
                const value2 = modes[1] === 1 ? param2 : this.program[param2]

                this.program[param3] = value1 + value2;
            }],
            [2, (param1, param2, param3, modes) => {
                const value1 = modes[0] === 1 ? param1 : this.program[param1]
                const value2 = modes[1] === 1 ? param2 : this.program[param2]

                this.program[param3] = value1 * value2;
            }],
            [3, (param1, _) => {
                this.program[param1] = this.input;
            }],
            [4, (param1, modes) => {
                const value1 = modes[0] === 1 ? param1 : this.program[param1]
                this.outputs.push(value1);
            }],
            [5, (param1, param2, modes) => {
                const value1 = modes[0] === 1 ? param1 : this.program[param1]
                const value2 = modes[1] === 1 ? param2 : this.program[param2]

                if (value1 !== 0) {
                    return value2;       
                }
            }],
            [6, (param1, param2, modes) => {
                const value1 = modes[0] === 1 ? param1 : this.program[param1]
                const value2 = modes[1] === 1 ? param2 : this.program[param2]

                if (value1 === 0) {
                    return value2;
                }
            }],
            [7, (param1, param2, param3, modes) => {
                const value1 = modes[0] === 1 ? param1 : this.program[param1]
                const value2 = modes[1] === 1 ? param2 : this.program[param2]

                this.program[param3] = value1 < value2 ? 1 : 0
            }],
            [8, (param1, param2, param3, modes) => {
                const value1 = modes[0] === 1 ? param1 : this.program[param1]
                const value2 = modes[1] === 1 ? param2 : this.program[param2]

                this.program[param3] = value1 === value2 ? 1 : 0;
            }],
        ]);

        for (let i = 0; i < this.program.length; i++) {
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
        }
    }
}

const part1 = new IntCode(input, 1);
console.log(`Part 1: ${(part1.outputs[part1.outputs.length - 1])}`)

const part2 = new IntCode(input, 5);
console.log(`Part 2: ${(part2.outputs[part2.outputs.length - 1])}`)

