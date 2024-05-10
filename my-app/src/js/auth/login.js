import { supabase, Toastify } from "../main";

// Success Notification
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

// Error Notification
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

const form_login = document.getElementById("form_login");

form_login.onsubmit = async (e) => {
  e.preventDefault(); // Prevent the default form submission behavior

  //!! Disable the submit button
  document.querySelector("#form_login button").disabled = true;
  document.querySelector(
    "#form_login button"
  ).innerHTML = `<span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
                      </div>
                      <span>Loading...</span>`;

  // !! get value from form
  const formData = new FormData(form_login);

  let { data, error } = await supabase.auth.signInWithPassword({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  let session = data.session;
  let user = data.user;

  // !! storing token
  if (session != null) {
    localStorage.setItem("access_token", session.access_token);
    localStorage.setItem("refresh_token", session.refresh_token);

    let { data: user_info, error } = await supabase
      .from("user_info")
      .select("role")
      .eq("user_id", user.id);

    if (user_info.length > 0) {
      // !! store role
      localStorage.setItem("role", user_info[0].role);
    } else {
      console.log("No user info found for this user");
    }
  }

  // Check if there's an error with the login process
  if (error == null) {
    successNotification("Logged in successfully!");
    setTimeout(function () {
      // Add timer to redirect to the home page
      window.location.pathname = "/index.html";
    }, 3000); // 3000 milliseconds = 3 seconds
  } else {
    // Display an error message to the user
    if (error.status === 400) {
      errorNotification(
        "Invalid email or password, or email not confirmed. Please check and try again."
      );
    } else {
      errorNotification("Something went wrong, please try again later.");
    }
  }

  //!! Reset Form
  form_login.reset();

  //!! Enable Submit Button
  document.querySelector("#form_login button").disabled = false;
  document.querySelector("#form_login button").innerHTML = `Log in`;
};

// how about in the error part notification make the grammar suitable upon not logged in. maybe b
