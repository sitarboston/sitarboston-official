/* ============================================================
   SitarBoston — js/main.js
   Persian tilework palette redesign
   ============================================================ */

'use strict';

/* ============================================================
   NAVBAR — scroll effect & active link highlight
   ============================================================ */
(function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    // Solid navbar after 60px scroll
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active nav link based on scroll position
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
})();


/* ============================================================
   HAMBURGER MENU
   ============================================================ */
(function initHamburger() {
  const hamburger   = document.getElementById('hamburger');
  const navMobile   = document.getElementById('nav-mobile');
  const mobileLinks = document.querySelectorAll('.nav-mobile-link');

  function openMenu() {
    hamburger.classList.add('open');
    navMobile.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    navMobile.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    if (navMobile.classList.contains('open')) closeMenu();
    else openMenu();
  });

  mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navMobile.classList.contains('open')) closeMenu();
  });

  // Close menu when viewport expands back to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navMobile.classList.contains('open')) closeMenu();
  }, { passive: true });
})();


/* ============================================================
   SCROLL REVEAL — IntersectionObserver
   ============================================================ */
(function initScrollReveal() {
  const revealEls = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right'
  );

  if (!revealEls.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.04, rootMargin: '0px 0px -20px 0px' }
  );

  revealEls.forEach(el => observer.observe(el));
})();


/* ============================================================
   GALLERY LIGHTBOX — universal, covers all photo groups
   ============================================================ */
(function initLightbox() {
  const lightbox  = document.getElementById('lightbox');
  const lbImg     = document.getElementById('lightbox-img');
  const lbClose   = document.getElementById('lightbox-close');
  const lbPrev    = document.getElementById('lightbox-prev');
  const lbNext    = document.getElementById('lightbox-next');
  const lbCounter = document.getElementById('lightbox-counter');

  if (!lightbox) return;

  let currentImages = [];
  let currentIndex  = 0;

  function imgData(el) {
    return { src: el.src, alt: el.alt || '' };
  }

  function showImage(index) {
    currentIndex = (index + currentImages.length) % currentImages.length;
    lbImg.style.opacity = '0';
    setTimeout(() => {
      lbImg.src = currentImages[currentIndex].src;
      lbImg.alt = currentImages[currentIndex].alt;
      lbCounter.textContent = currentImages.length > 1
        ? (currentIndex + 1) + ' / ' + currentImages.length
        : '';
      lbImg.style.opacity = '1';
    }, 100);
  }

  function openLightbox(images, index) {
    currentImages = images;
    showImage(index);
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { lbImg.src = ''; }, 300);
  }

  // Generic: wire a group of wrapper elements as a gallery
  function wireGroup(wrappers, imgSelector) {
    const imgs = Array.from(wrappers).map(w =>
      imgData(imgSelector ? w.querySelector(imgSelector) : w)
    );
    wrappers.forEach((w, i) => {
      w.style.cursor = 'zoom-in';
      w.setAttribute('tabindex', '0');
      w.setAttribute('role', 'button');
      w.addEventListener('click', () => openLightbox(imgs, i));
      w.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(imgs, i); }
      });
    });
  }

  // ── Main gallery grid ────────────────────────────────────────
  wireGroup(document.querySelectorAll('#gallery-grid .gallery-item'), 'img');

  // ── Luthierie + repair .lg-item grids ───────────────────────
  wireGroup(document.querySelectorAll('.lg-item'), 'img');

  // ── Homage section photos ────────────────────────────────────
  wireGroup(document.querySelectorAll('.homage-item'), 'img');

  // ── Guru photos ──────────────────────────────────────────────
  wireGroup(document.querySelectorAll('.guru-photo-item'), 'img');

  // ── Mission photos ───────────────────────────────────────────
  wireGroup(document.querySelectorAll('.mission-photo-item'), 'img');

  // ── About / Dr. Samya portrait ───────────────────────────────
  wireGroup(document.querySelectorAll('.about-image-wrap'), 'img');

  // ── Shahid Ali portrait ──────────────────────────────────────
  wireGroup(document.querySelectorAll('.shahidali-photo-frame'), 'img');

  // ── Lesson fill image ────────────────────────────────────────
  const lessonFillImgs = document.querySelectorAll('.lesson-fill-img');
  lessonFillImgs.forEach(img => {
    img.style.cursor = 'zoom-in';
    img.setAttribute('tabindex', '0');
    img.addEventListener('click', () => openLightbox([imgData(img)], 0));
  });

  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click',  () => showImage(currentIndex - 1));
  lbNext.addEventListener('click',  () => showImage(currentIndex + 1));

  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  showImage(currentIndex - 1);
    if (e.key === 'ArrowRight') showImage(currentIndex + 1);
  });
})();


