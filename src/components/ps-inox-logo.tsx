"use client";

import { motion } from "framer-motion";

export function PsInoxLogo() {
  return (
    <motion.svg
      width="300"
      height="180"
      viewBox="0 0 300 180"
      xmlns="http://www.w3.org/2000/svg"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.8 } }}
    >
      <defs>
        {/* Gradients for Triangle */}
        <linearGradient id="triangle-grad-top" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#f0f0f0" />
          <stop offset="50%" stopColor="#c0c0c0" />
          <stop offset="100%" stopColor="#a8a8a8" />
        </linearGradient>
        <linearGradient id="triangle-grad-left" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#888888" />
          <stop offset="50%" stopColor="#c0c0c0" />
          <stop offset="100%" stopColor="#a8a8a8" />
        </linearGradient>
        <linearGradient id="triangle-grad-right" x1="100%" y1="50%" x2="0%" y2="50%">
          <stop offset="0%" stopColor="#888888" />
          <stop offset="50%" stopColor="#c0c0c0" />
          <stop offset="100%" stopColor="#a8a8a8" />
        </linearGradient>

        {/* Gradients for Text */}
        <linearGradient id="text-grad-top" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#e0e0e0" />
          <stop offset="50%" stopColor="#b0b0b0" />
          <stop offset="100%" stopColor="#909090" />
        </linearGradient>
        <linearGradient id="text-grad-side" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#707070" />
          <stop offset="100%" stopColor="#404040" />
        </linearGradient>

        {/* Filters */}
        <filter id="soft-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="3" dy="5" stdDeviation="3" floodColor="#000000" floodOpacity="0.4" />
        </filter>
      </defs>

      {/* -- Triangle -- */}
      <g filter="url(#soft-shadow)">
        {/* Base Triangle - for metallic effect */}
        <polygon points="150,10 240,110 60,110" fill="url(#triangle-grad-top)" />

        {/* Inner hole */}
        <polygon points="150,40 210,100 90,100" fill="transparent" stroke="url(#triangle-grad-top)" strokeWidth="1"/>

        {/* Simulating bevel with paths */}
        <path d="M 150 10 L 60 110 L 90 100 L 150 40 Z" fill="url(#triangle-grad-left)" />
        <path d="M 150 10 L 240 110 L 210 100 L 150 40 Z" fill="url(#triangle-grad-right)" />
        <path d="M 60 110 L 240 110 L 210 100 L 90 100 Z" fill="url(#triangle-grad-top)" />

         {/* Inner hole cut out */}
        <polygon points="150,45 205,102.5 95,102.5" fill="var(--background)" className="dark:fill-[hsl(var(--sidebar-background))]" />
      </g>


      {/* -- Text "PS INOX" -- */}
      <g fontFamily="Teko, sans-serif" fontSize="50" fontWeight="700" textAnchor="middle">
        {/* 3D Extrusion Layer */}
        <text x="150" y="157" fill="url(#text-grad-side)">PS INOX</text>
        {/* Main Text Layer */}
        <text x="148" y="155" fill="url(#text-grad-top)" stroke="#ffffff" strokeWidth="0.5">PS INOX</text>
      </g>
    </motion.svg>
  );
}
