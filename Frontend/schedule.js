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

document.addEventListener("DOMContentLoaded", function() {
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