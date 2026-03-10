
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
