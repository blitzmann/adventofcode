const fs = require("fs");
const text = (fs.readFileSync("input.txt")).toString();

input = text.split(",").map(Number);

function calcDays(days){
    let timer = new Map(Array.from({length: 9}).map((_, i)=>[i, 0]));

    for (let x of input){
        timer.set(x, timer.get(x) + 1)
    }

    for (let _ of Array.from({length: days})){
        let newTimer = new Map(Array.from({length: 9}).map((_, i)=>[i, 0]));
        for(let i of Array.from({length: 9}).map((_, i)=>i).reverse()){
            // iterate over the maps and move each set down a level
            if (i !== 0) {
                newTimer.set(i-1, timer.get(i));
            } else {
                // spawn new lanterfish at timer 8
                newTimer.set(8, timer.get(0));
                // move all expiring to timer-6
                newTimer.set(6, newTimer.get(6) + timer.get(0) );
            }
        }
        timer = newTimer;
    }
    return Array.from(timer.values()).reduce((a,b)=>a+b, 0)
}

console.log(calcDays(80))
console.log(calcDays(256))