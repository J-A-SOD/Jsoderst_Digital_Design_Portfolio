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
  currentScale += (targetScale - currentScale) * 0.2;

  cursor.style.transform = `translate(-50%, -50%) scale(${currentScale})`;

  requestAnimationFrame(animate);
}

animate();

