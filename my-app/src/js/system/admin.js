import { supabase, doLogout } from "../main";

// Load the user's information
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
      .select("*")
      .eq("user_id", user.id);

    console.log(user_info);

    // Get the Logout link
    let logoutLinkElement = document.querySelector(
      ".dropdown-menu .dropdown-item"
    );

    // Add an event listener to the Logout link that calls doLogout() when clicked
    logoutLinkElement.addEventListener("click", doLogout);
  }
}
