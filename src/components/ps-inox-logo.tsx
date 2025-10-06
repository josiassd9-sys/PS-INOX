
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

  return (
    <motion.svg
      width="320"
      height="280"
      viewBox="0 0 180 160"
      xmlns="http://www.w3.org/2000/svg"
      variants={svgVariants}
      initial="hidden"
      animate="visible"
      className="max-w-[320px] w-full"
    >
      <defs>
        {/* Yellow Gradient for the main shape */}
        <linearGradient id="main-yellow-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--accent-price))" />
          <stop offset="100%" stopColor="hsl(var(--accent-price) / 0.8)" />
        </linearGradient>

        {/* Dark Metal Gradient for PS INOX */}
        <linearGradient id="dark-metal-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#444" />
          <stop offset="50%" stopColor="#222" />
          <stop offset="100%" stopColor="#111" />
        </linearGradient>

        {/* 3D Effect Filter */}
        <filter id="metal-3d" x="-20%" y="-20%" width="140%" height="140%">
          <feOffset result="offset" in="SourceAlpha" dx="1" dy="1" />
          <feGaussianBlur result="blur" in="offset" stdDeviation="1" />
          <feColorMatrix
            result="shadow-color"
            in="blur"
            type="matrix"
            values="0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0.4 0"
          />
          <feMorphology operator="dilate" radius="0.5" in="SourceAlpha" result="thickened" />
          <feOffset in="thickened" dx="-0.5" dy="-0.5" result="highlight-offset"/>
          <feComposite in="highlight-offset" in2="SourceAlpha" operator="out" result="highlight-edge"/>
          <feFlood floodColor="white" floodOpacity="0.3" result="highlight-color" />
          <feComposite in="highlight-color" in2="highlight-edge" operator="in" result="bevel-highlight"/>
          
          <feMerge>
            <feMergeNode in="shadow-color" />
            <feMergeNode in="bevel-highlight"/>
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        
        {/* Soft Drop Shadow for the whole logo */}
         <filter id="soft-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="hsl(var(--accent-price))" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Main Yellow Shape */}
      <motion.g variants={itemVariants} filter="url(#soft-glow)">
        <path 
          d="M 40 10 L 140 10 L 170 30 L 10 30 Z 
             M 175 35 L 145 150 L 35 150 L 5 35 Z
             M 45 45 L 135 45 L 125 140 L 55 140 Z
            "
          fill="url(#main-yellow-grad)"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="0.5"
        />
      </motion.g>

      {/* PS INOX Text Block */}
      <motion.g variants={itemVariants} transform="translate(48, 55)" filter="url(#metal-3d)">
        {/* PS */}
        <path 
          d="M 0 0 H 22 A 8 8 0 0 1 22 16 H 5 V 35 H 0 V 0 Z M 5 5 V 11 H 22 A 3 3 0 0 0 22 5 H 5 Z
             M 48 0 H 28 A 8 8 0 0 0 20 8 V 13 A 8 8 0 0 1 28 21 H 43 A 8 8 0 0 1 51 29 V 32 A 8 8 0 0 1 43 40 H 23 V 35 H 43 A 3 3 0 0 0 46 32 V 29 A 13 13 0 0 0 33 16 H 28 A 13 13 0 0 0 15 3 V 5 A 3 3 0 0 1 20 2 H 48 V 0 Z
            "
          fill="url(#dark-metal-grad)"
          stroke="#555"
          strokeWidth="0.5"
        />

        {/* INOX */}
        <text x="13" y="65" fontFamily="Teko, sans-serif" fontSize="28" fill="url(#dark-metal-grad)" fontWeight="bold" letterSpacing="1" stroke="#555" strokeWidth="0.3">
          INOX
        </text>
      </motion.g>

    </motion.svg>
  );
}
