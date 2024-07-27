const fs = require('fs');
const path = require("path");
const input = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString();

const tuple = require("immutable-tuple").tuple;
const IntCode = require('../intCode')

const panels = new Map();
let currentPosition = [0, 0];
let direction = 0; // determines which direction we are heading, based on % 4

const program = new IntCode(input);

function paintPanel(color) {
    dontHalt = program.Run(color);

    if (!dontHalt) {
        return false
    }

    const [color2, turnRight] = program.outputs
    program.clearOutputs();
    panels.set(tuple(currentPosition[0], currentPosition[1]), color2)
    direction += turnRight ? 1 : -1

    dirMod = direction % 4
    if (dirMod < 0) {
        dirMod = 4 + dirMod
    }

    if (dirMod == 0) { // up
        currentPosition[1]++;
    }
    if (dirMod == 1) { // right
        currentPosition[0]++;
    }
    if (dirMod == 2) { // down
        currentPosition[1]--;
    }
    if (dirMod == 3) { // left
        currentPosition[0]--;
    }
    return true;
}

let cont = true
while (cont) {
    // provide current panels color, or 0 if we haven't visited this panel yet
    const color = panels.get(tuple(currentPosition[0], currentPosition[1])) || 0
    cont = paintPanel(color)
}

console.log(`Part 1: ${panels.size}`)

console.log(`Part 2:`)

// todo: make the robot a class with all the functionalities
currentPosition = [0, 0];
direction = 0; // determines which direction we are heading, based on % 4
program.reset();
panels.clear();
paintPanel(1); // start the program with white as the first panel
cont = true
while (cont) {
    // provide current panels color, or 0 if we haven't visited this panel yet
    const color = panels.get(tuple(currentPosition[0], currentPosition[1])) || 0
    cont = paintPanel(color)
}

// find min / max of coords
const minMaxX = [0, 0]
const minMaxY = [0, 0]

for (let coords of panels.keys()) {
    if (coords[0] < minMaxX[0]) {
        minMaxX[0] = coords[0];
    }
    if (coords[0] > minMaxX[1]) {
        minMaxX[1] = coords[0];
    }
    if (coords[1] < minMaxY[0]) {
        minMaxY[0] = coords[1];
    }
    if (coords[1] > minMaxY[1]) {
        minMaxY[1] = coords[1];
    }
}

for (y = minMaxY[1]; y >= minMaxY[0]; y--) {
    let line = ""
    for (x = minMaxX[0]; x < minMaxX[1]; x++) {
        color = panels.get(tuple(x, y)) || 0
        line += color ? "#" : " "
    }
    console.log(line);
}
