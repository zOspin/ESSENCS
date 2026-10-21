// Tokens de diseño Dark Luxury. Las mismas variables viven como CSS en styles/globals.css
// (bloque @theme) para que Tailwind genere las utilidades; aquí se exponen para JS/SVG.
export const theme = {
  colors: {
    bgPrimary: '#0A0A0C',
    bgPrimaryAlt: '#101014',
    surface: '#141418',
    surfaceAlt: '#1A1A1E',
    gold: '#D4AF37',
    goldLight: '#FFF0B3',
    goldDark: '#8C6211',
    goldBorder: 'rgba(212, 175, 55, 0.25)',
    text: '#FFFFFF',
    textSoft: '#F3F3F5',
    textMuted: '#9CA3AF',
  },
  gradients: {
    gold: 'linear-gradient(135deg, #FFF0B3 0%, #D4AF37 50%, #8C6211 100%)',
  },
  fonts: {
    display: "'Cinzel', 'Playfair Display', serif",
    sans: "'Montserrat', 'Inter', sans-serif",
  },
  shadows: {
    glow: '0 0 24px rgba(212, 175, 55, 0.35)',
  },
  motion: {
    duration: 300,
    easing: 'ease',
  },
};
