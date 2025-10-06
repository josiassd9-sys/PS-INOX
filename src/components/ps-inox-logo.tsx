
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
        {/* Gradients for the triangle to simulate 3D bevels */}
        <linearGradient id="tri-top-grad" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#B0B0B0" />
        </linearGradient>
        <linearGradient id="tri-left-grad" x1="0" y1="0.5" x2="1" y2="0.5">
          <stop offset="0%" stopColor="#A0A0A0" />
          <stop offset="100%" stopColor="#707070" />
        </linearGradient>
        <linearGradient id="tri-right-grad" x1="0" y1="0.5" x2="1" y2="0.5">
          <stop offset="0%" stopColor="#888888" />
          <stop offset="100%" stopColor="#E0E0E0" />
        </linearGradient>

        {/* Gradient for the shine effect */}
        <linearGradient id="shineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(var(--primary-foreground))" stopOpacity="0" />
          <stop offset="50%" stopColor="hsl(var(--primary-foreground))" stopOpacity="0.8" />
          <stop offset="100%" stopColor="hsl(var(--primary-foreground))" stopOpacity="0" />
        </linearGradient>
        
        {/* Mask for the entire logo */}
        <mask id="fullLogoMask">
            <g fill="white">
                <path d="M 5 65 L 35 10 L 65 65 Z" />
                <text x="80" y="58" fontFamily="var(--font-headline), sans-serif" fontSize="50" fontWeight="bold">PS INOX</text>
            </g>
        </mask>
      </defs>

      {/* Shadow layer for 3D effect */}
      <g filter="url(#dropshadow)">
        <motion.g variants={itemVariants}>
            <path d="M 5 65 L 35 10 L 65 65 Z" fill="hsl(var(--primary) / 0.4)" transform="translate(2 2)"/>
            <text x="82" y="60" fontFamily="var(--font-headline), sans-serif" fontSize="50" fontWeight="bold" fill="hsl(var(--primary) / 0.4)">PS INOX</text>
        </motion.g>
      </g>
      
      {/* Beveled Triangle */}
      <motion.g variants={itemVariants}>
          <path d="M 35 10 L 65 65 L 56.5 65 L 35 25.5 Z" fill="url(#tri-right-grad)" />
          <path d="M 35 10 L 5 65 L 13.5 65 L 35 25.5 Z" fill="url(#tri-left-grad)" />
          <path d="M 13.5 65 L 56.5 65 L 35 65 Z" fill="url(#tri-top-grad)" transform="translate(0 0)"/> 
          <path d="M 5 65 L 65 65 L 35 10 Z" stroke="hsl(var(--primary) / 0.5)" strokeWidth="0.5" fill="none"/>
      </motion.g>

      {/* Main Text */}
      <motion.text
        x="80"
        y="58"
        fontFamily="var(--font-headline), sans-serif"
        fontSize="50"
        fontWeight="bold"
        fill="hsl(var(--primary))"
        variants={itemVariants}
      >
        PS INOX
      </motion.text>
      
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
