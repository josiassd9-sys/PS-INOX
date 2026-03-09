import type { ConnectionItem, ConnectionGroup } from './types';

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
): ConnectionItem[] => {
  return connectionSizes.map(size => ({
    id: `${prefix}-${size.inch.replace(/ /g, '')}`,
    description: descriptionTemplate(size.inch),
    weight: baseWeight * size.weightMultiplier,
  }));
};

export const connectionsGroups: ConnectionGroup[] = [
  {
    id: 'sanitario-tc',
    name: 'Sanitário Tri-Clamp (TC)',
    items: [
      ...generateConnectionItems('conn-uniao-tc', (inch) => `União TC ${inch}`, 0.3),
      ...generateConnectionItems('conn-niple-tc', (inch) => `Niple TC ${inch}`, 0.15),
      ...generateConnectionItems('conn-tampao-tc', (inch) => `Tampão (CAP) TC ${inch}`, 0.1),
      ...generateConnectionItems('conn-abracadeira-tc', (inch) => `Abraçadeira TC ${inch}`, 0.2),
      ...generateConnectionItems('conn-vedacao-tc', (inch) => `Vedação TC (Silicone) ${inch}`, 0.01),
      ...generateConnectionItems('conn-niple-espigao-tc', (inch) => `Niple TC c/ Espigão ${inch}`, 0.2),
    ],
  },
  {
    id: 'sanitario-sms',
    name: 'Sanitário SMS',
    items: [
      ...generateConnectionItems('conn-uniao-sms', (inch) => `União SMS ${inch}`, 0.4),
      ...generateConnectionItems('conn-niple-sms', (inch) => `Niple SMS ${inch}`, 0.2),
      ...generateConnectionItems('conn-luva-sms', (inch) => `Luva SMS ${inch}`, 0.15),
      ...generateConnectionItems('conn-macho-sms', (inch) => `Macho SMS ${inch}`, 0.2),
      ...generateConnectionItems('conn-porca-tampao-sms', (inch) => `Porca Tampão SMS ${inch}`, 0.25),
      ...generateConnectionItems('conn-vedacao-sms', (inch) => `Vedação SMS (Nitrílica) ${inch}`, 0.02),
    ],
  },
  {
    id: 'sanitario-rjt',
    name: 'Sanitário RJT',
    items: [
      ...generateConnectionItems('conn-uniao-rjt', (inch) => `União RJT ${inch}`, 0.45),
      ...generateConnectionItems('conn-niple-rjt', (inch) => `Niple RJT ${inch}`, 0.22),
      ...generateConnectionItems('conn-luva-rjt', (inch) => `Luva RJT ${inch}`, 0.18),
      ...generateConnectionItems('conn-macho-rjt', (inch) => `Macho RJT ${inch}`, 0.25),
      ...generateConnectionItems('conn-porca-tampao-rjt', (inch) => `Porca Tampão RJT ${inch}`, 0.3),
      ...generateConnectionItems('conn-vedacao-rjt', (inch) => `Vedação RJT (Nitrílica) ${inch}`, 0.03),
    ],
  },
  {
    id: 'curvas',
    name: 'Curvas OD e Schedule',
    items: [
      ...generateConnectionItems('conn-curva-od-45', (inch) => `Curva 45° OD ${inch}`, 0.12),
      ...generateConnectionItems('conn-curva-od-90', (inch) => `Curva 90° OD ${inch}`, 0.15),
      ...generateConnectionItems('conn-curva-od-180', (inch) => `Curva 180° OD ${inch}`, 0.3),
      ...generateConnectionItems('conn-curva-sch-90', (inch) => `Curva 90° Schedule ${inch}`, 0.25),
    ],
  },
  {
    id: 'tees-derivacoes',
    name: 'Tees e Derivações',
    items: [
      ...generateConnectionItems('conn-tee-od', (inch) => `Tee OD ${inch}`, 0.2),
      ...generateConnectionItems('conn-tee-45-od', (inch) => `Tee 45° (Y) OD ${inch}`, 0.25),
      ...generateConnectionItems('conn-tee-sch', (inch) => `Tee Schedule ${inch}`, 0.4),
      ...generateConnectionItems('conn-cruzata-od', (inch) => `Cruzata OD ${inch}`, 0.3),
    ],
  },
  {
    id: 'reducoes',
    name: 'Reduções OD',
    items: [
      ...generateConnectionItems('conn-reducao-conc', (inch) => `Redução Concêntrica OD ${inch} x ...`, 0.18),
      ...generateConnectionItems('conn-reducao-exc', (inch) => `Redução Excêntrica OD ${inch} x ...`, 0.18),
    ],
  },
  {
    id: 'roscados',
    name: 'Roscados BSP',
    items: [
      ...generateConnectionItems('conn-luva-bsp', (inch) => `Luva BSP ${inch}`, 0.1),
      ...generateConnectionItems('conn-ponta-rosca-bsp', (inch) => `Ponta Roscada BSP ${inch}`, 0.15),
      ...generateConnectionItems('conn-espigao-bsp', (inch) => `Espigão BSP ${inch}`, 0.12),
    ],
  },
  {
    id: 'valvulas',
    name: 'Válvulas',
    items: [
      ...generateConnectionItems('conn-valvula-borboleta', (inch) => `Válvula Borboleta TC ${inch}`, 1.5),
      ...generateConnectionItems('conn-valvula-esfera', (inch) => `Válvula Esfera Tripartida BSP ${inch}`, 1.8),
      ...generateConnectionItems('conn-valvula-retencao', (inch) => `Válvula Retenção TC ${inch}`, 1.2),
      ...generateConnectionItems('conn-valvula-globo', (inch) => `Válvula Globo BSP ${inch}`, 2.5),
    ],
  },
  {
    id: 'diversos',
    name: 'Diversos',
    items: [
      ...generateConnectionItems('conn-abracadeira-suporte', (inch) => `Abraçadeira Suporte com Haste ${inch}`, 0.1),
      ...generateConnectionItems('conn-sprayball', (inch) => `Spray Ball Fixo ${inch}`, 0.5),
    ],
  }
];
