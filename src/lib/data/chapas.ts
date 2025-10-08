
import type { SteelItem } from './types';
import { SHEET_WEIGHT_CONSTANT, INCH_TO_MM } from './constants';

const chapasGroup1: {thickness: number, desc: string}[] = [
    { thickness: 0.4, desc: '0.40' },
    { thickness: 0.5, desc: '0.50' },
    { thickness: 0.6, desc: '0.60' },
    { thickness: 0.8, desc: '0.80' },
    { thickness: 1.0, desc: '1.00' },
    { thickness: 1.2, desc: '1.20' },
];

const chapasGroup2: {thickness: number, desc: string}[] = [
    { thickness: 1.5, desc: '1.50' },
    { thickness: 2.0, desc: '2.00' },
    { thickness: 2.5, desc: '2.50' },
    { thickness: 3.0, desc: '3.00' },
    { thickness: 3.5, desc: '3.50' },
    { thickness: 4.0, desc: '4.00' },
    { thickness: 3/16 * INCH_TO_MM, desc: '3/16" (4.76)' },
    { thickness: 5.0, desc: '5.00' },
    { thickness: 6.0, desc: '6.00' },
    { thickness: 1/4 * INCH_TO_MM, desc: '1/4" (6.35)' },
    { thickness: 5/16 * INCH_TO_MM, desc: '5/16" (7.94)' },
    { thickness: 3/8 * INCH_TO_MM, desc: '3/8" (9.52)' },
    { thickness: 10.0, desc: '10.00' },
    { thickness: 12.0, desc: '12.00' },
    { thickness: 1/2 * INCH_TO_MM, desc: '1/2" (12.70)' },
    { thickness: 5/8 * INCH_TO_MM, desc: '5/8" (15.88)' },
    { thickness: 3/4 * INCH_TO_MM, desc: '3/4" (19.05)' },
    { thickness: 7/8 * INCH_TO_MM, desc: '7/8" (22.22)' },
    { thickness: 1 * INCH_TO_MM, desc: '1" (25.40)' },
];

const dimensionsGroup1 = [
    { w: 1.25, h: 2.0, desc: '1250x2000' },
    { w: 1.25, h: 3.0, desc: '1250x3000' },
];

const dimensionsGroup2 = [
    { w: 1.25, h: 2.0, desc: '1250x2000' },
    { w: 1.25, h: 3.0, desc: '1250x3000' },
    { w: 1.54, h: 2.0, desc: '1540x2000' },
    { w: 1.54, h: 3.0, desc: '1540x3000' },
];

const generateChapas = (): SteelItem[] => {
    const items: SteelItem[] = [];
    const categoryName = 'chapas';
    chapasGroup1.forEach(chapa => {
        dimensionsGroup1.forEach(dim => {
            items.push({
                id: `chapa-${chapa.thickness}-${dim.w}x${dim.h}`,
                description: `Chapa Inox ${chapa.desc}x${dim.desc} mm`,
                weight: Math.ceil(chapa.thickness * dim.w * dim.h * SHEET_WEIGHT_CONSTANT),
                categoryName,
                unit: 'un',
            });
        });
    });
    chapasGroup2.forEach(chapa => {
        dimensionsGroup2.forEach(dim => {
            items.push({
                id: `chapa-${chapa.thickness}-${dim.w}x${dim.h}`,
                description: `Chapa Inox ${chapa.desc}x${dim.desc} mm`,
                weight: Math.ceil(chapa.thickness * dim.w * dim.h * SHEET_WEIGHT_CONSTANT),
                categoryName,
                unit: 'un',
            });
        });
    });
    return items;
};

export const chapasItems = generateChapas();
