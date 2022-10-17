const fs = require("fs");
const text = fs.readFileSync("input.txt").toString();

steps.split(",");

let x=0,y=0,z=0
function distance(x1,y1,z1, x2, y2, z2) {
  return (Math.abs(x1 - x2) + Math.abs(y1 - y2) + Math.abs(z1 - z2)) / 2
}

for (direction in steps) {
  switch(direction) {
      case "n":
        current[1]++; 
        current[2]--;
        break; 
      case "ne":
        current[]++x; --z }
      "se" -> { ++x; --y }
      "s"  -> { --y; ++z }
      "sw" -> { --x; ++z }
      "nw" -> { ++y; --x }
  }
}
