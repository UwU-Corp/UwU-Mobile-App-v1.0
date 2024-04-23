// Import our custom CSS
import "../scss/styles.scss";

// Import all of Bootstrap's JS
import * as bootstrap from "bootstrap";
// import "bootstrap/dist/js/bootstrap.bundle";

// Import Router
// import { setRouter } from "./router/router.js";

// Import supabase
import { createClient } from "@supabase/supabase-js";

// Set Router
// setRouter();

// Create a single supabase client for interacting with your database
const supabase = createClient(
  "https://niuvmcheeiwgcfqcltch.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pdXZtY2hlZWl3Z2NmcWNsdGNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTEyODUxMTksImV4cCI6MjAyNjg2MTExOX0.gqod-aFP7kmHFrYqZfYqHnddxklfH5Dd-wh-pBNIYYM"
);

//Search functionality
const searchModal = document.getElementById("searchModal");

searchModal.addEventListener("shown.bs.modal", function () {
  var input = document.getElementById("searchInput");
  input.focus();
});

export { supabase, bootstrap, searchModal };
