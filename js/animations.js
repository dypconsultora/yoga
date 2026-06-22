/* ================================
   MIBI Yoga · Animaciones con GSAP
   - ScrollSmoother (scroll suave premium)
   - ScrollTrigger + matchMedia + prefers-reduced-motion
   - Hero, reveals por sección, parallax cinemático en imágenes,
     marquee reactivo a la velocidad, conteo de stats
   ================================ */

(function () {
  const html = document.documentElement;

  if (typeof gsap === 'undefined') {
    html.classList.remove('gsap-ready');
    return;
  }
  const hasST = typeof ScrollTrigger !== 'undefined';
  const hasSmoother = typeof ScrollSmoother !== 'undefined';
  if (hasST) gsap.registerPlugin(ScrollTrigger);
  if (hasSmoother) gsap.registerPlugin(ScrollSmoother);

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

      // Quita el hide anti-FOUC; a partir de acá GSAP maneja estados iniciales.
      html.classList.remove('gsap-ready');

      // Accesibilidad: si pidieron menos movimiento, todo visible y sin smoother.
      if (reduced) {
        gsap.set('[data-reveal], [data-reveal-child]', { opacity: 1, y: 0, clearProps: 'transform' });
        return;
      }

      /* ========= SCROLLSMOOTHER (scroll suave) ========= */
      let smoother = null;
      if (hasSmoother && document.getElementById('smooth-wrapper')) {
        try {
          smoother = ScrollSmoother.create({
            wrapper: '#smooth-wrapper',
            content: '#smooth-content',
            smooth: 1.4,          // segundos de "catch-up" del scroll
            smoothTouch: false,   // en touch dejamos el scroll nativo (más natural)
            effects: true,        // habilita data-speed / data-lag
            normalizeScroll: false
          });
          window.mibiSmoother = smoother;
        } catch (err) {
          // Si ScrollSmoother falla, seguimos con scroll nativo + el resto de efectos.
          console.warn('ScrollSmoother no se pudo inicializar:', err);
          smoother = null;
        }
      }

      // Estado oculto explícito para los reveals.
      const revealSel = '[data-reveal]';
      const childSel = '[data-reveal-child]';
      gsap.set(revealSel, { opacity: 0, y: 40 });
      gsap.set(childSel, { opacity: 0, y: 40 });

      /* ========= HERO ENTRANCE ========= */
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
        if (heroEyebrow) tl.to(heroEyebrow, { opacity: 1, y: 0, duration: 0.7 });
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
          onEnter: (els) => gsap.to(els, {
            y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', stagger: 0.08, overwrite: 'auto'
          })
        });
        ScrollTrigger.batch(childSel, {
          start: 'top 90%',
          once: true,
          onEnter: (els) => gsap.to(els, {
            y: 0, opacity: 1, duration: 0.85, ease: 'power3.out', stagger: 0.1, overwrite: 'auto'
          })
        });
      } else {
        gsap.set([revealSel, childSel].join(','), { opacity: 1, y: 0 });
      }

      /* ========= PARALLAX CINEMÁTICO EN IMÁGENES ========= */
      // Aplica a las imágenes grandes (object-cover) dentro de contenedores
      // con overflow oculto: las agrandamos (scale) y desplazamos en scrub,
      // de modo que el zoom tape los bordes y no se vea hueco.
      if (hasST) {
        const depth = isDesktop ? 14 : 8;     // % de desplazamiento
        gsap.utils.toArray('img.object-cover').forEach((img) => {
          const frame = img.closest('.overflow-hidden') || img.parentElement;
          if (!frame) return;
          gsap.fromTo(
            img,
            { yPercent: -depth, scale: 1.22 },
            {
              yPercent: depth,
              scale: 1.22,
              ease: 'none',
              scrollTrigger: {
                trigger: frame,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.8
              }
            }
          );
        });
      }

      /* ========= RITUAL: tarjeta flotante ========= */
      if (isDesktop && hasST) {
        const ritualFloat = document.querySelector('[data-ritual-float]');
        if (ritualFloat) {
          gsap.fromTo(
            ritualFloat,
            { y: -24, rotation: -1.5 },
            {
              y: 24, rotation: 4, ease: 'none',
              scrollTrigger: {
                trigger: ritualFloat.closest('section'),
                start: 'top bottom', end: 'bottom top', scrub: 1
              }
            }
          );
        }
      }

      /* ========= MARQUEE REACTIVO A LA VELOCIDAD ========= */
      if (hasST) {
        const marqueeText = gsap.utils.toArray('.marquee-text');
        if (marqueeText.length) {
          const skewTo = gsap.quickTo(marqueeText, 'skewX', { duration: 0.5, ease: 'power3' });
          const clampSkew = gsap.utils.clamp(-12, 12);
          ScrollTrigger.create({
            onUpdate: (self) => skewTo(clampSkew(self.getVelocity() / -180))
          });
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
            n: end, duration: 1.6, ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
            onUpdate: () => {
              el.textContent = prefix + obj.n.toFixed(decimals).replace('.', ',') + suffix;
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
              onEnter: () => gsap.to(cells, {
                opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
                stagger: { each: 0.02, from: 'random' }
              })
            });
          }
        }
      }

      /* ========= REFRESH AL CARGAR IMÁGENES ========= */
      if (hasST) {
        window.addEventListener('load', () => ScrollTrigger.refresh());
      }

      // Cleanup al cambiar de breakpoint / reduced-motion.
      return () => {
        if (smoother) smoother.kill();
        if (window.mibiSmoother === smoother) window.mibiSmoother = null;
      };
    }
  );
})();
