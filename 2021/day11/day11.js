const fs = require("fs");
const text = (fs.readFileSync("input.txt")).toString();

let inputRaw = text.split("\r\n").map(x=>x.trimEnd().split("").map(Number))
const WIDTH = inputRaw[0].length
inputRaw = inputRaw.flat(1)

input = [...inputRaw]
let totalFlashes = 0

function flashNeighbors(i){
    y = [
        i - WIDTH, // top
        i + WIDTH // down
     ]

    // not on right bounds
    if ((i+1) % WIDTH !== 0) {
        y = [
            ...y,
            i + WIDTH + 1, // down right
            i - WIDTH + 1, //top right
            i + 1 // right
        ]
    }

    // not on the left bounds
    if ((i) % WIDTH !== 0) {
        y = [
            ...y,
            i - WIDTH - 1, // top left
            i + WIDTH - 1, // down left
            i - 1 // left
        ]
    }

    // y should now contain all indicies that need to be flashed
    y = y.filter(x=>x >= 0 && x < input.length && input[x] !== 0);
    y.forEach(x=>input[x] = (input[x] + 1) % 10); // increment
    return y;
}

function propogateFlashes(flashes) {
    newFlashes = []
    for (let i of flashes) {
        let flashed = flashNeighbors(i)
        // determine which ones are now at 0
        newFlashes = [...newFlashes, ...flashed.filter(i=>input[i] === 0)]
    }
    if (newFlashes.length > 0){
        propogateFlashes(newFlashes)
    }
}

function step() {
    input = input.map(x=>(x+1) % 10)
    // find all 0's
    let flashes = input.reduce((a, x, i)=> x===0 ? [...a, i] : a, [])
    propogateFlashes(flashes)
    totalFlashes += input.filter(x=>x===0).length
    // uncomment for visualization
    // printStep()
}

function printStep() {
    t = input.map((x, i)=>{
        let t;
        if (x === 0){ t = "\x1b[36m"+x.toString()+"\x1b[0m" }
        else { t = x }
        if ((i + 1) % WIDTH === 0){ t += "\n" }
        return t
    }).join("")
    console.log(t + "\n\n")
}

for(let x=0; x<100; x++){
    step();
}

console.log(totalFlashes) 

input = [...inputRaw] // reset

i = 0;
while(true){
    step()
    i++;
    if (input.every(x=>x === 0)){
        console.log(i)
        break;
    }
}