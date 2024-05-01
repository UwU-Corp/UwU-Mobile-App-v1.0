import {
  supabase,
  hotelImageUrl,
  searchModal,
  generateStarRating,
} from "./main";

// Import Images
import fq_black from "../assets/icon/faq-fill-black.svg";
import fq_white from "../assets/icon/faq-fill-white.svg";

// Getting the search modal element and setting its onclick event to searchModal function
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
  // Getting the recommended element and adding the class 'scrolling-wrapper'
  let recommended = document.getElementById("recommended");
  recommended.classList.add("scrolling-wrapper");

  // Create placeholder cards and add them to the recommended element
  for (let i = 0; i < 5; i++) {
    let placeholderCard = document.createElement("div");
    placeholderCard.className = "col col_hotel placeholder-glow";
    placeholderCard.innerHTML = `
    <a href="#" class="card-link">
      <div class="card" style="width: 18rem">
        <div class="card-img-top placeholder"></div>
        <div class="card-body">
          <p class="card-text">
            <span class="placeholder col-5"></span>
            <span class="placeholder col-2"></span>
          </p>
          <h5 class="placeholder col-6"></h5>
          <small class="placeholder col-9 bg-dark"></small>
          <h4 class="mt-2 placeholder col-7 placeholder-lg"></h4>
        </div>
      </div>
    </a>`;
    recommended.appendChild(placeholderCard);
  }

  // Fetching all hotels from the database
  let { data: hotel, error } = await supabase
    .from("hotel")
    .select(
      "id, hotel_rate, hotel_name, hotel_street, hotel_city, price_range, no_reviews"
    );

  if (error) {
    console.log("Error fetching hotels: ", error);
    return;
  }

  // Fetch images for all hotels in parallel
  await Promise.all(
    hotel.map(async (hotel_image) => {
      let { data: images, error } = await supabase
        .from("hotel_images")
        .select("image_path")
        .eq("hotel_id", hotel_image.id);

      if (error == null) {
        hotel_image.images = images.map((image) => image.image_path);
      }
    })
  );

  // Remove the placeholder cards
  let placeholderCards = document.querySelectorAll(".placeholder-glow");
  placeholderCards.forEach((card) => card.remove());

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
            hotelImageUrl + element.images[0]
          }" class="card-img-top" alt="..." />
          <div class="card-body">
            <p class="card-text">
              ${generateStarRating(hotelRate)} ${hotelRate}
              <span>(${element.no_reviews})</span>
            </p>
            <h5>${element.hotel_name}</h5>
            <small>${element.hotel_street}, ${element.hotel_city}</small>
            <h4 class="pt-2"><b>₱${element.price_range}</b></h4>
          </div>
        </div>
      </a>`;

    // Appending the div to the recommended element
    recommended.appendChild(hotelDiv);
  });
}

// Call the function to load recommended hotels when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", getRecommendedHotels);
