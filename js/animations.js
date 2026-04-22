/* ================================
   MIBI Yoga · Animaciones con GSAP
   - Registro de ScrollTrigger
   - Respeto de prefers-reduced-motion
   - Entrada del hero, reveals por sección,
     parallax del ritual y conteo de stats
   ================================ */

(function () {
  if (typeof gsap === 'undefined') {
    document.documentElement.classList.remove('gsap-ready');
    return;
  }
  if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);

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

      // Quita el hide anti-FOUC antes de crear los tweens.
      // gsap.from() con immediateRender (default) aplica el start state
      // en el mismo tick, así que no hay flash.
      document.documentElement.classList.remove('gsap-ready');

      if (reduced) {
        return;
      }

      /* ========= HERO ENTRANCE (index) ========= */
      const heroEyebrow = document.querySelector('[data-hero-eyebrow]');
      const heroTitle = document.querySelectorAll('[data-hero-line]');
      const heroLead = document.querySelector('[data-hero-lead]');
      const heroCtas = document.querySelectorAll('[data-hero-cta]');
      const heroTiles = document.querySelectorAll('[data-hero-tile]');

      if (heroTitle.length) {
        const tl = gsap.timeline({
          defaults: { ease: 'power3.out' }
        });

        if (heroEyebrow) {
          tl.from(heroEyebrow, {
            y: 16,
            autoAlpha: 0,
            duration: 0.7
          });
        }

        tl.from(
          heroTitle,
          {
            yPercent: 100,
            autoAlpha: 0,
            duration: 1.1,
            stagger: 0.08,
            ease: 'power4.out'
          },
          heroEyebrow ? '-=0.35' : 0
        );

        if (heroLead) {
          tl.from(
            heroLead,
            { y: 24, autoAlpha: 0, duration: 0.8 },
            '-=0.6'
          );
        }

        if (heroCtas.length) {
          tl.from(
            heroCtas,
            {
              y: 14,
              autoAlpha: 0,
              duration: 0.6,
              stagger: 0.08
            },
            '-=0.5'
          );
        }

        if (heroTiles.length) {
          tl.from(
            heroTiles,
            {
              y: 60,
              autoAlpha: 0,
              duration: 0.9,
              stagger: 0.08,
              ease: 'power3.out'
            },
            '-=0.7'
          );
        }
      }

      /* ========= REVEALS POR SECCIÓN ========= */
      // Heading + intro de cada sección
      gsap.utils.toArray('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          y: 40,
          autoAlpha: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        });
      });

      /* ========= GRID / GROUP STAGGER ========= */
      gsap.utils.toArray('[data-reveal-group]').forEach((group) => {
        const items = group.querySelectorAll('[data-reveal-child]');
        if (!items.length) return;
        gsap.from(items, {
          y: 48,
          autoAlpha: 0,
          duration: 0.85,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: group,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        });
      });

      /* ========= PARALLAX DEL RITUAL ========= */
      if (isDesktop) {
        const ritualImg = document.querySelector('[data-ritual-image]');
        if (ritualImg) {
          gsap.fromTo(
            ritualImg,
            { yPercent: -8, scale: 1.08 },
            {
              yPercent: 8,
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
            { y: -24, rotation: -1 },
            {
              y: 24,
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
      gsap.utils.toArray('[data-count]').forEach((el) => {
        const end = parseFloat(el.dataset.count);
        const decimals = (el.dataset.countDecimals | 0) || 0;
        const suffix = el.dataset.countSuffix || '';
        const prefix = el.dataset.countPrefix || '';
        const obj = { n: 0 };
        gsap.to(obj, {
          n: end,
          duration: 1.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          },
          onUpdate: () => {
            el.textContent =
              prefix + obj.n.toFixed(decimals).replace('.', ',') + suffix;
          }
        });
      });

      /* ========= RESEÑAS: FADE DE LA SECCIÓN ========= */
      const reviewsSection = document.querySelector('.reviews-carousel');
      if (reviewsSection) {
        gsap.from(reviewsSection, {
          y: 50,
          autoAlpha: 0,
          duration: 1,
          scrollTrigger: {
            trigger: reviewsSection,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        });
      }

      /* ========= HORARIOS: GRID + PRECIOS ========= */
      const scheduleGrid = document.querySelector('[data-schedule-grid]');
      if (scheduleGrid && typeof ScrollTrigger !== 'undefined') {
        const cells = scheduleGrid.querySelectorAll('.class-cell');
        if (cells.length) {
          gsap.from(cells, {
            y: 20,
            autoAlpha: 0,
            duration: 0.6,
            stagger: { each: 0.02, from: 'random' },
            ease: 'power2.out',
            scrollTrigger: {
              trigger: scheduleGrid,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          });
        }
      }

      /* ========= REFRESH AL TERMINAR DE CARGAR IMÁGENES ========= */
      if (typeof ScrollTrigger !== 'undefined') {
        window.addEventListener('load', () => ScrollTrigger.refresh());
      }
    }
  );
})();
