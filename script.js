function toggledarkmode() {
  const body = document.body;

  if (body.classList.contains('dark')) {
    body.classList.remove('dark');
    body.classList.add('light');
  } else {
    body.classList.remove('light');
    body.classList.add('dark');
  }
}

let mouseX = 0;
let mouseY = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = (e.clientX / window.innerWidth) - 0.5;
  mouseY = (e.clientY / window.innerHeight) - 0.5;
});

let currentX = 0;
let currentY = 0;

function animate() {
  // smooth interpolation (lerp)
  currentX += (mouseX * 100 - currentX) * 1;
  currentY += (mouseY * 100 - currentY) * 1;

  bg.style.transform = `translate(${currentX}px, ${currentY}px)`;

  requestAnimationFrame(animate);
}

animate();

