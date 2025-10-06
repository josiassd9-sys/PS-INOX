
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
      height="100"
      viewBox="0 0 320 100"
      xmlns="http://www.w3.org/2000/svg"
      variants={svgVariants}
      initial="hidden"
      animate="visible"
      className="max-w-[320px] w-full"
    >
      <defs>
        {/* Yellow Gradient for PS */}
        <linearGradient id="ps-yellow-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--accent-price))" />
          <stop offset="100%" stopColor="hsl(var(--accent-price) / 0.8)" />
        </linearGradient>
        
        {/* Metal Gradient for INOX */}
        <linearGradient id="inox-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#d1d1d1" />
          <stop offset="50%" stopColor="#a8a8a8" />
          <stop offset="100%" stopColor="#8c8c8c" />
        </linearGradient>

        {/* 3D Effect Filter */}
        <filter id="metal-3d" x="-20%" y="-20%" width="140%" height="140%">
          {/* Extrusion */}
          <feOffset result="offset" in="SourceAlpha" dx="1.5" dy="1.5" />
          <feGaussianBlur result="blur" in="offset" stdDeviation="1.5" />
          <feColorMatrix
            result="shadow-color"
            in="blur"
            type="matrix"
            values="0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0.5 0"
          />
          {/* Bevel Highlight */}
          <feMorphology operator="dilate" radius="0.5" in="SourceAlpha" result="thickened" />
          <feOffset in="thickened" dx="-1" dy="-1" result="highlight-offset"/>
          <feComposite in="highlight-offset" in2="SourceAlpha" operator="out" result="highlight-edge"/>
          <feFlood floodColor="white" floodOpacity="0.4" result="highlight-color" />
          <feComposite in="highlight-color" in2="highlight-edge" operator="in" result="bevel-highlight"/>
          
          <feMerge>
            <feMergeNode in="shadow-color" />
            <feMergeNode in="bevel-highlight"/>
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* --- PS Logo (Yellow) --- */}
      <motion.g variants={itemVariants} filter="url(#metal-3d)">
        <g transform="translate(10, 20)">
            {/* P */}
            <path d="M 0 0 H 22 A 13 13 0 0 1 22 26 H 15 V 55 H 0 V 0 Z M 5 5 V 21 H 22 A 8 8 0 0 0 22 5 H 5 Z" fill="url(#ps-yellow-grad)" stroke="#ffffff" strokeWidth="0.5" />
            {/* S */}
            <path d="M 68 0 H 42 A 10 10 0 0 0 32 10 V 18 A 8 8 0 0 1 40 26 H 60 A 10 10 0 0 1 70 36 V 45 A 10 10 0 0 1 60 55 H 35 V 50 H 60 A 5 5 0 0 0 65 45 V 36 A 15 15 0 0 0 50 21 H 40 A 13 13 0 0 0 27 8 V 10 A 5 5 0 0 1 32 5 H 68 V 0 Z" fill="url(#ps-yellow-grad)" stroke="#ffffff" strokeWidth="0.5" />
        </g>
      </motion.g>

      {/* --- INOX Logo (Metallic) --- */}
      <motion.g variants={itemVariants} filter="url(#metal-3d)">
        <g transform="translate(100, 20)">
            {/* I */}
            <path d="M 0 0 H 35 V 5 H 20 V 50 H 35 V 55 H 0 V 50 H 15 V 5 H 0 V 0 Z" fill="url(#inox-grad)" />
            {/* N */}
            <path d="M 45 0 V 55 H 50 V 30 L 70 55 H 80 L 55 22 V 0 H 45 Z M 75 0 V 55 H 80 V 0 H 75 Z" fill="url(#inox-grad)" />
            {/* O */}
            <path d="M 90 27.5 A 27.5 27.5 0 0 1 117.5 55 A 27.5 27.5 0 0 1 90 27.5 Z M 95 27.5 A 22.5 22.5 0 1 0 117.5 50 A 22.5 22.5 0 0 0 95 27.5 Z" transform="translate(0,0) scale(1, 1)" fill="url(#inox-grad)" />
            {/* X */}
            <path d="M 135 0 L 152.5 27.5 L 170 0 H 175 L 155 32 L 175 55 H 170 L 152.5 32 L 135 55 H 130 L 150 27.5 L 130 0 H 135 Z" fill="url(#inox-grad)" />
        </g>
      </motion.g>

    </motion.svg>
  );
}
