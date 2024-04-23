import { supabase, bootstrap, searchModal } from "./main";

// Import Images
import fq_black from "../assets/icon/faq-fill-black.svg";
import fq_white from "../assets/icon/faq-fill-white.svg";

// Modal for Search
const modalSearch = document.getElementById("searchModal");

modalSearch.onclick = searchModal;

// Top-bar change color on scroll
window.addEventListener("scroll", function () {
  var scrollPosition = window.scrollY;
  var topBar = document.querySelector(".top-bar");
  var searchBox = document.querySelector(".search_box");
  var introLogo = document.querySelector(".intro-logo");
  var introLogoPosition =
    introLogo.getBoundingClientRect().top + window.scrollY;
  var faqImage = document.querySelector(".faq img"); // select the img element

  if (scrollPosition > introLogoPosition) {
    topBar.classList.add("white-background");
    searchBox.classList.add("s_active");
    faqImage.src = fq_black;
  } else {
    topBar.classList.remove("white-background");
    searchBox.classList.remove("s_active");
    faqImage.src = fq_white;
  }
});
