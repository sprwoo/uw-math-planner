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

    // Ensure text is not empty and matches expected patterns
    if (!text || typeof text !== 'string') {
        console.error('Invalid input text:', text);
        return result; // Return empty result or handle error as needed
    }

    // Regular expression patterns
    const CODEREGEX = /([A-Z]{4}\s?\d{3}[A-Z]?)/g; // Adjust as per your specific code format
    const MULTIRANGEREGEX = /(\d{3,4}\s?-\s?\d{3,4})/g;
    const SINGLERANGEREGEX = /(\d{3,4})/g;

    // Use try-catch to handle potential errors in regex execution
    try {
        CODEREGEX.lastIndex = 0;
        let match;
        while ((match = CODEREGEX.exec(text)) !== null) {
            result.codes.add(match[0].trim());
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
                result.lowerBounds.push(Number(lower));
                result.upperBounds.push(Number(upper));
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
                const lowerBound = Number(number);
                const upperBound = lowerBound + 99;
                result.lowerBounds.push(lowerBound);
                result.upperBounds.push(upperBound);
            }
        }
        console.log('results: ');
        console.log(result);
        // Fetch and parse CSV data
        const csvUrl = '../CSVs/course_info.csv';
        return fetchAndParseCSV(csvUrl)
            .then(courseData => {
                const courses = [];

                // Filter course codes from CSV data based on text match
                courseData.forEach(course => {
                    const { Course, Name } = course;
                    const combinedCode = `${Course}${Name}`; // Adjust this based on your CSV structure

                    // Check if combined code exists in the text
                    if (text.includes(Course) || text.includes(combinedCode)) {
                        courses.push(combinedCode);
                    }
                });

                return courses;
            })
            .catch(error => {
                console.error('Error fetching or parsing course data:', error);
                return []; // Return empty array in case of error
            });

    } catch (error) {
        console.error('Error parsing requirement:', error);
        // Handle error or log it as needed
        return []; // Return empty array in case of error
    }
}

function fetchAndParseCSV(url) {
    return fetch(url)
        .then(response => response.text())
        .then(data => {
            return new Promise((resolve, reject) => {
                Papa.parse(data, {
                    header: true,
                    dynamicTyping: true,
                    complete: results => resolve(results.data),
                    error: error => reject(error)
                });
            });
        });
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
