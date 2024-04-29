document.addEventListener('DOMContentLoaded', function() {
    var max = 2;
    var selectedMajors = [];
    var selectedMinors = [];

    // Define selectiveCheck function
    function selectiveCheck(event) {
        var checkboxType = this.getAttribute('name');
        var checkedChecks = document.querySelectorAll('input[name="' + checkboxType + '"]:checked');
        
        if (checkedChecks.length > max) {
            event.preventDefault(); 
            this.checked = false; 
            return false;
        }

        if (checkboxType === 'majors') {
            selectedMajors = Array.from(checkedChecks).map(function(checkbox) {
                return checkbox.id;
            });
            localStorage.setItem("majorVar", JSON.stringify(selectedMajors)); 
            console.log('Selected majors:', selectedMajors);

        } else if (checkboxType === 'minors') {
            selectedMinors = Array.from(checkedChecks).map(function(checkbox) {
                return checkbox.id;
            });
            localStorage.setItem("minorVar", JSON.stringify(selectedMinors));
            //To turn back to array after, use: JSON.parse(localStorage.getItem("majorVar")) || []; // Retrieve from localStorage or initialize as empty array
            console.log('Selected minors:', selectedMinors);
        }
    }


    var majorCheckboxes = document.querySelectorAll('input[name="majors"]');
    majorCheckboxes.forEach(function(checkbox) {
        checkbox.addEventListener('click', selectiveCheck);
    });


    var minorCheckboxes = document.querySelectorAll('input[name="minors"]');
    minorCheckboxes.forEach(function(checkbox) {
        checkbox.addEventListener('click', selectiveCheck);
    });
});
