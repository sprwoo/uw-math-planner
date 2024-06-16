import { lookup_major, majors_csv, lookup_courses, courses_csv } from '../csvreader2.js';

let globalMajorsData = []
let majorsFromStorage = JSON.parse(localStorage.getItem("majors"));
let minorsFromStorage = JSON.parse(localStorage.getItem("minors"));
let majors = majorsFromStorage ? majorsFromStorage : [];
let minors = minorsFromStorage ? minorsFromStorage : [];

document.addEventListener('DOMContentLoaded', async () => {
    const majorsContainer = document.getElementById('majors-container');
    // Temporary course details
    const courseDetails = {
        "MATH 237 Calculus 3 for Honours Mathematics": { prereqs: "None", description: "Calculus 1" },
        "MATH 147": { prereqs: "None", description: "Calculus 1" },
        "STAT 230": { prereqs: "None", description: "Calculus 1" },
        "STAT 231": { prereqs: "None", description: "Calculus 1" },
        "STAT 333": { prereqs: "None", description: "Calculus 1" },
        "CS 340": { prereqs: "None", description: "Calculus 1" },
        "PMATH 333": { prereqs: "None", description: "Calculus 1" },
        "CS 115": { prereqs: "None", description: "Calculus 1" },
        "CS 135": { prereqs: "None", description: "Calculus 1" },
        "CS 136": { prereqs: "None", description: "Calculus 1" },
        "MATH 138": { prereqs: "None", description: "Calculus 1" },
        "CM 481": { prereqs: "None", description: "Calculus 1" },
        "CS 240": { prereqs: "None", description: "Calculus 1" },
        "CS 245": { prereqs: "None", description: "Calculus 1" },
        "CS 341": { prereqs: "None", description: "Calculus 1" },
        "AMATH 250": { prereqs: "None", description: "Calculus 1" },
        "CO 250": { prereqs: "None", description: "Calculus 1" },
        "CO 390": { prereqs: "None", description: "Calculus 1" },
        "STAT 444": { prereqs: "None", description: "Calculus 1" }
    };

    console.log("TEST1");
    // Temporary majors data
    try {
        console.log("TEST2");
        const year = "2023-2024";
        
        // Process majors data asynchronously
        console.log(majors);
        const majorsData = await processMajors(year, majors);

        // Log or use majorsData as needed
        console.log("Processed Majors Data:");
        console.log(majorsData);

        // Example usage: Render majors data in the DOM
        renderMajors(majorsData); // Replace with your actual rendering function
    } catch (error) {
        console.error("Error in main application:", error);
    }
    /*
    
    const majorsData = [
        {
            name: "STATISTICS",
            courses: [
                ["One of the following:", ["MATH 137", "MATH 147"]],
                ["Two of:", ["STAT 230"]],
                ["All of:", ["STAT 231", "STAT 333", "CS 340", "PMATH 333"]]
            ]
        },
        {
            name: "COMPUTER SCIENCE",
            courses: [
                ["One of the following:", ["CS 115", "CS 135"]],
                ["Two of:", ["CS 136"]],
                ["All of:", ["MATH 137", "MATH 138", "CM 481"]],
                ["Choose Three of:", ["CS 240", "CS 245", "CS 341"]]
            ]
        },
        {
            name: "APPLIED MATH",
            courses: [
                ["One of the following:", ["MATH 137", "MATH 147"]],
                ["Two of:", ["AMATH 250"]],
                ["All of:", ["CO 250", "CO 390", "STAT 444"]]
            ]
        }
    ];
    */

    // Render majors and courses
    function renderMajors(majorsData) {
        const courseCount = {};
        majorsData.forEach(major => {
            major.courses.forEach(([category, courses]) => {
                courses.forEach(course => {
                    courseCount[course] = (courseCount[course] || 0) + 1;
                });
            });
        });

        majorsData.forEach(major => {
            const majorDiv = document.createElement('div');
            majorDiv.classList.add('major');
    
            const majorTitle = document.createElement('h2');
            majorTitle.textContent = major.name;
            majorDiv.appendChild(majorTitle);
    
            const courseList = document.createElement('ul');
            courseList.classList.add('course-list');
    
            major.courses.forEach(([category, courses]) => {
                const categoryItem = document.createElement('li');
                categoryItem.textContent = category;
    
                const subList = document.createElement('ul');
    
                courses.forEach(course => {
                    const listItem = document.createElement('li');
                    listItem.textContent = course;
                    listItem.classList.add('course-item');

                    if (courseCount[course] > 1) {
                        listItem.classList.add('matched-course');
                    }

                    if (courseDetails[course]) {
                        const coursePopup = document.createElement('div');
                        coursePopup.classList.add('course-popup');
                        coursePopup.innerHTML = `
                            <p><strong>Description:</strong> ${courseDetails[course].description}</p>
                            <p><strong>Prerequisites:</strong> ${courseDetails[course].prereqs}</p>
                        `;
                        listItem.appendChild(coursePopup);
                    }
    
                    // Check for "or" in course string
                    if (course.includes(" or ")) {
                        const orCourses = course.split(" or ");
                        const mainCourse = orCourses.shift(); // First course in the list
    
                        // Add the main course as a list item
                        const mainListItem = document.createElement('li');
                        mainListItem.textContent = mainCourse;
                        mainListItem.classList.add('course-item');
                        mainListItem.addEventListener('click', () => {
                            handleCourseSelection(mainListItem, category, courses);
                        });
                        subList.appendChild(mainListItem);
    
                        // Add sub-items for each "or" course
                        orCourses.forEach(orCourse => {
                            const subListItem = document.createElement('li');
                            subListItem.textContent = orCourse;
                            subListItem.classList.add('course-sub-item');
                            subListItem.addEventListener('click', () => {
                                handleCourseSelection(subListItem, category, courses);
                            });
                            subList.appendChild(subListItem);
                        });
                    } else {
                        listItem.addEventListener('click', () => {
                            handleCourseSelection(listItem, category, courses);
                        });
                        subList.appendChild(listItem);
                    }

                    
                });
    
                categoryItem.appendChild(subList);
                courseList.appendChild(categoryItem);
            });
    
            majorDiv.appendChild(courseList);
            majorsContainer.appendChild(majorDiv);
        });
    }
    
    
    
    

    // Function to handle course selection
    function handleCourseSelection(listItem, category, courses) {
        const maxSelections = getMaxSelections(category);
        const selectedItems = listItem.parentNode.querySelectorAll('.selected');

        if (listItem.classList.contains('selected')) {
            listItem.classList.remove('selected');
            delete selectionState[listItem.textContent];
        } else {
            if (selectedItems.length < maxSelections) {
                listItem.classList.add('selected');
                selectionState[listItem.textContent] = true;
            }
        }
    }

    // Function to determine maximum selections allowed based on category
    function getMaxSelections(category) {
        if (category.includes('One')) {
            return 1;
        } else if (category.includes('Two')) {
            return 2;
        } else if (category.includes('Three')) {
            return 3;
        } else if (category.includes('Four')) {
            return 4;
        } else if (category.includes('All')) {
            return Number.MAX_SAFE_INTEGER;
        }
        return 0;
    }

    /* PARSING TEST */
    

    async function processMajors(year, majors) {
        const majorsData = [];
    
        // Map each major to a promise returned by majors_csv
        const promises = majors.map(major => {
            return majors_csv(year, major)
                .then(majorData => {
                    if (majorData && majorData.Requirements) {
                        // Parse majorData.Requirements if it's a JSON string
                        let requirements;
                        if (typeof majorData.Requirements === 'string') {
                            try {
                                requirements = JSON.parse(majorData.Requirements.replace(/'/g, '"'));
                            } catch (error) {
                                console.error(`Error parsing Requirements for major ${major}:`, error);
                                return null;
                            }
                        } else {
                            requirements = majorData.Requirements;
                        }
    
                        // Ensure requirements is an array of arrays
                        const formattedMajorData = {
                            name: majorData.Major,
                            courses: Object.entries(requirements).map(([category, courses]) => [category, courses])
                        };
                        return formattedMajorData;
                    } else {
                        console.log(`No or invalid Requirements found for major: ${major}`);
                        return null;
                    }
                })
                .catch(error => {
                    console.error(`Error fetching major: ${major}`, error);
                    return null;
                });
        });
    
        // Wait for all promises to resolve
        const results = await Promise.all(promises);
    
        // Filter out null results (if any major fetching failed)
        results.forEach(result => {
            if (result) {
                majorsData.push(result);
            }
        });
    
        // Set globalMajorsData if needed
        globalMajorsData = majorsData;
    
        return majorsData;
    }
    
    
    // Example usage
    
    
});
