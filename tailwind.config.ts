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
  safelist: [
    // Gradientes (direções)
    {
      pattern: /^bg-gradient-to-(t|b|l|r|tl|tr|bl|br)$/,
    },
    // Cores de início (from)
    {
      pattern: /^from-(red|blue|green|yellow|purple|pink|gray|indigo|teal|cyan|amber|lime|rose|fuchsia|emerald|violet|zinc)-(100|200|300|400|500|600|700|800|900)$/,
    },
    // Cores intermediárias (via)
    {
      pattern: /^via-(red|blue|green|yellow|purple|pink|gray|indigo|teal|cyan|amber|lime|rose|fuchsia|emerald|violet|zinc)-(100|200|300|400|500|600|700|800|900)$/,
    },
    // Cores de destino (to)
    {
      pattern: /^to-(red|blue|green|yellow|purple|pink|gray|indigo|teal|cyan|amber|lime|rose|fuchsia|emerald|violet|zinc)-(100|200|300|400|500|600|700|800|900)$/,
    },
  ],
  plugins: [],
} satisfies Config;
