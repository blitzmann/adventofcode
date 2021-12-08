const fs = require("fs");
const text = (fs.readFileSync("input.txt")).toString();


class Line {
    constructor(pointsArr) {
        this.from = {
            x: pointsArr[0][0],
            y: pointsArr[0][1]
        }
        
        this.to = {
            x: pointsArr[1][0],
            y: pointsArr[1][1]
        }
    }
    
    get isDiagonal(){
        return this.from.x != this.to.x && this.from.y != this.to.y
    }

    producePoints() {
        if (!this.isDiagonal) {
            // find which axis is the same
            let sameAxis = this.from.x == this.to.x ? "x" : "y"
            let diffAxis = sameAxis === "x" ? "y" : "x"

            let range = Math.abs(this.from[diffAxis] - this.to[diffAxis]) + 1
            return Array.from({length: range}, (x, i) => i + Math.min(this.from[diffAxis], this.to[diffAxis]))
                        .map(x=>sameAxis === "x" ? [this.from[sameAxis], x] : [x, this.from[sameAxis]])
        } else {
            // since diagonal is known to be 45deg, we can find the range for one axis, and then assume we're 
            // always going to be +- 1 to the each axis based on which direction it's going
            let range = Math.abs(this.from.x - this.to.x) + 1
            return Array.from({length: range}, (x, i) => i)
                        .map(i => [this.from.x < this.to.x ? this.from.x + i : this.from.x - i , this.from.y < this.to.y ? this.from.y + i : this.from.y - i])
        }
    }
}

input = text.split("\n").map(x=>x.trim().split(" -> ").map(y=>y.split(",").map(Number))).map(x=>new Line(x));
let floor = new Map()

for (let line of input.filter(x=>!x.isDiagonal)){
    for(let point of line.producePoints()){
        const key = `${point[0]},${point[1]}`
        if (!floor.has(key)) {
            floor.set(key, 1)
        } else {
            floor.set(key, floor.get(key)+1)
        }
    }
}

console.log([...floor.values()].filter(x=>x>1).length)


floor.clear()

for (let line of input){
    for(let point of line.producePoints()){
        const key = `${point[0]},${point[1]}`
        if (!floor.has(key)) {
            floor.set(key, 1)
        } else {
            floor.set(key, floor.get(key)+1)
        }
    }
}

console.log([...floor.values()].filter(x=>x>1).length)
