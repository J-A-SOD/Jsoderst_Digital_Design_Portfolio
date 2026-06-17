const params = new URLSearchParams(window.location.search);
const initialCategory = params.get("cat");

const cards = document.querySelectorAll(".project-card");
const checkboxes = document.querySelectorAll(".dropdown-menu input");
const dropdownBtn = document.getElementById("dropdown-toggle");
const dropdownMenu = document.getElementById("dropdown-menu");

const LandingBgFrameA = document.getElementById("LandingBgFrameA");
const LandingBgFrameB = document.getElementById("LandingBgFrameB");

// FADE IN
window.addEventListener("load", () => {
  const fades = document.querySelectorAll(".fade");

  fades.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add("show");
    }, i * 300);
  });
});

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

// BG ANIMATIONS //
document.addEventListener("click", (e) => {
  if (!e.target.closest(".dropdown")) {
    dropdownMenu.classList.remove("show");
  }
});

const totalFrames = 60;
let currentFrame = 1;
let showingA = true;

document.addEventListener("mousemove", (e) => {
  const y = e.clientY / window.innerHeight;
  const x = e.clientX / window.innerWidth;

  const progress = (x + y) / 2 + (x - y) * 0.2;
  const frameIndex = Math.round(progress * (totalFrames - 1)) + 1;

  isTransitioning = true;
  currentFrame = frameIndex;

  const padded = String(frameIndex).padStart(3, "0");
  const nextSrc = `../assets/navframes/frame_${padded}.jpg`;

  const nextImage = showingA ? LandingBgFrameB : LandingBgFrameA;
  const currentImage = showingA ? LandingBgFrameA : LandingBgFrameB;

  const img = new Image();
  img.src = nextSrc;

  img.onload = () => {

    // ensure new image is ready
    nextImage.src = nextSrc;
    nextImage.style.opacity = 1;

    // only after it's visible, remove old
    requestAnimationFrame(() => {
      currentImage.style.opacity = 0;

      showingA = !showingA;

      isTransitioning = false;
    });
  };
});



// CURSOR //

const cursor = document.querySelector(".cursor-glass");
const links = document.querySelectorAll(".header-nav a, #dropdown-toggle");

let lastX = 0;
let lastY = 0;
let velocity = 0;

let currentScale = 1;
let targetScale = 1;

document.addEventListener("mousemove", (e) => {
  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";

  const dx = e.clientX - lastX;
  const dy = e.clientY - lastY;

  velocity = Math.sqrt(dx * dx + dy * dy);

  lastX = e.clientX;
  lastY = e.clientY;

  let speedScale = Math.max(0.5, 1 - velocity / 80);

  let minDistance = Infinity;

  links.forEach(link => {
    const rect = link.getBoundingClientRect();

    const dx = Math.max(rect.left - e.clientX, 0, e.clientX - rect.right);
    const dy = Math.max(rect.top - e.clientY, 0, e.clientY - rect.bottom);

    const distance = Math.sqrt(dx * dx + dy * dy);

    minDistance = Math.min(minDistance, distance);
  });

  const maxDist = 200;
  let proximity = Math.max(0, 1 - minDistance / maxDist);

  targetScale = speedScale * (1 - proximity * 0.8);
});

function animateCursor() {
  currentScale += (targetScale - currentScale) * 0.06;

  cursor.style.transform = `translate(-50%, -50%) scale(${currentScale})`;

  requestAnimationFrame(animateCursor);
}

animateCursor();