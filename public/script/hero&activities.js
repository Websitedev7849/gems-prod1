const hiddenActivitiesDiv = document.querySelectorAll(".hidden-activity");

const showMoreBtn = document.querySelector("#showMoreBtn")
const showLessBtn = document.querySelector("#showLessBtn")

showMoreBtn.addEventListener("click", e => {
    hiddenActivitiesDiv.forEach(elm => {
        elm.classList.remove("d-none")
        showMoreBtn.classList.add("d-none")
        showLessBtn.classList.remove("d-none")
    });
})

showLessBtn.addEventListener("click", e => {
    hiddenActivitiesDiv.forEach(elm => {
        elm.classList.add("d-none")
        showLessBtn.classList.add("d-none")
        showMoreBtn.classList.remove("d-none")
    });
})