import type { ScrapItem } from './types';

export const scrapItems: ScrapItem[] = [
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
