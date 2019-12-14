const fs = require('fs');
const assert = require('assert');

if (require.main === module) {
    test("1,0,0,0,99", "2,0,0,0,99");
    test("2,3,0,3,99", "2,3,0,6,99");
    test("2,4,4,5,99,0", "2,4,4,5,99,9801");
    test("1,1,1,4,99,5,6,0,99", "30,1,1,4,2,5,6,0,99");
    test("1,9,10,3,2,3,11,0,99,30,40,50", "3500,9,10,70,2,3,11,0,99,30,40,50");

    testIO("3,0,4,0,99", "1,0,4,0,99", "1");

    testOpcode("1002", [2, 0, 1, 0])

    const input = fs.readFileSync('day5_input.txt', 'utf8');
    const [mem, out] = compileAndRun(input, 1);
    console.log("out", out);;
}

function testOpcode(instruction, expected) {
    console.log("testing opcode", instruction);
    assert.deepStrictEqual(parseOpcode(instruction), expected);
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
// 
// this is essentially a computer, so it dispenses with things like "good"
// naming and DRY code in the interest of being as abstraction-free as possible
// so a human can easily verify its correctness.
function runProgram(mem, input) {
    const out = [];
    let ptr = 0;
    let stop = false;
    // These are reusable registers that mean different things
    // depending on the opcode, so don't waste any time naming them.
    let a, b, c, d, e;
    while(!stop) {
        const instruction = mem[ptr];
        console.log("instruction", instruction);
        const [opcode, ...modes] = parseOpcode(instruction);
        console.log("opcode, modes", opcode, modes);
        switch(opcode) {
            case 99:
                stop = true;
                break;
            case 1:
                a = mem[ptr+1];
                b = mem[ptr+2];
                c = mem[ptr+3];
                d = resolve(a, mem, modes[0]);
                e = resolve(b, mem, modes[1]);
                mem[c] = d + e;
                ptr += 4;
                break;
            case 2:
                a = mem[ptr+1];
                b = mem[ptr+2];
                c = mem[ptr+3];
                d = resolve(a, mem, modes[0]);
                e = resolve(b, mem, modes[1]);
                mem[c] = d * e;
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
                b = resolve(a, mem, modes[0]);
                out.push(b);
                ptr += 2;
                console.log("output", a)
                break;
            default: 
                throw new Error("unknown opcode " + opcode);
        }
    }
    return out;
}

function resolve(param, mem, mode) {
    if (mode === 0) {
        return mem[param];
    } else if (mode === 1) {
        return param;
    } else {
        throw new Error("unexpected mode " + mode);
    }
}

// Modify the value of `raw` as we go because I actually think it's less
// confusing than making naming new variables. Also, don't bother with a loop
// becuase we're only doing it 3 times so it's not worth the risk of messing
// up the bounds. 
function parseOpcode(raw) {
    const opcode = raw % 100;
    raw = Math.floor(raw / 100);
    const modes = [];
    modes.push(raw % 10);
    raw = Math.floor(raw / 10);
    modes.push(raw % 10);
    raw = Math.floor(raw / 10);
    modes.push(raw % 10);
    raw = Math.floor(raw / 10);
    // I'm using the spread operator here even though I immediately undo it
    // because it makes the tests easier.
    return [opcode, ...modes];
}
