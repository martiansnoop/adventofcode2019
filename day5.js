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
    console.log("starting", program, expectedMem, expectedOut)
    const [actualMem, actualOut] = compileAndRun(program, 1);
    const serializedMem = actualMem.join(",");
    console.log("asserting memory", serializedMem, expectedMem)
    assert.strictEqual(serializedMem, expectedMem);

    const serializedOut = actualOut.join(",");
    console.log("asserting output", serializedOut, expectedOut)
    assert.strictEqual(serializedOut, expectedOut);
}

function test(program, expected) {
    console.log("starting", program, expected)
    const actual = compileAndRun(program)[0].join(",");
    console.log("asserting", actual, expected)
    assert.strictEqual(actual, expected);
}

function compileAndRun(program, input) {
    const ints = program.trim().split(",").map(x => parseInt(x));
    console.log("ints", ints)
    const out = runProgram(ints, input)
    return [ints, out];
}

// mem is an array. input is an int. 
// this function is going to mutate the values of mem.
function runProgram(mem, input) {
    const out = [];
    let ptr = 0;
    let stop = false;
    let a, b, c;
    while(!stop) {
        const opcode = mem[ptr];
        console.log("opcode", opcode);
        switch(opcode) {
            case 99:
                stop = true;
                break;
            case 1:
                a = mem[ptr+1];
                b = mem[ptr+2];
                c = mem[ptr+3];
                console.log("adding", a, b, c);
                mem[c] = mem[a] + mem[b];
                ptr += 4;
                break;
            case 2:
                a = mem[ptr+1];
                b = mem[ptr+2];
                c = mem[ptr+3];
                mem[c] = mem[a] * mem[b];
                ptr += 4;
                console.log("multiplying", a, b, c);
                break;
            case 3:
                a = mem[ptr+1];
                mem[a] = input;
                ptr += 2;
                console.log("input", a)
                break;
            case 4: 
                a = mem[ptr+1];
                out.push(mem[a]);
                ptr += 2;
                console.log("output", a)
                break;
            default: 
                throw new Error("unknown opcode " + opcode);
        }
    }
    return out;
}
