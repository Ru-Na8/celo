import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            fontFamily: {
                sans: ["var(--font-inter)", "sans-serif"],
                serif: ["var(--font-playfair)", "serif"],
                display: ["var(--font-cinzel)", "serif"],
            },
            colors: {
                border: "hsl(var(--border) / <alpha-value>)",
                input: "hsl(var(--input) / <alpha-value>)",
                ring: "hsl(var(--ring) / <alpha-value>)",
                background: "hsl(var(--background) / <alpha-value>)",
                foreground: "hsl(var(--foreground) / <alpha-value>)",
                primary: {
                    DEFAULT: "hsl(var(--primary) / <alpha-value>)",
                    foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
                    foreground: "hsl(var(--secondary-foreground) / <alpha-value>)",
                },
                // Herr Frisör Brand Colors
                cream: {
                    50: "#FEFDFB",
                    100: "#FBF9F4",
                    200: "#F5F0E6",
                    300: "#EDE5D4",
                    400: "#E0D5BE",
                    500: "#D4C5A8",
                },
                navy: {
                    50: "#F0F4F8",
                    100: "#D9E2EC",
                    200: "#BCCCDC",
                    300: "#9FB3C8",
                    400: "#829AB1",
                    500: "#627D98",
                    600: "#486581",
                    700: "#334E68",
                    800: "#243B53",
                    900: "#102A43",
                    950: "#0A1929",
                },
                brass: {
                    100: "#F9F1D8",
                    200: "#F0DEAA",
                    300: "#E6CB7D",
                    400: "#D4AF37",
                    500: "#B8962F",
                    600: "#8B7023",
                },
                leather: {
                    100: "#F5E6D3",
                    200: "#E8CEB3",
                    300: "#D4A574",
                    400: "#B8844C",
                    500: "#8B5E34",
                    600: "#6B4423",
                },
                charcoal: {
                    50: "#F7F7F7",
                    100: "#E3E3E3",
                    200: "#C8C8C8",
                    300: "#A4A4A4",
                    400: "#818181",
                    500: "#666666",
                    600: "#515151",
                    700: "#434343",
                    800: "#383838",
                    900: "#1A1A1A",
                    950: "#0D0D0D",
                },
                // Legacy support
                gold: {
                    100: "#F9F1D8",
                    200: "#F0DEAA",
                    300: "#E6CB7D",
                    400: "#D4AF37",
                    500: "#AA8C2C",
                    600: "#806921",
                },
                emerald: {
                    300: "#6EE7B7",
                    500: "#10B981",
                    700: "#047857",
                    900: "#064E3B",
                },
                copper: {
                    300: "#FDBA74",
                    500: "#F97316",
                    700: "#C2410C",
                },
                obsidian: {
                    DEFAULT: "#0a0a0a",
                    light: "#1a1a1a",
                    lighter: "#2a2a2a",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
                    foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted) / <alpha-value>)",
                    foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent) / <alpha-value>)",
                    foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover) / <alpha-value>)",
                    foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
                },
                card: {
                    DEFAULT: "hsl(var(--card) / <alpha-value>)",
                    foreground: "hsl(var(--card-foreground) / <alpha-value>)",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
                "fade-in": {
                    from: { opacity: "0", transform: "translateY(10px)" },
                    to: { opacity: "1", transform: "translateY(0)" },
                },
                "slide-in-right": {
                    from: { transform: "translateX(100%)" },
                    to: { transform: "translateX(0)" },
                },
                shimmer: {
                    "0%": { backgroundPosition: "-200% 0" },
                    "100%": { backgroundPosition: "200% 0" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                "fade-in": "fade-in 0.5s ease-out forwards",
                "slide-in-right": "slide-in-right 0.3s ease-out",
                shimmer: "shimmer 2s infinite linear",
            },
            backgroundImage: {
                "brass-gradient": "linear-gradient(135deg, #D4AF37 0%, #F0DEAA 50%, #D4AF37 100%)",
                "navy-gradient": "linear-gradient(180deg, #102A43 0%, #243B53 100%)",
                "cream-gradient": "linear-gradient(180deg, #FBF9F4 0%, #F5F0E6 100%)",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};
export default config;
