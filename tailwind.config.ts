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
        jolen: {
          yellow: "#FFE066",
          "yellow-light": "#FFF5CC",
          "yellow-dark": "#F5C800",
          pink: "#FF8FAB",
          "pink-light": "#FFD6E0",
          "pink-dark": "#FF4D7D",
          peach: "#FFCBA4",
          mint: "#B5EAD7",
          lavender: "#C7CEEA",
          cream: "#FFF9F0",
          warm: "#FFF0E6",
        },
      },
      fontFamily: {
        arabic: ["Cairo", "Tajawal", "sans-serif"],
        display: ["Cairo", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      animation: {
        "float": "float 3s ease-in-out infinite",
        "wiggle": "wiggle 1s ease-in-out infinite",
        "bounce-slow": "bounce 2s infinite",
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.9)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
      },
      backgroundImage: {
        "summer-gradient": "linear-gradient(135deg, #FFE066 0%, #FF8FAB 100%)",
        "hero-gradient": "linear-gradient(160deg, #FFF5CC 0%, #FFD6E0 50%, #FFF9F0 100%)",
        "card-gradient": "linear-gradient(145deg, #ffffff 0%, #FFF5CC 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
