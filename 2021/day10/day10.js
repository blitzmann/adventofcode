const fs = require("fs");
const text = (fs.readFileSync("input.txt")).toString();

let errorScores = new Map([
    [')', 3],
    [']', 57],
    ['}', 1197],
    ['>', 25137],
])

let completionScores = new Map([
    [')', 1],
    [']', 2],
    ['}', 3],
    ['>', 4],
])
let complimentsRev = new Map([
    [')', '('],
    [']', '['],
    ['}', '{'],
    ['>', '<'],
])
let compliments = new Map([
    ['(', ')'],
    ['[', ']'],
    ['{', '}'],
    ['<', '>'],
])

class Line {
    constructor(line) {
        let stack = []
        this.corrupted = false;
        this.errorScore = null;
        this.completionScore = 0;

        // process the line to check for corruption
        for (let char of line){
            if (['(','[','{','<'].includes(char)) {
                stack.push(char);
            }
            if ([')',']','}','>'].includes(char)) {
                if (complimentsRev.get(char) !== stack.pop()){
                    this.corrupted = true
                    this.errorScore = errorScores.get(char)
                    return;
                }
            }
        }        

        // if we're here, the line isn't corrupted, it's just incomplete. Run completion logic
        let s;
        while(s=stack.pop()){
            let next = compliments.get(s)
            this.completionScore = (this.completionScore * 5) + completionScores.get(next)
        }
    }
}

input = text.split("\n").map(x=>new Line(x))

console.log(input
    .filter(x=>x.corrupted)
    .map(x=>x.errorScore)
    .reduce((a, b) => a + b, 0))

let sorted = input
    .filter(x=>!x.corrupted)
    .map(x=>x.completionScore)
    .sort((a, b) => a - b);
console.log(sorted[Math.floor(sorted.length/2)])

