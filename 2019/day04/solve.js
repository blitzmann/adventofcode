const fs = require('fs');
const path = require("path");

const start = 146810,
    end = 612564,
    results = []

function calculateRules(number) {
    const parts = (number + start).toString().split('');
    const ret = {
        adjacent: false, // adjacent will be set to true if theres any adjacent digits
        doubles: false, // doubles will be set to true if the number matches the double rule (has at least 1 adjacent pair that isn't part of a larger set)
        increasing: true
    }

    // Checks for adjacent and doubles
    for (let i = 0; i < parts.length; i++) {
        const [digit1, digit2, digit3] = [parts[i], parts[i + 1], parts[i + 2]]
        if (digit1 === digit2) {
            ret.adjacent = true; // easy

            // we have found two adjacent digits, need to check if the next one is also the digit, in which case seek until we find a new digit
            if (digit3 && digit1 === digit3) {
                // set i to the next digit that isn't the same
                while (parts[i] === digit1) { // while the digit is the same, increase i
                    if (!parts[i + 1]) {
                        break // if we reach the end, break out of the while loop without increasing i
                    }
                    i++
                }
                // decrease i since it's always off by one. todo; fix the while loop to avoid this
                i--;
                continue; // continue the for loop, do no set doubles
            }

            // this should be set if we find that we have an adjacent pair that isn't part of a larger set (if it's part of a larger set, the loop is continue'd before this)
            ret.doubles = true;
            break; // we've found our doubles, break out
        }
    }

    // checks for increasing numbers
    for (let i = 1; i < parts.length; i++) {
        if (parseInt(parts[i]) < parseInt(parts[i - 1])) {
            ret.increasing = false;
        }
    }

    return ret
}


for (let number of Array(end - start).keys()) {
    results.push(calculateRules(number));
}

console.log(`Part 1: ${results.filter(r => r.increasing && r.adjacent).length}`)
console.log(`Part 2: ${results.filter(r => r.increasing && r.doubles).length}`)