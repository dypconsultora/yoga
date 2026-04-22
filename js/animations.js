/* ================================
   MIBI Yoga · Animaciones con GSAP
   - Registro de ScrollTrigger
   - Respeto de prefers-reduced-motion
   - Entrada del hero, reveals por sección,
     parallax del ritual y conteo de stats
   ================================ */

(function () {
  // Quita el hide anti-FOUC siempre (aunque GSAP falle).
  // Si GSAP carga, las animaciones toman el control.
  const html = document.documentElement;

  if (typeof gsap === 'undefined') {
    html.classList.remove('gsap-ready');
    return;
  }
  const hasST = typeof ScrollTrigger !== 'undefined';
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  gsap.defaults({ duration: 0.9, ease: 'power3.out' });

  const mm = gsap.matchMedia();

  mm.add(
    {
      reduced: '(prefers-reduced-motion: reduce)',
      isDesktop: '(min-width: 768px)',
      isMobile: '(max-width: 767px)'
    },
    (ctx) => {
      const { reduced, isDesktop } = ctx.conditions;

      // Quita la clase que esconde para FOUC; a partir de acá GSAP
      // maneja los estados iniciales de los elementos que va a animar.
      html.classList.remove('gsap-ready');

      // Si el usuario pidió menos movimiento, no animamos.
      if (reduced) return;

      // Fijamos el estado oculto explícitamente (no confiamos en CSS ni en immediateRender)
      const revealSel = '[data-reveal]';
      const childSel = '[data-reveal-child]';
      gsap.set(revealSel, { opacity: 0, y: 40 });
      gsap.set(childSel, { opacity: 0, y: 40 });

      /* ========= HERO ENTRANCE (index) ========= */
      const heroEyebrow = document.querySelector('[data-hero-eyebrow]');
      const heroTitle = gsap.utils.toArray('[data-hero-line]');
      const heroLead = document.querySelector('[data-hero-lead]');
      const heroCtas = gsap.utils.toArray('[data-hero-cta]');
      const heroTiles = gsap.utils.toArray('[data-hero-tile]');

      if (heroTitle.length) {
        gsap.set(heroTitle, { yPercent: 100, opacity: 0 });
        if (heroEyebrow) gsap.set(heroEyebrow, { opacity: 0, y: 16 });
        if (heroLead) gsap.set(heroLead, { opacity: 0, y: 24 });
        if (heroCtas.length) gsap.set(heroCtas, { opacity: 0, y: 14 });
        if (heroTiles.length) gsap.set(heroTiles, { opacity: 0, y: 60 });

        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        if (heroEyebrow) {
          tl.to(heroEyebrow, { opacity: 1, y: 0, duration: 0.7 });
        }
        tl.to(
          heroTitle,
          { yPercent: 0, opacity: 1, duration: 1.1, stagger: 0.08, ease: 'power4.out' },
          heroEyebrow ? '-=0.35' : 0
        );
        if (heroLead) tl.to(heroLead, { opacity: 1, y: 0, duration: 0.8 }, '-=0.6');
        if (heroCtas.length) tl.to(heroCtas, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 }, '-=0.5');
        if (heroTiles.length) tl.to(heroTiles, { opacity: 1, y: 0, duration: 0.9, stagger: 0.08 }, '-=0.7');
      }

      /* ========= REVEALS POR SCROLL (batch, once) ========= */
      if (hasST) {
        ScrollTrigger.batch(revealSel, {
          start: 'top 88%',
          once: true,
          onEnter: (els) => {
            gsap.to(els, {
              y: 0,
              opacity: 1,
              duration: 0.9,
              ease: 'power3.out',
              stagger: 0.08,
              overwrite: 'auto'
            });
          }
        });

        ScrollTrigger.batch(childSel, {
          start: 'top 90%',
          once: true,
          onEnter: (els) => {
            gsap.to(els, {
              y: 0,
              opacity: 1,
              duration: 0.85,
              ease: 'power3.out',
              stagger: 0.1,
              overwrite: 'auto'
            });
          }
        });
      } else {
        // Sin ScrollTrigger: mostramos todo sin animar en scroll
        gsap.set([revealSel, childSel].join(','), { opacity: 1, y: 0 });
      }

      /* ========= PARALLAX DEL RITUAL ========= */
      if (isDesktop && hasST) {
        const ritualImg = document.querySelector('[data-ritual-image]');
        if (ritualImg) {
          gsap.fromTo(
            ritualImg,
            { yPercent: -6, scale: 1.08 },
            {
              yPercent: 6,
              scale: 1.08,
              ease: 'none',
              scrollTrigger: {
                trigger: ritualImg.closest('section'),
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.6
              }
            }
          );
        }

        const ritualFloat = document.querySelector('[data-ritual-float]');
        if (ritualFloat) {
          gsap.fromTo(
            ritualFloat,
            { y: -20, rotation: -1 },
            {
              y: 20,
              rotation: 4,
              ease: 'none',
              scrollTrigger: {
                trigger: ritualFloat.closest('section'),
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1
              }
            }
          );
        }
      }

      /* ========= STATS: CONTEO DE NÚMEROS ========= */
      if (hasST) {
        gsap.utils.toArray('[data-count]').forEach((el) => {
          const end = parseFloat(el.dataset.count);
          if (!isFinite(end)) return;
          const decimals = parseInt(el.dataset.countDecimals, 10) || 0;
          const suffix = el.dataset.countSuffix || '';
          const prefix = el.dataset.countPrefix || '';
          const obj = { n: 0 };
          gsap.to(obj, {
            n: end,
            duration: 1.6,
            ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
            onUpdate: () => {
              el.textContent =
                prefix + obj.n.toFixed(decimals).replace('.', ',') + suffix;
            }
          });
        });
      }

      /* ========= HORARIOS: STAGGER RANDOM EN CELDAS ========= */
      if (hasST) {
        const scheduleGrid = document.querySelector('[data-schedule-grid]');
        if (scheduleGrid) {
          const cells = scheduleGrid.querySelectorAll('.class-cell');
          if (cells.length) {
            gsap.set(cells, { opacity: 0, y: 12 });
            ScrollTrigger.create({
              trigger: scheduleGrid,
              start: 'top 85%',
              once: true,
              onEnter: () => {
                gsap.to(cells, {
                  opacity: 1,
                  y: 0,
                  duration: 0.6,
                  ease: 'power2.out',
                  stagger: { each: 0.02, from: 'random' }
                });
              }
            });
          }
        }
      }

      /* ========= REFRESH AL CARGAR IMÁGENES ========= */
      if (hasST) {
        window.addEventListener('load', () => ScrollTrigger.refresh());
      }
    }
  );
})();
