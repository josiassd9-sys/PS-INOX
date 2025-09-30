

export const STAINLESS_STEEL_DENSITY_KG_M3 = 7980;
const INCH_TO_MM = 25.4;

// For tubes: Weight(kg/m) = (OD_mm - WT_mm) * WT_mm * (PI * DENSITY / 1000000)
const TUBE_WEIGHT_CONSTANT = Math.PI * (STAINLESS_STEEL_DENSITY_KG_M3 / 1000000);

// For sheets: Weight(kg/m²) = Thickness_mm * (DENSITY / 1000)
const SHEET_WEIGHT_CONSTANT = STAINLESS_STEEL_DENSITY_KG_M3 / 1000;

// For round bars: Weight(kg/m) = D_mm^2 * (PI/4) * (DENSITY / 1000000)
export const ROUND_BAR_WEIGHT_CONSTANT =
  (Math.PI / 4) * (STAINLESS_STEEL_DENSITY_KG_M3 / 1000000);

// For square bars: Weight(kg/m) = Side_mm^2 * (DENSITY / 1000000)
const SQUARE_BAR_WEIGHT_CONSTANT = STAINLESS_STEEL_DENSITY_KG_M3 / 1000000;

// For hexagonal bars: Weight(kg/m) = (sqrt(3)/2) * D_mm^2 * (DENSITY / 1000000)
const HEXAGONAL_BAR_WEIGHT_CONSTANT = (Math.sqrt(3)/2) * (STAINLESS_STEEL_DENSITY_KG_M3 / 1000000);


// For angle bars: Weight(kg/m) = ( (Leg_A_mm * 2) - Thickness_mm ) * Thickness_mm * (DENSITY / 1000000)
const calculateAngleBarWeight = (leg_mm: number, thickness_mm: number) => {
    return ((leg_mm * 2) - thickness_mm) * thickness_mm * (STAINLESS_STEEL_DENSITY_KG_M3 / 1000000);
}

// For flat bars: Weight(kg/m) = Width_mm * Thickness_mm * (DENSITY / 1000000)
const calculateFlatBarWeight = (width_mm: number, thickness_mm: number) => {
    return width_mm * thickness_mm * (STAINLESS_STEEL_DENSITY_KG_M3 / 1000000);
}

// For square tubes: Weight(kg/m) = (Side_mm * 4 - (Thickness_mm * 4)) * Thickness_mm * (DENSITY / 1000000)
const calculateSquareTubeWeight = (side_mm: number, thickness_mm: number) => {
    return ((side_mm * 4) - (thickness_mm * 4)) * thickness_mm * (STAINLESS_STEEL_DENSITY_KG_M3 / 1000000);
}

// For rectangular tubes: Weight(kg/m) = ( (Side_A_mm + Side_B_mm) * 2 - (Thickness_mm * 4) ) * Thickness_mm * (DENSITY / 1000000)
const calculateRectangularTubeWeight = (side_a_mm: number, side_b_mm: number, thickness_mm: number) => {
    return ( (side_a_mm + side_b_mm) * 2 - (thickness_mm * 4) ) * thickness_mm * (STAINLESS_STEEL_DENSITY_KG_M3 / 1000000);
}


export type SteelItem = {
  id: string;
  description: string;
  weight: number;
};

export type Category = {
  id: string;
  name: string;
  description: string;
  items: SteelItem[] | ScrapItem[];
  icon: string;
  unit: 'm' | 'm²' | 'un' | 'calc' | 'kg';
};

export type ScrapItem = {
  id: string;
  material: string;
  composition: string;
  price: number;
};


const chapasGroup1: {thickness: number, desc: string}[] = [
    { thickness: 0.4, desc: '0.40mm' },
    { thickness: 0.5, desc: '0.50mm' },
    { thickness: 0.6, desc: '0.60mm' },
    { thickness: 0.8, desc: '0.80mm' },
    { thickness: 1.0, desc: '1.00mm' },
    { thickness: 1.2, desc: '1.20mm' },
];

const chapasGroup2: {thickness: number, desc: string}[] = [
    { thickness: 1.5, desc: '1.50mm' },
    { thickness: 2.0, desc: '2.00mm' },
    { thickness: 2.5, desc: '2.50mm' },
    { thickness: 3.0, desc: '3.00mm' },
    { thickness: 3.5, desc: '3.50mm' },
    { thickness: 4.0, desc: '4.00mm' },
    { thickness: 3/16 * INCH_TO_MM, desc: '3/16" (4.76mm)' },
    { thickness: 5.0, desc: '5.00mm' },
    { thickness: 6.0, desc: '6.00mm' },
    { thickness: 1/4 * INCH_TO_MM, desc: '1/4" (6.35mm)' },
    { thickness: 5/16 * INCH_TO_MM, desc: '5/16" (7.94mm)' },
    { thickness: 3/8 * INCH_TO_MM, desc: '3/8" (9.52mm)' },
    { thickness: 10.0, desc: '10.00mm' },
    { thickness: 12.0, desc: '12.00mm' },
    { thickness: 1/2 * INCH_TO_MM, desc: '1/2" (12.70mm)' },
    { thickness: 5/8 * INCH_TO_MM, desc: '5/8" (15.88mm)' },
    { thickness: 3/4 * INCH_TO_MM, desc: '3/4" (19.05mm)' },
    { thickness: 7/8 * INCH_TO_MM, desc: '7/8" (22.22mm)' },
    { thickness: 1 * INCH_TO_MM, desc: '1" (25.40mm)' },
];

const dimensionsGroup1 = [
    { w: 1.25, h: 2.0, desc: '1250x2000mm' },
    { w: 1.25, h: 3.0, desc: '1250x3000mm' },
];

const dimensionsGroup2 = [
    { w: 1.25, h: 2.0, desc: '1250x2000mm' },
    { w: 1.25, h: 3.0, desc: '1250x3000mm' },
    { w: 1.54, h: 2.0, desc: '1540x2000mm' },
    { w: 1.54, h: 3.0, desc: '1540x3000mm' },
];

const generateChapas = (): SteelItem[] => {
    const items: SteelItem[] = [];
    chapasGroup1.forEach(chapa => {
        dimensionsGroup1.forEach(dim => {
            items.push({
                id: `chapa-${chapa.thickness}-${dim.w}x${dim.h}`,
                description: `Chapa Inox ${chapa.desc} (${dim.desc})`,
                weight: chapa.thickness * dim.w * dim.h * SHEET_WEIGHT_CONSTANT,
            });
        });
    });
    chapasGroup2.forEach(chapa => {
        dimensionsGroup2.forEach(dim => {
            items.push({
                id: `chapa-${chapa.thickness}-${dim.w}x${dim.h}`,
                description: `Chapa Inox ${chapa.desc} (${dim.desc})`,
                weight: chapa.thickness * dim.w * dim.h * SHEET_WEIGHT_CONSTANT,
            });
        });
    });
    return items;
};

