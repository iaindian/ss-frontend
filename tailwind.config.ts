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
        // sans: ['Inter', 'ui-sans-serif', 'system-ui']
          sans: ['var(--font-inter)', 'system-ui', 'sans-serif'], // body
          display: ['var(--font-outfit)', 'sans-serif'],          // headers / accents
      },
      typography: ({ theme }) => ({
        inverted: {
          css: {
            "--tw-prose-body": theme("colors.zinc[100]"),
            "--tw-prose-headings": theme("colors.zinc[50]"),
            "--tw-prose-links": theme("colors.emerald[300]"),
            "--tw-prose-bold": theme("colors.zinc[50]"),
            "--tw-prose-quotes": theme("colors.zinc[100]"),
            "--tw-prose-counters": theme("colors.zinc[400]"),
            "--tw-prose-bullets": theme("colors.zinc[400]"),
            "--tw-prose-hr": theme("colors.zinc[800]"),
            "--tw-prose-code": theme("colors.zinc[100]"),
            "--tw-prose-th-borders": theme("colors.zinc[700]"),
            "--tw-prose-td-borders": theme("colors.zinc[800]"),
          },
        },
      }),
    }
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")]
}

export default config
