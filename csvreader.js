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
                reject('No matching requirements found');
            })
            .on('error', (error) => reject(error));
    });
}

async function main() {
    try {
        const course = await get_requirements("2022-2023", "Mathematical Finance");
        console.log(course);
    } catch (error) {
        console.error(error);
    }
}

main();
