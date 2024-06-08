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
                ["Elective:", ["CS 240", "CS 241"]]
            ]
        }
        // Add more major/minor objects as needed
    ];

    majorsData.forEach(major => {
        const majorDiv = document.createElement('div');
        majorDiv.classList.add('major');
        
        const majorTitle = document.createElement('h2');
        majorTitle.textContent = major.name;
        majorDiv.appendChild(majorTitle);
        
        const courseList = document.createElement('ul');
        courseList.classList.add('course-list');
        
        major.courses.forEach(([title, courses]) => {
            const listItem = document.createElement('li');
            listItem.textContent = title;
            
            const subList = document.createElement('ul');
            courses.forEach(course => {
                const subListItem = document.createElement('li');
                subListItem.textContent = course;
                subList.appendChild(subListItem);
            });
            
            listItem.appendChild(subList);
            courseList.appendChild(listItem);
        });
        
        majorDiv.appendChild(courseList);
        majorsContainer.appendChild(majorDiv);
    });
});
