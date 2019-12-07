const fs = require('fs');
const assert = require('assert');

if (require.main === module) {
    test("R8,U5,L5,D3\nU7,R6,D4,L4\n", 6);
    test("R75,D30,R83,U83,L12,D49,R71,U7,L72\nU62,R66,U55,R34,D71,R55,D58,R83", 159);

    const input = fs.readFileSync('day3_input.txt', 'utf8');
    const closest = findNearestIntersection(input);
    console.log("closest", closest);
}

function test(input, expected) {
    const actual = findNearestIntersection(input);
    assert.strictEqual(actual, expected);
}

function findNearestIntersection(input) {
    const [first, second] = input.trim().split("\n");
    const wireA = parseWireInfo(first);
    const wireB = parseWireInfo(second);

    let closestIntersection = [0, 0];
    let closestDist = undefined;
    for (let i = 0; i < wireA.length; i++) {
        for (let j = i; j < wireB.length; j++) {
            const intersection = intersects(wireA[i], wireB[j]);
            if (!intersection) continue;
            
            const [x, y] = intersection;
            if (x === 0 && y === 0) continue;
            const dist = Math.abs(x) + Math.abs(y);
            if (closestDist === undefined || dist < closestDist) {
                closestIntersection = intersection;
                closestDist = dist;
            }
        }
    }
    return closestDist;
}

// a and b are segments from parseWireInfo
function intersects(a, b) {
    if ((a.h && b.h) || (a.v && b.v)) return;

    const h = a.h ? a : b;
    const v = a.v ? a : b;
    const hasIntersection = (h.y >= v.ymin && h.y <= v.ymax) 
        && (v.x >= h.xmin && v.x <= h.xmax);
    if (hasIntersection) {
        return [v.x, h.y];
    }
}

function parseWireInfo(wire) {
    const codes = wire.split(",");
    const segments = [];
    let [x, y] = [0, 0];
    for (code of codes) {
        const [dir, ...rest] = code.split("");
        const mag = parseInt(rest.join(""));
        switch (dir) {
            case 'U':
                segments.push({x, ymin: y, ymax: y+mag, v: true, debug: code});
                y += mag;
                break;
            case 'D':
                segments.push({x, ymin: y-mag, ymax: y, v: true, debug: code});
                y -= mag;
                break;
            case 'L':
                segments.push({y, xmin: x-mag, xmax: x, h: true, debug: code});
                x -= mag;
                break;
            case 'R':
                segments.push({y, xmin: x, xmax: x+mag, h: true, debug: code});
                x += mag;
                break;
            default:
                throw new Error("unknown direction");
        }
    }
    return segments;
}


