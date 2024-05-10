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
        .eq("user_id", user_info[0].id);

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

        // Generate HTML for recent bookings
        const recentBookingsContainer =
          document.querySelector(".recent-bookings");
        if (recentBookings.length > 0) {
          recentBookings.forEach((booking) => {
            const bookingElement = document.createElement("div");
            bookingElement.classList.add(
              "row",
              "align-items-center",
              "b_details"
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
                  <div class="col-3">
                    <small class="${statusClass} text-white rounded-2 p-1">${booking.status}</small>
                  </div>
                  <div class="col-3">
                    <small class="btn btn-outline-secondary rounded-2 px-2 py-1 text-wrap">Details</small>
                  </div>
                `;
            recentBookingsContainer.appendChild(bookingElement);
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
              "b_details"
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
              <div class="col-3">
                <small class="${statusClass} text-white rounded-2 p-1">${booking.status}</small>
              </div>
              <div class="col-3">
                <small class="btn btn-outline-secondary rounded-2 px-2 py-1 text-wrap">Details</small>
              </div>
            `;
            previousBookingsContainer.appendChild(bookingElement);
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
