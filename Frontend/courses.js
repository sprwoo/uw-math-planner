document.addEventListener('DOMContentLoaded', () => {
    const majorsContainer = document.getElementById('majors-container');

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
                ["Two of:", ["CS 136", "MATH 138", "CM 481"]],
                ["All of:", ["CS 240", "MATH 137"]]
            ]
        },
        {
            name: "COMPUTER SCIENCE",
            courses: [
                ["One of the following:", ["CS 245", "CS 341"]],
                ["Two of:", ["MATH 147", "AMATH 250", "STAT 231"]],
                ["All of:", ["STAT 333", "CO 250", "CO 390", "STAT 444"]]
            ]
        }
        // Add more major/minor objects as needed
    ];

    // Count occurrences of courses
    const courseCount = {};
    majorsData.forEach(major => {
        major.courses.forEach(([category, courses]) => {
            courses.forEach(course => {
                courseCount[course] = (courseCount[course] || 0) + 1;
            });
        });
    });

    // Selection state
    const selectionState = {};

    // Render majors
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

    function getMaxSelections(category) {
        if (category.includes('One')) {
            return 1;
        } else if (category.includes('Two')) {
            return 2;
        } else if (category.includes('Three')) {
            return 3;
        } else if (category.includes('Four')) {
            return 4;
        }else if (category.includes('All')) {
            return Number.MAX_SAFE_INTEGER; 
        }
        return 0;
    }
});
