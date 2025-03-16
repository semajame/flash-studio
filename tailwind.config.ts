import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],

  theme: {
    extend: {
      animation: {
        'background-shine': 'background-shine 2s linear infinite',
      },
      keyframes: {
        'background-shine': {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
    },
  },

  plugins: [require('tailwindcss-animate')],
}

export default config
