import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#07080A",
        graphite: "#12151A",
        platinum: "#EEF1F4",
        titanium: "#AEB7C2",
        ember: "#FF6B35",
        mint: "#63E6BE"
      },
      boxShadow: {
        glow: "0 0 80px rgba(99, 230, 190, 0.14)",
        premium: "0 24px 90px rgba(0, 0, 0, 0.45)"
      },
      backgroundImage: {
        "radial-premium": "radial-gradient(circle at 50% 0%, rgba(99,230,190,0.15), transparent 36%), radial-gradient(circle at 88% 18%, rgba(255,107,53,0.12), transparent 30%)"
      }
    }
  },
  plugins: []
};

export default config;
