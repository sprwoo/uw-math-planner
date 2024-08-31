// Function to fetch and parse CSV file

//console.log('Current working directory:', process.cwd());

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

function degreeBinarySearch(data, year, degree_name, degree_type) {
    // Function to format degree name
    function formatDegreeName(name) {
        return name.toLowerCase().replace(/\b\w/g, function(char) {
            return char.toUpperCase();
        });
    }

    const formattedDegreeName = formatDegreeName(degree_name);
    let l = 0, r = data.length - 1;
    while (l <= r) {
        let mid = Math.floor(l + (r - l) / 2);
        const midDegree = data[mid][degree_type];

        // Format the degree type for comparison
        const formattedMidDegree = formatDegreeName(midDegree);

        if (formattedMidDegree === formattedDegreeName) {
            if (data[mid]['Year'] == year) {
                return data[mid];
            } else if (data[mid]['Year'] > year) {
                return data[mid - 1];
            } else {
                return data[mid + 1];
            }
        } else if (formattedMidDegree < formattedDegreeName) {
            l = mid + 1;
        } else {
            r = mid - 1;
        }
    }
}



/**
 * Parses through major/minor_requirements.csv to find and return an object of the major/minor
 * @param {String} year         The year of the offerings we are looking for
 * @param {String} major_name   The name of the major/minor we are looking for
 * @returns {Promise}           Promise with an object representing the major/minor
 */
export async function lookup_requirements(year, degree_name, degree_type) {
    // For testing
    // const data = await fetchAndParseCSV(`../public/CSVs/${degree_type}_requirements.csv`);
    // For actual deployed server
    const data = await fetchAndParseCSV(`../CSVs/${degree_type}_requirements.csv`);

    const degree = degreeBinarySearch(data, year, degree_name, degree_type)
    if (degree) {
        return degree;
    } else {
        throw new Error(`No ${degree_type} found with the name "${degree_name}".`);
    }
}

/**
 * Uses lookup_requirements to get an object of a majors/minors
 * @param {*} year            The year of the offerings we are looking for
 * @param {*} degree_name     The name of the first major we are looking for
 * @param {*} degree_type     The type of degree
 * @returns {void}            Void for printing for now, change to object for frontend
 */
export async function requirements_csv(year, degree_name, degree_type) {
    try {
        const degree = await lookup_requirements(year, degree_name, degree_type);
        console.log(degree);
        return degree;
    } catch (error) {
        console.error(error);
    }
}

/**
 * 
 * @param {Array of Objects} data   
 * @param {String} name 
 * @returns {Object}
 */
function courseBinarySearch(data, name) {
    let l = 0, r = data.length - 1;
    while (l <= r) {
        let mid = Math.floor(l + (r - l) / 2);
        if (data[mid]['Course'] == name) {
            return data[mid];
        } else if (data[mid]['Course'] < name) {
            l = mid + 1;
        } else {
            r = mid - 1;
        }
    }
}

/**
 * Parses through course_info.csv to find and return an object representing the course
 * @param {String} course_code      The code of the course we are looking for
 * @returns {Promise}               Promise with an object of the course 
 */
export async function lookup_courses(course_code) {
    // For testing
    //const data = await fetchAndParseCSV('../public/CSVs/course_info.csv');
    // For actual deployed server
    const data = await fetchAndParseCSV('../CSVs/course_info.csv');

    const course = courseBinarySearch(data, course_code);
    if (course) {
        return course;
    } else {
        throw new Error(`No courses found with the course code "${course_code}".`);
    }
}

/**
 * Uses lookup_courses to get an object representing the course's information
 * @param {String} course_code      The code of the course we are looking for
 * @returns {void}                  Print for testing 
 */
export async function courses_csv(course_code) {
    try {
        const course_info = await lookup_courses(course_code);
        console.log(course_info);
    } catch (error) {
        console.error(error);
    }
}


// Uncomment these lines to test
// requirements_csv("2023-2024", "Mathematical Finance", "Major");
// requirements_csv("2023-2024", "Joint Combinatorics & Optimization", "major")
// courses_csv("CO250");
