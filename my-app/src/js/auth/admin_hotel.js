import { supabase, Toastify } from "../main";

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

// Function to generate unique ID based on city
async function generateUniqueID(hotelCity) {
  console.log("Selected city:", hotelCity);

  let cityPrefix = "";

  // Replace specific city names with their corresponding prefixes
  switch (hotelCity) {
    case "Butuan City":
      cityPrefix = "buc";
      break;
    case "Cabadbaran City":
      cityPrefix = "cabc";
      break;
    case "Surigao City":
      cityPrefix = "surc";
      break;
    default:
      // Use the first three characters of the city name as the prefix
      cityPrefix = hotelCity.substring(0, 3).toLowerCase();
  }

  console.log("City prefix:", cityPrefix);

  // Fetch existing hotel IDs with the same city prefix
  const { data: existingHotelIds, error } = await supabase
    .from("hotel")
    .select("id")
    .like("id", `${cityPrefix}%`);

  if (error) {
    console.error("Error fetching existing hotel IDs:", error);
    return null;
  }

  // If no existing hotel IDs found with the same prefix, generate the first one
  if (!existingHotelIds || existingHotelIds.length === 0) {
    return `${cityPrefix}-01`;
  }

  // Find the highest numeric suffix among the existing hotel IDs
  let maxSuffix = 0;
  existingHotelIds.forEach((hotel) => {
    const idParts = hotel.id.split("-");
    const suffix = parseInt(idParts[1]);
    if (!isNaN(suffix) && suffix > maxSuffix) {
      maxSuffix = suffix;
    }
  });

  // Increment the highest suffix and construct the new hotel ID
  const newSuffix = (maxSuffix + 1).toString().padStart(2, "0");
  return `${cityPrefix}-${newSuffix}`;
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



  // Rest of your form submission logic...
  
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
  const uniqueId = await generateUniqueID(hotelCity);

  // Get the current user's admin ID
  const adminId = await getAdminId();

  if (!adminId) {
    errorNotification("Unable to fetch admin ID. Please try again later.");
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
if (hotelError == null) {
  successNotification("Hotel added!");
  setTimeout(() => {
    window.location.href = window.location.href;
  }, 2000); // Redirect after 2 seconds (adjust the delay as needed)
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
        imagePathWithoutPublic = uploadData.path.replace(/^public\//, '');
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
        console.error("Error inserting image into hotel_images:", imageInsertError);
      }
    }
  } else {
    console.error("No image provided.");
  }
};
