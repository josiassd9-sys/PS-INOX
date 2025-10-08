"use client"

import { motion } from "framer-motion"
import { Icon } from "@/components/icons"
import { CATEGORY_GROUPS } from "@/lib/data"

const mainIcons = CATEGORY_GROUPS.flatMap(g => g.items)
  .filter(c => ['tubos-od', 'metalon-quadrado', 'barras-chatas', 'chapas', 'conexoes', 'cantoneiras', 'tubos-schedule', 'metalon-retangular', 'barras-redondas', 'barra-quadrada', 'barra-sextavada', 'tubos-alianca'].includes(c.id))
  .map(c => {
      let icon = c.icon as any;
      if (c.id === 'tubos-alianca') {
          icon = 'AllianceRing';
      }
      return { name: c.name, icon };
  });
  
const otherMetalsIcons = CATEGORY_GROUPS.flatMap(g => g.items)
  .filter(c => ['tarugo-bronze', 'verg-aluminio', 'chapas-aluminio', 'verg-latao'].includes(c.id))
  .map(c => ({ name: c.name, icon: c.icon as any}));

const toolsIcons = CATEGORY_GROUPS.flatMap(g => g.items)
    .filter(c => ['retalhos', 'package-checker', 'balanca', 'tabela-sucata'].includes(c.id))
    .map(c => ({ name: c.name, icon: c.icon as any}));

const infoIcons = [
    ...CATEGORY_GROUPS.flatMap(g => g.items)
        .filter(c => ['normas-astm', 'processos-fabricacao', 'desenho-tecnico'].includes(c.id))
        .map(c => ({ name: c.name, icon: c.icon as any})),
    { name: 'Lista de Materiais', icon: 'ClipboardList' }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
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
        <div className="relative w-full h-full flex flex-col items-center justify-center overflow-auto bg-slate-800 p-1">
            <div className="absolute inset-0 bg-grid-slate-700/[0.4] [mask-image:linear-gradient(to_bottom,white_10%,transparent_90%)]"></div>

            <motion.div
                className="w-full max-w-xs text-center"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div variants={itemVariants} className="mb-2">
                     <h2 className="text-lg font-bold text-slate-100">PS INOX</h2>
                    <p className="text-sm text-slate-400">Calculadora de Preços</p>
                </motion.div>

                <motion.div variants={itemVariants} className="mb-1">
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Aço Inox</p>
                </motion.div>
                <motion.div variants={containerVariants} className="grid grid-cols-4 gap-1 mb-2">
                    {mainIcons.map((item) => (
                         <motion.div
                            key={item.name}
                            variants={itemVariants}
                            whileHover={{ scale: 1.1, backgroundColor: 'hsla(220, 14%, 96%, 0.1)', rotate: 5 }}
                            className="flex flex-col items-center justify-center gap-1 p-1 rounded-lg cursor-pointer aspect-square"
                         >
                            <Icon name={item.icon} className="w-6 h-6 text-slate-300" />
                            <span className="text-[10px] text-slate-400 text-center leading-tight">{item.name}</span>
                         </motion.div>
                    ))}
                </motion.div>

                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <motion.div variants={itemVariants} className="mb-1">
                            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Outros Metais</p>
                        </motion.div>
                         <motion.div variants={containerVariants} className="grid grid-cols-2 gap-1 mb-2">
                             {otherMetalsIcons.map((item) => (
                                 <motion.div
                                    key={item.name}
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.1, backgroundColor: 'hsla(220, 14%, 96%, 0.1)', rotate: -5 }}
                                    className="flex flex-col items-center justify-center gap-1 p-1 rounded-lg cursor-pointer aspect-square"
                                 >
                                    <Icon name={item.icon} className="w-5 h-5 text-slate-300" />
                                    <span className="text-[10px] text-slate-400 text-center leading-tight">{item.name}</span>
                                 </motion.div>
                            ))}
                        </motion.div>
                    </div>

                    <div>
                        <motion.div variants={itemVariants} className="mb-1">
                            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Ferramentas</p>
                        </motion.div>
                         <motion.div variants={containerVariants} className="grid grid-cols-2 gap-1 mb-2">
                             {toolsIcons.map((item) => (
                                 <motion.div
                                    key={item.name}
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.1, backgroundColor: 'hsla(220, 14%, 96%, 0.1)', rotate: -5 }}
                                    className="flex flex-col items-center justify-center gap-1 p-1 rounded-lg cursor-pointer aspect-square"
                                 >
                                    <Icon name={item.icon} className="w-5 h-5 text-slate-300" />
                                    <span className="text-[10px] text-slate-400 text-center leading-tight">{item.name}</span>
                                 </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>

                 <motion.div variants={itemVariants} className="mb-1">
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Informativos</p>
                </motion.div>
                 <motion.div variants={containerVariants} className="grid grid-cols-4 gap-1">
                     {infoIcons.map((item) => (
                         <motion.div
                            key={item.name}
                            variants={itemVariants}
                            whileHover={{ scale: 1.1, backgroundColor: 'hsla(220, 14%, 96%, 0.1)', rotate: -5 }}
                            className="flex flex-col items-center justify-center gap-1 p-1 rounded-lg cursor-pointer aspect-square"
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
