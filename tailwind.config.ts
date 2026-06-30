import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          50: "#fdf2f4",
          100: "#fce7ea",
          200: "#f9d0d8",
          300: "#f4a9b8",
          400: "#ed7a93",
          500: "#e04a6d",
          600: "#d42d56",
          700: "#AA1C41",
          800: "#8f1a39",
          900: "#7a1a33",
          950: "#430a1b",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        dark: {
          50: "hsl(var(--dark-50))",
          100: "hsl(var(--dark-100))",
          200: "hsl(var(--dark-200))",
          300: "hsl(var(--dark-300))",
          400: "hsl(var(--dark-400))",
          500: "hsl(var(--dark-500))",
          600: "hsl(var(--dark-600))",
          700: "hsl(var(--dark-700))",
          800: "hsl(var(--dark-800))",
          900: "hsl(var(--dark-900))",
          950: "hsl(var(--dark-950))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "2rem",
          lg: "4rem",
          xl: "5rem",
          "2xl": "6rem",
        },
        screens: {
          sm: "640px",
          md: "768px",
          lg: "1024px",
          xl: "1280px",
          "2xl": "1536px",
        },
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInDown: {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(10px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulseSoft: {
          "0%": { opacity: "1" },
          "50%": { opacity: "0.8" },
          "100%": { opacity: "1" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(-2deg)" },
          "75%": { transform: "rotate(2deg)" },
        },
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "fade-in-up": "fadeInUp 0.5s ease-out",
        "fade-in-down": "fadeInDown 0.3s ease-out",
        "slide-in-right": "slideInRight 0.3s ease-out",
        shimmer: "shimmer 2s infinite linear",
        "pulse-soft": "pulseSoft 2s infinite ease-in-out",
        "scale-in": "scaleIn 0.2s ease-out",
        float: "float 3s ease-in-out infinite",
        wiggle: "wiggle 3s ease-in-out infinite",
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgb(94 36 78 / 0.04), 0 1px 2px -1px rgb(94 36 78 / 0.06)',
        'card-hover': '0 4px 6px -1px rgb(94 36 78 / 0.06), 0 2px 4px -2px rgb(94 36 78 / 0.08)',
        'dropdown': '0 10px 15px -3px rgb(94 36 78 / 0.08), 0 4px 6px -4px rgb(94 36 78 / 0.04)',
        'modal': '0 20px 25px -5px rgb(94 36 78 / 0.10), 0 8px 10px -6px rgb(94 36 78 / 0.06)',
        'glow': '0 0 20px hsl(344 72% 39% / 0.15)',
        'glow-lg': '0 0 40px hsl(344 72% 39% / 0.15)',
        'warm': '0 4px 20px hsl(19 74% 62% / 0.15)',
      },
    },
  },
  plugins: [],
};

export default config;
