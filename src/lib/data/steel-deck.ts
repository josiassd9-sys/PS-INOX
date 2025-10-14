
export type SteelDeck = {
    nome: string;
    tipo: 'MD57' | 'MD75';
    espessuraChapa: number; // mm
    pesoProprio: number; // kg/m²
    vaosMaximos: {
        simples: { '150kgf': number, '250kgf': number, '400kgf': number };
        duplo: { '150kgf': number, '250kgf': number, '400kgf': number };
    };
};

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
];

    