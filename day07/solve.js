const fs = require('fs');
const path = require("path");
const arr = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString();

class IntCode {
    constructor(program) {
        this.program = program.split(',').map(Number);
        this.outputs = [];
        this.i = 0;
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
                this.input = undefined;
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
        return this;
    }

    get last() {
        return this.outputs[this.outputs.length - 1]
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

let max = 0;
for (let phase of perm([0, 1, 2, 3, 4])) {
    const amps = []

    // initialize amps
    for (let i of Array(5).keys()) {
        amps[i] = new IntCode(arr).Run(phase[i])
    }

    // r will store the previous runs output
    // For each amp, feed it the previous value
    let r = 0;
    for (let amp of amps) {
        amp.Run(r)
        r = amp.last
    }

    if (r > max) {
        max = r
    }
}

console.log(`Part 1 ${max}`)

// this is done the same way, only we have a loop within the loop that will continue until the program halts
max = 0; // reset max
for (let phase of perm([5, 6, 7, 8, 9])) {

    const amps = []
    // initialize amps
    for (let i of Array(5).keys()) {
        amps[i] = new IntCode(arr)
        amps[i].Run(phase[i])
    }

    let r = 0;
    // do a while loop until one of them halts
    for (let i = 0; true; i++) {
        amp = amps[i % amps.length];
        ampCont = amp.Run(r);
        r = amp.last

        if (i % amps.length === amps.length - 1 && !ampCont) {
            break
        }
    }

    if (r > max) {
        max = r
    }

}

console.log(`Part 2 ${max}`)
