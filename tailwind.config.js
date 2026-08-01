/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Status colors
        draft: 'var(--color-draft, #6B7280)',
        submitted: 'var(--color-submitted, #3B82F6)',
        revision: 'var(--color-revision, #F59E0B)',
        approved: 'var(--color-approved, #10B981)',
        rejected: 'var(--color-rejected, #EF4444)',

        // Brand colors
        primary: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
          950: '#172554',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
}
