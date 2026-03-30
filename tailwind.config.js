/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        surface: '#121212',
        surface2: '#1a1a1a',
        primary: '#3b82f6',
        primaryDim: 'rgba(59, 130, 246, 0.15)',
        accent: '#8b5cf6',
        text: '#f3f4f6',
        textDim: '#9ca3af',
        border: '#27272a'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
