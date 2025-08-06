/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['Syne', 'sans-serif'],
      },
      colors: {
        'off-white': '#f5eee9',
        'marine-blue': '#0d1136',
        'dark-purple': '#5A37C2',
        purple: {
          DEFAULT: '#8e68ff',
          50: '#f4f2ff',
          100: '#ebe8ff',
          200: '#d9d4ff',
          300: '#beb1ff',
          400: '#9d85ff',
          500: '#8e68ff',
          600: '#6e30f7',
          700: '#601ee3',
          800: '#5018bf',
          900: '#43169c',
          950: '#280b6a',
        },
        green: {
          DEFAULT: '#55af7d',
          50: '#f0f9f3',
          100: '#daf1e1',
          200: '#b8e2c7',
          300: '#89cca4',
          400: '#55af7d',
          500: '#359462',
          600: '#25764e',
          700: '#1e5e40',
          800: '#1a4b34',
          900: '#163e2c',
          950: '#0b2318',
        },
        blue: {
          DEFAULT: '#2273e1',
          50: '#f0f8fe',
          100: '#dceefd',
          200: '#c2e1fb',
          300: '#98d0f8',
          400: '#67b6f3',
          500: '#4397ee',
          600: '#2273e1',
          700: '#2565d0',
          800: '#2452a9',
          900: '#234785',
          950: '#1a2c51',
        },
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
};
