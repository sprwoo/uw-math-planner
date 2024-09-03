document.addEventListener('DOMContentLoaded', () => {
    let selectedCourses = JSON.parse(localStorage.getItem("selectedCourses"));
    let courses = selectedCourses ? selectedCourses : [];
    console.log(courses);

    // Function to clean course descriptions and format course codes

    const cleanedCourses = cleanCourseDescriptions(courses);
    const newCourses = removeDuplicates(cleanedCourses);
    // newCourses.push("TEST");

    const coursesContainer = document.getElementById('courses-container');
    const scheduleCells = document.querySelectorAll('.droppable');
    let draggedCourses = [];
    let scheduleCourses = [];

    // Function to create course cards
    function createCourseCard(courseCode) {
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

    // Create course cards for each course in cleanedCourses
    newCourses.forEach(course => {
        createCourseCard(course);
    });

    // Handle drag and drop
    let dragged;

    // Handle pick up and drop
    let clicked;
    let isClicked = false;

    // Start of drag
    coursesContainer.addEventListener('dragstart', (event) => {
        dragged = event.target;
        dragged.classList.add('dragging');
        event.dataTransfer.effectAllowed = 'move';
    });

    // End of drag
    coursesContainer.addEventListener('dragend', (event) => {
        dragged.classList.remove('dragging');
    });

    // Select and unselect for pick up
    coursesContainer.addEventListener('click', (event) => {
        clicked = event.target;

        if (!isClicked) { // If nothing else is selected, select this card
            clicked.classList.add('clicked');
            isClicked = true;
        } else { // Prevents other cards from being selected
             // If the clicked card is the selected card, unselect it
            if (clicked.classList.contains('clicked')) {
                clicked.classList.remove('clicked');
                isClicked = false;
            }
        }
    })

    scheduleCells.forEach(cell => {
        cell.addEventListener('dragover', (event) => {
            event.preventDefault();
            event.dataTransfer.dropEffect = 'move';
        });

        cell.addEventListener('drop', (event) => {
            event.preventDefault();
            if (dragged && dragged.classList.contains('course-card')) {
                const courseCode = dragged.textContent;

                // Check if the cell already contains a card
                if (cell.childNodes.length > 0 && cell.firstChild.classList.contains('course-card')) {
                    const existingCourseCode = cell.firstChild.textContent;
                    draggedCourses = draggedCourses.filter(code => code !== existingCourseCode);
                    scheduleCourses = scheduleCourses.filter(code => code !== existingCourseCode);
                    coursesContainer.appendChild(cell.firstChild);
                }

                // Allow duplicates if the dragged card is empty ("" content)
                if (courseCode === '') {
                    cell.innerHTML = '';
                    cell.appendChild(dragged);
                } else {
                    // Check if the course is already in scheduleCourses array
                    if (scheduleCourses.includes(courseCode)) {
                        return; // Prevent adding the same course to multiple cells
                    }
                    cell.innerHTML = '';
                    cell.appendChild(dragged);
                    draggedCourses.push(courseCode);
                    scheduleCourses.push(courseCode);
                }
            }
        });

        cell.addEventListener('click', (event) => {
            event.preventDefault();
            if (clicked && clicked.classList.contains('course-card') && clicked.classList.contains('clicked')) {
                const courseCode = clicked.textContent;
                // Check if the cell already contains a card
                if (cell.childNodes.length > 0 && cell.firstChild.classList.contains('course-card')) {
                    const existingCourseCode = cell.firstChild.textContent;
                    draggedCourses = draggedCourses.filter(code => code !== existingCourseCode);
                    scheduleCourses = scheduleCourses.filter(code => code !== existingCourseCode);
                    coursesContainer.appendChild(cell.firstChild);
                }

                // Allow duplicates if the dragged card is empty ("" content)
                if (courseCode === '') {
                    cell.innerHTML = '';
                    cell.appendChild(clicked);
                } else {
                    // Check if the course is already in scheduleCourses array
                    if (scheduleCourses.includes(courseCode)) {
                        return; // Prevent adding the same course to multiple cells
                    }
                    cell.innerHTML = '';
                    cell.appendChild(clicked);
                    draggedCourses.push(courseCode);
                    scheduleCourses.push(courseCode);
                }
                clicked.classList.remove('clicked');
                isClicked = false;
            }
        });
    });

    // Turn into an Excel file
    document.querySelector('.submit-button').addEventListener('click', function() {
        var table = document.getElementById('schedule-table');
        var ws_data = [];
    
        // Add table headers (including empty corner cell)
        var headers = ['Semester/Course']; // Initial header for the "Semester/Course" column
        headers = headers.concat(Array.from(table.querySelectorAll('thead th')).slice(1).map(th => th.textContent)); // Skip the first empty header
        ws_data.push(headers);
    
        // Add table data
        Array.from(table.querySelectorAll('tbody tr')).forEach(row => {
            var rowData = [];
            
            // Add semester name as the first element
            var semesterName = row.querySelector('th').textContent;
            rowData.push(semesterName);
    
            // Add course data
            Array.from(row.querySelectorAll('td')).forEach(td => {
                const courseCard = td.querySelector('.course-card'); // Check for course card element
                const input = td.querySelector('.cell-input'); // Check for input element
    
                // If a course card is present, use its text; otherwise, use input value if available
                if (courseCard) {
                    rowData.push(courseCard.textContent.trim());
                } else if (input && input.value) {
                    rowData.push(input.value.trim());
                } else {
                    rowData.push(''); // Empty cell
                }
            });
    
            ws_data.push(rowData);
        });
    
        // Create a workbook and a worksheet
        var ws = XLSX.utils.aoa_to_sheet(ws_data);
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Schedule");
    
        // Set column widths (you can adjust these widths as needed)
        ws['!cols'] = [{ width: 20 }].concat(new Array(headers.length - 1).fill({ width: 15 }));
    
        // Style the headers (optional)
        headers.forEach((header, index) => {
            const cellRef = XLSX.utils.encode_cell({ c: index, r: 0 }); // Header row is row 0
            if (!ws[cellRef]) ws[cellRef] = {};
            ws[cellRef].s = {
                font: { bold: true, color: { rgb: "FFFFFF" } },
                fill: { fgColor: { rgb: "4F81BD" } }
            };
        });
    
        // Generate Excel file and trigger download
        var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
        function s2ab(s) {
            var buf = new ArrayBuffer(s.length);
            var view = new Uint8Array(buf);
            for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        }
        var blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
        var link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "course_schedule.xlsx";
        document.body.appendChild(link); // Required for Firefox
        link.click(); // Trigger the download
        document.body.removeChild(link); // Clean up
    });
    
    
    
});

function cleanCourseDescriptions(courseArray) {
    return courseArray.map(course => {
        course = course.replace(/\n\s*/g, ' ').trim();

        const courseCodeMatch = course.match(/^([A-Z]+\s?\d+)/);
        if (courseCodeMatch) {
            const formattedCourseCode = courseCodeMatch[0];
            return formattedCourseCode;
        }
        return course;
    });
}

// Function to remove duplicates
function removeDuplicates(arr) {
    return [...new Set(arr)];
}
