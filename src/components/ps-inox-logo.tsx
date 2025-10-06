"use client";

import { motion } from "framer-motion";

export function PsInoxLogo() {
  const svgVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
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
      height="80"
      viewBox="0 0 320 80"
      xmlns="http://www.w3.org/2000/svg"
      variants={svgVariants}
      initial="hidden"
      animate="visible"
      className="max-w-[320px] w-full"
    >
      <defs>
        {/* Gradients and Filters for "INOX" metallic effect */}
        <linearGradient id="inox-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#d1d1d1" />
          <stop offset="50%" stopColor="#a8a8a8" />
          <stop offset="100%" stopColor="#8c8c8c" />
        </linearGradient>
        <filter id="inox-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="3" dy="3" stdDeviation="2" floodColor="#000000" floodOpacity="0.5" />
        </filter>
        <filter id="inox-extrude">
          <feOffset result="offOut" in="SourceGraphic" dx="1.5" dy="1.5" />
          <feComponentTransfer in="offOut" result="alphaOut">
            <feFuncA type="linear" slope="0.4" />
          </feComponentTransfer>
          <feGaussianBlur in="alphaOut" stdDeviation="1" result="blurOut" />
          <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
        </filter>

        {/* Gradient for "PS" Symbol */}
         <linearGradient id="ps-yellow-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--accent-price))" />
          <stop offset="100%" stopColor="hsl(var(--accent-price) / 0.7)" />
        </linearGradient>
      </defs>

      {/* PS Yellow Symbol */}
      <motion.g variants={itemVariants}>
         <text
          x="5"
          y="60"
          fontFamily="var(--font-headline), sans-serif"
          fontSize="65"
          fontWeight="700"
          fill="url(#ps-yellow-grad)"
          style={{ filter: "drop-shadow(1px 1px 1px rgba(0,0,0,0.4))" }}
        >
          PS
        </text>
      </motion.g>

      {/* INOX Metallic Text */}
      <motion.g variants={itemVariants} filter="url(#inox-shadow)">
        <text
          x="100"
          y="60"
          fontFamily="var(--font-headline), sans-serif"
          fontSize="65"
          fontWeight="700"
          fill="#333"
          transform="translate(1,1)"
        >
          INOX
        </text>
         <text
          x="100"
          y="60"
          fontFamily="var(--font-headline), sans-serif"
          fontSize="65"
          fontWeight="700"
          fill="#444"
          transform="translate(0.5,0.5)"
        >
          INOX
        </text>
        <text
          x="100"
          y="60"
          fontFamily="var(--font-headline), sans-serif"
          fontSize="65"
          fontWeight="700"
          fill="url(#inox-grad)"
          stroke="#ffffff"
          strokeWidth="0.5"
        >
          INOX
        </text>
      </motion.g>

    </motion.svg>
  );
}