const scrapItems: ScrapItem[] = [
  // Aços e Ligas de Inox
  { id: 'scrap-1', material: 'Sucata Inox 409/410/420 - Mista', composition: 'Cr: 11–13% / C: 0,15–0,40% / Fe balanceado', price: 0.80 },
  { id: 'scrap-2', material: 'Sucata Inox 409/410/420 - Estamparia', composition: 'Cr: 11–13% / C: 0,15–0,40% / Fe balanceado', price: 2.30 },
  { id: 'scrap-3', material: 'Sucata Inox 430 - Mista', composition: 'Cr: 16–18% / C: ≤0,12% / Fe balanceado – sem níquel', price: 1.00 },
  { id: 'scrap-4', material: 'Sucata Inox 430 - Estamparia', composition: 'Cr: 16–18% / C: ≤0,12% / Fe balanceado – sem níquel', price: 2.50 },
  { id: 'scrap-5', material: 'Sucata Nitronic N-32 (tubos para corte)', composition: 'Cr: 18–20% / Ni: 8–9% / Mn: 4–6% / N: ~0,25%', price: 2.00 },
  { id: 'scrap-6', material: 'Sucata Baixa Liga', composition: 'Ni: 1,5% / Cr: 12% / Mn: 6%', price: 1.50 },
  { id: 'scrap-7', material: 'Sucata 201 / 15-5 / 17-4 / 23-04', composition: '201: Cr: 16–18%, Ni: 3,5–5,5%, Mn: 5–7% | 15-5 PH: Cr: 15%, Ni: 4–5%, Cu: 3% | 17-4 PH: Cr: 15–17%, Ni: 3–5%, Cu: 3–5%', price: 2.70 },
  { id: 'scrap-8', material: 'Sucata Inox 301 / Resist. 304', composition: 'Cr: 16–18% / Ni: 6–8% / Mn: ≤2%', price: 4.40 },
  { id: 'scrap-321', material: 'Sucata Inox 321', composition: 'Cr: 17-19% / Ni: 9-12% / Ti: 5xC a 0.70%', price: 5.60 },
  { id: 'scrap-9', material: 'Sucata Inox 304 / Ni-resist 1', composition: 'Cr: 18–20% / Ni: 8–10,5% / Mn: ≤2%', price: 5.50 },
  { id: 'scrap-10', material: 'Sucata Inox 309', composition: 'Cr: 22–24% / Ni: 12–15% / Mn: ≤2%', price: 7.50 },
  { id: 'scrap-11', material: 'Sucata Inox 310', composition: 'Cr: 24–26% / Ni: 19–22% / Mn: ≤2%', price: 12.50 },
  { id: 'scrap-17', material: 'Sucata Inox 316', composition: 'Cr: 16–18% / Ni: 10–14% / Mo: 2–3%', price: 10.70 },
  { id: 'scrap-904', material: 'Sucata Alloy 904L', composition: 'Cr: 19-23% / Ni: 23-28% / Mo: 4-5% / Cu: 1-2%', price: 15.50 },
  { id: 'scrap-12', material: 'Sucata 35/20', composition: 'Equivalente ao Aço 3520: Cr: 35% / Ni: 20%', price: 16.40 },
  { id: 'scrap-13', material: 'Sucata 45/20', composition: 'Equivalente ao Aço 4520: Cr: 45% / Ni: 20%', price: 19.30 },
  { id: 'scrap-14', material: 'Sucata CD4MCu', composition: 'Cr: 25% / Ni: 5% / Mo: 2% / Cu: 1–2%', price: 4.50 },
  { id: 'scrap-15', material: 'Sucata SAF 2205', composition: 'Cr: 22% / Ni: 5% / Mo: 3% / N: 0,15%', price: 8.50 },
  { id: 'scrap-16', material: 'Sucata SAF Duplex 2507', composition: 'Cr: 25% / Ni: 7% / Mo: 4% / N: 0,3%', price: 9.50 },
  { id: 'scrap-18', material: 'Sucata Manganês 12%', composition: 'Mn: 11–14% / C: 1,0–1,4% / Fe balanceado', price: 2.00 },

  // Alumínio
  { id: 'scrap-al-1', material: 'Sucata Alumínio Misto / Bloco', composition: 'Al: 90–98% / Si: 1–7% / Fe: 0,5–2%', price: 3.00 },
  { id: 'scrap-al-2', material: 'Sucata Alumínio Panela', composition: 'Ligas de alumínio variadas', price: 5.50 },
  { id: 'scrap-al-3', material: 'Sucata Alumínio Perfil (Limpo)', composition: 'Liga 6063/6061, Al >98%', price: 7.50 },
  { id: 'scrap-al-4', material: 'Sucata Alumínio Chapa / Disco', composition: 'Ligas 1xxx, 3xxx, 5xxx', price: 6.50 },
  { id: 'scrap-al-5', material: 'Cavaco de Alumínio', composition: 'Varia conforme a usinagem', price: 3.50 },

  // Cobre
  { id: 'scrap-cu-1', material: 'Sucata Cobre Misto (Tubos, Chapas)', composition: 'Peças de cobre diversas, pode conter solda', price: 35.00 },
  { id: 'scrap-cu-2', material: 'Sucata Fio de Cobre (1ª qualidade)', composition: 'Fios e cabos limpos, sem impurezas', price: 40.00 },
  { id: 'scrap-cu-3', material: 'Cavaco de Cobre', composition: 'Varia conforme a usinagem', price: 30.00 },

  // Latão e Bronze
  { id: 'scrap-br-1', material: 'Sucata Latão (Metal Amarelo)', composition: 'Liga de Cobre e Zinco (Cu-Zn)', price: 25.00 },
  { id: 'scrap-br-2', material: 'Cavaco de Latão', composition: 'Varia conforme a usinagem', price: 22.00 },
  { id: 'scrap-bz-1', material: 'Sucata Bronze', composition: 'Liga de Cobre e Estanho (Cu-Sn)', price: 28.00 },
  { id: 'scrap-bz-2', material: 'Cavaco de Bronze', composition: 'Varia conforme a usinagem', price: 24.00 },
  
  // Níquel
  { id: 'scrap-ni-1', material: 'Sucata de Níquel Puro', composition: 'Ni > 99%', price: 80.00 },
  { id: 'scrap-ni-2', material: 'Sucata Monel', composition: 'Liga de Níquel e Cobre (aprox. 67% Ni, 28% Cu)', price: 45.00 },
  { id: 'scrap-ni-3', material: 'Sucata Inconel', composition: 'Superliga a base de Níquel, Cr e Fe', price: 55.00 },

  // Outros Metais
  { id: 'scrap-fe-1', material: 'Sucata Ferro (Cavaco ou Estamparia)', composition: 'Fe: 99,5% / C: ≤0,25%', price: 0.50 },
  { id: 'scrap-gv-1', material: 'Sucata Galvalume', composition: 'Aço revestido com 55% Al, 43.5% Zn, 1.5% Si', price: 0.70 },
  
  // Cavacos de Inox
  { id: 'scrap-21', material: 'Cavaco Inox 201', composition: 'Cr: 16–18% / Ni: 3,5–5,5% / Mn: 5–7%', price: 2.10 },
  { id: 'scrap-22', material: 'Cavaco SAF 2205 / 2507', composition: 'SAF 2205: Cr: 22%, Ni: 5%, Mo: 3% | SAF 2507: Cr: 25%, Ni: 7%, Mo: 4%', price: 6.60 },
  { id: 'scrap-23', material: 'Cavaco Inox 304', composition: 'Cr: 18–20% / Ni: 8–10,5% / Mn: ≤2%', price: 5.10 },
  { id: 'scrap-24', material: 'Cavaco Inox 316', composition: 'Cr: 16–18% / Ni: 10–14% / Mo: 2–3%', price: 8.20 },
  
  // Borras e Resíduos
  { id: 'scrap-25', material: 'Borra Inox 201 (Pó)', composition: 'Cr: 16–18% / Ni: 3,5–5,5% / Mn: 5–7%', price: 1.70 },
  { id: 'scrap-26', material: 'Borra Inox 201 (Metálica)', composition: 'Cr: 16–18% / Ni: 3,5–5,5% / Mn: 5–7%', price: 2.10 },
  { id: 'scrap-27', material: 'Borra Inox 304 (Pó)', composition: 'Cr: 18–20% / Ni: 8–10,5% / Mn: ≤2%', price: 3.60 },
  { id: 'scrap-28', material: 'Borra Inox 304 (Metálica)', composition: 'Cr: 18–20% / Ni: 8–10,5% / Mn: ≤2%', price: 5.10 },
  { id: 'scrap-29', material: 'Corte Plasma', composition: 'Resíduos de inox diversos', price: 0.50 },
  { id: 'scrap-30', material: 'Corte Trocador / Eletrodo', composition: 'Aços inox e ligas de níquel', price: 1.00 },
  
  // Aços Carbono e Ligados (Preços geralmente baixos ou nulos para referência)
  { id: 'scrap-31', material: 'Aço Carbono 1020', composition: 'C: 0,18–0,23% / Mn: 0,3–0,6% / Fe balanceado', price: 0 },
  { id: 'scrap-32', material: 'Aço Carbono 1045', composition: 'C: 0,43–0,50% / Mn: 0,6–0,9% / Fe balanceado', price: 0 },
  { id: 'scrap-33', material: 'Aço SAE 4140 (liga)', composition: 'C: 0,38–0,43% / Cr: 0,8–1,1% / Mo: 0,15–0,25% / Mn: 0,75–1%', price: 0 },
  { id: 'scrap-34', material: 'Aço SAE 8620 (cementação)', composition: 'C: 0,18–0,23% / Ni: 0,4–0,7% / Cr: 0,4–0,6% / Mo: 0,15–0,25%', price: 0 },
  { id: 'scrap-35', material: 'Aço ASTM A36 (estrutural)', composition: 'C: ≤0,25% / Mn: 0,8–1,2% / Fe balanceado', price: 0 },
  { id: 'scrap-36', material: 'Aço Ferro Fundido Cinzento', composition: 'C: 2,5–4% / Si: 1–3% / Mn: 0,2–1% / Fe balanceado', price: 0 },
];

const tubosAliancaItems: SteelItem[] = [
  { id: 'ta-21.3-2.00', description: 'Tubo DIN 21,30mm x 2.00mm (DI 17,30mm)', weight: (21.30 - 2.00) * 2.00 * TUBE_WEIGHT_CONSTANT },
  { id: 'ta-21.3-2.35', description: 'Tubo DIN 21,30mm x 2.35mm (DI 16,60mm)', weight: (21.30 - 2.35) * 2.35 * TUBE_WEIGHT_CONSTANT },
  { id: 'ta-26.9-2.00', description: 'Tubo DIN 26,90mm x 2.00mm (DI 22,90mm)', weight: (26.90 - 2.00) * 2.00 * TUBE_WEIGHT_CONSTANT },
  { id: 'ta-26.9-2.35', description: 'Tubo DIN 26,90mm x 2.35mm (DI 22,20mm)', weight: (26.90 - 2.35) * 2.35 * TUBE_WEIGHT_CONSTANT },
  { id: 'ta-33.7-2.00', description: 'Tubo DIN 33,70mm x 2.00mm (DI 29,70mm)', weight: (33.70 - 2.00) * 2.00 * TUBE_WEIGHT_CONSTANT },
  { id: 'ta-33.7-2.65', description: 'Tubo DIN 33,70mm x 2.65mm (DI 28,40mm)', weight: (33.70 - 2.65) * 2.65 * TUBE_WEIGHT_CONSTANT },
  { id: 'ta-33.7-3.00', description: 'Tubo DIN 33,70mm x 3.00mm (DI 27,70mm)', weight: (33.70 - 3.00) * 3.00 * TUBE_WEIGHT_CONSTANT },
  { id: 'ta-42.4-2.00', description: 'Tubo DIN 42,40mm x 2.00mm (DI 38,40mm)', weight: (42.40 - 2.00) * 2.00 * TUBE_WEIGHT_CONSTANT },
  { id: 'ta-42.4-2.65', description: 'Tubo DIN 42,40mm x 2.65mm (DI 37,10mm)', weight: (42.40 - 2.65) * 2.65 * TUBE_WEIGHT_CONSTANT },
  { id: 'ta-42.4-3.00', description: 'Tubo DIN 42,40mm x 3.00mm (DI 36,40mm)', weight: (42.40 - 3.00) * 3.00 * TUBE_WEIGHT_CONSTANT },
  { id: 'ta-48.3-2.00', description: 'Tubo DIN 48,30mm x 2.00mm (DI 44,30mm)', weight: (48.30 - 2.00) * 2.00 * TUBE_WEIGHT_CONSTANT },
  { id: 'ta-48.3-2.65', description: 'Tubo DIN 48,30mm x 2.65mm (DI 43,00mm)', weight: (48.30 - 2.65) * 2.65 * TUBE_WEIGHT_CONSTANT },
  { id: 'ta-48.3-3.00', description: 'Tubo DIN 48,30mm x 3.00mm (DI 42,30mm)', weight: (48.30 - 3.00) * 3.00 * TUBE_WEIGHT_CONSTANT },
  { id: 'ta-60.3-2.00', description: 'Tubo DIN 60,30mm x 2.00mm (DI 56,30mm)', weight: (60.30 - 2.00) * 2.00 * TUBE_WEIGHT_CONSTANT },
  { id: 'ta-60.3-2.65', description: 'Tubo DIN 60,30mm x 2.65mm (DI 55,00mm)', weight: (60.30 - 2.65) * 2.65 * TUBE_WEIGHT_CONSTANT },
  { id: 'ta-60.3-3.00', description: 'Tubo DIN 60,30mm x 3.00mm (DI 54,30mm)', weight: (60.30 - 3.00) * 3.00 * TUBE_WEIGHT_CONSTANT },
  { id: 'ta-76.1-2.00', description: 'Tubo DIN 76,10mm x 2.00mm (DI 72,10mm)', weight: (76.10 - 2.00) * 2.00 * TUBE_WEIGHT_CONSTANT },
  { id: 'ta-76.1-3.00', description: 'Tubo DIN 76,10mm x 3.00mm (DI 70,10mm)', weight: (76.10 - 3.00) * 3.00 * TUBE_WEIGHT_CONSTANT },
  { id: 'ta-88.9-2.00', description: 'Tubo DIN 88,90mm x 2.00mm (DI 84,90mm)', weight: (88.90 - 2.00) * 2.00 * TUBE_WEIGHT_CONSTANT },
  { id: 'ta-88.9-3.00', description: 'Tubo DIN 88,90mm x 3.00mm (DI 82,90mm)', weight: (88.90 - 3.00) * 3.00 * TUBE_WEIGHT_CONSTANT },
  { id: 'ta-101.6-2.00', description: 'Tubo DIN 101,60mm x 2.00mm (DI 97,60mm)', weight: (101.60 - 2.00) * 2.00 * TUBE_WEIGHT_CONSTANT },
  { id: 'ta-101.6-3.00', description: 'Tubo DIN 101,60mm x 3.00mm (DI 95,60mm)', weight: (101.60 - 3.00) * 3.00 * TUBE_WEIGHT_CONSTANT },
  { id: 'ta-114.3-3.00', description: 'Tubo DIN 114,30mm x 3.00mm (DI 108,30mm)', weight: (114.30 - 3.00) * 3.00 * TUBE_WEIGHT_CONSTANT },
];

