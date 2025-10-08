
import type { SteelItem } from './types';
import { calculateFlatBarWeight } from './constants';

export const barrasChatasItems: SteelItem[] = [
        { id: 'bc-3/4-1/8', unit: 'm', description: 'Barra Chata 3/4" x 1/8" (19.05x3.17mm)', weight: calculateFlatBarWeight(19.05, 3.17), categoryName: 'barras-chatas' },
        { id: 'bc-3/4-3/16', unit: 'm', description: 'Barra Chata 3/4" x 3/16" (19.05x4.76mm)', weight: calculateFlatBarWeight(19.05, 4.76), categoryName: 'barras-chatas' },
        { id: 'bc-3/4-1/4', unit: 'm', description: 'Barra Chata 3/4" x 1/4" (19.05x6.35mm)', weight: calculateFlatBarWeight(19.05, 6.35), categoryName: 'barras-chatas' },
        { id: 'bc-1-1/8', unit: 'm', description: 'Barra Chata 1" x 1/8" (25.40x3.17mm)', weight: calculateFlatBarWeight(25.40, 3.17), categoryName: 'barras-chatas' },
        { id: 'bc-1-3/16', unit: 'm', description: 'Barra Chata 1" x 3/16" (25.40x4.76mm)', weight: calculateFlatBarWeight(25.40, 4.76), categoryName: 'barras-chatas' },
        { id: 'bc-1-1/4', unit: 'm', description: 'Barra Chata 1" x 1/4" (25.40x6.35mm)', weight: calculateFlatBarWeight(25.40, 6.35), categoryName: 'barras-chatas' },
        { id: 'bc-1-1/2', unit: 'm', description: 'Barra Chata 1" x 1/2" (25.40x12.70mm)', weight: calculateFlatBarWeight(25.40, 12.70), categoryName: 'barras-chatas' },
        { id: 'bc-1_1/4-1/8', unit: 'm', description: 'Barra Chata 1.1/4" x 1/8" (31.75x3.17mm)', weight: calculateFlatBarWeight(31.75, 3.17), categoryName: 'barras-chatas' },
        { id: 'bc-1_1/4-3/16', unit: 'm', description: 'Barra Chata 1.1/4" x 3/16" (31.75x4.76mm)', weight: calculateFlatBarWeight(31.75, 4.76), categoryName: 'barras-chatas' },
        { id: 'bc-1_1/4-1/4', unit: 'm', description: 'Barra Chata 1.1/4" x 1/4" (31.75x6.35mm)', weight: calculateFlatBarWeight(31.75, 6.35), categoryName: 'barras-chatas' },
        { id: 'bc-1_1/2-1/8', unit: 'm', description: 'Barra Chata 1.1/2" x 1/8" (38.10x3.17mm)', weight: calculateFlatBarWeight(38.10, 3.17), categoryName: 'barras-chatas' },
        { id: 'bc-1_1/2-3/16', unit: 'm', description: 'Barra Chata 1.1/2" x 3/16" (38.10x4.76mm)', weight: calculateFlatBarWeight(38.10, 4.76), categoryName: 'barras-chatas' },
        { id: 'bc-1_1/2-1/4', unit: 'm', description: 'Barra Chata 1.1/2" x 1/4" (38.10x6.35mm)', weight: calculateFlatBarWeight(38.10, 6.35), categoryName: 'barras-chatas' },
        { id: 'bc-2-1/8', unit: 'm', description: 'Barra Chata 2" x 1/8" (50.80x3.17mm)', weight: calculateFlatBarWeight(50.80, 3.17), categoryName: 'barras-chatas' },
        { id: 'bc-2-3/16', unit: 'm', description: 'Barra Chata 2" x 3/16" (50.80x4.76mm)', weight: calculateFlatBarWeight(50.80, 4.76), categoryName: 'barras-chatas' },
        { id: 'bc-2-1/4', unit: 'm', description: 'Barra Chata 2" x 1/4" (50.80x6.35mm)', weight: calculateFlatBarWeight(50.80, 6.35), categoryName: 'barras-chatas' },
        { id: 'bc-2-3/8', unit: 'm', description: 'Barra Chata 2" x 3/8" (50.80x9.52mm)', weight: calculateFlatBarWeight(50.80, 9.52), categoryName: 'barras-chatas' },
        { id: 'bc-2-1/2', unit: 'm', description: 'Barra Chata 2" x 1/2" (50.80x12.70mm)', weight: calculateFlatBarWeight(50.80, 12.70), categoryName: 'barras-chatas' },
        { id: 'bc-2-1', unit: 'm', description: 'Barra Chata 2" x 1" (50.80x25.40mm)', weight: calculateFlatBarWeight(50.80, 25.40), categoryName: 'barras-chatas' },
        { id: 'bc-2_1/2-1/4', unit: 'm', description: 'Barra Chata 2.1/2" x 1/4" (63.50x6.35mm)', weight: calculateFlatBarWeight(63.50, 6.35), categoryName: 'barras-chatas' },
        { id: 'bc-2_1/2-3/8', unit: 'm', description: 'Barra Chata 2.1/2" x 3/8" (63.50x9.52mm)', weight: calculateFlatBarWeight(63.50, 9.52), categoryName: 'barras-chatas' },
        { id: 'bc-2_1/2-1/2', unit: 'm', description: 'Barra Chata 2.1/2" x 1/2" (63.50x12.70mm)', weight: calculateFlatBarWeight(63.50, 12.70), categoryName: 'barras-chatas' },
        { id: 'bc-3-1/4', unit: 'm', description: 'Barra Chata 3" x 1/4" (76.20x6.35mm)', weight: calculateFlatBarWeight(76.20, 6.35), categoryName: 'barras-chatas' },
        { id: 'bc-3-3/8', unit: 'm', description: 'Barra Chata 3" x 3/8" (76.20x9.52mm)', weight: calculateFlatBarWeight(76.20, 9.52), categoryName: 'barras-chatas' },
        { id: 'bc-3-1/2', unit: 'm', description: 'Barra Chata 3" x 1/2" (76.20x12.70mm)', weight: calculateFlatBarWeight(76.20, 12.70), categoryName: 'barras-chatas' },
        { id: 'bc-4-1/4', unit: 'm', description: 'Barra Chata 4" x 1/4" (101.60x6.35mm)', weight: calculateFlatBarWeight(101.60, 6.35), categoryName: 'barras-chatas' },
        { id: 'bc-4-3/8', unit: 'm', description: 'Barra Chata 4" x 3/8" (101.60x9.52mm)', weight: calculateFlatBarWeight(101.60, 9.52), categoryName: 'barras-chatas' },
        { id: 'bc-4-1/2', unit: 'm', description: 'Barra Chata 4" x 1/2" (101.60x12.70mm)', weight: calculateFlatBarWeight(101.60, 12.70), categoryName: 'barras-chatas' },
    ];
