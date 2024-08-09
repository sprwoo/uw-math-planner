document.addEventListener('DOMContentLoaded', function() {
    // let majorsstorage = localStorage.getItem("majors");
    // console.log(majorsstorage);

    var max = 3; // Maximum number of checkboxes allowed to be checked for years
    var majors = [];
    var minors = [];
    var year = ""; // Variable to store selected year
    var custom = []; // Array to store custom textbox content

    // Set initial toggle setting to "DOUBLE"
    localStorage.setItem('toggleSetting', 'DOUBLE');

    // Define selectiveCheck function
    function selectiveCheck(event) {
        var checkboxType = this.getAttribute('name');
        var checkedChecks = document.querySelectorAll('input[name="' + checkboxType + '"]:checked');

        // Handle maximum selection logic
        if (checkboxType !== 'years') {
            var totalMinors = checkedChecks.length + custom.length;

            if (totalMinors > max) {
                event.preventDefault();
                this.checked = false;
                return false;
            }
        } else if (checkboxType === 'years' && checkedChecks.length > 1) {
            event.preventDefault();
            this.checked = false;
            return false;
        }

        // Store selected checkboxes in respective arrays and localStorage
        if (checkboxType === 'majors') {
            majors = Array.from(checkedChecks).map(function(checkbox) {
                return checkbox.id;
            });
            localStorage.setItem("majors", JSON.stringify(majors));
            console.log('Selected majors:', majors);

        } else if (checkboxType === 'minors') {
            minors = Array.from(checkedChecks).map(function(checkbox) {
                return checkbox.id;
            });
            localStorage.setItem("minors", JSON.stringify(minors));
            console.log('Selected minors:', minors);

        } else if (checkboxType === 'years') {
            year = checkedChecks.length > 0 ? checkedChecks[0].id : '';
            localStorage.setItem("year", year);
            console.log('Selected year:', year);
        }
    }

    // Function to update minors with custom text fields
    function updateMinors() {
        var customTextbox = document.querySelector('.textbox-custom');
        var customText = customTextbox.value.trim();

        // Clear custom array and add current custom text if it's not empty
        custom = [];
        if (customText) {
            custom.push(customText);
        }

        localStorage.setItem("custom", JSON.stringify(custom));
        console.log('Custom text:', custom);
    }

    // Add event listeners to checkboxes
    var majorCheckboxes = document.querySelectorAll('input[name="majors"]');
    majorCheckboxes.forEach(function(checkbox) {
        checkbox.addEventListener('click', selectiveCheck);
    });

    var minorCheckboxes = document.querySelectorAll('input[name="minors"]');
    minorCheckboxes.forEach(function(checkbox) {
        checkbox.addEventListener('click', selectiveCheck);
    });

    var yearCheckboxes = document.querySelectorAll('input[name="years"]');
    yearCheckboxes.forEach(function(checkbox) {
        checkbox.addEventListener('click', selectiveCheck);
    });

    // Add event listener to custom fields textbox
    var customTextbox = document.querySelector('.textbox-custom');
    customTextbox.addEventListener('input', updateMinors);

    // Load saved selections from localStorage on page load
    function loadSavedSelections() {
        var savedMajors = JSON.parse(localStorage.getItem("majors") || '[]');
        savedMajors.forEach(function(majorId) {
            var majorCheckbox = document.getElementById(majorId);
            if (majorCheckbox) {
                majorCheckbox.checked = true;
            }
            console.log(majorCheckbox);
        });

        var savedMinors = JSON.parse(localStorage.getItem("minors") || '[]');
        savedMinors.forEach(function(minorId) {
            var minorCheckbox = document.getElementById(minorId);
            if (minorCheckbox) {
                minorCheckbox.checked = true;
            }
        });

        var savedYear = localStorage.getItem("year") || '';
        var yearCheckbox = document.getElementById(savedYear);
        if (yearCheckbox) {
            yearCheckbox.checked = true;
        }

        var savedCustomField = JSON.parse(localStorage.getItem("custom") || '[]');
        if (savedCustomField.length > 0) {
            customTextbox.value = savedCustomField[0];
            updateMinors();
        }
    }

    // Clear custom textbox and arrays on page load
    function clearCustomField() {
        customTextbox.value = ''; // Clear the textbox
        custom = []; // Clear the custom array
        localStorage.setItem("custom", JSON.stringify(custom)); // Update localStorage
    }

    // Initialize the page
    loadSavedSelections(); // Load saved selections on page load
    clearCustomField(); // Clear custom field on refresh

    // Toggle Switch Functionality
    var toggleSwitch = document.getElementById('majorToggle');
    if (toggleSwitch) {
        // Set initial toggle state based on localStorage
        if (localStorage.getItem('toggleSetting') === 'JOINT') {
            toggleSwitch.checked = true;
        } else {
            toggleSwitch.checked = false;
        }

        toggleSwitch.addEventListener('change', function() {
            if (toggleSwitch.checked) {
                localStorage.setItem('toggleSetting', 'JOINT');
            } else {
                localStorage.setItem('toggleSetting', 'DOUBLE');
            }
            console.log('Toggle setting:', localStorage.getItem('toggleSetting'));
        });
    } else {
        console.error('Toggle switch element not found');
    }

    // Handle button click event
    var seeCoursesButton = document.querySelector('.button');
    if (seeCoursesButton) {
        seeCoursesButton.addEventListener('click', function() {
            // Update minors with custom text field before navigating
            updateMinors();
        });
    }
});
