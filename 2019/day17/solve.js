const fs = require('fs');
const path = require("path");
const input = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString();

const tuple = require("immutable-tuple").tuple;
const IntCode = require('../intCode')

const program = new IntCode(input);
program.Run(undefined)
console.log(program.outputs)

let map = '';
for (let code of program.outputs){
    map += String.fromCharCode(code)
}

const mapLines = map.split('\n');

const maxX = mapLines[0].length;
const maxY = mapLines.length;
const scaffolding = new Set();
const intersections = new Set();

for (let y = 0; y < maxY; y++) {
    for (let x = 0; x < maxX; x++) {
        if (mapLines[y][x] === "#") {
            scaffolding.add(tuple(x, y))
            if (mapLines[y+1] && mapLines[y+1][x] === "#" && // bottom
                mapLines[y-1] && mapLines[y-1][x] === "#" && // top
                mapLines[y][x+1] === "#" && // right
                mapLines[y][x-1] === "#" // left
                ) { // bottom
                intersections.add(tuple(x, y))
            }
        }
    }
}

console.log(Array.from(intersections).reduce((a, b)=>a + (b[0] * b[1]), 0))

console.log(map)
