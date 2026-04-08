
export type ItemUnit = "m" | "m²" | "un" | "kg" | "calc" | string;

export interface SteelItem {
  id: string;
  description: string;
  weight: number;
  unit?: ItemUnit;
  categoryName?: string;
  quantity?: number;
  price?: number;
}

export interface ConnectionItem {
  id: string;
  description: string;
  weight: number;
}

export interface ConnectionGroup {
  id: string;
  name: string;
  items: ConnectionItem[];
}

export interface ScrapItem {
  id: string;
  material: string;
  composition: string;
  price: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  unit: ItemUnit;
  items: SteelItem[] | ScrapItem[] | ConnectionGroup[];
  hasOwnPriceControls?: boolean;
  defaultCostPrice?: number;
  defaultMarkup?: number;
  path?: string;
}

export interface CategoryGroup {
  title: string;
  items: Category[];
}

export interface Perfil {
  nome: string;
  peso: number;
  area: number;
  h: number;
  b: number;
  tw: number;
  tf: number;
  d: number;
  Ix: number;
  Wx: number;
  rx: number;
  Iy: number;
  Wy: number;
  ry: number;
}

export interface PerfilIpe {
  nome: string;
  peso: number;
  area: number;
  h: number;
  b: number;
  tw: number;
  tf: number;
  Ix: number;
  Wx: number;
  rx: number;
  Iy: number;
  Wy: number;
  ry: number;
  d?: number;
}

export interface SteelDeck {
  nome: string;
  tipo: string;
  espessuraChapa: number;
  pesoProprio: number;
  vaosMaximos: {
    simples: Record<string, number>;
    duplo: Record<string, number>;
  };
}

export interface BudgetItem {
  id: string;
  type: string;
  perfil: { nome: string } | Perfil | PerfilIpe | SteelDeck;
  quantity: number;
  weightPerUnit: number;
  totalWeight: number;
  costPerUnit: number;
  totalCost: number;
  span?: number;
  height?: number;
}

export interface SupportReaction {
  vigaPrincipal: number;
  vigaSecundaria: number;
  pilar: number;
}

export interface LiveLoadOption {
  id: string;
  label: string;
  value: number;
  exclusive: boolean;
  group: string;
}

export interface WeighingItem {
  id: string;
  material: string;
  bruto: number;
  tara: number;
  descontos: number;
  liquido: number;
}

export interface WeighingSet {
  id: string;
  name: string;
  items: WeighingItem[];
  descontoCacamba: number;
}

export interface ScaleData {
  weighingSets: WeighingSet[];
  headerData: {
    client: string;
    plate: string;
    driver: string;
  };
  operationType: "loading" | "unloading";
}

export interface PrintableScaleTicketProps {
  autoPrint?: boolean;
}
