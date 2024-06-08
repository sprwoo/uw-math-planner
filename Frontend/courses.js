document.addEventListener('DOMContentLoaded', () => {
    const majorsContainer = document.getElementById('majors-container');

    const majorsData = [
        {
            name: "STATISTICS",
            courses: [
                ["One of the following:", ["MATH 137", "MATH 147"]],
                ["Core Course:", ["STAT 230"]],
                ["Elective:", ["STAT 231", "STAT 333"]]
            ]
        },
        {
            name: "COMPUTER SCIENCE",
            courses: [
                ["One of the following:", ["CS 115", "CS 135"]],
                ["Core Course:", ["CS 136"]],
                ["Elective:", ["CS 240", "MATH 137"]]
            ]
        },
        {
            name: "COMPUTER SCIENCE",
            courses: [
                ["One of the following:", ["CS 245", "CS 341"]],
                ["Core Course:", ["MATH 147"]],
                ["Elective:", ["STAT 333", "CO 250"]]
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
                
                if (courseCount[course] > 1) {
                    listItem.textContent = `${course}`;
                    listItem.classList.add('matched-course');
                } else {
                    listItem.textContent = course;
                }
                
                subList.appendChild(listItem);
            });

            categoryItem.appendChild(subList);
            courseList.appendChild(categoryItem);
        });
        
        majorDiv.appendChild(courseList);
        majorsContainer.appendChild(majorDiv);
    });
});
