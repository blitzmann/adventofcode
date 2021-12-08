const fs = require("fs");
const text = (fs.readFileSync("input.txt")).toString();

input = text.split("\n").map(Number);

function countIncreasing(array){
    let increasing = 0;
    for (let i=1; i<array.length; i++){
        if (array[i] > array[i-1]){
            increasing++
        }
    }
    return increasing;
}

function* toWindows(inputArray, size) { 
    for(let index = 0; index+size <= inputArray.length; index++) {
      yield inputArray.slice(index, index+size);
    }
  }
  
console.log(countIncreasing(input))
console.log(countIncreasing(Array.from(toWindows(input, 3)).map(c=>c.reduce((a,b)=>a+b, 0))))