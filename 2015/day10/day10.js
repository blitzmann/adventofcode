const fs = require("fs");
const text = fs.readFileSync("input.txt").toString();

input = text;

// //--- original
// function say(input) {
//   return [input.length, input[0]];
// }

// function look(input) {
//   let thing = [];
//   do {
//     let startIdx = 0;
//     let endIdx = input.findIndex((x) => x !== input[0]);

//     if (endIdx === -1) {
//       endIdx = input.length;
//     }

//     let run = input.slice(startIdx, endIdx);
//     input = input.slice(endIdx);
//     thing.push(...say(run));
//   } while (input.length);

//   return thing;
// }

// for (let _ of Array.from({ length: 40 }).map((x, i) => i)) {
//   console.log(_, input);
//   input = look(input);
// }

// -- new, got this from... somewhere that I've forgotten now. Need to dig into it to find out the actual differences since it runs so much faster

function lookAndSay(start, n) {
  //   n += 1;
  // Base cases
  //   if (n == 1) return "1";
  //   if (n == 2) return "11";

  // Find n'th term by generating
  // all terms from 3 to n-1.
  // Every term is generated
  // using previous term

  // Initialize previous term
  let str = start;

  for (let i = 1; i <= n; i++) {
    // In below for loop, previous
    // character is processed in
    // current iteration. That is
    // why a dummy character is
    // added to make sure that loop
    // runs one extra iteration.
    str += "$";
    let len = str.length;

    // Initialize count
    // of matching chars
    let cnt = 1;

    // Initialize i'th
    // term in series
    let tmp = "";
    let arr = str.split("");

    // Process previous term
    // to find the next term
    for (let j = 1; j < len; j++) {
      // If current character
      // does't match
      if (arr[j] != arr[j - 1]) {
        // Append count of
        // str[j-1] to temp
        tmp += cnt + 0;

        // Append str[j-1]
        tmp += arr[j - 1];

        // Reset count
        cnt = 1;
      }

      // If matches, then increment
      // count of matching characters
      else cnt++;
    }

    // Update str
    str = tmp;
  }
  return str;
}

console.log(lookAndSay(text, 40).length);
console.log(lookAndSay(text, 50).length);
