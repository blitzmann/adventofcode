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

let obj = JSON.parse(input);

const isObject = (obj) => {
  return Object.prototype.toString.call(obj) === "[object Object]";
};

const isArray = (obj) => {
  return Object.prototype.toString.call(obj) === "[object Array]";
};

function recurse(obj) {
  // var can be object or array

  if (isObject(obj) && Object.values(obj).includes("red")) {
    return false; // mark for deletion before
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
  return true;
}

recurse(obj);

console.log(part1(JSON.stringify(obj)));
