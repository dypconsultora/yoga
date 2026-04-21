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
