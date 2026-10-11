// ==========================================================================
// WEDDING INVITATION: AHMED & MENNA
// Interactive Logic, Audio Engine & Countdown
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Audio Engine ---
  const audio = document.getElementById('wedding-audio');
  const floatingBtn = document.getElementById('floating-music-btn');
  const musicBadges = document.querySelectorAll('.play-music-badge');
  const noteIcons = document.querySelectorAll('.music-note-icon');
  const playIcons = document.querySelectorAll('.music-play-icon');
  const pauseIcons = document.querySelectorAll('.music-pause-icon');

  let isPlaying = false;

  function playMusic() {
    if (!audio) return;
    audio.play().then(() => {
      isPlaying = true;
      updateMusicUI();
    }).catch(err => {
      console.log('Audio autoplay prevented or error:', err);
    });
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
    noteIcons.forEach(el => el.style.display = isPlaying ? 'none' : 'block');
    pauseIcons.forEach(el => el.style.display = isPlaying ? 'block' : 'none');
    playIcons.forEach(el => el.style.display = 'none');

    if (floatingBtn) {
      if (isPlaying) {
        floatingBtn.classList.add('music-bounce');
        floatingBtn.setAttribute('aria-label', 'Pause Music');
      } else {
        floatingBtn.classList.remove('music-bounce');
        floatingBtn.setAttribute('aria-label', 'Play Music');
      }
    }
  }

  if (floatingBtn) {
    floatingBtn.addEventListener('click', toggleMusic);
  }

  musicBadges.forEach(badge => {
    badge.addEventListener('click', toggleMusic);
  });

  // --- 2. Envelope Opening Interaction ---
  const envelopeOverlay = document.getElementById('envelope-overlay');
  const envelopeContainer = document.getElementById('envelope-container');
  const waxSealBtn = document.getElementById('wax-seal-btn');

  function openEnvelope() {
    if (!envelopeContainer) return;
    envelopeContainer.classList.add('animating');
    
    // Play the song immediately on click gesture
    playMusic();

    // Trigger celebration confetti
    triggerConfetti();

    setTimeout(() => {
      if (envelopeOverlay) {
        envelopeOverlay.classList.add('opened');
      }
      // Smooth scroll to top of invitation
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 900);
  }

  if (waxSealBtn) {
    waxSealBtn.addEventListener('click', openEnvelope);
  }

  // Also support clicking on the envelope container directly
  if (envelopeContainer) {
    envelopeContainer.addEventListener('click', (e) => {
      if (!envelopeContainer.classList.contains('animating')) {
        openEnvelope();
      }
    });
  }

  // --- 3. Scroll Down Navigation ---
  const scrollDownBtn = document.getElementById('scroll-down-btn');
  const countdownSection = document.getElementById('countdown-section');

  if (scrollDownBtn && countdownSection) {
    scrollDownBtn.addEventListener('click', () => {
      countdownSection.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // --- 4. Live Countdown Timer (18 October 2026) ---
  const targetDate = new Date('2026-10-18T19:00:00+03:00').getTime();

  const daysElem = document.getElementById('days-count');
  const hoursElem = document.getElementById('hours-count');
  const minutesElem = document.getElementById('minutes-count');
  const secondsElem = document.getElementById('seconds-count');

  function updateCountdown() {
    const now = new Date().getTime();
    let difference = targetDate - now;

    if (difference < 0) {
      difference = 0;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    if (daysElem) daysElem.textContent = days < 10 ? '0' + days : days;
    if (hoursElem) hoursElem.textContent = hours < 10 ? '0' + hours : hours;
    if (minutesElem) minutesElem.textContent = minutes < 10 ? '0' + minutes : minutes;
    if (secondsElem) secondsElem.textContent = seconds < 10 ? '0' + seconds : seconds;
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // --- 5. Interactive Guestbook / Leave a Message ---
  const guestbookForm = document.getElementById('guestbook-form');
  const guestNameInput = document.getElementById('guest-name');
  const guestMsgInput = document.getElementById('guest-msg');
  const messagesWall = document.getElementById('messages-wall');

  const defaultMessages = [
    { name: "خالد الشربيني", text: "ألف مبروك لأحلى عرسان أحمد ومنة، بارك الله لكما وبارك عليكما وجمع بينكما في خير!", time: "منذ ساعة" },
    { name: "سارة ومحمد", text: "بارك الله لكما وأتم فرحتكم على خير وسعادة دائمة يا رب ❤️", time: "منذ ساعتين" },
    { name: "عائلة المحمدي", text: "أجمل التهاني القلبية للعروسين الغاليين.. فرحتكم فرحتنا جميعاً في دكرنس!", time: "منذ 4 ساعات" }
  ];

  function getStoredMessages() {
    try {
      const stored = localStorage.getItem('ahmed_menna_wishes');
      return stored ? JSON.parse(stored) : defaultMessages;
    } catch (e) {
      return defaultMessages;
    }
  }

  function renderMessages() {
    if (!messagesWall) return;
    const msgs = getStoredMessages();
    messagesWall.innerHTML = msgs.map(m => `
      <div class="message-item">
        <div class="message-author">
          <span>❤️</span>
          <span>${escapeHTML(m.name)}</span>
        </div>
        <div class="message-content">${escapeHTML(m.text)}</div>
        <div class="message-time">${m.time || 'الآن'}</div>
      </div>
    `).join('');
  }

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  if (guestbookForm) {
    guestbookForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = guestNameInput.value.trim();
      const text = guestMsgInput.value.trim();

      if (!name || !text) return;

      const msgs = getStoredMessages();
      msgs.unshift({
        name,
        text,
        time: 'الآن'
      });

      try {
        localStorage.setItem('ahmed_menna_wishes', JSON.stringify(msgs));
      } catch (err) {}

      renderMessages();
      guestNameInput.value = '';
      guestMsgInput.value = '';

      triggerConfetti();

      // Show temporary thank you alert/message
      const submitBtn = guestbookForm.querySelector('.btn-submit');
      if (submitBtn) {
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>تم إرسال تهنئتكم بنجاح! ❤️</span>';
        submitBtn.style.backgroundColor = '#2d6a4f';
        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.style.backgroundColor = '#5d2c24';
        }, 3000);
      }
    });
  }

  renderMessages();

  // --- 6. Confetti Particle Effect ---
  function triggerConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#d4af37', '#e6c875', '#c59b27', '#ffffff', '#8c2d19', '#f28482'];

    for (let i = 0; i < 70; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 200,
        y: canvas.height / 2 + (Math.random() - 0.5) * 100,
        vx: (Math.random() - 0.5) * 10,
        vy: -Math.random() * 8 - 3,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8,
        opacity: 1
      });
    }

    let animationId;
    let frames = 0;

    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.22; // gravity
        p.rotation += p.rotationSpeed;
        p.opacity -= 0.012;

        if (p.opacity > 0) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = p.opacity;
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
          ctx.restore();
        }
      });

      frames++;
      if (alive && frames < 120) {
        animationId = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cancelAnimationFrame(animationId);
      }
    }

    render();
  }

  // Support direct open via URL
  if (window.location.search.includes('open=1') || window.location.hash === '#open') {
    if (envelopeOverlay) envelopeOverlay.classList.add('opened');
  }
});
