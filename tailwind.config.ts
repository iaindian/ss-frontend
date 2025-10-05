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
  			sans: [
  				'var(--font-inter)',
  				'system-ui',
  				'sans-serif'
  			],
  			display: [
  				'var(--font-outfit)',
  				'sans-serif'
  			]
  		},
  		typography: '({ theme }) => ({\n        inverted: {\n          css: {\n            "--tw-prose-body": theme("colors.zinc[100]"),\n            "--tw-prose-headings": theme("colors.zinc[50]"),\n            "--tw-prose-links": theme("colors.emerald[300]"),\n            "--tw-prose-bold": theme("colors.zinc[50]"),\n            "--tw-prose-quotes": theme("colors.zinc[100]"),\n            "--tw-prose-counters": theme("colors.zinc[400]"),\n            "--tw-prose-bullets": theme("colors.zinc[400]"),\n            "--tw-prose-hr": theme("colors.zinc[800]"),\n            "--tw-prose-code": theme("colors.zinc[100]"),\n            "--tw-prose-th-borders": theme("colors.zinc[700]"),\n            "--tw-prose-td-borders": theme("colors.zinc[800]"),\n          },\n        },\n      })',
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")]
}

export default config
