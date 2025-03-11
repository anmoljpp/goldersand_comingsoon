const canvas = document.getElementById('sandCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particlesArray = [];
const numberOfWhiteParticles = 2000; // Reduced for performance
const numberOfYellowParticles = 2000; // Additional yellow particles
const friction = 0.95; // Simulate air resistance (no gravity)
const returnSpeed = 0.05; // Speed at which particles return to their original position

// Particle class
class Particle {
  constructor(x, y, size, color) {
    this.originalX = x; // Store original X position
    this.originalY = y; // Store original Y position
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.velocity = { x: 0, y: 0 };
    this.alpha = Math.random() * 0.5 + 2; // Random alpha for fading effect
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;

    // Create a glowing effect using radial gradient
    const gradient = ctx.createRadialGradient(
      this.x, this.y, 0, this.x, this.y, this.size
    );
    gradient.addColorStop(0, this.color);
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.restore();
  }

  update() {
    // Apply friction
    this.velocity.x *= friction;
    this.velocity.y *= friction;

    // Move particle
    this.x += this.velocity.x;
    this.y += this.velocity.y;

    // Return to original position gradually
    const dx = this.originalX - this.x;
    const dy = this.originalY - this.y;
    this.x += dx * returnSpeed;
    this.y += dy * returnSpeed;

    // Fade out particles near the edges
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
      this.alpha -= 0.91; // Fade out
      if (this.alpha <= 0) {
        this.reset();
      }
    }
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.originalX = this.x; // Reset original position
    this.originalY = this.y;
    this.velocity = { x: 0, y: 0 };
    this.alpha = Math.random() * 5 + 2; // Random alpha for fading effect
  }
}

// Initialize white particles
function initWhiteParticles() {
  for (let i = 0; i < numberOfWhiteParticles; i++) {
    const size = Math.random() * 3 + 0.5; // Random size between 0.5 and 2.5
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const color = 'rgba(255, 255, 255, 0.9)'; // White color for stardust
    particlesArray.push(new Particle(x, y, size, color));
  }
}

// Initialize yellow particles
function initYellowParticles() {
  for (let i = 0; i < numberOfYellowParticles; i++) {
    const size = Math.random() * 3 + 0.5; // Random size between 0.5 and 3.5
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const color = 'rgba(255, 230, 0, 0.9)'; // Yellow color
    particlesArray.push(new Particle(x, y, size, color));
  }
}

// Initialize all particles
function init() {
  particlesArray.length = 0; // Clear existing particles
  initWhiteParticles(); // Add white particles
  initYellowParticles(); // Add yellow particles
}

// Animate particles
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particlesArray.forEach((particle) => {
    particle.update();
    particle.draw();
  });
  requestAnimationFrame(animate);
}

// Handle mouse movement
window.addEventListener('mousemove', (event) => {
  const mouseX = event.clientX;
  const mouseY = event.clientY;

  particlesArray.forEach((particle) => {
    const dx = mouseX - particle.x;
    const dy = mouseY - particle.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 70) { // Interaction radius
      const force = 9; // Strength of the cursor's push
      const angle = Math.atan2(dy, dx);
      // Repel particles away from the cursor
      particle.velocity.x = -Math.cos(angle) * force;
      particle.velocity.y = -Math.sin(angle) * force;
    }
  });
});

// Resize canvas on window resize
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  init();
});

// Start the animation
init();
animate();