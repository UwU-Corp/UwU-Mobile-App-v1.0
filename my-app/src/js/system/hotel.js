import {
  supabase,
  hotelImageUrl,
  searchModal,
  generateStarRating,
} from "../main";

// Calling functions to load different types of hotels
getDeluxeHotels();
getStandardHotels();
getBudgetHotels();

// Getting the search modal element and setting its onclick event to searchModal function
const modalSearch = document.getElementById("searchModal");
modalSearch.onclick = searchModal;

// Function to get Deluxe hotels from the database and display them
async function getDeluxeHotels() {
  // Getting the deluxe element and adding the class 'scrolling-wrapper'
  let deluxe = document.getElementById("deluxe");
  deluxe.classList.add("scrolling-wrapper");

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
    deluxe.appendChild(placeholderCard);
  }

  // Fetching Deluxe hotels from the database
  let { data: hotel, error } = await supabase
    .from("hotel")
    .select(
      "id, hotel_rate, hotel_name, hotel_street, hotel_city, price_range, no_reviews"
    )
    .eq("hotel_type", "Deluxe")
    .order("id", { ascending: true });

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

  // Looping through each hotel and creating a div element for it
  hotel.forEach((element) => {
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

    // Appending the div to the deluxe element
    deluxe.appendChild(hotelDiv);
  });
}

// Function to get Standard hotels from the database and display them
async function getStandardHotels() {
  // Getting the standard element and adding the class 'scrolling-wrapper'
  let standard = document.getElementById("standard");
  standard.classList.add("scrolling-wrapper");

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
    standard.appendChild(placeholderCard);
  }

  // Fetching Standard hotels from the database
  let { data: hotel, error } = await supabase
    .from("hotel")
    .select(
      "id, hotel_rate, hotel_name, hotel_street, hotel_city, price_range, no_reviews"
    )
    .eq("hotel_type", "Standard")
    .order("id", { ascending: true });

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

  // Looping through each hotel and creating a div element for it
  hotel.forEach((element) => {
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

    // Appending the div to the standard element
    standard.appendChild(hotelDiv);
  });
}

// Function to get Budget hotels from the database and display them
async function getBudgetHotels() {
  // Getting the budget element and adding the class 'scrolling-wrapper'
  let budget = document.getElementById("budget");
  budget.classList.add("scrolling-wrapper");

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
    budget.appendChild(placeholderCard);
  }

  // Fetching Budget hotels from the database
  let { data: hotel, error } = await supabase
    .from("hotel")
    .select(
      "id, hotel_rate, hotel_name, hotel_street, hotel_city, price_range, no_reviews"
    )
    .eq("hotel_type", "Budget")
    .order("id", { ascending: true });

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

  // Looping through each hotel and creating a div element for it
  hotel.forEach((element) => {
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

    // Appending the div to the budget element
    budget.appendChild(hotelDiv);
  });
}
