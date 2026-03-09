import type {Config} from 'tailwindcss';

const plugin = require('tailwindcss/plugin')

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['Inter', 'sans-serif'],
        headline: ['"Teko"', 'sans-serif'],
        code: ['monospace'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        'accent-price': 'hsl(var(--accent-price))',
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
        'sheet-header': {
          bg: 'hsl(var(--sheet-header-bg))',
          fg: 'hsl(var(--sheet-header-fg))',
        },
        'sheet-table-header': {
            bg: 'hsl(var(--sheet-table-header-bg))',
            fg: 'hsl(var(--sheet-table-header-fg))',
        },
        'row-odd': {
            bg: 'hsl(var(--row-odd-bg))',
        },
        'row-even': {
            bg: 'hsl(var(--row-even-bg))',
        },
        'row-pmq': {
            bg: 'hsl(var(--row-pmq-bg))',
        },
        'text-item': {
            pink: 'hsl(var(--text-item-pink))',
        },
        'sheet-total': {
            bg: 'hsl(var(--sheet-total-bg))',
        },
        'sheet-total-price': {
            bg: 'hsl(var(--sheet-total-price-bg))',
            fg: 'hsl(var(--sheet-total-price-fg))',
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
to: {
            height: '0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
       gridTemplateColumns: {
        '11': 'repeat(11, minmax(0, 1fr))',
      }
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    plugin(function({ addUtilities }: { addUtilities: any }) {
      addUtilities({
        '.bg-sheet-header-bg': { backgroundColor: 'hsl(var(--sheet-header-bg))' },
        '.text-sheet-header-fg': { color: 'hsl(var(--sheet-header-fg))' },
        '.bg-sheet-table-header-bg': { backgroundColor: 'hsl(var(--sheet-table-header-bg))' },
        '.text-sheet-table-header-fg': { color: 'hsl(var(--sheet-table-header-fg))' },
        '.bg-row-odd-bg': { backgroundColor: 'hsl(var(--row-odd-bg))' },
        '.bg-row-even-bg': { backgroundColor: 'hsl(var(--row-even-bg))' },
        '.bg-row-pmq-bg': { backgroundColor: 'hsl(var(--row-pmq-bg))' },
        '.text-text-item-pink': { color: 'hsl(var(--text-item-pink))' },
        '.bg-sheet-total-bg': { backgroundColor: 'hsl(var(--sheet-total-bg))' },
        '.border-sheet-header-bg': { borderColor: 'hsl(var(--sheet-header-bg))' },
        '.bg-sheet-total-price-bg': { backgroundColor: 'hsl(var(--sheet-total-price-bg))' },
        '.text-sheet-total-price-fg': { color: 'hsl(var(--sheet-total-price-fg))' },
      })
    })
  ],
} satisfies Config;
