const fs = require("fs");
const text = fs.readFileSync("input.txt").toString();

let presentTarget = parseInt(text);

let i = 1;
// probably a way to memoize some of this stuff, probably to pre-calculate all the houses the elfs visit
// (like sieve of eratosthenes for primes) up to target number, or do something simple with combinatorics that I don't know ;(...?

// These two (part 1 and 2) take wayyyyyyy too long, a couple of hours.
//part 1
// while (true) {
//     let sumPresents = 0;
//     for (let elf = 1; elf <= i; elf++) {
//         if (i % elf === 0) {
//             sumPresents += elf * 10;
//         }
//     }

//     if (i % 10000 == 0) {
//         console.log(`House ${i} got ${sumPresents}`);
//     }
//     if (sumPresents >= presentTarget) {
//         break;
//     }
//     i++;
// }

console.log(`Answer: House ${i}`);

// part 2
let elfMap = new Map();
let elfDone = new Set();

while (true) {
    let sumPresents = 0;
    for (let elf = 1; elf <= i; elf++) {
        if (elfDone.has(elf)) continue;

        if (i % elf === 0) {
            sumPresents += elf * 11;
            numHouses = elfMap.get(elf) || 0;
            numHouses++;
            elfMap.set(elf, numHouses);
            if (numHouses == 50) {
                elfDone.add(elf);
                elfMap.delete(elf);
            }
        }
    }

    if (i % 10000 == 0) {
        console.log(`House ${i} got ${sumPresents}`);
    }

    if (sumPresents >= presentTarget) {
        break;
    }
    i++;
}

console.log(`Answer: House ${i}`);
