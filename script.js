// ===== DOM refs =====
const unlockBtn = document.getElementById("unlockBtn");
const codeInput = document.getElementById("codeInput");
const grantedSound = document.getElementById("grantedSound");
const deniedSound = document.getElementById("deniedSound");
const sparkContainer = document.getElementById("sparkContainer");

const lockScreen = document.getElementById("lock-screen");
const textScreen = document.getElementById("text-screen");

const openTextEl = document.getElementById("openText");

const dynamicSpotlight = document.getElementById("dynamicSpotlight");
const spotlightCenter = document.querySelector(".spotlight-center");
const spotlightLeft = document.querySelector(".spotlight-left");
const spotlightRight = document.querySelector(".spotlight-right");

// ===== Video + Blackout =====
const blankOverlay = document.getElementById("blankOverlay");
const introVideo = document.getElementById("introVideo");

// ===== Music =====
const bgMusic = new Audio("background.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.6;

// Playlist (4 after tracks)
const afterTracks = [
  document.getElementById("afterTrack1"),
  document.getElementById("afterTrack2"),
  document.getElementById("afterTrack3"),
  document.getElementById("afterTrack4")
];
let currentAfterIndex = 0;

// Auto play bg once user clicks
document.addEventListener("click", () => {
  if (bgMusic.paused) bgMusic.play().catch(() => {});
}, { once: true });

// Fade helper
function fadeOut(audio, duration = 2000) {
  if (!audio) return;
  const step = audio.volume / (duration / 50);
  const fadeInterval = setInterval(() => {
    if (audio.volume > step) {
      audio.volume -= step;
    } else {
      audio.volume = 0;
      audio.pause();
      clearInterval(fadeInterval);
    }
  }, 50);
}

// Playlist loop
function playAfterMusic() {
  afterTracks.forEach(a => { a.pause(); a.currentTime = 0; });
  const track = afterTracks[currentAfterIndex];
  track.volume = 0.7;
  track.play().catch(() => {});
  track.onended = () => {
    currentAfterIndex = (currentAfterIndex + 1) % afterTracks.length;
    playAfterMusic();
  };
}

// ===== Unlock flow =====
function unlock() {
  if (codeInput.value.trim().toUpperCase() === "OPEN") {
    grantedSound?.play();

    lockScreen.classList.remove("active");
    document.getElementById("waveVisualizer")?.classList.add("hidden");

    // Fade out bg
    fadeOut(bgMusic, 2000);

    // Show blackout + play video with fade-in
blankOverlay.style.display = "flex";
introVideo.style.display = "block";
introVideo.currentTime = 0;

// slight async to allow CSS transition
setTimeout(() => {
  introVideo.style.opacity = "1";  
  introVideo.play().catch(() => {});
}, 50);

introVideo.onended = () => {
  // Fade out video first
  introVideo.style.opacity = "0";
  setTimeout(() => {
    blankOverlay.style.display = "none";
    introVideo.style.display = "none";

    // Show text screen
    textScreen.style.display = "block";

    // Animate Open text smoothly
    setTimeout(() => {
      openTextEl.classList.add("show", "glow-pulse");
      if (typeof confetti === "function") {
        confetti({ particleCount: 240, spread: 120, origin: { y: 0.6 } });
      }
      startSpotlightFollow();
    }, 400); // small delay after text screen shows

    // Start after music playlist
    playAfterMusic();
  }, 1200); // matches fade-out duration
};

  } else {
    deniedSound.currentTime = 0;
    deniedSound.play();
    codeInput.value = "";
    codeInput.classList.add("shake");
    setTimeout(() => codeInput.classList.remove("shake"), 900);
  }
}
unlockBtn.addEventListener("click", unlock);
codeInput.addEventListener("keypress", e => { if (e.key === "Enter") unlock(); });

// ===== Spotlight follow =====
let spotlightInterval = null;
function moveSpotlightOnce() {
  if (!openTextEl) return;
  const rect = openTextEl.getBoundingClientRect();
  const padX = rect.width * 0.1;
  const padY = rect.height * 0.2;
  const targetX = rect.left + padX + Math.random() * (rect.width - padX * 2);
  const targetY = rect.top + padY + Math.random() * (rect.height - padY * 2);
  const size = Math.max(280, Math.min(520, rect.width * 0.35));
  dynamicSpotlight.style.width = `${size}px`;
  dynamicSpotlight.style.height = `${size}px`;
  dynamicSpotlight.style.transform = `translate(${targetX - size / 2}px, ${targetY - size / 2}px)`;
}
function startSpotlightFollow() {
  if (!dynamicSpotlight) return;
  dynamicSpotlight.style.opacity = "1";
  moveSpotlightOnce();
  if (spotlightInterval) clearInterval(spotlightInterval);
  spotlightInterval = setInterval(moveSpotlightOnce, 1600);
  window.addEventListener("resize", moveSpotlightOnce);
}

// ===== Sparks / Nebula / Logo / Spotlight motion (unchanged from your code) =====
// Keep your existing spark, orb, nebula, logo flip, and animateSpotlight code here



// ===== Sparks =====
function spawnSpark() {
  const s = document.createElement("div");
  s.className = "spark";
  const startX = Math.random() * innerWidth;
  const startY = Math.random() * innerHeight;
  const dur = 1.8 + Math.random() * 2.2;

  const colors = ["#00f7ff", "#ff44cc", "#9d4dff", "#ffffff", "#ff66ff"];
  const color = colors[(Math.random() * colors.length) | 0];
  s.style.background = color;
  s.style.boxShadow = `0 0 6px ${color}, 0 0 12px ${color}`;
  s.style.left = `${startX}px`;
  s.style.top = `${startY}px`;
  s.style.animationDuration = `${dur}s`;

  sparkContainer.appendChild(s);
  setTimeout(() => {
    s.remove();
    spawnSpark();
  }, dur * 1000);
}
for (let i = 0; i < 120; i++) setTimeout(spawnSpark, i * 70);

// ===== Orbs =====
function spawnOrb() {
  const o = document.createElement("div");
  o.className = "neon-orb";
  const size = 10 + Math.random() * 30;
  o.style.width = o.style.height = `${size}px`;
  o.style.left = `${Math.random() * innerWidth}px`;
  o.style.bottom = `-40px`;

  const colors = ["#00f7ff", "#ff44cc", "#9d4dff", "#ffffff", "#ff66ff"];
  const color = colors[(Math.random() * colors.length) | 0];
  o.style.background = color;
  o.style.boxShadow = `0 0 14px ${color}, 0 0 28px ${color}`;

  const dur = 4 + Math.random() * 2.5;
  const blinkDur = (2.2 + Math.random() * 1.6).toFixed(2);
  o.style.animation = `rise ${dur}s linear forwards, orbBlink ${blinkDur}s ease-in-out infinite`;

  document.body.appendChild(o);
  setTimeout(() => o.remove(), dur * 1000);
}

// ===== Nebula =====
(function initNebula() {
  const nebula = document.getElementById("nebula");
  function spawnParticle() {
    const p = document.createElement("div");
    p.className = "particle";
    const size = 2 + Math.random() * 4;
    p.style.width = p.style.height = `${size}px`;
    p.style.left = `${Math.random() * 100}vw`;
    p.style.top = `${Math.random() * 100}vh`;
    p.style.opacity = (0.25 + Math.random() * 0.55).toFixed(2);

    const hues = ["#ffffff", "#a7e9ff", "#ffc8ff", "#ffb3b3"];
    p.style.background = hues[(Math.random() * hues.length) | 0];

    const dur = 14 + Math.random() * 26;
    const delay = Math.random() * 8;
    p.style.animation = `pulse ${dur}s ease-in-out ${delay}s infinite alternate`;

    nebula.appendChild(p);
    setTimeout(() => {
      if (p.parentNode) p.remove();
    }, (dur + delay + 2) * 1000);
  }

  for (let i = 0; i < 60; i++) setTimeout(spawnParticle, i * 60);
  setInterval(spawnParticle, 350);
})();

// ===== Logo flip (unchanged) =====
const logoCard = document.getElementById("logoCard");
logoCard.addEventListener("click", () => {
  logoCard.classList.toggle("flipped");
  logoCard.classList.add("flipping");
  setTimeout(() => logoCard.classList.remove("flipping"), 900);
});

// === Dynamic Spotlight with Auto-Pan ===
let spotlightX = window.innerWidth / 2;
let spotlightY = window.innerHeight / 2;
let targetX = spotlightX;
let targetY = spotlightY;
const easing = 0.05;
let autoPanAngle = 0;
const autoPanRadiusX = window.innerWidth / 4;
const autoPanRadiusY = window.innerHeight / 6;
let lastMoveTime = Date.now();
const idleDelay = 3000;

document.addEventListener("mousemove", (e) => {
  targetX = e.clientX;
  targetY = e.clientY;
  lastMoveTime = Date.now();
});

function animateSpotlight() {
  const now = Date.now();
  if (now - lastMoveTime > idleDelay) {
    autoPanAngle += 0.002;
    targetX =
      window.innerWidth / 2 + Math.cos(autoPanAngle) * autoPanRadiusX;
    targetY =
      window.innerHeight / 2 +
      Math.sin(autoPanAngle * 0.6) * autoPanRadiusY;
  }

  spotlightX += (targetX - spotlightX) * easing;
  spotlightY += (targetY - spotlightY) * easing;

  dynamicSpotlight.style.left = `${spotlightX - 150}px`;
  dynamicSpotlight.style.top = `${spotlightY - 150}px`;

  requestAnimationFrame(animateSpotlight);
}
animateSpotlight();

window.addEventListener("resize", () => {
  spotlightX = window.innerWidth / 2;
  spotlightY = window.innerHeight / 2;
});
