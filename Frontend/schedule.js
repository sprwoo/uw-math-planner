document.addEventListener('DOMContentLoaded', () => {
    let selectedCourses = JSON.parse(localStorage.getItem("selectedCourses"));
    let courses = selectedCourses ? selectedCourses : [];
    console.log(courses);

    const coursesContainer = document.getElementById('courses-container');
    const scheduleCells = document.querySelectorAll('.droppable');

    // Function to extract course code from full course name
    function extractCourseCode(courseName) {
        // Regular expression to find the first alphanumeric sequence with spaces and digits
        const match = courseName.match(/\b[A-Za-z]+\s\d+\b/);
        return match ? match[0].trim() : ''; // Return the matched string or an empty string if no match
    }

    // Function to create course cards
    function createCourseCard(courseName) {
        const courseCode = extractCourseCode(courseName);
        const card = document.createElement('div');
        card.classList.add('course-card');
        card.textContent = courseCode; // Display only the course code
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
            const clonedCard = event.target.cloneNode(true); // Clone the card
            event.target.remove(); // Remove the original card from the table
            coursesContainer.appendChild(clonedCard); // Append the cloned card back to the courses container
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
                if (cell.childNodes.length === 1 && cell.firstChild.tagName === 'INPUT') {
                    cell.appendChild(dragged.cloneNode(true)); // Clone the card
                    dragged.remove(); // Remove the original card from the container
                    cell.removeChild(cell.firstChild); // Remove the input field
                }
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

        // Add click event listener to return the card back to coursesContainer
        cell.addEventListener('click', (event) => {
            if (event.target.classList.contains('course-card')) {
                const clonedCard = event.target.cloneNode(true); // Clone the card
                event.target.remove(); // Remove the original card from the table
                coursesContainer.appendChild(clonedCard); // Append the cloned card back to the courses container
            }
        });
    });
});
