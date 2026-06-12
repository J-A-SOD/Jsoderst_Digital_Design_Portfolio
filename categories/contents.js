const params = new URLSearchParams(window.location.search);
const initialCategory = params.get("cat");

const cards = document.querySelectorAll(".project-card");
const checkboxes = document.querySelectorAll(".dropdown-menu input");
const dropdownBtn = document.getElementById("dropdown-toggle");
const dropdownMenu = document.getElementById("dropdown-menu");

// --- DROPDOWN TOGGLE ---
dropdownBtn.addEventListener("click", () => {
  dropdownMenu.classList.toggle("show");
});

// --- APPLY FILTER ---
function applyFilters() {
  const selected = Array.from(checkboxes)
    .filter(cb => cb.checked)
    .map(cb => cb.value);

  // if nothing selected → show all
  if (selected.length === 0) {
    cards.forEach(card => {
      card.style.display = "block";
    });
    return;
  }

  cards.forEach(card => {
    if (selected.includes(card.dataset.category)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

// --- CHECKBOX CHANGE ---
checkboxes.forEach(cb => {
  cb.addEventListener("change", applyFilters);
});

// --- INITIAL FILTER FROM LANDING PAGE ---
if (initialCategory && initialCategory !== "all") {
  const target = document.querySelector(
    `.dropdown-menu input[value="${initialCategory}"]`
  );
  if (target) target.checked = true;
}

applyFilters();

// --- CLICK OUTSIDE TO CLOSE ---
document.addEventListener("click", (e) => {
  if (!e.target.closest(".dropdown")) {
    dropdownMenu.classList.remove("show");
  }
});