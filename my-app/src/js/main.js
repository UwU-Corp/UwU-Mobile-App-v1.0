// Import our custom CSS
import "../scss/styles.scss";

// Import all of Bootstrap's JS
import * as bootstrap from "bootstrap";
// import "bootstrap/dist/js/bootstrap.bundle";

// Import Router
import { setRouter } from "./router/router.js";

// Import supabase
import { createClient } from "@supabase/supabase-js";

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
    }
  });
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
  hotelImageUrl,
  roomImageUrl,
  searchModal,
  generateStarRating,
  doLogout,
};
