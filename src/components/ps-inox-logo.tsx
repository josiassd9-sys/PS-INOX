
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
        
        {/* Soft glow for yellow shape */}
        <filter id="yellow-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="hsl(var(--accent-price))" floodOpacity="0.3" />
        </filter>

        {/* 3D Effect Filter for metal text */}
        <filter id="metal-3d" x="-20%" y="-20%" width="140%" height="140%">
          {/* Shadow */}
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
          {/* Bevel Highlight */}
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
      </defs>

      {/* Main Yellow Shape */}
      <motion.g variants={itemVariants} filter="url(#yellow-glow)">
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

      {/* PS Text (Now Metal) */}
      <motion.g variants={itemVariants} filter="url(#metal-3d)">
        <path
          d="M 47.5 55 L 57.5 55 L 57.5 65 A 10 10 0 0 1 47.5 75 L 42.5 75 V 85 H 37.5 V 55 L 47.5 55 M 42.5 60 V 70 H 47.5 A 5 5 0 0 0 42.5 65 V 60 Z
             M 82.5 55 H 67.5 A 10 10 0 0 0 57.5 65 V 70 A 5 5 0 0 1 62.5 75 H 72.5 A 10 10 0 0 1 82.5 85 V 90 A 5 5 0 0 1 77.5 95 H 62.5 V 90 H 77.5 A 0 0 0 0 0 77.5 90 V 85 A 5 5 0 0 0 72.5 80 H 62.5 A 10 10 0 0 1 52.5 70 V 65 A 15 15 0 0 1 67.5 50 H 82.5 V 55 Z
            "
          fill="url(#dark-metal-grad)"
          stroke="#555"
          strokeWidth="0.5"
        />
      </motion.g>

      {/* INOX Text (Metal) */}
      <motion.g variants={itemVariants} transform="translate(0, 45)" filter="url(#metal-3d)">
        <path
          d="M 92.5 55 V 95 H 87.5 V 55 Z
             M 112.5 55 L 112.5 60 A 15 15 0 0 1 97.5 75 A 15 15 0 0 1 112.5 90 L 112.5 95 H 107.5 L 107.5 90 A 10 10 0 0 0 97.5 80 A 10 10 0 0 0 107.5 70 L 107.5 60 A 10 10 0 0 0 97.5 50 A 10 10 0 0 0 107.5 60 V 55 Z
             M 132.5 95 L 117.5 55 H 122.5 L 130 75 L 137.5 55 H 142.5 L 127.5 95 Z
             M 162.5 55 L 147.5 95 H 152.5 L 155 90 L 165 90 L 167.5 95 H 172.5 L 157.5 55 Z M 160 62.5 L 162.5 85 H 157.5 L 160 62.5 Z
            "
          fill="url(#dark-metal-grad)"
          stroke="#555"
          strokeWidth="0.5"
        />
      </motion.g>

    </motion.svg>
  );
}
