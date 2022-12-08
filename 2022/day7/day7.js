const { DiffieHellmanGroup } = require("crypto");
const fs = require("fs");
const { consumers } = require("stream");
const text = fs.readFileSync("input.txt").toString();

const lines = text.split("\r\n");
lines.shift();
const root = {
    name: "/",
    type: "dir",
    children: [], // only if dir type
    parent: null,
};

let cd = root;
for (let line of lines) {
    if (line.startsWith("$")) {
        let [_, cmd, opts] = line.split(" ");
        if (cmd === "cd") {
            if (opts === "..") {
                cd = cd.parent;
            } else if (opts === "/") {
                cd = root;
            } else {
                // find directory, otherwise create it (unsure if creating it is necessary)
                let dir = cd.children.find(
                    (x) => x.type === "dir" && x.name === opts
                );
                if (dir === null) {
                    dir = {
                        name: opts,
                        parent: cd,
                        children: [],
                        type: "dir",
                    };
                    cd.children.push(dir);
                }
                cd = dir;
            }
        }
    } else {
        let [a, b] = line.split(" ");
        if (a === "dir") {
            cd.children.push({
                name: b,
                parent: cd,
                children: [],
                type: "dir",
            });
        } else {
            cd.children.push({
                name: b,
                parent: cd,
                type: "file",
                size: +a,
            });
        }
    }
}

function calculateDirSizes(dir) {
    let unknownDirs = dir.children.filter((x) => x.type === "dir" && !x.size);
    for (let uDir of unknownDirs) {
        calculateDirSizes(uDir);
    }
    // by here directories should be accounted for
    dir.size = dir.children.reduce((a, b) => a + b.size, 0);
}

calculateDirSizes(root);

function findOfSize(dir, maxSize) {
    dirs = [];
    if (dir.size <= maxSize) {
        dirs.push(dir);
    }

    for (let sdir of dir.children.filter((x) => x.type === "dir")) {
        dirs = [...dirs, ...findOfSize(sdir, maxSize)];
    }
    return dirs;
}

console.log(findOfSize(root, 100000).reduce((a, b) => a + b.size, 0));

const total = 70000000;
const need = 30000000;

let diff = total - root.size;

function flat(dir) {
    arr = [dir];
    for (let adir of dir.children.filter((x) => x.type === "dir")) {
        arr = [...arr, ...flat(adir)];
    }

    return arr;
}

const flattened = flat(root);

console.log(
    flattened
        .filter((x) => x.size >= need - diff)
        .sort((a, b) => a.size - b.size)[0].size
);
