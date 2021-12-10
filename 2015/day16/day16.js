const fs = require("fs");
const text = fs.readFileSync("input.txt").toString();

let giftProperties = new Map([
  ["children", 3],
  ["cats", 7],
  ["samoyeds", 2],
  ["pomeranians", 3],
  ["akitas", 0],
  ["vizslas", 0],
  ["goldfish", 5],
  ["trees", 3],
  ["cars", 2],
  ["perfumes", 1],
]);

class Sue {
  constructor(text) {
    let m = text.match(/Sue (\d+): (.+)/);
    this.number = Number(m[1]);
    this.properties = new Map(
      m[2]
        .split(",")
        .map((x) => x.split(":"))
        .map((x) => [x[0].trim(), Number(x[1])])
    );
  }

  get matchesGift() {
    for (let [prop, val] of this.properties.entries()) {
      if (giftProperties.get(prop) !== val) {
        return false;
      }
    }
    return true;
  }
  get matchesGiftUpdated() {
    for (let [prop, val] of this.properties.entries()) {
      if (["cats", "trees"].includes(prop)) {
        if (!(giftProperties.get(prop) < val)) {
          return false;
        }
      } else if (["pomeranians", "goldfish"].includes(prop)) {
        if (!(giftProperties.get(prop) > val)) {
          return false;
        }
      } else if (giftProperties.get(prop) !== val) {
        return false;
      }
    }
    return true;
  }
}
input = text.split("\r\n").map((x) => new Sue(x));

console.log(input.find((x) => x.matchesGift).number);
console.log(input.find((x) => x.matchesGiftUpdated).number);
