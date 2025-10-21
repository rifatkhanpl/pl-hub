/** @type {import('tailwindcss').Config} */
const { colors, spacing, typography, borderRadius, shadows } = require('./packages/design/tokens');

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors,
      spacing,
      ...typography,
      borderRadius,
      boxShadow: shadows,
    },
  },
  plugins: [],
};
