

export const STAINLESS_STEEL_DENSITY_KG_M3 = 7980;
const INCH_TO_MM = 25.4;

// New Densities
const BRONZE_TM23_DENSITY_KG_M3 = 8800;
const ALUMINUM_DENSITY_KG_M3 = 2710;
const BRASS_DENSITY_KG_M3 = 8500;


// For tubes: Weight(kg/m) = (OD_mm - WT_mm) * WT_mm * (PI * DENSITY / 1000000)
const TUBE_WEIGHT_CONSTANT = Math.PI * (STAINLESS_STEEL_DENSITY_KG_M3 / 1000000);

// For sheets: Weight(kg/m²) = Thickness_mm * (DENSITY / 1000)
const SHEET_WEIGHT_CONSTANT = STAINLESS_STEEL_DENSITY_KG_M3 / 1000;
const ALUMINUM_SHEET_WEIGHT_CONSTANT = ALUMINUM_DENSITY_KG_M3 / 1000;

// For round bars: Weight(kg/m) = D_mm^2 * (PI/4) * (DENSITY / 1000000)
export const ROUND_BAR_WEIGHT_CONSTANT =
  (Math.PI / 4) * (STAINLESS_STEEL_DENSITY_KG_M3 / 1000000);

// New constants for new materials
const BRONZE_BAR_WEIGHT_CONSTANT = (Math.PI / 4) * (BRONZE_TM23_DENSITY_KG_M3 / 1000000);
const ALUMINUM_BAR_WEIGHT_CONSTANT = (Math.PI / 4) * (ALUMINUM_DENSITY_KG_M3 / 1000000);
const BRASS_BAR_WEIGHT_CONSTANT = (Math.PI / 4) * (BRASS_DENSITY_KG_M3 / 1000000);


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
  costPrice?: number; // Cost per piece for connections
  categoryName?: string;
};

export type Category = {
  id: string;
  name: string;
  description: string;
  items: SteelItem[] | ScrapItem[] | ConnectionGroup[];
  icon: string;
  unit: 'm' | 'm²' | 'un' | 'calc' | 'kg';
  hasOwnPriceControls?: boolean;
  defaultCostPrice?: number;
  defaultMarkup?: number;
};

export type ConnectionGroup = {
  id: string;
  name: string;
  items: SteelItem[];
};

export type ScrapItem = {
  id: string;
  material: string;
  composition: string;
  price: number;
};

export type CategoryGroup = {
    title: string;
    items: Category[];
};

const connectionSizes = [
  { inch: '3/8"', mm: 9.52, weightMultiplier: 0.2 },
  { inch: '1/2"', mm: 12.70, weightMultiplier: 0.4 },
  { inch: '5/8"', mm: 15.88, weightMultiplier: 0.6 },
  { inch: '3/4"', mm: 19.05, weightMultiplier: 0.8 },
  { inch: '1"', mm: 25.40, weightMultiplier: 1.0 },
  { inch: '1.1/4"', mm: 31.75, weightMultiplier: 1.5 },
  { inch: '1.1/2"', mm: 38.10, weightMultiplier: 2.0 },
  { inch: '2"', mm: 50.80, weightMultiplier: 3.0 },
  { inch: '2.1/2"', mm: 63.50, weightMultiplier: 4.5 },
  { inch: '3"', mm: 76.20, weightMultiplier: 6.5 },
  { inch: '4"', mm: 101.60, weightMultiplier: 10.0 },
  { inch: '5"', mm: 127.00, weightMultiplier: 15.0 },
  { inch: '6"', mm: 152.40, weightMultiplier: 22.0 },
  { inch: '8"', mm: 203.20, weightMultiplier: 35.0 },
];

const generateConnectionItems = (
  prefix: string,
  descriptionTemplate: (inch: string) => string,
  baseWeight: number,
  baseCost: number
): SteelItem[] => {
  return connectionSizes.map(size => ({
    id: `${prefix}-${size.inch.replace(/ /g, '')}`,
    description: descriptionTemplate(size.inch),
    weight: baseWeight * size.weightMultiplier,
    costPrice: baseCost * size.weightMultiplier,
  }));
};

