const fs = require('fs');
const path = require("path");
const arr = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString().split('\n').map(i => i.trim().split(')'));

const origin = new Map()
const reverse = new Map()
let map = origin;

for (let c of arr){
    let thing = map.get(c[0])
    if (!thing){
        thing = []
        map.set(c[0], thing)
    }
    
    thing.push([c[1], c[0]])

    
        reverse.set(c[1], c[0])


}

let i = 0;
function count(parent, num){
    const children = map.get(parent);
    num += 1
    i += num;

    if (!children) {  return; }
    
    for(let [child, _] of children) {
        count(child, num);
    }
}

count("COM", -1)

console.log(`Part 1: ${i}`);

// function generateSet(node){
//     const set = new Set();

//     function recurse(node) {
//         set.add(node)
//         recurse(reverse.get(node))
//     }
//     recurse(reverse.get(node))
// }

// console.log(generateSet("SAN"))


