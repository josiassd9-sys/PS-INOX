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
      {
        id: 't1',
        description: 'Tubo OD 1/2" (12.70mm) x 1.00mm',
        weight: (12.7 - 1.0) * 1.0 * TUBE_WEIGHT_CONSTANT,
      },
      {
        id: 't2',
        description: 'Tubo OD 1/2" (12.70mm) x 1.20mm',
        weight: (12.7 - 1.2) * 1.2 * TUBE_WEIGHT_CONSTANT,
      },
      {
        id: 't3',
        description: 'Tubo OD 1/2" (12.70mm) x 1.50mm',
        weight: (12.7 - 1.5) * 1.5 * TUBE_WEIGHT_CONSTANT,
      },
      {
        id: 't4',
        description: 'Tubo OD 3/4" (19.05mm) x 1.20mm',
        weight: (19.05 - 1.2) * 1.2 * TUBE_WEIGHT_CONSTANT,
      },
      {
        id: 't5',
        description: 'Tubo OD 3/4" (19.05mm) x 1.50mm',
        weight: (19.05 - 1.5) * 1.5 * TUBE_WEIGHT_CONSTANT,
      },
      {
        id: 't6',
        description: 'Tubo OD 1" (25.40mm) x 1.20mm',
        weight: (25.4 - 1.2) * 1.2 * TUBE_WEIGHT_CONSTANT,
      },
      {
        id: 't7',
        description: 'Tubo OD 1" (25.40mm) x 1.50mm',
        weight: (25.4 - 1.5) * 1.5 * TUBE_WEIGHT_CONSTANT,
      },
      {
        id: 't8',
        description: 'Tubo OD 1 1/2" (38.10mm) x 1.50mm',
        weight: (38.1 - 1.5) * 1.5 * TUBE_WEIGHT_CONSTANT,
      },
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
