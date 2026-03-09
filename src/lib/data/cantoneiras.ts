
import type { SteelItem } from './types';
import { calculateAngleBarWeight } from './constants';

export const cantoneirasItems: SteelItem[] = [
        { id: 'can-3/4-1/8', unit: 'm', description: 'Cantoneira 3/4" x 1/8" (19.05x3.17mm)', weight: calculateAngleBarWeight(19.05, 3.17), categoryName: 'cantoneiras' },
        { id: 'can-3/4-3/16', unit: 'm', description: 'Cantoneira 3/4" x 3/16" (19.05x4.76mm)', weight: calculateAngleBarWeight(19.05, 4.76), categoryName: 'cantoneiras' },
        { id: 'can-1-1/8', unit: 'm', description: 'Cantoneira 1" x 1/8" (25.40x3.17mm)', weight: calculateAngleBarWeight(25.40, 3.17), categoryName: 'cantoneiras' },
        { id: 'can-1-3/16', unit: 'm', description: 'Cantoneira 1" x 3/16" (25.40x4.76mm)', weight: calculateAngleBarWeight(25.40, 4.76), categoryName: 'cantoneiras' },
        { id: 'can-1-1/4', unit: 'm', description: 'Cantoneira 1" x 1/4" (25.40x6.35mm)', weight: calculateAngleBarWeight(25.40, 6.35), categoryName: 'cantoneiras' },
        { id: 'can-1_1/4-1/8', unit: 'm', description: 'Cantoneira 1.1/4" x 1/8" (31.75x3.17mm)', weight: calculateAngleBarWeight(31.75, 3.17), categoryName: 'cantoneiras' },
        { id: 'can-1_1/4-3/16', unit: 'm', description: 'Cantoneira 1.1/4" x 3/16" (31.75x4.76mm)', weight: calculateAngleBarWeight(31.75, 4.76), categoryName: 'cantoneiras' },
        { id: 'can-1_1/4-1/4', unit: 'm', description: 'Cantoneira 1.1/4" x 1/4" (31.75x6.35mm)', weight: calculateAngleBarWeight(31.75, 6.35), categoryName: 'cantoneiras' },
        { id: 'can-1_1/2-1/8', unit: 'm', description: 'Cantoneira 1.1/2" x 1/8" (38.10x3.17mm)', weight: calculateAngleBarWeight(38.10, 3.17), categoryName: 'cantoneiras' },
        { id: 'can-1_1/2-3/16', unit: 'm', description: 'Cantoneira 1.1/2" x 3/16" (38.10x4.76mm)', weight: calculateAngleBarWeight(38.10, 4.76), categoryName: 'cantoneiras' },
        { id: 'can-1_1/2-1/4', unit: 'm', description: 'Cantoneira 1.1/2" x 1/4" (38.10x6.35mm)', weight: calculateAngleBarWeight(38.10, 6.35), categoryName: 'cantoneiras' },
        { id: 'can-2-1/8', unit: 'm', description: 'Cantoneira 2" x 1/8" (50.80x3.17mm)', weight: calculateAngleBarWeight(50.80, 3.17), categoryName: 'cantoneiras' },
        { id: 'can-2-3/16', unit: 'm', description: 'Cantoneira 2" x 3/16" (50.80x4.76mm)', weight: calculateAngleBarWeight(50.80, 4.76), categoryName: 'cantoneiras' },
        { id: 'can-2-1/4', unit: 'm', description: 'Cantoneira 2" x 1/4" (50.80x6.35mm)', weight: calculateAngleBarWeight(50.80, 6.35), categoryName: 'cantoneiras' },
        { id: 'can-2_1/2-3/16', unit: 'm', description: 'Cantoneira 2.1/2" x 3/16" (63.50x4.76mm)', weight: calculateAngleBarWeight(63.50, 4.76), categoryName: 'cantoneiras' },
        { id: 'can-2_1/2-1/4', unit: 'm', description: 'Cantoneira 2.1/2" x 1/4" (63.50x6.35mm)', weight: calculateAngleBarWeight(63.50, 6.35), categoryName: 'cantoneiras' },
        { id: 'can-3-3/16', unit: 'm', description: 'Cantoneira 3" x 3/16" (76.20x4.76mm)', weight: calculateAngleBarWeight(76.20, 4.76), categoryName: 'cantoneiras' },
        { id: 'can-3-1/4', unit: 'm', description: 'Cantoneira 3" x 1/4" (76.20x6.35mm)', weight: calculateAngleBarWeight(76.20, 6.35), categoryName: 'cantoneiras' },
    ];
