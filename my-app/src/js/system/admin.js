import { supabase } from "../main";
// !! functionality for notification
// Success Notification
function successNotification(message, seconds = 0) {
  document.querySelector(".alert-success").classList.remove("d-none");
  document.querySelector(".alert-success").classList.add("d-block");
  document.querySelector(".alert-success").innerHTML = message;

  if (seconds != 0) {
    setTimeout(function () {
      document.querySelector(".alert-success").classList.remove("d-block");
      document.querySelector(".alert-success").classList.add("d-none");
    }, seconds * 1000);
  }
}

// Error Notification
function errorNotification(message, seconds = 0) {
  document.querySelector(".alert-danger").classList.remove("d-none");
  document.querySelector(".alert-danger").classList.add("d-block");
  document.querySelector(".alert-danger").innerHTML = message;

  if (seconds != 0) {
    setTimeout(function () {
      document.querySelector(".alert-danger").classList.remove("d-block");
      document.querySelector(".alert-danger").classList.add("d-none");
    }, seconds * 1000);
  }
}

const btn_logout = document.getElementById("btn_logout");
btn_logout.onclick = async () => {
  let { error } = await supabase.auth.signOut();

  if (error == null) {
    successNotification("Log out successfully!",3 );
    // ! clear local storage
    localStorage.clear();

    // ! redirect to index.html
    window.location.pathname = "/"; 
  } else {
    errorNotification("Log out failed!", 3);
  }
};
