/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(220, 20%, 7%)",
        surface: {
          DEFAULT: "hsl(220, 18%, 11%)",
          hover: "hsl(220, 16%, 15%)",
        },
        border: "hsla(220, 15%, 85%, 0.08)",
        primary: {
          DEFAULT: "hsl(38, 100%, 55%)",
          hover: "hsl(38, 100%, 65%)",
          foreground: "#000000",
        },
        text: {
          DEFAULT: "hsl(210, 20%, 95%)",
          secondary: "hsl(215, 15%, 65%)",
        },
        success: "hsl(152, 69%, 45%)",
        danger: "hsl(0, 76%, 62%)",
        info: "hsl(199, 94%, 60%)",
        muted: "hsl(215, 15%, 40%)",
      },
      fontFamily: {
        heading: ['"Space Grotesk"', "sans-serif"],
        body: ['"Inter"', "sans-serif"],
      },
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
      },
      boxShadow: {
        glow: "0 4px 20px rgba(240, 180, 20, 0.25)",
        "glow-lg": "0 8px 40px rgba(240, 180, 20, 0.35)",
        card: "0 2px 8px rgba(0, 0, 0, 0.3)",
        "card-hover": "0 8px 24px rgba(0, 0, 0, 0.5)",
        glass: "0 8px 32px rgba(0, 0, 0, 0.4)",
      },
      transitionDuration: {
        fast: "150ms",
        normal: "200ms",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
        "slide-in-right": "slide-in-right 0.3s ease-out",
        shimmer: "shimmer 2s linear infinite",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
