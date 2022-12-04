const fs = require('fs');
const path = require("path");
const input = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString();

const tuple = require("immutable-tuple").tuple;
const IntCode = require('../intCode')

var count = 0
firstYOf100 = 0
threshold = 100 // x 6
var setPoints = new Set();

// improvements: check the bounding box, rather than the entire box
// remove all x if it's it's not found
function doThings(points) {
    // get closest
    closest = Array.from(points).sort((a, b) => a[0] > b[0] ? 1 : 0).sort((a, b) => a[1] > b[1] ? 1 : 0)[0]

    // from the closest, iterate through threshold. if we don't have it, kill
    for (var dx = closest[0]; dx < closest[0] + threshold; dx++) { // x then y, performance
        for (var dy = closest[1]; dy < closest[1] + threshold; dy++) {
            if (!points.has(tuple(dx, dy))) {
                // does not have
                points.forEach(function(point){
                    if (point[1] == dy ||point[0] == dx) {
                      points.delete(point);
                    }
                  });
                return -1 // todo: remove from set all from y
            }
        }
    }
    return closest;
}

defaultX = 0
function start() {

    for (var y = 0; y < 5000; y++) {
        var string = ""
        var countOfLine = 0
        hasSeen = false;
        var firstX = undefined
        for (var x = defaultX; x < 5000; x++) {
            var program = new IntCode(input);
            program.Run(x)
            program.Run(y)

            if (program.last == 1) {
                if (!firstX) {
                    firstX = x
                }
                hasSeen = true
                count++
                countOfLine++
                if (countOfLine >= threshold) {
                    setPoints.add(tuple(x, y))
                    if (!firstYOf100) {
                        firstYOf100 = y
                    }
                }
            } else if (hasSeen){
                // already seen the end of this line
                // can also try to limit the starting y coord as well
                break;
            }

            string += program.last == 1 ? "#" : "."

        }

        if (firstX){
            defaultX = firstX
        }

        if (firstYOf100 && y >= firstYOf100 + threshold) {
            // start determining if the points work
            ret = doThings(setPoints)
            if (ret != -1) {
                return ret;
            }

        }
        console.log(y)
        // console.log(string, countOfLine)
    }
}

console.log(start())