export const CATEGORIES: Category[] = [
  {
    id: 'retalhos',
    name: 'Retalhos',
    description: 'Preencha os campos para calcular o valor.',
    icon: 'Scissors',
    unit: 'calc',
    items: [],
  },
  {
    id: 'package-checker',
    name: 'Conferência',
    description: 'Selecione item e insira os dados para calculo de metragem e custo.',
    icon: 'PackageCheck',
    unit: 'calc',
    items: [],
  },
  {
    id: 'balanca',
    name: 'Balança',
    description: 'Insira os dados de pesagem para calcular o peso líquido.',
    icon: 'Weight',
    unit: 'calc',
    items: [],
  },
  {
    id: 'tabela-sucata',
    name: 'Tabela Sucata',
    description: 'Tabela de preços e composição de sucatas.',
    icon: 'Trash2',
    unit: 'kg',
    items: scrapItems,
  },
  {
    id: 'tubos-od',
    name: 'Tubos OD',
    description: 'Tubos redondos com medidas em polegadas e parede em milímetros.',
    icon: 'Minus',
    unit: 'm',
    items: [
        { id: 't-3/8-0.70', description: 'Tubo OD 3/8" (9.52mm) x 0.70mm (DI 8.12mm)', weight: (9.52 - 0.70) * 0.70 * TUBE_WEIGHT_CONSTANT },
        { id: 't-3/8-1.00', description: 'Tubo OD 3/8" (9.52mm) x 1.00mm (DI 7.52mm)', weight: (9.52 - 1.00) * 1.00 * TUBE_WEIGHT_CONSTANT },
        { id: 't-3/8-1.20', description: 'Tubo OD 3/8" (9.52mm) x 1.20mm (DI 7.12mm)', weight: (9.52 - 1.20) * 1.20 * TUBE_WEIGHT_CONSTANT },
        { id: 't-3/8-1.50', description: 'Tubo OD 3/8" (9.52mm) x 1.50mm (DI 6.52mm)', weight: (9.52 - 1.50) * 1.50 * TUBE_WEIGHT_CONSTANT },
        { id: 't-1/2-1.00', description: 'Tubo OD 1/2" (12.70mm) x 1.00mm (DI 10.70mm)', weight: (12.70 - 1.00) * 1.00 * TUBE_WEIGHT_CONSTANT },
        { id: 't-1/2-1.20', description: 'Tubo OD 1/2" (12.70mm) x 1.20mm (DI 10.30mm)', weight: (12.70 - 1.20) * 1.20 * TUBE_WEIGHT_CONSTANT },
        { id: 't-1/2-1.50', description: 'Tubo OD 1/2" (12.70mm) x 1.50mm (DI 9.70mm)', weight: (12.70 - 1.50) * 1.50 * TUBE_WEIGHT_CONSTANT },
        { id: 't-5/8-1.00', description: 'Tubo OD 5/8" (15.88mm) x 1.00mm (DI 13.88mm)', weight: (15.88 - 1.00) * 1.00 * TUBE_WEIGHT_CONSTANT },
        { id: 't-5/8-1.20', description: 'Tubo OD 5/8" (15.88mm) x 1.20mm (DI 13.48mm)', weight: (15.88 - 1.20) * 1.20 * TUBE_WEIGHT_CONSTANT },
        { id: 't-5/8-1.50', description: 'Tubo OD 5/8" (15.88mm) x 1.50mm (DI 12.88mm)', weight: (15.88 - 1.50) * 1.50 * TUBE_WEIGHT_CONSTANT },
        { id: 't-3/4-1.00', description: 'Tubo OD 3/4" (19.05mm) x 1.00mm (DI 17.05mm)', weight: (19.05 - 1.00) * 1.00 * TUBE_WEIGHT_CONSTANT },
        { id: 't-3/4-1.20', description: 'Tubo OD 3/4" (19.05mm) x 1.20mm (DI 16.65mm)', weight: (19.05 - 1.20) * 1.20 * TUBE_WEIGHT_CONSTANT },
        { id: 't-3/4-1.50', description: 'Tubo OD 3/4" (19.05mm) x 1.50mm (DI 16.05mm)', weight: (19.05 - 1.50) * 1.50 * TUBE_WEIGHT_CONSTANT },
        { id: 't-1-1.00', description: 'Tubo OD 1" (25.40mm) x 1.00mm (DI 23.40mm)', weight: (25.40 - 1.00) * 1.00 * TUBE_WEIGHT_CONSTANT },
        { id: 't-1-1.20', description: 'Tubo OD 1" (25.40mm) x 1.20mm (DI 23.00mm)', weight: (25.40 - 1.20) * 1.20 * TUBE_WEIGHT_CONSTANT },
        { id: 't-1-1.50', description: 'Tubo OD 1" (25.40mm) x 1.50mm (DI 22.40mm)', weight: (25.40 - 1.50) * 1.50 * TUBE_WEIGHT_CONSTANT },
        { id: 't-1-2.00', description: 'Tubo OD 1" (25.40mm) x 2.00mm (DI 21.40mm)', weight: (25.40 - 2.00) * 2.00 * TUBE_WEIGHT_CONSTANT },
        { id: 't-1-2.50', description: 'Tubo OD 1" (25.40mm) x 2.50mm (DI 20.40mm)', weight: (25.40 - 2.50) * 2.50 * TUBE_WEIGHT_CONSTANT },
        { id: 't-1-3.00', description: 'Tubo OD 1" (25.40mm) x 3.00mm (DI 19.40mm)', weight: (25.40 - 3.00) * 3.00 * TUBE_WEIGHT_CONSTANT },
        { id: 't-1_1/4-1.00', description: 'Tubo OD 1.1/4" (31.75mm) x 1.00mm (DI 29.75mm)', weight: (31.75 - 1.00) * 1.00 * TUBE_WEIGHT_CONSTANT },
        { id: 't-1_1/4-1.20', description: 'Tubo OD 1.1/4" (31.75mm) x 1.20mm (DI 29.35mm)', weight: (31.75 - 1.20) * 1.20 * TUBE_WEIGHT_CONSTANT },
        { id: 't-1_1/4-1.50', description: 'Tubo OD 1.1/4" (31.75mm) x 1.50mm (DI 28.75mm)', weight: (31.75 - 1.50) * 1.50 * TUBE_WEIGHT_CONSTANT },
        { id: 't-1_1/4-2.00', description: 'Tubo OD 1.1/4" (31.75mm) x 2.00mm (DI 27.75mm)', weight: (31.75 - 2.00) * 2.00 * TUBE_WEIGHT_CONSTANT },
        { id: 't-1_1/4-2.50', description: 'Tubo OD 1.1/4" (31.75mm) x 2.50mm (DI 26.75mm)', weight: (31.75 - 2.50) * 2.50 * TUBE_WEIGHT_CONSTANT },
        { id: 't-1_1/4-3.00', description: 'Tubo OD 1.1/4" (31.75mm) x 3.00mm (DI 25.75mm)', weight: (31.75 - 3.00) * 3.00 * TUBE_WEIGHT_CONSTANT },
        { id: 't-1_1/2-1.00', description: 'Tubo OD 1.1/2" (38.10mm) x 1.00mm (DI 36.10mm)', weight: (38.10 - 1.00) * 1.00 * TUBE_WEIGHT_CONSTANT },
        { id: 't-1_1/2-1.20', description: 'Tubo OD 1.1/2" (38.10mm) x 1.20mm (DI 35.70mm)', weight: (38.10 - 1.20) * 1.20 * TUBE_WEIGHT_CONSTANT },
        { id: 't-1_1/2-1.50', description: 'Tubo OD 1.1/2" (38.10mm) x 1.50mm (DI 35.10mm)', weight: (38.10 - 1.50) * 1.50 * TUBE_WEIGHT_CONSTANT },
        { id: 't-1_1/2-2.00', description: 'Tubo OD 1.1/2" (38.10mm) x 2.00mm (DI 34.10mm)', weight: (38.10 - 2.00) * 2.00 * TUBE_WEIGHT_CONSTANT },
        { id: 't-1_1/2-2.50', description: 'Tubo OD 1.1/2" (38.10mm) x 2.50mm (DI 33.10mm)', weight: (38.10 - 2.50) * 2.50 * TUBE_WEIGHT_CONSTANT },
        { id: 't-1_1/2-3.00', description: 'Tubo OD 1.1/2" (38.10mm) x 3.00mm (DI 32.10mm)', weight: (38.10 - 3.00) * 3.00 * TUBE_WEIGHT_CONSTANT },
        { id: 't-2-1.00', description: 'Tubo OD 2" (50.80mm) x 1.00mm (DI 48.80mm)', weight: (50.80 - 1.00) * 1.00 * TUBE_WEIGHT_CONSTANT },
        { id: 't-2-1.20', description: 'Tubo OD 2" (50.80mm) x 1.20mm (DI 48.40mm)', weight: (50.80 - 1.20) * 1.20 * TUBE_WEIGHT_CONSTANT },
        { id: 't-2-1.50', description: 'Tubo OD 2" (50.80mm) x 1.50mm (DI 47.80mm)', weight: (50.80 - 1.50) * 1.50 * TUBE_WEIGHT_CONSTANT },
        { id: 't-2-2.00', description: 'Tubo OD 2" (50.80mm) x 2.00mm (DI 46.80mm)', weight: (50.80 - 2.00) * 2.00 * TUBE_WEIGHT_CONSTANT },
        { id: 't-2-2.50', description: 'Tubo OD 2" (50.80mm) x 2.50mm (DI 45.80mm)', weight: (50.80 - 2.50) * 2.50 * TUBE_WEIGHT_CONSTANT },
        { id: 't-2-3.00', description: 'Tubo OD 2" (50.80mm) x 3.00mm (DI 44.80mm)', weight: (50.80 - 3.00) * 3.00 * TUBE_WEIGHT_CONSTANT },
        { id: 't-2_1/2-1.20', description: 'Tubo OD 2.1/2" (63.50mm) x 1.20mm (DI 61.10mm)', weight: (63.50 - 1.20) * 1.20 * TUBE_WEIGHT_CONSTANT },
        { id: 't-2_1/2-1.50', description: 'Tubo OD 2.1/2" (63.50mm) x 1.50mm (DI 60.50mm)', weight: (63.50 - 1.50) * 1.50 * TUBE_WEIGHT_CONSTANT },
        { id: 't-2_1/2-2.00', description: 'Tubo OD 2.1/2" (63.50mm) x 2.00mm (DI 59.50mm)', weight: (63.50 - 2.00) * 2.00 * TUBE_WEIGHT_CONSTANT },
        { id: 't-2_1/2-3.00', description: 'Tubo OD 2.1/2" (63.50mm) x 3.00mm (DI 57.50mm)', weight: (63.50 - 3.00) * 3.00 * TUBE_WEIGHT_CONSTANT },
        { id: 't-3-1.20', description: 'Tubo OD 3" (76.20mm) x 1.20mm (DI 73.80mm)', weight: (76.20 - 1.20) * 1.20 * TUBE_WEIGHT_CONSTANT },
        { id: 't-3-1.50', description: 'Tubo OD 3" (76.20mm) x 1.50mm (DI 73.20mm)', weight: (76.20 - 1.50) * 1.50 * TUBE_WEIGHT_CONSTANT },
        { id: 't-3-2.00', description: 'Tubo OD 3" (76.20mm) x 2.00mm (DI 72.20mm)', weight: (76.20 - 2.00) * 2.00 * TUBE_WEIGHT_CONSTANT },
        { id: 't-3-3.00', description: 'Tubo OD 3" (76.20mm) x 3.00mm (DI 70.20mm)', weight: (76.20 - 3.00) * 3.00 * TUBE_WEIGHT_CONSTANT },
        { id: 't-4-1.50', description: 'Tubo OD 4" (101.60mm) x 1.50mm (DI 98.60mm)', weight: (101.60 - 1.50) * 1.50 * TUBE_WEIGHT_CONSTANT },
        { id: 't-4-2.00', description: 'Tubo OD 4" (101.60mm) x 2.00mm (DI 97.60mm)', weight: (101.60 - 2.00) * 2.00 * TUBE_WEIGHT_CONSTANT },
        { id: 't-4-3.00', description: 'Tubo OD 4" (101.60mm) x 3.00mm (DI 95.60mm)', weight: (101.60 - 3.00) * 3.00 * TUBE_WEIGHT_CONSTANT },
        { id: 't-5-2.00', description: 'Tubo OD 5" (127.00mm) x 2.00mm (DI 123.00mm)', weight: (127.00 - 2.00) * 2.00 * TUBE_WEIGHT_CONSTANT },
        { id: 't-5-3.00', description: 'Tubo OD 5" (127.00mm) x 3.00mm (DI 121.00mm)', weight: (127.00 - 3.00) * 3.00 * TUBE_WEIGHT_CONSTANT },
        { id: 't-6-2.00', description: 'Tubo OD 6" (152.40mm) x 2.00mm (DI 148.40mm)', weight: (152.40 - 2.00) * 2.00 * TUBE_WEIGHT_CONSTANT },
        { id: 't-6-3.00', description: 'Tubo OD 6" (152.40mm) x 3.00mm (DI 146.40mm)', weight: (152.40 - 3.00) * 3.00 * TUBE_WEIGHT_CONSTANT },
        { id: 't-8-2.00', description: 'Tubo OD 8" (203.20mm) x 2.00mm (DI 199.20mm)', weight: (203.20 - 2.00) * 2.00 * TUBE_WEIGHT_CONSTANT },
        { id: 't-8-3.00', description: 'Tubo OD 8" (203.20mm) x 3.00mm (DI 197.20mm)', weight: (203.20 - 3.00) * 3.00 * TUBE_WEIGHT_CONSTANT },
        { id: 't-10-2.00', description: 'Tubo OD 10" (254.00mm) x 2.00mm (DI 250.00mm)', weight: (254.00 - 2.00) * 2.00 * TUBE_WEIGHT_CONSTANT },
        { id: 't-10-3.00', description: 'Tubo OD 10" (254.00mm) x 3.00mm (DI 248.00mm)', weight: (254.00 - 3.00) * 3.00 * TUBE_WEIGHT_CONSTANT },
        { id: 't-12-2.00', description: 'Tubo OD 12" (304.80mm) x 2.00mm (DI 300.80mm)', weight: (304.80 - 2.00) * 2.00 * TUBE_WEIGHT_CONSTANT },
        { id: 't-12-3.00', description: 'Tubo OD 12" (304.80mm) x 3.00mm (DI 298.80mm)', weight: (304.80 - 3.00) * 3.00 * TUBE_WEIGHT_CONSTANT },
    ],
  },
  {
    id: 'tubos-alianca',
    name: 'Tubos Aliança (DIN)',
    description: 'Tubos redondos padrão DIN 2458.',
    icon: 'GalleryVertical',
    unit: 'm',
    items: tubosAliancaItems,
  },
  {
    id: 'chapas',
    name: 'Chapas',
    description: 'Chapas de aço inoxidável em diversas espessuras e dimensões.',
    icon: 'Square',
    unit: 'un',
    items: generateChapas(),
  },
  {
    id: 'barras-redondas',
    name: 'Barras Redondas',
    description: 'Barras redondas maciças em diversas bitolas.',
    icon: 'Circle',
    unit: 'm',
    items: [
      { id: 'br-1/8', description: 'Barra Redonda 1/8" (3.17mm)', weight: Math.pow(3.17, 2) * ROUND_BAR_WEIGHT_CONSTANT },
      { id: 'br-5/32', description: 'Barra Redonda 5/32" (3.97mm)', weight: Math.pow(3.97, 2) * ROUND_BAR_WEIGHT_CONSTANT },
      { id: 'br-3/16', description: 'Barra Redonda 3/16" (4.76mm)', weight: Math.pow(4.76, 2) * ROUND_BAR_WEIGHT_CONSTANT },
      { id: 'br-1/4', description: 'Barra Redonda 1/4" (6.35mm)', weight: Math.pow(6.35, 2) * ROUND_BAR_WEIGHT_CONSTANT },
      { id: 'br-5/16', description: 'Barra Redonda 5/16" (7.94mm)', weight: Math.pow(7.94, 2) * ROUND_BAR_WEIGHT_CONSTANT },
      { id: 'br-3/8', description: 'Barra Redonda 3/8" (9.52mm)', weight: Math.pow(9.52, 2) * ROUND_BAR_WEIGHT_CONSTANT },
      { id: 'br-7/16', description: 'Barra Redonda 7/16" (11.11mm)', weight: Math.pow(11.11, 2) * ROUND_BAR_WEIGHT_CONSTANT },
      { id: 'br-1/2', description: 'Barra Redonda 1/2" (12.70mm)', weight: Math.pow(12.70, 2) * ROUND_BAR_WEIGHT_CONSTANT },
      { id: 'br-9/16', description: 'Barra Redonda 9/16" (14.29mm)', weight: Math.pow(14.29, 2) * ROUND_BAR_WEIGHT_CONSTANT },
      { id: 'br-5/8', description: 'Barra Redonda 5/8" (15.88mm)', weight: Math.pow(15.88, 2) * ROUND_BAR_WEIGHT_CONSTANT },
      { id: 'br-3/4', description: 'Barra Redonda 3/4" (19.05mm)', weight: Math.pow(19.05, 2) * ROUND_BAR_WEIGHT_CONSTANT },
      { id: 'br-7/8', description: 'Barra Redonda 7/8" (22.22mm)', weight: Math.pow(22.22, 2) * ROUND_BAR_WEIGHT_CONSTANT },
      { id: 'br-1', description: 'Barra Redonda 1" (25.40mm)', weight: Math.pow(25.40, 2) * ROUND_BAR_WEIGHT_CONSTANT },
      { id: 'br-1.1/8', description: 'Barra Redonda 1.1/8" (28.58mm)', weight: Math.pow(28.58, 2) * ROUND_BAR_WEIGHT_CONSTANT },
      { id: 'br-1.1/4', description: 'Barra Redonda 1.1/4" (31.75mm)', weight: Math.pow(31.75, 2) * ROUND_BAR_WEIGHT_CONSTANT },
      { id: 'br-1.3/8', description: 'Barra Redonda 1.3/8" (34.92mm)', weight: Math.pow(34.92, 2) * ROUND_BAR_WEIGHT_CONSTANT },
      { id: 'br-1.1/2', description: 'Barra Redonda 1.1/2" (38.10mm)', weight: Math.pow(38.10, 2) * ROUND_BAR_WEIGHT_CONSTANT },
      { id: 'br-1.5/8', description: 'Barra Redonda 1.5/8" (41.28mm)', weight: Math.pow(41.28, 2) * ROUND_BAR_WEIGHT_CONSTANT },
      { id: 'br-1.3/4', description: 'Barra Redonda 1.3/4" (44.45mm)', weight: Math.pow(44.45, 2) * ROUND_BAR_WEIGHT_CONSTANT },
      { id: 'br-2', description: 'Barra Redonda 2" (50.80mm)', weight: Math.pow(50.80, 2) * ROUND_BAR_WEIGHT_CONSTANT },
      { id: 'br-2.1/4', description: 'Barra Redonda 2.1/4" (57.15mm)', weight: Math.pow(57.15, 2) * ROUND_BAR_WEIGHT_CONSTANT },
      { id: 'br-2.1/2', description: 'Barra Redonda 2.1/2" (63.50mm)', weight: Math.pow(63.50, 2) * ROUND_BAR_WEIGHT_CONSTANT },
      { id: 'br-2.5/8', description: 'Barra Redonda 2.5/8" (66.67mm)', weight: Math.pow(66.67, 2) * ROUND_BAR_WEIGHT_CONSTANT },
      { id: 'br-2.3/4', description: 'Barra Redonda 2.3/4" (69.85mm)', weight: Math.pow(69.85, 2) * ROUND_BAR_WEIGHT_CONSTANT },
      { id: 'br-3', description: 'Barra Redonda 3" (76.20mm)', weight: Math.pow(76.20, 2) * ROUND_BAR_WEIGHT_CONSTANT },
      { id: 'br-3.1/4', description: 'Barra Redonda 3.1/4" (82.55mm)', weight: Math.pow(82.55, 2) * ROUND_BAR_WEIGHT_CONSTANT },
      { id: 'br-3.1/2', description: 'Barra Redonda 3.1/2" (88.90mm)', weight: Math.pow(88.90, 2) * ROUND_BAR_WEIGHT_CONSTANT },
      { id: 'br-4', description: 'Barra Redonda 4" (101.60mm)', weight: Math.pow(101.60, 2) * ROUND_BAR_WEIGHT_CONSTANT },
      { id: 'br-4.1/2', description: 'Barra Redonda 4.1/2" (114.30mm)', weight: Math.pow(114.30, 2) * ROUND_BAR_WEIGHT_CONSTANT },
      { id: 'br-5', description: 'Barra Redonda 5" (127.00mm)', weight: Math.pow(127.00, 2) * ROUND_BAR_WEIGHT_CONSTANT },
      { id: 'br-5.1/2', description: 'Barra Redonda 5.1/2" (139.70mm)', weight: Math.pow(139.70, 2) * ROUND_BAR_WEIGHT_CONSTANT },
      { id: 'br-6', description: 'Barra Redonda 6" (152.40mm)', weight: Math.pow(152.40, 2) * ROUND_BAR_WEIGHT_CONSTANT },
      { id: 'br-6.1/2', description: 'Barra Redonda 6.1/2" (165.10mm)', weight: Math.pow(165.10, 2) * ROUND_BAR_WEIGHT_CONSTANT },
      { id: 'br-7', description: 'Barra Redonda 7" (177.80mm)', weight: Math.pow(177.80, 2) * ROUND_BAR_WEIGHT_CONSTANT },
      { id: 'br-8', description: 'Barra Redonda 8" (203.20mm)', weight: Math.pow(203.20, 2) * ROUND_BAR_WEIGHT_CONSTANT },
      { id: 'br-9', description: 'Barra Redonda 9" (228.60mm)', weight: Math.pow(228.60, 2) * ROUND_BAR_WEIGHT_CONSTANT },
      { id: 'br-10', description: 'Barra Redonda 10" (254.00mm)', weight: Math.pow(254.00, 2) * ROUND_BAR_WEIGHT_CONSTANT },
    ],
  },
  {
    id: 'barra-quadrada',
    name: 'Barra Quadrada',
    description: 'Barras quadradas maciças em diversas bitolas.',
    icon: 'Square',
    unit: 'm',
    items: [
      { id: 'bq-1/8', description: 'Barra Quadrada 1/8" (3.17mm)', weight: Math.pow(3.17, 2) * SQUARE_BAR_WEIGHT_CONSTANT },
      { id: 'bq-5/32', description: 'Barra Quadrada 5/32" (3.97mm)', weight: Math.pow(3.97, 2) * SQUARE_BAR_WEIGHT_CONSTANT },
      { id: 'bq-3/16', description: 'Barra Quadrada 3/16" (4.76mm)', weight: Math.pow(4.76, 2) * SQUARE_BAR_WEIGHT_CONSTANT },
      { id: 'bq-1/4', description: 'Barra Quadrada 1/4" (6.35mm)', weight: Math.pow(6.35, 2) * SQUARE_BAR_WEIGHT_CONSTANT },
      { id: 'bq-5/16', description: 'Barra Quadrada 5/16" (7.94mm)', weight: Math.pow(7.94, 2) * SQUARE_BAR_WEIGHT_CONSTANT },
      { id: 'bq-3/8', description: 'Barra Quadrada 3/8" (9.52mm)', weight: Math.pow(9.52, 2) * SQUARE_BAR_WEIGHT_CONSTANT },
      { id: 'bq-7/16', description: 'Barra Quadrada 7/16" (11.11mm)', weight: Math.pow(11.11, 2) * SQUARE_BAR_WEIGHT_CONSTANT },
      { id: 'bq-1/2', description: 'Barra Quadrada 1/2" (12.70mm)', weight: Math.pow(12.70, 2) * SQUARE_BAR_WEIGHT_CONSTANT },
      { id: 'bq-9/16', description: 'Barra Quadrada 9/16" (14.29mm)', weight: Math.pow(14.29, 2) * SQUARE_BAR_WEIGHT_CONSTANT },
      { id: 'bq-5/8', description: 'Barra Quadrada 5/8" (15.88mm)', weight: Math.pow(15.88, 2) * SQUARE_BAR_WEIGHT_CONSTANT },
      { id: 'bq-3/4', description: 'Barra Quadrada 3/4" (19.05mm)', weight: Math.pow(19.05, 2) * SQUARE_BAR_WEIGHT_CONSTANT },
      { id: 'bq-7/8', description: 'Barra Quadrada 7/8" (22.22mm)', weight: Math.pow(22.22, 2) * SQUARE_BAR_WEIGHT_CONSTANT },
      { id: 'bq-1', description: 'Barra Quadrada 1" (25.40mm)', weight: Math.pow(25.40, 2) * SQUARE_BAR_WEIGHT_CONSTANT },
      { id: 'bq-1.1/8', description: 'Barra Quadrada 1.1/8" (28.58mm)', weight: Math.pow(28.58, 2) * SQUARE_BAR_WEIGHT_CONSTANT },
      { id: 'bq-1.1/4', description: 'Barra Quadrada 1.1/4" (31.75mm)', weight: Math.pow(31.75, 2) * SQUARE_BAR_WEIGHT_CONSTANT },
      { id: 'bq-1.3/8', description: 'Barra Quadrada 1.3/8" (34.92mm)', weight: Math.pow(34.92, 2) * SQUARE_BAR_WEIGHT_CONSTANT },
      { id: 'bq-1.1/2', description: 'Barra Quadrada 1.1/2" (38.10mm)', weight: Math.pow(38.10, 2) * SQUARE_BAR_WEIGHT_CONSTANT },
      { id: 'bq-1.5/8', description: 'Barra Quadrada 1.5/8" (41.28mm)', weight: Math.pow(41.28, 2) * SQUARE_BAR_WEIGHT_CONSTANT },
      { id: 'bq-1.3/4', description: 'Barra Quadrada 1.3/4" (44.45mm)', weight: Math.pow(44.45, 2) * SQUARE_BAR_WEIGHT_CONSTANT },
      { id: 'bq-2', description: 'Barra Quadrada 2" (50.80mm)', weight: Math.pow(50.80, 2) * SQUARE_BAR_WEIGHT_CONSTANT },
      { id: 'bq-2.1/4', description: 'Barra Quadrada 2.1/4" (57.15mm)', weight: Math.pow(57.15, 2) * SQUARE_BAR_WEIGHT_CONSTANT },
      { id: 'bq-2.1/2', description: 'Barra Quadrada 2.1/2" (63.50mm)', weight: Math.pow(63.50, 2) * SQUARE_BAR_WEIGHT_CONSTANT },
      { id: 'bq-2.5/8', description: 'Barra Quadrada 2.5/8" (66.67mm)', weight: Math.pow(66.67, 2) * SQUARE_BAR_WEIGHT_CONSTANT },
      { id: 'bq-2.3/4', description: 'Barra Quadrada 2.3/4" (69.85mm)', weight: Math.pow(69.85, 2) * SQUARE_BAR_WEIGHT_CONSTANT },
      { id: 'bq-3', description: 'Barra Quadrada 3" (76.20mm)', weight: Math.pow(76.20, 2) * SQUARE_BAR_WEIGHT_CONSTANT },
    ],
  },
  {
    id: 'barra-sextavada',
    name: 'Barra Sextavada',
    description: 'Barras sextavadas maciças em diversas bitolas.',
    icon: 'Hexagon',
    unit: 'm',
    items: [
      { id: 'bs-1/8', description: 'Barra Sextavada 1/8" (3.17mm)', weight: Math.pow(3.17, 2) * HEXAGONAL_BAR_WEIGHT_CONSTANT },
      { id: 'bs-5/32', description: 'Barra Sextavada 5/32" (3.97mm)', weight: Math.pow(3.97, 2) * HEXAGONAL_BAR_WEIGHT_CONSTANT },
      { id: 'bs-3/16', description: 'Barra Sextavada 3/16" (4.76mm)', weight: Math.pow(4.76, 2) * HEXAGONAL_BAR_WEIGHT_CONSTANT },
      { id: 'bs-1/4', description: 'Barra Sextavada 1/4" (6.35mm)', weight: Math.pow(6.35, 2) * HEXAGONAL_BAR_WEIGHT_CONSTANT },
      { id: 'bs-5/16', description: 'Barra Sextavada 5/16" (7.94mm)', weight: Math.pow(7.94, 2) * HEXAGONAL_BAR_WEIGHT_CONSTANT },
      { id: 'bs-3/8', description: 'Barra Sextavada 3/8" (9.52mm)', weight: Math.pow(9.52, 2) * HEXAGONAL_BAR_WEIGHT_CONSTANT },
      { id: 'bs-7/16', description: 'Barra Sextavada 7/16" (11.11mm)', weight: Math.pow(11.11, 2) * HEXAGONAL_BAR_WEIGHT_CONSTANT },
      { id: 'bs-1/2', description: 'Barra Sextavada 1/2" (12.70mm)', weight: Math.pow(12.70, 2) * HEXAGONAL_BAR_WEIGHT_CONSTANT },
      { id: 'bs-9/16', description: 'Barra Sextavada 9/16" (14.29mm)', weight: Math.pow(14.29, 2) * HEXAGONAL_BAR_WEIGHT_CONSTANT },
      { id: 'bs-5/8', description: 'Barra Sextavada 5/8" (15.88mm)', weight: Math.pow(15.88, 2) * HEXAGONAL_BAR_WEIGHT_CONSTANT },
      { id: 'bs-3/4', description: 'Barra Sextavada 3/4" (19.05mm)', weight: Math.pow(19.05, 2) * HEXAGONAL_BAR_WEIGHT_CONSTANT },
      { id: 'bs-7/8', description: 'Barra Sextavada 7/8" (22.22mm)', weight: Math.pow(22.22, 2) * HEXAGONAL_BAR_WEIGHT_CONSTANT },
      { id: 'bs-1', description: 'Barra Sextavada 1" (25.40mm)', weight: Math.pow(25.40, 2) * HEXAGONAL_BAR_WEIGHT_CONSTANT },
      { id: 'bs-1.1/8', description: 'Barra Sextavada 1.1/8" (28.58mm)', weight: Math.pow(28.58, 2) * HEXAGONAL_BAR_WEIGHT_CONSTANT },
      { id: 'bs-1.1/4', description: 'Barra Sextavada 1.1/4" (31.75mm)', weight: Math.pow(31.75, 2) * HEXAGONAL_BAR_WEIGHT_CONSTANT },
      { id: 'bs-1.3/8', description: 'Barra Sextavada 1.3/8" (34.92mm)', weight: Math.pow(34.92, 2) * HEXAGONAL_BAR_WEIGHT_CONSTANT },
      { id: 'bs-1.1/2', description: 'Barra Sextavada 1.1/2" (38.10mm)', weight: Math.pow(38.10, 2) * HEXAGONAL_BAR_WEIGHT_CONSTANT },
      { id: 'bs-1.5/8', description: 'Barra Sextavada 1.5/8" (41.28mm)', weight: Math.pow(41.28, 2) * HEXAGONAL_BAR_WEIGHT_CONSTANT },
      { id: 'bs-1.3/4', description: 'Barra Sextavada 1.3/4" (44.45mm)', weight: Math.pow(44.45, 2) * HEXAGONAL_BAR_WEIGHT_CONSTANT },
      { id: 'bs-2', description: 'Barra Sextavada 2" (50.80mm)', weight: Math.pow(50.80, 2) * HEXAGONAL_BAR_WEIGHT_CONSTANT },
      { id: 'bs-2.1/4', description: 'Barra Sextavada 2.1/4" (57.15mm)', weight: Math.pow(57.15, 2) * HEXAGONAL_BAR_WEIGHT_CONSTANT },
      { id: 'bs-2.1/2', description: 'Barra Sextavada 2.1/2" (63.50mm)', weight: Math.pow(63.50, 2) * HEXAGONAL_BAR_WEIGHT_CONSTANT },
      { id: 'bs-2.5/8', description: 'Barra Sextavada 2.5/8" (66.67mm)', weight: Math.pow(66.67, 2) * HEXAGONAL_BAR_WEIGHT_CONSTANT },
      { id: 'bs-2.3/4', description: 'Barra Sextavada 2.3/4" (69.85mm)', weight: Math.pow(69.85, 2) * HEXAGONAL_BAR_WEIGHT_CONSTANT },
      { id: 'bs-3', description: 'Barra Sextavada 3" (76.20mm)', weight: Math.pow(76.20, 2) * HEXAGONAL_BAR_WEIGHT_CONSTANT },
    ]
  },
  {
    id: 'tubos-schedule',
    name: 'Tubos Schedule',
    description: 'Tubos redondos para condução de fluídos, norma Schedule.',
    icon: 'Layers',
    unit: 'm',
    items: [
      { id: 'ts-3/8-sch5', description: 'Tubo Schedule 3/8" SCH 5 (17.14mm x 1.65mm) (DI 13.84mm)', weight: (17.14 - 1.65) * 1.65 * TUBE_WEIGHT_CONSTANT },
      { id: 'ts-3/8-sch10', description: 'Tubo Schedule 3/8" SCH 10 (17.14mm x 2.31mm) (DI 12.52mm)', weight: (17.14 - 2.31) * 2.31 * TUBE_WEIGHT_CONSTANT },
      { id: 'ts-3/8-sch40', description: 'Tubo Schedule 3/8" SCH 40 (17.14mm x 3.20mm) (DI 10.74mm)', weight: (17.14 - 3.20) * 3.20 * TUBE_WEIGHT_CONSTANT },
      { id: 'ts-1/2-sch5', description: 'Tubo Schedule 1/2" SCH 5 (21.34mm x 1.65mm) (DI 18.04mm)', weight: (21.34 - 1.65) * 1.65 * TUBE_WEIGHT_CONSTANT },
      { id: 'ts-1/2-sch10', description: 'Tubo Schedule 1/2" SCH 10 (21.34mm x 2.11mm) (DI 17.12mm)', weight: (21.34 - 2.11) * 2.11 * TUBE_WEIGHT_CONSTANT },
      { id: 'ts-1/2-sch40', description: 'Tubo Schedule 1/2" SCH 40 (21.34mm x 2.77mm) (DI 15.80mm)', weight: (21.34 - 2.77) * 2.77 * TUBE_WEIGHT_CONSTANT },
      { id: 'ts-3/4-sch5', description: 'Tubo Schedule 3/4" SCH 5 (26.67mm x 1.65mm) (DI 23.37mm)', weight: (26.67 - 1.65) * 1.65 * TUBE_WEIGHT_CONSTANT },
      { id: 'ts-3/4-sch10', description: 'Tubo Schedule 3/4" SCH 10 (26.67mm x 2.11mm) (DI 22.45mm)', weight: (26.67 - 2.11) * 2.11 * TUBE_WEIGHT_CONSTANT },
      { id: 'ts-3/4-sch40', description: 'Tubo Schedule 3/4" SCH 40 (26.67mm x 2.87mm) (DI 20.93mm)', weight: (26.67 - 2.87) * 2.87 * TUBE_WEIGHT_CONSTANT },
      { id: 'ts-1-sch5', description: 'Tubo Schedule 1" SCH 5 (33.40mm x 1.65mm) (DI 30.10mm)', weight: (33.40 - 1.65) * 1.65 * TUBE_WEIGHT_CONSTANT },
      { id: 'ts-1-sch10', description: 'Tubo Schedule 1" SCH 10 (33.40mm x 2.77mm) (DI 27.86mm)', weight: (33.40 - 2.77) * 2.77 * TUBE_WEIGHT_CONSTANT },
      { id: 'ts-1-sch40', description: 'Tubo Schedule 1" SCH 40 (33.40mm x 3.38mm) (DI 26.64mm)', weight: (33.40 - 3.38) * 3.38 * TUBE_WEIGHT_CONSTANT },
      { id: 'ts-1_1/4-sch5', description: 'Tubo Schedule 1 1/4" SCH 5 (42.16mm x 1.65mm) (DI 38.86mm)', weight: (42.16 - 1.65) * 1.65 * TUBE_WEIGHT_CONSTANT },
      { id: 'ts-1_1/4-sch10', description: 'Tubo Schedule 1 1/4" SCH 10 (42.16mm x 2.77mm) (DI 36.62mm)', weight: (42.16 - 2.77) * 2.77 * TUBE_WEIGHT_CONSTANT },
      { id: 'ts-1_1/4-sch40', description: 'Tubo Schedule 1 1/4" SCH 40 (42.16mm x 3.56mm) (DI 35.04mm)', weight: (42.16 - 3.56) * 3.56 * TUBE_WEIGHT_CONSTANT },
      { id: 'ts-1_1/2-sch5', description: 'Tubo Schedule 1 1/2" SCH 5 (48.26mm x 1.65mm) (DI 44.96mm)', weight: (48.26 - 1.65) * 1.65 * TUBE_WEIGHT_CONSTANT },
      { id: 'ts-1_1/2-sch10', description: 'Tubo Schedule 1 1/2" SCH 10 (48.26mm x 2.77mm) (DI 42.72mm)', weight: (48.26 - 2.77) * 2.77 * TUBE_WEIGHT_CONSTANT },
      { id: 'ts-1_1/2-sch40', description: 'Tubo Schedule 1 1/2" SCH 40 (48.26mm x 3.68mm) (DI 40.90mm)', weight: (48.26 - 3.68) * 3.68 * TUBE_WEIGHT_CONSTANT },
      { id: 'ts-2-sch5', description: 'Tubo Schedule 2" SCH 5 (60.33mm x 1.65mm) (DI 57.03mm)', weight: (60.33 - 1.65) * 1.65 * TUBE_WEIGHT_CONSTANT },
      { id: 'ts-2-sch10', description: 'Tubo Schedule 2" SCH 10 (60.33mm x 2.77mm) (DI 54.79mm)', weight: (60.33 - 2.77) * 2.77 * TUBE_WEIGHT_CONSTANT },
      { id: 'ts-2-sch40', description: 'Tubo Schedule 2" SCH 40 (60.33mm x 3.91mm) (DI 52.51mm)', weight: (60.33 - 3.91) * 3.91 * TUBE_WEIGHT_CONSTANT },
      { id: 'ts-2_1/2-sch5', description: 'Tubo Schedule 2 1/2" SCH 5 (73.03mm x 2.11mm) (DI 68.81mm)', weight: (73.03 - 2.11) * 2.11 * TUBE_WEIGHT_CONSTANT },
      { id: 'ts-2_1/2-sch10', description: 'Tubo Schedule 2 1/2" SCH 10 (73.03mm x 3.05mm) (DI 66.93mm)', weight: (73.03 - 3.05) * 3.05 * TUBE_WEIGHT_CONSTANT },
      { id: 'ts-2_1/2-sch40', description: 'Tubo Schedule 2 1/2" SCH 40 (73.03mm x 5.16mm) (DI 62.71mm)', weight: (73.03 - 5.16) * 5.16 * TUBE_WEIGHT_CONSTANT },
      { id: 'ts-3-sch5', description: 'Tubo Schedule 3" SCH 5 (88.90mm x 2.11mm) (DI 84.68mm)', weight: (88.90 - 2.11) * 2.11 * TUBE_WEIGHT_CONSTANT },
      { id: 'ts-3-sch10', description: 'Tubo Schedule 3" SCH 10 (88.90mm x 3.05mm) (DI 82.80mm)', weight: (88.90 - 3.05) * 3.05 * TUBE_WEIGHT_CONSTANT },
      { id: 'ts-3-sch40', description: 'Tubo Schedule 3" SCH 40 (88.90mm x 5.49mm) (DI 77.92mm)', weight: (88.90 - 5.49) * 5.49 * TUBE_WEIGHT_CONSTANT },
      { id: 'ts-4-sch5', description: 'Tubo Schedule 4" SCH 5 (114.30mm x 2.11mm) (DI 110.08mm)', weight: (114.30 - 2.11) * 2.11 * TUBE_WEIGHT_CONSTANT },
      { id: 'ts-4-sch10', description: 'Tubo Schedule 4" SCH 10 (114.30mm x 3.05mm) (DI 108.20mm)', weight: (114.30 - 3.05) * 3.05 * TUBE_WEIGHT_CONSTANT },
      { id: 'ts-4-sch40', description: 'Tubo Schedule 4" SCH 40 (114.30mm x 6.02mm) (DI 102.26mm)', weight: (114.30 - 6.02) * 6.02 * TUBE_WEIGHT_CONSTANT },
      { id: 'ts-5-sch5', description: 'Tubo Schedule 5" SCH 5 (141.30mm x 2.77mm) (DI 135.76mm)', weight: (141.30 - 2.77) * 2.77 * TUBE_WEIGHT_CONSTANT },
      { id: 'ts-5-sch10', description: 'Tubo Schedule 5" SCH 10 (141.30mm x 3.40mm) (DI 134.50mm)', weight: (141.30 - 3.40) * 3.40 * TUBE_WEIGHT_CONSTANT },
      { id: 'ts-5-sch40', description: 'Tubo Schedule 5" SCH 40 (141.30mm x 6.55mm) (DI 128.20mm)', weight: (141.30 - 6.55) * 6.55 * TUBE_WEIGHT_CONSTANT },
      { id: 'ts-6-sch5', description: 'Tubo Schedule 6" SCH 5 (168.28mm x 2.77mm) (DI 162.74mm)', weight: (168.28 - 2.77) * 2.77 * TUBE_WEIGHT_CONSTANT },
      { id: 'ts-6-sch10', description: 'Tubo Schedule 6" SCH 10 (168.28mm x 3.40mm) (DI 161.48mm)', weight: (168.28 - 3.40) * 3.40 * TUBE_WEIGHT_CONSTANT },
      { id: 'ts-6-sch40', description: 'Tubo Schedule 6" SCH 40 (168.28mm x 7.11mm) (DI 154.06mm)', weight: (168.28 - 7.11) * 7.11 * TUBE_WEIGHT_CONSTANT },
      { id: 'ts-8-sch5', description: 'Tubo Schedule 8" SCH 5 (219.08mm x 2.77mm) (DI 213.54mm)', weight: (219.08 - 2.77) * 2.77 * TUBE_WEIGHT_CONSTANT },
      { id: 'ts-8-sch10', description: 'Tubo Schedule 8" SCH 10 (219.08mm x 3.76mm) (DI 211.56mm)', weight: (219.08 - 3.76) * 3.76 * TUBE_WEIGHT_CONSTANT },
      { id: 'ts-8-sch40', description: 'Tubo Schedule 8" SCH 40 (219.08mm x 8.18mm) (DI 202.72mm)', weight: (219.08 - 8.18) * 8.18 * TUBE_WEIGHT_CONSTANT },
      { id: 'ts-10-sch5', description: 'Tubo Schedule 10" SCH 5 (273.05mm x 3.40mm) (DI 266.25mm)', weight: (273.05 - 3.40) * 3.40 * TUBE_WEIGHT_CONSTANT },
      { id: 'ts-10-sch10', description: 'Tubo Schedule 10" SCH 10 (273.05mm x 4.19mm) (DI 264.67mm)', weight: (273.05 - 4.19) * 4.19 * TUBE_WEIGHT_CONSTANT },
      { id: 'ts-10-sch40', description: 'Tubo Schedule 10" SCH 40 (273.05mm x 9.27mm) (DI 254.51mm)', weight: (273.05 - 9.27) * 9.27 * TUBE_WEIGHT_CONSTANT },
      { id: 'ts-12-sch5', description: 'Tubo Schedule 12" SCH 5 (323.85mm x 3.96mm) (DI 315.93mm)', weight: (323.85 - 3.96) * 3.96 * TUBE_WEIGHT_CONSTANT },
      { id: 'ts-12-sch10', description: 'Tubo Schedule 12" SCH 10 (323.85mm x 4.57mm) (DI 314.71mm)', weight: (323.85 - 4.57) * 4.57 * TUBE_WEIGHT_CONSTANT },
      { id: 'ts-12-sch40', description: 'Tubo Schedule 12" SCH 40 (323.85mm x 9.53mm) (DI 304.79mm)', weight: (323.85 - 9.53) * 9.53 * TUBE_WEIGHT_CONSTANT },
      { id: 'ts-14-sch5', description: 'Tubo Schedule 14" SCH 5 (355.60mm x 3.96mm) (DI 347.68mm)', weight: (355.60 - 3.96) * 3.96 * TUBE_WEIGHT_CONSTANT },
      { id: 'ts-14-sch10', description: 'Tubo Schedule 14" SCH 10 (355.60mm x 6.35mm) (DI 342.90mm)', weight: (355.60 - 6.35) * 6.35 * TUBE_WEIGHT_CONSTANT },
      { id: 'ts-14-sch40', description: 'Tubo Schedule 14" SCH 40 (355.60mm x 11.13mm) (DI 333.34mm)', weight: (355.60 - 11.13) * 11.13 * TUBE_WEIGHT_CONSTANT },
      { id: 'ts-16-sch5', description: 'Tubo Schedule 16" SCH 5 (406.40mm x 4.19mm) (DI 398.02mm)', weight: (406.40 - 4.19) * 4.19 * TUBE_WEIGHT_CONSTANT },
      { id: 'ts-16-sch10', description: 'Tubo Schedule 16" SCH 10 (406.40mm x 6.35mm) (DI 393.70mm)', weight: (406.40 - 6.35) * 6.35 * TUBE_WEIGHT_CONSTANT },
      { id: 'ts-16-sch40', description: 'Tubo Schedule 16" SCH 40 (406.40mm x 12.70mm) (DI 381.00mm)', weight: (406.40 - 12.70) * 12.70 * TUBE_WEIGHT_CONSTANT },
      { id: 'ts-18-sch5', description: 'Tubo Schedule 18" SCH 5 (457.20mm x 4.19mm) (DI 448.82mm)', weight: (457.20 - 4.19) * 4.19 * TUBE_WEIGHT_CONSTANT },
      { id: 'ts-18-sch10', description: 'Tubo Schedule 18" SCH 10 (457.20mm x 6.35mm) (DI 444.50mm)', weight: (457.20 - 6.35) * 6.35 * TUBE_WEIGHT_CONSTANT },
      { id: 'ts-18-sch40', description: 'Tubo Schedule 18" SCH 40 (457.20mm x 14.27mm) (DI 428.66mm)', weight: (457.20 - 14.27) * 14.27 * TUBE_WEIGHT_CONSTANT },
      { id: 'ts-20-sch5', description: 'Tubo Schedule 20" SCH 5 (508.00mm x 4.78mm) (DI 498.44mm)', weight: (508.00 - 4.78) * 4.78 * TUBE_WEIGHT_CONSTANT },
      { id: 'ts-20-sch10', description: 'Tubo Schedule 20" SCH 10 (508.00mm x 6.35mm) (DI 495.30mm)', weight: (508.00 - 6.35) * 6.35 * TUBE_WEIGHT_CONSTANT },
      { id: 'ts-20-sch40', description: 'Tubo Schedule 20" SCH 40 (508.00mm x 15.09mm) (DI 477.82mm)', weight: (508.00 - 15.09) * 15.09 * TUBE_WEIGHT_CONSTANT },
    ],
  },
  {
    id: 'cantoneiras',
    name: 'Cantoneiras',
    description: 'Cantoneiras em "L" com diversas medidas.',
    icon: 'FlipHorizontal',
    unit: 'm',
    items: [
        { id: 'can-3/4-1/8', description: 'Cantoneira 3/4" x 1/8" (19.05mm x 3.17mm)', weight: calculateAngleBarWeight(19.05, 3.17) },
        { id: 'can-3/4-3/16', description: 'Cantoneira 3/4" x 3/16" (19.05mm x 4.76mm)', weight: calculateAngleBarWeight(19.05, 4.76) },
        { id: 'can-1-1/8', description: 'Cantoneira 1" x 1/8" (25.40mm x 3.17mm)', weight: calculateAngleBarWeight(25.40, 3.17) },
        { id: 'can-1-3/16', description: 'Cantoneira 1" x 3/16" (25.40mm x 4.76mm)', weight: calculateAngleBarWeight(25.40, 4.76) },
        { id: 'can-1-1/4', description: 'Cantoneira 1" x 1/4" (25.40mm x 6.35mm)', weight: calculateAngleBarWeight(25.40, 6.35) },
        { id: 'can-1_1/4-1/8', description: 'Cantoneira 1.1/4" x 1/8" (31.75mm x 3.17mm)', weight: calculateAngleBarWeight(31.75, 3.17) },
        { id: 'can-1_1/4-3/16', description: 'Cantoneira 1.1/4" x 3/16" (31.75mm x 4.76mm)', weight: calculateAngleBarWeight(31.75, 4.76) },
        { id: 'can-1_1/4-1/4', description: 'Cantoneira 1.1/4" x 1/4" (31.75mm x 6.35mm)', weight: calculateAngleBarWeight(31.75, 6.35) },
        { id: 'can-1_1/2-1/8', description: 'Cantoneira 1.1/2" x 1/8" (38.10mm x 3.17mm)', weight: calculateAngleBarWeight(38.10, 3.17) },
        { id: 'can-1_1/2-3/16', description: 'Cantoneira 1.1/2" x 3/16" (38.10mm x 4.76mm)', weight: calculateAngleBarWeight(38.10, 4.76) },
        { id: 'can-1_1/2-1/4', description: 'Cantoneira 1.1/2" x 1/4" (38.10mm x 6.35mm)', weight: calculateAngleBarWeight(38.10, 6.35) },
        { id: 'can-2-1/8', description: 'Cantoneira 2" x 1/8" (50.80mm x 3.17mm)', weight: calculateAngleBarWeight(50.80, 3.17) },
        { id: 'can-2-3/16', description: 'Cantoneira 2" x 3/16" (50.80mm x 4.76mm)', weight: calculateAngleBarWeight(50.80, 4.76) },
        { id: 'can-2-1/4', description: 'Cantoneira 2" x 1/4" (50.80mm x 6.35mm)', weight: calculateAngleBarWeight(50.80, 6.35) },
        { id: 'can-2_1/2-3/16', description: 'Cantoneira 2.1/2" x 3/16" (63.50mm x 4.76mm)', weight: calculateAngleBarWeight(63.50, 4.76) },
        { id: 'can-2_1/2-1/4', description: 'Cantoneira 2.1/2" x 1/4" (63.50mm x 6.35mm)', weight: calculateAngleBarWeight(63.50, 6.35) },
        { id: 'can-3-3/16', description: 'Cantoneira 3" x 3/16" (76.20mm x 4.76mm)', weight: calculateAngleBarWeight(76.20, 4.76) },
        { id: 'can-3-1/4', description: 'Cantoneira 3" x 1/4" (76.20mm x 6.35mm)', weight: calculateAngleBarWeight(76.20, 6.35) },
    ]
  },
  {
    id: 'barras-chatas',
    name: 'Barras Chatas',
    description: 'Barras chatas (retangulares) em diversas medidas.',
    icon: 'RectangleHorizontal',
    unit: 'm',
    items: [
        { id: 'bc-3/4-1/8', description: 'Barra Chata 3/4" x 1/8" (19.05mm x 3.17mm)', weight: calculateFlatBarWeight(19.05, 3.17) },
        { id: 'bc-3/4-3/16', description: 'Barra Chata 3/4" x 3/16" (19.05mm x 4.76mm)', weight: calculateFlatBarWeight(19.05, 4.76) },
        { id: 'bc-3/4-1/4', description: 'Barra Chata 3/4" x 1/4" (19.05mm x 6.35mm)', weight: calculateFlatBarWeight(19.05, 6.35) },
        { id: 'bc-1-1/8', description: 'Barra Chata 1" x 1/8" (25.40mm x 3.17mm)', weight: calculateFlatBarWeight(25.40, 3.17) },
        { id: 'bc-1-3/16', description: 'Barra Chata 1" x 3/16" (25.40mm x 4.76mm)', weight: calculateFlatBarWeight(25.40, 4.76) },
        { id: 'bc-1-1/4', description: 'Barra Chata 1" x 1/4" (25.40mm x 6.35mm)', weight: calculateFlatBarWeight(25.40, 6.35) },
        { id: 'bc-1-1/2', description: 'Barra Chata 1" x 1/2" (25.40mm x 12.70mm)', weight: calculateFlatBarWeight(25.40, 12.70) },
        { id: 'bc-1_1/4-1/8', description: 'Barra Chata 1.1/4" x 1/8" (31.75mm x 3.17mm)', weight: calculateFlatBarWeight(31.75, 3.17) },
        { id: 'bc-1_1/4-3/16', description: 'Barra Chata 1.1/4" x 3/16" (31.75mm x 4.76mm)', weight: calculateFlatBarWeight(31.75, 4.76) },
        { id: 'bc-1_1/4-1/4', description: 'Barra Chata 1.1/4" x 1/4" (31.75mm x 6.35mm)', weight: calculateFlatBarWeight(31.75, 6.35) },
        { id: 'bc-1_1/2-1/8', description: 'Barra Chata 1.1/2" x 1/8" (38.10mm x 3.17mm)', weight: calculateFlatBarWeight(38.10, 3.17) },
        { id: 'bc-1_1/2-3/16', description: 'Barra Chata 1.1/2" x 3/16" (38.10mm x 4.76mm)', weight: calculateFlatBarWeight(38.10, 4.76) },
        { id: 'bc-1_1/2-1/4', description: 'Barra Chata 1.1/2" x 1/4" (38.10mm x 6.35mm)', weight: calculateFlatBarWeight(38.10, 6.35) },
        { id: 'bc-2-1/8', description: 'Barra Chata 2" x 1/8" (50.80mm x 3.17mm)', weight: calculateFlatBarWeight(50.80, 3.17) },
        { id: 'bc-2-3/16', description: 'Barra Chata 2" x 3/16" (50.80mm x 4.76mm)', weight: calculateFlatBarWeight(50.80, 4.76) },
        { id: 'bc-2-1/4', description: 'Barra Chata 2" x 1/4" (50.80mm x 6.35mm)', weight: calculateFlatBarWeight(50.80, 6.35) },
        { id: 'bc-2-3/8', description: 'Barra Chata 2" x 3/8" (50.80mm x 9.52mm)', weight: calculateFlatBarWeight(50.80, 9.52) },
        { id: 'bc-2-1/2', description: 'Barra Chata 2" x 1/2" (50.80mm x 12.70mm)', weight: calculateFlatBarWeight(50.80, 12.70) },
        { id: 'bc-2-1', description: 'Barra Chata 2" x 1" (50.80mm x 25.40mm)', weight: calculateFlatBarWeight(50.80, 25.40) },
        { id: 'bc-2_1/2-1/4', description: 'Barra Chata 2.1/2" x 1/4" (63.50mm x 6.35mm)', weight: calculateFlatBarWeight(63.50, 6.35) },
        { id: 'bc-2_1/2-3/8', description: 'Barra Chata 2.1/2" x 3/8" (63.50mm x 9.52mm)', weight: calculateFlatBarWeight(63.50, 9.52) },
        { id: 'bc-2_1/2-1/2', description: 'Barra Chata 2.1/2" x 1/2" (63.50mm x 12.70mm)', weight: calculateFlatBarWeight(63.50, 12.70) },
        { id: 'bc-3-1/4', description: 'Barra Chata 3" x 1/4" (76.20mm x 6.35mm)', weight: calculateFlatBarWeight(76.20, 6.35) },
        { id: 'bc-3-3/8', description: 'Barra Chata 3" x 3/8" (76.20mm x 9.52mm)', weight: calculateFlatBarWeight(76.20, 9.52) },
        { id: 'bc-3-1/2', description: 'Barra Chata 3" x 1/2" (76.20mm x 12.70mm)', weight: calculateFlatBarWeight(76.20, 12.70) },
        { id: 'bc-4-1/4', description: 'Barra Chata 4" x 1/4" (101.60mm x 6.35mm)', weight: calculateFlatBarWeight(101.60, 6.35) },
        { id: 'bc-4-3/8', description: 'Barra Chata 4" x 3/8" (101.60mm x 9.52mm)', weight: calculateFlatBarWeight(101.60, 9.52) },
        { id: 'bc-4-1/2', description: 'Barra Chata 4" x 1/2" (101.60mm x 12.70mm)', weight: calculateFlatBarWeight(101.60, 12.70) },
    ]
  },
  {
    id: 'metalon-quadrado',
    name: 'Metalon Quadrado',
    description: 'Tubos quadrados (metalon) em diversas medidas.',
    icon: 'Square',
    unit: 'm',
    items: [
        { id: 'm-10x10-1.0', description: 'Metalon 10x10 x 1.00mm', weight: calculateSquareTubeWeight(10, 1.0) },
        { id: 'm-10x10-1.2', description: 'Metalon 10x10 x 1.20mm', weight: calculateSquareTubeWeight(10, 1.2) },
        { id: 'm-15x15-1.0', description: 'Metalon 15x15 x 1.00mm', weight: calculateSquareTubeWeight(15, 1.0) },
        { id: 'm-15x15-1.2', description: 'Metalon 15x15 x 1.20mm', weight: calculateSquareTubeWeight(15, 1.2) },
        { id: 'm-15x15-1.5', description: 'Metalon 15x15 x 1.50mm', weight: calculateSquareTubeWeight(15, 1.5) },
        { id: 'm-20x20-1.0', description: 'Metalon 20x20 x 1.00mm', weight: calculateSquareTubeWeight(20, 1.0) },
        { id: 'm-20x20-1.2', description: 'Metalon 20x20 x 1.20mm', weight: calculateSquareTubeWeight(20, 1.2) },
        { id: 'm-20x20-1.5', description: 'Metalon 20x20 x 1.50mm', weight: calculateSquareTubeWeight(20, 1.5) },
        { id: 'm-25x25-1.0', description: 'Metalon 25x25 x 1.00mm', weight: calculateSquareTubeWeight(25, 1.0) },
        { id: 'm-25x25-1.2', description: 'Metalon 25x25 x 1.20mm', weight: calculateSquareTubeWeight(25, 1.2) },
        { id: 'm-25x25-1.5', description: 'Metalon 25x25 x 1.50mm', weight: calculateSquareTubeWeight(25, 1.5) },
        { id: 'm-30x30-1.2', description: 'Metalon 30x30 x 1.20mm', weight: calculateSquareTubeWeight(30, 1.2) },
        { id: 'm-30x30-1.5', description: 'Metalon 30x30 x 1.50mm', weight: calculateSquareTubeWeight(30, 1.5) },
        { id: 'm-40x40-1.2', description: 'Metalon 40x40 x 1.20mm', weight: calculateSquareTubeWeight(40, 1.2) },
        { id: 'm-40x40-1.5', description: 'Metalon 40x40 x 1.50mm', weight: calculateSquareTubeWeight(40, 1.5) },
        { id: 'm-50x50-1.2', description: 'Metalon 50x50 x 1.20mm', weight: calculateSquareTubeWeight(50, 1.2) },
        { id: 'm-50x50-1.5', description: 'Metalon 50x50 x 1.50mm', weight: calculateSquareTubeWeight(50, 1.5) },
        { id: 'm-50x50-2.0', description: 'Metalon 50x50 x 2.00mm', weight: calculateSquareTubeWeight(50, 2.0) },
        { id: 'm-60x60-1.5', description: 'Metalon 60x60 x 1.50mm', weight: calculateSquareTubeWeight(60, 1.5) },
        { id: 'm-60x60-2.0', description: 'Metalon 60x60 x 2.00mm', weight: calculateSquareTubeWeight(60, 2.0) },
        { id: 'm-80x80-1.5', description: 'Metalon 80x80 x 1.50mm', weight: calculateSquareTubeWeight(80, 1.5) },
        { id: 'm-80x80-2.0', description: 'Metalon 80x80 x 2.00mm', weight: calculateSquareTubeWeight(80, 2.0) },
        { id: 'm-100x100-1.5', description: 'Metalon 100x100 x 1.50mm', weight: calculateSquareTubeWeight(100, 1.5) },
        { id: 'm-100x100-2.0', description: 'Metalon 100x100 x 2.00mm', weight: calculateSquareTubeWeight(100, 2.0) },
        { id: 'm-100x100-3.0', description: 'Metalon 100x100 x 3.00mm', weight: calculateSquareTubeWeight(100, 3.0) },
    ]
  },
  {
    id: 'metalon-retangular',
    name: 'Metalon Retangular',
    description: 'Tubos retangulares (metalon) em diversas medidas.',
    icon: 'RectangleHorizontal',
    unit: 'm',
    items: [
        { id: 'mr-40x10-1.0', description: 'Metalon 40x10 x 1.00mm', weight: calculateRectangularTubeWeight(40, 10, 1.0) },
        { id: 'mr-40x10-1.2', description: 'Metalon 40x10 x 1.20mm', weight: calculateRectangularTubeWeight(40, 10, 1.2) },
        { id: 'mr-40x10-1.5', description: 'Metalon 40x10 x 1.50mm', weight: calculateRectangularTubeWeight(40, 10, 1.5) },
        { id: 'mr-40x20-1.0', description: 'Metalon 40x20 x 1.00mm', weight: calculateRectangularTubeWeight(40, 20, 1.0) },
        { id: 'mr-40x20-1.2', description: 'Metalon 40x20 x 1.20mm', weight: calculateRectangularTubeWeight(40, 20, 1.2) },
        { id: 'mr-40x20-1.5', description: 'Metalon 40x20 x 1.50mm', weight: calculateRectangularTubeWeight(40, 20, 1.5) },
        { id: 'mr-50x20-1.2', description: 'Metalon 50x20 x 1.20mm', weight: calculateRectangularTubeWeight(50, 20, 1.2) },
        { id: 'mr-50x20-1.5', description: 'Metalon 50x20 x 1.50mm', weight: calculateRectangularTubeWeight(50, 20, 1.5) },
        { id: 'mr-50x30-1.2', description: 'Metalon 50x30 x 1.20mm', weight: calculateRectangularTubeWeight(50, 30, 1.2) },
        { id: 'mr-50x30-1.5', description: 'Metalon 50x30 x 1.50mm', weight: calculateRectangularTubeWeight(50, 30, 1.5) },
        { id: 'mr-60x40-1.2', description: 'Metalon 60x40 x 1.20mm', weight: calculateRectangularTubeWeight(60, 40, 1.2) },
        { id: 'mr-60x40-1.5', description: 'Metalon 60x40 x 1.50mm', weight: calculateRectangularTubeWeight(60, 40, 1.5) },
        { id: 'mr-80x40-1.2', description: 'Metalon 80x40 x 1.20mm', weight: calculateRectangularTubeWeight(80, 40, 1.2) },
        { id: 'mr-80x40-1.5', description: 'Metalon 80x40 x 1.50mm', weight: calculateRectangularTubeWeight(80, 40, 1.5) },
        { id: 'mr-100x40-1.2', description: 'Metalon 100x40 x 1.20mm', weight: calculateRectangularTubeWeight(100, 40, 1.2) },
        { id: 'mr-100x40-1.5', description: 'Metalon 100x40 x 1.50mm', weight: calculateRectangularTubeWeight(100, 40, 1.5) },
        { id: 'mr-100x50-1.5', description: 'Metalon 100x50 x 1.50mm', weight: calculateRectangularTubeWeight(100, 50, 1.5) },
        { id: 'mr-100x50-2.0', description: 'Metalon 100x50 x 2.00mm', weight: calculateRectangularTubeWeight(100, 50, 2.0) },
        { id: 'mr-100x50-3.0', description: 'Metalon 100x50 x 3.00mm', weight: calculateRectangularTubeWeight(100, 50, 3.0) },
        { id: 'mr-120x60-2.0', description: 'Metalon 120x60 x 2.00mm', weight: calculateRectangularTubeWeight(120, 60, 2.0) },
        { id: 'mr-120x60-3.0', description: 'Metalon 120x60 x 3.00mm', weight: calculateRectangularTubeWeight(120, 60, 3.0) },
        { id: 'mr-150x50-2.0', description: 'Metalon 150x50 x 2.00mm', weight: calculateRectangularTubeWeight(150, 50, 2.0) },
        { id: 'mr-150x50-3.0', description: 'Metalon 150x50 x 3.00mm', weight: calculateRectangularTubeWeight(150, 50, 3.0) },
    ]
  },
  {
    id: 'normas-astm',
    name: 'Normas ASTM',
    description: 'Guia de normas técnicas para aço inoxidável.',
    icon: 'Book',
    unit: 'calc',
    items: [],
  }
];
    
    
    

    

    

    


