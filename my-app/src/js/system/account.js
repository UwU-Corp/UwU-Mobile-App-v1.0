import { supabase } from "../main";

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
      .select("first_name, last_name, address, contact_num")
      .eq("user_id", user.id);
    console.log(user_info);

    // Display the user's name
    if (user_info && user_info.length > 0) {
      const { first_name, last_name } = user_info[0];
      document.getElementById(
        "user-name"
      ).textContent = `${first_name} ${last_name}`;
    }
  }
}
