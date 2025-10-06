
"use client";

import { motion } from "framer-motion";

export function PsInoxLogo() {
  const shineVariants = {
    hidden: { x: "-100%" },
    visible: {
      x: "100%",
      transition: {
        duration: 2.5,
        ease: "easeInOut",
        delay: 1,
        repeat: Infinity,
        repeatDelay: 3,
      },
    },
  };

  return (
    <motion.svg
      width="300"
      height="120"
      viewBox="0 0 300 120"
      xmlns="http://www.w3.org/2000/svg"
      initial="hidden"
      animate="visible"
      className="max-w-[300px] w-full"
    >
      <defs>
        {/* Gradients for Yellow PS Icon */}
        <linearGradient id="ps-yellow-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--accent-price))" />
          <stop offset="100%" stopColor="hsl(var(--accent-price) / 0.8)" />
        </linearGradient>

        {/* Gradients and Filters for Metallic INOX Text */}
        <linearGradient id="metal-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#d1d1d1" />
          <stop offset="50%" stopColor="#a8a8a8" />
          <stop offset="100%" stopColor="#8c8c8c" />
        </linearGradient>

        <linearGradient id="metal-side-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#7a7a7a" />
          <stop offset="100%" stopColor="#4f4f4f" />
        </linearGradient>
        
        <filter id="metal-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="4" dy="6" stdDeviation="4" floodColor="#000000" floodOpacity="0.4" />
        </filter>

        {/* Shine Animation Definitions */}
        <linearGradient id="shine-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="40%" stopColor="rgba(255,255,255,0)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.4)" />
            <stop offset="60%" stopColor="rgba(255,255,255,0)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
        <mask id="text-mask">
            <text x="100" y="75" fontFamily="Teko, sans-serif" fontSize="80" fontWeight="700" fill="white">
                PS INOX
            </text>
        </mask>
      </defs>

      {/* Yellow PS Icon */}
      <motion.g 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1, transition: { delay: 0.2, duration: 0.5 } }}
      >
        <path 
          d="M 10 10 L 80 10 L 80 30 L 30 30 L 30 50 L 60 50 L 60 70 L 30 70 L 30 90 L 80 90 L 80 110 L 10 110 Z"
          fill="url(#ps-yellow-grad)"
          stroke="hsl(var(--accent-price) / 0.5)"
          strokeWidth="1"
        />
         <path 
          d="M 40 40 L 70 40 L 70 60 L 50 60 L 50 80 L 70 80 L 70 100 L 40 100 Z"
          fill="black"
        />
      </motion.g>

      {/* Metallic PS INOX Text */}
      <g filter="url(#metal-shadow)">
        {/* 3D Extrusion Layer */}
        <text x="102" y="77" fontFamily="Teko, sans-serif" fontSize="80" fontWeight="700" fill="url(#metal-side-grad)">
            PS INOX
        </text>
        {/* Main Text Layer */}
        <text x="100" y="75" fontFamily="Teko, sans-serif" fontSize="80" fontWeight="700" fill="url(#metal-grad)" stroke="#ffffff" strokeWidth="0.5">
            PS INOX
        </text>
      </g>

      {/* Shine Animation Layer */}
      <motion.rect
        x="100"
        y="0"
        width="200"
        height="120"
        fill="url(#shine-grad)"
        mask="url(#text-mask)"
        variants={shineVariants}
      />

    </motion.svg>
  );
}
