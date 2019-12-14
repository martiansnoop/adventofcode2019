const fs = require('fs');
const assert = require('assert');

if (require.main === module) {
    test("1,0,0,0,99", "2,0,0,0,99");
    test("2,3,0,3,99", "2,3,0,6,99");
    test("2,4,4,5,99,0", "2,4,4,5,99,9801");
    test("1,1,1,4,99,5,6,0,99", "30,1,1,4,2,5,6,0,99");
    test("1,9,10,3,2,3,11,0,99,30,40,50", "3500,9,10,70,2,3,11,0,99,30,40,50");
}

function test(input, expected) {
    console.log("starting", input, expected)
    const actual = compileAndRun(input).join(",");
    console.log("asserting", actual, expected)
    assert.strictEqual(actual, expected);
}

function compileAndRun(program, input) {
    const ints = program.trim().split(",").map(x => parseInt(x));
    console.log("ints", ints)

    if (input) {
        ints[1] = input[0];
        ints[2] = input[1];
    }

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
                break;
            case 2:
                a = ints[ptr+1];
                b = ints[ptr+2];
                c = ints[ptr+3];
                ints[c] = ints[a] * ints[b];
                console.log("multiplying", a, b, c);
                break;
            default: 
                throw new Error("unknown opcode " + opcode);
        }
        ptr += 4;
    }
    return ints;
}
