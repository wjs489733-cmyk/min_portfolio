/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        galmuri:    ['var(--font-galmuri)', 'monospace'],
        pretendard: ['var(--font-pretendard)', 'system-ui', 'sans-serif'],
        mono:       ['var(--font-mono)', 'Courier New', 'monospace'],
      },
      colors: {
        ink: {
          bg:       '#080808',
          surface:  '#111111',
          surface2: '#181818',
          border:   '#1E1E1E',
          border2:  '#2A2A2A',
        },
        ash: {
          100: '#E8E8E8',
          200: '#BBBBBB',
          300: '#888888',
          400: '#555555',
          500: '#333333',
          600: '#222222',
        },
      },
      fontSize: {
        '2xs': ['10px', { lineHeight: '14px', letterSpacing: '0.08em' }],
        xs:    ['12px', { lineHeight: '16px' }],
        sm:    ['14px', { lineHeight: '20px' }],
        base:  ['16px', { lineHeight: '24px' }],
        lg:    ['18px', { lineHeight: '28px' }],
        xl:    ['20px', { lineHeight: '28px' }],
        '2xl': ['24px', { lineHeight: '32px' }],
        '3xl': ['32px', { lineHeight: '40px' }],
        '4xl': ['48px', { lineHeight: '52px' }],
        '5xl': ['64px', { lineHeight: '68px' }],
        '6xl': ['80px', { lineHeight: '84px' }],
        '7xl': ['96px', { lineHeight: '96px' }],
      },
      animation: {
        'blink':     'blink 1s step-end infinite',
        'fade-in':   'fadeIn 0.6s ease-out forwards',
        'slide-up':  'slideUp 0.6s ease-out forwards',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
