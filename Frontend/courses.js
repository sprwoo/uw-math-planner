import { requirements_csv, courses_csv } from '../csvreader2.js';
localStorage.removeItem('selectedCourses');

let globalMajorsData = [];
let majorsFromStorage = JSON.parse(localStorage.getItem("majors"));
let minorsFromStorage = JSON.parse(localStorage.getItem("minors"));
let majors = majorsFromStorage ? majorsFromStorage : [];
let minors = minorsFromStorage ? minorsFromStorage : [];
let selectedCourses = [];
let selectionState = {};

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

        const majorsData = await processMajors(year, majors, "Major");
        const minorsData = await processMajors(year, minors, "Minor");

        // Log or use majorsData as needed
        console.log("Processed Majors Data:");
        console.log(majorsData);

        // Clear existing content in majorsContainer
        majorsContainer.innerHTML = "";

        // Example usage: Render majors data in the DOM
        renderMajors(majorsData); // Replace with your actual rendering function
        renderMajors(minorsData);
    } catch (error) {
        console.error("Error in main application:", error);
    }

    // Render majors and courses
    function renderMajors(majorsData) {
        const courseCount = {};
        const courseInAllMajors = {}; // Track courses that appear in all majors

        // Initialize course count and track courses appearing in all majors
        majorsData.forEach(major => {
            major.courses.forEach(([category, courses]) => {
                courses.forEach(course => {
                    courseCount[course] = (courseCount[course] || 0) + 1;
                    if (!courseInAllMajors[course]) {
                        courseInAllMajors[course] = new Set();
                    }
                    courseInAllMajors[course].add(major.name);
                });
            });
        });

        // Identify courses that appear in both majors and more than once
        const matchedCourses = Object.keys(courseCount).filter(course => {
            return courseCount[course] > 1 && courseInAllMajors[course].size === 2;
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

                    // Check if the course should be marked as matched-course
                    if (matchedCourses.includes(course)) {
                        listItem.classList.add('matched-course');
                    } else {
                        listItem.classList.remove('matched-course');
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

                    if (selectedCourses.includes(course)) {
                        listItem.classList.add('selected');
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
                            handleCourseSelection(mainListItem, orCourses);
                        });
                        subList.appendChild(mainListItem);

                        orCourses.forEach(orCourse => {
                            const subListItem = document.createElement('li');
                            subListItem.textContent = orCourse;
                            subListItem.classList.add('course-sub-item');
                            subListItem.addEventListener('click', () => {
                                handleCourseSelection(subListItem, [mainCourse]);
                            });
                        
                            // Append each subListItem to subList
                            subList.appendChild(subListItem);
                        });
                    } else {
                        listItem.addEventListener('click', () => {
                            handleCourseSelection(listItem);
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
    function handleCourseSelection(listItem, relatedCourses = []) {
        const maxSelections = getMaxSelections(listItem.parentNode.parentNode.textContent);
        const selectedItems = listItem.parentNode.querySelectorAll('.selected');

        if (listItem.classList.contains('selected')) {
            listItem.classList.remove('selected');
            delete selectionState[listItem.textContent];
            // Remove course from selectedCourses
            const index = selectedCourses.indexOf(listItem.textContent);
            if (index > -1) {
                selectedCourses.splice(index, 1);
            }
        } else {
            if (selectedItems.length < maxSelections) {
                listItem.classList.add('selected');
                selectionState[listItem.textContent] = true;
                // Add course to selectedCourses
                selectedCourses.push(listItem.textContent);

                // Deselect related courses
                relatedCourses.forEach(course => {
                    const relatedItem = Array.from(listItem.parentNode.children).find(item => item.textContent === course);
                    if (relatedItem) {
                        relatedItem.classList.remove('selected');
                        const index = selectedCourses.indexOf(relatedItem.textContent);
                        if (index > -1) {
                            selectedCourses.splice(index, 1);
                        }
                    }
                });
            }
        }
        localStorage.setItem('selectedCourses', JSON.stringify(selectedCourses)); // Update local storage
        console.log('Selected Courses:', selectedCourses); // Log selected courses for debugging
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

    async function processMajors(year, majors, type) {
        const majorsData = [];
    
        // Map each major to a promise returned by requirements_csv
        const promises = majors.map(major => {
            return requirements_csv(year, major, type)
                .then(majorData => {
                    if (majorData && majorData.Requirements) {
                        let requirements;
                        if (typeof majorData.Requirements === 'string') {
                            try {
                                // Debugging log to check the raw JSON string
                                console.log(`Raw Requirements for ${major}: ${majorData.Requirements}`);
                                
                                // Attempt to fix common JSON issues
                                const fixedJsonString = majorData.Requirements
                                    .replace(/'/g, '"')  // Replace single quotes with double quotes
                                    .replace(/\\'/g, "'") // Fix escaped single quotes
                                    .replace(/\\"/g, '"'); // Fix escaped double quotes
    
                                // Parse the cleaned JSON string
                                requirements = JSON.parse(fixedJsonString);
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
    
});
