const hamburgerDiv = document.querySelector(".hamburger")
const navbar = document.querySelector(".navbar")
const navlinks = document.querySelectorAll(".navlinks a")

hamburgerDiv.addEventListener("click", e => {
    navbar.classList.toggle("navbar-opened")
})

navlinks.forEach(elm => {
    elm.addEventListener("click", e => {
        navbar.classList.toggle("navbar-opened")
    })
});