/* ============================================================
   MUSIC PLAYER
   ============================================================ */
(function initMusicPlayer() {
  const player    = document.getElementById('music-player');
  const btn       = document.getElementById('music-btn');
  const audio     = document.getElementById('bg-audio');
  const iconPlay  = document.getElementById('icon-play');
  const iconPause = document.getElementById('icon-pause');

  if (!player || !btn || !audio) return;

  audio.volume = 0.1;

  let isPlaying = false;

  function setPlaying(state) {
    isPlaying = state;
    btn.classList.toggle('playing', state);
    iconPlay.style.display  = state ? 'none' : '';
    iconPause.style.display = state ? ''     : 'none';
    btn.setAttribute('aria-label', state ? 'Pause Gayaki Ang' : 'Play Gayaki Ang');
  }

  // Attempt autoplay on load
  audio.play().then(() => setPlaying(true)).catch(() => {
    // Autoplay blocked by browser — user must click first
    setPlaying(false);
  });

  btn.addEventListener('click', () => {
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }
  });

  audio.addEventListener('pause', () => setPlaying(false));
  audio.addEventListener('play',  () => setPlaying(true));
})();


/* ============================================================
   NEWS — dynamic render from news-data.json
   ============================================================ */
(function initNews() {
  const grid = document.getElementById('news-grid');
  if (!grid) return;

  fetch('news-data.json')
    .then(r => {
      if (!r.ok) throw new Error('Network response was not ok');
      return r.json();
    })
    .then(items => {
      if (!Array.isArray(items) || items.length === 0) {
        grid.innerHTML = '<p class="news-loading">No news at this time. Check back soon.</p>';
        return;
      }

      // Sort by id descending (newest first)
      items.sort((a, b) => b.id - a.id);

      grid.innerHTML = items.map(item => {
        const linkHtml = item.link
          ? `<a href="${escapeHtml(item.link)}" class="news-link" target="_blank" rel="noopener">Read more &rarr;</a>`
          : '';

        return `
          <article class="news-card reveal">
            <div class="news-meta">
              <span class="news-date">${escapeHtml(item.date)}</span>
              <span class="news-tag">${escapeHtml(item.category)}</span>
            </div>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.body)}</p>
            ${linkHtml}
          </article>
        `;
      }).join('');

      // Kick off reveal for newly added cards
      const newCards = grid.querySelectorAll('.reveal');
      const obs = new IntersectionObserver(
        entries => {
          entries.forEach(e => {
            if (e.isIntersecting) {
              e.target.classList.add('visible');
              obs.unobserve(e.target);
            }
          });
        },
        { threshold: 0.1 }
      );
      newCards.forEach(card => obs.observe(card));
    })
    .catch(() => {
      grid.innerHTML = `
        <article class="news-card">
          <div class="news-meta">
            <span class="news-date">April 2026</span>
            <span class="news-tag">Community</span>
          </div>
          <h3>Sitar Gathering — Greater Boston</h3>
          <p>We are looking to organize an informal sitar gathering for players in the Boston area. Whether you are a beginner or an advanced student, come and play, listen, and connect. Details to follow — reach out to express interest.</p>
        </article>
        <article class="news-card">
          <div class="news-meta">
            <span class="news-date">Spring 2026</span>
            <span class="news-tag">Events</span>
          </div>
          <h3>Upcoming Concert — Details Soon</h3>
          <p>A concert featuring classical sitar music is being planned for the New England area this spring. Stay connected for announcements.</p>
        </article>
      `;
    });

  function escapeHtml(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
})();


/* ============================================================
   CONTACT FORM
   ============================================================ */
(function initContactForm() {
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');

  if (!form || !success) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Basic validation
    const name    = form.querySelector('#f-name').value.trim();
    const email   = form.querySelector('#f-email').value.trim();
    const role    = form.querySelector('#f-role').value;
    const message = form.querySelector('#f-message').value.trim();

    if (!name || !email || !role || !message) {
      // Highlight missing fields
      [
        { el: form.querySelector('#f-name'),    val: name },
        { el: form.querySelector('#f-email'),   val: email },
        { el: form.querySelector('#f-role'),    val: role },
        { el: form.querySelector('#f-message'), val: message }
      ].forEach(({ el, val }) => {
        if (!val) {
          el.style.borderColor = 'var(--saffron)';
          el.addEventListener('input', () => {
            el.style.borderColor = '';
          }, { once: true });
        }
      });
      return;
    }

    // Compose mailto link as fallback (no server-side)
    const subject = encodeURIComponent('SitarBoston — Message from ' + name);
    const body    = encodeURIComponent(
      'Name: ' + name + '\n' +
      'Email: ' + email + '\n' +
      'I am a: ' + role + '\n\n' +
      message
    );
    const mailtoUrl = 'mailto:sitarboston@gmail.com?subject=' + subject + '&body=' + body;

    // Open mailto
    window.location.href = mailtoUrl;

    // Show success message
    form.style.display = 'none';
    success.classList.add('show');
  });
})();


