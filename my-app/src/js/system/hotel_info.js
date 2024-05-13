import {
  supabase,
  bootstrap,
  hotelImageUrl,
  roomImageUrl,
  generateStarRating,
  Toastify,
} from "../main";

import mapIcon from "../../assets/icon/location.svg";

// Call the function
getHotelInfo();
getRoomInfo();
getUserInfo();

bookingDetails();

// Function to get the hotel ID from the URL
function getHotelIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
}

// Function to get hotel data and update the page
async function getHotelInfo() {
  const hotelId = getHotelIdFromUrl();

  // Fetch the hotel data from the database
  let { data: hotel, error } = await supabase
    .from("hotel")
    .select("*")
    .eq("id", hotelId)
    .single();

  if (error == null) {
    console.log(hotel);

    // Fetch the hotel_image data from the database
    let { data: hotelImages, error: imageError } = await supabase
      .from("hotel_images")
      .select("image_path")
      .eq("hotel_id", hotelId);

    if (imageError == null) {
      console.log(hotelImages);
      // Generate the carousel with the hotel images
      generateCarousel(hotelImages);
      displayHotelIntro(hotel);
    } else {
      console.error("Error fetching hotel image data:", imageError);
    }
  } else {
    console.error("Error fetching hotel data:", error);
    return;
  }
}

// Function to display the hotel intro
function displayHotelIntro(hotelData) {
  // Destructure the hotelData object to get the necessary fields
  const { hotel_name, hotel_rate, no_reviews, hotel_location } = hotelData;

  // Generate the stars HTML
  const starsHTML = generateStarRating(hotel_rate);

  // Generate the hotel intro HTML
  const hotelIntroHTML = `
      <div class="container pt-3 pb-4">
          <div class="row">
              <div class="col hm_card">
                  <h2 class="d-block">${hotel_name}</h2>
                  <h5 class="d-block">
                      ${starsHTML} ${hotel_rate}
                      <a class="text-decoration-none" href="#RatingsSection">
                          <small>(${no_reviews})</small>
                      </a>
                  </h5>
              </div>
          </div>
          <div class="d-flex align-items-center pt-3">
              <div class="flex-grow-1">
                  <span>${hotel_location}</span>
              </div>
              <div class="flex-column hm_img text-center px-2" data-bs-toggle="modal" data-bs-target="#mapModal">
                  <img src="${mapIcon}" alt="..." />
                  <small>Map</small>
              </div>
          </div>
      </div>
  `;

  // Insert the hotel intro HTML into the page
  const hotelIntroContainer = document.querySelector("#hotelIntroContainer");
  hotelIntroContainer.innerHTML = hotelIntroHTML;
}

// Function to generate carousel item HTML
function generateCarouselItem(imageUrl, index) {
  return `
        <div class="carousel-item ${index === 0 ? "active" : ""}">
          <img src="${imageUrl}" class="d-block w-100" style="object-fit: cover; height: 270px;" alt="Hotel image" />
        </div>`;
}

// Function to generate carousel indicator HTML
function generateCarouselIndicator(index) {
  return `
        <button type="button" data-bs-target="#hotelInfoCarousel" data-bs-slide-to="${index}" ${
    index === 0 ? 'class="active" aria-current="true"' : ""
  } aria-label="Slide ${index + 1}"></button>`;
}

// Function to generate the carousel
function generateCarousel(hotelImages) {
  // Get the carousel inner element and the carousel indicators element
  const carouselInner = document.querySelector(
    "#hotelInfoCarousel .carousel-inner"
  );
  const carouselIndicators = document.querySelector(
    "#hotelInfoCarousel .carousel-indicators"
  );

  // Set a loading placeholder TODO: Placeholder can be added if needed
  carouselInner.innerHTML =
    '<div class="carousel-item active"><div class="d-block w-100 placeholder" style="height: 270px;"></div></div>';

  // Generate the carousel items and indicators
  let carouselItems = "";
  let carouselIndicatorsHtml = "";
  hotelImages.forEach((image, index) => {
    carouselItems += generateCarouselItem(
      hotelImageUrl + image.image_path,
      index
    );
    carouselIndicatorsHtml += generateCarouselIndicator(index);
  });

  // Update the carousel inner HTML and the carousel indicators HTML
  // carouselInner.innerHTML = carouselItems;
  // carouselIndicators.innerHTML = carouselIndicatorsHtml;

  // Use setTimeout to simulate the loading time TODO: To set the loading time if using the placeholder
  setTimeout(() => {
    // Update the carousel inner HTML and the carousel indicators HTML
    carouselInner.innerHTML = carouselItems;
    carouselIndicators.innerHTML = carouselIndicatorsHtml;
  }, 1000); // Adjust the delay as needed
}

