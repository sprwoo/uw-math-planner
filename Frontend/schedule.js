document.addEventListener('DOMContentLoaded', () => {
    let selectedCourses = JSON.parse(localStorage.getItem("selectedCourses"));
    let courses = selectedCourses ? selectedCourses : [];
    console.log(courses);

    const coursesContainer = document.getElementById('courses-container');

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
});
