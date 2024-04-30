import {
  supabase,
  hotelImageUrl,
  searchModal,
  generateStarRating,
} from "./main";

// Import Images
import fq_black from "../assets/icon/faq-fill-black.svg";
import fq_white from "../assets/icon/faq-fill-white.svg";

// Call the function to load recommended hotels
getRecommendedHotels();

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

// Function to get Recommended hotels from the database and display them
async function getRecommendedHotels() {
  // Fetching all hotels from the database
  let { data: hotel, error } = await supabase
    .from("hotel")
    .select("*")
    .order("id", { ascending: true });

  // Getting the recommended element and adding the class 'scrolling-wrapper'
  let recommended = document.getElementById("recommended");
  recommended.classList.add("scrolling-wrapper");

  // Shuffle the array of hotels
  hotel.sort(() => Math.random() - 0.5);

  // Select the first 5 hotels
  let selectedHotels = hotel.slice(0, 5);

  // Looping through each selected hotel and creating a div element for it
  selectedHotels.forEach((element) => {
    let hotelDiv = document.createElement("div");
    hotelDiv.classList.add("col", "col_hotel");
    hotelDiv.dataset.id = element.id;

    // Convert hotel_rate to float
    let hotelRate = parseFloat(element.hotel_rate);

    // Setting the innerHTML of the div to the hotel details
    hotelDiv.innerHTML = `
      <a href="/hotel_info.html?id=${element.id}" class="card-link">
        <div class="card" style="width: 18rem">
          <img src="${
            hotelImageUrl + element.hotel_imagepath
          }" class="card-img-top" alt="..." />
          <div class="card-body">
            <p class="card-text">
              ${generateStarRating(hotelRate)} ${hotelRate}
              <span>(${element.no_reviews})</span>
            </p>
            <h5>${element.hotel_name}</h5>
            <small>${element.hotel_location}, ${element.hotel_city}</small>
            <h4 class="pt-2"><b>₱${element.price_range}</b></h4>
          </div>
        </div>
      </a>`;

    // Appending the div to the recommended element
    recommended.appendChild(hotelDiv);
  });
}
