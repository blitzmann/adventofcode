const fs = require('fs');
const path = require("path");
const inputs = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString().split(',').map(i => parseInt(i));

function intcode(v1, v2) {
    const arr = inputs.slice(0)
    
    arr[1] = v1
    arr[2] = v2

    for (let x = 0; x < arr.length; x += 4){
        op = arr[x];
        if (op === 99){
            break;
        }
        if (op === 1) { // add
            arr[arr[x+3]] = arr[arr[x+1]] + arr[arr[x+2]];
        }
        if (op === 2) { // multiply
            arr[arr[x+3]] = arr[arr[x+1]] * arr[arr[x+2]];
        }
    }

    return arr[0];
}

// part 1
console.log(`Part 1: ${intcode(12, 2)}`)

// part 2
for (let v1 = 0; v1 <= 99; v1++) {
    for (let v2 = 0; v2 <= 99; v2++) {
        if (intcode(v1, v2) === 19690720) {
            // we've found the two inputs, print out the required formula and return
            console.log(`Part 2: ${100 * v1 + v2}`)
            return;
        }
    }
}