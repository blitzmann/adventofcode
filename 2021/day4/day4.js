const fs = require("fs");
const text = (fs.readFileSync("input.txt")).toString();

input = text.split("\r\n\r\n");

class BingoBoard {
    constructor(board) {
        this.board = board
        // rotate the matrix so that rows repressent the columns, makes it easier to check for bingo
        this.boardRotated = board[0].map((val, index) => board.map(row => row[index]).reverse());
        this.numbers = new Set()
        this.won = false;
    }

    apply(num){
        this.numbers.add(num)
        let bingo = this.bingo;
        if (bingo) {
            this.won = true;
        }
        return bingo
    }

    get bingo() {
        for (let check of this.checks) {
            if (check.every(x=>this.numbers.has(x))){
                return true;
            }
        }
        return false;
    }

    get sumUnmarked(){
        return this.board.flat().filter(x=>!this.numbers.has(x)).reduce((a,b)=>a+b, 0)
    }

    get checks(){
        return this.board.concat(this.boardRotated);
    }
}

let calledNumbers = input.shift().split(",").map(Number)
let boards = input.map(x=>x.split("\n").map(y=>y.trim().split(/\s+/).map(Number))).map(x=>new BingoBoard(x))

function part1(){
    for (let num of calledNumbers){
        for(let board of boards){
            if (board.apply(num)) {
                return board.sumUnmarked * num
            }
        }
    }
}

console.log(part1())

function part2(){
    let inPlay = [...boards];
    for (let num of calledNumbers){
        for(let board of inPlay){
            board.apply(num)
        }
        check = inPlay.filter(x=>!x.won);
        if (check.length === 0) {
            return inPlay[0].sumUnmarked * num
        }
        inPlay = check
    }
}
console.log(part2())