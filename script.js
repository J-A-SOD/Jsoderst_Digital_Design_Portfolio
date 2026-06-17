// =============================
// DOM REFERENCES
// =============================
const cursor = document.querySelector(".cursor-glass");
const links = document.querySelectorAll(".header-nav a, #audio-toggle, .arrow, .project-preview");

const leftLine = document.querySelector(".left");
const rightContainer = document.querySelector(".right-container");

const LandingBgFrameA = document.getElementById("LandingBgFrameA");
const LandingBgFrameB = document.getElementById("LandingBgFrameB");

const glass = document.querySelector(".glass-layer");

const arrow = document.getElementById("arrow");
const button = document.getElementById("audio-toggle");

const cards = document.querySelectorAll(".project-preview");
const hero = document.getElementById("hero");

// =============================
// TEXT ROTATOR
// =============================
const words = [
  "graphic design",
  "photography",
  "music",
  "sound design",
  "architecture",
  "interactive media"
];

let wordIndex = 0;
const text = document.getElementById("changing-landing-accent");

if (text) {
  setInterval(() => {
    text.style.opacity = 0;

    setTimeout(() => {
      wordIndex = (wordIndex + 1) % words.length;
      text.textContent = words[wordIndex];
      text.style.opacity = 1;
    }, 300);

  }, 2000);
}

// =============================
// CURSOR
// =============================
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

// =============================
// TEXT PARALLAX
// =============================
let mouseY = 0;
let currentOffset = 0;

document.addEventListener("mousemove", (e) => {
  mouseY = e.clientY;
});

function animateText() {
  const normalizedY = (mouseY / window.innerHeight) - 0.5;
  const targetOffset = normalizedY * 50;

  currentOffset += (targetOffset - currentOffset) * 0.05;

  leftLine.style.transform = `translateX(${-currentOffset}px)`;
  rightContainer.style.transform = `translateX(${currentOffset}px)`;

  requestAnimationFrame(animateText);
}

animateText();

// =============================
// BACKGROUND
// =============================
const totalFrames = 40;
let currentFrame = 1;
let showingA = true;

document.addEventListener("mousemove", (e) => {
  const y = e.clientY / window.innerHeight;
  const x = e.clientX / window.innerWidth;

  const progress = (x + y) / 2 + (x - y) * 0.2;
  const frameIndex = Math.round(progress * (totalFrames - 1)) + 1;

  if (frameIndex !== currentFrame) {
    currentFrame = frameIndex;

    const nextSrc = `assets/landingframes/frame_0${frameIndex}.jpg`;

    const nextImage = showingA ? LandingBgFrameB : LandingBgFrameA;
    const currentImage = showingA ? LandingBgFrameA : LandingBgFrameB;

    const img = new Image();
    img.src = nextSrc;

    img.onload = () => {
      nextImage.src = nextSrc;
      nextImage.style.opacity = 1;
      currentImage.style.opacity = 0;

      showingA = !showingA;
    };
  }
});

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
// AUDIO
// =============================
const a = document.getElementById("track00");
const b = document.getElementById("track01");
const c = document.getElementById("track10");
const d = document.getElementById("track11");

const tracks = [a, b, c, d];

let targetVolumes = [0, 0, 0, 0];
let currentVolumes = [0, 0, 0, 0];

tracks.forEach(t => {
  t.volume = 0;
  t.loop = true;
  t.play();
});

function makeSeamlessLoop(track, overlap = 0.15) {
  function check() {
    if (track.currentTime >= track.duration - overlap) {
      track.currentTime = 0;
    }
    requestAnimationFrame(check);
  }
  check();
}

tracks.forEach(t => makeSeamlessLoop(t));

document.addEventListener("mousemove", (e) => {
  const x = e.clientX / window.innerWidth;
  const y = e.clientY / window.innerHeight;

  targetVolumes[0] = (1 - x) * (1 - y);
  targetVolumes[1] = x * (1 - y);
  targetVolumes[2] = (1 - x) * y;
  targetVolumes[3] = x * y;
});

function animateAudio() {
  for (let i = 0; i < tracks.length; i++) {
    currentVolumes[i] += (targetVolumes[i] - currentVolumes[i]) * 0.01;
    tracks[i].volume = currentVolumes[i];
  }

  requestAnimationFrame(animateAudio);
}

animateAudio();

let audioPlaying = false;

button.addEventListener("click", () => {
  if (!audioPlaying) {
    tracks.forEach(t => t.play());
    button.textContent = "Mute Sound";
  } else {
    tracks.forEach(t => t.pause());
    button.textContent = "Enable Sound";
  }

  audioPlaying = !audioPlaying;
});

// =============================
// ARROW
// =============================
let LandingOpen = false;

arrow.addEventListener("click", () => {
  LandingOpen = !LandingOpen;

  hero.classList.toggle("move-up", LandingOpen);
  document.body.classList.toggle("move-up", LandingOpen);
  arrow.classList.toggle("flipped", LandingOpen);
  document.body.classList.toggle("colour-shift", LandingOpen);

  bgTarget.hue = LandingOpen ? 120 : 0;
  bgTarget.sat = LandingOpen ? 1.5 : 0.9;
  bgTarget.bright = LandingOpen ? 4.0 : 0.9;
});

// =============================
// BACKGROUND COLOR
// =============================
let bgCurrent = { hue: 0, sat: 1, bright: 1 };
let bgTarget = { hue: 0, sat: 1, bright: 1 };

function animatebgColour() {
  bgCurrent.hue += (bgTarget.hue - bgCurrent.hue) * 0.03;
  bgCurrent.sat += (bgTarget.sat - bgCurrent.sat) * 0.01;
  bgCurrent.bright += (bgTarget.bright - bgCurrent.bright) * 0.01;

  if (glass) {
    glass.style.backdropFilter = `
      blur(35px)
      hue-rotate(${bgCurrent.hue}deg)
      saturate(${bgCurrent.sat})
      brightness(${bgCurrent.bright})
    `;
  }

  requestAnimationFrame(animatebgColour);
}

animatebgColour();

// =============================
// STACK SYSTEM
// =============================
let currentIndex = Math.floor(cards.length / 2);

function updateStack() {
  cards.forEach((card, i) => {
    const offset = i - currentIndex;

    const y = offset > 0 ? offset * 80 : offset * 20;

    const scale = 1 - Math.abs(offset) * 0.03;
    const opacity = 1 - Math.abs(offset) * 0.1;

    card.style.transform = `
      translateY(${y}px)
      scale(${scale})
    `;
    card.style.opacity = opacity;
    card.style.zIndex = 100 - Math.abs(offset);

    card.classList.toggle("active", i === currentIndex);
  });
}

updateStack();

let isScrolling = false;

window.addEventListener("wheel", (e) => {
  if (!LandingOpen || isScrolling) return;

  isScrolling = true;

  if (e.deltaY > 0) {
    currentIndex = Math.min(cards.length - 1, currentIndex + 1);
  } else {
    currentIndex = Math.max(0, currentIndex - 1);
  }

  updateStack();

  setTimeout(() => {
    isScrolling = false;
  }, 300);
});

// =============================
// NAVIGATION
// =============================
function openProject(index) {
  const pages = [
    "interactive.html",
    "music.html",
    "photo.html",
    "architecture.html",
    "art.html"
  ];

  window.location.href = pages[index];
}

cards.forEach((card, i) => {
  card.addEventListener("click", () => {
    if (i !== currentIndex) return;
    openProject(i);
  });
});


// =============================
// AUDIO
// =============================

const audioBtn = document.getElementById("audio-toggle");

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