import type {Config} from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#1E3A8A',
          primaryHover: '#172D6E',
          accent: '#D97706',
          accentText: '#B45309',
        },
        surface: {
          light: '#FAFBFD',
          dark: '#080E1A',
        },
        semantic: {
          success: '#15803D',
          warning: '#B45309',
          error: '#B91C1C',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      spacing: {
        1: '4px',
        2: '8px',
        4: '16px',
        6: '24px',
        8: '32px',
        12: '48px',
      },
      borderRadius: {
        card: '16px',
        control: '12px',
      },
      maxWidth: {
        prose70: '70ch',
      },
    },
  },
  plugins: [],
};

export default config;
