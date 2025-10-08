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
      staggerChildren: 0.02,
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

export function MetallicMosaic() {
  const gridItems = Array.from({ length: 24*11 }).map((_, i) => { // Aspect ratio approx 854/384 (~2.22), grid of 24x11 = 264
    const Icon = icons[i % icons.length].icon;
    return (
      <motion.div
        key={i}
        className="aspect-square flex items-center justify-center bg-card/50"
        variants={itemVariants}
        whileHover={{ scale: 1.8, rotate: 10, zIndex: 10, backgroundColor: 'hsl(var(--primary) / 0.2)' }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <Icon 
          className="w-3/4 h-3/4 text-primary/70" 
          strokeWidth={1.5}
        />
      </motion.div>
    );
  });

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-background p-4">
      <div className="text-center mb-4 z-10">
        <h2 className="text-lg font-bold">Proposta 1: Mosaico Metálico</h2>
        <p className="text-sm text-muted-foreground">Passe o mouse sobre os itens.</p>
      </div>
      <motion.div 
        className="grid grid-cols-11 w-full"
        variants={gridVariants}
        initial="hidden"
        animate="visible"
      >
        {gridItems}
      </motion.div>
    </div>
  );
}

// Helper for columns
if (typeof window !== 'undefined') {
    const tailwindConfig = require('../../../tailwind.config.ts').default;
    if (!tailwindConfig.theme.extend.gridTemplateColumns) {
        tailwindConfig.theme.extend.gridTemplateColumns = {};
    }
    tailwindConfig.theme.extend.gridTemplateColumns['11'] = 'repeat(11, minmax(0, 1fr))';
}
