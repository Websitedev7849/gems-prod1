const hamburgerDiv = document.querySelector(".hamburger")
const navbar = document.querySelector(".navbar")
hamburgerDiv.addEventListener("click", e => {
    navbar.classList.toggle("navbar-opened")
})