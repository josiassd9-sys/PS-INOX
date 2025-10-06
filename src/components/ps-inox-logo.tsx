
"use client";

import { motion } from "framer-motion";

export function PsInoxLogo() {
  const gradientId = "shine-grad";

  return (
    <motion.svg
      width="300"
      height="180"
      viewBox="0 0 300 180"
      xmlns="http://www.w3.org/2000/svg"
      initial="initial"
      animate="animate"
    >
      <defs>
        {/* Filtro para a sombra projetada */}
        <filter id="soft-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="4" dy="6" stdDeviation="4" floodColor="#000000" floodOpacity="0.3" />
        </filter>

        {/* Gradiente do Metal Base (Face Superior) */}
        <linearGradient id="metal-face-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#d0d0d0" />
          <stop offset="50%" stopColor="#c0c0c0" />
          <stop offset="100%" stopColor="#b0b0b0" />
        </linearGradient>

        {/* Cor da Extrusão 3D */}
        <linearGradient id="metal-side-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#666666" />
          <stop offset="100%" stopColor="#444444" />
        </linearGradient>
        
        {/* O gradiente que será animado para o efeito de brilho */}
        <linearGradient id={gradientId} x1="-1" y1="0" x2="0" y2="0">
            <stop offset="0%" stopColor="#888" />
            <stop offset="45%" stopColor="#888" />
            <stop offset="50%" stopColor="white" />
            <stop offset="55%" stopColor="#888" />
            <stop offset="100%" stopColor="#888" />
        </linearGradient>

      </defs>
      
      {/* Grupo principal do Logo com a sombra */}
      <g filter="url(#soft-shadow)">

        {/* --- Triângulo --- */}
        <g>
          {/* Lado Esquerdo 3D */}
          <path d="M 105 10 L 110 10 L 40 100 L 35 100 Z" fill="url(#metal-side-grad)" />
          {/* Lado Direito 3D */}
          <path d="M 195 10 L 190 10 L 260 100 L 265 100 Z" fill="url(#metal-side-grad)" />
          {/* Base 3D */}
          <path d="M 40 100 L 260 100 L 255 105 L 45 105 Z" fill="url(#metal-side-grad)" />
          {/* Face Superior do Triângulo */}
          <motion.polygon 
            points="110,10 190,10 260,100 40,100" 
            fill={`url(#${gradientId})`}
            stroke="#ffffff"
            strokeWidth="0.5"
          >
            <animate 
                attributeName="x1"
                from="-1"
                to="1"
                dur="3s"
                repeatCount="indefinite"
            />
             <animate 
                attributeName="x2"
                from="0"
                to="2"
                dur="3s"
                repeatCount="indefinite"
            />
          </motion.polygon>
          
          {/* Buraco do Triângulo */}
          <polygon points="120,25 180,25 235,90 65,90" fill="var(--background)" className="dark:fill-[hsl(var(--sidebar-background))]" />
        </g>

        {/* --- Texto PS INOX --- */}
        <g fontFamily="Teko, sans-serif" fontSize="50" fontWeight="700" textAnchor="middle">
          {/* Extrusão 3D do Texto */}
          <text x="151" y="147" fill="url(#metal-side-grad)">PS INOX</text>
          
          {/* Face Superior do Texto com animação */}
          <motion.text x="150" y="145" fill={`url(#${gradientId})`} stroke="#ffffff" strokeWidth="0.5">
            PS INOX
            <animate 
                attributeName="x1"
                from="-1"
                to="1"
                dur="3s"
                repeatCount="indefinite"
            />
             <animate 
                attributeName="x2"
                from="0"
                to="2"
                dur="3s"
                repeatCount="indefinite"
            />
          </motion.text>
        </g>
      </g>
    </motion.svg>
  );
}
