import { supabase, searchModal } from "../main";

// Import Images
const hotelImageUrl =
  "https://alzkjjjbtyariubvcwcn.supabase.co/storage/v1/object/public/hotels/public/";

//load hotel types
getDeluxeHotels();
// getStandardHotels();
// getBudgetHotels();

// Modal for Search
const modalSearch = document.getElementById("searchModal");
modalSearch.onclick = searchModal;

async function getDeluxeHotels() {
  let { data: hotel, error } = await supabase
    .from("hotel")
    .select("*")
    .eq("hotel_type", "Deluxe");

  let deluxe = document.getElementById("deluxe");
  deluxe.classList.add("scrolling-wrapper");

  hotel.forEach((element) => {
    console.log(element);
    let hotelDiv = document.createElement("div");
    hotelDiv.classList.add("col", "col_hotel");
    hotelDiv.dataset.id = element.id;

    hotelDiv.innerHTML = `
        <div class="card" style="width: 18rem">
          <img src="${
            hotelImageUrl + element.image_path
          }" class="card-img-top" alt="..." />
          <div class="card-body">
            <p class="card-text">
              <i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i
              ><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i
              ><i class="bi bi-star"></i> ${element.hotel_rate}
              <span>(${element.no_reviews})</span>
            </p>
            <h5>${element.hotel_name}</h5>
            <small>${element.hotel_city}</small>
            <h4 class="pt-2"><b>₱${element.price_rate}</b></h4>
          </div>
        </div>`;

    deluxe.appendChild(hotelDiv);
  });
}

// async function getStandardHotels() {
//   let { data: hotel, error } = await supabase
//     .from("hotel")
//     .select("*")
//     .eq("hotel_type", "standard");

//   let standard = "";

//   hotel.forEach((element) => {
//     standard += ``;
//   });

//   document.getElementById("standard").innerHTML = standard;
// }

// async function getBudgetHotels() {
//   let { data: hotel, error } = await supabase
//     .from("hotel")
//     .select("*")
//     .eq("hotel_type", "budget");

//   let budget = "";

//   hotel.forEach((element) => {
//     budget += ``;
//   });

//   document.getElementById("budget").innerHTML = budget;
// }
