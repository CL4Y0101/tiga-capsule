import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        capsule: {
          cream: '#FFFDF7',
          softBlue: '#A1C8E9',
          pastelYellow: '#FDEBA6',
          mutedPink: '#F4AAB9',
          lavender: '#CDB4DB',
          navy: '#2D3250',
          purple: '#424769',
        }
      },
      fontFamily: {
        pixel: ['var(--font-pixel)', 'monospace'],
        sans: ['var(--font-sans)', 'sans-serif'],
      },
      boxShadow: {
        'pixel': '4px 4px 0px 0px rgba(45, 50, 80, 1)',
        'pixel-sm': '2px 2px 0px 0px rgba(45, 50, 80, 1)',
      }
    },
  },
  plugins: [],
}
export default config