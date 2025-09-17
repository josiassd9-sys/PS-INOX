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
        { id: 't-1-2.50', description: 'Tubo OD 1" (25.40mm) x 2.50mm', weight: (25.40 - 2.50) * 2.50 * TUBE_WEIGHT_CONSTANT },
        { id: 't-1-3.00', description: 'Tubo OD 1" (25.40mm) x 3.00mm', weight: (25.40 - 3.00) * 3.00 * TUBE_WEIGHT_CONSTANT },
        { id: 't-1_1/4-1.00', description: 'Tubo OD 1.1/4" (31.75mm) x 1.00mm', weight: (31.75 - 1.00) * 1.00 * TUBE_WEIGHT_CONSTANT },
        { id: 't-1_1/4-1.20', description: 'Tubo OD 1.1/4" (31.75mm) x 1.20mm', weight: (31.75 - 1.20) * 1.20 * TUBE_WEIGHT_CONSTANT },
        { id: 't-1_1/4-1.50', description: 'Tubo OD 1.1/4" (31.75mm) x 1.50mm', weight: (31.75 - 1.50) * 1.50 * TUBE_WEIGHT_CONSTANT },
        { id: 't-1_1/4-2.00', description: 'Tubo OD 1.1/4" (31.75mm) x 2.00mm', weight: (31.75 - 2.00) * 2.00 * TUBE_WEIGHT_CONSTANT },
        { id: 't-1_1/4-2.50', description: 'Tubo OD 1.1/4" (31.75mm) x 2.50mm', weight: (31.75 - 2.50) * 2.50 * TUBE_WEIGHT_CONSTANT },
        { id: 't-1_1/4-3.00', description: 'Tubo OD 1.1/4" (31.75mm) x 3.00mm', weight: (31.75 - 3.00) * 3.00 * TUBE_WEIGHT_CONSTANT },
        { id: 't-1_1/2-1.00', description: 'Tubo OD 1.1/2" (38.10mm) x 1.00mm', weight: (38.10 - 1.00) * 1.00 * TUBE_WEIGHT_CONSTANT },
        { id: 't-1_1/2-1.20', description: 'Tubo OD 1.1/2" (38.10mm) x 1.20mm', weight: (38.10 - 1.20) * 1.20 * TUBE_WEIGHT_CONSTANT },
        { id: 't-1_1/2-1.50', description: 'Tubo OD 1.1/2" (38.10mm) x 1.50mm', weight: (38.10 - 1.50) * 1.50 * TUBE_WEIGHT_CONSTANT },
        { id: 't-1_1/2-2.00', description: 'Tubo OD 1.1/2" (38.10mm) x 2.00mm', weight: (38.10 - 2.00) * 2.00 * TUBE_WEIGHT_CONSTANT },
        { id: 't-1_1/2-2.50', description: 'Tubo OD 1.1/2" (38.10mm) x 2.50mm', weight: (38.10 - 2.50) * 2.50 * TUBE_WEIGHT_CONSTANT },
        { id: 't-1_1/2-3.00', description: 'Tubo OD 1.1/2" (38.10mm) x 3.00mm', weight: (38.10 - 3.00) * 3.00 * TUBE_WEIGHT_CONSTANT },
        { id: 't-2-1.00', description: 'Tubo OD 2" (50.80mm) x 1.00mm', weight: (50.80 - 1.00) * 1.00 * TUBE_WEIGHT_CONSTANT },
        { id: 't-2-1.20', description: 'Tubo OD 2" (50.80mm) x 1.20mm', weight: (50.80 - 1.20) * 1.20 * TUBE_WEIGHT_CONSTANT },
        { id: 't-2-1.50', description: 'Tubo OD 2" (50.80mm) x 1.50mm', weight: (50.80 - 1.50) * 1.50 * TUBE_WEIGHT_CONSTANT },
        { id: 't-2-2.00', description: 'Tubo OD 2" (50.80mm) x 2.00mm', weight: (50.80 - 2.00) * 2.00 * TUBE_WEIGHT_CONSTANT },
        { id: 't-2-2.50', description: 'Tubo OD 2" (50.80mm) x 2.50mm', weight: (50.80 - 2.50) * 2.50 * TUBE_WEIGHT_CONSTANT },
        { id: 't-2-3.00', description: 'Tubo OD 2" (50.80mm) x 3.00mm', weight: (50.80 - 3.00) * 3.00 * TUBE_WEIGHT_CONSTANT },
        { id: 't-2_1/2-1.00', description: 'Tubo OD 2.1/2" (63.50mm) x 1.00mm', weight: (63.50 - 1.00) * 1.00 * TUBE_WEIGHT_CONSTANT },
        { id: 't-2_1/2-1.20', description: 'Tubo OD 2.1/2" (63.50mm) x 1.20mm', weight: (63.50 - 1.20) * 1.20 * TUBE_WEIGHT_CONSTANT },
        { id: 't-2_1/2-1.50', description: 'Tubo OD 2.1/2" (63.50mm) x 1.50mm', weight: (63.50 - 1.50) * 1.50 * TUBE_WEIGHT_CONSTANT },
        { id: 't-2_1/2-2.00', description: 'Tubo OD 2.1/2" (63.50mm) x 2.00mm', weight: (63.50 - 2.00) * 2.00 * TUBE_WEIGHT_CONSTANT },
        { id: 't-2_1/2-2.50', description: 'Tubo OD 2.1/2" (63.50mm) x 2.50mm', weight: (63.50 - 2.50) * 2.50 * TUBE_WEIGHT_CONSTANT },
        { id: 't-2_1/2-3.00', description: 'Tubo OD 2.1/2" (63.50mm) x 3.00mm', weight: (63.50 - 3.00) * 3.00 * TUBE_WEIGHT_CONSTANT },
        { id: 't-3-1.00', description: 'Tubo OD 3" (76.20mm) x 1.00mm', weight: (76.20 - 1.00) * 1.00 * TUBE_WEIGHT_CONSTANT },
        { id: 't-3-1.20', description: 'Tubo OD 3" (76.20mm) x 1.20mm', weight: (76.20 - 1.20) * 1.20 * TUBE_WEIGHT_CONSTANT },
        { id: 't-3-1.50', description: 'Tubo OD 3" (76.20mm) x 1.50mm', weight: (76.20 - 1.50) * 1.50 * TUBE_WEIGHT_CONSTANT },
        { id: 't-3-2.00', description: 'Tubo OD 3" (76.20mm) x 2.00mm', weight: (76.20 - 2.00) * 2.00 * TUBE_WEIGHT_CONSTANT },
        { id: 't-3-2.50', description: 'Tubo OD 3" (76.20mm) x 2.50mm', weight: (76.20 - 2.50) * 2.50 * TUBE_WEIGHT_CONSTANT },
        { id: 't-3-3.00', description: 'Tubo OD 3" (76.20mm) x 3.00mm', weight: (76.20 - 3.00) * 3.00 * TUBE_WEIGHT_CONSTANT },
        { id: 't-4-1.50', description: 'Tubo OD 4" (101.60mm) x 1.50mm', weight: (101.60 - 1.50) * 1.50 * TUBE_WEIGHT_CONSTANT },
        { id: 't-4-2.00', description: 'Tubo OD 4" (101.60mm) x 2.00mm', weight: (101.60 - 2.00) * 2.00 * TUBE_WEIGHT_CONSTANT },
        { id: 't-4-2.50', description: 'Tubo OD 4" (101.60mm) x 2.50mm', weight: (101.60 - 2.50) * 2.50 * TUBE_WEIGHT_CONSTANT },
        { id: 't-4-3.00', description: 'Tubo OD 4" (101.60mm) x 3.00mm', weight: (101.60 - 3.00) * 3.00 * TUBE_WEIGHT_CONSTANT },
        { id: 't-5-2.00', description: 'Tubo OD 5" (127.00mm) x 2.00mm', weight: (127.00 - 2.00) * 2.00 * TUBE_WEIGHT_CONSTANT },
        { id: 't-5-2.50', description: 'Tubo OD 5" (127.00mm) x 2.50mm', weight: (127.00 - 2.50) * 2.50 * TUBE_WEIGHT_CONSTANT },
        { id: 't-5-3.00', description: 'Tubo OD 5" (127.00mm) x 3.00mm', weight: (127.00 - 3.00) * 3.00 * TUBE_WEIGHT_CONSTANT },
        { id: 't-6-2.00', description: 'Tubo OD 6" (152.40mm) x 2.00mm', weight: (152.40 - 2.00) * 2.00 * TUBE_WEIGHT_CONSTANT },
        { id: 't-6-2.50', description: 'Tubo OD 6" (152.40mm) x 2.50mm', weight: (152.40 - 2.50) * 2.50 * TUBE_WEIGHT_CONSTANT },
        { id: 't-6-3.00', description: 'Tubo OD 6" (152.40mm) x 3.00mm', weight: (152.40 - 3.00) * 3.00 * TUBE_WEIGHT_CONSTANT },
        { id: 't-8-2.00', description: 'Tubo OD 8" (203.20mm) x 2.00mm', weight: (203.20 - 2.00) * 2.00 * TUBE_WEIGHT_CONSTANT },
        { id: 't-8-2.50', description: 'Tubo OD 8" (203.20mm) x 2.50mm', weight: (203.20 - 2.50) * 2.50 * TUBE_WEIGHT_CONSTANT },
        { id: 't-8-3.00', description: 'Tubo OD 8" (203.20mm) x 3.00mm', weight: (203.20 - 3.00) * 3.00 * TUBE_WEIGHT_CONSTANT },
        { id: 't-10-2.50', description: 'Tubo OD 10" (254.00mm) x 2.50mm', weight: (254.00 - 2.50) * 2.50 * TUBE_WEIGHT_CONSTANT },
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
  {
    id: 'tubos-schedule',
    name: 'Tubos Schedule',
    icon: 'Layers',
    unit: 'm',
    items: [
      // NPS 1/2"
      { id: 'ts-1/2-sch5', description: 'Tubo Schedule 1/2" SCH 5 (21.34mm x 1.65mm)', weight: (21.34 - 1.65) * 1.65 * TUBE_WEIGHT_CONSTANT },
      { id: 'ts-1/2-sch10', description: 'Tubo Schedule 1/2" SCH 10 (21.34mm x 2.11mm)', weight: (21.34 - 2.11) * 2.11 * TUBE_WEIGHT_CONSTANT },
      { id: 'ts-1/2-sch40', description: 'Tubo Schedule 1/2" SCH 40 (21.34mm x 2.77mm)', weight: (21.34 - 2.77) * 2.77 * TUBE_WEIGHT_CONSTANT },
      // NPS 3/4"
      { id: 'ts-3/4-sch5', description: 'Tubo Schedule 3/4" SCH 5 (26.67mm x 1.65mm)', weight: (26.67 - 1.65) * 1.65 * TUBE_WEIGHT_CONSTANT },
      { id: 'ts-3/4-sch10', description: 'Tubo Schedule 3/4" SCH 10 (26.67mm x 2.11mm)', weight: (26.67 - 2.11) * 2.11 * TUBE_WEIGHT_CONSTANT },
      { id: 'ts-3/4-sch40', description: 'Tubo Schedule 3/4" SCH 40 (26.67mm x 2.87mm)', weight: (26.67 - 2.87) * 2.87 * TUBE_WEIGHT_CONSTANT },
      // NPS 1"
      { id: 'ts-1-sch5', description: 'Tubo Schedule 1" SCH 5 (33.40mm x 1.65mm)', weight: (33.40 - 1.65) * 1.65 * TUBE_WEIGHT_CONSTANT },
      { id: 'ts-1-sch10', description: 'Tubo Schedule 1" SCH 10 (33.40mm x 2.77mm)', weight: (33.40 - 2.77) * 2.77 * TUBE_WEIGHT_CONSTANT },
      { id: 'ts-1-sch40', description: 'Tubo Schedule 1" SCH 40 (33.40mm x 3.38mm)', weight: (33.40 - 3.38) * 3.38 * TUBE_WEIGHT_CONSTANT },
      // NPS 1 1/4"
      { id: 'ts-1_1/4-sch5', description: 'Tubo Schedule 1 1/4" SCH 5 (42.16mm x 1.65mm)', weight: (42.16 - 1.65) * 1.65 * TUBE_WEIGHT_CONSTANT },
      { id: 'ts-1_1/4-sch10', description: 'Tubo Schedule 1 1/4" SCH 10 (42.16mm x 2.77mm)', weight: (42.16 - 2.77) * 2.77 * TUBE_WEIGHT_CONSTANT },
      { id: 'ts-1_1/4-sch40', description: 'Tubo Schedule 1 1/4" SCH 40 (42.16mm x 3.56mm)', weight: (42.16 - 3.56) * 3.56 * TUBE_WEIGHT_CONSTANT },
      // NPS 1 1/2"
      { id: 'ts-1_1/2-sch5', description: 'Tubo Schedule 1 1/2" SCH 5 (48.26mm x 1.65mm)', weight: (48.26 - 1.65) * 1.65 * TUBE_WEIGHT_CONSTANT },
      { id: 'ts-1_1/2-sch10', description: 'Tubo Schedule 1 1/2" SCH 10 (48.26mm x 2.77mm)', weight: (48.26 - 2.77) * 2.77 * TUBE_WEIGHT_CONSTANT },
      { id: 'ts-1_1/2-sch40', description: 'Tubo Schedule 1 1/2" SCH 40 (48.26mm x 3.68mm)', weight: (48.26 - 3.68) * 3.68 * TUBE_WEIGHT_CONSTANT },
      // NPS 2"
      { id: 'ts-2-sch5', description: 'Tubo Schedule 2" SCH 5 (60.33mm x 1.65mm)', weight: (60.33 - 1.65) * 1.65 * TUBE_WEIGHT_CONSTANT },
      { id: 'ts-2-sch10', description: 'Tubo Schedule 2" SCH 10 (60.33mm x 2.77mm)', weight: (60.33 - 2.77) * 2.77 * TUBE_WEIGHT_CONSTANT },
      { id: 'ts-2-sch40', description: 'Tubo Schedule 2" SCH 40 (60.33mm x 3.91mm)', weight: (60.33 - 3.91) * 3.91 * TUBE_WEIGHT_CONSTANT },
      // NPS 2 1/2"
      { id: 'ts-2_1/2-sch5', description: 'Tubo Schedule 2 1/2" SCH 5 (73.03mm x 2.11mm)', weight: (73.03 - 2.11) * 2.11 * TUBE_WEIGHT_CONSTANT },
      { id: 'ts-2_1/2-sch10', description: 'Tubo Schedule 2 1/2" SCH 10 (73.03mm x 3.05mm)', weight: (73.03 - 3.05) * 3.05 * TUBE_WEIGHT_CONSTANT },
      { id: 'ts-2_1/2-sch40', description: 'Tubo Schedule 2 1/2" SCH 40 (73.03mm x 5.16mm)', weight: (73.03 - 5.16) * 5.16 * TUBE_WEIGHT_CONSTANT },
      // NPS 3"
      { id: 'ts-3-sch5', description: 'Tubo Schedule 3" SCH 5 (88.90mm x 2.11mm)', weight: (88.90 - 2.11) * 2.11 * TUBE_WEIGHT_CONSTANT },
      { id: 'ts-3-sch10', description: 'Tubo Schedule 3" SCH 10 (88.90mm x 3.05mm)', weight: (88.90 - 3.05) * 3.05 * TUBE_WEIGHT_CONSTANT },
      { id: 'ts-3-sch40', description: 'Tubo Schedule 3" SCH 40 (88.90mm x 5.49mm)', weight: (88.90 - 5.49) * 5.49 * TUBE_WEIGHT_CONSTANT },
      // NPS 4"
      { id: 'ts-4-sch5', description: 'Tubo Schedule 4" SCH 5 (114.30mm x 2.11mm)', weight: (114.30 - 2.11) * 2.11 * TUBE_WEIGHT_CONSTANT },
      { id: 'ts-4-sch10', description: 'Tubo Schedule 4" SCH 10 (114.30mm x 3.05mm)', weight: (114.30 - 3.05) * 3.05 * TUBE_WEIGHT_CONSTANT },
      { id: 'ts-4-sch40', description: 'Tubo Schedule 4" SCH 40 (114.30mm x 6.02mm)', weight: (114.30 - 6.02) * 6.02 * TUBE_WEIGHT_CONSTANT },
       // NPS 5"
       { id: 'ts-5-sch5', description: 'Tubo Schedule 5" SCH 5 (141.30mm x 2.77mm)', weight: (141.30 - 2.77) * 2.77 * TUBE_WEIGHT_CONSTANT },
       { id: 'ts-5-sch10', description: 'Tubo Schedule 5" SCH 10 (141.30mm x 3.40mm)', weight: (141.30 - 3.40) * 3.40 * TUBE_WEIGHT_CONSTANT },
       { id: 'ts-5-sch40', description: 'Tubo Schedule 5" SCH 40 (141.30mm x 6.55mm)', weight: (141.30 - 6.55) * 6.55 * TUBE_WEIGHT_CONSTANT },
       // NPS 6"
       { id: 'ts-6-sch5', description: 'Tubo Schedule 6" SCH 5 (168.28mm x 2.77mm)', weight: (168.28 - 2.77) * 2.77 * TUBE_WEIGHT_CONSTANT },
       { id: 'ts-6-sch10', description: 'Tubo Schedule 6" SCH 10 (168.28mm x 3.40mm)', weight: (168.28 - 3.40) * 3.40 * TUBE_WEIGHT_CONSTANT },
       { id: 'ts-6-sch40', description: 'Tubo Schedule 6" SCH 40 (168.28mm x 7.11mm)', weight: (168.28 - 7.11) * 7.11 * TUBE_WEIGHT_CONSTANT },
       // NPS 8"
       { id: 'ts-8-sch5', description: 'Tubo Schedule 8" SCH 5 (219.08mm x 2.77mm)', weight: (219.08 - 2.77) * 2.77 * TUBE_WEIGHT_CONSTANT },
       { id: 'ts-8-sch10', description: 'Tubo Schedule 8" SCH 10 (219.08mm x 3.76mm)', weight: (219.08 - 3.76) * 3.76 * TUBE_WEIGHT_CONSTANT },
       { id: 'ts-8-sch40', description: 'Tubo Schedule 8" SCH 40 (219.08mm x 8.18mm)', weight: (219.08 - 8.18) * 8.18 * TUBE_WEIGHT_CONSTANT },
       // NPS 10"
       { id: 'ts-10-sch5', description: 'Tubo Schedule 10" SCH 5 (273.05mm x 3.40mm)', weight: (273.05 - 3.40) * 3.40 * TUBE_WEIGHT_CONSTANT },
       { id: 'ts-10-sch10', description: 'Tubo Schedule 10" SCH 10 (273.05mm x 4.19mm)', weight: (273.05 - 4.19) * 4.19 * TUBE_WEIGHT_CONSTANT },
       { id: 'ts-10-sch40', description: 'Tubo Schedule 10" SCH 40 (273.05mm x 9.27mm)', weight: (273.05 - 9.27) * 9.27 * TUBE_WEIGHT_CONSTANT },
       // NPS 12"
       { id: 'ts-12-sch5', description: 'Tubo Schedule 12" SCH 5 (323.85mm x 3.96mm)', weight: (323.85 - 3.96) * 3.96 * TUBE_WEIGHT_CONSTANT },
       { id: 'ts-12-sch10', description: 'Tubo Schedule 12" SCH 10 (323.85mm x 4.57mm)', weight: (323.85 - 4.57) * 4.57 * TUBE_WEIGHT_CONSTANT },
       { id: 'ts-12-sch40', description: 'Tubo Schedule 12" SCH 40 (323.85mm x 9.53mm)', weight: (323.85 - 9.53) * 9.53 * TUBE_WEIGHT_CONSTANT },
       // NPS 14"
       { id: 'ts-14-sch5', description: 'Tubo Schedule 14" SCH 5 (355.60mm x 3.96mm)', weight: (355.60 - 3.96) * 3.96 * TUBE_WEIGHT_CONSTANT },
       { id: 'ts-14-sch10', description: 'Tubo Schedule 14" SCH 10 (355.60mm x 6.35mm)', weight: (355.60 - 6.35) * 6.35 * TUBE_WEIGHT_CONSTANT },
       { id: 'ts-14-sch40', description: 'Tubo Schedule 14" SCH 40 (355.60mm x 11.13mm)', weight: (355.60 - 11.13) * 11.13 * TUBE_WEIGHT_CONSTANT },
       // NPS 16"
       { id: 'ts-16-sch5', description: 'Tubo Schedule 16" SCH 5 (406.40mm x 4.19mm)', weight: (406.40 - 4.19) * 4.19 * TUBE_WEIGHT_CONSTANT },
       { id: 'ts-16-sch10', description: 'Tubo Schedule 16" SCH 10 (406.40mm x 6.35mm)', weight: (406.40 - 6.35) * 6.35 * TUBE_WEIGHT_CONSTANT },
       { id: 'ts-16-sch40', description: 'Tubo Schedule 16" SCH 40 (406.40mm x 12.70mm)', weight: (406.40 - 12.70) * 12.70 * TUBE_WEIGHT_CONSTANT },
       // NPS 18"
       { id: 'ts-18-sch5', description: 'Tubo Schedule 18" SCH 5 (457.20mm x 4.19mm)', weight: (457.20 - 4.19) * 4.19 * TUBE_WEIGHT_CONSTANT },
       { id: 'ts-18-sch10', description: 'Tubo Schedule 18" SCH 10 (457.20mm x 6.35mm)', weight: (457.20 - 6.35) * 6.35 * TUBE_WEIGHT_CONSTANT },
       { id: 'ts-18-sch40', description: 'Tubo Schedule 18" SCH 40 (457.20mm x 14.27mm)', weight: (457.20 - 14.27) * 14.27 * TUBE_WEIGHT_CONSTANT },
       // NPS 20"
       { id: 'ts-20-sch5', description: 'Tubo Schedule 20" SCH 5 (508.00mm x 4.78mm)', weight: (508.00 - 4.78) * 4.78 * TUBE_WEIGHT_CONSTANT },
       { id: 'ts-20-sch10', description: 'Tubo Schedule 20" SCH 10 (508.00mm x 6.35mm)', weight: (508.00 - 6.35) * 6.35 * TUBE_WEIGHT_CONSTANT },
       { id: 'ts-20-sch40', description: 'Tubo Schedule 20" SCH 40 (508.00mm x 15.09mm)', weight: (508.00 - 15.09) * 15.09 * TUBE_WEIGHT_CONSTANT },
    ],
  },
];
