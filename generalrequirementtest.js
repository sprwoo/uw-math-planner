let test1 = "Two 400-level STAT courses";
let test2 = "One additional 300- or 400-level STAT course";
let test3 = "Three additional 400-level PMATH courses (1.5 units)";
let test4 = "One 300- or 400-level AMATH course";
let test5 = "One of";
let test6 = "One additional CS course chosen from CS 340-CS 398, CS 440-CS 489";

const CODEREGEX = /([A-Z]+)\s-?/g;
const RANGEREGEX = /(\d{3})-?(\d{3})?/g;

function checkForX00(text) {
    const arr = [];
    for (const level of LEVELS) {
        if (text.includes(level)) {
            arr.push(Number(level.slice(0, 3)));
        }
    }
    return arr;
}

function parseRequirement(text) {
    const result = {
        lowerBound: [],
        upperBound: [],
        codes: [],
    }

    while ((result = CODEREGEX.exec(text)) !== null) {
        codes.push(result);
    }

    return result;
}

console.log(parseRequirement(test1));
console.log(checkForX00(test2));
console.log(checkForX00(test3));
console.log(checkForX00(test4));
console.log(checkForX00(test5));
console.log(checkForX00(test6));