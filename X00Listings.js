let test1 = "Two 400-level STAT courses";
let test2 = "One additional 300- or 400-level STAT course";
let test3 = "Three additional 400-level PMATH courses (1.5 units)";
let test4 = "One 300- or 400-level AMATH course";
let test5 = "One of";
let test6 = "One additional CS course chosen from CS 340-CS 398, CS 440-CS 489";

const CODEREGEX = /\b[A-Z]{2,}\s/g;
const SINGLERANGEREGEX = /\b\d{3}-/g;
const MULTIRANGEREGEX = /\b\d{3}-[A-Z]{2,}\s?\d{3}\b/g;

function checkForX00(text) {
    return SINGLERANGEREGEX.test(text);
}

// To get the bounds, if we find an MULTIRANGEREGEX, we know that the requirement is a determined range
// Otherwise, look for SINGLERANGEREGEX to get the lower bound and add 99 for the upper bound.
function parseRequirement(text) {
    const result = {
        lowerBound: [],
        upperBound: [],
        codes: new Set(),
    }

    CODEREGEX.lastIndex = 0;
    while ((match = CODEREGEX.exec(text)) !== null) {
        result['codes'].add(match[0].trim());
    }

    if (MULTIRANGEREGEX.test(text)) {
        MULTIRANGEREGEX.lastIndex = 0;
        while ((match = MULTIRANGEREGEX.exec(text)) !== null) {
            const arr = match[0].split("-");
            let lower = "";
            let upper = "";
            for (let i = 0; i < arr[0].length; i++) {
                if (arr[0][i] >= '0' && arr[0][i] <= '9') {
                    lower += arr[0][i];
                }
            }
        
            for (let i = 0; i < arr[1].length; i++) {
                if (arr[1][i] >= '0' && arr[1][i] <= '9') {
                    upper += arr[1][i];
                }
            }
    
            result['lowerBound'].push(Number(lower));
            result['upperBound'].push(Number(upper));
        }
    } else {
        SINGLERANGEREGEX.lastIndex = 0;
        while ((match = SINGLERANGEREGEX.exec(text)) !== null) {
            let number = "";
            for (let i = 0; i < match[0].length; i++) {
                if (match[0][i] >= '0' && match[0][i] <= '9') {
                    number += match[0][i];
                }
            }
            result['lowerBound'].push(Number(number));
            result['upperBound'].push(Number(number) + 99);
        }
    }
    
    return result;
}

function testingClient(text) {
    if (checkForX00(text)) {
        console.log(parseRequirement(text));
    } else {
        console.log("This is not a general requirement");
    }
}

// const result = {
//     lowerBound: [],
//     upperBound: [],
//     codes: [],
// }
// while ((match = SINGLERANGEREGEX.exec(test1)) !== null) {
//     let number = "";
//     for (let i = 0; i < match[0].length; i++) {
//         if (match[0][i] >= '0' && match[0][i] <= '9') {
//             number += match[0][i];
//         }
//     }
//     result['lowerBound'].push(Number(number));
//     result['upperBound'].push(Number(number) + 99);
// }

// console.log(result);

testingClient(test1);
testingClient(test2);
testingClient(test3);
testingClient(test4);
testingClient(test5);
testingClient(test6);