const fs = require('fs');
const path = require("path");
const arr = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString();

phase = [0, 1, 2, 3, 4]

class IntCode {

    constructor(program, inputs) {
        this.program = program.split(',').map(Number);
        this._inputIdx = 0
        this.inputs = inputs;
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
                this.program[param1] = this.inputs[this._inputIdx];
                this._inputIdx++;
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

// Thanks stack overflow!
// https://stackoverflow.com/a/43260158
function perm(xs) {
    let ret = [];

    for (let i = 0; i < xs.length; i = i + 1) {
        let rest = perm(xs.slice(0, i).concat(xs.slice(i + 1)));

        if (!rest.length) {
            ret.push([xs[i]])
        } else {
            for (let j = 0; j < rest.length; j = j + 1) {
                ret.push([xs[i]].concat(rest[j]))
            }
        }
    }
    return ret;
}

var maxPerm;
var max = 0;
for (var phase of perm([0, 1, 2, 3, 4])) {
    amp1 = new IntCode(arr, [phase[0], 0])
    amp2 = new IntCode(arr, [phase[1], amp1.outputs[amp1.outputs.length - 1]])
    amp3 = new IntCode(arr, [phase[2], amp2.outputs[amp2.outputs.length - 1]])
    amp4 = new IntCode(arr, [phase[3], amp3.outputs[amp3.outputs.length - 1]])
    amp5 = new IntCode(arr, [phase[4], amp4.outputs[amp4.outputs.length - 1]])
    var thing = amp5.outputs[amp5.outputs.length - 1]
    if (thing > max) {
        max = thing
        marPerm = phase
    }
}

console.log(max, maxPerm)


  ///


// for (var x of Array(4).keys()){
//     console.log(x)
// }


// amp1 = new IntCode(arr, [phase[0], 0])
// amp2 = new IntCode(arr, [phase[1], amp1.outputs[amp1.outputs.length - 1]])
// amp3 = new IntCode(arr, [phase[2], amp2.outputs[amp2.outputs.length - 1]])
// amp4 = new IntCode(arr, [phase[3], amp3.outputs[amp3.outputs.length - 1]])
// amp5 = new IntCode(arr, [phase[4], amp4.outputs[amp4.outputs.length - 1]])

// console.log(amp5.outputs[amp5.outputs.length - 1])