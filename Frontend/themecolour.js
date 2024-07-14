let mode = localStorage.getItem("themeColour");
const themeToggle = document.querySelector("#theme-toggle");

const changeTheme = () => {
    if (themeToggle.checked) {
        document.body.classList.add('darkmode');
        localStorage.setItem("themeColour", "dark");
    } else {
        document.body.classList.remove('darkmode');
        localStorage.setItem("themeColour", "light");
    }
}

// Initialize theme based on localStorage
if (localStorage.getItem("themeColour") === "dark") {
    document.body.classList.add('darkmode');
    themeToggle.checked = true;
} else {
    themeToggle.checked = false;
}

themeToggle.addEventListener("change", function() {
    changeTheme();
});
