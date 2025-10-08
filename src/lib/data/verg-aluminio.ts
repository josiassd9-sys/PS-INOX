import type { SteelItem } from './types';
import { ALUMINUM_BAR_WEIGHT_CONSTANT } from './constants';

const newMaterialDiameters = [
    { inch: '1/2"', mm: 12.70 },
    { inch: '5/8"', mm: 15.88 },
    { inch: '3/4"', mm: 19.05 },
    { inch: '7/8"', mm: 22.22 },
    { inch: '1"', mm: 25.40 },
    { inch: '1.1/4"', mm: 31.75 },
    { inch: '1.1/2"', mm: 38.10 },
    { inch: '1.3/4"', mm: 44.45 },
    { inch: '2"', mm: 50.80 },
    { inch: '2.1/4"', mm: 57.15 },
    { inch: '2.1/2"', mm: 63.50 },
    { inch: '2.3/4"', mm: 69.85 },
    { inch: '3"', mm: 76.20 },
    { inch: '3.1/2"', mm: 88.90 },
    { inch: '4"', mm: 101.60 },
];

const generateAluminumRods = (): SteelItem[] => {
    return newMaterialDiameters.map(d => ({
        id: `aluminum-${d.inch.replace(/ /g, '')}`,
        description: `Verg. Alum. Liga 6351 T6 Red. ${d.inch} (${d.mm.toFixed(2)}mm)`,
        weight: Math.pow(d.mm, 2) * ALUMINUM_BAR_WEIGHT_CONSTANT,
        categoryName: 'Verg. Alumínio',
        unit: 'm'
    }));
};

export const aluminumRodsItems = generateAluminumRods();
