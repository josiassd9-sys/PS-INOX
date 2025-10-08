"use client"

import { motion } from "framer-motion"
import { Hexagon } from "lucide-react"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2,
    },
  },
};

const lineVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
        pathLength: 1,
        opacity: 1,
        transition: {
            duration: 1,
            ease: "easeInOut",
        },
    },
}

const itemVariants = {
  hidden: { y: 0, x: 0, opacity: 0, scale: 0.5 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: (i % 2 === 0 ? -1 : 1) * (i < 4 ? 60 : 0),
    x: (i === 0 || i === 2) ? -60 : (i === 1 || i === 3) ? 60 : 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  }),
};

const centralItemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            delay: 0.5,
            duration: 0.5,
        },
    },
}

export function ExplodedView() {
    const screwPositions = [
        { top: '1rem', left: '1rem' },
        { top: '1rem', right: '1rem' },
        { bottom: '1rem', left: '1rem' },
        { bottom: '1rem', right: '1rem' },
    ]

    return (
        <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-slate-100 dark:bg-slate-900 p-4">
             <div className="absolute inset-0 bg-grid-slate-300/[0.2] dark:bg-grid-slate-700/[0.2] [mask-image:linear-gradient(to_bottom,white_10%,transparent_90%)]"></div>

            <motion.div
                className="relative w-48 h-48"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Central Tube */}
                 <motion.div
                    variants={centralItemVariants}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-40 rounded-lg shadow-inner"
                     style={{
                        background: "linear-gradient(to right, #b0b0b0, #f0f0f0, #b0b0b0)",
                        transformStyle: "preserve-3d",
                        transform: "rotateY(20deg) rotateX(10deg)"
                    }}
                >
                     <div className="absolute inset-x-0 top-0 h-4 bg-black/20 rounded-t-lg"/>
                     <div className="absolute inset-x-0 bottom-0 h-4 bg-black/20 rounded-b-lg"/>
                </motion.div>


                {/* Flange */}
                <motion.div
                    variants={centralItemVariants}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border-[1.5rem] border-slate-400 dark:border-slate-600 shadow-lg"
                     style={{
                        background: "linear-gradient(135deg, #d0d0d0, #a0a0a0)",
                        transform: "translateZ(-80px) rotateY(60deg) rotateX(20deg)"
                    }}
                />

                {/* Screws and lines */}
                {screwPositions.map((pos, i) => (
                     <motion.div
                        key={i}
                        className="absolute"
                        style={{ ...pos }}
                        variants={itemVariants}
                        custom={i}
                    >
                         <div className="relative w-8 h-8 flex items-center justify-center">
                            <Hexagon className="w-8 h-8 text-slate-500 dark:text-slate-400 fill-current" />
                            <div className="absolute w-4 h-4 rounded-full border-2 border-slate-700 dark:border-slate-200" />
                         </div>
                    </motion.div>
                ))}

                {/* Dashed Lines */}
                 <svg className="absolute inset-0 w-full h-full overflow-visible"
                      style={{
                          transform: "translateZ(10px) rotateY(60deg) rotateX(20deg) scale(0.9)",
                          opacity: 0.7
                      }}
                 >
                     <motion.line x1="28%" y1="28%" x2="40%" y2="40%" stroke="hsl(var(--muted-foreground))" strokeWidth="1" strokeDasharray="4 2" variants={lineVariants} />
                     <motion.line x1="72%" y1="28%" x2="60%" y2="40%" stroke="hsl(var(--muted-foreground))" strokeWidth="1" strokeDasharray="4 2" variants={lineVariants} />
                     <motion.line x1="28%" y1="72%" x2="40%" y2="60%" stroke="hsl(var(--muted-foreground))" strokeWidth="1" strokeDasharray="4 2" variants={lineVariants} />
                     <motion.line x1="72%" y1="72%" x2="60%" y2="60%" stroke="hsl(var(--muted-foreground))" strokeWidth="1" strokeDasharray="4 2" variants={lineVariants} />
                 </svg>

            </motion.div>

            <div className="text-center z-10 mt-8">
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Proposta 3: A "Explosão" Técnica</h2>
                <p className="text-sm text-muted-foreground">Uma vista explodida inspirada em desenhos técnicos.</p>
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