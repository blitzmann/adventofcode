const fs = require('fs');
const path = require("path");
const inputs = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString().split('\n').map(line => line.split(','));

const tuple = require("immutable-tuple").tuple;

var visited = new Map();
var lineNum = 0;

// only two wires
for (let line of inputs) {
    var x = 0, y = 0, steps = 0;
    visited.set(lineNum, new Map())
    var currSet = visited.get(lineNum)
    
    for (let direction of line) {
        var parts = [direction.substring(0, 1), parseInt(direction.substring(1))]
        
        for (let _ of Array(parts[1]).keys()) {
            steps++;
            if (parts[0] === "U") {
                y++;
            }
            if (parts[0] === "D") {
                y--;
            }
            if (parts[0] === "R") {
                x++;
            }
            if (parts[0] === "L") {
                x--;
            }
            var t = tuple(x, y);
            if (!currSet.has(t)) {
                currSet.set(t, steps)
            }
        }
        
    }

    lineNum++;
}

var set1 = new Set(visited.get(0).keys())
var set2 = new Set(visited.get(1).keys())
var intersection =  new Set([...set1].filter(x => set2.has(x)));

console.log("Part 1:" + Math.min(...[...intersection].map(i => Math.abs(i[0])+Math.abs(i[1]))));

console.log("Part 2:" + Math.min(...[...intersection].map(i => visited.get(0).get(i)+visited.get(1).get(i))));
