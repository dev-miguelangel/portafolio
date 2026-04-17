/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#00e879',
          dark: '#0a0a0f',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  safelist: [
    'rotate-45',
    '-rotate-45',
    'translate-y-[6.5px]',
    '-translate-y-[6.5px]',
    'opacity-0',
  ],
  plugins: [],
};
