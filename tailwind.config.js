/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Gaming theme - dark with neon accents
        background: '#0a0e1a',
        surface: '#13182b',
        'surface-light': '#1a2138',
        'surface-hover': '#212947',
        primary: '#ff3366',
        'primary-hover': '#ff1a53',
        'primary-light': '#ff5580',
        'primary-dark': '#e6004d',
        accent: '#00d9ff',
        'accent-hover': '#00c3e6',
        'accent-green': '#00ff88',
        'text-primary': '#ffffff',
        'text-secondary': '#8b92b0',
        border: '#1f2740',
        success: '#00ff88',
        warning: '#ffd700',
        error: '#ff3366'
      }
    }
  },
  plugins: []
}
