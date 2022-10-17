const fs = require("fs");
const text = fs.readFileSync("input.txt").toString();

let instructions = text.split("\n").map((x) => x.trim());

function run(registers) {
    for (let i = 0; i < instructions.length; i++) {
        let [ins, offset] = instructions[i].split(", ");
        let [ins1, ins2] = ins.split(" ");

        switch (ins1) {
            case "hlf":
                registers[ins2] /= 2;
                break;
            case "tpl":
                registers[ins2] *= 3;
                break;
            case "inc":
                registers[ins2] += 1;
                break;
            case "jmp":
                i += +ins2 - 1;
                break;
            case "jie":
                registers[ins2] % 2 === 0 ? (i += +offset - 1) : null;
                break;
            case "jio":
                registers[ins2] === 1 ? (i += +offset - 1) : null;
                break;
        }
    }
    return registers;
}

console.log(run({ a: 0, b: 0 }));
console.log(run({ a: 1, b: 0 }));
