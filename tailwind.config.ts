import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          green: "#006633",
          yellow: "#FFD700",
        },
        accent: {
          orange: "#FF6B00",
          pink: "#FF1493",
        },
        gold: "#FFB800",
        cream: "#F5F0E8",
      },
      fontFamily: {
        bebas: ["var(--font-bebas)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
      },
      animation: {
        "glow-gold": "glowGold 2s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        "float": "float 3s ease-in-out infinite",
        "bounce-slow": "bounce 2s infinite",
        "spin-slow": "spin 8s linear infinite",
        "pack-open": "packOpen 0.5s ease-out forwards",
        "card-flip": "cardFlip 0.6s ease-in-out forwards",
        "confetti-fall": "confettiFall 3s ease-in forwards",
      },
      keyframes: {
        glowGold: {
          "0%, 100%": { boxShadow: "0 0 8px #FFB800, 0 0 16px #FFB800" },
          "50%": { boxShadow: "0 0 20px #FFB800, 0 0 40px #FFB800, 0 0 60px #FFB80066" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        packOpen: {
          "0%": { transform: "scale(1) rotate(0deg)" },
          "50%": { transform: "scale(1.1) rotate(3deg)" },
          "100%": { transform: "scale(0) rotate(15deg)", opacity: "0" },
        },
        cardFlip: {
          "0%": { transform: "rotateY(90deg) scale(0.8)", opacity: "0" },
          "100%": { transform: "rotateY(0deg) scale(1)", opacity: "1" },
        },
        confettiFall: {
          "0%": { transform: "translateY(-100vh) rotate(0deg)", opacity: "1" },
          "100%": { transform: "translateY(100vh) rotate(720deg)", opacity: "0" },
        },
      },
      backgroundImage: {
        "shimmer-gradient": "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
        "gold-gradient": "linear-gradient(135deg, #FFB800 0%, #FFD700 50%, #FF8C00 100%)",
        "green-gradient": "linear-gradient(135deg, #006633 0%, #00994d 100%)",
        "hero-pattern": "radial-gradient(circle at 20% 50%, #006633 0%, #004d26 50%, #002211 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
