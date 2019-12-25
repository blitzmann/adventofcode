const fs = require('fs');
const path = require("path");
const input = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString();

const IntCode = require('../intCode')

Array.prototype.chunk = function (chunkSize) {
    var R = [];
    for (var i = 0; i < this.length; i += chunkSize)
        R.push(this.slice(i, i + chunkSize));
    return R;
}

class Computer {
    constructor(netAddr) {
        this.program = new IntCode(input);
        this.program.Run(netAddr);
        this.inputQueue = [];
    }

    Recieve(packet) {
        this.inputQueue.push(packet);
    }

    Run() {
        this.program.clearOutputs();
        const packet = this.inputQueue.shift();

        if (!packet) {
            this.program.Run(-1)
            return -1;
        } else {
            this.program.Run(packet[0])
            this.program.Run(packet[1])
        }
        return this.program.outputs;

    }
}

class NAT {

    constructor(network) {
        this.packet = null
        this.network = network;
    }

    Recieve(packet) {
        if (!this.packet) {
            console.log(`Part 1: ${packet[1]}`)
        }
        this.packet = packet
    }

    Defib() {
        if (this.lastPacketTransmitted && this.lastPacketTransmitted[1] === this.packet[1]) {
            console.log(`Part 2: ${this.packet[1]} `)
            return -1;
        }
        this.lastPacketTransmitted = this.packet
        network[0].Recieve(this.packet)
    }
}

const network = [];

for (let x of Array(50).keys()) {
    const computer = new Computer(x);
    network.push(computer);
}

const nat = new NAT(network);

function doThing() {
    while (true) {
        let isIdle = true;
        for (let computer of network) {
            if (computer.Run() !== -1) {
                isIdle = false;
            }
            for (let [dest, x, y] of computer.program.outputs.chunk(3)) {
                if (dest === 255) {
                    nat.Recieve([x, y])
                } else {
                    network[dest].Recieve([x, y])
                }
            }
        }
        if (isIdle) {
            if (nat.Defib() === -1) {
                return;
            }
        }
    }
}

doThing()
