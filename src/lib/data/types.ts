

export type SteelItem = {
  id: string;
  description: string;
  weight: number;
  categoryName?: string;
  unit?: 'm' | 'un' | 'kg';
};

export type ConnectionItem = {
  id: string;
  description: string;
  weight: number;
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
  path?: string;
};

export type ConnectionGroup = {
  id: string;
  name: string;
  items: ConnectionItem[];
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


export type Perfil = {
    nome: string;
    peso: number; // kg/m
    area: number; // cm²
    h: number; // mm
    b: number; // mm
    tw: number; // mm
    tf: number; // mm
    d: number; // mm
    Ix: number; // cm⁴
    Wx: number; // cm³
    rx: number; // cm
    Iy: number; // cm⁴
    Wy: number; // cm³
    ry: number; // cm
};

export type PerfilIpe = Omit<Perfil, 'd'>;


export type SteelDeck = {
    nome: string;
    tipo: 'MD57' | 'MD75';
    espessuraChapa: number; // mm
    pesoProprio: number; // kg/m²
    vaosMaximos: {
        simples: { [key: string]: number };
        duplo: { [key: string]: number };
    };
};

export type BudgetItem = {
  id: string;
  perfil: Perfil | PerfilIpe | SteelDeck | { nome: string };
  span?: number; 
  height?: number; 
  quantity: number;
  weightPerUnit: number;
  totalWeight: number;
  costPerUnit: number;
  totalCost: number;
  type: 'Viga Principal' | 'Viga Secundária' | 'Steel Deck' | 'Pilar' | 'Concreto';
};

export type SupportReaction = {
  vigaPrincipal: number;
  vigaSecundaria: number;
  pilar: number;
};

export type LiveLoadOption = {
  id: string;
  label: string;
  value: number; // kgf/m²
  exclusive?: boolean;
  group: 'uso' | 'cobertura' | 'adicional';
};

export type SlabAnalysisResult = {
    analysis: string;
}
