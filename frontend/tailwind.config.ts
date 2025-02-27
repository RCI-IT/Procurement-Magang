/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./component/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1E40AF",  // Warna biru 
        secondary: "#E11D48", // Warna merah 
        "gray-800": "#2d2d2d",
        "gray-900": "#1f1f1f",
        "red-600": "#dc2626",
        "red-700": "#b91c1c",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"], // Menambahkan font Poppins
      },
    },
  },
  plugins: [],
};
