// Import our custom CSS
import "../scss/styles.scss";

// Import all of Bootstrap's JS
import * as bootstrap from "bootstrap";
// import "bootstrap/dist/js/bootstrap.bundle";

// Import Router
import { setRouter } from "./router/router.js";

// Import supabase
import { createClient } from "@supabase/supabase-js";

// Import Toastify
import "../css/toastify.css";

import Toastify from "toastify-js";

// Set Router
setRouter();

// Create a single supabase client for interacting with your database
const supabase = createClient(
  "https://alzkjjjbtyariubvcwcn.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsemtqampidHlhcml1YnZjd2NuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTM5MzY4MDcsImV4cCI6MjAyOTUxMjgwN30.b7nqneAN1DXhQjilH1Xs5IhAZeVN1CjtYwfRzxZ87h8"
);

// URL for images
const hotelImageUrl =
  "https://alzkjjjbtyariubvcwcn.supabase.co/storage/v1/object/public/hotels/public/";

const roomImageUrl =
  "https://alzkjjjbtyariubvcwcn.supabase.co/storage/v1/object/public/rooms/public/";

// Function to open the search modal and focus on the search input
const searchModal = document.getElementById("searchModal");

if (searchModal) {
  // Check if searchModal exists
  searchModal.addEventListener("shown.bs.modal", function () {
    var input = document.getElementById("searchInput");
    if (input) {
      input.focus();
      // Add event listener to the input field for the 'keyup' event
      input.addEventListener("keyup", function (event) {
        // If the key pressed is 'Enter', perform the search
        if (event.key === "Enter") {
          performSearch(input.value);
        }
      });
    }

    var searchButton = document.querySelector(".sm_btn");
    if (searchButton) {
      // Add event listener to the search button for the 'click' event
      searchButton.addEventListener("click", function () {
        performSearch(input.value);
      });
    }
  });
}

// Function to perform a search based on the query
async function performSearch(query) {
  // Fetch hotel data from Supabase
  let { data: hotel, error } = await supabase
    .from("hotel")
    .select(
      "id, hotel_rate, hotel_name, hotel_street, hotel_city, price_range, no_reviews, hotel_location"
    )
    .or(
      "hotel_name.ilike.%" + query + "%, hotel_location.ilike.%" + query + "%"
    );

  // Display loading placeholders
  const searchResults = document.querySelector("#searchResults");

  // Check for errors and display the results
  if (error) {
    console.error("Error fetching hotel data:", error);
  } else if (hotel.length === 0) {
    // Display a message if no hotels are found
    searchResults.innerHTML =
      '<div class="text-center py-5 px-4 my-5 mx-1 fst-italic text-info-emphasis">Oops! We couldn\'t find any matches for your search.</div>';
  } else {
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

    // Generate HTML for each hotel
    searchResults.innerHTML = hotel
      .map((hotel) => {
        // Convert hotel_rate to float
        let hotelRate = parseFloat(hotel.hotel_rate);

        // Return the HTML for each hotel
        return `
        <div class="col col_hotel mx-auto">
          <a href="/hotel_info.html?id=${hotel.id}" class="card-link">
            <div class="card shadow-sm">
              <img src="${
                hotelImageUrl + hotel.images[0]
              }" class="card-img-top" alt="..." />
              <div class="card-body">
                <p class="card-text">
                  ${generateStarRating(hotelRate)} ${hotelRate}
                  <span>(${hotel.no_reviews})</span>
                </p>
                <h5>${hotel.hotel_name}</h5>
                <small>${hotel.hotel_street}, ${hotel.hotel_city}</small>
                <h4 class="pt-2"><b>₱${hotel.price_range}</b></h4>
              </div>
            </div>
          </a>
        </div>
        <br />
      `;
      })
      .join("");
  }
}

// Function to generate star rating
function generateStarRating(rating) {
  let stars = ""; // Initialize the stars string
  // Calculate the number of full stars
  let fullStars = Math.floor(rating);
  // Calculate the decimal part of the rating
  let decimalPart = rating - fullStars;

  // Loop through 5 times for each star
  for (let i = 1; i <= 5; i++) {
    // If the current index is less than or equal to the number of full stars, add a full star
    if (i <= fullStars) {
      stars += '<i class="bi bi-star-fill"></i>';
    }
    // If the current index is equal to the number of full stars plus one and the decimal part is 0.5 or more, add a half star
    else if (i === fullStars + 1 && decimalPart >= 0.5) {
      stars += '<i class="bi bi-star-half"></i>';
    }
    // Otherwise, add an empty star
    else {
      stars += '<i class="bi bi-star"></i>';
    }
  }

  // Return the stars string
  return stars;
}

// Function to logout the user
async function doLogout(event) {
  // If the event argument is not undefined, prevent the default action of the anchor tag
  if (event !== undefined) {
    event.preventDefault();
  }

  // Supabase Logout
  let { error } = await supabase.auth.signOut();

  if (error == null) {
    // Clear local Storage
    localStorage.clear();
    // Redirect to account page
    window.location.pathname = "/account.html";
  } else {
    console.log("Error logging out: ", error.message);
  }
}

export {
  supabase,
  bootstrap,
  Toastify,
  hotelImageUrl,
  roomImageUrl,
  searchModal,
  performSearch,
  generateStarRating,
  doLogout,
};
