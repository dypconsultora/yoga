/* ================================
   MIBI Yoga · Lógica de la página de Horarios
   Filtra las celdas de la grilla según el tipo de clase.
   ================================ */

(function () {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cells = document.querySelectorAll('.class-cell[data-class]');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      cells.forEach(cell => {
        if (filter === 'all' || cell.dataset.class === filter) {
          cell.style.opacity = '1';
          cell.style.filter = 'none';
        } else {
          cell.style.opacity = '0.2';
          cell.style.filter = 'grayscale(0.8)';
        }
      });
    });
  });
})();
