const fs = require("fs");
const text = (fs.readFileSync("input.txt")).toString();

let input = text.split("\r\n\r\n");
coords = input[0].trim().split("\r\n").map(x=>x.split(",").map(Number))
folds = input[1].trim().split("\r\n").map(x=>{
    let m = x.match(/fold along (y|x)=(\d+)/);
    return [m[1], +m[2]];
})

maxX = Math.max(...coords.map(x=>x[0]))
maxY = Math.max(...coords.map(x=>x[1]))

paper = Array.from(Array(maxY+1), () => new Array(maxX+1).fill(false))

for(let [x, y] of coords){
    paper[y][x] = true;
}

function printPaper(paper){
    for (let x in paper){
        console.log(paper[x].map(x=>x ? "#" : " ").join(""))
    }
    console.log()
}

function foldY(y) {
    top = paper.slice(0, y)
    bottom = paper.slice(y+1).reverse()
    let offset = top.length - bottom.length;    
    for (let y in bottom) {
        y = +y
        for (let x in bottom[y]) {
            x = +x
            if (bottom[y][x]) {
                top[y+offset][x] = true;
            }
        }    
    }
    paper = top
} 

function foldX(x) {
    paper = paper.map(line => {
        left = line.slice(0,x)
        foldLine = line.slice(x, x+1)
        right = line.slice(x+1).reverse()
        let offset = left.length - right.length
        for(let x in right){
            if (right[+x]){
                left[+x+offset] = true
            }
        }

        return left;
    })
} 

function part1 (){
    for(let [dir, num] of folds.slice(0, 1)){
        if (dir === "y"){
            foldY(num)
        }
        else {
            foldX(num)
        }
    }

    console.log(paper.flat(1).filter(Boolean).length)
}

part1()

paper = Array.from(Array(maxY+1), () => new Array(maxX+1).fill(false))
for(let [x, y] of coords){
    paper[y][x] = true;
}

function part2 (){
    for(let [dir, num] of folds){
        if (dir === "y"){
            foldY(num)
        }
        else {
            foldX(num)
        }
    }

    printPaper(paper)    
}
part2()

