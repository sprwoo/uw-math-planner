const csv = require('csv-parser')
const fs = require('fs')

function get_requirements(lookforyear, lookformajor) {
    return new Promise((resolve, reject) => {
        const results = [];

        fs.createReadStream('C:\\Users\\verys\\Documents\\Undergrad Calendar\\UW-Undergrad-Calendar\\CSVs\\course_requirements.csv')
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                for (let i = 0; i < results.length; i++) {
                    if (results[i].Year == lookforyear && results[i].Major == lookformajor) {
                        resolve(results[i]);
                        return;
                    }
                }
                reject('No matching requirements found.');
            })
            .on('error', (error) => reject(error));
    });
}

async function main() {
    // Replace these with getElementById or something of the sort to grab the user inputs
    const year = "2023-2024"
    const name1 = "Joint Pure Mathematics"
    const name2 = "Joint Combinatorics and Optimization"; 

    try {
        const major1 = await get_requirements(year, name1);
        const major2 = await get_requirements(year, name2);
        console.log(req1);
        console.log(req2)
    } catch (error) {
        console.error(error);
    }
}

main();
