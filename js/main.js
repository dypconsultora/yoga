/* ================================
   MIBI Yoga · Comportamiento global
   - Nav con fondo al hacer scroll
   - Reveal de secciones (.reveal)
   - Menú móvil fullscreen
   - Botón "volver arriba"
   ================================ */

(function () {
  // Nav con fondo al hacer scroll
  const nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        nav.classList.add('bg-bone/85', 'backdrop-blur-md', 'border-b', 'border-ink/5');
      } else {
        nav.classList.remove('bg-bone/85', 'backdrop-blur-md', 'border-b', 'border-ink/5');
      }
    });
  }

  // Reveal de elementos con clase .reveal
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('in');
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  // Menú móvil
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  if (menuToggle && mobileMenu) {
    const hamburger = menuToggle.querySelector('.hamburger');

    function setMenu(open) {
      mobileMenu.classList.toggle('open', open);
      if (hamburger) hamburger.classList.toggle('is-open', open);
      document.body.classList.toggle('menu-open', open);
      menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      menuToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    }

    menuToggle.addEventListener('click', () => {
      setMenu(!mobileMenu.classList.contains('open'));
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => setMenu(false));
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) setMenu(false);
    });
  }

  // Carrusel de reseñas
  const rTrack = document.getElementById('reviews-track');
  if (rTrack) {
    const rPrev = document.querySelector('[data-reviews-prev]');
    const rNext = document.querySelector('[data-reviews-next]');
    const rDotsWrap = document.querySelector('[data-reviews-dots]');
    const rSlides = Array.from(rTrack.children);

    if (rDotsWrap) {
      rSlides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.setAttribute('aria-label', `Ir a reseña ${i + 1} de ${rSlides.length}`);
        dot.addEventListener('click', () => scrollToSlide(i));
        rDotsWrap.appendChild(dot);
      });
    }
    const rDots = rDotsWrap ? Array.from(rDotsWrap.children) : [];

    function currentIndex() {
      const sl = rTrack.scrollLeft;
      let idx = 0, min = Infinity;
      rSlides.forEach((s, i) => {
        const d = Math.abs(s.offsetLeft - sl);
        if (d < min) { min = d; idx = i; }
      });
      return idx;
    }

    function scrollToSlide(i) {
      const target = rSlides[Math.max(0, Math.min(rSlides.length - 1, i))];
      if (target) rTrack.scrollTo({ left: target.offsetLeft, behavior: 'smooth' });
    }

    function updateUI() {
      const idx = currentIndex();
      rDots.forEach((d, i) => d.classList.toggle('active', i === idx));
      if (rPrev) rPrev.disabled = rTrack.scrollLeft <= 2;
      if (rNext) rNext.disabled = rTrack.scrollLeft + rTrack.clientWidth >= rTrack.scrollWidth - 2;
    }

    let rafId = null;
    rTrack.addEventListener('scroll', () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => { updateUI(); rafId = null; });
    });
    window.addEventListener('resize', updateUI);

    if (rPrev) rPrev.addEventListener('click', () => scrollToSlide(currentIndex() - 1));
    if (rNext) rNext.addEventListener('click', () => scrollToSlide(currentIndex() + 1));

    rTrack.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); scrollToSlide(currentIndex() - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); scrollToSlide(currentIndex() + 1); }
    });

    updateUI();
  }

  // Botón volver arriba
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 480);
    });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();
