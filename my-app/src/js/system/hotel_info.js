import {
  supabase,
  hotelImageUrl,
  roomImageUrl,
  generateStarRating,
} from "../main";

// Call the function to update the hotel info
updateHotelInfo();

// Function to get the hotel ID from the URL
function getHotelIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
}

// Function to get hotel data and update the page
async function updateHotelInfo() {
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
    } else {
      console.error("Error fetching hotel image data:", imageError);
    }
  } else {
    console.error("Error fetching hotel data:", error);
    return;
  }
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
  //   carouselInner.innerHTML =
  //     '<div class="carousel-item active"><div class="d-block w-100 placeholder" style="height: 270px;"></div></div>';

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
  carouselInner.innerHTML = carouselItems;
  carouselIndicators.innerHTML = carouselIndicatorsHtml;

  // Use setTimeout to simulate the loading time TODO: To set the loading time if using the placeholder
  //   setTimeout(() => {
  //     // Update the carousel inner HTML and the carousel indicators HTML
  //     carouselInner.innerHTML = carouselItems;
  //     carouselIndicators.innerHTML = carouselIndicatorsHtml;
  //   }, 1000); // Adjust the delay as needed
}
