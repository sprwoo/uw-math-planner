document.addEventListener('DOMContentLoaded', function() {
    var max = 3; // Maximum number of checkboxes allowed to be checked for years
    var majors = [];
    var minors = [];
    var year = ""; // Variable to store selected year

    // Define selectiveCheck function
    function selectiveCheck(event) {
        var checkboxType = this.getAttribute('name');
        var checkedChecks = document.querySelectorAll('input[name="' + checkboxType + '"]:checked');

        // Handle maximum selection logic
        if (checkedChecks.length > max && checkboxType !== 'years') {
            event.preventDefault();
            this.checked = false;
            return false;
        } else if (checkboxType === 'years' && checkedChecks.length > 1) {
            console.log("YEAR TEST");
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

    // Toggle Switch Functionality
    var toggleSwitch = document.getElementById('majorToggle');
    if (toggleSwitch) {
        toggleSwitch.addEventListener('change', function() {
            if (toggleSwitch.checked) {
                localStorage.setItem('toggleSetting', 'DOUBLE');
            } else {
                localStorage.setItem('toggleSetting', 'JOINT');
            }
            console.log('Toggle setting:', localStorage.getItem('toggleSetting'));
        });
    } else {
        console.error('Toggle switch element not found');
    }

});
