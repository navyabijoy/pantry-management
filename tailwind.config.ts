import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        foreground: "var(--foreground)",
        customYellow: '#ff9800',
        accent: '#002244', // Deep Blue
        background: '#F8F9FA', // Light Gray
        text: '#333333', // Charcoal
        secondary: '#32CD32', // Lime Green
      },
    },
  },
  plugins: [],
} satisfies Config;
