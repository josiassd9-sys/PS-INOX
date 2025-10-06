
"use client";

import { motion } from "framer-motion";

export function PsInoxLogo() {
  const svgVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };
  
  const shineVariants = {
    hidden: { x: "-200%" },
    visible: {
      x: "200%",
      transition: {
        duration: 2.5,
        ease: "easeInOut",
        delay: 1.5,
        repeat: Infinity,
        repeatDelay: 3,
      },
    },
  };

  return (
    <motion.svg
      width="280"
      height="70"
      viewBox="0 0 280 70"
      xmlns="http://www.w3.org/2000/svg"
      variants={svgVariants}
      initial="hidden"
      animate="visible"
      className="max-w-[280px] md:max-w-[320px]"
    >
      <defs>
        {/* Gradient for the shine effect */}
        <linearGradient id="shineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(var(--primary-foreground))" stopOpacity="0" />
          <stop offset="50%" stopColor="hsl(var(--primary-foreground))" stopOpacity="0.8" />
          <stop offset="100%" stopColor="hsl(var(--primary-foreground))" stopOpacity="0" />
        </linearGradient>
        
        {/* Mask for the entire logo (triangle + text) */}
        <mask id="fullLogoMask">
            <g fill="white">
                <path d="M 5 65 L 35 10 L 65 65 Z" />
                <text x="80" y="58" fontFamily="var(--font-headline), sans-serif" fontSize="50" fontWeight="bold">PS INOX</text>
            </g>
        </mask>
      </defs>
      
      {/* Base layer for the logo (solid color) */}
      <motion.g variants={itemVariants} fill="hsl(var(--primary))">
          <path d="M 5 65 L 35 10 L 65 65 Z" />
          <text
            x="80"
            y="58"
            fontFamily="var(--font-headline), sans-serif"
            fontSize="50"
            fontWeight="bold"
          >
            PS INOX
          </text>
      </motion.g>
      
       {/* Animated Shine Effect applied to the whole logo */}
       <motion.rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="url(#shineGradient)"
          mask="url(#fullLogoMask)"
          variants={shineVariants}
        />
    </motion.svg>
  );
}

