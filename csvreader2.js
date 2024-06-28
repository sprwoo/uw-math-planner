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

// Function to lookup major
export async function lookup_requirements(year, degree_name, degree_type) {
    const data = await fetchAndParseCSV(`../CSVs/${degree_type}_requirements.csv`);
    const degree = data.find(row => row['Year'] == year && row[degree_type] == degree_name);
    if (degree) {
        return degree;
    } else {
        throw new Error(`No ${degree_type} found with the name "${degree_name}".`);
    }
}

// Function to lookup courses
export async function lookup_courses(course_code) {
    const data = await fetchAndParseCSV('../CSVs/course_info.csv');
    const course = data.find(row => row.Code == course_code);
    if (course) {
        return course;
    } else {
        throw new Error(`No courses found with the course code "${course_code}".`);
    }
}

// Function to get and print major information
export async function requirements_csv(year, degree_name, degree_type) {
    try {
        const degree = await lookup_requirements(year, degree_name, degree_type);
        console.log(degree);
        return degree;
    } catch (error) {
        console.error(error);
    }
    
}

// Function to get and print course information
export async function courses_csv(course_code) {
    try {
        const course_info = await lookup_courses(course_code);
        console.log(course_info);
    } catch (error) {
        console.error(error);
    }
}


// Uncomment these lines to test
requirements_csv("2023-2024", "Joint Pure Mathematics", "Major");
//requirements_csv("2023-2024", "Joint Combinatorics & Optimization", "major")
//courses_csv("CO250");
