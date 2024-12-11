import type { Config } from "tailwindcss";

export default {
  darkMode: "selector",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      screens: {
        "mobile": '300px',
        "tablet": "768px",
        "notebook": "1024px",
        "desktop-medium": "1368px",
        "desktop-large": "1600px"
      },
      borderRadius: {
        "1": ".4rem",
        "2": ".6rem",
        "3": ".8rem",
        "4": "1rem"
      }
    },
  },
  plugins: [],
} satisfies Config;
