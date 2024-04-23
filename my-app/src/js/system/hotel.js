import { supabase, bootstrap, searchModal } from "../main";

// Modal for Search
const modalSearch = document.getElementById("searchModal");

modalSearch.onclick = searchModal;
