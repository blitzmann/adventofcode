const fs = require('fs');
const path = require("path");
const arr = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString().split(',').map(Number);

function intcode(input) {
    for (let i = 0; i < arr.length; i++){
        var instruction = arr[i].toString().split('');
        
        var op = parseInt(instruction.slice(instruction.length-2).join(''));
        var modes = instruction.slice(0, instruction.length-2).reverse().map(Number)
         
        if (op === 99){
            break;
        }
        if (op === 1) { // add
            var param1 = arr[i+1];
            var param2 = arr[i+2];
            var param3 = arr[i+3];
            var value1 = modes[0] === 1 ? param1 : arr[param1]
            var value2 = modes[1] === 1 ? param2 : arr[param2]

            arr[param3] = value1 + value2;
            i+=3;
        }
        if (op === 2) { // multiply
            var param1 = arr[i+1];
            var param2 = arr[i+2];
            var param3 = arr[i+3];
            var value1 = modes[0] === 1 ? param1 : arr[param1]
            var value2 = modes[1] === 1 ? param2 : arr[param2]

            arr[param3] = value1 * value2;
            i+=3;    
        }
        if (op === 3) { // input
            var param1 = arr[i+1]
            arr[param1] = input;
            i+=1;
        }
        if (op === 4) { // output
            var param1 = arr[i+1];
            console.log(arr[param1])
            i+=1;
        }
    }
}

 intcode(1);


