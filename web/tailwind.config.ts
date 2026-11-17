import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: { '2xl': '1280px' },
    },
    extend: {
      colors: {
        background: 'hsl(var(--background) / <alpha-value>)',
        foreground: 'hsl(var(--foreground) / <alpha-value>)',
        card: 'hsl(var(--card) / <alpha-value>)',
        muted: 'hsl(var(--muted) / <alpha-value>)',
        'muted-foreground': 'hsl(var(--muted-foreground) / <alpha-value>)',
        border: 'hsl(var(--border) / <alpha-value>)',
        // Brand from Baruc Shopping identity: metallic gold scale
        brand: {
          50: '#FBF6E9',
          100: '#F5E9C8',
          200: '#EBD48A',
          300: '#E0C05A',
          400: '#D4AF37',
          500: '#C9A227',
          600: '#A8841C',
          700: '#866616',
          800: '#5C4510',
          900: '#3D2E0B',
          950: '#241A06',
        },
        // Secondary accent — "SHOPPING" blue from brand lockup
        'accent-blue': '#2F6BFF',
        'accent-blue-bright': '#4D8BFF',
        'accent-violet': '#2F6BFF',
        'accent-magenta': '#E0C05A',
        'accent-fuchsia': '#D4AF37',
        navy: {
          950: '#050B18',
          900: '#0A1128',
          800: '#0F1A33',
          700: '#162243',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-heading)', 'var(--font-display)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 2px 16px -4px rgb(0 0 0 / 0.08)',
        lift: '0 12px 32px -12px rgb(0 0 0 / 0.18)',
        glow: '0 0 36px -8px rgb(212 175 55 / 0.55)',
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        'slow-zoom': {
          from: { transform: 'scale(1)' },
          to: { transform: 'scale(1.12)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.6s infinite',
        'fade-up': 'fade-up 0.5s ease both',
        marquee: 'marquee 28s linear infinite',
        'slow-zoom': 'slow-zoom 18s ease-in-out infinite alternate',
      },
    },
  },
  plugins: [],
};

export default config;
