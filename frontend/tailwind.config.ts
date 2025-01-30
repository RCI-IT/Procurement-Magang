import type { Config } from "tailwindcss";

export default {
  content: [
    "./app//*.{js,ts,jsx,tsx,mdx}",
    "./component//*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "gray-800": "#2d2d2d",
        "gray-900": "#1f1f1f",
        "blue-500": "#1d4ed8",
        "red-600": "#dc2626",
        "red-700": "#b91c1c",
      },
    },
  },
  plugins: [],
} satisfies Config;