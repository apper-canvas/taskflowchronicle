/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5B4FE9',
        secondary: '#8B85F0',
        accent: '#FF6B6B',
        surface: '#FFFFFF',
        background: '#F7F7FC',
        success: '#4ECDC4',
        warning: '#FFE66D',
        error: '#FF6B6B',
        info: '#4A90E2'
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui'],
        body: ['Inter', 'ui-sans-serif', 'system-ui']
      },
      animation: {
        'scale-up': 'scaleUp 0.3s ease-out',
        'confetti': 'confetti 0.5s ease-out',
        'spring': 'spring 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
      },
      keyframes: {
        scaleUp: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)' }
        },
        confetti: {
          '0%': { transform: 'scale(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(180deg)', opacity: '0' }
        },
        spring: {
          '0%': { transform: 'scale(0.8)' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)' }
        }
      }
    },
  },
  plugins: [],
}