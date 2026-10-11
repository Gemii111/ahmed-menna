// ==========================================================================
// WEDDING INVITATION: AHMED & MENNA
// High-Performance Interactive Logic, Autoplay Audio & Responsive Features
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Audio Engine & Autoplay Handler ---
  const audio = document.getElementById('wedding-audio');
  const floatingBtn = document.getElementById('floating-music-btn');
  const heroMusicBadge = document.querySelector('.hero-music-badge');

  let isPlaying = false;
  let userInteracted = false;

  function playMusic() {
    if (!audio) return;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        isPlaying = true;
        updateMusicUI();
      }).catch((err) => {
        console.log('Audio autoplay awaiting interaction:', err);
      });
    }
  }

  function pauseMusic() {
    if (!audio) return;
    audio.pause();
    isPlaying = false;
    updateMusicUI();
  }

  function toggleMusic() {
    if (isPlaying) {
      pauseMusic();
    } else {
      playMusic();
    }
  }

  function updateMusicUI() {
    if (floatingBtn) {
      if (isPlaying) {
        floatingBtn.classList.add('playing');
        floatingBtn.setAttribute('aria-label', 'Pause Music');
      } else {
        floatingBtn.classList.remove('playing');
        floatingBtn.setAttribute('aria-label', 'Play Music');
      }
    }
  }

  // Floating button toggle
  if (floatingBtn) {
    floatingBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMusic();
    });
  }

  // Hero badge toggle
  if (heroMusicBadge) {
    heroMusicBadge.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMusic();
    });
  }

  // Immediate autoplay attempt on load
  playMusic();

  // Global one-time interaction unlock for browsers (iPhone Safari / Chrome policy)
  function unlockAudioOnFirstTouch() {
    if (!isPlaying) {
      playMusic();
    }
    window.removeEventListener('touchstart', unlockAudioOnFirstTouch);
    window.removeEventListener('click', unlockAudioOnFirstTouch);
    window.removeEventListener('pointerdown', unlockAudioOnFirstTouch);
  }
  window.addEventListener('touchstart', unlockAudioOnFirstTouch, { passive: true });
  window.addEventListener('click', unlockAudioOnFirstTouch, { passive: true });
  window.addEventListener('pointerdown', unlockAudioOnFirstTouch, { passive: true });


  // --- 2. Luxury Envelope Opening Interaction ---
  const envelopeOverlay = document.getElementById('envelope-overlay');
  const envelopeContainer = document.getElementById('envelope-container');
  const waxSealBtn = document.getElementById('wax-seal-btn');

  let envelopeOpened = false;

  function openEnvelope() {
    if (envelopeOpened) return;
    envelopeOpened = true;

    // Trigger audio immediately on this direct user gesture (bypasses browser autoplay restrictions)
    playMusic();

    // Trigger celebration confetti
    triggerCelebrationConfetti();

    if (envelopeContainer) {
      envelopeContainer.classList.add('animating');
    }

    setTimeout(() => {
      if (envelopeOverlay) {
        envelopeOverlay.classList.add('opened');
      }
      // Smooth scroll to top of card
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 850);
  }

  if (waxSealBtn) {
    waxSealBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openEnvelope();
    });
  }

  if (envelopeContainer) {
    envelopeContainer.addEventListener('click', () => {
      openEnvelope();
    });
  }


  // --- 3. Scroll Down Navigation Button ---
  const scrollDownBtn = document.getElementById('scroll-down-btn');
  const countdownSection = document.getElementById('countdown-section');

  if (scrollDownBtn && countdownSection) {
    scrollDownBtn.addEventListener('click', () => {
      countdownSection.scrollIntoView({ behavior: 'smooth' });
    });
  }


  // --- 4. Live Countdown Timer (18 October 2026 at 8:00 PM) ---
  const targetDate = new Date('2026-10-18T20:00:00+03:00').getTime();

  const daysElem = document.getElementById('days-count');
  const hoursElem = document.getElementById('hours-count');
  const minutesElem = document.getElementById('minutes-count');
  const secondsElem = document.getElementById('seconds-count');

  function updateCountdown() {
    const now = new Date().getTime();
    let diff = targetDate - now;

    if (diff < 0) {
      diff = 0;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (daysElem) daysElem.textContent = days < 10 ? '0' + days : days;
    if (hoursElem) hoursElem.textContent = hours < 10 ? '0' + hours : hours;
    if (minutesElem) minutesElem.textContent = minutes < 10 ? '0' + minutes : minutes;
    if (secondsElem) secondsElem.textContent = seconds < 10 ? '0' + seconds : seconds;
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);


  // --- 5. Celebration Confetti Effect (Lightweight & Battery-Friendly) ---
  function triggerCelebrationConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#d4af37', '#f3e5ab', '#ffffff', '#8a3a30', '#c59b27'];
    const particleCount = 75;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 120,
        y: canvas.height / 2 + (Math.random() - 0.5) * 80,
        radius: Math.random() * 4 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 9,
        vy: (Math.random() - 0.5) * 10 - 3,
        gravity: 0.18,
        alpha: 1,
        decay: Math.random() * 0.015 + 0.01,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 6
      });
    }

    let animationFrameId;
    const startTime = Date.now();

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let alive = false;
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.alpha -= p.decay;
        p.rotation += p.rotationSpeed;

        if (p.alpha > 0) {
          alive = true;
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.rect(-p.radius, -p.radius, p.radius * 2, p.radius * 1.5);
          ctx.fill();
          ctx.restore();
        }
      });

      // Stop animation once all particles fade or after 3.5 seconds
      if (alive && Date.now() - startTime < 3500) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        cancelAnimationFrame(animationFrameId);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    animate();
  }

});
