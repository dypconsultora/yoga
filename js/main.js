/* ================================
   MIBI Yoga · Comportamiento global
   - Nav con fondo al hacer scroll
   - Reveal de secciones (.reveal)
   - Menú móvil fullscreen
   - Botón "volver arriba"
   ================================ */

(function () {
  // Scroll-to-hash con animación: llegamos al top y luego smooth-scrolleamos
  // hasta la sección, una sola vez cuando el layout ya está estable
  // (Tailwind CDN compilado, fuentes/imágenes cargadas, GSAP listo).
  if (location.hash && location.hash.length > 1) {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    const hash = location.hash;
    let userScrolled = false;
    let animationStarted = false;

    const markUserScrolled = () => { userScrolled = true; };
    window.addEventListener('wheel', markUserScrolled, { passive: true, once: true });
    window.addEventListener('touchmove', markUserScrolled, { passive: true, once: true });
    window.addEventListener('keydown', (e) => {
      if (['PageDown','PageUp','ArrowDown','ArrowUp','Home','End',' '].includes(e.key)) userScrolled = true;
    }, { once: true });

    // Mantener al top mientras el layout se sigue acomodando.
    const pinTop = () => { if (!animationStarted && !userScrolled) window.scrollTo(0, 0); };
    pinTop();

    let pinInterval = setInterval(pinTop, 16);
    const stopPin = () => { clearInterval(pinInterval); pinInterval = null; };

    const runSmoothScroll = () => {
      if (animationStarted || userScrolled) return;
      const el = document.querySelector(hash);
      if (!el) { stopPin(); return; }
      animationStarted = true;
      stopPin();
      const navEl = document.getElementById('nav');
      const offset = navEl ? navEl.offsetHeight : 0;
      // Con ScrollSmoother usamos su API (getBoundingClientRect viaja transformado).
      if (window.mibiSmoother) {
        window.mibiSmoother.scrollTo(el, true, `top ${offset}px`);
      } else {
        const targetY = Math.max(0, el.getBoundingClientRect().top + window.pageYOffset - offset);
        window.scrollTo({ top: targetY, behavior: 'smooth' });
      }
    };

    // Disparamos cuando layout esté quieto. Esperamos load + un margen para
    // Tailwind CDN/GSAP, y damos un pequeño beat para que el usuario vea el hero.
    window.addEventListener('load', () => {
      setTimeout(runSmoothScroll, 450);
    });
    // Failsafe por si load tarda demasiado.
    setTimeout(runSmoothScroll, 2500);
  }

  // Nav con fondo al hacer scroll
  const nav = document.getElementById('nav');
  if (nav) {
    const navScroll = () => {
      const y = window.mibiSmoother ? window.mibiSmoother.scrollTop() : window.scrollY;
      const on = y > 20;
      nav.classList.toggle('bg-bone/85', on);
      nav.classList.toggle('backdrop-blur-md', on);
      nav.classList.toggle('border-b', on);
      nav.classList.toggle('border-ink/5', on);
    };
    window.addEventListener('scroll', navScroll);
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
    const getScroll = () => (window.mibiSmoother ? window.mibiSmoother.scrollTop() : window.scrollY);
    const updateBackToTop = () => backToTop.classList.toggle('visible', getScroll() > 480);
    window.addEventListener('scroll', updateBackToTop);
    backToTop.addEventListener('click', () => {
      if (window.mibiSmoother) window.mibiSmoother.scrollTo(0, true);
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();
