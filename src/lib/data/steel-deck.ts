
import type { SteelDeck } from './types';

export const steelDeckData: SteelDeck[] = [
    { 
        nome: "MD57 - Chapa 0.80mm", 
        tipo: 'MD57',
        espessuraChapa: 0.80, 
        pesoProprio: 9.96, 
        vaosMaximos: {
            simples: { '150kgf': 2.70, '250kgf': 2.45, '400kgf': 2.15 },
            duplo: { '150kgf': 3.50, '250kgf': 3.20, '400kgf': 2.80 }
        }
    },
    { 
        nome: "MD57 - Chapa 0.95mm", 
        tipo: 'MD57',
        espessuraChapa: 0.95, 
        pesoProprio: 11.81, 
        vaosMaximos: {
            simples: { '150kgf': 2.90, '250kgf': 2.60, '400kgf': 2.30 },
            duplo: { '150kgf': 3.75, '250kgf': 3.40, '400kgf': 2.95 }
        }
    },
    { 
        nome: "MD57 - Chapa 1.25mm", 
        tipo: 'MD57',
        espessuraChapa: 1.25, 
        pesoProprio: 15.54, 
        vaosMaximos: {
            simples: { '150kgf': 3.20, '250kgf': 2.90, '400kgf': 2.55 },
            duplo: { '150kgf': 4.15, '250kgf': 3.75, '400kgf': 3.30 }
        }
    },
    { 
        nome: "MD75 - Chapa 0.80mm", 
        tipo: 'MD75',
        espessuraChapa: 0.80, 
        pesoProprio: 10.66, 
        vaosMaximos: {
            simples: { '150kgf': 3.25, '250kgf': 2.95, '400kgf': 2.60 },
            duplo: { '150kgf': 4.25, '250kgf': 3.85, '400kgf': 3.35 }
        }
    },
    { 
        nome: "MD75 - Chapa 0.95mm", 
        tipo: 'MD75',
        espessuraChapa: 0.95, 
        pesoProprio: 12.64, 
        vaosMaximos: {
            simples: { '150kgf': 3.45, '250kgf': 3.15, '400kgf': 2.75 },
            duplo: { '150kgf': 4.50, '250kgf': 4.05, '400kgf': 3.55 }
        }
    },
    { 
        nome: "MD75 - Chapa 1.25mm", 
        tipo: 'MD75',
        espessuraChapa: 1.25, 
        pesoProprio: 16.63, 
        vaosMaximos: {
            simples: { '150kgf': 3.80, '250kgf': 3.45, '400kgf': 3.00 },
            duplo: { '150kgf': 4.95, '250kgf': 4.45, '400kgf': 3.90 }
        }
    },
];
