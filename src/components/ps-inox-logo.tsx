"use client";

import { motion } from "framer-motion";

export function PsInoxLogo() {
  const svgVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const pathVariants = {
    hidden: {
      pathLength: 0,
      opacity: 0,
    },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: 1.2,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.svg
      width="240"
      height="60"
      viewBox="0 0 240 60"
      xmlns="http://www.w3.org/2000/svg"
      variants={svgVariants}
      initial="hidden"
      animate="visible"
      className="max-w-[200px] md:max-w-[240px]"
    >
      <defs>
        <linearGradient id="shine" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.5" />
          <stop offset="25%" stopColor="hsl(var(--primary-foreground))" stopOpacity="0.8" />
          <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.5" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.5" />
        </linearGradient>
      </defs>

      <g fill="hsl(var(--primary))" stroke="hsl(var(--primary))" strokeWidth="1.5">
        {/* P */}
        <motion.path d="M10 10 V 50 H 25 C 35 50, 35 30, 25 30 H 10" strokeLinecap="round" strokeLinejoin="round" fill="none" variants={pathVariants} />
        {/* S */}
        <motion.path d="M55 10 C 40 10, 40 30, 55 30 C 70 30, 70 50, 55 50" strokeLinecap="round" strokeLinejoin="round" fill="none" variants={pathVariants} />
      </g>
      
      <g fill="url(#shine)" fontFamily="var(--font-headline), sans-serif" fontSize="38" fontWeight="bold">
        <text x="85" y="45">INOX</text>
      </g>

       <motion.rect
        x="80"
        y="5"
        width="150"
        height="50"
        fill="transparent"
        stroke="url(#shine)"
        strokeWidth="2"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: [0, 0.5, 1, 0.5, 0] }}
        transition={{ duration: 2, ease: "easeInOut", delay: 1 }}
      />
    </motion.svg>
  );
}
