let mode = localStorage.getItem("themeColour");
const themeToggle = document.querySelector("#theme-toggle");

const changeDark = () => {
    document.body.classList.add('darkmode');
    localStorage.setItem("themeColour", "dark");
}

const changeLight = () => {
    document.body.classList.remove('darkmode');
    localStorage.setItem("themeColour", "light");
}

if (localStorage.getItem("themeColour") === "dark") {
    changeDark();
}

themeToggle.addEventListener("click", function() {
    if (localStorage.getItem("themeColour") === "light") {
        changeDark();
    } else {
        changeLight();
    }
})