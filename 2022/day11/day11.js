const fs = require("fs");
const text = fs.readFileSync("input.txt").toString();

const monkeys = text.split("\r\n\r\n");

let monkeyMap = new Map();

for (let monkeyStr of monkeys) {
    const regex =
        /Monkey (\d+).+Starting items:(( \d+,?)*).+Operation: new = (.+)Test: divisible by (\d+).+If true: throw to monkey (\d+).+If false: throw to monkey (\d+)/gims;
    m = regex.exec(monkeyStr);
    let [_, monkeyNum, items, _2, op, test, trueMonkey, falseMonkey] = m;

    monkeyMap.set(+monkeyNum, {
        monkey: +monkeyNum,
        items: items.split(",").map(Number),
        op: op.trim(),
        test: +test,
        trueMonkey: +trueMonkey,
        falseMonkey: +falseMonkey,
        total: 0,
    });
}

divisors = [...monkeyMap.values()].map((x) => x.test);
trueDivisor = divisors.reduce((a, b) => a * b, 1);
for (let i = 0; i < 10000; i++) {
    for (let monkey of monkeyMap.values()) {
        while (monkey.items.length > 0) {
            let old = monkey.items.shift();
            let newVal = eval(monkey.op);
            // newVal = Math.floor(newVal / 3);
            newVal = newVal % trueDivisor;

            let otherMonkey = monkeyMap.get(
                newVal % monkey.test === 0
                    ? monkey.trueMonkey
                    : monkey.falseMonkey
            );

            otherMonkey.items.push(newVal);
            monkey.total += 1;
        }
    }
}

console.log(
    [...monkeyMap.values()]
        .map((x) => x.total)
        .sort((a, b) => b - a, 0)
        .splice(0, 2)
        .reduce((a, b) => a * b, 1)
);
