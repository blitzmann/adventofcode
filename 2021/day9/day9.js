const fs = require("fs");
const text = (fs.readFileSync("input.txt")).toString();

input = text.split("\n").map(x=>x.trim().split("").map(Number))

lowPoints = []
// todo: convert this to index stuff used in part 2
for (let x = 0; x < input.length; x++) {
    for (let y = 0; y < input[x].length; y++) {
        let val = input[x][y];
        let tests = []
        
        if (x != 0){
            tests.push(val < input[x-1][y]);
        }
        if (x+1 != input.length) {
            tests.push(val < input[x+1][y]);
        }
        if (y != 0){
            tests.push(val < input[x][y-1]);
        }
        if (y+1 != input[x].length ) {
            tests.push(val < input[x][y+1]);
        }

        if (tests.every(Boolean)){
            lowPoints.push([x, y]);
        }
    }   

}
console.log(lowPoints.map(x=>input[x[0]][x[1]]+1).reduce((a,b)=>a+b, 0))

let basins = new Map();

// found something on stack overflow to run this as a stack instead of a recursive function.
// https://stackoverflow.com/a/59835810/788054
function floodFill(matrix, x, y) {
    basin = new Set()
    basins.set(`${x},${y}`, basin)

    const w = matrix[0].length;
    const oneDindex = (x, y) => (x * w) + y;
    const twoDindex = (n) => [Math.floor(n / w), n % w]

    const canFill = (idx) => {
        if (basin.has(idx)) { return false; }
        let [x, y] = twoDindex(idx)
        if(x < 0){ return false; }
        if(y < 0){ return false; }
        if(x > matrix.length - 1){ return false; }
        if(y > w - 1){ return false; }
        if(matrix[x][y] === 9){ return false; }
        return true;
    }

    let stack = [oneDindex(x, y)]

    while (stack.length) {
        let idx = stack.pop();
        basin.add(idx);
        if (idx % w !== 0){
            canFill(idx - 1) && stack.push(idx - 1); // check left
        }
        if ((idx+1) % w !== 0){
            canFill(idx + 1) && stack.push(idx + 1); // check right
        }

        canFill(idx - w) && stack.push(idx - w); // check Up
        canFill(idx + w) && stack.push(idx + w); // check down
    }
    
};

for(let  t of lowPoints){
    floodFill(input, t[0], t[1])
}

console.log(
    [...basins.values()]
        .map(x=>x.size)
        .sort((a, b) => b - a)
        .slice(0, 3)
        .reduce((a, b)=>a*b, 1)
)