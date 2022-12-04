const fs = require('fs');
const path = require("path");
const input = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString();

const tuple = require("immutable-tuple").tuple;
const IntCode = require('../intCode')

/* For part 1, you actually have to play the game. Can probably do some code to automate the process. Eventually, had to get these items:
    Wreath
    Sand
    Mug
    Astrolabe
*/

const program = new IntCode(input);
program.Run(undefined)

const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function readInput(input) {
    for (i=0; i<input.length; i++){
        program.Run(input.charCodeAt(i))
    }
    program.Run(10)


    let map = '';

    for (let code of program.outputs){
        map += String.fromCharCode(code)
    }
    program.clearOutputs()

    rl.question(map, function(response) {
        readInput(response)
    })

}
readInput('')

rl.on("close", function() {
    console.log("\nBye!");
    process.exit(0);
});
