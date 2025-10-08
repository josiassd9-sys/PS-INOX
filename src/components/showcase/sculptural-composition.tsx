"use client"

import { motion } from "framer-motion"

const containerVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      staggerChildren: 0.2,
      duration: 0.5,
    },
  },
};

const itemVariants = (delay: number) => ({
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
      delay,
    },
  },
});

const MetalShape = ({
  className,
  initial,
  animate,
  transition,
}: {
  className: string;
  initial?: object;
  animate?: object;
  transition?: object;
}) => (
  <motion.div
    className={`absolute bg-gradient-to-br from-slate-300 via-slate-500 to-slate-600 ${className}`}
    initial={initial}
    animate={animate}
    transition={transition}
  />
);

export function SculpturalComposition() {
    return (
        <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-slate-900 p-4">
             <div className="absolute inset-0 bg-grid-slate-700/30 [mask-image:linear-gradient(to_bottom,white_20%,transparent_100%)]"></div>
            
            <motion.div 
                className="relative w-64 h-64"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Elemento 1: Barra Chata Vertical */}
                <motion.div
                    variants={itemVariants(0)}
                    className="absolute w-8 h-56 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md shadow-2xl"
                    style={{ 
                        background: "linear-gradient(135deg, #c0c0c0, #808080)",
                        transform: "rotate3d(1, -1, 0, 45deg)",
                    }}
                />

                {/* Elemento 2: Anel / Tubo */}
                <motion.div
                    variants={itemVariants(0.2)}
                    className="absolute w-48 h-48 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-2xl"
                    style={{
                        background: "radial-gradient(circle, transparent 70%, #a0a0a0 72%, #f0f0f0 75%, #808080 80%)",
                        transform: "rotate3d(1, 1, 0, 60deg) scale(0.9)",
                    }}
                />

                 {/* Elemento 3: Chapa flutuante */}
                <motion.div
                    variants={itemVariants(0.4)}
                    className="absolute w-32 h-48 top-12 left-6 rounded-lg shadow-2xl opacity-70"
                     style={{
                        background: "linear-gradient(-45deg, #d0d0d0, #909090)",
                        transform: "rotate3d(0.5, -1, 0.2, 50deg)",
                    }}
                />

                {/* Elemento 4: Pequeno Detalhe */}
                <motion.div
                    variants={itemVariants(0.6)}
                    className="absolute w-6 h-6 bottom-16 right-12 rounded-full shadow-2xl"
                     style={{
                        background: "radial-gradient(circle, #f0f0f0, #b0b0b0)",
                        transform: "translateZ(50px)",
                    }}
                />

            </motion.div>

            <div className="text-center z-10 mt-8">
                <h2 className="text-lg font-bold text-slate-100">Proposta 2: Composição Escultural 3D</h2>
                <p className="text-sm text-slate-400">Uma escultura digital abstrata representando os materiais.</p>
            </div>
        </div>
    )
}

// Helper for CSS grid pattern
const plugin = require('tailwindcss/plugin')
plugin(function({ matchUtilities, theme }: {matchUtilities: any, theme: any}) {
  matchUtilities(
    {
      'bg-grid': (value: any) => ({
        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='${value}'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
      }),
    },
    { values: theme('backgroundColor') }
  )
})
