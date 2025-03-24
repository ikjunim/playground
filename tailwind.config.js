/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
    fontFamily: {
      sans: ['Raleway', 'sans-serif'],
      serif: ['DM Serif', 'serif'],
      mono: ['Azeret Mono', 'monospace'],
    },
    colors: {
      transparent: 'transparent',
      black: '#181717',
      white: '#FAF9F6',
      red: '#fe6d73',
      yellow: '#ffcb77',
      green: '#17c3b2',
      blue: '#227c9d',
    },
    fontSize: {
      heading: 'clamp(0rem, 4svw + 1rem, 8rem)',
      headingHalf: 'clamp(0rem, 2svw + 1rem, 4rem)',
      brick: 'clamp(0rem, 3svw + 1rem, 4rem)',
      slate: 'clamp(0rem, 2svw + 0.5rem, 3rem)',
      text: 'clamp(0rem, 1svw + 0.5rem, 2rem)',
      tiny: 'clamp(0rem, 0.5svw + 0.2rem, 1rem + 0.1svw)',
      idea: 'clamp(0rem, 2.5svw + 0.8rem, 4rem)',
      brick: 'clamp(0rem, min(3svw,3svh) + 1rem, 3rem)',
      nav: 'clamp(0rem, 2svw + 0.8rem, 3rem)',
      ideaHalf: 'clamp(0rem, 1svw + 0.3rem, 2.5rem)',
      kinetic: 'clamp(0rem, 10svh + 2rem, 20svw)',
    },
    width: {
      square: 'max(7.2svw, 7.2svh)',
      full: '100%',
      svw: '100svw',
      max: 'max-content',
    },
    height: {
      square: 'max(7.2svw, 7.2svh)',
      full: '100%',
      svh: '100svh',
      max: 'max-content',
    },
  },
  plugins: [],
}

