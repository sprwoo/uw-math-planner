document.addEventListener('DOMContentLoaded', () => {
    let selectedCourses = JSON.parse(localStorage.getItem("selectedCourses"));
    let courses = selectedCourses ? selectedCourses : [];
    console.log(courses);

    const coursesContainer = document.getElementById('courses-container');
    const scheduleCells = document.querySelectorAll('.droppable');
    let draggedCourses = [];
    let scheduleCourses = [];

    // Function to extract course code from full course name
    function extractCourseCode(courseName) {
        const match = courseName.match(/\b[A-Za-z]+\s\d+\b/);
        return match ? match[0].trim() : ''; 
    }

    // Function to create course cards
    function createCourseCard(courseName) {
        const courseCode = extractCourseCode(courseName);
        const card = document.createElement('div');
        card.classList.add('course-card');
        card.textContent = courseCode; 
        card.draggable = true;
        coursesContainer.appendChild(card);

        // Add drag event listeners
        card.addEventListener('dragstart', (event) => {
            event.target.classList.add('dragging');
            event.dataTransfer.setData('text/plain', courseCode);
        });

        card.addEventListener('dragend', (event) => {
            event.target.classList.remove('dragging');
        });

        // Add click event listener to drag the card back out of the table
        card.addEventListener('click', (event) => {
            const courseCode = event.target.textContent;
            draggedCourses = draggedCourses.filter(code => code !== courseCode); 
            scheduleCourses = scheduleCourses.filter(code => code !== courseCode);
            coursesContainer.appendChild(event.target); 
        });
    }

    // Create course cards for each course in selectedCourses
    courses.forEach(course => {
        createCourseCard(course);
    });

    // Handle drag and drop
    let dragged;

    coursesContainer.addEventListener('dragstart', (event) => {
        dragged = event.target;
        dragged.classList.add('dragging');
        event.dataTransfer.effectAllowed = 'move';
    });

    coursesContainer.addEventListener('dragend', (event) => {
        dragged.classList.remove('dragging');
    });

    scheduleCells.forEach(cell => {
        cell.addEventListener('dragover', (event) => {
            event.preventDefault();
            event.dataTransfer.dropEffect = 'move';
        });

        cell.addEventListener('drop', (event) => {
            event.preventDefault();
            if (dragged && dragged.classList.contains('course-card')) {
                const courseCode = dragged.textContent;

                // Check if the course is already in scheduleCourses array
                if (scheduleCourses.includes(courseCode)) {
                    return; // Prevent adding the same course to multiple cells
                }

                // Check if the cell already contains a card
                if (cell.childNodes.length > 0 && cell.firstChild.classList.contains('course-card')) {
                    const existingCourseCode = cell.firstChild.textContent;
                    draggedCourses = draggedCourses.filter(code => code !== existingCourseCode);
                    scheduleCourses = scheduleCourses.filter(code => code !== existingCourseCode);
                    coursesContainer.appendChild(cell.firstChild);
                }

                cell.innerHTML = ''; 
                cell.appendChild(dragged); 
                draggedCourses.push(courseCode); 
                scheduleCourses.push(courseCode); 
            }
        });

        // Add focus event listener to the input field
        cell.querySelector('.cell-input').addEventListener('focus', (event) => {
            event.target.select();
        });

        // Add blur event listener to the input field to update cell text
        cell.querySelector('.cell-input').addEventListener('blur', (event) => {
            const input = event.target;
            if (input.value.trim() !== '') {
                const span = document.createElement('span');
                span.textContent = input.value.trim();
                input.replaceWith(span);
            }
        });

        // Allow clicking the span to edit the cell content again
        cell.addEventListener('click', (event) => {
            if (event.target.tagName === 'SPAN') {
                const span = event.target;
                const input = document.createElement('input');
                input.type = 'text';
                input.className = 'cell-input';
                input.value = span.textContent;
                span.replaceWith(input);
                input.focus();
            }
        });
    });

    // Export to Google Sheets
    document.getElementById('export').addEventListener('click', () => {
        const tableData = [];

        scheduleCells.forEach(cell => {
            if (cell.firstChild && cell.firstChild.classList && cell.firstChild.classList.contains('course-card')) {
                tableData.push(cell.firstChild.textContent);
            } else {
                tableData.push('');
            }
        });

        fetch('/export', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data: tableData }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    });
});
