const fs = require("fs");
const text = fs.readFileSync("input.txt").toString();

input = text;

function part1(text) {
  return text
    .match(/-?\d+/gm)
    .map(Number)
    .reduce((a, b) => a + b, 0);
}

console.log(part1(input));

/// -----------
// part 2 - I recurse through the object and just delete any object that has "red". 
// Then I use same strategy as I did in part 1 so that I don't have to recurse and evaluate numerical values.
let obj = JSON.parse(input);

const isObject = (obj) => {
  return Object.prototype.toString.call(obj) === "[object Object]";
};

function recurse(obj) {
  // var can be object or array

  if (isObject(obj) && Object.values(obj).includes("red")) {
    return true; // mark for deletion before evaluating the object any further.
  }

  for (let childKey in obj) {
    if (typeof obj[childKey] !== "object") {
      continue; // we only care to recurse into objects
    }
    let markedForDeletion = recurse(obj[childKey]);
    if (markedForDeletion) {
      delete obj[childKey];
    }
  }
  return false;
}

recurse(obj);

console.log(part1(JSON.stringify(obj)));
