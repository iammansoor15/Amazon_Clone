/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        btnClr: '#febd69', 
      },
      fontFamily: {
        'amazontitle': ['Amazon Ember', 'sans-serif'], 
      },
    },
  },
  
  plugins: [],
}