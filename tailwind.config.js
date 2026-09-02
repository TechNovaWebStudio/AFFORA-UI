/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#FFFFFF',
          primary: '#176B45',      // Leaf Green
          primaryHover: '#125436', // Deep Leaf Green
          secondary: '#2E8B57',    // Fresh Leaf Green
          dark: '#0B3323',         // Deep Forest Green
          darker: '#062016',       // Obsidian Green
          light: '#EFF8F2',        // Light Soft Green
          lightSage: '#E2EFE7',    // Soft Sage Green
          sage: '#84A98C',         // Sage Green Accent
          textMain: '#142019',     // Dark Charcoal Text
          textSub: '#5A6960',      // Muted Leaf Gray Text
          border: '#E0EAE4',       // Soft Leaf Border
          spiceGold: '#D4AF37',    // Spice Warm Accent
        }
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        sans: ['var(--font-sans)', 'sans-serif'],
      },
      boxShadow: {
        'glass-sm': '0 4px 20px 0 rgba(23, 107, 69, 0.05)',
        'glass': '0 8px 32px 0 rgba(11, 51, 35, 0.08)',
        'glass-lg': '0 12px 40px 0 rgba(23, 107, 69, 0.12)',
        'glass-glow': '0 0 25px 2px rgba(23, 107, 69, 0.25)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.02)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}

