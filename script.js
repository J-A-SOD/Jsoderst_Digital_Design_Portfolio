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

let index = 0;
const text = document.getElementById("changing-landing-accent");

setInterval(() => {
    text.style.opacity = 0; // Fade out the text
    
    setTimeout(() => {
        index = (index + 1) % words.length;
        text.textContent = words[index];
        text.style.opacity = 1; // Fade in the new text
    }, 200); // 500ms = fade out duration

}, 1500); // 2000ms = 2 seconds

// GLASS CURSOR SCRIPT

const cursor = document.querySelector(".cursor-glass");
const links = document.querySelectorAll(".header-nav a");

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

let currentOffset = 0;

document.addEventListener("mousemove", (e) => {
  const normalizedY = (e.clientY / window.innerHeight) - 0.5;

  // target spread based on vertical position
  targetOffset = normalizedY * 60; 
});

function animateText() {
  currentOffset += (targetOffset - currentOffset) * 0.1;

  leftLine.style.transform = `translateX(${-currentOffset}px)`;
  rightContainer.style.transform = `translateX(${currentOffset}px)`;

  requestAnimationFrame(animateText);
}

let targetOffset = 0;
animateText();

// Animate Background 

const LandingBgFrameA = document.getElementById("LandingBgFrameA");
const LandingBgFrameB = document.getElementById("LandingBgFrameB");

const totalFrames = 50;

let currentFrame = 1;
let showingA = true;

document.addEventListener("mousemove", (e) => {
  const x = e.clientX / window.innerWidth;
  const y = e.clientY / window.innerHeight;

  const progress = (x + y) / 2;
  const frameIndex = Math.round(progress * (totalFrames - 1)) + 1;

  if (frameIndex !== currentFrame) {
    currentFrame = frameIndex;

    const nextSrc = `assets/landingframes/frame (${frameIndex}).jpg`;

    if (showingA) {
      LandingBgFrameB.src = nextSrc;
      LandingBgFrameB.style.opacity = 1;
      LandingBgFrameA.style.opacity = 0;
    } else {
      LandingBgFrameA.src = nextSrc;
      LandingBgFrameA.style.opacity = 1;
      LandingBgFrameB.style.opacity = 0;
    }


    showingA = !showingA;
  }
});


