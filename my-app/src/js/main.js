// Import our custom CSS
import "../scss/styles.scss";

// Import all of Bootstrap's JS
import * as bootstrap from "bootstrap";
// import "bootstrap/dist/js/bootstrap.bundle";

// Import Router
import { setRouter } from "./router/router.js";

// Import supabase
import { createClient } from "@supabase/supabase-js";

// Set Router
setRouter();

// Create a single supabase client for interacting with your database
const supabase = createClient(
  "https://alzkjjjbtyariubvcwcn.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsemtqampidHlhcml1YnZjd2NuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTM5MzY4MDcsImV4cCI6MjAyOTUxMjgwN30.b7nqneAN1DXhQjilH1Xs5IhAZeVN1CjtYwfRzxZ87h8"
);

// Search functionality
const searchModal = document.getElementById("searchModal");

if (searchModal) {
  // Check if searchModal exists
  searchModal.addEventListener("shown.bs.modal", function () {
    var input = document.getElementById("searchInput");
    if (input) {
      input.focus();
    }
  });
}

export { supabase, searchModal };
