"use client"

import { motion } from "framer-motion"
import { Circle, Hexagon, Minus, RectangleHorizontal, Square } from "lucide-react"

const icons = [
  { icon: Circle, key: 'circle' },
  { icon: Square, key: 'square' },
  { icon: Hexagon, key: 'hexagon' },
  { icon: RectangleHorizontal, key: 'rect' },
  { icon: Minus, key: 'minus' },
];

const gridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { scale: 0.5, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 150,
      damping: 10
    },
  },
};

const metallicGradient = `
  <defs>
    <linearGradient id="metal-grad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#e0e0e0" />
      <stop offset="50%" stop-color="#c0c0c0" />
      <stop offset="100%" stop-color="#a0a0a0" />
    </linearGradient>
    <filter id="metal-sheen">
      <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
      <feOffset in="blur" dx="2" dy="2" result="offsetBlur" />
      <feSpecularLighting in="blur" surfaceScale="5" specularConstant=".75" specularExponent="20" lighting-color="#ffffff" result="specOut">
        <fePointLight x="-5000" y="-10000" z="20000" />
      </feSpecularLighting>
      <feComposite in="specOut" in2="SourceAlpha" operator="in" result="specOut" />
      <feComposite in="SourceGraphic" in2="specOut" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="litPaint" />
      <feMerge>
        <feMergeNode in="offsetBlur" />
        <feMergeNode in="litPaint" />
      </feMerge>
    </filter>
  </defs>
`;

export function MetallicMosaic() {
  const gridItems = Array.from({ length: 150 }).map((_, i) => {
    const Icon = icons[i % icons.length].icon;
    return (
      <motion.div
        key={i}
        className="aspect-square flex items-center justify-center bg-card/50"
        variants={itemVariants}
        whileHover={{ scale: 1.5, rotate: 10, zIndex: 10, backgroundColor: 'hsl(var(--primary) / 0.2)' }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <Icon 
          className="w-8 h-8 text-primary/70" 
          strokeWidth={1.5}
        />
      </motion.div>
    );
  });

  return (
    <div className="relative w-full h-auto py-16 flex flex-col items-center justify-center overflow-hidden bg-background">
      <svg width="0" height="0" className="absolute">
        <defs>
            <linearGradient id="showcase-metal-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#d0d0d0" />
                <stop offset="50%" stopColor="#c0c0c0" />
                <stop offset="100%" stopColor="#b0b0b0" />
            </linearGradient>
        </defs>
      </svg>
      <div className="text-center mb-8 z-10">
        <h2 className="text-2xl font-bold">Proposta 1: Mosaico Metálico Interativo</h2>
        <p className="text-muted-foreground">Um mosaico dinâmico com as formas dos produtos. Passe o mouse sobre os itens.</p>
      </div>
      <motion.div 
        className="grid grid-cols-15 w-full max-w-4xl"
        variants={gridVariants}
        initial="hidden"
        animate="visible"
      >
        {gridItems}
      </motion.div>
    </div>
  );
}

// Helper to make a 15-column grid possible in Tailwind
const cols = {
    '15': 'repeat(15, minmax(0, 1fr))'
}
if (typeof window !== 'undefined') {
    const tailwindConfig = require('../../../tailwind.config.ts').default;
    tailwindConfig.theme.extend.gridTemplateColumns = {
        ...tailwindConfig.theme.extend.gridTemplateColumns,
        ...cols
    }
}
