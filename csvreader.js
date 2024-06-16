const csv = require('csv-parser')
const fs = require('fs')

/**
 * Parses through course_requirements.csv to find and return an object of the major
 * @param {String} year         The year of the offerings we are looking for
 * @param {String} major_name   The name of the major we are looking for
 * @returns {Promise}           Promise with an object representing the major
 */
export function lookup_major(year, major_name) {
    return new Promise((resolve, reject) => {
        // Parse through the csv
        fs.createReadStream('C:\\Users\\verys\\Documents\\Undergrad Calendar\\UW-Undergrad-Calendar\\CSVs\\course_requirements.csv')
            .pipe(csv())
            .on('data', (data) => {
                // If a match is found, return the object
                if (data.Year == year && data.Major == major_name) { 
                    resolve(data);
                    return;
                }
            }) 

            // If it reaches the end of the csv, return an error
            .on('end', () => reject(new Error(`No majors found with the name \"${major_name}\".`)))

            // Error if there was an issue reading csv
            .on('error', (error) => reject(error));
    });
}

/**
 * Uses lookup_major to get two objects of two different majors
 * @param {*} year      The year of the offerings we are looking for
 * @param {*} name1     The name of the first major we are looking for
 * @param {*} name2     The name of the second major we are looking for
 * @returns {void}      Void for printing for now, change to object for frontend
 */
export async function majors_csv(year, name1, name2) {
    // Replace these with getElementById or something of the sort to grab the user inputs
    year = "2023-2024"
    name1 = "Joint Pure Mathematics"
    name2 = "Joint Combinatorics and Optimization"; 

    try {
        const major1 = await lookup_major(year, name1);
        console.log(major1);
    } catch (error) {
        console.error(error);
    }

    try {
        const major2 = await lookup_major(year, name2);
        console.log(major2);
    } catch (error) {
        console.error(error);
    }
}

/**
 * Parses through course_info.csv to find and return an object representing the course
 * @param {String} course_code      The code of the course we are looking for
 * @returns {Promise}               Promise with an object of the course 
 */
export function lookup_courses(course_code) {
    return new Promise((resolve, reject) => {
        // Parse through csv
        fs.createReadStream('C:\\Users\\verys\\Documents\\Undergrad Calendar\\UW-Undergrad-Calendar\\CSVs\\course_info.csv')
            .pipe(csv())
            .on('data', (data) => {
                // If match is found, return the object
                if (data.Code == course_code) {
                    resolve(data);
                    return;
                }
            })

            // If it reaches the end of the csv, return an error
            .on('end', () => reject(new Error(`No courses found with the course code \"${course_code}\".`)))

            // Error if there was an issue reading csv
            .on('error', (error) => reject(error));
    });
}

/**
 * Uses lookup_courses to get an object representing the course's information
 * @param {String} course_code      The code of the course we are looking for
 * @returns {void}                  Print for testing 
 */
export async function courses_csv(course_code) {
    course_code = "CO250"

    try {
        const course_info = await lookup_courses(course_code);
        console.log(course_info);
    } catch (error) {
        console.error(error);
    }

    console.log("TEST");
}


//majors_csv();
//courses_csv();
