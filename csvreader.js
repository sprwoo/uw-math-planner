const csv = require('csv-parser')
const fs = require('fs')

function lookup_major(year, major_name) {
    return new Promise((resolve, reject) => {
        const results = [];

        fs.createReadStream('C:\\Users\\verys\\Documents\\Undergrad Calendar\\UW-Undergrad-Calendar\\CSVs\\course_requirements.csv')
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                for (let i = 0; i < results.length; i++) {
                    if (results[i].Year == year && results[i].Major == major_name) {
                        resolve(results[i]);
                        return;
                    }
                }
                reject('No matching requirements found.');
            })
            .on('error', (error) => reject(error));
    });
}

async function majors_csv(year, name1, name2) {
    // Replace these with getElementById or something of the sort to grab the user inputs
    year = "2023-2024"
    name1 = "Joint Pure Mathematics"
    name2 = "Joint Combinatorics and Optimization"; 

    try {
        const major1 = await lookup_major(year, name1);
        const major2 = await lookup_major(year, name2);
        console.log(major1);
        console.log(major2)
    } catch (error) {
        console.error(error);
    }
}

function lookup_courses(course_code) {
    return new Promise((resolve, reject) => {
        const results = [];

        fs.createReadStream('C:\\Users\\verys\\Documents\\Undergrad Calendar\\UW-Undergrad-Calendar\\CSVs\\course_info.csv')
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                for (let i = 0; i < results.length; i++) {
                    if (results[i].Code == course_code) {
                        resolve(results[i]);
                        return;
                    }
                }
                reject('No matching requirements found.');
            })
            .on('error', (error) => reject(error));
    });
}

async function courses_csv(course_code) {
    course_code = "CO250"

    try {
        const course_info = await lookup_courses(course_code);
        console.log(course_info);
    } catch (error) {
        console.error(error);
    }
}

//majors_csv();
courses_csv();
