const csv = require('csv-parser')
const fs = require('fs')

/**
 * Parses through course_requirements.csv to find and return an object of the major
 * @param {String} year         The year of the offerings we are looking for
 * @param {String} major_name   The name of the major we are looking for
 * @returns {Promise}           Promise with an object representing the major
 */
function lookup_requirements(year, degree_name, degree_type) {
    return new Promise((resolve, reject) => {
        // Parse through the csv
        csv_name = "./UW-Undergrad-Calendar/CSVs/" + degree_type + "_requirements.csv";
        console.log(csv_name)
        fs.createReadStream(csv_name)
            .pipe(csv())
            .on('data', (data) => {
                // If a match is found, return the object
                if (data['Year'] == year && data[degree_type] == degree_name) { 
                    resolve(data);
                    return;
                }
            }) 

            // If it reaches the end of the csv, return an error
            .on('end', () => reject(new Error(`No ${degree_type} found with the name \"${degree_name}\".`)))

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
async function requirements_csv(year, degree_name, degree_type) {
    // Replace these with getElementById or something of the sort to grab the user inputs
    try {
        const degree = await lookup_requirements(year, degree_name, degree_type);
        console.log(degree);
    } catch (error) {
        console.error(error);
    }
}

/**
 * Parses through course_info.csv to find and return an object representing the course
 * @param {String} course_code      The code of the course we are looking for
 * @returns {Promise}               Promise with an object of the course 
 */
function lookup_courses(course_code) {
    return new Promise((resolve, reject) => {
        // Parse through csv
        fs.createReadStream('./UW-Undergrad-Calendar/CSVs/course_info.csv')
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
async function courses_csv(course_code) {
    try {
        const course_info = await lookup_courses(course_code);
        console.log(course_info);
    } catch (error) {
        console.error(error);
    }
}

requirements_csv("2023-2024", "Joint Pure Mathematics", "Major");
requirements_csv("2023-2024", "Joint Combinatorics & Optimization", "Major");
courses_csv("CO250");
requirements_csv("2022-2023", "Computer Science Minor", "Minor");
