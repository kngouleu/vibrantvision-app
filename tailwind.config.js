/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },

      screens: {
        '2xlx': {'max': '1535px'},
        // => @media (max-width: 1535px) { ... }
  
        'xlx': {'max': '1279px'},
        // => @media (max-width: 1279px) { ... }
  
        'lgx': {'max': '1023px'},
        // => @media (max-width: 1023px) { ... }
  
        'mdx': {'max': '767px'},
        // => @media (max-width: 767px) { ... }
  
        'smx': {'max': '639px'},
        // => @media (max-width: 639px) { ... }
      }
    },
  },
  plugins: [],
}
