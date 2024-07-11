// RegEx expressions
const CODEREGEX = /\b[A-Z]{2,}/g;
const SINGLERANGEREGEX = /\b\d{3}-/g;
const MULTIRANGEREGEX = /\b\d{3}-[A-Z]{2,}\s?\d{3}\b/g;

// Checks if requirement listing is of the type "X00-level COURSE"
export function checkForX00(text) {
    SINGLERANGEREGEX.lastIndex = 0;
    return SINGLERANGEREGEX.test(text);
}

// To get the bounds, if we find a MULTIRANGEREGEX, we know that the requirement is a determined range
// Otherwise, look for SINGLERANGEREGEX to get the lower bound and add 99 for the upper bound.
// We can use the result object to parse through the course_info.csv to find any that fits within the bounds
export function parseRequirement(text) {
    const result = {
        lowerBounds: [],
        upperBounds: [],
        codes: new Set(),
    };

    CODEREGEX.lastIndex = 0;
    while ((match = CODEREGEX.exec(text)) !== null) {
        result.codes.add(match[0].trim());
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

            result.lowerBounds.push(Number(lower));
            result.upperBounds.push(Number(upper));
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
            result.lowerBounds.push(lowerBound);
            result.upperBounds.push(upperBound);
        }
    }

    return result;
}

async function parseCSV(csvText) {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',');
    const data = lines.slice(1).map(line => {
        const values = line.split(',');
        const entry = {};
        headers.forEach((header, index) => {
            entry[header.trim()] = values[index].trim();
        });
        return entry;
    });
    return data;
}

async function lookForRange(csvText, text) {
    // Get the X00 ranges first
    const range = parseRequirement(text);
    const csv = parseCSV(csvText);
    const matches = new Set();

    for (const code of range.codes) {
        for (let i = 0; i < range.lowerBounds.length; i++) {
            // Get the lower and upper bounds as strings
            const lowerBound = code + range.lowerBounds[i];
            const upperBound = code + range.upperBounds[i];

            // Linear search through the CSV data
            for (const line of csv) {
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
}
