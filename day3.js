const fs = require('fs');
const assert = require('assert');

if (require.main === module) {
    console.log("==== measure by distance ====");
    testDist("R8,U5,L5,D3\nU7,R6,D4,L4\n", 6);
    testDist("R75,D30,R83,U83,L12,D49,R71,U7,L72\nU62,R66,U55,R34,D71,R55,D58,R83", 159);

    const input = fs.readFileSync('day3_input.txt', 'utf8');
    const closest = findNearestIntersection(input);
    console.log("closest", closest);

    console.log("==== measure by steps/distance travelled ====");
    testSteps("R8,U5,L5,D3\nU7,R6,D4,L4\n", 30);
    testSteps("R75,D30,R83,U83,L12,D49,R71,U7,L72\nU62,R66,U55,R34,D71,R55,D58,R83", 610);
    testSteps("R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51\nU98,R91,D20,R16,D67,R40,U7,R15,U6,R7", 410);

    const fewestSteps = findNearestIntersectBySteps(input);
    console.log("fewestSteps", fewestSteps)

}

function testSteps(input, expected) {
    const actual = findNearestIntersectBySteps(input);
    assert.strictEqual(actual, expected);
}


function findNearestIntersectBySteps(input) {
    const [first, second] = input.trim().split("\n");
    const [, pointsA] = parseWireInfo(first);
    const [, pointsB] = parseWireInfo(second);

    let bestSteps = undefined;
    const keysA = new Set(pointsA.keys());
    const keysB = new Set(pointsB.keys());
    const keysInBoth = [...keysA].filter(k => keysB.has(k));
    for (key of keysInBoth) {
        if (key === "0,0") continue;
        const steps = pointsA.get(key) + pointsB.get(key);
        if (bestSteps === undefined || steps < bestSteps) {
            bestSteps = steps;
        }
    }
    return bestSteps;
}

function testDist(input, expected) {
    const actual = findNearestIntersection(input);
    assert.strictEqual(actual, expected);
}

function findNearestIntersection(input) {
    const [first, second] = input.trim().split("\n");
    const [wireA] = parseWireInfo(first);
    const [wireB] = parseWireInfo(second);

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
    let totalSteps = 0;
    let [x, y] = [0, 0];
    let points = new Map();
    let steps = 0;
    for (code of codes) {
        const [dir, ...rest] = code.split("");
        const mag = parseInt(rest.join(""));
        switch (dir) {
            case 'U':
                segments.push({x, ymin: y, ymax: y+mag, v: true, debug: code});
                steps = totalSteps;
                for (let i = y; i < y+mag; i++) {
                    const key = [x, i].join(",");
                    if (points.has(key)) continue;
                    points.set(key, steps++)
                }
                y += mag;
                break;
            case 'D':
                segments.push({x, ymin: y-mag, ymax: y, v: true, debug: code});
                steps = totalSteps;
                for (let i = y; i > y-mag; i--) {
                    const key = [x, i].join(",");
                    if (points.has(key)) continue;
                    points.set(key, steps++)
                }
                y -= mag;
                break;
            case 'L':
                segments.push({y, xmin: x-mag, xmax: x, h: true, debug: code});
                steps = totalSteps;
                for (let i = x; i > x-mag; i--) {
                    const key = [i, y].join(",");
                    if (points.has(key)) continue;
                    points.set(key, steps++)
                }
                x -= mag;
                break;
            case 'R':
                segments.push({y, xmin: x, xmax: x+mag, h: true, debug: code});
                steps = totalSteps;
                for (let i = x; i < x+mag; i++) {
                    const key = [i, y].join(",");
                    if (points.has(key)) continue;
                    points.set(key, steps++)
                }
                x += mag;
                break;
            default:
                throw new Error("unknown direction");
        }
        totalSteps += mag;
    }
    return [segments, points];
}


