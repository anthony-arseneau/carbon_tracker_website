/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-slate': '#0a0b10',
        'dark-card': '#12141c',
        'dark-border': '#1e2130',
        'neon-orange': '#FF9F43',
        'neon-cyan': '#00D2FC',
        'neon-green': '#28C76F',
        'neon-red': '#FF4757',
        'neon-yellow': '#FFD93D',
        'neon-violet': '#BB86FC',
        'muted-text': '#6b7280',
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'SF Mono', 'Roboto Mono', 'monospace'],
      },
      animation: {
        'blink': 'blink 1.5s ease-in-out infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
      },
    },
  },
  plugins: [],
}
