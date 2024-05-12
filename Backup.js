// Get the "Book now & pay" button
let bookNowBtn = document.querySelector("#bookNowBtn");

// Add a click event listener to the button
bookNowBtn.addEventListener("click", async (event) => {
  // Prevent the form from submitting
  event.preventDefault();

  // Get the hotel ID from the URL
  let hotelId = getHotelIdFromUrl();

  // Get the room ID associated with the hotel
  let { data: room, error: roomError } = await supabase
    .from("room")
    .select("id")
    .eq("hotel_id", hotelId);
  console.log(room);

  console.log(room);

  if (roomError) {
    console.error("Error fetching room data:", roomError);
    return;
  }

  // Get the user ID of the logged-in user
  let { user, session, error: userError } = supabase.auth.user();

  if (userError) {
    console.error("Error fetching user data:", userError);
    return;
  }

  // Get the booking details from the form
  let checkInDate = document.querySelector("#checkInDate").value;
  let checkOutDate = document.querySelector("#checkOutDate").value;
  let adults = document.querySelector("#adultsCount").value;
  let children = document.querySelector("#childrenCount").value;

  // Insert a new row into the booking table
  let { data: booking, error: bookingError } = await supabase
    .from("booking")
    .insert([
      {
        room_id: room.id,
        user_id: user.id,
        check_in: checkInDate,
        check_out: checkOutDate,
        adult_quantity: adults,
        child_quantity: children,
      },
    ]);

  if (bookingError) {
    console.error("Error inserting booking data:", bookingError);
    return;
  }

  console.log("Booking successful:", booking);
});

// ============================================

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
  }
});

adultsPlusBtn.addEventListener("click", () => {
  adultsCount.value++;
});

// Add event listeners to the children buttons
childrenMinusBtn.addEventListener("click", () => {
  if (childrenCount.value > 0) {
    childrenCount.value--;
  }
});

childrenPlusBtn.addEventListener("click", () => {
  childrenCount.value++;
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

// ============================================
