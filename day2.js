const fs = require('fs');
const assert = require('assert');

if (require.main === module) {
    test("1,0,0,0,99", "2,0,0,0,99");
    test("2,3,0,3,99", "2,3,0,6,99");
    test("2,4,4,5,99,0", "2,4,4,5,99,9801");
    test("1,1,1,4,99,5,6,0,99", "30,1,1,4,2,5,6,0,99");
    test("1,9,10,3,2,3,11,0,99,30,40,50", "3500,9,10,70,2,3,11,0,99,30,40,50");

    const input = fs.readFileSync('day2_input.txt', 'utf8');
    const output = compileAndRun(input, true);
    console.log("output", output[0])
}

function test(input, expected) {
    console.log("starting", input, expected)
    const actual = compileAndRun(input).join(",");
    console.log("asserting", actual, expected)
    assert.strictEqual(actual, expected);
}

// NASA totally wouldn't allow this mungeProgram flag, but SANTA is fine with it
function compileAndRun(program, mungeProgram) {
    const ints = program.trim().split(",").map(x => parseInt(x));
    console.log("ints", ints)

    if (mungeProgram) {
        ints[1] = 12;
        ints[2] = 2;
    }

    let ptr = 0;
    let stop = false;
    let a, b, storeAt;
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
                storeAt = ints[ptr+3];
                console.log("adding", a, b, storeAt);
                ints[storeAt] = ints[a] + ints[b];
                break;
            case 2:
                a = ints[ptr+1];
                b = ints[ptr+2];
                storeAt = ints[ptr+3];
                ints[storeAt] = ints[a] * ints[b];
                console.log("multiplying", a, b, storeAt);
                break;
            default: 
                throw new Error("unknown opcode " + opcode);
        }
        ptr += 4;
    }
    return ints;
}
