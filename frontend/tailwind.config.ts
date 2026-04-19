import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        marvel: {
          red: '#D0021B',
          gold: '#F5A623',
          blue: '#1A237E',
          black: '#0A0A0A',
          white: '#FFFFFF',
        },
      },
      fontFamily: {
        heading: ['"Bebas Neue"', 'sans-serif'],
        body: ['Nunito', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
