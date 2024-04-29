import { supabase, searchModal } from "../main";

// URL for hotel images
const hotelImageUrl =
  "https://alzkjjjbtyariubvcwcn.supabase.co/storage/v1/object/public/hotels/public/";

// Calling functions to load different types of hotels
getDeluxeHotels();
getStandardHotels();
getBudgetHotels();

// Getting the search modal element and setting its onclick event to searchModal function
const modalSearch = document.getElementById("searchModal");
modalSearch.onclick = searchModal;

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

// Function to get Deluxe hotels from the database and display them
async function getDeluxeHotels() {
  // Fetching Deluxe hotels from the database
  let { data: hotel, error } = await supabase
    .from("hotel")
    .select("*")
    .eq("hotel_type", "Deluxe")
    .order("id", { ascending: true });

  // Getting the deluxe element and adding the class 'scrolling-wrapper'
  let deluxe = document.getElementById("deluxe");
  deluxe.classList.add("scrolling-wrapper");

  // Looping through each hotel and creating a div element for it
  hotel.forEach((element) => {
    let hotelDiv = document.createElement("div");
    hotelDiv.classList.add("col", "col_hotel");
    hotelDiv.dataset.id = element.id;

    // Convert hotel_rate to float
    let hotelRate = parseFloat(element.hotel_rate);

    // Setting the innerHTML of the div to the hotel details
    hotelDiv.innerHTML = `
        <div class="card" style="width: 18rem">
          <img src="${
            hotelImageUrl + element.image_path
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
        </div>`;

    // Appending the div to the deluxe element
    deluxe.appendChild(hotelDiv);
  });
}

// Function to get Standard hotels from the database and display them
async function getStandardHotels() {
  // Fetching Standard hotels from the database
  let { data: hotel, error } = await supabase
    .from("hotel")
    .select("*")
    .eq("hotel_type", "Standard")
    .order("id", { ascending: true });

  // Getting the standard element and adding the class 'scrolling-wrapper'
  let standard = document.getElementById("standard");
  standard.classList.add("scrolling-wrapper");

  // Looping through each hotel and creating a div element for it
  hotel.forEach((element) => {
    let hotelDiv = document.createElement("div");
    hotelDiv.classList.add("col", "col_hotel");
    hotelDiv.dataset.id = element.id;

    // Convert hotel_rate to float
    let hotelRate = parseFloat(element.hotel_rate);

    // Setting the innerHTML of the div to the hotel details
    hotelDiv.innerHTML = `
          <div class="card" style="width: 18rem">
            <img src="${
              hotelImageUrl + element.image_path
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
          </div>`;

    // Appending the div to the standard element
    standard.appendChild(hotelDiv);
  });
}

// Function to get Budget hotels from the database and display them
async function getBudgetHotels() {
  // Fetching Budget hotels from the database
  let { data: hotel, error } = await supabase
    .from("hotel")
    .select("*")
    .eq("hotel_type", "Budget")
    .order("id", { ascending: true });

  // Getting the budget element and adding the class 'scrolling-wrapper'
  let budget = document.getElementById("budget");
  budget.classList.add("scrolling-wrapper");

  // Looping through each hotel and creating a div element for it
  hotel.forEach((element) => {
    let hotelDiv = document.createElement("div");
    hotelDiv.classList.add("col", "col_hotel");
    hotelDiv.dataset.id = element.id;

    // Convert hotel_rate to float
    let hotelRate = parseFloat(element.hotel_rate);

    // Setting the innerHTML of the div to the hotel details
    hotelDiv.innerHTML = `
            <div class="card" style="width: 18rem">
              <img src="${
                hotelImageUrl + element.image_path
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
            </div>`;

    // Appending the div to the budget element
    budget.appendChild(hotelDiv);
  });
}
