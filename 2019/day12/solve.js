const fs = require('fs');
const path = require("path");
const input = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString().split('\n');
const Combinatorics = require('js-combinatorics');
const tuple = require("immutable-tuple").tuple;

class Moon {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;

        this.origX = x;
        this.origY = y;
        this.origZ = z;

        this.velocityX = 0;
        this.velocityY = 0;
        this.velocityZ = 0;
    }

    _applyGravityAxis(moon, axis) {
        if (this[axis] < moon[axis]) {
            this[`velocity${axis.toUpperCase()}`]++;
            moon[`velocity${axis.toUpperCase()}`]--;
        } else if (this[axis] > moon[axis]) {
            this[`velocity${axis.toUpperCase()}`]--;
            moon[`velocity${axis.toUpperCase()}`]++;
        }
    }

    reset() {
        this.x = this.origX;
        this.y = this.origY;
        this.z = this.origZ;

        this.velocityX = 0;
        this.velocityY = 0;
        this.velocityZ = 0;
    }
    applyGravity(moon) {
        this._applyGravityAxis(moon, "x")
        this._applyGravityAxis(moon, "y")
        this._applyGravityAxis(moon, "z")
    }

    applyVelocity() {
        this.x += this.velocityX
        this.y += this.velocityY
        this.z += this.velocityZ
    }

    get potentialEnergy() {
        return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z)
    }

    get kineticEnergy() {
        return Math.abs(this.velocityX) + Math.abs(this.velocityY) + Math.abs(this.velocityZ)
    }

    get totalEnergy() {
        return this.potentialEnergy * this.kineticEnergy;
    }

    get state() {
        return this.repr()//tuple(this.x, this.y, this.z, this.velocityX, this.velocityY, this.velocityZ)
    }

    repr() {
        var r = `pos=<x=${this.x}, y=${this.y}, z=${this.z}>, vel=<x=${this.velocityX}, y=${this.velocityY}, z=${this.velocityZ}>`;
        return r;
    }
}

const moons = [];
for (let line of input) {
    const regex = /<x=(.*), y=(.*), z=(.*)>/gm;
    let [_, ...rest] = regex.exec(line)
    rest = rest.map(Number)
    moons.push(new Moon(...rest))
}

const pairs = Combinatorics.combination(moons, 2).toArray();

function timeStep() {
    for (let [m1, m2] of pairs) {
        m1.applyGravity(m2);
    }

    moons.forEach(m => m.applyVelocity())
}
for (let i = 0; i < 1000; i++) {
    timeStep();
}

console.log(`Part 1: ${moons.reduce((a, b) => a + b.totalEnergy, 0)}`)

// todo: find period on each dimention (x/velocityX), then extrapolate from there

// const map = new Map();
// moons.forEach(m => { m.reset(); map.set(m, new Set()) })
// moons.forEach(m => map.get(m).add(m.state)) // add initial state

// let i = 0;
// while (true) {
//     timeStep();
//     // check for previous steps
//     if (moons.every(m=>map.get(m).has(m.state))){
//         break;
//     }
//     moons.forEach(m => map.get(m).add(m.state))
//     i++
// }
// console.log(`Part 2: ${i}`)

