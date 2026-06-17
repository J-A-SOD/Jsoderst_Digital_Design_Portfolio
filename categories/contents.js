const params = new URLSearchParams(window.location.search);
const initialCategory = params.get("cat");

const cards = document.querySelectorAll(".project-card");
const checkboxes = document.querySelectorAll(".dropdown-menu input");
const dropdownBtn = document.getElementById("dropdown-toggle");
const dropdownMenu = document.getElementById("dropdown-menu");

const LandingBgFrameA = document.getElementById("LandingBgFrameA");
const LandingBgFrameB = document.getElementById("LandingBgFrameB");

const audioBtn = document.getElementById("audio-toggle");

// =============================
// FADE IN
// =============================
window.addEventListener("load", () => {
  const fades = document.querySelectorAll(".fade");
  fades.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add("show");
    }, i * 300);
  });
});

// =============================
// DROPDOWN
// =============================
dropdownBtn.addEventListener("click", () => {
  dropdownMenu.classList.toggle("show");
});

function applyFilters() {
  const selected = Array.from(checkboxes)
    .filter(cb => cb.checked)
    .map(cb => cb.value);

  if (selected.length === 0) {
    cards.forEach(card => card.style.display = "block");
    return;
  }

  cards.forEach(card => {
    card.style.display = selected.includes(card.dataset.category)
      ? "block"
      : "none";
  });
}

checkboxes.forEach(cb => {
  cb.addEventListener("change", applyFilters);
});

if (initialCategory && initialCategory !== "all") {
  const target = document.querySelector(
    `.dropdown-menu input[value="${initialCategory}"]`
  );
  if (target) target.checked = true;
}

applyFilters();

document.addEventListener("click", (e) => {
  if (!e.target.closest(".dropdown")) {
    dropdownMenu.classList.remove("show");
  }
});

// =============================
// BACKGROUND
// =============================
const totalFrames = 60;
let currentFrame = 1;
let showingA = true;
let frameRequestId = 0;

document.addEventListener("mousemove", (e) => {

  const y = e.clientY / window.innerHeight;
  const x = e.clientX / window.innerWidth;

  const progress = (x + y) / 2 + (x - y) * 0.2;
  const frameIndex = Math.round(progress * (totalFrames - 1)) + 1;

  // IMPORTANT FIX
  if (frameIndex === currentFrame) return;
  currentFrame = frameIndex;

  frameRequestId++;
  const requestId = frameRequestId;

  const padded = String(frameIndex).padStart(3, "0");
  const nextSrc = `../assets/navframes/frame_${padded}.jpg`;

  const nextImage = showingA ? LandingBgFrameB : LandingBgFrameA;
  const currentImage = showingA ? LandingBgFrameA : LandingBgFrameB;

  const img = new Image();
  img.src = nextSrc;

  img.onload = () => {

    // prevent race condition
    if (requestId !== frameRequestId) return;

    nextImage.src = nextSrc;
    nextImage.style.opacity = 1;

    requestAnimationFrame(() => {
      currentImage.style.opacity = 0;
      showingA = !showingA;
    });
  };
});

// =============================
// CURSOR (FIXED)
// =============================
const cursor = document.querySelector(".cursor-glass");
const links = document.querySelectorAll(".header-nav a, #dropdown-toggle, #audio-toggle");

if (cursor) {

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
      if (!link) return;

      const rect = link.getBoundingClientRect();

      const dx = Math.max(rect.left - e.clientX, 0, e.clientX - rect.right);
      const dy = Math.max(rect.top - e.clientY, 0, e.clientY - rect.bottom);

      const distance = Math.sqrt(dx * dx + dy * dy);

      minDistance = Math.min(minDistance, distance);
    });

    const maxDist = 200;
    const proximity = Math.max(0, 1 - minDistance / maxDist);

    targetScale = speedScale * (1 - proximity * 0.8);
  });

  function animateCursor() {
    currentScale += (targetScale - currentScale) * 0.06;
    cursor.style.transform = `translate(-50%, -50%) scale(${currentScale})`;
    requestAnimationFrame(animateCursor);
  }

  animateCursor();
}

// =============================
// AUDIO
// =============================
const hoverSounds = [
  document.getElementById("hover1"),
  document.getElementById("hover2"),
  document.getElementById("hover3"),
  document.getElementById("hover4")
];

const navLinks = document.querySelectorAll(".header-nav a");

let audioEnabled = false;
let audioUnlocked = false;

if (audioBtn) {
  audioBtn.textContent = "Enable Sound";
}

audioBtn.addEventListener("click", () => {

  if (!audioUnlocked) {
    hoverSounds.forEach(sound => {
      if (!sound) return;
      sound.play().then(() => {
        sound.pause();
        sound.currentTime = 0;
      }).catch(() => {});
    });
    audioUnlocked = true;
  }

  audioEnabled = !audioEnabled;

  audioBtn.textContent = audioEnabled
    ? "Mute Sound"
    : "Enable Sound";
});

navLinks.forEach(link => {
  link.addEventListener("mouseenter", () => {

    if (!audioEnabled) return;

    const base = hoverSounds[
      Math.floor(Math.random() * hoverSounds.length)
    ];

    if (!base) return;

    const sound = base.cloneNode();
    sound.play();
  });
});