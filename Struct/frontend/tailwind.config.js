/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", // Ensure Tailwind scans your HTML file
    "./src/**/*.{html,js,jsx,tsx}", // Include all files in src with supported extensions
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "ui-sans-serif", "system-ui"], // Add Satoshi as the default sans font
      },
    },
  },
  plugins: [],
};
