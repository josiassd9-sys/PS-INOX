// Calculation constants for stainless steel
const STAINLESS_STEEL_DENSITY_KG_M3 = 7930;
// For tubes: Weight(kg/m) = (OD_mm - WT_mm) * WT_mm * 0.02466
const TUBE_WEIGHT_CONSTANT = 0.02466;
// For sheets: Weight(kg/m²) = Thickness_mm * 7.93
const SHEET_WEIGHT_CONSTANT = STAINLESS_STEEL_DENSITY_KG_M3 / 1000;
// For round bars: Weight(kg/m) = D_mm^2 * 0.00623
const ROUND_BAR_WEIGHT_CONSTANT =
  (Math.PI / 4) * (STAINLESS_STEEL_DENSITY_KG_M3 / 1000000);

export type SteelItem = {
  id: string;
  description: string;
  weight: number;
};

export type Category = {
  id: string;
  name: string;
  items: SteelItem[];
  icon: string;
  unit: 'm' | 'm²';
};

export const CATEGORIES: Category[] = [
  {
    id: 'tubos-od',
    name: 'Tubos OD',
    icon: 'Minus',
    unit: 'm',
    items: [
        { id: 't-3/8-1.00', description: 'Tubo OD 3/8" (9.52mm) x 1.00mm', weight: (9.52 - 1.00) * 1.00 * TUBE_WEIGHT_CONSTANT },
        { id: 't-3/8-1.20', description: 'Tubo OD 3/8" (9.52mm) x 1.20mm', weight: (9.52 - 1.20) * 1.20 * TUBE_WEIGHT_CONSTANT },
        { id: 't-3/8-1.50', description: 'Tubo OD 3/8" (9.52mm) x 1.50mm', weight: (9.52 - 1.50) * 1.50 * TUBE_WEIGHT_CONSTANT },
        { id: 't-1/2-1.00', description: 'Tubo OD 1/2" (12.70mm) x 1.00mm', weight: (12.70 - 1.00) * 1.00 * TUBE_WEIGHT_CONSTANT },
        { id: 't-1/2-1.20', description: 'Tubo OD 1/2" (12.70mm) x 1.20mm', weight: (12.70 - 1.20) * 1.20 * TUBE_WEIGHT_CONSTANT },
        { id: 't-1/2-1.50', description: 'Tubo OD 1/2" (12.70mm) x 1.50mm', weight: (12.70 - 1.50) * 1.50 * TUBE_WEIGHT_CONSTANT },
        { id: 't-5/8-1.00', description: 'Tubo OD 5/8" (15.88mm) x 1.00mm', weight: (15.88 - 1.00) * 1.00 * TUBE_WEIGHT_CONSTANT },
        { id: 't-5/8-1.20', description: 'Tubo OD 5/8" (15.88mm) x 1.20mm', weight: (15.88 - 1.20) * 1.20 * TUBE_WEIGHT_CONSTANT },
        { id: 't-5/8-1.50', description: 'Tubo OD 5/8" (15.88mm) x 1.50mm', weight: (15.88 - 1.50) * 1.50 * TUBE_WEIGHT_CONSTANT },
        { id: 't-3/4-1.00', description: 'Tubo OD 3/4" (19.05mm) x 1.00mm', weight: (19.05 - 1.00) * 1.00 * TUBE_WEIGHT_CONSTANT },
        { id: 't-3/4-1.20', description: 'Tubo OD 3/4" (19.05mm) x 1.20mm', weight: (19.05 - 1.20) * 1.20 * TUBE_WEIGHT_CONSTANT },
        { id: 't-3/4-1.50', description: 'Tubo OD 3/4" (19.05mm) x 1.50mm', weight: (19.05 - 1.50) * 1.50 * TUBE_WEIGHT_CONSTANT },
        { id: 't-1-1.00', description: 'Tubo OD 1" (25.40mm) x 1.00mm', weight: (25.40 - 1.00) * 1.00 * TUBE_WEIGHT_CONSTANT },
        { id: 't-1-1.20', description: 'Tubo OD 1" (25.40mm) x 1.20mm', weight: (25.40 - 1.20) * 1.20 * TUBE_WEIGHT_CONSTANT },
        { id: 't-1-1.50', description: 'Tubo OD 1" (25.40mm) x 1.50mm', weight: (25.40 - 1.50) * 1.50 * TUBE_WEIGHT_CONSTANT },
        { id: 't-1-2.00', description: 'Tubo OD 1" (25.40mm) x 2.00mm', weight: (25.40 - 2.00) * 2.00 * TUBE_WEIGHT_CONSTANT },
        { id: 't-1_1/4-1.20', description: 'Tubo OD 1.1/4" (31.75mm) x 1.20mm', weight: (31.75 - 1.20) * 1.20 * TUBE_WEIGHT_CONSTANT },
        { id: 't-1_1/4-1.50', description: 'Tubo OD 1.1/4" (31.75mm) x 1.50mm', weight: (31.75 - 1.50) * 1.50 * TUBE_WEIGHT_CONSTANT },
        { id: 't-1_1/4-2.00', description: 'Tubo OD 1.1/4" (31.75mm) x 2.00mm', weight: (31.75 - 2.00) * 2.00 * TUBE_WEIGHT_CONSTANT },
        { id: 't-1_1/2-1.20', description: 'Tubo OD 1.1/2" (38.10mm) x 1.20mm', weight: (38.10 - 1.20) * 1.20 * TUBE_WEIGHT_CONSTANT },
        { id: 't-1_1/2-1.50', description: 'Tubo OD 1.1/2" (38.10mm) x 1.50mm', weight: (38.10 - 1.50) * 1.50 * TUBE_WEIGHT_CONSTANT },
        { id: 't-1_1/2-2.00', description: 'Tubo OD 1.1/2" (38.10mm) x 2.00mm', weight: (38.10 - 2.00) * 2.00 * TUBE_WEIGHT_CONSTANT },
        { id: 't-2-1.20', description: 'Tubo OD 2" (50.80mm) x 1.20mm', weight: (50.80 - 1.20) * 1.20 * TUBE_WEIGHT_CONSTANT },
        { id: 't-2-1.50', description: 'Tubo OD 2" (50.80mm) x 1.50mm', weight: (50.80 - 1.50) * 1.50 * TUBE_WEIGHT_CONSTANT },
        { id: 't-2-2.00', description: 'Tubo OD 2" (50.80mm) x 2.00mm', weight: (50.80 - 2.00) * 2.00 * TUBE_WEIGHT_CONSTANT },
        { id: 't-2_1/2-1.50', description: 'Tubo OD 2.1/2" (63.50mm) x 1.50mm', weight: (63.50 - 1.50) * 1.50 * TUBE_WEIGHT_CONSTANT },
        { id: 't-2_1/2-2.00', description: 'Tubo OD 2.1/2" (63.50mm) x 2.00mm', weight: (63.50 - 2.00) * 2.00 * TUBE_WEIGHT_CONSTANT },
        { id: 't-2_1/2-3.00', description: 'Tubo OD 2.1/2" (63.50mm) x 3.00mm', weight: (63.50 - 3.00) * 3.00 * TUBE_WEIGHT_CONSTANT },
        { id: 't-3-1.50', description: 'Tubo OD 3" (76.20mm) x 1.50mm', weight: (76.20 - 1.50) * 1.50 * TUBE_WEIGHT_CONSTANT },
        { id: 't-3-2.00', description: 'Tubo OD 3" (76.20mm) x 2.00mm', weight: (76.20 - 2.00) * 2.00 * TUBE_WEIGHT_CONSTANT },
        { id: 't-3-3.00', description: 'Tubo OD 3" (76.20mm) x 3.00mm', weight: (76.20 - 3.00) * 3.00 * TUBE_WEIGHT_CONSTANT },
        { id: 't-4-1.50', description: 'Tubo OD 4" (101.60mm) x 1.50mm', weight: (101.60 - 1.50) * 1.50 * TUBE_WEIGHT_CONSTANT },
        { id: 't-4-2.00', description: 'Tubo OD 4" (101.60mm) x 2.00mm', weight: (101.60 - 2.00) * 2.00 * TUBE_WEIGHT_CONSTANT },
        { id: 't-4-3.00', description: 'Tubo OD 4" (101.60mm) x 3.00mm', weight: (101.60 - 3.00) * 3.00 * TUBE_WEIGHT_CONSTANT },
        { id: 't-5-2.00', description: 'Tubo OD 5" (127.00mm) x 2.00mm', weight: (127.00 - 2.00) * 2.00 * TUBE_WEIGHT_CONSTANT },
        { id: 't-5-3.00', description: 'Tubo OD 5" (127.00mm) x 3.00mm', weight: (127.00 - 3.00) * 3.00 * TUBE_WEIGHT_CONSTANT },
        { id: 't-6-2.00', description: 'Tubo OD 6" (152.40mm) x 2.00mm', weight: (152.40 - 2.00) * 2.00 * TUBE_WEIGHT_CONSTANT },
        { id: 't-6-3.00', description: 'Tubo OD 6" (152.40mm) x 3.00mm', weight: (152.40 - 3.00) * 3.00 * TUBE_WEIGHT_CONSTANT },
        { id: 't-8-2.00', description: 'Tubo OD 8" (203.20mm) x 2.00mm', weight: (203.20 - 2.00) * 2.00 * TUBE_WEIGHT_CONSTANT },
        { id: 't-8-3.00', description: 'Tubo OD 8" (203.20mm) x 3.00mm', weight: (203.20 - 3.00) * 3.00 * TUBE_WEIGHT_CONSTANT },
        { id: 't-10-3.00', description: 'Tubo OD 10" (254.00mm) x 3.00mm', weight: (254.00 - 3.00) * 3.00 * TUBE_WEIGHT_CONSTANT },
    ],
  },
  {
    id: 'chapas',
    name: 'Chapas',
    icon: 'Square',
    unit: 'm²',
    items: [
      {
        id: 'c1',
        description: 'Chapa Inox x 0.50mm',
        weight: 0.5 * SHEET_WEIGHT_CONSTANT,
      },
      {
        id: 'c2',
        description: 'Chapa Inox x 1.00mm',
        weight: 1.0 * SHEET_WEIGHT_CONSTANT,
      },
      {
        id: 'c3',
        description: 'Chapa Inox x 1.50mm',
        weight: 1.5 * SHEET_WEIGHT_CONSTANT,
      },
      {
        id: 'c4',
        description: 'Chapa Inox x 2.00mm',
        weight: 2.0 * SHEET_WEIGHT_CONSTANT,
      },
    ],
  },
  {
    id: 'barras-redondas',
    name: 'Barras Redondas',
    icon: 'Circle',
    unit: 'm',
    items: [
      {
        id: 'b1',
        description: 'Barra Redonda 1/2" (12.70mm)',
        weight: Math.pow(12.7, 2) * ROUND_BAR_WEIGHT_CONSTANT,
      },
      {
        id: 'b2',
        description: 'Barra Redonda 3/4" (19.05mm)',
        weight: Math.pow(19.05, 2) * ROUND_BAR_WEIGHT_CONSTANT,
      },
      {
        id: 'b3',
        description: 'Barra Redonda 1" (25.40mm)',
        weight: Math.pow(25.4, 2) * ROUND_BAR_WEIGHT_CONSTANT,
      },
      {
        id: 'b4',
        description: 'Barra Redonda 1 1/2" (38.10mm)',
        weight: Math.pow(38.1, 2) * ROUND_BAR_WEIGHT_CONSTANT,
      },
    ],
  },
];
