const fs = require("fs");
const text = fs.readFileSync("input.txt").toString();
let arr = text.split("\n").map(Number);

// found this on the internet, can't remember where :/
var combinationSum1 = function (candidates, target) {
    const result = [];
    candidates.sort((b, a) => b - a);

    const helper = (rem, start, current) => {
        if (rem < 0) return;
        if (rem === 0) {
            result.push(current.slice());
            return;
        }

        for (let i = start; i < candidates.length; i++) {
            // if (i > start && candidates[i] === candidates[i - 1]) continue;
            current.push(candidates[i]);
            helper(rem - candidates[i], i + 1, current.slice());
            current.pop();
        }
    };

    helper(target, 0, []);

    return result;
};
// Driver Code

let sum = 150;

let ans = combinationSum1(arr, sum);
console.log(ans.length);

ans.sort((a, b) => a.length - b.length);
console.log(ans.filter((x) => x.length === ans[0].length).length);
