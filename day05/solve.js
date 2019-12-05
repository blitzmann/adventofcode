const fs = require('fs');
const path = require("path");
const arr = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString().split(',').map(Number);

function intcode(input) {
    for (let i = 0; i < arr.length; i++) {
        const instruction = arr[i].toString().split('');

        const op = parseInt(instruction.slice(instruction.length - 2).join(''));
        const modes = instruction.slice(0, instruction.length - 2).reverse().map(Number)

        if (op === 99) {
            break;
        }
        if (op === 1) { // add
            const param1 = arr[i + 1];
            const param2 = arr[i + 2];
            const param3 = arr[i + 3];
            const value1 = modes[0] === 1 ? param1 : arr[param1]
            const value2 = modes[1] === 1 ? param2 : arr[param2]

            arr[param3] = value1 + value2;
            i += 3;
        }
        if (op === 2) { // multiply
            const param1 = arr[i + 1];
            const param2 = arr[i + 2];
            const param3 = arr[i + 3];
            const value1 = modes[0] === 1 ? param1 : arr[param1]
            const value2 = modes[1] === 1 ? param2 : arr[param2]

            arr[param3] = value1 * value2;
            i += 3;
        }
        if (op === 3) { // input
            const param1 = arr[i + 1]
            arr[param1] = input;
            i += 1;
        }
        if (op === 4) { // output
            const param1 = arr[i + 1];
            const value1 = modes[0] === 1 ? param1 : arr[param1]

            console.log(value1)
            i += 1;
        }
        if (op === 5) { // jump-if-true
            const param1 = arr[i + 1];
            const param2 = arr[i + 2];
            const value1 = modes[0] === 1 ? param1 : arr[param1]
            const value2 = modes[1] === 1 ? param2 : arr[param2]

            if (value1 !== 0) {
                i = value2 - 1 // -1 here because the forloop will automatically +1       
            } else {
                i += 2;
            }
        }
        if (op === 6) { // jump-if-false
            const param1 = arr[i + 1];
            const param2 = arr[i + 2];
            const value1 = modes[0] === 1 ? param1 : arr[param1]
            const value2 = modes[1] === 1 ? param2 : arr[param2]

            if (value1 === 0) {
                i = value2 - 1 // -1 here because the forloop will automatically +1 
            } else {
                i += 2;
            }
        }
        if (op === 7) { // less than
            const param1 = arr[i + 1];
            const param2 = arr[i + 2];
            const param3 = arr[i + 3];
            const value1 = modes[0] === 1 ? param1 : arr[param1]
            const value2 = modes[1] === 1 ? param2 : arr[param2]

            arr[param3] = value1 < value2 ? 1 : 0
            i += 3;
        }
        if (op === 8) { // equal to
            const param1 = arr[i + 1];
            const param2 = arr[i + 2];
            const param3 = arr[i + 3];
            const value1 = modes[0] === 1 ? param1 : arr[param1]
            const value2 = modes[1] === 1 ? param2 : arr[param2]

            arr[param3] = value1 === value2 ? 1 : 0;
            
            i += 3;
        }
    }
}

intcode(5);


