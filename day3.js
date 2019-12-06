const fs = require('fs');
const assert = require('assert');

if (require.main === module) {
    // const input = fs.readFileSync('day3_input.txt', 'utf8');
    const input = "R8,U5,L5,D3\nU7,R6,D4,L4\n"
    findNearestIntersection(input);
}

function findNearestIntersection(input) {
    const [first, second] = input.trim().split("\n");
    console.log("a, b", first, second)
    const wireA = parseWireInfo(first);
    const wireB = parseWireInfo(second);
    console.log("parsed", wireA, wireB)
}

function intersects(segA, segB) {

}

function parseWireInfo(wire) {
    const codes = wire.split(",");
    const segments = [];
    let [x, y] = [0, 0];
    for (code of codes) {
        const [dir, ...rest] = code.split("");
        const mag = parseInt(rest.join());
        switch (dir) {
            case 'U':
                y += mag;
                break;
            case 'D':
                y -= mag;
                break;
            case 'L':
                x -= mag;
                break;
            case 'R':
                x += mag;
                break;
            default:
                throw new Error("unknown direction");
        }
        segments.push([x, y]);
    }
    return segments;
}


