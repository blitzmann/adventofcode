const fs = require("fs");
const text = (fs.readFileSync("input.txt")).toString();

input = text.split("\n").map(x=>x.split(" "));

let hor = 0, depth=0

for (let [direction, value] of input) {
    if (direction == "forward"){
        hor+=Number(value)
    }
    if (direction == "up"){
        depth-=Number(value)
    }
    if (direction == "down"){
        depth+=Number(value)
    }
}


console.log(hor*depth)


hor = 0, 
depth=0,
aim = 0

for (let [direction, value] of input) {
    if (direction == "forward"){
        hor+=Number(value)
        depth += aim*Number(value)
    }
    if (direction == "up"){
        aim-=Number(value)
    }
    if (direction == "down"){
        aim+=Number(value)
    }
}

console.log(hor*depth)
