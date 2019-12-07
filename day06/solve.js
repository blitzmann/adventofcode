const fs = require('fs');
const path = require("path");
const arr = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString().split('\n').map(i => i.trim().split(')'));

// todo: re-write this entire thing in an actual graph library

// stores orbited object as key, and it's orbiting objects as an array of values
// This allows us to traverse the tree a little easier
// Format: {parent: [child, ...]
const map = new Map() 
// this keeps track of the liniear path back to COM (since each node only has 1 parent)
// Format: {child: parent}
const reverse = new Map()

for (let [from, to] of arr){
    let children = map.get(from)
    if (!children){
        children = []
        map.set(from, children)
    }
    
    children.push(to)
    reverse.set(to, from)
}

let i = 0;
function countOrbits(parent, num) {
    // num keeps track of how many orbits to get to this parent
    // i keeps track of total umber of orbits visited
    const children = map.get(parent);
    num++; // increment by one, since we've gone one step further in the tree
    i += num; // increate total number of orbits by num (because it's cumulative, not incremental, per node)
    
    if (!children) { return; } // nothing to do
    
    for(let child of children) { // for each child of this node, recurse
        countOrbits(child, num);
    }
}

// start at COM, -1 count
countOrbits("COM", -1)

console.log(`Part 1: ${i}`);

// Part two lends itself well to generating a Set representing the return path from a node back to COM
// we can thern intersect tweo of these sets to find the merge location, and then count how many 
// transfers from node to merge point
function returnToCom(node){
    const set = new Set();

    function recurse(node) {
        if (!node) {return}
        set.add(node)
        recurse(reverse.get(node))
    }
    recurse(reverse.get(node))
    return set
}

const s = returnToCom("SAN");
const y = returnToCom("YOU");
const intersection = new Set([...s].filter(x => y.has(x)));
const merge = Array.from(intersection)[0]
numS = Array.from(s).indexOf(merge)
numY = Array.from(y).indexOf(merge)

console.log(`Part 2: ${numS + numY}`)


