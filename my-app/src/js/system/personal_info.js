import { supabase, Toastify } from "../main";

getUserInfo();

async function getUserInfo() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user != null) {
    let { data: user_info, error } = await supabase
      .from("user_info")
      .select("*")
      .eq("user_id", user.id);

    if (user_info && user_info.length > 0) {
      const userDetails = user_info[0];

      // Select the span element to display
      const emailDisplay = document.getElementById("emailDisplay");
      const firstNameDisplay = document.getElementById("firstNameDisplay");
      const lastNameDisplay = document.getElementById("lastNameDisplay");
      const contactNoDisplay = document.getElementById("contactNoDisplay");
      const addressDisplay = document.getElementById("addressDisplay");

      // Select the input field to edit
      const emailInput = document.getElementById("email");
      const firstNameInput = document.getElementById("firstname");
      const lastNameInput = document.getElementById("lastname");
      const contactNoInput = document.getElementById("contactNo");
      const addressInput = document.getElementById("address");

      // Set the text content of the span element to display the user's information
      emailDisplay.textContent = user.email;
      firstNameDisplay.textContent = userDetails.first_name;
      lastNameDisplay.textContent = userDetails.last_name;
      contactNoDisplay.textContent = userDetails.contact_num;
      addressDisplay.textContent = userDetails.address;

      // Set the value of the input field to the user's information
      emailInput.value = user.email;
      firstNameInput.value = userDetails.first_name;
      lastNameInput.value = userDetails.last_name;
      contactNoInput.value = userDetails.contact_num;
      addressInput.value = userDetails.address;
    }
  }
}

// Add the event listener for the form's submit event to update the user's email
document
  .querySelector("#emailModal form")
  .addEventListener("submit", async (event) => {
    // Prevent the form from submitting normally
    event.preventDefault();

    const emailInput = document.getElementById("email");

    const { data, error } = await supabase.auth.updateUser({
      email: emailInput.value,
    });

    if (error) {
      console.log(error);
    } else {
      // Redirect to personal_info.html
      window.location.href = "personal_info.html";
    }
  });

// Add the event listener for the form's submit event to update the user's first name
document
  .querySelector("#firstNameModal form")
  .addEventListener("submit", async (event) => {
    // Prevent the form from submitting normally
    event.preventDefault();

    const firstNameInput = document.getElementById("firstname");
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user && user.id) {
      const { error } = await supabase
        .from("user_info")
        .update({ first_name: firstNameInput.value })
        .eq("user_id", user.id);

      if (error) {
        console.log(error);
      } else {
        // Redirect to personal_info.html
        window.location.href = "personal_info.html";
      }
    }
  });

// Add the event listener for the form's submit event to update the user's last name
document
  .querySelector("#lastNameModal form")
  .addEventListener("submit", async (event) => {
    // Prevent the form from submitting normally
    event.preventDefault();

    const lastNameInput = document.getElementById("lastname");
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user && user.id) {
      const { error } = await supabase
        .from("user_info")
        .update({ last_name: lastNameInput.value })
        .eq("user_id", user.id);

      if (error) {
        console.log(error);
      } else {
        // Redirect to personal_info.html
        window.location.href = "personal_info.html";
      }
    }
  });

// Add the event listener for the form's submit event to update the user's contact number
document
  .querySelector("#contactNoModal form")
  .addEventListener("submit", async (event) => {
    // Prevent the form from submitting normally
    event.preventDefault();

    const contactNoInput = document.getElementById("contactNo");
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user && user.id) {
      const { error } = await supabase
        .from("user_info")
        .update({ contact_num: contactNoInput.value })
        .eq("user_id", user.id);

      if (error) {
        console.log(error);
      } else {
        // Redirect to personal_info.html
        window.location.href = "personal_info.html";
      }
    }
  });

// Add the event listener for the form's submit event to update the user's address
document
  .querySelector("#addressModal form")
  .addEventListener("submit", async (event) => {
    // Prevent the form from submitting normally
    event.preventDefault();

    const addressInput = document.getElementById("address");
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user && user.id) {
      const { error } = await supabase
        .from("user_info")
        .update({ address: addressInput.value })
        .eq("user_id", user.id);

      if (error) {
        console.log(error);
      } else {
        // Redirect to personal_info.html
        window.location.href = "personal_info.html";
      }
    }
  });

// Add the event listener for the button's click event
// document
//   .querySelector("#resetPassword")
//   .addEventListener("click", async (event) => {
//     // Prevent the button from submitting a form or refreshing the page
//     event.preventDefault();

//     const emailInput = document.getElementById("email");
//     const { data, error } = await supabase.auth.resetPasswordForEmail(
//       emailInput.value
//     );

//     if (error) {
//       console.log("Error sending password reset email:", error);
//     } else {
//       // Display a toast notification
//       Toastify({
//         text: "Password reset email sent",
//         duration: 3000,
//         close: true,
//         gravity: "top", // `top` or `bottom`
//         position: "right", // `left`, `center` or `right`
//         backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
//       }).showToast();
//     }
//   });
