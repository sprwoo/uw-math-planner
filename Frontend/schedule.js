document.addEventListener('DOMContentLoaded', () => {
    let selectedCourses = JSON.parse(localStorage.getItem("selectedCourses"));
    let courses = selectedCourses ? selectedCourses : [];
    console.log(courses);

    const coursesContainer = document.getElementById('courses-container');
    const scheduleCells = document.querySelectorAll('.droppable');

    // Function to create course cards
    function createCourseCard(courseName) {
        const card = document.createElement('div');
        card.classList.add('course-card');
        card.textContent = courseName;
        card.draggable = true;
        coursesContainer.appendChild(card);

        // Add drag event listeners
        card.addEventListener('dragstart', (event) => {
            event.target.classList.add('dragging');
            event.dataTransfer.setData('text/plain', courseName);
        });

        card.addEventListener('dragend', (event) => {
            event.target.classList.remove('dragging');
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
    });
});