// Get the user's information
async function getUserInfo() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user != null) {
    let { data: user_info, error } = await supabase
      .from("user_info")
      .select("*")
      .eq("user_id", user.id);

    if (error) {
      console.error("Error fetching user info:", error);
    } else if (user_info && user_info.length > 0) {
      // Use querySelector to select the guestName element and set its text
      document.querySelector("#guestName").textContent =
        user_info[0].first_name;
    } else {
      console.log("No user info found");
    }
  } else {
    console.log("No user is currently logged in.");
  }
}

// Function to get room data and update the page
async function getRoomInfo() {
  const hotelId = getHotelIdFromUrl();

  let { data: rooms, error: roomError } = await supabase
    .from("room")
    .select("*")
    .eq("hotel_id", hotelId)
    .order("id", { ascending: true });

  if (roomError == null) {
    console.log(rooms);

    let { data: roomImages, error } = await supabase
      .from("room_images")
      .select("*");

    if (error == null) {
      console.log(roomImages);
      displayRoomInfo(rooms, roomImages);
    } else {
      console.error("Error fetching room images:", error);
    }
  } else {
    console.error("Error fetching room data:", roomError);
  }
}

// Function to display room info
async function displayRoomInfo(rooms, roomImages) {
  // Select the container where the rooms will be displayed
  const container = document.querySelector("#roomDisplay");

  // For each room, create a string of HTML
  rooms.forEach((room, index) => {
    // Find the images for this room
    const images = roomImages.filter(
      (room_images) => room_images.room_id === room.id
    );

    // Create a string of HTML for the images
    let imagesHTML = "";
    images.forEach((room_images) => {
      // Construct the full image URL
      const imageUrl = roomImageUrl + room_images.image_path;
      imagesHTML += `<img src="${imageUrl}" />`;
    });

    // Create the room HTML
    let roomHTML = `
    <div class="d-flex align-items-center room-row" data-room-id="${room.id}">
      <div class="flex-shrink-0 hm_img_r">
        ${imagesHTML}
      </div>
      <div class="flex-grow-1 ms-3">
          <p class="fw-medium mt-3">
              ${escapeHTML(room.room_type)},<br />
              ${escapeHTML(room.room_bed)} <br />
              <small class="font-monospace hm_gray">${escapeHTML(
                room.room_size
              )}</small>
          </p>
      </div>
      <div class="form-check">
          <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault${
            room.id
          }" value="${room.room_price}" ${index === 0 ? "checked" : ""} />
          <label class="form-check-label" for="flexRadioDefault${
            room.id
          }"> </label>
      </div>
    </div>`;

    // If it's not the last room, add the <hr> tag
    if (index !== rooms.length - 1) {
      roomHTML += `<hr class="border-dark-subtle" />`;
    }

    // Create a new div element
    let div = document.createElement("div");

    // Set the inner HTML of the div element
    div.innerHTML = roomHTML;

    // Append the div element to the container
    container.appendChild(div);
  });

  // Add click event listeners to the rows
  document.querySelectorAll(".room-row").forEach((row) => {
    row.addEventListener("click", () => {
      selectedRoomId = row.getAttribute("data-room-id");
      const radioButton = document.querySelector(
        `#flexRadioDefault${selectedRoomId}`
      );
      console.log(
        `Clicked on room with ID ${selectedRoomId}, radio button:`,
        radioButton
      );
      radioButton.click();
      console.log("After clicking radio button:", radioButton);
      // Call the calculateTotalPrice function to update the total price
      calculateTotalPrice();
    });
  });

  // Get the first .room-row element
  let firstRoomRow = document.querySelector(".room-row");

  if (firstRoomRow) {
    // Set selectedRoomId to the data-room-id attribute of the first .room-row element
    selectedRoomId = firstRoomRow.getAttribute("data-room-id");
  }

  console.log("selectedRoomId:", selectedRoomId);
  let selector = `#flexRadioDefault${selectedRoomId}`;
  console.log("selector:", selector);
  let roomPriceElement = document.querySelector(selector);
  console.log("roomPriceElement:", roomPriceElement);

  // Display the price of the first room
  if (rooms.length > 0) {
    document.querySelector("#totalAmount").textContent =
      "₱" + Number(rooms[0].room_price).toLocaleString();
  }

  // Add event listeners to the inputs
  document
    .querySelectorAll('input[name="flexRadioDefault"]')
    .forEach((input) => {
      input.addEventListener("change", calculateTotalPrice);
    });

  // Get the button
  let button = document.querySelector("#bookingSubmit");
  let button2 = document.querySelector("#bookingSubmitt");

  // Remove the change event listeners from the date input fields
  checkInDateInput.removeEventListener("change", calculateTotalPrice);
  checkOutDateInput.removeEventListener("change", calculateTotalPrice);
  adultsCountInput.removeEventListener("change", calculateTotalPrice);
  childrenCountInput.removeEventListener("change", calculateTotalPrice);

  // Add a click event listener to the button
  button.addEventListener("click", calculateTotalPrice);
  button2.addEventListener("click", calculateTotalPrice);

  // Calculate the initial total price
  calculateTotalPrice();
}

