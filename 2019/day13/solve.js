const fs = require('fs');
const path = require("path");
const input = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString();

const tuple = require("immutable-tuple").tuple;
const IntCode = require('../intCode')


const program = new IntCode(input);
program.Run()

function chunk(array, size) {
    const chunked_arr = [];
    for (let i = 0; i < array.length; i++) {
      const last = chunked_arr[chunked_arr.length - 1];
      if (!last || last.length === size) {
        chunked_arr.push([array[i]]);
      } else {
        last.push(array[i]);
      }
    }
    return chunked_arr;
}


const tiles = new Map()
for (let [x, y, type] of chunk(program.outputs, 3)) {
    tiles.set(tuple(x, y), type)
}

console.log(`Part 1: ${Array.from(tiles.values()).filter(v => v === 2).length}`)


function writeTiles() {
    console.clear()
    const tiles = new Map()
    for (let [x, y, type] of chunk(program.outputs, 3)) {
        tiles.set(tuple(x, y), type)
    }
    // find min / max of coords
    const minMaxX = [0, 0]
    const minMaxY = [0, 0]

    for (let coords of tiles.keys()) {
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

    for (y = minMaxY[0]; y <= minMaxY[1]; y++) {
        let line = ""
        for (x = minMaxX[0]; x <= minMaxX[1]; x++) {
            tile = tiles.get(tuple(x, y)) || 0
            if (tile === 0){
                line += ' '
            }
            if (tile === 1) {
                line += '|'
            }
            if (tile===2){
                line += '#'
            }
            if (tile===3){
                line += '_'
            }
            if (tile===4){
                line += '*'
            }
        }
        console.log(line);
    }
}
function gameTick(direction){
    program.Run(direction);
    writeTiles();
}
program.reset();
program.program[0] = 2;
gameTick(1)
setInterval(()=>gameTick(0), 250);

console.log()