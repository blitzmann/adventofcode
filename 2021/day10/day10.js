const fs = require("fs");
const text = (fs.readFileSync("input.txt")).toString();

let scores = new Map([
    [')', 3],
    [']', 57],
    ['}', 1197],
    ['>', 25137],
])

let scores2 = new Map([
    [')', 1],
    [']', 2],
    ['}', 3],
    ['>', 4],
])
let compliments = new Map([
    [')', '('],
    [']', '['],
    ['}', '{'],
    ['>', '<'],
])
let compliments2 = new Map([
    ['(', ')'],
    ['[', ']'],
    ['{', '}'],
    ['<', '>'],
])
input = text.split("\n")
scoreKeeper = []
for (let line of input.map(x=>x.split(""))) {
    let stack = []
    let corrupted = false;
    for (let char of line){
        if (['(','[','{','<'].includes(char)) {
            stack.push(char);
        }
        if ([')',']','}','>'].includes(char)) {
            let pop = stack.pop()
            if (compliments.get(char) !== pop){
                corrupted = true
                scoreKeeper.push(char)
                break
            }
        }
    }
}

console.log(scoreKeeper.map(x=>scores.get(x)).reduce((a,b)=>a+b, 0))

let part2 = []
for (let line of input.map(x=>x.split(""))) {
    let stack = []
    let corrupted = false;
    for (let char of line){
        if (['(','[','{','<'].includes(char)) {
            stack.push(char);
        }
        if ([')',']','}','>'].includes(char)) {
            let pop = stack.pop()
            if (compliments.get(char) !== pop){
                corrupted = true
                break
            }
        }
    }

    if (corrupted){
        continue;
    }

    // find the completion
    let s;
    let score = 0;
    while(s=stack.pop()){
        let next = compliments2.get(s)
        score = (score * 5) + scores2.get(next)
    }

    part2.push(score)
}

sorted = part2.sort((a,b)=>a-b)
console.log(sorted[Math.floor(sorted.length/2)])

