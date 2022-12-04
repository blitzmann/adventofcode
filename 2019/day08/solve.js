const fs = require('fs');
const path = require("path");
const input = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString();

// https://stackoverflow.com/a/10284006
function zip(arrays) {
    return arrays[0].map(function (_, i) {
        return arrays.map(function (array) { return array[i] })
    });
}

Array.prototype.chunk = function (chunkSize) {
    var R = [];
    for (var i = 0; i < this.length; i += chunkSize)
        R.push(this.slice(i, i + chunkSize));
    return R;
}

function processData(x, y) {
    const inputArr = input.split("").map(Number);

    // number of layers is simply determined by deviding total length of input by the expected resolution of the image
    const numLayers = inputArr.length / (x * y);

    let min0,
        min0Layer,
        layers = [];

    // create a loop for the number of expected layers
    for (let i = 0; i < numLayers; i++) {
        // layer would be the subset of the input array using the current index of layer
        const layer = inputArr.slice(i * (x * y), (i + 1) * (x * y));
        layers.push(layer);
        const num0 = layer.filter(x => x === 0).length

        if (!min0 || num0 < min0) {
            min0 = num0
            min0Layer = layer
        }
    }

    console.log(`Part 1: ${min0Layer.filter(x => x === 1).length * min0Layer.filter(x => x === 2).length}`)

    // so far we've been able to work with data per-layer, but now we need to compare each pixels at every layer.
    // To do this easily, we can zip the various layers, which will produce 1 array for each pixel, the array 
    // being that pixels value for each layer in order.
    const zipped = zip(layers)

    // we store the effective pixel values in this array
    const resultArray = []
    for (var pixelLayers of zipped) {
        // .find() will find the first value that isn't transparent
        resultArray.push(pixelLayers.find(t => t !== 2))
    }

    // we need to chunk the results array to produce a 2 d array. Use the width of the image as the chunk size
    const chunked = resultArray.chunk(x)

    console.log("Part 2:")
    for (let chunk of chunked) {
        line = ""
        for (let pixel of chunk) {
            line += pixel === 0 ? ' ' : '#';
        }
        console.log(line)
    }
}

processData(25, 6)