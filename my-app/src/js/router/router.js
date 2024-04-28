function setRouter() {
  // Check the current page
  switch (window.location.pathname) {
    // If you are logged in
    case "/login.html":
    case "/signup.html":
      // If the user is logged in
      if (localStorage.getItem("access_token")) {
        // If the user is a customer, redirect them to the index page
        if (localStorage.getItem("role") == "customer") {
          window.location.pathname = "/index.html";
        }
        // If the user is an admin, redirect them to the admin page
        else if (localStorage.getItem("role") == "admin") {
          window.location.pathname = "/admin.html";
        }
        // If the user is a hadmin, redirect them to the hadmin page
        else if (localStorage.getItem("role") == "hadmin") {
          window.location.pathname = "/hadmin.html";
        }
      }
      break;

    // If you are not logged in
    case "/admin.html":
      // If the user is not logged in or not an admin, redirect them to the account page
      if (
        !localStorage.getItem("access_token") ||
        localStorage.getItem("role") != "admin"
      ) {
        window.location.pathname = "/account.html";
      }
      break;

    // If you are not logged in
    // case "/hadmin.html":
    // If the user is not logged in or not a hadmin, redirect them to the account page
    // if (
    //   !localStorage.getItem("access_token") ||
    //   localStorage.getItem("role") != "hadmin"
    // ) {
    //   window.location.pathname = "/account.html";
    // }
    // break;

    default:
      // If the user is an admin, redirect them to the admin page
      if (localStorage.getItem("role") == "admin") {
        window.location.pathname = "/admin.html";
      }
    // If the user is a hadmin, redirect them to the hadmin page
    // else if (localStorage.getItem("role") == "hadmin") {
    //   window.location.pathname = "/hadmin.html";
    // }
    // break;
  }
}

// Export the function
export { setRouter };
