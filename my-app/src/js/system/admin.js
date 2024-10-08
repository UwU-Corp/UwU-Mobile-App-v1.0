import { supabase, Toastify, doLogout } from "../main";

// Load the user's information and check for hotel ownership
getUserInfo();

// Get the user's information
async function getUserInfo() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If the user is logged in, get the user's information
  if (user != null) {
    let { data: user_info, error } = await supabase
      .from("user_info")
      .select("first_name, last_name, address, contact_num, id")
      .eq("user_id", user.id);

    if (error) {
      console.error("Error fetching user info:", error);
      return;
    }

    console.log(user_info);

    // Get the Logout link
    let logoutLinkElement = document.querySelector(
      ".dropdown-menu .dropdown-item"
    );

    // Add an event listener to the Logout link that calls doLogout() when clicked
    logoutLinkElement.addEventListener("click", doLogout);

    if (user_info.length > 0) {
      const adminId = user_info[0].id;
      checkHotelOwnership(adminId);
    }
  }
}

// Check if the user owns a hotel
async function checkHotelOwnership(adminId) {
  const { data: hotelData, error: hotelError } = await supabase
    .from("hotel")
    .select("admin_id")
    .eq("admin_id", adminId);

  if (hotelError) {
    console.error("Error checking hotel ownership:", hotelError);
    return;
  }

  if (hotelData.length > 0) {
    // If the user owns a hotel, add the d-none class to all elements with the class hide_have_hotel
    const elementsToHide = document.querySelectorAll(".hide_have_hotel");
    elementsToHide.forEach((element) => {
      element.classList.add("d-none");
    });
  }
}

// Function for success notification
function successNotification(message) {
  Toastify({
    text: message,
    duration: 3000,
    gravity: "top", // `top` or `bottom`
    position: "center", // `left`, `center` or `right`
    style: {
      background:
        "linear-gradient(90deg, rgba(0,150,199,1) 25%, rgba(44,168,209,1) 60%, rgba(82,184,217,1) 90%)",
    },
  }).showToast();
}

// Function for error notification
function errorNotification(message) {
  Toastify({
    text: message,
    duration: 10000,
    gravity: "top", // `top` or `bottom`
    position: "center", // `left`, `center` or `right`
    style: {
      background:
        "linear-gradient(90deg, rgba(187,10,26,1) 15%, rgba(226,37,54,1) 65%, rgba(255,64,81,1) 90%)",
    },
  }).showToast();
}

// Function to generate unique ID
async function generateUniqueID(cityId) {
  let uniqueId = cityId;
  let counter = 1;

  const { data, error } = await supabase
    .from("hotel")
    .select("id")
    .like("id", `${cityId}%`);

  if (data && data.length > 0) {
    while (true) {
      const newId = `${cityId}-${counter.toString().padStart(2, "0")}`;
      const idExists = data.some((item) => item.id === newId);
      if (!idExists) {
        uniqueId = newId;
        break;
      }
      counter++;
    }
  }

  return uniqueId;
}

// Function to get the current user's information and return the adminId
async function getAdminId() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user != null) {
    const { data: userInfo, error } = await supabase
      .from("user_info")
      .select("id")
      .eq("user_id", user.id);

    if (error) {
      console.error("Error fetching user info:", error);
      return null;
    }

    if (userInfo && userInfo.length > 0) {
      console.log(userInfo);
      return userInfo[0].id;
    }
  }

  return null;
}

// Get the form element
const formHotel = document.getElementById("form_hotel");

// Submit event handler for the form
formHotel.onsubmit = async (e) => {
  e.preventDefault(); // Prevent the default form submission behavior

  // Disable the submit button and show loading indicator
  const submitButton = document.querySelector("#form_hotel button");
  submitButton.disabled = true;
  submitButton.innerHTML = `
    <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
    <span>Loading...</span>`;

  // Get form data
  const formData = new FormData(formHotel);

  // Generate ID based on hotel city
  const hotelCity = formData.get("hotel_city");
  const cityId = hotelCity.substring(0, 3).toLowerCase(); // Get first three characters and convert to lowercase

  // Generate unique ID
  const uniqueId = await generateUniqueID(cityId);

  // Get the current user's admin ID
  const adminId = await getAdminId();

  if (!adminId) {
    errorNotification("Unable to fetch admin ID. Please try again later.");
    submitButton.disabled = false;
    submitButton.innerHTML = `Add hotel`;
    return;
  }

  // Insert data into the 'hotel' table
  const { data: hotelData, error: hotelError } = await supabase
    .from("hotel")
    .insert([
      {
        id: uniqueId,
        hotel_name: formData.get("hotel_name"),
        hotel_location: formData.get("hotel_location"),
        hotel_city: hotelCity,
        hotel_type: formData.get("hotel_type"),
        hotel_desc: formData.get("hotel_desc"),
        hotel_street: formData.get("hotel_street"),
        price_range: formData.get("price_range"),
        hotel_rate: formData.get("hotel_rate"),
        admin_id: adminId,
      },
    ])
    .select();

  // Handle success or error for hotel insertion
  if (hotelError === null) {
    successNotification("Hotel added!");
  } else {
    errorNotification("Something went wrong, please try again later.");
    console.error(hotelError);
    submitButton.disabled = false;
    submitButton.innerHTML = `Add hotel`;
    return;
  }

  // Upload file image
  const image = formData.get("image_path");
  if (image) {
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("hotels")
      .upload("public/" + image.name, image, {
        cacheControl: "3600",
        upsert: false,
      });

    let imagePathWithoutPublic = null;

    // Check for upload errors
    if (uploadError) {
      console.error("Error uploading image:", uploadError);
      errorNotification("Image upload failed. Please try again later.");
    } else {
      // Remove "/public" prefix from image path if upload was successful
      if (uploadData) {
        imagePathWithoutPublic = uploadData.path.replace(/^public\//, "");
      }

      // Insert data into the 'hotel_images' table
      const { data: imageInsertData, error: imageInsertError } = await supabase
        .from("hotel_images")
        .insert([
          {
            image_path: imagePathWithoutPublic, // Use the modified image path
            hotel_id: uniqueId,
          },
        ])
        .select();

      // Log image insertion error
      if (imageInsertError !== null) {
        console.error(
          "Error inserting image into hotel_images:",
          imageInsertError
        );
      }
    }
  } else {
    console.error("No image provided.");
  }

  // Reset the form
  formHotel.reset();

  // Enable the submit button
  submitButton.disabled = false;
  submitButton.innerHTML = `Add hotel`;
};
