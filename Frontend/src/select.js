document.addEventListener('DOMContentLoaded', function() {
    var max = 3; // Maximum number of checkboxes allowed to be checked for years
    var majors = [];
    var minors = [];
    var year = ""; // Variable to store selected year
    var custom = []; // Array to store custom textbox content

    // Set initial toggle setting to "DOUBLE"
    if (!localStorage.getItem('toggleSetting')) {
        localStorage.setItem('toggleSetting', 'DOUBLE');
    }

    // Clear localStorage data on page load to reset selections
    localStorage.removeItem("majors");
    localStorage.removeItem("minors");
    localStorage.removeItem("year");
    localStorage.removeItem("custom");

    window.addEventListener( "pageshow", function ( event ) {
        var historyTraversal = event.persisted || 
                               ( typeof window.performance != "undefined" && 
                                    window.performance.navigation.type === 2 );
        if ( historyTraversal ) {
          window.location.reload();
        }
      });

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
        checkbox.checked = false; // Uncheck all major checkboxes on page load
    });

    var minorCheckboxes = document.querySelectorAll('input[name="minors"]');
    minorCheckboxes.forEach(function(checkbox) {
        checkbox.addEventListener('click', selectiveCheck);
        checkbox.checked = false; // Uncheck all minor checkboxes on page load
    });

    var yearCheckboxes = document.querySelectorAll('input[name="years"]');
    yearCheckboxes.forEach(function(checkbox) {
        checkbox.addEventListener('click', selectiveCheck);
        checkbox.checked = false; // Uncheck all year checkboxes on page load
    });

    // Add event listener to custom fields textbox
    var customTextbox = document.querySelector('.textbox-custom');
    customTextbox.value = ''; // Clear the custom textbox on page load
    customTextbox.addEventListener('input', updateMinors);

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
