const searchBtn = document.getElementById("search-btn");
const loginBtn = document.getElementById("login-btn");
const searchBar = document.querySelector(".search-bar-container");

const menuBar = document.getElementById("menu-bar");
const navbar = document.querySelector(".navbar");

const formCon = document.querySelector(".login-form-container");
const formClose = document.getElementById("form-close");
const form = document.getElementById("form");

const videos = document.querySelectorAll(".video");
const prevEl = document.querySelector(".prev");
const nextEl = document.querySelector(".next");

searchBtn.addEventListener("click", () => {
  searchBtn.classList.toggle("fa-times");
  searchBar.classList.toggle("active");
});

window.onscroll = () => {
  searchBtn.classList.remove("fa-times");
  searchBar.classList.remove("active");
};

function showMenu() {
  navbar.classList.toggle("active-menu");
}

function showForm() {
  formCon.style.top = "0px";
}

function hiddenForm() {
  formCon.style.top = null;
}

menuBar.addEventListener("click", showMenu);
loginBtn.addEventListener("click", showForm);
formClose.addEventListener("click", hiddenForm);

// Start Home Controls
const country = document.querySelector(".big-text");
let countries = ["Egypt", "Dubai", "luxurious", "Desert", "Seashore"];
let index = 0;
let counter = 0;

function showNextVideo() {
  videos[counter].classList.remove("live");
  counter = (counter + 1) % videos.length;
  videos[counter].classList.add("live");
  index = (index + 1) % countries.length;
  country.innerHTML = countries[index];
}

function showPrevVideo() {
  videos[counter].classList.remove("live");
  counter = (counter - 1 + videos.length) % videos.length;
  videos[counter].classList.add("live");
  index = (index - 1 + countries.length) % countries.length;
  country.innerHTML = countries[index];
}

nextEl.addEventListener("click", showNextVideo);
prevEl.addEventListener("click", showPrevVideo);

