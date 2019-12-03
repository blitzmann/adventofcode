const fs = require('fs');
const path = require("path");
const inputs = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString().split('\n').map(line => line.split(','));

const tuple = require("immutable-tuple").tuple;

// Format: {line number: Map()} 
// See below for the definition of the Map() value
var data = new Map();
var lineNum = 0;

// only two wires
for (let line of inputs) {
    // reset some variables for each line
    let x = 0,
        y = 0, 
        steps = 0;

    // Format: {coordinate: steps to reach coordinate }
    // Create coordinates visited map. We only add coordinates to the Map if we haven't seen it before.
    // Otherwise, per day rules, we don't care about it
    data.set(lineNum, new Map())
    const visited = data.get(lineNum)
    
    for (let direction of line) {
        const parts = [direction.substring(0, 1), parseInt(direction.substring(1))]
        
        for (let _ of Array(parts[1]).keys()) {
            // for each step, increment the number of steps as well as increment/decrement coordinate for the given direction
            steps++;
            if (parts[0] === "U") { y++; }
            if (parts[0] === "D") { y--; }
            if (parts[0] === "R") { x++; }
            if (parts[0] === "L") { x--; }

            // we should now have the current position for this step, create a tuple and save it to the map if we don't already have it,
            // along with the steps it took to get here
            var t = tuple(x, y);
            if (!visited.has(t)) {
                visited.set(t, steps)
            }
        }
    }

    lineNum++;
}

// convert coordinates for each line into a Set, to allow us to easily find intersection
var set1 = new Set(data.get(0).keys())
var set2 = new Set(data.get(1).keys())
var intersection =  new Set([...set1].filter(x => set2.has(x)));

// for those intersection tuples, find the distance from the center and then find the minimum
console.log("Part 1: " + Math.min(...[...intersection].map(i => Math.abs(i[0]) + Math.abs(i[1]))));

// for those intersection tuples, get the number of steps for each line (num of steps is the value for the intersection key within the map)
// then add them together and find the minimum
console.log("Part 2: " + Math.min(...[...intersection].map(i => data.get(0).get(i) + data.get(1).get(i))));