// Assume these are base prices
let adultPrice = 200;
let childPrice = 100;

// Get the inputs
let checkInDateInput = document.querySelector("#checkInDate");
let checkOutDateInput = document.querySelector("#checkOutDate");
let adultsCountInput = document.querySelector("#adultsCount");
let childrenCountInput = document.querySelector("#childrenCount");

// Function to calculate the total price
function calculateTotalPrice() {
  // Get the selected room price
  let roomPriceElement = document.querySelector(
    'input[name="flexRadioDefault"]:checked'
  );
  console.log("In calculateTotalPrice, roomPriceElement:", roomPriceElement);
  let roomPrice = roomPriceElement ? roomPriceElement.value : 0;

  // Get the number of nights
  let checkInDate = new Date(checkInDateInput.value);
  let checkOutDate = new Date(checkOutDateInput.value);
  let nights = Math.round((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

  // Get the number of adults and children
  let adults = Number(adultsCountInput.value);
  let children = Number(childrenCountInput.value);

  // Calculate the total price
  let totalPrice = roomPrice * nights + children * childPrice;

  // If there are more than 2 adults, add the extra adult price
  if (adults > 2) {
    totalPrice += (adults - 2) * adultPrice;
  }

  // Update the total price display
  document.querySelector("#totalAmount").textContent =
    "₱" + Number(totalPrice).toLocaleString();

  // Return the total price
  return totalPrice;
}

// Declare a global variable to store the selected room ID
let selectedRoomId = null;

// Function to book a hotel
async function bookHotel() {
  console.log("Starting bookHotel function");

  // Get the user's information
  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log("User:", user);

  if (user != null) {
    let { data: user_info, error: user_info_error } = await supabase
      .from("user_info")
      .select("*")
      .eq("user_id", user.id);

    if (user_info_error) {
      console.error("Error retrieving user info:", user_info_error);
      return;
    }

    if (!user_info || user_info.length === 0) {
      console.error("No user info found for user:", user.id);
      return;
    }

    console.log("User info:", user_info[0]);

    // Get the selected dates
    let checkInDate = new Date(document.querySelector("#checkInDate").value);
    let checkOutDate = new Date(document.querySelector("#checkOutDate").value);
    console.log("Check-in date:", checkInDate);
    console.log("Check-out date:", checkOutDate);

    // Get the selected number of adults and children
    let adults = document.querySelector("#adultsCount").value;
    let children = document.querySelector("#childrenCount").value;
    console.log("Number of adults:", adults);
    console.log("Number of children:", children);

    if (!selectedRoomId) {
      console.error("No room selected");
      return; // Exit the function if no room is selected
    }

    let roomPriceElement = document.querySelector(
      `#flexRadioDefault${selectedRoomId}`
    );
    console.log("Room price element:", roomPriceElement);

    let totalPayment;
    let roomId;
    if (roomPriceElement) {
      totalPayment = calculateTotalPrice();
      roomId = roomPriceElement.id.replace("flexRadioDefault", ""); // Get the room id from the radio button's id
      console.log("Total payment:", totalPayment);
      console.log("Room ID:", roomId);
    } else {
      console.log("No room selected");
      return; // Exit the function if no room is selected
    }

    // Create the booking data
    let bookingData = {
      user_id: user_info[0].id,
      room_id: roomId,
      check_in: checkInDate,
      check_out: checkOutDate,
      adult_quantity: adults,
      child_quantity: children,
      payment: totalPayment,
      status: "In Process",
    };
    console.log("Booking data:", bookingData);

    // Insert the booking data into the database
    let { data: booking, error: booking_error } = await supabase
      .from("booking")
      .insert([bookingData]);

    if (booking_error) {
      console.error("Error booking hotel:", booking_error);
      // Show a toast notification for the error
      Toastify({
        text: "Error booking hotel: " + booking_error.message,
        duration: 10000,
        gravity: "top", // `top` or `bottom`
        position: "center",
        style: {
          background:
            "linear-gradient(90deg, rgba(187,10,26,1) 15%, rgba(226,37,54,1) 65%, rgba(255,64,81,1) 90%)",
        },
        stopOnFocus: true, // Prevents dismissing of toast on hover
      }).showToast();
    } else {
      console.log("Hotel booked successfully:", booking);
      // Show a toast notification for the success
      Toastify({
        text: "Hotel booked successfully",
        duration: 10000,
        gravity: "top", // `top` or `bottom`
        position: "center",
        style: {
          background:
            "linear-gradient(90deg, rgba(0,150,199,1) 25%, rgba(44,168,209,1) 60%, rgba(82,184,217,1) 90%)",
        },
        stopOnFocus: true, // Prevents dismissing of toast on hover
      }).showToast();
    }
  } else {
    console.log("No user is currently logged in.");
    window.location.href = "login.html";
    return;
  }
}

// Assuming 'bookNowBtn' is the id of your booking button
document.getElementById("bookNowBtn").addEventListener("click", function () {
  // Call the bookHotel function when the button is clicked
  bookHotel();
});

// Function to display the booking details
function bookingDetails() {
  // Get the current date and the date for the next day
  let currentDate = new Date();
  let nextDate = new Date();
  nextDate.setDate(currentDate.getDate() + 1);

  // Format the dates as strings
  let currentDateStr = currentDate.toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  let nextDateStr = nextDate.toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  // Insert the dates into the HTML
  document.querySelector(
    "#datesLink"
  ).textContent = `${currentDateStr} - ${nextDateStr}`;

  // Format the dates as strings for the input values
  let currentDateStrInput = currentDate.toISOString().split("T")[0];
  let nextDateStrInput = nextDate.toISOString().split("T")[0];

  // Set the dates in the modal
  document.querySelector("#checkInDate").value = currentDateStrInput;
  document.querySelector("#checkOutDate").value = nextDateStrInput;

  // Get the save changes button
  let saveChangesButton = document.querySelector("#datesModal .btn-1");

  // Get the modal element
  let datesModal = document.querySelector("#datesModal");

  // Create a Bootstrap Modal instance
  let bootstrapModal = new bootstrap.Modal(datesModal);

  // Add a click event listener to the button
  saveChangesButton.addEventListener("click", (event) => {
    // Prevent the form from submitting
    event.preventDefault();

    // Get the selected dates
    let checkInDate = new Date(document.querySelector("#checkInDate").value);
    let checkOutDate = new Date(document.querySelector("#checkOutDate").value);

    // Format the dates as strings
    let checkInDateStr = checkInDate.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
    let checkOutDateStr = checkOutDate.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });

    // Update the #datesLink text
    document.querySelector(
      "#datesLink"
    ).textContent = `${checkInDateStr} - ${checkOutDateStr}`;

    // Close the modal
    bootstrapModal.hide();
  });

  // Get the buttons and input fields
  let adultsMinusBtn = document.querySelector("#adultsMinusBtn");
  let adultsPlusBtn = document.querySelector("#adultsPlusBtn");
  let adultsCount = document.querySelector("#adultsCount");

  let childrenMinusBtn = document.querySelector("#childrenMinusBtn");
  let childrenPlusBtn = document.querySelector("#childrenPlusBtn");
  let childrenCount = document.querySelector("#childrenCount");

  // Set the default value of the adults count to 2
  adultsCount.value = 2;

  // Add event listeners to the adults buttons
  adultsMinusBtn.addEventListener("click", () => {
    if (adultsCount.value > 1) {
      adultsCount.value--;
      adultsCount.dispatchEvent(new Event("change"));
    }
  });

  adultsPlusBtn.addEventListener("click", () => {
    adultsCount.value++;
    adultsCount.dispatchEvent(new Event("change"));
  });

  // Add event listeners to the children buttons
  childrenMinusBtn.addEventListener("click", () => {
    if (childrenCount.value > 0) {
      childrenCount.value--;
      childrenCount.dispatchEvent(new Event("change"));
    }
  });

  childrenPlusBtn.addEventListener("click", () => {
    childrenCount.value++;
    childrenCount.dispatchEvent(new Event("change"));
  });

  // Get the modal element
  let guestModal = document.querySelector("#guestModal");

  // Create a Bootstrap Modal instance
  let guestBootstrapModal = new bootstrap.Modal(guestModal);

  // Get the submit button
  let submitButton = document.querySelector("#guestModal .btn-1");

  // Add a click event listener to the button
  submitButton.addEventListener("click", (event) => {
    // Prevent the form from submitting
    event.preventDefault();

    // Get the selected number of adults and children
    let adults = document.querySelector("#adultsCount").value;
    let children = document.querySelector("#childrenCount").value;

    // Update the #guestLink text
    if (children > 0) {
      document.querySelector(
        "#guestLink"
      ).textContent = `${adults} Adult  •  ${children} Children`;
    } else {
      document.querySelector("#guestLink").textContent = `${adults} Adult`;
    }

    // Close the modal
    guestBootstrapModal.hide();
  });
}

// Function to escape HTML
function escapeHTML(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
