// DOM refs
const unlockBtn = document.getElementById("unlockBtn");
const codeInput = document.getElementById("codeInput");
const grantedSound = document.getElementById("grantedSound");
const deniedSound = document.getElementById("deniedSound");
const sparkContainer = document.getElementById("sparkContainer");
const bannerWrap = document.getElementById("bannerWrap");

// ===== Unlock flow (1s delay so sound can play) =====
function unlock() {
  if (codeInput.value.trim().toUpperCase() === "OPEN") {
    if (grantedSound) grantedSound.play();

    // wait 1s so user hears the sound before transition
    setTimeout(() => {
      // hide lock screen
      document.getElementById("lock-screen").classList.remove("active");

      // show club logo briefly
      const clubScreen = document.getElementById("club-logo-screen");
      clubScreen.classList.add("active");
      const clubLogo = document.getElementById("clubLogo");
      setTimeout(() => clubLogo.classList.add("show"), 500);

      // confetti
      setTimeout(() => {
        if (typeof confetti === "function") confetti({ particleCount: 120, spread: 90, origin: { y: 0.6 } });
      }, 700);

      // to banner
      setTimeout(() => {
        clubScreen.classList.remove("active");
        const bannerScreen = document.getElementById("banner-screen");
        bannerScreen.classList.add("active");

        setTimeout(() => {
          document.getElementById("bannerImg").classList.add("show");

          // apply StarWars-style crawl one-shot
          if (bannerWrap) {
            bannerWrap.classList.add("crawl");
            // remove crawl after animation ends so it can run again next time
            setTimeout(() => bannerWrap.classList.remove("crawl"), 7000);
          }

          // final neon orbs
          let c = 0;
          const iv = setInterval(() => {
            spawnOrb();
            if (++c > 40) clearInterval(iv);
          }, 80);
        }, 300);
      }, 3500);
    }, 1000);

  } else {
    // wrong code
    if (deniedSound) { deniedSound.currentTime = 0; deniedSound.play(); }
    codeInput.value = "";
    codeInput.classList.add("shake");
    setTimeout(() => codeInput.classList.remove("shake"), 900);
  }
}

// events
unlockBtn.addEventListener("click", unlock);
codeInput.addEventListener("keypress", (e) => { if (e.key === "Enter") unlock(); });

// ===== Sparks (continuous, lightweight) =====
function spawnSpark() {
  const s = document.createElement("div");
  s.className = "spark";
  const startX = Math.random() * innerWidth;
  const startY = Math.random() * innerHeight;
  const moveX = (Math.random() - 0.5) * 220;
  const moveY = -Math.random() * 200;
  const dur = 1.8 + Math.random() * 2.2;

  const colors = ["#00f7ff","#ff44cc","#9d4dff","#ffffff","#ff66ff"];
  const color = colors[(Math.random() * colors.length) | 0];
  s.style.background = color;
  s.style.boxShadow = `0 0 6px ${color}, 0 0 12px ${color}`;
  s.style.left = `${startX}px`;
  s.style.top = `${startY}px`;
  s.style.setProperty('--startX', `${startX}px`);
  s.style.setProperty('--startY', `${startY}px`);
  s.style.setProperty('--moveX', `${moveX}px`);
  s.style.setProperty('--moveY', `${moveY}px`);
  s.style.animationDuration = `${dur}s`;

  sparkContainer.appendChild(s);

  setTimeout(() => {
    s.remove();
    spawnSpark();
  }, dur * 1000);
}
for (let i=0;i<110;i++) setTimeout(spawnSpark, i * 70);

// ===== Neon orbs (blinking + rising) =====
function spawnOrb() {
  const o = document.createElement("div");
  o.className = "neon-orb";
  const size = 8 + Math.random() * 28;
  o.style.width = o.style.height = `${size}px`;
  o.style.left = `${Math.random() * innerWidth}px`;
  o.style.bottom = `-40px`;

  const colors = ["#00f7ff","#ff44cc","#9d4dff","#ffffff","#ff66ff"];
  const color = colors[(Math.random() * colors.length) | 0];
  o.style.background = color;
  o.style.boxShadow = `0 0 14px ${color}, 0 0 28px ${color}`;

  const dur = 3.5 + Math.random() * 2.5;
  // set two animations: rise (one-shot) and orbBlink (looping)
  const blinkDur = (2.2 + Math.random() * 1.6).toFixed(2);
  o.style.animation = `rise ${dur}s linear forwards, orbBlink ${blinkDur}s ease-in-out infinite`;

  document.body.appendChild(o);
  setTimeout(() => o.remove(), dur * 1000);
}

// ===== Nebula particles (continuous, gentle) =====
(function initNebula() {
  const nebula = document.getElementById("nebula");
  function spawnParticle() {
    const p = document.createElement("div");
    p.className = "particle";
    const size = 1 + Math.random() * 3;
    p.style.width = p.style.height = `${size}px`;
    p.style.left = `${Math.random() * 100}vw`;
    p.style.top = `${Math.random() * 100}vh`;
    p.style.opacity = (0.25 + Math.random() * 0.55).toFixed(2);

    const hues = ["#ffffff","#a7e9ff","#ffc8ff","#ffb3b3"];
    p.style.background = hues[(Math.random() * hues.length) | 0];

    const dur = 12 + Math.random() * 26;
    const delay = Math.random() * 8;
    p.style.animation = `pulse ${dur}s ease-in-out ${delay}s infinite alternate`;

    nebula.appendChild(p);
    setTimeout(() => { if (p.parentNode) p.remove(); }, (dur + delay + 2) * 1000);
  }

  // small initial burst + continuous spawning
  for (let i=0;i<40;i++) setTimeout(spawnParticle, i*60);
  setInterval(spawnParticle, 420);
})();

// ===== Logo flip (click only) with single-shot shimmering =====
const logoCard = document.getElementById("logoCard");
logoCard.addEventListener("click", () => {
  // toggle state (only click toggles)
  logoCard.classList.toggle("flipped");

  // one-shot shimmer
  logoCard.classList.add("flipping");
  setTimeout(() => logoCard.classList.remove("flipping"), 900);
});
