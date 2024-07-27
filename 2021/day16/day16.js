const fs = require("fs");
const text = fs.readFileSync("input.txt").toString();

let binary = text
    .split("")
    .map((x) => parseInt(x, 16).toString(2).padStart(4, 0))
    .join("");

class Packet {
    subPackets = [];

    constructor(givenBits) {
        this.givenBits = givenBits;
    }

    parse() {
        let remaining = this.givenBits;
        this.version = parseInt(remaining.substring(0, 3), 2);
        this.typeID = parseInt(remaining.substring(3, 6), 2);
        remaining = remaining.substring(6);

        if (this.typeID === 4) {
            // literal value, we need to chunk the remaining and go until we have a stop condition
            let chunks = chunk(remaining.split(""), 5);
            let acc = [];
            for (let chunk of chunks) {
                let firstBit = chunk.shift();
                acc.push(...chunk);
                if (firstBit === "0") {
                    break;
                }
            }
            this.value = parseInt(acc.join(""), 2);
            // reduce remaining by number of chunks we processsed
            remaining = remaining.substring((acc.length / 4) * 5);
        } else {
            // operator
            this.lengthTypeID = remaining.substring(0, 1);
            if (this.lengthTypeID === "0") {
                // next 15 bits determins how many bits we parse
                let bits = parseInt(remaining.substring(1, 16), 2);
                let toParse = remaining.substring(16, 16 + bits);

                do {
                    let newPacket = new Packet(toParse);
                    this.subPackets.push(newPacket);
                    toParse = newPacket.parse();
                } while (toParse.length > 0);

                remaining = remaining.substring(16 + bits);
            }
            if (this.lengthTypeID === "1") {
                // next 11 bits determines how many sub packets
                let numPackets = parseInt(remaining.substring(1, 12), 2);
                remaining = remaining.substring(12);
                // loop
                for (let i = 0; i < numPackets; i++) {
                    let newPacket = new Packet(remaining);
                    this.subPackets.push(newPacket);
                    remaining = newPacket.parse();
                }
            }

            if (this.typeID === 0) {
                this.value = this.subPackets
                    .map((x) => x.value)
                    .reduce((a, b) => a + b, 0); // sum packet
            }
            if (this.typeID === 1) {
                this.value = this.subPackets
                    .map((x) => x.value)
                    .reduce((a, b) => a * b, 1); // product packet
            }
            if (this.typeID === 2) {
                this.value = Math.min(...this.subPackets.map((x) => x.value));
            }
            if (this.typeID === 3) {
                this.value = Math.max(...this.subPackets.map((x) => x.value));
            }
            if (this.typeID === 5) {
                this.value =
                    this.subPackets[0].value > this.subPackets[1].value ? 1 : 0;
            }
            if (this.typeID === 6) {
                this.value =
                    this.subPackets[0].value < this.subPackets[1].value ? 1 : 0;
            }
            if (this.typeID === 7) {
                this.value =
                    this.subPackets[0].value == this.subPackets[1].value
                        ? 1
                        : 0;
            }
        }
        return remaining;
    }
}

function chunk(arr, n) {
    return Array.from(Array(Math.ceil(arr.length / n)), (_, i) =>
        arr.slice(i * n, i * n + n)
    );
}

let rootPacket = new Packet(binary);
rootPacket.parse();

// count versions
function countVersions(packet) {
    return (
        packet.version +
        packet.subPackets
            .map((x) => countVersions(x))
            .reduce((a, b) => a + b, 0)
    );
}
console.log(countVersions(rootPacket));
console.log(rootPacket.value);
