const fs = require("fs");
const text = fs.readFileSync("input.txt").toString();

input = text
  .split("\n")
  .map((x) => x.trim())
  .map((c) => c.split(" | ").map((x) => x.split(" ")));

part1 = 0;
for (let [_, output] of input) {
  part1 += output
    .map((x) => x.split("").length)
    .filter((x) => x == 7 || x == 4 || x == 2 || x == 3).length;
}

console.log(part1);

//--------
/*
  0:      1:      2:      3:      4:
 aaaa    ....    aaaa    aaaa    ....
b    c  .    c  .    c  .    c  b    c
b    c  .    c  .    c  .    c  b    c
 ....    ....    dddd    dddd    dddd
e    f  .    f  e    .  .    f  .    f
e    f  .    f  e    .  .    f  .    f
 gggg    ....    gggg    gggg    ....

  5:      6:      7:      8:      9:
 aaaa    aaaa    aaaa    aaaa    aaaa
b    .  b    .  .    c  b    c  b    c
b    .  b    .  .    c  b    c  b    c
 dddd    dddd    ....    dddd    dddd
.    f  e    f  .    f  e    f  .    f
.    f  e    f  .    f  e    f  .    f
 gggg    gggg    ....    gggg    gggg
*/

// Primary mapping is the default notation for the segments. We will convert each displays mapping to this primary mapping to determine what the integer is
let primaryMapping = new Map([
  ["abcefg", 0],
  ["cf", 1],
  ["acdeg", 2],
  ["acdfg", 3],
  ["bcdf", 4],
  ["abdfg", 5],
  ["abdefg", 6],
  ["acf", 7],
  ["abcdefg", 8],
  ["abcdfg", 9],
]);

let part2 = 0;
for (let [digits, output] of input) {
  digits = digits.map((x) => new Set(x.split("")));

  let one = new Set(digits.find((x) => x.size === 2));
  let seven = new Set(digits.find((x) => x.size === 3));
  let four = new Set(digits.find((x) => x.size === 4));
  let eight = new Set(digits.find((x) => x.size === 7));

  let a;
  let b;
  let c;
  let d;
  let e;
  let f;
  let g;

  // whatever is in 7 that isn't in 1 is "a"
  a = [...seven].filter((x) => !one.has(x))[0];

  // 0, 9, and 6 all have 6 segments, however 6 is mising c. We can use known values for "1" to determine which one is missing.
  for (let test of digits.filter((x) => x.size === 6)) {
    let test2 = [...test].filter((x) => one.has(x));
    if (test2.length === 1) {
      // found the one that should be assigned to f
      f = test2[0];
      // and now that we know f, we can get c
      c = [...one].filter((x) => x !== test2[0])[0];
      break;
    }
  }

  // at this point we fully know 1, 7
  // try to determine d by using known values for 4.
  // test with 0, 9, and 6 again
  for (let test of digits.filter((x) => x.size === 6)) {
    // this is 6, don't need it
    if (!test.has(c)) {
      continue;
    }
    // check if it's 9 by checking if it has all the same parts as 4
    if ([...four].filter((x) => !test.has(x)).length === 0) {
      continue;
    }
    // this is "0", get things in 4 that aren't in test... this will be d
    d = [...four].filter((x) => !test.has(x))[0];
    break;
  }

  // find g in "3"
  for (let test of digits.filter((x) => x.size === 5)) {
    if (
      test.has(a) &&
      test.has(c) &&
      test.has(d) &&
      test.has(f) &&
      !test.has(b)
    ) {
      // found '3'
      g = [...test].filter((x) => ![a, c, d, f].includes(x))[0];
      break;
    }
  }

  // find e
  for (let test of digits.filter((x) => x.size === 5)) {
    // found '2'
    if (
      test.has(a) &&
      test.has(c) &&
      test.has(d) &&
      !test.has(f) &&
      test.has(g)
    ) {
      e = [...test].filter((x) => ![a, c, d, g].includes(x))[0];
      break;
    }
  }

  // find b
  b = [...eight].filter((x) => ![a, c, d, e, f, g].includes(x))[0];
  let mapping = new Map([
    [a, "a"],
    [b, "b"],
    [c, "c"],
    [d, "d"],
    [e, "e"],
    [f, "f"],
    [g, "g"],
  ]);

  // convert output digits to their primary mapping, and then to the primary mappings integer, and finally join them together and parse as int
  let outputInt = parseInt(
    output
      .map((x) =>
        x
          .split("")
          .map((y) => mapping.get(y))
          .sort()
      )
      .map((x) => primaryMapping.get(x.join("")).toString())
      .join("")
  );
  part2 += outputInt;
}
console.log(part2);
