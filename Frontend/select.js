document.addEventListener('DOMContentLoaded', function() {
    var max = 3;
    var majors = [];
    var minors = [];

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

    // Dropdown Functionality
    const wrapper = document.querySelector(".wrapper"),
          selectBtn = wrapper.querySelector(".select-btn"),
          searchInp = wrapper.querySelector("input"),
          options = wrapper.querySelector(".options");

    let countries = ["Placeholder", "TEST"];

    function addCountry(selectedCountry) {
        options.innerHTML = "";
        countries.forEach(country => {
            let isSelected = country == selectedCountry ? "selected" : "";
            let li = `<li onclick="updateName(this)" class="${isSelected}">${country}</li>`;
            options.insertAdjacentHTML("beforeend", li);
        });
    }

    function updateName(selectedLi) {
        searchInp.value = "";
        addCountry(selectedLi.innerText);
        wrapper.classList.remove("active");
        selectBtn.firstElementChild.innerText = selectedLi.innerText;
    }

    addCountry();

    searchInp.addEventListener("keyup", () => {
        let arr = [];
        let searchWord = searchInp.value.toLowerCase();
        arr = countries.filter(data => {
            return data.toLowerCase().startsWith(searchWord);
        }).map(data => {
            let isSelected = data == selectBtn.firstElementChild.innerText ? "selected" : "";
            return `<li onclick="updateName(this)" class="${isSelected}">${data}</li>`;
        }).join("");
        options.innerHTML = arr ? arr : `<p style="margin-top: 10px;">Oops! Country not found</p>`;
    });

    selectBtn.addEventListener("click", () => wrapper.classList.toggle("active"));

    // Ensure updateName is globally accessible
    window.updateName = updateName;
});
