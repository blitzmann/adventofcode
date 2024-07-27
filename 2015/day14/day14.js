const fs = require("fs");
const text = fs.readFileSync("input.txt").toString();


const regex = /(\w+) can fly (\d+) km\/s for (\d+) seconds, but then must rest for (\d+) seconds./gm;
let data = []
let m;

while ((m = regex.exec(text)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
        regex.lastIndex++;
    }
    
    matches = Array.from(m)
    matches.shift()
    data.push(matches)
}

console.log(data)

function part1(seconds){
  let results = []
  for(let [name, speed, fly, rest]  of data){
    let numFullIter = Math.floor(seconds / (+fly + +rest))
    let remainingSeconds = Math.min(+fly, seconds-(numFullIter*(+fly + +rest)))
    let fullSeconds = (+fly * numFullIter) + remainingSeconds
    let distance = +speed * fullSeconds
    results.push(distance)
  }

  return Math.max(...results)
}

console.log(part1(2503))