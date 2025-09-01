// ===== DOM refs =====
const unlockBtn = document.getElementById("unlockBtn");
const codeInput = document.getElementById("codeInput");
const grantedSound = document.getElementById("grantedSound");
const deniedSound = document.getElementById("deniedSound");
const sparkContainer = document.getElementById("sparkContainer");

const lockScreen = document.getElementById("lock-screen");
const textScreen = document.getElementById("text-screen");

const presentationTextEl = document.getElementById("presentationText");
const openTextEl = document.getElementById("openText");

const dynamicSpotlight = document.getElementById("dynamicSpotlight");
const spotlightCenter = document.querySelector(".spotlight-center");
const spotlightLeft = document.querySelector(".spotlight-left");
const spotlightRight = document.querySelector(".spotlight-right");

// ===== Music =====
const bgMusic = new Audio("background.mp3"); // pre-unlock
bgMusic.loop = true;
bgMusic.volume = 0.6;

const openingMusic = new Audio("opening.mp3"); // plays once at unlock
openingMusic.volume = 1.0;

const postBgMusic = new Audio("after.mp3"); // after unlock
postBgMusic.loop = true;
postBgMusic.volume = 0.7;

// Autoplay background music once user interacts (browser restriction workaround)
document.addEventListener(
  "click",
  () => {
    if (bgMusic.paused) bgMusic.play().catch(() => {});
  },
  { once: true }
);

// Fade out helper
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

// ===== Unlock flow =====
function unlock() {
  if (codeInput.value.trim().toUpperCase() === "OPEN") {
    if (grantedSound) grantedSound.play();

    // hide lock screen, show text screen
    lockScreen.classList.remove("active");
    // Hide wave effect after unlock
    const wave = document.getElementById("waveVisualizer");
    if (wave) wave.classList.add("hidden");

    textScreen.classList.add("active");

    const chosenEffect = "zoom-dissolve"; // options: fade-in-out, typewriter, star-wars, lens-flare, zoom-dissolve

    // reset effect classes
    presentationTextEl.classList.remove(
      "fade-in-out",
      "typewriter",
      "star-wars",
      "lens-flare",
      "zoom-dissolve",
      "show"
    );
    openTextEl.classList.remove("show", "typewriter");

    // apply effect to first line
    presentationTextEl.classList.add(chosenEffect);

    // fade out bg music immediately on unlock
    fadeOut(bgMusic, 2000);

    // play opening music slightly after fade to sync with intro effect
    setTimeout(() => {
      openingMusic.currentTime = 0;
      openingMusic.play().catch(() => {});

      // when opening ends → start post background
      openingMusic.onended = () => {
        postBgMusic.currentTime = 0;
        postBgMusic.play().catch(() => {});
      };
    }, 1000);

    // after intro → show big OPEN text with spotlight
    setTimeout(() => {
      if (spotlightCenter) spotlightCenter.style.display = "none";
      if (spotlightLeft) spotlightLeft.style.display = "none";
      if (spotlightRight) spotlightRight.style.display = "none";

      openTextEl.classList.add("show", "glow-pulse");

      if (typeof confetti === "function") {
        confetti({ particleCount: 240, spread: 120, origin: { y: 0.6 } });
      }

      startSpotlightFollow();
    }, 5200);
  } else {
    if (deniedSound) {
      deniedSound.currentTime = 0;
      deniedSound.play();
    }
    codeInput.value = "";
    codeInput.classList.add("shake");
    setTimeout(() => codeInput.classList.remove("shake"), 900);
  }
}

unlockBtn.addEventListener("click", unlock);
codeInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") unlock();
});

// ===== Spotlight follow logic =====
let spotlightInterval = null;

function moveSpotlightOnce() {
  if (!openTextEl) return;
  const rect = openTextEl.getBoundingClientRect();

  const padX = rect.width * 0.1;
  const padY = rect.height * 0.2;
  const targetX = rect.left + padX + Math.random() * (rect.width - padX * 2);
  const targetY = rect.top + padY + Math.random() * (rect.height - padY * 2);

  const size = Math.max(280, Math.min(520, rect.width * 0.35));

  // use transform for smoother hardware-accelerated motion
  dynamicSpotlight.style.width = `${size}px`;
  dynamicSpotlight.style.height = `${size}px`;
  dynamicSpotlight.style.transform = `translate(${targetX - size / 2}px, ${
    targetY - size / 2
  }px)`;
}

function startSpotlightFollow() {
  if (!dynamicSpotlight) return;
  dynamicSpotlight.style.opacity = "1";
  moveSpotlightOnce();
  if (spotlightInterval) clearInterval(spotlightInterval);
  spotlightInterval = setInterval(moveSpotlightOnce, 1600);
  window.addEventListener("resize", moveSpotlightOnce);
}

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
