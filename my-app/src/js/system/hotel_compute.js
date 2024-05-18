import { supabase } from "../main";

// Load the user's information and check for hotel ownership
getUserInfo();

// Get the user's information
async function getUserInfo() {
  try {
    const { data, error: userError } = await supabase.auth.getUser();

    if (userError) {
      throw new Error("Error fetching user: " + userError.message);
    }

    const user = data.user;
    if (!user) {
      throw new Error("User not authenticated.");
    }

    const { data: userInfo, error: userInfoError } = await supabase
      .from("user_info")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (userInfoError) {
      throw new Error("Error fetching user info: " + userInfoError.message);
    }

    if (!userInfo) {
      throw new Error("User info not found.");
    }

    const adminId = userInfo.id; // store the id of admin
    const hotelId = await getHotelId(adminId); // store the id of hotel

    // Query rooms and bookings after getting hotelId
    if (hotelId) {
      const roomIds = await getRoomIds(hotelId);
      if (roomIds && roomIds.length > 0) {
        await checkBookings(roomIds);
      } else {
        console.log("No rooms found for the given hotel ID.");
      }
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// Function to get the hotel ID associated with the admin ID
async function getHotelId(adminId) {
  try {
    const { data: hotelData, error } = await supabase
      .from("hotel")
      .select("id")
      .eq("admin_id", adminId)
      .single();

    if (error) {
      throw new Error("Error fetching hotel ID: " + error.message);
    }

    if (!hotelData) {
      console.log("No hotel found for admin ID:", adminId);
      return null;
    }

    return hotelData.id;
  } catch (error) {
    console.error("Error:", error.message);
    return null;
  }
}

// Function to get room IDs for a specific hotel
async function getRoomIds(hotelId) {
  try {
    const { data: roomsData, error } = await supabase
      .from('room')
      .select('id')
      .eq('hotel_id', hotelId);

    if (error) {
      throw new Error("Error fetching room IDs: " + error.message);
    }

    if (!roomsData || roomsData.length === 0) {
      console.log("No rooms found for hotel ID:", hotelId);
      return [];
    }

    return roomsData.map(room => room.id);
  } catch (error) {
    console.error("Error:", error.message);
    return [];
  }
}

async function checkBookings(roomIds) {
  try {
    const { data, error } = await supabase
      .from('booking')
      .select('id, room_id, user_id') // Include user_id to count unique users
      .in('room_id', roomIds);

    if (error) {
      throw new Error("Error fetching bookings: " + error.message);
    }

    const totalBookings = data.length; // Get the total number of bookings
    console.log(totalBookings); // Log the total number of bookings

    const bookedUsers = new Set(); // Set to store unique user IDs

    // Iterate through the bookings data and add user IDs to the Set
    data.forEach(booking => {
      bookedUsers.add(booking.user_id);
    });

    const totalUniqueUsers = bookedUsers.size; // Get the count of unique user IDs
    console.log(totalUniqueUsers); // Log the count of unique user IDs

    // Save the total number of bookings as a constant
    const TOTAL_BOOKINGS = totalBookings;
    // Save the total count of unique users as a constant
    const TOTAL_UNIQUE_USERS = totalUniqueUsers;

    // Update HTML elements with the counts
    document.getElementById('totalBookings').textContent = TOTAL_BOOKINGS;
    document.getElementById('totalUsersBooked').textContent = TOTAL_UNIQUE_USERS;

    // Fetch user information for each booked user
    await getUsersInfo(data);

    // Or you can return them or use them elsewhere in your code
    return { totalBookings: TOTAL_BOOKINGS, totalUniqueUsers: TOTAL_UNIQUE_USERS };
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// Function to fetch user information based on booking data
async function getUsersInfo(bookingsData) {
  try {
    const userIds = bookingsData.map(booking => booking.user_id);
    const { data, error } = await supabase
      .from('user_info')
      .select('id, first_name, last_name, contact_num')
      .in('id', userIds);

    if (error) {
      throw new Error("Error fetching user info: " + error.message);
    }

    // Log the user info
    console.log(data);

    // Clear previous content
    const userInfoContainer = document.getElementById('user-info-container');
    userInfoContainer.innerHTML = '';

    // Add user information dynamically
    data.forEach(user => {
      const userInfoRow = document.createElement('div');
      userInfoRow.classList.add('row', 'align-items-center', 'b_details');

      const nameCol = document.createElement('div');
      nameCol.classList.add('col-5');
      nameCol.innerHTML = `<span>${user.first_name} ${user.last_name}</span>`;

      const contactCol = document.createElement('div');
      contactCol.classList.add('col-3');
      contactCol.innerHTML = `<span>${user.contact_num}</span>`;

      const actionCol = document.createElement('div');
      actionCol.classList.add('col', 'text-center');
      actionCol.innerHTML = `<small class="btn btn-outline-primary rounded-2 px-2 py-1">View</small>`;

      userInfoRow.appendChild(nameCol);
      userInfoRow.appendChild(contactCol);
      userInfoRow.appendChild(actionCol);

      userInfoContainer.appendChild(userInfoRow);
    });

    // Or you can return the user info or use it elsewhere in your code
    return data;
  } catch (error) {
    console.error("Error:", error.message);
  }
}


// Trigger the function to fetch and display user information
async function displayUserInfo() {
  try {
    // Fetch bookings data (replace this with your actual bookings data)
    const bookingsData = []; // Replace this with your actual bookings data
    await getUsersInfo(bookingsData);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// Call the function to display user information when needed
displayUserInfo();
