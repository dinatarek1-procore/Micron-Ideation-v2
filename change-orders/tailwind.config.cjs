const path = require('path');

/**
 * Tailwind for the embedded mfe-global-nav shell (ported from initialize-ppt-packages).
 * Breakpoints (min-width): 360 handset, 768 tablet, 1024 tabletLandscape, 1440 desktop.
 */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    path.join(__dirname, 'public/index.html'),
    path.join(__dirname, 'src/**/*.{ts,tsx,html}'),
  ],
  theme: {
    extend: {
      screens: {
        handset: '360px',
        tablet: '768px',
        tabletLandscape: '1024px',
        desktop: '1440px',
      },
      colors: {
        asphalt: {
          50: '#f8fafc',
          100: '#f1f5f9',
          400: 'rgba(255,255,255,0.50)',
        },
        legacy: {
          header: '#000000',
          picker: '#2f3437',
          pickerHover: '#464f53',
          toolMenuBg: '#232729',
          menuFooter: '#e7e7e7',
        },
      },
    },
  },
  plugins: [],
};
