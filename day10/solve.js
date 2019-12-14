const fs = require('fs');
const path = require("path");
const input = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString().split('\n');

const tuple = require("immutable-tuple").tuple;

const coords = [];

for (let y = 0; y < input.length; y++) {

    for (let x = 0; x < input[y].length; x++) {
        const value = input[y][x];
        if (value === "#") {
            coords.push(tuple(x, y))
        }
    }
}

let maxNum = 0;
for (let coord1 of coords) {
    let num = 0
    for (let coord2 of coords) {
        // determine line
        if (coord1 === coord2) { continue; }
        let canSee = true;
        for (let coord3 of coords) {
            if (coord3 === coord1 || coord3 === coord2) { continue; }
            const checkX = (coord3[0] - coord1[0]) / (coord2[0] - coord1[0]) // x is the same
            const checkY = (coord3[1] - coord1[1]) / (coord2[1] - coord1[1]) // y is the same
            let blocked = false
            if (isNaN(checkX)) {
                // check to see if coord3 is closer
                if (coord1[1] > coord2[1]) {
                    blocked = coord3[1] > coord2[1] && coord3[1] < coord1[1]
                } else {
                    blocked = coord3[1] < coord2[1] && coord3[1] > coord1[1]
                }
            }
            if (isNaN(checkY)) {
                // check to see if coord3 is closer
                if (coord1[0] > coord2[0]) {
                    blocked = coord3[0] > coord2[0] && coord3[0] < coord1[0] 
                } else {
                    blocked = coord3[0] < coord2[0] && coord3[0] > coord1[0] 
                }
            }
            if ((checkX == checkY && checkX > 0 && checkX < 1)) {
                // something is blocking
                blocked = true
            }
            if (blocked) {
                canSee = false;
                break;
            }
        }

        if (canSee) {
            num++;
        }
    }
    if (num > maxNum) {
        maxNum = num;
    }
}

console.log(`Part 1: ${maxNum}`)