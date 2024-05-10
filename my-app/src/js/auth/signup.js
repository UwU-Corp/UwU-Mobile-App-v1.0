import { supabase, Toastify } from "../main";

// Success Notification
function successNotification(message) {
  Toastify({
    text: message,
    duration: 10000,
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

const form_register = document.getElementById("form_register");

form_register.onsubmit = async (e) => {
  e.preventDefault(); // Prevent the default form submission behavior

  // Disable the submit button
  document.querySelector("#form_register button").disabled = true;
  document.querySelector(
    "#form_register button"
  ).innerHTML = `<span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
    <span>Loading...</span>`;

  // Get value from form
  const formData = new FormData(form_register);

  // Check if passwords match
  if (formData.get("password") !== formData.get("password_confirmation")) {
    errorNotification("Passwords do not match. Please try again.");
    // Enable Submit Button
    document.querySelector("#form_register button").disabled = false;
    document.querySelector("#form_register button").innerHTML = `Sign Up`;
    return;
  }

  // Create user
  const { data, error } = await supabase.auth.signUp({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  let user_id = data.user.id;

  // Check if user is already registered
  if (user_id != null) {
    const { data, error } = await supabase
      .from("user_info")
      .insert([
        {
          first_name: formData.get("first_name"),
          last_name: formData.get("last_name"),
          contact_num: formData.get("contact_num"),
          address: formData.get("address"),
          user_id: user_id,
          role: "customer", // automatically set the role to customer
        },
      ])
      .select();

    // Notification
    if (error == null) {
      successNotification("Signup successful! Please check your email.");
    } else {
      errorNotification("Something went wrong. Please try again later.");
      console.log(error);
    }
  }

  // Reset Form
  form_register.reset();

  // Enable Submit Button
  document.querySelector("#form_register button").disabled = false;
  document.querySelector("#form_register button").innerHTML = `Sign Up`;
};
