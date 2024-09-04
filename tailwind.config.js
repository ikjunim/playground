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
      serif: ['Lora', 'serif'],
      mono: ['Azeret Mono', 'monospace'],
      gothic: ['League Gothic', 'sans-serif'],
      news: ['Imbue', 'serif'],
      caveat: ['Caveat', 'cursive'],
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
      bigasf: 'clamp(0rem, 10svw + 1.5rem, 12rem)',
      heading: 'clamp(0rem, 4svw + 1rem, 8rem)',
      headingHalf: 'clamp(0rem, 2svw + 0.5rem, 4rem)',
      slate: 'clamp(0rem, 2svw + 0.5rem, 3rem)',
      text: 'clamp(0rem, 0.75svw + 0.5rem, 2rem)',
      bigHeading: 'clamp(0.5rem, 12svw + 1rem, 16rem)',
      scroll: 'clamp(4rem, 10svmax + 3rem, 20rem)',
      idea: 'clamp(0rem, 2.5svw + 0.6rem, 5rem)',
      ideaHalf: 'clamp(0rem, 1svw + 0.3rem, 2.5rem)',
      square: 'max(7.2svw, 7.2svh)',
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

