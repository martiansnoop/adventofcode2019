const fs = require('fs');
const assert = require('assert');

if (require.main === module) {
    // assert.strictEqual(true, meetsCriteria("11111"));
    assert.strictEqual(true, meetsCriteria("122345"));
    assert.strictEqual(true, meetsCriteria("1122345"));
    assert.strictEqual(false, meetsCriteria("123450"));
    assert.strictEqual(false, meetsCriteria("124444"));

    const codes = countPossibleCodes(158126, 624574);
    console.log("codes", codes);
}

function countPossibleCodes(begin, end) {
    let total = 0;
    for (let i = begin; i <= end; i++) {
        if (meetsCriteria(i)) total++;
    }
    return total;
}

function meetsCriteria(num) {
    const digits = getDigits(num); 
    const pair = hasPair(digits);
    const ascending = isAscending(digits);
    return pair && ascending;
}

function isAscending(digits) {
    let prev = -1;
    for (let d of digits) {
        if (d < prev) return false;
        prev = d;
    }
    return true;
}

function hasPair(digits) {
    let prev = -1;
    let runningMatches = 1;
    for (let d of digits) {
        console.log("digit", d, prev, runningMatches);
        if (prev === -1) { 
            console.log("first")
        } else if (d === prev) {
            runningMatches++;
            console.log("new match", runningMatches);
        } else if (runningMatches === 2) {
            console.log("found one");
            return true;
        } else {
            console.log("resetting to 1")
            runningMatches = 1;
        } 
        prev = d;
    }
    return false;
} 

function getDigits(num) {
    const ds = [];
    while (num > 0) {
        ds.push(num % 10);
        num = Math.floor(num / 10);
    }
    ds.reverse();
    return ds;
}
