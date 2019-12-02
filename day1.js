const fs = require('fs');
const assert = require('assert');

if (require.main === module) {
    const input = fs.readFileSync('day1_input.txt', 'utf8');

    const fuel = calculateTotalFuel(input);
    console.log('total fuel required', fuel);
    assert.strictEqual(fuel, 5027950);
}

function calculateTotalFuel(input) {
    return input 
        .split('\n')
        .filter(s => s !== '')
        .map(l => parseInt(l))
        .map(calculateFuel)
        .map(f => f + calculateFuelForFuel(f))
        .reduce((total, m) => m + total, 0);
}

// maybe do this recursively later?
function calculateFuelForFuel(startingFuel) {
    let fuelFuel = 0;
    let mass = startingFuel;
    while (mass > 0) {
        const newFuel = calculateFuel(mass);
        if (newFuel > 0) fuelFuel +=newFuel;
        mass = newFuel;
    }

    return fuelFuel;
}

function calculateFuel(mass) {
    return Math.floor(mass / 3) - 2;
}

