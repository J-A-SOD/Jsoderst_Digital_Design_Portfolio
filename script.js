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

let lastX = 0;
let lastY = 0;
let velocity = 0;
let currentScale = 1;
let targetScale = 1;

document.addEventListener("mousemove", (e) => {
  const dx = e.clientX - lastX;
  const dy = e.clientY - lastY;

  velocity = Math.sqrt(dx * dx + dy * dy);

  lastX = e.clientX;
  lastY = e.clientY;

  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";

  // target scale based on speed
  targetScale = Math.max(0.5, 1 - velocity / 80);
});

function animate() {
  // smooth interpolation (delay effect)
  currentScale += (targetScale - currentScale) * 0.2;

  cursor.style.transform = `translate(-50%, -50%) scale(${currentScale})`;

  requestAnimationFrame(animate);
}

animate();

