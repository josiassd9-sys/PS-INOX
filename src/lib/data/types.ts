
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
