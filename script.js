const bg = document.querySelector(".background");


// LANDING PAGE TEXT ALTERNATOR

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

// GLASS CURSOR SCRIPT

const cursor = document.querySelector(".cursor-glass");
const links = document.querySelectorAll(".header-nav a, #audio-toggle, .arrow");

let lastX = 0;
let lastY = 0;

let velocity = 0;
let currentScale = 1;
let targetScale = 1;

document.addEventListener("mousemove", (e) => {
  // move cursor
  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";

  // calculate speed
  const dx = e.clientX - lastX;
  const dy = e.clientY - lastY;

  velocity = Math.sqrt(dx * dx + dy * dy);

  lastX = e.clientX;
  lastY = e.clientY;

  // base scale from speed
  let speedScale = Math.max(0.5, 1 - velocity / 80);

  // check proximity to links
  let nearLink = false;

  links.forEach(link => {
    const rect = link.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distX = e.clientX - centerX;
    const distY = e.clientY - centerY;

    const distance = Math.sqrt(distX * distX + distY * distY);

    if (distance < 70) {
      nearLink = true;
    }
  });

  // combine effects
  targetScale = nearLink ? 0.2 : speedScale;
});

function animate() {
  currentScale += (targetScale - currentScale) * 0.06;

  cursor.style.transform = `translate(-50%, -50%) scale(${currentScale})`;

  requestAnimationFrame(animate);
}

animate();

// ANIMATE LANDING HEADER

const rightContainer = document.querySelector(".right-container")
const leftLine = document.querySelector(".left");
const rightLine = document.querySelector(".right");

let mouseY = 0;

document.addEventListener("mousemove", (e) => {
  mouseY = e.clientY;
});

let currentOffset = 0;

function animateText() {
  const normalizedY = (mouseY / window.innerHeight) - 0.5;
  const targetOffset = normalizedY * 50;

  // smooth interpolation (this is your delay)
  currentOffset += (targetOffset - currentOffset) * 0.05;

  leftLine.style.transform = `translateX(${-currentOffset}px)`;
  rightContainer.style.transform = `translateX(${currentOffset}px)`;

  requestAnimationFrame(animateText);
}

animateText();

// Animate Background 

const LandingBgFrameA = document.getElementById("LandingBgFrameA");
const LandingBgFrameB = document.getElementById("LandingBgFrameB");

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

    // preload before showing
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

window.addEventListener("load", () => {
  const fades = document.querySelectorAll(".fade");

  fades.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add("show");
    }, i * 300); // delay between items
  });
});

// MUSIC

let targetVolumes = [0, 0, 0, 0];
let currentVolumes = [0, 0, 0, 0];

const a = document.getElementById("track00");
const b = document.getElementById("track01");
const c = document.getElementById("track10");
const d = document.getElementById("track11");

// start all tracks muted
[a, b, c, d].forEach(t => {
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


[a, b, c, d].forEach(t => {
  makeSeamlessLoop(t, 0.15);
});


document.addEventListener("mousemove", (e) => {
  const x = e.clientX / window.innerWidth;
  const y = e.clientY / window.innerHeight;

  targetVolumes[0] = (1 - x) * (1 - y); // a
  targetVolumes[1] = x * (1 - y);       // b
  targetVolumes[2] = (1 - x) * y;       // c
  targetVolumes[3] = x * y;             // d
});

function animateAudio() {
  const tracks = [a, b, c, d];

  for (let i = 0; i < tracks.length; i++) {
    currentVolumes[i] += (targetVolumes[i] - currentVolumes[i]) * 0.01;
    tracks[i].volume = currentVolumes[i];
  }

  requestAnimationFrame(animateAudio);
}

animateAudio();

let audioPlaying = false;

const button = document.getElementById("audio-toggle");

button.addEventListener("click", () => {
  if (!audioPlaying) {
    [a, b, c, d].forEach(t => t.play());
    button.textContent = "Mute Sound";
    audioPlaying = true;
  } else {
    [a, b, c, d].forEach(t => t.pause());
    button.textContent = "Enable Sound";
    audioPlaying = false;
  }
});

// DOWN ARROW

const arrow = document.getElementById("arrow");
const landingpage = document.getElementById("landingpage");
let LandingOpen = false;

arrow.addEventListener("click", () => {
  LandingOpen = !LandingOpen;

  if (LandingOpen) {
    hero.classList.add("move-up");
    document.body.classList.add("move-up");
    arrow.classList.add("flipped")
    document.body.classList.add("colour-shift")
  } else {
    hero.classList.remove("move-up");
    document.body.classList.remove("move-up");
    arrow.classList.remove("flipped")
    document.body.classList.remove("colour-shift")
  }
  
  // page 2 vs page 1 values
  bgTargetHue = LandingOpen ? 120 : 0;
  bgTargetSat = LandingOpen ? 1.5 : 0.9;
  bgTargetBright = LandingOpen ? 4.0 : 0.9;

}); 

let bgCurrentHue = 0;
let bgTargetHue = 0;
let bgCurrentSat = 1;
let bgTargetSat = 1;
let bgCurrentBright = 1;
let bgTargetBright = 1;

function animatebgColour() {
  bgCurrentHue += (bgTargetHue - bgCurrentHue) * 0.03;
  bgCurrentSat += (bgTargetSat - bgCurrentSat) * 0.01;
  bgCurrentBright += (bgTargetBright - bgCurrentBright) * 0.01;

  const glass = document.querySelector(".glass-layer");

  if (glass) {
    
    glass.style.backdropFilter =
      `blur(50px) 
      hue-rotate(${bgCurrentHue}deg) 
      saturate(${bgCurrentSat}) 
      brightness(${bgCurrentBright})`;
  }

  requestAnimationFrame(animatebgColour);
}

animatebgColour();

// ADDING STACK ANIM


const cards = document.querySelectorAll(".project-preview");

let currentIndex = 6;

function updateStack() {
  cards.forEach(card => {
    card.classList.remove("active", "prev", "next");
  });

  if (cards[currentIndex]) {
    cards[currentIndex].classList.add("active");
  }

  if (cards[currentIndex - 1]) {
    cards[currentIndex - 1].classList.add("prev");
  }

  if (cards[currentIndex + 1]) {
    cards[currentIndex + 1].classList.add("next");
  }
}

updateStack();


function updateStack() {
  cards.forEach((card, i) => {
    const offset = i - currentIndex;

    // position spacing
    
    const y = offset > 0 
      ? offset * 80     // ✅ below → keep this bigger
      : offset * 20;    // ✅ above → reduce movement

    const scale = 1 - Math.abs(offset) * 0.03;
    const opacity = 1 - Math.abs(offset) * 0.1;

    card.style.transform = `
      translateY(${y}px)
      scale(${scale})
    `;

    card.style.opacity = opacity;

    // z-index layering
    card.style.zIndex = 100 - Math.abs(offset);
  });
}



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
