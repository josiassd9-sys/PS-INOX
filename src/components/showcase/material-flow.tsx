"use client"

import { motion } from "framer-motion"

const barVariants = {
    animate: (i: number) => ({
        x: ["-100%", "150%"],
        transition: {
            x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 5 + i * 2,
                ease: "linear",
                delay: i * 0.5,
            },
        },
    }),
};

const Shape = ({
    i,
    className,
}: {
    i: number
    className: string
}) => {
    return (
        <motion.div
            className={`absolute h-8 rounded-full ${className}`}
            style={{ 
                top: `${15 + i * 18}%`,
                background: "linear-gradient(90deg, #888, #ddd, #888)",
                boxShadow: "0 0 10px #fff, 0 0 15px #fff, 0 0 20px #fff"
            }}
            variants={barVariants}
            custom={i}
            animate="animate"
        />
    )
}

export function MaterialFlow() {
    return (
        <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-slate-900 p-4">
            <motion.div 
                className="absolute inset-0"
                style={{
                    backgroundImage: `repeating-linear-gradient(
                        -45deg,
                        hsl(var(--primary) / 0.1),
                        hsl(var(--primary) / 0.1) 1px,
                        transparent 1px,
                        transparent 40px
                    )`
                }}
                 initial={{ backgroundPosition: "0 0" }}
                 animate={{ backgroundPosition: "-200px -200px" }}
                 transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear",
                 }}
            />
            
            <div className="relative w-full h-64 overflow-hidden">
                <Shape i={0} className="w-48" />
                <Shape i={1} className="w-32" />
                <Shape i={2} className="w-64" />
                <Shape i={3} className="w-40" />
            </div>

            <div className="text-center z-10 mt-8">
                <h2 className="text-lg font-bold text-slate-100">Proposta 4: O Fluxo de Materiais</h2>
                <p className="text-sm text-slate-400">Uma animação contínua e fluida dos perfis metálicos.</p>
            </div>
        </div>
    )
}
