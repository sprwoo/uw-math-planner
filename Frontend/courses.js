
//Light and Dark Mode
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

    //Pop-up temporary info
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

    //Major temporary info
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
                ["Choose 3 of:", ["CS 240", "CS 245", "CS 341"]]
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

    //Creates the courses using the array of major objects
    function createCourseItem(course) {
        const courseItem = document.createElement('li');
        courseItem.className = 'course-item';
        courseItem.textContent = course;

        const popup = document.createElement('div');
        popup.className = 'course-popup';
        popup.innerHTML = `<strong>${course}</strong><br>Pre-reqs: ${courseDetails[course].prereqs}<br>Description: ${courseDetails[course].description}`;
        courseItem.appendChild(popup);

        courseItem.addEventListener('click', () => {
            courseItem.classList.toggle('selected');
        });

        return courseItem;
    }

    majorsData.forEach(major => {
        const majorContainer = document.createElement('div');
        majorContainer.className = 'major';

        const majorTitle = document.createElement('h2');
        majorTitle.textContent = major.name;
        majorContainer.appendChild(majorTitle);

        const courseList = document.createElement('ul');
        courseList.className = 'course-list';

        major.courses.forEach(courseGroup => {
            const courseGroupItem = document.createElement('li');
            courseGroupItem.textContent = courseGroup[0];

            const subCourseList = document.createElement('ul');
            courseGroup[1].forEach(course => {
                subCourseList.appendChild(createCourseItem(course));
            });

            courseGroupItem.appendChild(subCourseList);
            courseList.appendChild(courseGroupItem);
        });

        majorContainer.appendChild(courseList);
        majorsContainer.appendChild(majorContainer);
    });
});
