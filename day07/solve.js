const fs = require('fs');
const path = require("path");
const arr = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString();

const IntCode = require('../intCode')

// Thanks stack overflow!
// https://stackoverflow.com/a/43260158
function perm(xs) {
    let ret = [];

    for (let i = 0; i < xs.length; i = i + 1) {
        let rest = perm(xs.slice(0, i).concat(xs.slice(i + 1)));

        if (!rest.length) {
            ret.push([xs[i]])
        } else {
            for (let j = 0; j < rest.length; j = j + 1) {
                ret.push([xs[i]].concat(rest[j]))
            }
        }
    }
    return ret;
}

let max = 0;
for (let phase of perm([0, 1, 2, 3, 4])) {
    const amps = []

    // initialize amps
    for (let i of Array(5).keys()) {
        amps[i] = new IntCode(arr).Run(phase[i])
    }

    // r will store the previous runs output
    // For each amp, feed it the previous value
    let r = 0;
    for (let amp of amps) {
        amp.Run(r)
        r = amp.last
    }

    if (r > max) {
        max = r
    }
}

console.log(`Part 1 ${max}`)

// this is done the same way, only we have a loop within the loop that will continue until the program halts
max = 0; // reset max
for (let phase of perm([5, 6, 7, 8, 9])) {

    const amps = []
    // initialize amps
    for (let i of Array(5).keys()) {
        amps[i] = new IntCode(arr)
        amps[i].Run(phase[i])
    }

    let r = 0;
    // do a while loop until one of them halts
    for (let i = 0; true; i++) {
        amp = amps[i % amps.length];
        ampCont = amp.Run(r);
        r = amp.last

        if (i % amps.length === amps.length - 1 && !ampCont) {
            break
        }
    }

    if (r > max) {
        max = r
    }

}

console.log(`Part 2 ${max}`)
