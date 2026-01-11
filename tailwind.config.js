
/** @type {import('tailwindcss').Config} */
export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        wood: {
          50: '#fbf7f4',
          100: '#f5ebe3',
          200: '#ebd6c4',
          300: '#deb89b',
          400: '#d09570',
          500: '#c5784e',
          600: '#b85f3f',
          700: '#994a34',
          800: '#8b4513', // Brand Primary
          900: '#673412',
        },
        forest: {
          50: '#f2fcf5',
          100: '#e1f8e8',
          200: '#c3eed0',
          300: '#95deb0',
          400: '#5fc589',
          500: '#39a869',
          600: '#288851',
          700: '#236c43',
          800: '#2d5016', // Brand Secondary
          900: '#1a452d',
        },
        sky: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#87CEEB', // Brand Accent
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
        'glass-dark': 'linear-gradient(135deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.1))',
      }
    },
  },
  plugins: [],
}