/* ============================================================
   LAZY VIDEO LOADING — pause when off-screen
   ============================================================ */
(function initLazyVideos() {
  const videos = document.querySelectorAll('.video-item video');
  if (!videos.length) return;

  const obs = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          const v = entry.target;
          if (!v.paused) v.pause();
        }
      });
    },
    { threshold: 0.1 }
  );

  videos.forEach(v => obs.observe(v));
})();


/* ============================================================
   SMOOTH SCROLL — ensure consistent behavior
   ============================================================ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();




/* ============================================================
   COLLAPSIBLE SECTIONS
   ============================================================ */
(function initCollapsible() {
  document.querySelectorAll('.section-collapse-btn').forEach(btn => {
    const contentId = btn.dataset.collapse;
    const content   = document.getElementById(contentId);
    if (!content) return;

    btn.addEventListener('click', () => {
      const opening = !content.classList.contains('open');
      content.classList.toggle('open', opening);
      btn.classList.toggle('open', opening);
      btn.setAttribute('aria-expanded', opening);

      if (opening) {
        // Trigger reveal animations for newly visible items
        content.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
          el.classList.add('visible');
        });
      }
    });
  });
})();


/* ============================================================
   GOLD DUST — subtle floating particles
   ============================================================ */
(function initGoldDust() {
  const canvas = document.createElement('canvas');
  canvas.id = 'gold-dust-canvas';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  const PARTICLE_COUNT = 28;
  let particles = [];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  function Particle() {
    this.reset = function(initial) {
      this.x       = Math.random() * canvas.width;
      this.y       = initial ? Math.random() * canvas.height : canvas.height + 6;
      this.r       = Math.random() * 1.6 + 0.4;
      this.vy      = -(Math.random() * 0.35 + 0.08);
      this.vx      = (Math.random() - 0.5) * 0.22;
      this.alpha   = Math.random() * 0.38 + 0.06;
      this.dAlpha  = (Math.random() * 0.006 + 0.002) * (Math.random() < 0.5 ? 1 : -1);
      this.hue     = 38 + Math.random() * 18;
    };
    this.reset(true);

    this.update = function() {
      this.y      += this.vy;
      this.x      += this.vx;
      this.alpha  += this.dAlpha;
      if (this.alpha > 0.44 || this.alpha < 0.04) this.dAlpha *= -1;
      if (this.y < -6) this.reset(false);
    };

    this.draw = function() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = 'hsla(' + this.hue + ',78%,62%,' + this.alpha + ')';
      ctx.fill();
    };
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
})();
