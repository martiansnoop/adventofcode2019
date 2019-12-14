const fs = require('fs');
const assert = require('assert');

if (require.main === module) {
    test("1,0,0,0,99", "2,0,0,0,99");
    test("2,3,0,3,99", "2,3,0,6,99");
    test("2,4,4,5,99,0", "2,4,4,5,99,9801");
    test("1,1,1,4,99,5,6,0,99", "30,1,1,4,2,5,6,0,99");
    test("1,9,10,3,2,3,11,0,99,30,40,50", "3500,9,10,70,2,3,11,0,99,30,40,50");

    testIO("3,0,4,0,99", "1,0,4,0,99", "1");
}

function testIO(program, expectedMem, expectedOut) {
    const output = [];
    console.log("starting", program, expectedMem, expectedOut)
    const actual = compileAndRun(program, 1, output).join(",");
    console.log("asserting memory", actual, expectedMem)
    assert.strictEqual(actual, expectedMem);

    const serializedOut = output.join(",");
    console.log("asserting output", serializedOut, expectedOut)
    assert.strictEqual(serializedOut, expectedOut);
}

function test(program, expected) {
    console.log("starting", program, expected)
    const actual = compileAndRun(program).join(",");
    console.log("asserting", actual, expected)
    assert.strictEqual(actual, expected);
}

// output is an array that this function is going to mutate
function compileAndRun(program, input = 1, output = []) {
    const ints = program.trim().split(",").map(x => parseInt(x));
    console.log("ints", ints)

    let ptr = 0;
    let stop = false;
    let a, b, c;
    while(!stop) {
        const opcode = ints[ptr];
        console.log("opcode", opcode);
        switch(opcode) {
            case 99:
                stop = true;
                break;
            case 1:
                a = ints[ptr+1];
                b = ints[ptr+2];
                c = ints[ptr+3];
                console.log("adding", a, b, c);
                ints[c] = ints[a] + ints[b];
                ptr += 4;
                break;
            case 2:
                a = ints[ptr+1];
                b = ints[ptr+2];
                c = ints[ptr+3];
                ints[c] = ints[a] * ints[b];
                ptr += 4;
                console.log("multiplying", a, b, c);
                break;
            case 3:
                a = ints[ptr+1];
                ints[a] = input;
                ptr += 2;
                break;
            case 4: 
                a = ints[ptr+1];
                output.push(ints[a]);
                ptr += 2;
                break;
            default: 
                throw new Error("unknown opcode " + opcode);
        }
    }
    return ints;
}
