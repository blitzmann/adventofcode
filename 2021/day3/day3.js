const fs = require("fs");
const text = (fs.readFileSync("input.txt")).toString();

input = text.split("\n").map(x=>x.trim());

let inputMatrix = input.map(x=>x.trim().split(""))

/**
 * Returns the most common element of an array
 * @param {*} arr 
 * @returns 
 */
function mode(arr){
    return arr.sort((a,b) =>
          arr.filter(v => v===a).length
        - arr.filter(v => v===b).length
    ).pop();
}

/**
 * Flips all bits in the given binary
 * @param {*} N 
 * @returns 
 */
const bitwiseComplement = (N) => {
    return parseInt(N.toString(2).replace(/[0-1]/g, (v) => (v == 1 ? 0 : 1)), 2);
};

// rotate to make it easier to deal with 
let rotated = inputMatrix[0].map((val, index) => inputMatrix.map(row => row[index]).reverse());

let gamma = parseInt(rotated.map(x=>mode(x)).join(""), 2)

let epsilon = bitwiseComplement(gamma)
console.log(gamma * epsilon)

// ---------------------- part 2

function oxygen(input, idx = 0) {
    let inputMatrix = input.map(x=>x.trim().split(""))
    let rotated = inputMatrix[0].map((val, index) => inputMatrix.map(row => row[index]).reverse());
    let count0 = rotated[idx].filter(x=>x==="0").length;
    let count1 = rotated[idx].filter(x=>x==="1").length;

    input = input.filter(x=>{
        if (count0 === count1) {
            return x.split("")[idx] === "1";
        } else {
            let test = count0 > count1 ? "0" : "1"
            return x.split("")[idx] === test;
        }
    })
    if (input.length === 1) {
        return parseInt(input[0], 2);
    }
  
    return oxygen(input, idx + 1)
}

let oxy = oxygen(input);


function scrubber(input, idx = 0) {
    let inputMatrix = input.map(x=>x.trim().split(""))
    let rotated = inputMatrix[0].map((val, index) => inputMatrix.map(row => row[index]).reverse());
    let count0 = rotated[idx].filter(x=>x==="0").length;
    let count1 = rotated[idx].filter(x=>x==="1").length;
    input = input.filter(x=>{
         if (count0 === count1) {
            return x.split("")[idx] === "0";
         } else {
            let test = count0 > count1 ? "1" : "0"
            return x.split("")[idx] === test;
         }
    })
    if (input.length === 1) {
        return parseInt(input[0], 2);
    }
  
    return scrubber(input, idx + 1)
}

console.log(oxygen(input)*scrubber(input))
