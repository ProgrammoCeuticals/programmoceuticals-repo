/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ProgrammoCeuticals brand colours (brand.md)
      colors: {
        brand: {
          blue: '#0B5ED7',
          'blue-dark': '#094DB8',
          'blue-light': '#E8F0FD',
          white: '#FFFFFF',
          'gray-dark': '#2E2E2E',
          'gray-mid': '#6B7280',
          'gray-light': '#F5F7FA',
          border: '#DDE3EE',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
