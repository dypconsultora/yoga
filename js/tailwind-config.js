/* ================================
   MIBI Yoga · Configuración de Tailwind
   (paleta y tipografías compartidas)
   ================================ */

tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        display: ['Fraunces', 'serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        bone: '#f5f1ea',
        sand: '#ebe4d8',
        clay: '#b8826a',
        'clay-soft': '#e8d4c6',
        sage: '#8a9a7b',
        'sage-soft': '#d9e0cf',
        moss: '#4a5a3c',
        'moss-soft': '#cfd7c2',
        ink: '#1f1c17',
        'ink-soft': '#564c3f',
        'ink-muted': '#8a7e6c',
      }
    }
  }
};
