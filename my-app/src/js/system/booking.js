import { supabase } from "../main";

getUserInfo();

async function getUserInfo() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log(user);

  if (user != null) {
    let { data: user_info } = await supabase
      .from("user_info")
      .select("id")
      .eq("user_id", user.id);
    console.log(user_info);

    if (user_info && user_info.length > 0) {
      let { data: bookings, error } = await supabase
        .from("booking")
        .select("*, room:room_id(*, hotel:hotel_id(*))")
        .eq("user_id", user_info[0].id)
        .order("id", { ascending: true });

      if (error) {
        console.error("Error fetching bookings:", error);
      } else {
        console.log(bookings);
        const currentDate = new Date();
        const recentBookings = bookings.filter(
          (booking) => new Date(booking.check_out) > currentDate
        );
        const previousBookings = bookings.filter(
          (booking) => new Date(booking.check_out) <= currentDate
        );

        // Iterate over all bookings
        for (let booking of bookings) {
          // If the booking status is "Confirmed" and the check-out date has passed
          if (
            booking.status === "Confirmed" &&
            new Date(booking.check_out) <= new Date()
          ) {
            // Update the booking status to "Done"
            let { data, error } = await supabase
              .from("booking")
              .update({ status: "Done" })
              .eq("id", booking.id);

            if (error) {
              console.error("Error updating booking status:", error);
            } else {
              // Update the booking status in the local bookings array
              booking.status = "Done";
            }
          }
        }

        // Generate HTML for recent bookings
        const recentBookingsContainer =
          document.querySelector(".recent-bookings");
        if (recentBookings.length > 0) {
          recentBookings.forEach((booking) => {
            const bookingElement = document.createElement("div");
            bookingElement.classList.add(
              "row",
              "align-items-center",
              "b_details",
              "py-1"
            );
            let statusClass = "";
            switch (booking.status) {
              case "Confirmed":
                statusClass = "bg-success";
                break;
              case "In Process":
                statusClass = "bg-warning";
                break;
              case "Cancelled":
                statusClass = "bg-danger";
                break;
            }
            bookingElement.innerHTML = `
                  <div class="col-6"><span>${booking.room.hotel.hotel_name}</span></div>
                  <div class="col-3 text-center">
                    <small class="${statusClass} text-white rounded-2 p-1">${booking.status}</small>
                  </div>
                  <div class="col-3 text-center">
                    <small class="btn btn-outline-secondary rounded-2 px-2 py-1 text-wrap" data-bs-toggle="modal"
                    data-bs-target="#detailsModal" data-booking-id="${booking.id}">Details</small>
                  </div>
                `;
            recentBookingsContainer.appendChild(bookingElement);
          });

          document
            .querySelector(".recent-bookings")
            .addEventListener("click", (event) => {
              if (event.target.matches("[data-booking-id]")) {
                let bookingId = Number(
                  event.target.getAttribute("data-booking-id")
                );
                let booking = bookings.find(
                  (booking) => booking.id === bookingId
                );
                if (booking) {
                  displayBookingData(booking);
                }
              }
            });
        } else {
          recentBookingsContainer.innerHTML = `
                <div class="row align-items-center b_details text-center py-5">
                  <div class="col"><span>No Recent Bookings</span></div>
                </div>
              `;
        }

        // Generate HTML for previous bookings
        const previousBookingsContainer =
          document.querySelector(".previous-bookings");
        if (previousBookings.length > 0) {
          previousBookings.forEach((booking) => {
            const bookingElement = document.createElement("div");
            bookingElement.classList.add(
              "row",
              "align-items-center",
              "b_details",
              "py-1"
            );
            let statusClass = "";
            switch (booking.status) {
              case "Done":
                statusClass = "bg-success";
                break;
              case "Cancelled":
                statusClass = "bg-danger";
                break;
            }
            bookingElement.innerHTML = `
              <div class="col-6"><span>${booking.room.hotel.hotel_name}</span></div>
              <div class="col-3 text-center">
                <small class="${statusClass} text-white rounded-2 p-1">${booking.status}</small>
              </div>
              <div class="col-3 text-center">
                <small class="btn btn-outline-secondary rounded-2 px-2 py-1 text-wrap" data-bs-toggle="modal"
                data-bs-target="#detailsModal" data-booking-id="${booking.id}">Details</small>
              </div>
            `;
            previousBookingsContainer.appendChild(bookingElement);
          });

          // Add an event listener to the "Details" button
          document
            .querySelector(".previous-bookings")
            .addEventListener("click", (event) => {
              if (event.target.matches("[data-booking-id]")) {
                let bookingId = Number(
                  event.target.getAttribute("data-booking-id")
                );
                let booking = bookings.find(
                  (booking) => booking.id === bookingId
                );
                if (booking) {
                  displayBookingData(booking);
                }
              }
            });
        } else {
          previousBookingsContainer.innerHTML = `
            <div class="row align-items-center b_details text-center py-5">
              <div class="col"><span>No Previous Bookings</span></div>
            </div>
          `;
        }
      }
    }
  }
}

let currentBookingId;

// Display booking data in the modal
function displayBookingData(booking) {
  currentBookingId = booking.id;

  // Select the spans
  let hotelDisplay = document.querySelector("#hotelDisplay");
  let roomDisplay = document.querySelector("#roomDisplay");
  let checkInDisplay = document.querySelector("#checkInDisplay");
  let checkOutDisplay = document.querySelector("#checkOutDisplay");
  let adultQuantityDisplay = document.querySelector("#adultQuantityDisplay");
  let childrenQuantityDisplay = document.querySelector(
    "#childrenQuantityDisplay"
  );
  let statusDisplay = document.querySelector("#statusDisplay");
  let totalAmountDisplay = document.querySelector("#totalAmountDisplay");

  // Select the "Cancel Booking" button
  let cancelBookingButton = document.querySelector("#cancelBookingButton");

  // Set the textContent of each span to the corresponding booking data
  hotelDisplay.textContent = booking.room.hotel.hotel_name;
  roomDisplay.textContent = booking.room.room_type;
  checkInDisplay.textContent = booking.check_in;
  checkOutDisplay.textContent = booking.check_out;
  adultQuantityDisplay.textContent = booking.adult_quantity;
  childrenQuantityDisplay.textContent = booking.child_quantity;
  statusDisplay.textContent = booking.status;
  totalAmountDisplay.textContent = "₱" + booking.payment.toLocaleString();

  // Hide the "Cancel Booking" button if the booking status is "Cancelled", "Done", or "Confirmed"
  if (
    booking.status === "Cancelled" ||
    booking.status === "Done" ||
    booking.status === "Confirmed"
  ) {
    cancelBookingButton.style.display = "none";
  } else {
    cancelBookingButton.style.display = "block";
  }
}

document
  .querySelector("#cancelBookingButton")
  .addEventListener("click", async () => {
    let { data, error } = await supabase
      .from("booking")
      .update({ status: "Cancelled" })
      .eq("id", currentBookingId);

    if (error) {
      console.error("Error updating booking: ", error);
    } else {
      // Redirect to account.html
      window.location.href = "booking.html";
    }
  });
