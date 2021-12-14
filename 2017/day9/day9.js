const fs = require("fs");
const text = fs.readFileSync("input.txt").toString();

text.split("");

let garbage = false;
let stack = [];
let groups = 0;
let score = 0;
let garbageCount = 0;

for (let i = 0; i < text.length; i++) {
  let char = text[i];
  if (char === "!") {
    i++;
    continue;
  }

  if (garbage) {
    if (char === ">") {
      garbage = false;
    } else {
      garbageCount++;
    }
    continue;
  }

  if (char === "<") {
    garbage = true;
    continue;
  }

  if (char === "{") {
    stack.push("{");
  }

  if (char === "}") {
    score += stack.length;
    groups++;
    stack.pop();
  }
}

console.log(score);
console.log(garbageCount);
