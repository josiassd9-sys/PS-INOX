import type { SteelItem } from './types';
import { ALUMINUM_SHEET_WEIGHT_CONSTANT } from './constants';

const generateChapasAluminio = (): SteelItem[] => {
    const items: SteelItem[] = [];
    const categoryName = 'Chapa Alumínio';
    const thicknesses = [0.8, 1.0, 1.2, 1.5, 2.0, 2.5, 3.0, 4.0, 5.0, 6.0, 8.0, 10.0];
    const dimensions = [
        { w: 1.25, h: 2.0, desc: '1250x2000' },
        { w: 1.25, h: 3.0, desc: '1250x3000' },
    ];
    
    thicknesses.forEach(thickness => {
        const thicknessDesc = thickness.toFixed(1).replace('.', ',');
        dimensions.forEach(dim => {
            items.push({
                id: `chapa-al-${thickness}-${dim.w}x${dim.h}`,
                description: `Chapa Alumínio ${thicknessDesc}x${dim.desc} mm`,
                weight: thickness * dim.w * dim.h * ALUMINUM_SHEET_WEIGHT_CONSTANT,
                categoryName,
                unit: 'un',
            });
        });
    });
    
    return items;
};

export const chapasAluminioItems = generateChapasAluminio();
