document.addEventListener('DOMContentLoaded', function() {
    var checks = document.querySelectorAll('input[name="majors"]');
    var max = 2;

    for (var i = 0; i < checks.length; i++) {
        checks[i].onclick = selectiveCheck;
    }

    function selectiveCheck(event) {
        var checkedChecks = document.querySelectorAll('input[name="majors"]:checked');
        
        if (checkedChecks.length >= max + 1) {
            event.preventDefault(); // Prevent further checks if limit is reached
            return false;
        }
    }
});

document.addEventListener('DOMContentLoaded', function() {
    var checks = document.querySelectorAll('input[name="minors"]');
    var max = 2;

    for (var i = 0; i < checks.length; i++) {
        checks[i].onclick = selectiveCheck;
    }

    function selectiveCheck(event) {
        var checkedChecks = document.querySelectorAll('input[name="minors"]:checked');
        
        if (checkedChecks.length >= max + 1) {
            event.preventDefault(); // Prevent further checks if limit is reached
            return false;
        }
    }
});