const fs = require('fs');
const path = require("path");
const input = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString();

const IntCode = require('../intCode')

const part1 = new IntCode(input);
part1.Run(1)
console.log(`Part 1: ${part1.last}`)

const part2 = new IntCode(input);
part2.Run(2)
console.log(`Part 2: ${part2.last}`)