const connectionsGroups: ConnectionGroup[] = [
  {
    id: 'sanitario-tc',
    name: 'Sanitário Tri-Clamp (TC)',
    items: [
      ...generateConnectionItems('conn-uniao-tc', (inch) => `União TC ${inch}`, 0.3, 25),
      ...generateConnectionItems('conn-niple-tc', (inch) => `Niple TC ${inch}`, 0.15, 12),
      ...generateConnectionItems('conn-tampao-tc', (inch) => `Tampão (CAP) TC ${inch}`, 0.1, 10),
      ...generateConnectionItems('conn-abracadeira-tc', (inch) => `Abraçadeira TC ${inch}`, 0.2, 15),
      ...generateConnectionItems('conn-vedacao-tc', (inch) => `Vedação TC (Silicone) ${inch}`, 0.01, 2),
      ...generateConnectionItems('conn-niple-espigao-tc', (inch) => `Niple TC c/ Espigão ${inch}`, 0.2, 18),
    ],
  },
  {
    id: 'sanitario-sms',
    name: 'Sanitário SMS',
    items: [
      ...generateConnectionItems('conn-uniao-sms', (inch) => `União SMS ${inch}`, 0.4, 30),
      ...generateConnectionItems('conn-niple-sms', (inch) => `Niple SMS ${inch}`, 0.2, 15),
      ...generateConnectionItems('conn-luva-sms', (inch) => `Luva SMS ${inch}`, 0.15, 12),
      ...generateConnectionItems('conn-macho-sms', (inch) => `Macho SMS ${inch}`, 0.2, 14),
      ...generateConnectionItems('conn-porca-tampao-sms', (inch) => `Porca Tampão SMS ${inch}`, 0.25, 20),
      ...generateConnectionItems('conn-vedacao-sms', (inch) => `Vedação SMS (Nitrílica) ${inch}`, 0.02, 3),
    ],
  },
  {
    id: 'sanitario-rjt',
    name: 'Sanitário RJT',
    items: [
      ...generateConnectionItems('conn-uniao-rjt', (inch) => `União RJT ${inch}`, 0.45, 35),
      ...generateConnectionItems('conn-niple-rjt', (inch) => `Niple RJT ${inch}`, 0.22, 18),
      ...generateConnectionItems('conn-luva-rjt', (inch) => `Luva RJT ${inch}`, 0.18, 15),
      ...generateConnectionItems('conn-macho-rjt', (inch) => `Macho RJT ${inch}`, 0.25, 16),
      ...generateConnectionItems('conn-porca-tampao-rjt', (inch) => `Porca Tampão RJT ${inch}`, 0.3, 22),
      ...generateConnectionItems('conn-vedacao-rjt', (inch) => `Vedação RJT (Nitrílica) ${inch}`, 0.03, 4),
    ],
  },
  {
    id: 'curvas',
    name: 'Curvas OD e Schedule',
    items: [
      ...generateConnectionItems('conn-curva-od-45', (inch) => `Curva 45° OD ${inch}`, 0.12, 8),
      ...generateConnectionItems('conn-curva-od-90', (inch) => `Curva 90° OD ${inch}`, 0.15, 10),
      ...generateConnectionItems('conn-curva-od-180', (inch) => `Curva 180° OD ${inch}`, 0.3, 20),
      ...generateConnectionItems('conn-curva-sch-90', (inch) => `Curva 90° Schedule ${inch}`, 0.25, 18),
    ],
  },
  {
    id: 'tees-derivacoes',
    name: 'Tees e Derivações',
    items: [
      ...generateConnectionItems('conn-tee-od', (inch) => `Tee OD ${inch}`, 0.2, 15),
      ...generateConnectionItems('conn-tee-45-od', (inch) => `Tee 45° (Y) OD ${inch}`, 0.25, 20),
      ...generateConnectionItems('conn-tee-sch', (inch) => `Tee Schedule ${inch}`, 0.4, 25),
      ...generateConnectionItems('conn-cruzata-od', (inch) => `Cruzata OD ${inch}`, 0.3, 22),
    ],
  },
  {
    id: 'reducoes',
    name: 'Reduções OD',
    items: [
      ...generateConnectionItems('conn-reducao-conc', (inch) => `Redução Concêntrica OD ${inch} x ...`, 0.18, 14),
      ...generateConnectionItems('conn-reducao-exc', (inch) => `Redução Excêntrica OD ${inch} x ...`, 0.18, 14),
    ],
  },
  {
    id: 'roscados',
    name: 'Roscados BSP',
    items: [
      ...generateConnectionItems('conn-luva-bsp', (inch) => `Luva BSP ${inch}`, 0.1, 8),
      ...generateConnectionItems('conn-ponta-rosca-bsp', (inch) => `Ponta Roscada BSP ${inch}`, 0.15, 10),
      ...generateConnectionItems('conn-espigao-bsp', (inch) => `Espigão BSP ${inch}`, 0.12, 9),
    ],
  },
  {
    id: 'valvulas',
    name: 'Válvulas',
    items: [
      ...generateConnectionItems('conn-valvula-borboleta', (inch) => `Válvula Borboleta TC ${inch}`, 1.5, 150),
      ...generateConnectionItems('conn-valvula-esfera', (inch) => `Válvula Esfera Tripartida BSP ${inch}`, 1.8, 180),
      ...generateConnectionItems('conn-valvula-retencao', (inch) => `Válvula Retenção TC ${inch}`, 1.2, 120),
      ...generateConnectionItems('conn-valvula-globo', (inch) => `Válvula Globo BSP ${inch}`, 2.5, 250),
    ],
  },
  {
    id: 'diversos',
    name: 'Diversos',
    items: [
      ...generateConnectionItems('conn-abracadeira-suporte', (inch) => `Abraçadeira Suporte com Haste ${inch}`, 0.1, 5),
      ...generateConnectionItems('conn-sprayball', (inch) => `Spray Ball Fixo ${inch}`, 0.5, 80),
    ],
  }
];


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
    const categoryName = 'Chapa';
    chapasGroup1.forEach(chapa => {
        dimensionsGroup1.forEach(dim => {
            items.push({
                id: `chapa-${chapa.thickness}-${dim.w}x${dim.h}`,
                description: `Chapa Inox ${chapa.desc}x${dim.desc} mm`,
                weight: chapa.thickness * dim.w * dim.h * SHEET_WEIGHT_CONSTANT,
                categoryName,
            });
        });
    });
    chapasGroup2.forEach(chapa => {
        dimensionsGroup2.forEach(dim => {
            items.push({
                id: `chapa-${chapa.thickness}-${dim.w}x${dim.h}`,
                description: `Chapa Inox ${chapa.desc}x${dim.desc} mm`,
                weight: chapa.thickness * dim.w * dim.h * SHEET_WEIGHT_CONSTANT,
                categoryName,
            });
        });
    });
    return items;
};

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
  { id: 'ta-21.3-2.00', description: 'Tubo DIN 21.30x2.00 Øin 17.30mm', weight: (21.30 - 2.00) * 2.00 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo Aliança' },
  { id: 'ta-21.3-2.35', description: 'Tubo DIN 21.30x2.35 Øin 16.60mm', weight: (21.30 - 2.35) * 2.35 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo Aliança' },
  { id: 'ta-26.9-2.00', description: 'Tubo DIN 26.90x2.00 Øin 22.90mm', weight: (26.90 - 2.00) * 2.00 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo Aliança' },
  { id: 'ta-26.9-2.35', description: 'Tubo DIN 26.90x2.35 Øin 22.20mm', weight: (26.90 - 2.35) * 2.35 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo Aliança' },
  { id: 'ta-33.7-2.00', description: 'Tubo DIN 33.70x2.00 Øin 29.70mm', weight: (33.70 - 2.00) * 2.00 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo Aliança' },
  { id: 'ta-33.7-2.65', description: 'Tubo DIN 33.70x2.65 Øin 28.40mm', weight: (33.70 - 2.65) * 2.65 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo Aliança' },
  { id: 'ta-33.7-3.00', description: 'Tubo DIN 33.70x3.00 Øin 27.70mm', weight: (33.70 - 3.00) * 3.00 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo Aliança' },
  { id: 'ta-42.4-2.00', description: 'Tubo DIN 42.40x2.00 Øin 38.40mm', weight: (42.40 - 2.00) * 2.00 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo Aliança' },
  { id: 'ta-42.4-2.65', description: 'Tubo DIN 42.40x2.65 Øin 37.10mm', weight: (42.40 - 2.65) * 2.65 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo Aliança' },
  { id: 'ta-42.4-3.00', description: 'Tubo DIN 42.40x3.00 Øin 36.40mm', weight: (42.40 - 3.00) * 3.00 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo Aliança' },
  { id: 'ta-48.3-2.00', description: 'Tubo DIN 48.30x2.00 Øin 44.30mm', weight: (48.30 - 2.00) * 2.00 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo Aliança' },
  { id: 'ta-48.3-2.65', description: 'Tubo DIN 48.30x2.65 Øin 43.00mm', weight: (48.30 - 2.65) * 2.65 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo Aliança' },
  { id: 'ta-48.3-3.00', description: 'Tubo DIN 48.30x3.00 Øin 42.30mm', weight: (48.30 - 3.00) * 3.00 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo Aliança' },
  { id: 'ta-60.3-2.00', description: 'Tubo DIN 60.30x2.00 Øin 56.30mm', weight: (60.30 - 2.00) * 2.00 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo Aliança' },
  { id: 'ta-60.3-2.65', description: 'Tubo DIN 60.30x2.65 Øin 55.00mm', weight: (60.30 - 2.65) * 2.65 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo Aliança' },
  { id: 'ta-60.3-3.00', description: 'Tubo DIN 60.30x3.00 Øin 54.30mm', weight: (60.30 - 3.00) * 3.00 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo Aliança' },
  { id: 'ta-76.1-2.00', description: 'Tubo DIN 76.10x2.00 Øin 72.10mm', weight: (76.10 - 2.00) * 2.00 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo Aliança' },
  { id: 'ta-76.1-3.00', description: 'Tubo DIN 76.10x3.00 Øin 70.10mm', weight: (76.10 - 3.00) * 3.00 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo Aliança' },
  { id: 'ta-88.9-2.00', description: 'Tubo DIN 88.90x2.00 Øin 84.90mm', weight: (88.90 - 2.00) * 2.00 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo Aliança' },
  { id: 'ta-88.9-3.00', description: 'Tubo DIN 88.90x3.00 Øin 82.90mm', weight: (88.90 - 3.00) * 3.00 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo Aliança' },
  { id: 'ta-101.6-2.00', description: 'Tubo DIN 101.60x2.00 Øin 97.60mm', weight: (101.60 - 2.00) * 2.00 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo Aliança' },
  { id: 'ta-101.6-3.00', description: 'Tubo DIN 101.60x3.00 Øin 95.60mm', weight: (101.60 - 3.00) * 3.00 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo Aliança' },
  { id: 'ta-114.3-3.00', description: 'Tubo DIN 114.30x3.00 Øin 108.30mm', weight: (114.30 - 3.00) * 3.00 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo Aliança' },
];

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

const generateBronzeRods = (): SteelItem[] => {
    return newMaterialDiameters.map(d => ({
        id: `bronze-${d.inch.replace(/ /g, '')}`,
        description: `Tarugo Bronze TM23 ${d.inch} (${d.mm.toFixed(2)}mm)`,
        weight: Math.pow(d.mm, 2) * BRONZE_BAR_WEIGHT_CONSTANT,
        categoryName: 'Tarugo Bronze'
    }));
};

const generateAluminumRods = (): SteelItem[] => {
    return newMaterialDiameters.map(d => ({
        id: `aluminum-${d.inch.replace(/ /g, '')}`,
        description: `Verg. Alum. Liga 6351 T6 Red. ${d.inch} (${d.mm.toFixed(2)}mm)`,
        weight: Math.pow(d.mm, 2) * ALUMINUM_BAR_WEIGHT_CONSTANT,
        categoryName: 'Verg. Alumínio'
    }));
};

const generateBrassRods = (): SteelItem[] => {
    return newMaterialDiameters.map(d => ({
        id: `brass-${d.inch.replace(/ /g, '')}`,
        description: `Verg. Latão Red. ${d.inch} (${d.mm.toFixed(2)}mm)`,
        weight: Math.pow(d.mm, 2) * BRASS_BAR_WEIGHT_CONSTANT,
        categoryName: 'Verg. Latão'
    }));
};

const CATEGORIES: Category[] = [
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
        { id: 't-3/8-0.70', description: 'Tubo OD 3/8" 9.52x0.70 Øin 8.12mm', weight: (9.52 - 0.70) * 0.70 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo OD' },
        { id: 't-3/8-1.00', description: 'Tubo OD 3/8" 9.52x1.00 Øin 7.52mm', weight: (9.52 - 1.00) * 1.00 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo OD' },
        { id: 't-3/8-1.20', description: 'Tubo OD 3/8" 9.52x1.20 Øin 7.12mm', weight: (9.52 - 1.20) * 1.20 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo OD' },
        { id: 't-3/8-1.50', description: 'Tubo OD 3/8" 9.52x1.50 Øin 6.52mm', weight: (9.52 - 1.50) * 1.50 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo OD' },
        { id: 't-1/2-1.00', description: 'Tubo OD 1/2" 12.70x1.00 Øin 10.70mm', weight: (12.70 - 1.00) * 1.00 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo OD' },
        { id: 't-1/2-1.20', description: 'Tubo OD 1/2" 12.70x1.20 Øin 10.30mm', weight: (12.70 - 1.20) * 1.20 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo OD' },
        { id: 't-1/2-1.50', description: 'Tubo OD 1/2" 12.70x1.50 Øin 9.70mm', weight: (12.70 - 1.50) * 1.50 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo OD' },
        { id: 't-5/8-1.00', description: 'Tubo OD 5/8" 15.88x1.00 Øin 13.88mm', weight: (15.88 - 1.00) * 1.00 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo OD' },
        { id: 't-5/8-1.20', description: 'Tubo OD 5/8" 15.88x1.20 Øin 13.48mm', weight: (15.88 - 1.20) * 1.20 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo OD' },
        { id: 't-5/8-1.50', description: 'Tubo OD 5/8" 15.88x1.50 Øin 12.88mm', weight: (15.88 - 1.50) * 1.50 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo OD' },
        { id: 't-3/4-1.00', description: 'Tubo OD 3/4" 19.05x1.00 Øin 17.05mm', weight: (19.05 - 1.00) * 1.00 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo OD' },
        { id: 't-3/4-1.20', description: 'Tubo OD 3/4" 19.05x1.20 Øin 16.65mm', weight: (19.05 - 1.20) * 1.20 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo OD' },
        { id: 't-3/4-1.50', description: 'Tubo OD 3/4" 19.05x1.50 Øin 16.05mm', weight: (19.05 - 1.50) * 1.50 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo OD' },
        { id: 't-1-1.00', description: 'Tubo OD 1" 25.40x1.00 Øin 23.40mm', weight: (25.40 - 1.00) * 1.00 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo OD' },
        { id: 't-1-1.20', description: 'Tubo OD 1" 25.40x1.20 Øin 23.00mm', weight: (25.40 - 1.20) * 1.20 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo OD' },
        { id: 't-1-1.50', description: 'Tubo OD 1" 25.40x1.50 Øin 22.40mm', weight: (25.40 - 1.50) * 1.50 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo OD' },
        { id: 't-1-2.00', description: 'Tubo OD 1" 25.40x2.00 Øin 21.40mm', weight: (25.40 - 2.00) * 2.00 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo OD' },
        { id: 't-1-2.50', description: 'Tubo OD 1" 25.40x2.50 Øin 20.40mm', weight: (25.40 - 2.50) * 2.50 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo OD' },
        { id: 't-1-3.00', description: 'Tubo OD 1" 25.40x3.00 Øin 19.40mm', weight: (25.40 - 3.00) * 3.00 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo OD' },
        { id: 't-1_1/4-1.00', description: 'Tubo OD 1.1/4" 31.75x1.00 Øin 29.75mm', weight: (31.75 - 1.00) * 1.00 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo OD' },
        { id: 't-1_1/4-1.20', description: 'Tubo OD 1.1/4" 31.75x1.20 Øin 29.35mm', weight: (31.75 - 1.20) * 1.20 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo OD' },
        { id: 't-1_1/4-1.50', description: 'Tubo OD 1.1/4" 31.75x1.50 Øin 28.75mm', weight: (31.75 - 1.50) * 1.50 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo OD' },
        { id: 't-1_1/4-2.00', description: 'Tubo OD 1.1/4" 31.75x2.00 Øin 27.75mm', weight: (31.75 - 2.00) * 2.00 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo OD' },
        { id: 't-1_1/4-2.50', description: 'Tubo OD 1.1/4" 31.75x2.50 Øin 26.75mm', weight: (31.75 - 2.50) * 2.50 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo OD' },
        { id: 't-1_1/4-3.00', description: 'Tubo OD 1.1/4" 31.75x3.00 Øin 25.75mm', weight: (31.75 - 3.00) * 3.00 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo OD' },
        { id: 't-1_1/2-1.00', description: 'Tubo OD 1.1/2" 38.10x1.00 Øin 36.10mm', weight: (38.10 - 1.00) * 1.00 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo OD' },
        { id: 't-1_1/2-1.20', description: 'Tubo OD 1.1/2" 38.10x1.20 Øin 35.70mm', weight: (38.10 - 1.20) * 1.20 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo OD' },
        { id: 't-1_1/2-1.50', description: 'Tubo OD 1.1/2" 38.10x1.50 Øin 35.10mm', weight: (38.10 - 1.50) * 1.50 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo OD' },
        { id: 't-1_1/2-2.00', description: 'Tubo OD 1.1/2" 38.10x2.00 Øin 34.10mm', weight: (38.10 - 2.00) * 2.00 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo OD' },
        { id: 't-1_1/2-2.50', description: 'Tubo OD 1.1/2" 38.10x2.50 Øin 33.10mm', weight: (38.10 - 2.50) * 2.50 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo OD' },
        { id: 't-1_1/2-3.00', description: 'Tubo OD 1.1/2" 38.10x3.00 Øin 32.10mm', weight: (38.10 - 3.00) * 3.00 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo OD' },
        { id: 't-2-1.00', description: 'Tubo OD 2" 50.80x1.00 Øin 48.80mm', weight: (50.80 - 1.00) * 1.00 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo OD' },
        { id: 't-2-1.20', description: 'Tubo OD 2" 50.80x1.20 Øin 48.40mm', weight: (50.80 - 1.20) * 1.20 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo OD' },
        { id: 't-2-1.50', description: 'Tubo OD 2" 50.80x1.50 Øin 47.80mm', weight: (50.80 - 1.50) * 1.50 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo OD' },
        { id: 't-2-2.00', description: 'Tubo OD 2" 50.80x2.00 Øin 46.80mm', weight: (50.80 - 2.00) * 2.00 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo OD' },
        { id: 't-2-2.50', description: 'Tubo OD 2" 50.80x2.50 Øin 45.80mm', weight: (50.80 - 2.50) * 2.50 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo OD' },
        { id: 't-2-3.00', description: 'Tubo OD 2" 50.80x3.00 Øin 44.80mm', weight: (50.80 - 3.00) * 3.00 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo OD' },
        { id: 't-2_1/2-1.20', description: 'Tubo OD 2.1/2" 63.50x1.20 Øin 61.10mm', weight: (63.50 - 1.20) * 1.20 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo OD' },
        { id: 't-2_1/2-1.50', description: 'Tubo OD 2.1/2" 63.50x1.50 Øin 60.50mm', weight: (63.50 - 1.50) * 1.50 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo OD' },
        { id: 't-2_1/2-2.00', description: 'Tubo OD 2.1/2" 63.50x2.00 Øin 59.50mm', weight: (63.50 - 2.00) * 2.00 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo OD' },
        { id: 't-2_1/2-3.00', description: 'Tubo OD 2.1/2" 63.50x3.00 Øin 57.50mm', weight: (63.50 - 3.00) * 3.00 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo OD' },
        { id: 't-3-1.20', description: 'Tubo OD 3" 76.20x1.20 Øin 73.80mm', weight: (76.20 - 1.20) * 1.20 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo OD' },
        { id: 't-3-1.50', description: 'Tubo OD 3" 76.20x1.50 Øin 73.20mm', weight: (76.20 - 1.50) * 1.50 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo OD' },
        { id: 't-3-2.00', description: 'Tubo OD 3" 76.20x2.00 Øin 72.20mm', weight: (76.20 - 2.00) * 2.00 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo OD' },
        { id: 't-3-3.00', description: 'Tubo OD 3" 76.20x3.00 Øin 70.20mm', weight: (76.20 - 3.00) * 3.00 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo OD' },
        { id: 't-4-1.50', description: 'Tubo OD 4" 101.60x1.50 Øin 98.60mm', weight: (101.60 - 1.50) * 1.50 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo OD' },
        { id: 't-4-2.00', description: 'Tubo OD 4" 101.60x2.00 Øin 97.60mm', weight: (101.60 - 2.00) * 2.00 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo OD' },
        { id: 't-4-3.00', description: 'Tubo OD 4" 101.60x3.00 Øin 95.60mm', weight: (101.60 - 3.00) * 3.00 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo OD' },
        { id: 't-5-2.00', description: 'Tubo OD 5" 127.00x2.00 Øin 123.00mm', weight: (127.00 - 2.00) * 2.00 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo OD' },
        { id: 't-5-3.00', description: 'Tubo OD 5" 127.00x3.00 Øin 121.00mm', weight: (127.00 - 3.00) * 3.00 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo OD' },
        { id: 't-6-2.00', description: 'Tubo OD 6" 152.40x2.00 Øin 148.40mm', weight: (152.40 - 2.00) * 2.00 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo OD' },
        { id: 't-6-3.00', description: 'Tubo OD 6" 152.40x3.00 Øin 146.40mm', weight: (152.40 - 3.00) * 3.00 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo OD' },
        { id: 't-8-2.00', description: 'Tubo OD 8" 203.20x2.00 Øin 199.20mm', weight: (203.20 - 2.00) * 2.00 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo OD' },
        { id: 't-8-3.00', description: 'Tubo OD 8" 203.20x3.00 Øin 197.20mm', weight: (203.20 - 3.00) * 3.00 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo OD' },
        { id: 't-10-2.00', description: 'Tubo OD 10" 254.00x2.00 Øin 250.00mm', weight: (254.00 - 2.00) * 2.00 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo OD' },
        { id: 't-10-3.00', description: 'Tubo OD 10" 254.00x3.00 Øin 248.00mm', weight: (254.00 - 3.00) * 3.00 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo OD' },
        { id: 't-12-2.00', description: 'Tubo OD 12" 304.80x2.00 Øin 300.80mm', weight: (304.80 - 2.00) * 2.00 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo OD' },
        { id: 't-12-3.00', description: 'Tubo OD 12" 304.80x3.00 Øin 298.80mm', weight: (304.80 - 3.00) * 3.00 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo OD' },
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
    id: 'conexoes',
    name: 'Conexões',
    description: 'Catálogo de conexões sanitárias, roscadas e de solda.',
    icon: 'Link',
    unit: 'un',
    items: connectionsGroups,
    hasOwnPriceControls: true,
    defaultCostPrice: 1, // Multiplier
    defaultMarkup: 50,
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
    id: 'tarugo-bronze',
    name: 'Tarugo Bronze',
    description: 'Tarugos de Bronze TM23 em diversas bitolas.',
    icon: 'Circle',
    unit: 'm',
    items: generateBronzeRods(),
    hasOwnPriceControls: true,
    defaultCostPrice: 45,
    defaultMarkup: 50,
  },
  {
    id: 'verg-aluminio',
    name: 'Verg. Alumínio',
    description: 'Vergalhões de Alumínio 6351 T6 em diversas bitolas.',
    icon: 'Circle',
    unit: 'm',
    items: generateAluminumRods(),
    hasOwnPriceControls: true,
    defaultCostPrice: 20,
    defaultMarkup: 50,
  },
  {
    id: 'chapas-aluminio',
    name: 'Chapas Alumínio',
    description: 'Chapas de alumínio em diversas espessuras e dimensões.',
    icon: 'Square',
    unit: 'un',
    items: generateChapasAluminio(),
    hasOwnPriceControls: true,
    defaultCostPrice: 25,
    defaultMarkup: 50,
  },
  {
    id: 'verg-latao',
    name: 'Verg. Latão',
    description: 'Vergalhões de Latão em diversas bitolas.',
    icon: 'Circle',
    unit: 'm',
    items: generateBrassRods(),
    hasOwnPriceControls: true,
    defaultCostPrice: 35,
    defaultMarkup: 50,
  },
  {
    id: 'barras-redondas',
    name: 'Barras Redondas',
    description: 'Barras redondas maciças em diversas bitolas.',
    icon: 'Circle',
    unit: 'm',
    items: [
      { id: 'br-1/8', description: 'Barra Redonda 1/8" (3.17mm)', weight: Math.pow(3.17, 2) * ROUND_BAR_WEIGHT_CONSTANT, categoryName: 'Barra Redonda' },
      { id: 'br-5/32', description: 'Barra Redonda 5/32" (3.97mm)', weight: Math.pow(3.97, 2) * ROUND_BAR_WEIGHT_CONSTANT, categoryName: 'Barra Redonda' },
      { id: 'br-3/16', description: 'Barra Redonda 3/16" (4.76mm)', weight: Math.pow(4.76, 2) * ROUND_BAR_WEIGHT_CONSTANT, categoryName: 'Barra Redonda' },
      { id: 'br-1/4', description: 'Barra Redonda 1/4" (6.35mm)', weight: Math.pow(6.35, 2) * ROUND_BAR_WEIGHT_CONSTANT, categoryName: 'Barra Redonda' },
      { id: 'br-5/16', description: 'Barra Redonda 5/16" (7.94mm)', weight: Math.pow(7.94, 2) * ROUND_BAR_WEIGHT_CONSTANT, categoryName: 'Barra Redonda' },
      { id: 'br-3/8', description: 'Barra Redonda 3/8" (9.52mm)', weight: Math.pow(9.52, 2) * ROUND_BAR_WEIGHT_CONSTANT, categoryName: 'Barra Redonda' },
      { id: 'br-7/16', description: 'Barra Redonda 7/16" (11.11mm)', weight: Math.pow(11.11, 2) * ROUND_BAR_WEIGHT_CONSTANT, categoryName: 'Barra Redonda' },
      { id: 'br-1/2', description: 'Barra Redonda 1/2" (12.70mm)', weight: Math.pow(12.70, 2) * ROUND_BAR_WEIGHT_CONSTANT, categoryName: 'Barra Redonda' },
      { id: 'br-9/16', description: 'Barra Redonda 9/16" (14.29mm)', weight: Math.pow(14.29, 2) * ROUND_BAR_WEIGHT_CONSTANT, categoryName: 'Barra Redonda' },
      { id: 'br-5/8', description: 'Barra Redonda 5/8" (15.88mm)', weight: Math.pow(15.88, 2) * ROUND_BAR_WEIGHT_CONSTANT, categoryName: 'Barra Redonda' },
      { id: 'br-3/4', description: 'Barra Redonda 3/4" (19.05mm)', weight: Math.pow(19.05, 2) * ROUND_BAR_WEIGHT_CONSTANT, categoryName: 'Barra Redonda' },
      { id: 'br-7/8', description: 'Barra Redonda 7/8" (22.22mm)', weight: Math.pow(22.22, 2) * ROUND_BAR_WEIGHT_CONSTANT, categoryName: 'Barra Redonda' },
      { id: 'br-1', description: 'Barra Redonda 1" (25.40mm)', weight: Math.pow(25.40, 2) * ROUND_BAR_WEIGHT_CONSTANT, categoryName: 'Barra Redonda' },
      { id: 'br-1.1/8', description: 'Barra Redonda 1.1/8" (28.58mm)', weight: Math.pow(28.58, 2) * ROUND_BAR_WEIGHT_CONSTANT, categoryName: 'Barra Redonda' },
      { id: 'br-1.1/4', description: 'Barra Redonda 1.1/4" (31.75mm)', weight: Math.pow(31.75, 2) * ROUND_BAR_WEIGHT_CONSTANT, categoryName: 'Barra Redonda' },
      { id: 'br-1.3/8', description: 'Barra Redonda 1.3/8" (34.92mm)', weight: Math.pow(34.92, 2) * ROUND_BAR_WEIGHT_CONSTANT, categoryName: 'Barra Redonda' },
      { id: 'br-1.1/2', description: 'Barra Redonda 1.1/2" (38.10mm)', weight: Math.pow(38.10, 2) * ROUND_BAR_WEIGHT_CONSTANT, categoryName: 'Barra Redonda' },
      { id: 'br-1.5/8', description: 'Barra Redonda 1.5/8" (41.28mm)', weight: Math.pow(41.28, 2) * ROUND_BAR_WEIGHT_CONSTANT, categoryName: 'Barra Redonda' },
      { id: 'br-1.3/4', description: 'Barra Redonda 1.3/4" (44.45mm)', weight: Math.pow(44.45, 2) * ROUND_BAR_WEIGHT_CONSTANT, categoryName: 'Barra Redonda' },
      { id: 'br-2', description: 'Barra Redonda 2" (50.80mm)', weight: Math.pow(50.80, 2) * ROUND_BAR_WEIGHT_CONSTANT, categoryName: 'Barra Redonda' },
      { id: 'br-2.1/4', description: 'Barra Redonda 2.1/4" (57.15mm)', weight: Math.pow(57.15, 2) * ROUND_BAR_WEIGHT_CONSTANT, categoryName: 'Barra Redonda' },
      { id: 'br-2.1/2', description: 'Barra Redonda 2.1/2" (63.50mm)', weight: Math.pow(63.50, 2) * ROUND_BAR_WEIGHT_CONSTANT, categoryName: 'Barra Redonda' },
      { id: 'br-2.5/8', description: 'Barra Redonda 2.5/8" (66.67mm)', weight: Math.pow(66.67, 2) * ROUND_BAR_WEIGHT_CONSTANT, categoryName: 'Barra Redonda' },
      { id: 'br-2.3/4', description: 'Barra Redonda 2.3/4" (69.85mm)', weight: Math.pow(69.85, 2) * ROUND_BAR_WEIGHT_CONSTANT, categoryName: 'Barra Redonda' },
      { id: 'br-3', description: 'Barra Redonda 3" (76.20mm)', weight: Math.pow(76.20, 2) * ROUND_BAR_WEIGHT_CONSTANT, categoryName: 'Barra Redonda' },
      { id: 'br-3.1/4', description: 'Barra Redonda 3.1/4" (82.55mm)', weight: Math.pow(82.55, 2) * ROUND_BAR_WEIGHT_CONSTANT, categoryName: 'Barra Redonda' },
      { id: 'br-3.1/2', description: 'Barra Redonda 3.1/2" (88.90mm)', weight: Math.pow(88.90, 2) * ROUND_BAR_WEIGHT_CONSTANT, categoryName: 'Barra Redonda' },
      { id: 'br-4', description: 'Barra Redonda 4" (101.60mm)', weight: Math.pow(101.60, 2) * ROUND_BAR_WEIGHT_CONSTANT, categoryName: 'Barra Redonda' },
      { id: 'br-4.1/2', description: 'Barra Redonda 4.1/2" (114.30mm)', weight: Math.pow(114.30, 2) * ROUND_BAR_WEIGHT_CONSTANT, categoryName: 'Barra Redonda' },
      { id: 'br-5', description: 'Barra Redonda 5" (127.00mm)', weight: Math.pow(127.00, 2) * ROUND_BAR_WEIGHT_CONSTANT, categoryName: 'Barra Redonda' },
      { id: 'br-5.1/2', description: 'Barra Redonda 5.1/2" (139.70mm)', weight: Math.pow(139.70, 2) * ROUND_BAR_WEIGHT_CONSTANT, categoryName: 'Barra Redonda' },
      { id: 'br-6', description: 'Barra Redonda 6" (152.40mm)', weight: Math.pow(152.40, 2) * ROUND_BAR_WEIGHT_CONSTANT, categoryName: 'Barra Redonda' },
      { id: 'br-6.1/2', description: 'Barra Redonda 6.1/2" (165.10mm)', weight: Math.pow(165.10, 2) * ROUND_BAR_WEIGHT_CONSTANT, categoryName: 'Barra Redonda' },
      { id: 'br-7', description: 'Barra Redonda 7" (177.80mm)', weight: Math.pow(177.80, 2) * ROUND_BAR_WEIGHT_CONSTANT, categoryName: 'Barra Redonda' },
      { id: 'br-8', description: 'Barra Redonda 8" (203.20mm)', weight: Math.pow(203.20, 2) * ROUND_BAR_WEIGHT_CONSTANT, categoryName: 'Barra Redonda' },
      { id: 'br-9', description: 'Barra Redonda 9" (228.60mm)', weight: Math.pow(228.60, 2) * ROUND_BAR_WEIGHT_CONSTANT, categoryName: 'Barra Redonda' },
      { id: 'br-10', description: 'Barra Redonda 10" (254.00mm)', weight: Math.pow(254.00, 2) * ROUND_BAR_WEIGHT_CONSTANT, categoryName: 'Barra Redonda' },
    ].map(item => ({...item, categoryName: 'Barra Redonda'})),
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
    ].map(item => ({...item, categoryName: 'Barra Quadrada'})),
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
    ].map(item => ({...item, categoryName: 'Barra Sextavada'})),
  },
  {
    id: 'tubos-schedule',
    name: 'Tubos Schedule',
    description: 'Tubos redondos para condução de fluídos, norma Schedule.',
    icon: 'Layers',
    unit: 'm',
    items: [
      { id: 'ts-3/8-sch5', description: 'Tubo Schedule 3/8" SCH 5 17.14x1.65 Øin 13.84mm', weight: (17.14 - 1.65) * 1.65 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo Schedule' },
      { id: 'ts-3/8-sch10', description: 'Tubo Schedule 3/8" SCH 10 17.14x2.31 Øin 12.52mm', weight: (17.14 - 2.31) * 2.31 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo Schedule' },
      { id: 'ts-3/8-sch40', description: 'Tubo Schedule 3/8" SCH 40 17.14x3.20 Øin 10.74mm', weight: (17.14 - 3.20) * 3.20 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo Schedule' },
      { id: 'ts-1/2-sch5', description: 'Tubo Schedule 1/2" SCH 5 21.34x1.65 Øin 18.04mm', weight: (21.34 - 1.65) * 1.65 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo Schedule' },
      { id: 'ts-1/2-sch10', description: 'Tubo Schedule 1/2" SCH 10 21.34x2.11 Øin 17.12mm', weight: (21.34 - 2.11) * 2.11 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo Schedule' },
      { id: 'ts-1/2-sch40', description: 'Tubo Schedule 1/2" SCH 40 21.34x2.77 Øin 15.80mm', weight: (21.34 - 2.77) * 2.77 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo Schedule' },
      { id: 'ts-3/4-sch5', description: 'Tubo Schedule 3/4" SCH 5 26.67x1.65 Øin 23.37mm', weight: (26.67 - 1.65) * 1.65 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo Schedule' },
      { id: 'ts-3/4-sch10', description: 'Tubo Schedule 3/4" SCH 10 26.67x2.11 Øin 22.45mm', weight: (26.67 - 2.11) * 2.11 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo Schedule' },
      { id: 'ts-3/4-sch40', description: 'Tubo Schedule 3/4" SCH 40 26.67x2.87 Øin 20.93mm', weight: (26.67 - 2.87) * 2.87 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo Schedule' },
      { id: 'ts-1-sch5', description: 'Tubo Schedule 1" SCH 5 33.40x1.65 Øin 30.10mm', weight: (33.40 - 1.65) * 1.65 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo Schedule' },
      { id: 'ts-1-sch10', description: 'Tubo Schedule 1" SCH 10 33.40x2.77 Øin 27.86mm', weight: (33.40 - 2.77) * 2.77 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo Schedule' },
      { id: 'ts-1-sch40', description: 'Tubo Schedule 1" SCH 40 33.40x3.38 Øin 26.64mm', weight: (33.40 - 3.38) * 3.38 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo Schedule' },
      { id: 'ts-1_1/4-sch5', description: 'Tubo Schedule 1 1/4" SCH 5 42.16x1.65 Øin 38.86mm', weight: (42.16 - 1.65) * 1.65 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo Schedule' },
      { id: 'ts-1_1/4-sch10', description: 'Tubo Schedule 1 1/4" SCH 10 42.16x2.77 Øin 36.62mm', weight: (42.16 - 2.77) * 2.77 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo Schedule' },
      { id: 'ts-1_1/4-sch40', description: 'Tubo Schedule 1 1/4" SCH 40 42.16x3.56 Øin 35.04mm', weight: (42.16 - 3.56) * 3.56 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo Schedule' },
      { id: 'ts-1_1/2-sch5', description: 'Tubo Schedule 1 1/2" SCH 5 48.26x1.65 Øin 44.96mm', weight: (48.26 - 1.65) * 1.65 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo Schedule' },
      { id: 'ts-1_1/2-sch10', description: 'Tubo Schedule 1 1/2" SCH 10 48.26x2.77 Øin 42.72mm', weight: (48.26 - 2.77) * 2.77 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo Schedule' },
      { id: 'ts-1_1/2-sch40', description: 'Tubo Schedule 1 1/2" SCH 40 48.26x3.68 Øin 40.90mm', weight: (48.26 - 3.68) * 3.68 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo Schedule' },
      { id: 'ts-2-sch5', description: 'Tubo Schedule 2" SCH 5 60.33x1.65 Øin 57.03mm', weight: (60.33 - 1.65) * 1.65 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo Schedule' },
      { id: 'ts-2-sch10', description: 'Tubo Schedule 2" SCH 10 60.33x2.77 Øin 54.79mm', weight: (60.33 - 2.77) * 2.77 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo Schedule' },
      { id: 'ts-2-sch40', description: 'Tubo Schedule 2" SCH 40 60.33x3.91 Øin 52.51mm', weight: (60.33 - 3.91) * 3.91 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo Schedule' },
      { id: 'ts-2_1/2-sch5', description: 'Tubo Schedule 2 1/2" SCH 5 73.03x2.11 Øin 68.81mm', weight: (73.03 - 2.11) * 2.11 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo Schedule' },
      { id: 'ts-2_1/2-sch10', description: 'Tubo Schedule 2 1/2" SCH 10 73.03x3.05 Øin 66.93mm', weight: (73.03 - 3.05) * 3.05 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo Schedule' },
      { id: 'ts-2_1/2-sch40', description: 'Tubo Schedule 2 1/2" SCH 40 73.03x5.16 Øin 62.71mm', weight: (73.03 - 5.16) * 5.16 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo Schedule' },
      { id: 'ts-3-sch5', description: 'Tubo Schedule 3" SCH 5 88.90x2.11 Øin 84.68mm', weight: (88.90 - 2.11) * 2.11 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo Schedule' },
      { id: 'ts-3-sch10', description: 'Tubo Schedule 3" SCH 10 88.90x3.05 Øin 82.80mm', weight: (88.90 - 3.05) * 3.05 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo Schedule' },
      { id: 'ts-3-sch40', description: 'Tubo Schedule 3" SCH 40 88.90x5.49 Øin 77.92mm', weight: (88.90 - 5.49) * 5.49 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo Schedule' },
      { id: 'ts-4-sch5', description: 'Tubo Schedule 4" SCH 5 114.30x2.11 Øin 110.08mm', weight: (114.30 - 2.11) * 2.11 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo Schedule' },
      { id: 'ts-4-sch10', description: 'Tubo Schedule 4" SCH 10 114.30x3.05 Øin 108.20mm', weight: (114.30 - 3.05) * 3.05 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo Schedule' },
      { id: 'ts-4-sch40', description: 'Tubo Schedule 4" SCH 40 114.30x6.02 Øin 102.26mm', weight: (114.30 - 6.02) * 6.02 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo Schedule' },
      { id: 'ts-5-sch5', description: 'Tubo Schedule 5" SCH 5 141.30x2.77 Øin 135.76mm', weight: (141.30 - 2.77) * 2.77 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo Schedule' },
      { id: 'ts-5-sch10', description: 'Tubo Schedule 5" SCH 10 141.30x3.40 Øin 134.50mm', weight: (141.30 - 3.40) * 3.40 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo Schedule' },
      { id: 'ts-5-sch40', description: 'Tubo Schedule 5" SCH 40 141.30x6.55 Øin 128.20mm', weight: (141.30 - 6.55) * 6.55 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo Schedule' },
      { id: 'ts-6-sch5', description: 'Tubo Schedule 6" SCH 5 168.28x2.77 Øin 162.74mm', weight: (168.28 - 2.77) * 2.77 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo Schedule' },
      { id: 'ts-6-sch10', description: 'Tubo Schedule 6" SCH 10 168.28x3.40 Øin 161.48mm', weight: (168.28 - 3.40) * 3.40 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo Schedule' },
      { id: 'ts-6-sch40', description: 'Tubo Schedule 6" SCH 40 168.28x7.11 Øin 154.06mm', weight: (168.28 - 7.11) * 7.11 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo Schedule' },
      { id: 'ts-8-sch5', description: 'Tubo Schedule 8" SCH 5 219.08x2.77 Øin 213.54mm', weight: (219.08 - 2.77) * 2.77 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo Schedule' },
      { id: 'ts-8-sch10', description: 'Tubo Schedule 8" SCH 10 219.08x3.76 Øin 211.56mm', weight: (219.08 - 3.76) * 3.76 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo Schedule' },
      { id: 'ts-8-sch40', description: 'Tubo Schedule 8" SCH 40 219.08x8.18 Øin 202.72mm', weight: (219.08 - 8.18) * 8.18 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo Schedule' },
      { id: 'ts-10-sch5', description: 'Tubo Schedule 10" SCH 5 273.05x3.40 Øin 266.25mm', weight: (273.05 - 3.40) * 3.40 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo Schedule' },
      { id: 'ts-10-sch10', description: 'Tubo Schedule 10" SCH 10 273.05x4.19 Øin 264.67mm', weight: (273.05 - 4.19) * 4.19 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo Schedule' },
      { id: 'ts-10-sch40', description: 'Tubo Schedule 10" SCH 40 273.05x9.27 Øin 254.51mm', weight: (273.05 - 9.27) * 9.27 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo Schedule' },
      { id: 'ts-12-sch5', description: 'Tubo Schedule 12" SCH 5 323.85x3.96 Øin 315.93mm', weight: (323.85 - 3.96) * 3.96 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo Schedule' },
      { id: 'ts-12-sch10', description: 'Tubo Schedule 12" SCH 10 323.85x4.57 Øin 314.71mm', weight: (323.85 - 4.57) * 4.57 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo Schedule' },
      { id: 'ts-12-sch40', description: 'Tubo Schedule 12" SCH 40 323.85x9.53 Øin 304.79mm', weight: (323.85 - 9.53) * 9.53 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo Schedule' },
      { id: 'ts-14-sch5', description: 'Tubo Schedule 14" SCH 5 355.60x3.96 Øin 347.68mm', weight: (355.60 - 3.96) * 3.96 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo Schedule' },
      { id: 'ts-14-sch10', description: 'Tubo Schedule 14" SCH 10 355.60x6.35 Øin 342.90mm', weight: (355.60 - 6.35) * 6.35 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo Schedule' },
      { id: 'ts-14-sch40', description: 'Tubo Schedule 14" SCH 40 355.60x11.13 Øin 333.34mm', weight: (355.60 - 11.13) * 11.13 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo Schedule' },
      { id: 'ts-16-sch5', description: 'Tubo Schedule 16" SCH 5 406.40x4.19 Øin 398.02mm', weight: (406.40 - 4.19) * 4.19 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo Schedule' },
      { id: 'ts-16-sch10', description: 'Tubo Schedule 16" SCH 10 406.40x6.35 Øin 393.70mm', weight: (406.40 - 6.35) * 6.35 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo Schedule' },
      { id: 'ts-16-sch40', description: 'Tubo Schedule 16" SCH 40 406.40x12.70 Øin 381.00mm', weight: (406.40 - 12.70) * 12.70 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo Schedule' },
      { id: 'ts-18-sch5', description: 'Tubo Schedule 18" SCH 5 457.20x4.19 Øin 448.82mm', weight: (457.20 - 4.19) * 4.19 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo Schedule' },
      { id: 'ts-18-sch10', description: 'Tubo Schedule 18" SCH 10 457.20x6.35 Øin 444.50mm', weight: (457.20 - 6.35) * 6.35 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo Schedule' },
      { id: 'ts-18-sch40', description: 'Tubo Schedule 18" SCH 40 457.20x14.27 Øin 428.66mm', weight: (457.20 - 14.27) * 14.27 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo Schedule' },
      { id: 'ts-20-sch5', description: 'Tubo Schedule 20" SCH 5 508.00x4.78 Øin 498.44mm', weight: (508.00 - 4.78) * 4.78 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo Schedule' },
      { id: 'ts-20-sch10', description: 'Tubo Schedule 20" SCH 10 508.00x6.35 Øin 495.30mm', weight: (508.00 - 6.35) * 6.35 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo Schedule' },
      { id: 'ts-20-sch40', description: 'Tubo Schedule 20" SCH 40 508.00x15.09 Øin 477.82mm', weight: (508.00 - 15.09) * 15.09 * TUBE_WEIGHT_CONSTANT, categoryName: 'Tubo Schedule' },
    ].map(item => ({...item, categoryName: 'Tubo Schedule'})),
  },
  {
    id: 'cantoneiras',
    name: 'Cantoneiras',
    description: 'Cantoneiras em "L" com diversas medidas.',
    icon: 'FlipHorizontal',
    unit: 'm',
    items: [
        { id: 'can-3/4-1/8', description: 'Cantoneira 3/4" x 1/8" (19.05x3.17mm)', weight: calculateAngleBarWeight(19.05, 3.17) },
        { id: 'can-3/4-3/16', description: 'Cantoneira 3/4" x 3/16" (19.05x4.76mm)', weight: calculateAngleBarWeight(19.05, 4.76) },
        { id: 'can-1-1/8', description: 'Cantoneira 1" x 1/8" (25.40x3.17mm)', weight: calculateAngleBarWeight(25.40, 3.17) },
        { id: 'can-1-3/16', description: 'Cantoneira 1" x 3/16" (25.40x4.76mm)', weight: calculateAngleBarWeight(25.40, 4.76) },
        { id: 'can-1-1/4', description: 'Cantoneira 1" x 1/4" (25.40x6.35mm)', weight: calculateAngleBarWeight(25.40, 6.35) },
        { id: 'can-1_1/4-1/8', description: 'Cantoneira 1.1/4" x 1/8" (31.75x3.17mm)', weight: calculateAngleBarWeight(31.75, 3.17) },
        { id: 'can-1_1/4-3/16', description: 'Cantoneira 1.1/4" x 3/16" (31.75x4.76mm)', weight: calculateAngleBarWeight(31.75, 4.76) },
        { id: 'can-1_1/4-1/4', description: 'Cantoneira 1.1/4" x 1/4" (31.75x6.35mm)', weight: calculateAngleBarWeight(31.75, 6.35) },
        { id: 'can-1_1/2-1/8', description: 'Cantoneira 1.1/2" x 1/8" (38.10x3.17mm)', weight: calculateAngleBarWeight(38.10, 3.17) },
        { id: 'can-1_1/2-3/16', description: 'Cantoneira 1.1/2" x 3/16" (38.10x4.76mm)', weight: calculateAngleBarWeight(38.10, 4.76) },
        { id: 'can-1_1/2-1/4', description: 'Cantoneira 1.1/2" x 1/4" (38.10x6.35mm)', weight: calculateAngleBarWeight(38.10, 6.35) },
        { id: 'can-2-1/8', description: 'Cantoneira 2" x 1/8" (50.80x3.17mm)', weight: calculateAngleBarWeight(50.80, 3.17) },
        { id: 'can-2-3/16', description: 'Cantoneira 2" x 3/16" (50.80x4.76mm)', weight: calculateAngleBarWeight(50.80, 4.76) },
        { id: 'can-2-1/4', description: 'Cantoneira 2" x 1/4" (50.80x6.35mm)', weight: calculateAngleBarWeight(50.80, 6.35) },
        { id: 'can-2_1/2-3/16', description: 'Cantoneira 2.1/2" x 3/16" (63.50x4.76mm)', weight: calculateAngleBarWeight(63.50, 4.76) },
        { id: 'can-2_1/2-1/4', description: 'Cantoneira 2.1/2" x 1/4" (63.50x6.35mm)', weight: calculateAngleBarWeight(63.50, 6.35) },
        { id: 'can-3-3/16', description: 'Cantoneira 3" x 3/16" (76.20x4.76mm)', weight: calculateAngleBarWeight(76.20, 4.76) },
        { id: 'can-3-1/4', description: 'Cantoneira 3" x 1/4" (76.20x6.35mm)', weight: calculateAngleBarWeight(76.20, 6.35) },
    ].map(item => ({...item, categoryName: 'Cantoneira'})),
  },
  {
    id: 'barras-chatas',
    name: 'Barras Chatas',
    description: 'Barras chatas (retangulares) em diversas medidas.',
    icon: 'RectangleHorizontal',
    unit: 'm',
    items: [
        { id: 'bc-3/4-1/8', description: 'Barra Chata 3/4" x 1/8" (19.05x3.17mm)', weight: calculateFlatBarWeight(19.05, 3.17) },
        { id: 'bc-3/4-3/16', description: 'Barra Chata 3/4" x 3/16" (19.05x4.76mm)', weight: calculateFlatBarWeight(19.05, 4.76) },
        { id: 'bc-3/4-1/4', description: 'Barra Chata 3/4" x 1/4" (19.05x6.35mm)', weight: calculateFlatBarWeight(19.05, 6.35) },
        { id: 'bc-1-1/8', description: 'Barra Chata 1" x 1/8" (25.40x3.17mm)', weight: calculateFlatBarWeight(25.40, 3.17) },
        { id: 'bc-1-3/16', description: 'Barra Chata 1" x 3/16" (25.40x4.76mm)', weight: calculateFlatBarWeight(25.40, 4.76) },
        { id: 'bc-1-1/4', description: 'Barra Chata 1" x 1/4" (25.40x6.35mm)', weight: calculateFlatBarWeight(25.40, 6.35) },
        { id: 'bc-1-1/2', description: 'Barra Chata 1" x 1/2" (25.40x12.70mm)', weight: calculateFlatBarWeight(25.40, 12.70) },
        { id: 'bc-1_1/4-1/8', description: 'Barra Chata 1.1/4" x 1/8" (31.75x3.17mm)', weight: calculateFlatBarWeight(31.75, 3.17) },
        { id: 'bc-1_1/4-3/16', description: 'Barra Chata 1.1/4" x 3/16" (31.75x4.76mm)', weight: calculateFlatBarWeight(31.75, 4.76) },
        { id: 'bc-1_1/4-1/4', description: 'Barra Chata 1.1/4" x 1/4" (31.75x6.35mm)', weight: calculateFlatBarWeight(31.75, 6.35) },
        { id: 'bc-1_1/2-1/8', description: 'Barra Chata 1.1/2" x 1/8" (38.10x3.17mm)', weight: calculateFlatBarWeight(38.10, 3.17) },
        { id: 'bc-1_1/2-3/16', description: 'Barra Chata 1.1/2" x 3/16" (38.10x4.76mm)', weight: calculateFlatBarWeight(38.10, 4.76) },
        { id: 'bc-1_1/2-1/4', description: 'Barra Chata 1.1/2" x 1/4" (38.10x6.35mm)', weight: calculateFlatBarWeight(38.10, 6.35) },
        { id: 'bc-2-1/8', description: 'Barra Chata 2" x 1/8" (50.80x3.17mm)', weight: calculateFlatBarWeight(50.80, 3.17) },
        { id: 'bc-2-3/16', description: 'Barra Chata 2" x 3/16" (50.80x4.76mm)', weight: calculateFlatBarWeight(50.80, 4.76) },
        { id: 'bc-2-1/4', description: 'Barra Chata 2" x 1/4" (50.80x6.35mm)', weight: calculateFlatBarWeight(50.80, 6.35) },
        { id: 'bc-2-3/8', description: 'Barra Chata 2" x 3/8" (50.80x9.52mm)', weight: calculateFlatBarWeight(50.80, 9.52) },
        { id: 'bc-2-1/2', description: 'Barra Chata 2" x 1/2" (50.80x12.70mm)', weight: calculateFlatBarWeight(50.80, 12.70) },
        { id: 'bc-2-1', description: 'Barra Chata 2" x 1" (50.80x25.40mm)', weight: calculateFlatBarWeight(50.80, 25.40) },
        { id: 'bc-2_1/2-1/4', description: 'Barra Chata 2.1/2" x 1/4" (63.50x6.35mm)', weight: calculateFlatBarWeight(63.50, 6.35) },
        { id: 'bc-2_1/2-3/8', description: 'Barra Chata 2.1/2" x 3/8" (63.50x9.52mm)', weight: calculateFlatBarWeight(63.50, 9.52) },
        { id: 'bc-2_1/2-1/2', description: 'Barra Chata 2.1/2" x 1/2" (63.50x12.70mm)', weight: calculateFlatBarWeight(63.50, 12.70) },
        { id: 'bc-3-1/4', description: 'Barra Chata 3" x 1/4" (76.20x6.35mm)', weight: calculateFlatBarWeight(76.20, 6.35) },
        { id: 'bc-3-3/8', description: 'Barra Chata 3" x 3/8" (76.20x9.52mm)', weight: calculateFlatBarWeight(76.20, 9.52) },
        { id: 'bc-3-1/2', description: 'Barra Chata 3" x 1/2" (76.20x12.70mm)', weight: calculateFlatBarWeight(76.20, 12.70) },
        { id: 'bc-4-1/4', description: 'Barra Chata 4" x 1/4" (101.60x6.35mm)', weight: calculateFlatBarWeight(101.60, 6.35) },
        { id: 'bc-4-3/8', description: 'Barra Chata 4" x 3/8" (101.60x9.52mm)', weight: calculateFlatBarWeight(101.60, 9.52) },
        { id: 'bc-4-1/2', description: 'Barra Chata 4" x 1/2" (101.60x12.70mm)', weight: calculateFlatBarWeight(101.60, 12.70) },
    ].map(item => ({...item, categoryName: 'Barra Chata'})),
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
    ].map(item => ({...item, categoryName: 'Metalon Quadrado'})),
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
    ].map(item => ({...item, categoryName: 'Metalon Retangular'})),
  },
  {
    id: 'normas-astm',
    name: 'Normas ASTM',
    description: 'Guia de normas técnicas para aço inoxidável.',
    icon: 'Book',
    unit: 'calc',
    items: [],
  },
  {
    id: 'processos-fabricacao',
    name: 'Processos',
    description: 'Processos de produção e trabalho com aço inoxidável.',
    icon: 'Factory',
    unit: 'calc',
    items: [],
  },
  {
    id: 'desenho-tecnico',
    name: 'Desenho Técnico',
    description: 'Guia de leitura e interpretação de desenhos.',
    icon: 'DraftingCompass',
    unit: 'calc',
    items: [],
  }
];

export const CATEGORY_GROUPS: CategoryGroup[] = [
    {
        title: 'FERRAMENTAS',
        items: [
            CATEGORIES.find(c => c.id === 'retalhos')!,
            CATEGORIES.find(c => c.id === 'package-checker')!,
            CATEGORIES.find(c => c.id === 'balanca')!,
            CATEGORIES.find(c => c.id === 'tabela-sucata')!,
        ]
    },
    {
        title: 'MATERIAIS (AÇO INOX)',
        items: [
            CATEGORIES.find(c => c.id === 'conexoes')!,
            CATEGORIES.find(c => c.id === 'tubos-od')!,
            CATEGORIES.find(c => c.id === 'tubos-schedule')!,
            CATEGORIES.find(c => c.id === 'tubos-alianca')!,
            CATEGORIES.find(c => c.id === 'metalon-quadrado')!,
            CATEGORIES.find(c => c.id === 'metalon-retangular')!,
            CATEGORIES.find(c => c.id === 'barras-redondas')!,
            CATEGORIES.find(c => c.id === 'barra-quadrada')!,
            CATEGORIES.find(c => c.id === 'barra-sextavada')!,
            CATEGORIES.find(c => c.id === 'barras-chatas')!,
            CATEGORIES.find(c => c.id === 'cantoneiras')!,
            CATEGORIES.find(c => c.id === 'chapas')!,
        ]
    },
    {
        title: 'OUTROS METAIS',
        items: [
            CATEGORIES.find(c => c.id === 'tarugo-bronze')!,
            CATEGORIES.find(c => c.id === 'verg-aluminio')!,
            CATEGORIES.find(c => c.id === 'chapas-aluminio')!,
            CATEGORIES.find(c => c.id === 'verg-latao')!,
        ]
    },
    {
        title: 'INFORMATIVOS',
        items: [
            CATEGORIES.find(c => c.id === 'normas-astm')!,
            CATEGORIES.find(c => c.id === 'processos-fabricacao')!,
            CATEGORIES.find(c => c.id === 'desenho-tecnico')!,
        ]
    }
]

export const ALL_CATEGORIES = CATEGORY_GROUPS.flatMap(group => group.items);
    
    

    











