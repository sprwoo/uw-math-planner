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
            console.log('Selected majors:', selectedMajors);
        } else if (checkboxType === 'minors') {
            selectedMinors = Array.from(checkedChecks).map(function(checkbox) {
                return checkbox.id;
            });
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

console.log("hello");