const fs = require('fs');
const Papa = require('papaparse');

// RegEx expressions
const CODEREGEX = /\b[A-Z]{2,}/g;
const SINGLERANGEREGEX = /\b\d{3}-/g;
const MULTIRANGEREGEX = /\b\d{3}-[A-Z]{2,}\s?\d{3}\b/g;

// Checks if requirement listing is of the type "X00-level COURSE"
function checkForX00(text) {
    SINGLERANGEREGEX.lastIndex = 0;
    return SINGLERANGEREGEX.test(text);
}

// To get the bounds, if we find an MULTIRANGEREGEX, we know that the requirement is a determined range
// Otherwise, look for SINGLERANGEREGEX to get the lower bound and add 99 for the upper bound.
// We can use the result object to parse through the course_info.csv to find any that fits within the bounds
function parseRequirement(text) {
    const result = {
        lowerBounds: [],
        upperBounds: [],
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

            // Clean up the RegEx matches to convert into integer
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
    
            result['lowerBounds'].push(Number(lower));
            result['upperBounds'].push(Number(upper));
        }
    } else {
        SINGLERANGEREGEX.lastIndex = 0;
        while ((match = SINGLERANGEREGEX.exec(text)) !== null) {
            // Clean up the RegEx matches to convert into integer
            let number = "";
            for (let i = 0; i < match[0].length; i++) {
                if (match[0][i] >= '0' && match[0][i] <= '9') {
                    number += match[0][i];
                }
            }

            const lowerBound = Number(number);
            const upperBound = lowerBound + 99;
            result['lowerBounds'].push(lowerBound);
            result['upperBounds'].push(upperBound);
        }
    }
    
    return result;
}

function fetchAndParseCSV(filePath) {
    return new Promise((resolve, reject) => {
        const fileContent = fs.createReadStream(filePath);
        Papa.parse(fileContent, {
            header: true,
            dynamicTyping: true,
            complete: (results) => {
                resolve(results.data);
            },
            error: (error) => {
                reject(error);
            }
        });
    });
}

// Why did I split these up? idk
function loadCSV(filePath) {
    return fetchAndParseCSV(filePath)
        .then(data => data)
        .catch(error => console.error(error));
}

async function lookForRange(filePath, text) {
    // Get the X00 ranges first
    const range = parseRequirement(text);

    try {
        const csv = await loadCSV(filePath);
        const matches = new Set();

        for (code of range.codes) {
            for (let i = 0; i < range.lowerBounds.length; i++) {
                // Get the lower and upper bounds as strings
                const lowerBound = code + range.lowerBounds[i];
                const upperBound = code + range.upperBounds[i];

                // I want to implement binary search for this but I'm not sure how to go about it
                // Since it is not guaranteed that COURSE400 exists. I'll just use linear search
                // for now, and maybe try implementing binary search later.
                
                for (line of csv) {
                    if (line.Course > upperBound) {
                        break;
                    }
                    if (line.Course >= lowerBound) {
                        matches.add(line);
                    }
                }
            }
        }

        // Do something with this
        // This will return a set of all the matches which you can use to display on the site.
        console.log(matches);
    } catch (error) {
        console.error(error);
    }
}

let test1 = "Two 400-level STAT courses";
let test6 = "One additional CS course chosen from CS 340-CS 398, CS 440-CS 489";
let test7 = "Two additional 400-level math courses (1.0 unit) from ACTSC, AMATH, CO, CS, MATBUS, MATH, PMATH, or STAT";
lookForRange('CSVs\\course_info.csv', test7)

// For every category, use checkForX00 to check if it is a general requirement.
// If so, call lookForRange with the csv, which will return every match within those bounds

// --------------------------------------------------------------------------------------------------
// Testing stuff

// Function for testing
// function testingClient(text) {
//     if (checkForX00(text)) {
//         console.log(parseRequirement(text));
//     } else {
//         console.log("This is not a general requirement");
//     }
// }

// let test1 = "Two 400-level STAT courses";
// let test2 = "One additional 300- or 400-level STAT course";
// let test3 = "Three additional 400-level PMATH courses (1.5 units)";
// let test4 = "One 300- or 400-level AMATH course";
// let test5 = "One of";
// let test6 = "One additional CS course chosen from CS 340-CS 398, CS 440-CS 489";
// let test7 = "Two additional 400-level math courses (1.0 unit) from ACTSC, AMATH, CO, CS, MATBUS, MATH, PMATH, or STAT";

// testingClient(test1);
// testingClient(test2);
// testingClient(test3);
// testingClient(test4);
// testingClient(test5);
// testingClient(test6);
// testingClient(test7);
