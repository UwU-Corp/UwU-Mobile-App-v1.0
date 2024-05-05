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

    // Display the user's name
    if (user_info && user_info.length > 0) {
      const { first_name, last_name } = user_info[0];
      document.getElementById(
        "user-name"
      ).textContent = `${first_name} ${last_name}`;
    }

    // Change the text of the Login link to Logout
    let loginLinkElement = document.getElementById("login-link");
    loginLinkElement.childNodes[2].nodeValue = " Logout";

    // Remove the href attribute from the parent a element
    loginLinkElement.parentNode.removeAttribute("href");

    // Change the icon of the login-link element to a logout icon
    document.getElementById("login-icon").className =
      "bi bi-box-arrow-right pe-3";
    loginLinkElement.childNodes[3].remove();

    // Add an event listener to the login-link element that calls doLogout() when clicked
    loginLinkElement.addEventListener("click", doLogout);
  } else {
    // // If the user is not logged in, disable the modals and redirect to login.html when clicked
    // let modalElements = document.querySelectorAll("[data-bs-toggle='modal']");
    // modalElements.forEach((element) => {
    //   // Skip the Help Center element
    //   if (element.getAttribute("data-bs-target") !== "#faqModal") {
    //     element.removeAttribute("data-bs-toggle");
    //     element.style.cursor = "not-allowed";
    //     element.addEventListener("click", function () {
    //       window.location.href = "login.html";
    //     });
    //   } else {
    //     // Enable the Help Center modal
    //     element.setAttribute("data-bs-toggle", "modal");
    //   }
    // });
  }
}
