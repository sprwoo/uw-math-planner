document.addEventListener('DOMContentLoaded', () => {
    const majorsContainer = document.getElementById('majors-container');
    const themeToggle = document.createElement('button');
    themeToggle.textContent = 'Toggle Dark Mode';
    themeToggle.classList.add('theme-toggle');
    document.body.appendChild(themeToggle);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
    });

    // Temporary course details
    const courseDetails = {
        "MATH 137": { prereqs: "None", description: "Calculus 1" },
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

    // Temporary majors data
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

    const courseCount = {};
    majorsData.forEach(major => {
        major.courses.forEach(([category, courses]) => {
            courses.forEach(course => {
                courseCount[course] = (courseCount[course] || 0) + 1;
            });
        });
    });

    // Render majors and courses
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

                // Add event listener for pop-up display on hover
                listItem.addEventListener('mouseenter', () => {
                    const coursePopup = listItem.querySelector('.course-popup');
                    if (coursePopup) {
                        coursePopup.style.display = 'block';
                    }
                });

                listItem.addEventListener('mouseleave', () => {
                    const coursePopup = listItem.querySelector('.course-popup');
                    if (coursePopup) {
                        coursePopup.style.display = 'none';
                    }
                });

                // Add event listener for selection
                listItem.addEventListener('click', () => {
                    handleCourseSelection(listItem, category, courses);
                });

                subList.appendChild(listItem);
            });

            categoryItem.appendChild(subList);
            courseList.appendChild(categoryItem);
        });

        majorDiv.appendChild(courseList);
        majorsContainer.appendChild(majorDiv);
    });

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
});
