const fs = require('fs');
const assert = require('assert');

if (require.main === module) {
    assert.strictEqual(true, meetsCriteria("11111"));
    assert.strictEqual(true, meetsCriteria("122345"));
    assert.strictEqual(false, meetsCriteria("123450"));

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
    const repeat = hasRepeat(digits);
    const ascending = isAscending(digits);
    return repeat && ascending;
}

function isAscending(digits) {
    let prev = -1;
    for (let d of digits) {
        if (d < prev) return false;
        prev = d;
    }
    return true;
}

function hasRepeat(digits) {
    let prev = -1;
    for (let d of digits) {
        if (d === prev) return true;
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
