import { requirements_csv, courses_csv, lookup_courses } from '../csvreader.js';
 import { checkForX00, parseRequirement} from '../X00Listings.js';
localStorage.removeItem('selectedCourses');

let globalMajorsData = [];
let majorsFromStorage = JSON.parse(localStorage.getItem("majors"));
let minorsFromStorage = JSON.parse(localStorage.getItem("minors"));
let majorType = localStorage.getItem('toggleSetting');
let year = localStorage.getItem('year');
let majors = majorsFromStorage ? majorsFromStorage : [];
let minors = minorsFromStorage ? minorsFromStorage : [];
let selectedCourses = [];
let selectionState = {};

document.addEventListener('DOMContentLoaded', async () => {
    const majorsContainer = document.getElementById('majors-container');
    const errorContainer = document.getElementById('error-container');
    // Temporary course details
    const courseDetails = {
        
    };

    try {

        if (year === null || year === undefined || year === "") {
            year = "No Year Selected"; // Update the global variable if year is empty
        }
        const courses = [...majors, ...minors];
        const majorsData = await processMajors(year, courses, majorType);

        // Log or use majorsData as needed
        console.log("Processed Majors Data:");
        console.log(majorsData);

        // Clear existing content in majorsContainer
        majorsContainer.innerHTML = "";

        // Example usage: Render majors data in the DOM
        renderMajors(majorsData); // Replace with your actual rendering function
  
    } catch (error) {
        console.error("Error in main application:", error);
    }

    // Render majors and courses
    async function renderMajors(majorsData) {
        majorsContainer.innerHTML = "";
    
        const courseCount = {};
        const courseInAllMajors = {};
    
        // Initialize course count and track courses appearing in all majors
        majorsData.forEach(major => {
            major.courses.forEach(([category, courses]) => {
                courses.forEach(course => {
                    const individualCourses = course.split(" or ");
                    individualCourses.forEach(singleCourse => {
                        courseCount[singleCourse] = (courseCount[singleCourse] || 0) + 1;
                        if (!courseInAllMajors[singleCourse]) {
                            courseInAllMajors[singleCourse] = new Set();
                        }
                        courseInAllMajors[singleCourse].add(major.name);
                    });
                });
            });
        });
    
        // Identify courses that appear in both majors and more than once
        const matchedCourses = Object.keys(courseCount).filter(course => {
            return courseCount[course] > 1 && courseInAllMajors[course].size === 2;
        });
    
        // Iterate over each major to render its details
        for (const major of majorsData) {
            const majorDiv = document.createElement('div');
            majorDiv.classList.add('major');
    
            const majorTitle = document.createElement('h2');
            majorTitle.textContent = major.name;
            majorDiv.appendChild(majorTitle);
    
            const courseList = document.createElement('ul');
            courseList.classList.add('course-list');
    
            for (const [category, courses] of major.courses) {
                const categoryItem = document.createElement('li');
                categoryItem.classList.add('category');
                categoryItem.textContent = category;
    
                const subList = document.createElement('ul');
    
                for (const course of courses) {
                    const parsedRequirement = parseRequirement(course);
    
                    if (course.includes(" or ")) {
                        const orCourses = course.split(" or ");
                        const mainCourse = orCourses.shift(); // First course in the list
    
                        const mainListItem = document.createElement('li');
                        mainListItem.textContent = mainCourse;
                        mainListItem.classList.add('course-item');
                        subList.appendChild(mainListItem);
    
                        // Highlight the main course if it's a matched course or matches the pattern
                        if (matchedCourses.includes(mainCourse) || checkForX00(mainCourse)) {
                            mainListItem.classList.add('matched-course');
                        }
    
                        orCourses.forEach(orCourse => {
                            const subListItem = document.createElement('li');
                            subListItem.textContent = orCourse;
                            subListItem.classList.add('course-sub-item');
                            subList.appendChild(subListItem);
    
                            // Highlight the orCourse if it's a matched course or matches the pattern
                            if (matchedCourses.includes(orCourse) || checkForX00(orCourse)) {
                                subListItem.classList.add('matched-course');
                            }
                        });
    
                        // Event delegation for course selection
                        mainListItem.addEventListener('click', () => {
                            handleCourseSelection(mainListItem, orCourses);
                        });
    
                        // Add course details as pop-up
                        addCourseDetailsPopup(mainListItem, mainCourse);
                    } else {
                        const listItem = document.createElement('li');
                        listItem.textContent = course;
                        listItem.classList.add('course-item');
                        subList.appendChild(listItem);
    
                        // Highlight the course if it's a matched course or matches the pattern
                        if (matchedCourses.includes(course) || checkForX00(course)) {
                            listItem.classList.add('matched-course');
                        }
    
                        // Event delegation for course selection
                        listItem.addEventListener('click', () => {
                            handleCourseSelection(listItem);
                        });
    
                        // Add course details as pop-up
                        addCourseDetailsPopup(listItem, course);
                    }
                }
    
                categoryItem.appendChild(subList);
                courseList.appendChild(categoryItem);
            }
    
            majorDiv.appendChild(courseList);
            majorsContainer.appendChild(majorDiv);
        }
    }
    
    // Function to handle course selection
    function handleCourseSelection(listItem, relatedCourses = []) {
        if (listItem.classList.contains('selected')) {
            listItem.classList.remove('selected');
            // Remove course from selectedCourses
            const index = selectedCourses.indexOf(listItem.textContent);
            if (index > -1) {
                selectedCourses.splice(index, 1);
            }
        } else {
            if (selectedItems.length < maxSelections) {
                listItem.classList.add('selected');
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
        console.log('Max Selections:', maxSelections);
        console.log('Selected Courses:', selectedCourses); // Log selected courses for debugging
    }
    
    // Function to add course details as pop-up
    async function addCourseDetailsPopup(listItem, course) {
        const courseCodeMatch = course.match(/([A-Z]+)\s?(\d+)/);
        if (courseCodeMatch) {
            const courseCode = courseCodeMatch[1] + courseCodeMatch[2];
            try {
                const courseData = await lookup_courses(courseCode);
                const coursePopup = document.createElement('div');
                coursePopup.classList.add('course-popup');
                coursePopup.innerHTML = `
                    <p><strong>Description:</strong> ${(courseData.Description && courseData.Description.split('.')[0] + '.') || 'No description available.'}</p>
                    <p><strong>Prerequisites:</strong> ${courseData.Prerequisites || 'None'}</p>
                    <p><strong>Corequisites:</strong> ${courseData.Corequisites || 'None'}</p>
                    <p><strong>Antirequisites:</strong> ${courseData.Antirequisites || 'None'}</p>
                    `;
                listItem.appendChild(coursePopup);
            } catch (error) {
                console.error(error);
            }
        }
    }
    
    // Function to determine maximum selections allowed based on category
    function getMaxSelections(category) {
        if (category.includes('One ')) {
            console.log(1);
            return 1;
        } else if (category.includes('Two')) {
            console.log(2);
            return 2;
        } else if (category.includes('Three ')) {
            console.log(3);
            return 3;
        } else if (category.includes('Four ')) {
            console.log(4);
            return 4;
        } else if (category.includes('Five ')) {
            console.log(5); 
            return 5;
        } else if (category.includes('Six ')) {
            return 6;
        } else if (category.includes('All')) {
            return Number.MAX_SAFE_INTEGER;
        }
    
        return 0;
    }
    
    async function processMajors(year, majors, type) {
        const majorsData = [];
        const errorContainer = document.getElementById('error-container');
    
        // Clear previous errors
        errorContainer.innerHTML = '';
    
        // Adjust type for majors ending with "Minor"
        const majorCount = majors.filter(major => !major.endsWith("Minor")).length;
    
        majors = majors.map(major => {
            if (major.endsWith("Minor")) {
                return { name: major, type: "Minor" };
            } else {
                if (localStorage.getItem('toggleSetting') === 'JOINT' && majorCount > 1) {
                    return { name: `Joint ${major}`, type: "Major" };
                } else {
                    return { name: major, type: "Major" };
                }
            }
        });
    
        // Map each major to a promise returned by requirements_csv
        const promises = majors.map(major => {
            return requirements_csv(year, major.name, major.type)
                .then(majorData => {
                    if (majorData && majorData.Requirements) {
                        let requirements;
                        if (typeof majorData.Requirements === 'string') {
                            try {
                                // Debugging log to check the raw JSON string
                                console.log(`Raw Requirements for ${major.name}: ${majorData.Requirements}`);
    
                                // Attempt to fix common JSON issues
                                const fixedJsonString = majorData.Requirements
                                    .replace(/'/g, '"')  // Replace single quotes with double quotes
                                    .replace(/\\'/g, "'") // Fix escaped single quotes
                                    .replace(/\\"/g, '"') // Fix escaped double quotes
                                    .replace(/\\/g, ' ')
                                    .replace(/xa0/g, ' ');
    
                                // Parse the cleaned JSON string
                                requirements = JSON.parse(fixedJsonString);
                            } catch (error) {
                                console.error(`Error parsing Requirements for major ${major.name}:`, error);
                                // Display error message on the webpage
                                const errorMessage = document.createElement('p');
                                errorMessage.textContent = `Error parsing requirements for major ${major.name}. Please try again.`;
                                errorContainer.appendChild(errorMessage);
                                return null;
                            }
                        } else {
                            requirements = majorData.Requirements;
                        }
    
                        if (Array.isArray(requirements)) {
                            return { name: major.name, courses: requirements };
                        } else {
                            console.error(`Requirements for major ${major.name} are not an array.`);
                            // Display error message on the webpage
                            const errorMessage = document.createElement('p');
                            errorMessage.textContent = `Requirements for major ${major.name} are not an array.`;
                            errorContainer.appendChild(errorMessage);
                            return null;
                        }
                    } else {
                        console.error(`Invalid data format for major ${major.name}.`);
                        // Display error message on the webpage
                        const errorMessage = document.createElement('p');
                        errorMessage.textContent = `Invalid data format for major ${major.name}.`;
                        errorContainer.appendChild(errorMessage);
                        return null;
                    }
                })
                .catch(error => {
                    console.error(`Error fetching requirements for major ${major.name}:`, error);
                    return null;
                });
        });
    
        try {
            const results = await Promise.all(promises);
            results.forEach(result => {
                if (result) {
                    majorsData.push(result);
                }
            });
    
            // Debugging log to check majorsData after processing all majors
            console.log("Processed majorsData:", majorsData);
    
            renderMajors(majorsData);
        } catch (error) {
            console.error('Error processing majors:', error);
        }
    }
    
    
    
    

    console.log("COURSE LOOKUP");
    console.log(courseDetails);
});
