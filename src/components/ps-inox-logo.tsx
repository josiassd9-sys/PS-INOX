
"use client";

import { motion } from "framer-motion";

export function PsInoxLogo() {
  return (
    <motion.svg
      width="300"
      height="80"
      viewBox="0 0 300 80"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Filtros para o efeito 3D metálico */}
        <filter id="metal-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="3" dy="5" stdDeviation="3" floodColor="#000000" floodOpacity="0.4" />
        </filter>

        <linearGradient id="metal-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#d0d0d0" />
          <stop offset="50%" stopColor="#c0c0c0" />
          <stop offset="100%" stopColor="#b0b0b0" />
        </linearGradient>

        <linearGradient id="metal-side-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#666666" />
          <stop offset="100%" stopColor="#444444" />
        </linearGradient>
        
        {/* Gradiente de Arco-íris */}
        <linearGradient id="rainbow-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ff0000" />
            <stop offset="17%" stopColor="#ff7f00" />
            <stop offset="33%" stopColor="#ffff00" />
            <stop offset="50%" stopColor="#00ff00" />
            <stop offset="67%" stopColor="#0000ff" />
            <stop offset="83%" stopColor="#4b0082" />
            <stop offset="100%" stopColor="#ee82ee" />
        </linearGradient>
      </defs>
      
      <g fontFamily="Teko, sans-serif" fontSize="50" fontWeight="700" textAnchor="middle" filter="url(#metal-shadow)">
        
        {/* --- Camada Base: Efeito Metálico 3D --- */}
        <g>
          {/* Extrusão 3D */}
          <text x="151" y="52" fill="url(#metal-side-grad)">PS INOX</text>
          {/* Face Superior Metálica */}
          <text x="150" y="50" fill="url(#metal-grad)" stroke="#ffffff" strokeWidth="0.5">
            PS INOX
          </text>
        </g>
        
        {/* --- Camada Superior: Efeito Arco-íris (Animada) --- */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0, 0] }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatDelay: 2,
            ease: "easeInOut",
            times: [0, 0.25, 0.75, 0.9, 1]
          }}
        >
          {/* Extrusão 3D (para manter a profundidade) */}
          <text x="151" y="52" fill="url(#metal-side-grad)">PS INOX</text>
           {/* Face Superior com gradiente de arco-íris */}
          <text x="150" y="50" fill="url(#rainbow-grad)" stroke="#ffffff" strokeWidth="0.5">
            PS INOX
          </text>
        </motion.g>

      </g>
    </motion.svg>
  );
}
