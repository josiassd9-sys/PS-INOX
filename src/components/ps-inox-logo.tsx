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

  const textVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: 0.2,
        ease: "easeOut",
      },
    },
  };

  const shineVariants = {
    hidden: { x: "-50%" },
    visible: {
      x: "50%",
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
      width="20"
      height="70"
      viewBox="0 0 20 70"
      xmlns="http://www.w3.org/2000/svg"
      variants={svgVariants}
      initial="hidden"
      animate="visible"
      className="max-w-[240px] md:max-w-[280px]"
    >
      <defs>
        <linearGradient id="shineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
          <stop offset="50%" stopColor="hsl(var(--primary-foreground))" stopOpacity="0.9" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
        </linearGradient>

        <linearGradient id="metallicGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary) / 0.9)" />
            <stop offset="50%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--primary) / 0.8)" />
        </linearGradient>

        <mask id="logoMask">
            <g fontFamily="var(--font-headline), sans-serif" fontSize="58" fontWeight="bold" fill="white">
                <motion.text x="8" y="60" variants={textVariants}>PS</motion.text>
                <motion.text x="85" y="60" variants={textVariants}>-INOX</motion.text>
            </g>
        </mask>
      </defs>

      {/* 3D Extrusion Effect */}
      <g fontFamily="var(--font-headline), sans-serif" fontSize="61" fontWeight="bold" fill="hsl(var(--primary) / 0.4)">
          <motion.text x="2" y="62" variants={textVariants}>PS</motion.text>
          <motion.text x="87" y="62" variants={textVariants}>-INOX</motion.text>
      </g>

      {/* Base Logo with Metallic Gradient */}
      <g fill="url(#metallicGradient)" mask="url(#logoMask)">
          <motion.rect x="0" y="0" width="100%" height="100%" />
      </g>
      
      {/* Animated Shine Effect */}
      <motion.rect
        x="0"
        y="0"
        width="100%"
        height="100%"
        fill="url(#shineGradient)"
        mask="url(#logoMask)"
        variants={shineVariants}
      />
    </motion.svg>
  );
}
