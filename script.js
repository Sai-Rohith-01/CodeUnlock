// Grab elements
const input = document.getElementById("codeInput");
const button = document.getElementById("unlockBtn");
const lockScreen = document.getElementById("lock-screen");
const bannerScreen = document.getElementById("banner-screen");
const logo = document.getElementById("collegeLogo");

// Unlock function
function unlock() {
  const code = input.value.trim().toUpperCase();

  // Clear input immediately
  input.value = "";

  if (code === "OPEN") {
    let grantedAudio = new Audio("granted.mp3");
    grantedAudio.play();

    grantedAudio.onended = () => {
      setTimeout(() => {
        lockScreen.classList.add("fade-out");
        setTimeout(() => {
          lockScreen.style.display = "none";
          bannerScreen.style.display = "flex";
          bannerScreen.classList.add("fade-in");

          launchConfetti();
          glowBurst();
        }, 800);
      }, 500);
    };

  } else {
    let deniedAudio = new Audio("denied.mp3");
    deniedAudio.play();

    // shake effect on wrong input
    lockScreen.classList.add("shake");
    setTimeout(() => lockScreen.classList.remove("shake"), 500);
  }
}

// Glow burst effect
function glowBurst() {
  let burst = document.createElement("div");
  burst.classList.add("glow-burst");
  document.body.appendChild(burst);

  setTimeout(() => {
    burst.remove();
  }, 1000);
}

// Confetti effect
function launchConfetti() {
  const duration = 3 * 1000;
  const end = Date.now() + duration;

  (function frame() {
    const colors = ['#00f7ff', '#ff44cc', '#ffff44', '#44ff88'];
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: colors
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: colors
    });
    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

// Button click + Enter key
button.addEventListener("click", unlock);
input.addEventListener("keypress", function (e) {
  if (e.key === "Enter") unlock();
});

// Sparks background animation
const canvas = document.getElementById("sparks");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let sparks = [];
for (let i = 0; i < 80; i++) {
  sparks.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    dx: (Math.random() - 0.5) * 1,
    dy: (Math.random() - 0.5) * 1,
    size: Math.random() * 2 + 1,
    color: `hsl(${Math.random() * 60 + 180}, 100%, 60%)`
  });
}

function animateSparks() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  sparks.forEach(spark => {
    ctx.beginPath();
    ctx.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2);
    ctx.fillStyle = spark.color;
    ctx.fill();

    spark.x += spark.dx;
    spark.y += spark.dy;

    // bounce from edges
    if (spark.x < 0 || spark.x > canvas.width) spark.dx *= -1;
    if (spark.y < 0 || spark.y > canvas.height) spark.dy *= -1;
  });
  requestAnimationFrame(animateSparks);
}
animateSparks();

// Resize handler
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// Logo hover effect (zoom + glow)
if (logo) {
  logo.addEventListener("mouseover", () => {
    logo.style.transform = "scale(1.1)";
    logo.style.filter = "drop-shadow(0 0 20px white)";
    logo.style.transition = "all 0.3s ease";
  });

  logo.addEventListener("mouseout", () => {
    logo.style.transform = "scale(1)";
    logo.style.filter = "none";
  });
}
