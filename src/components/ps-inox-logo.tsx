
"use client";

import { motion } from "framer-motion";

export function PsInoxLogo() {
  const svgVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };
  
  const shineVariants = {
    hidden: { x: "-150%" },
    visible: {
      x: "150%",
      transition: {
        duration: 1.5,
        ease: "easeInOut",
        delay: 1.2,
        repeat: Infinity,
        repeatDelay: 2.5,
      },
    },
  };

  return (
    <motion.svg
      width="280"
      height="80"
      viewBox="0 0 280 80"
      xmlns="http://www.w3.org/2000/svg"
      variants={svgVariants}
      initial="hidden"
      animate="visible"
      className="max-w-[280px] md:max-w-[320px]"
    >
      <defs>
        {/* Gradients for the static 3D/metallic effect */}
        <linearGradient id="triangleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--primary) / 0.7)" />
          <stop offset="50%" stopColor="hsl(var(--primary))" />
          <stop offset="100%" stopColor="hsl(var(--primary) / 0.5)" />
        </linearGradient>

        <linearGradient id="textGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--primary-foreground))" />
          <stop offset="50%" stopColor="hsl(var(--primary))" />
          <stop offset="100%" stopColor="hsl(var(--primary) / 0.8)" />
        </linearGradient>
        
        {/* Gradient for the animated shine effect */}
        <linearGradient id="shineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(var(--primary-foreground))" stopOpacity="0" />
          <stop offset="50%" stopColor="hsl(var(--primary-foreground))" stopOpacity="0.6" />
          <stop offset="100%" stopColor="hsl(var(--primary-foreground))" stopOpacity="0" />
        </linearGradient>
        
        {/* Mask for the entire logo (triangle + text) */}
        <mask id="fullLogoMask">
            <g fill="white">
                <polygon points="5,65 35,10 65,65" />
                <text x="75" y="58" fontFamily="var(--font-headline), sans-serif" fontSize="50" fontWeight="bold">PS INOX</text>
            </g>
        </mask>
      </defs>
      
      {/* Base layer for the static 3D/metallic logo */}
      <g>
        {/* Subtle shadow for 3D effect */}
        <motion.g variants={itemVariants} style={{ filter: "drop-shadow(2px 2px 2px rgba(0,0,0,0.2))" }}>
            <polygon points="5,65 35,10 65,65" fill="url(#triangleGradient)" />
            <text 
              x="75" y="58" 
              fontFamily="var(--font-headline), sans-serif" 
              fontSize="50" 
              fontWeight="bold" 
              fill="url(#textGradient)"
            >
              PS INOX
            </text>
        </motion.g>
      </g>
      
      {/* Animated Shine Effect applied to the whole logo */}
      <motion.rect
          x="-50%"
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
