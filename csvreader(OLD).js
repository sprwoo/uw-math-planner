// Function to fetch and parse CSV file
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
export async function lookup_major(year, major_name) {
    const data = await fetchAndParseCSV('../CSVs/course_requirements.csv');
    const major = data.find(row => row.Year == year && row.Major == major_name);
    if (major) {
        return major;
    } else {
        throw new Error(`No majors found with the name "${major_name}".`);
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
export async function majors_csv(year, name1) {
    try {
        const major1 = await lookup_major(year, name1);
        console.log(major1);
        return major1;
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
// majors_csv("2023-2024", "Joint Pure Mathematics", "Joint Combinatorics and Optimization");
// courses_csv("CO250");