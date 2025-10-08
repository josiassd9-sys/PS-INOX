"use client"

import { motion } from "framer-motion"
import { Icon } from "@/components/icons"
import { CATEGORY_GROUPS } from "@/lib/data"

const mainIcons = CATEGORY_GROUPS.flatMap(g => g.items)
  .filter(c => ['tubos-od', 'metalon-quadrado', 'barras-chatas', 'chapas', 'conexoes', 'cantoneiras'].includes(c.id))
  .map(c => ({ name: c.name, icon: c.icon as any}));

const otherIcons = CATEGORY_GROUPS.flatMap(g => g.items)
    .filter(c => ['retalhos', 'package-checker', 'balanca', 'tabela-sucata'].includes(c.id))
    .map(c => ({ name: c.name, icon: c.icon as any}));

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 }
  },
};

export function BlueprintMinimalist() {
    return (
        <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-slate-800 p-4">
            <div className="absolute inset-0 bg-grid-slate-700/[0.4] [mask-image:linear-gradient(to_bottom,white_10%,transparent_90%)]"></div>

            <motion.div
                className="w-full max-w-xs text-center"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div variants={itemVariants} className="mb-8">
                     <h2 className="text-lg font-bold text-slate-100">Proposta 5: A Planta Baixa Minimalista</h2>
                    <p className="text-sm text-slate-400">Uma abordagem limpa inspirada em "blueprints", com ícones organizados.</p>
                </motion.div>

                <motion.div variants={itemVariants} className="mb-4">
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Materiais</p>
                </motion.div>
                <motion.div variants={containerVariants} className="grid grid-cols-3 gap-4 mb-8">
                    {mainIcons.map((item) => (
                         <motion.div
                            key={item.name}
                            variants={itemVariants}
                            whileHover={{ scale: 1.1, backgroundColor: 'hsla(220, 14%, 96%, 0.1)', rotate: 5 }}
                            className="flex flex-col items-center justify-center gap-2 p-2 rounded-lg cursor-pointer"
                         >
                            <Icon name={item.icon} className="w-8 h-8 text-slate-300" />
                            <span className="text-xs text-slate-400">{item.name}</span>
                         </motion.div>
                    ))}
                </motion.div>

                <motion.div variants={itemVariants} className="mb-4">
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Ferramentas</p>
                </motion.div>
                 <motion.div variants={containerVariants} className="grid grid-cols-4 gap-2">
                     {otherIcons.map((item) => (
                         <motion.div
                            key={item.name}
                            variants={itemVariants}
                            whileHover={{ scale: 1.1, backgroundColor: 'hsla(220, 14%, 96%, 0.1)', rotate: -5 }}
                            className="flex flex-col items-center justify-center gap-1 p-1 rounded-lg cursor-pointer"
                         >
                            <Icon name={item.icon} className="w-6 h-6 text-slate-300" />
                            <span className="text-[10px] text-slate-400 text-center leading-tight">{item.name}</span>
                         </motion.div>
                    ))}
                </motion.div>
            </motion.div>
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
