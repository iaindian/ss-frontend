import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ["class"],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './styles/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        background: '#0d0d0d',
        foreground: '#e5ffe9',
        primary: {
          DEFAULT: '#39ff14',
          foreground: '#001a00'
        },
        muted: '#141414',
        card: '#121212',
        border: '#232323',
        warning: '#f59e0b',
        danger: '#ef4444',
        success: '#22c55e'
      },
      boxShadow: {
        neon: '0 0 12px rgba(57,255,20,0.45)'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui']
      }
    }
  },
  plugins: []
}

export default config
