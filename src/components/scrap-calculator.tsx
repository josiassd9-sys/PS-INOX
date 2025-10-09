
"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "./ui/button";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { STAINLESS_STEEL_DENSITY_KG_M3 } from "@/lib/data/constants";

interface ScrapPiece {
    id: string;
    description: string;
    weight: number;
    price: number;
    pricePerKg?: number;
    quantity?: number;
    unit?: 'm' | 'kg' | 'un';
}

interface ScrapCalculatorProps {
    onAddItem: (item: ScrapPiece) => void;
}

type Shape = "rectangle" | "disc";

export function ScrapCalculator({ onAddItem }: ScrapCalculatorProps) {
  const { toast } = useToast();
  const [scrapPrice, setScrapPrice] = React.useState<string>("23");
  const [shape, setShape] = React.useState<Shape>("rectangle");
  
  const [dimensions, setDimensions] = React.useState({
    width: "580",
    length: "1500",
    thickness: "3,5",
    diameter: "",
    quantity: "1",
  });
  const [materialClass, setMaterialClass] = React.useState("304");
  
  const [finalWeight, setFinalWeight] = React.useState<string>("");

  const handleDimChange = (field: keyof typeof dimensions, value: string) => {
    const sanitizedValue = value.replace(/[^0-9,.]/g, '').replace('.', ',');
     if (/^\d*\,?\d*$/.test(sanitizedValue)) {
        setDimensions(prev => ({ ...prev, [field]: sanitizedValue }));
    }
  };

  const handleScrapPriceChange = (value: string) => {
    const sanitizedValue = value.replace(/[^0-9,.]/g, '').replace('.', ',');
     if (/^\d*\,?\d*$/.test(sanitizedValue)) {
       setScrapPrice(sanitizedValue);
    }
  }
  
  const parseDimension = (val: string) => {
    if (!val) return 0;
    const num = parseFloat(val.replace(',', '.'));
    if (isNaN(num)) return 0;
    return num / 1000; // convert mm to meters
  };

  const calculatedWeight = React.useMemo(() => {
    const thicknessM = parseDimension(dimensions.thickness);
    const qty = parseInt(dimensions.quantity) || 0;
    const density = 8000;

    if (thicknessM <= 0 || qty <= 0) return 0;

    let volumeM3 = 0;
    if (shape === 'rectangle') {
      const widthM = parseDimension(dimensions.width);
      const lengthM = parseDimension(dimensions.length);
      if (widthM > 0 && lengthM > 0) {
        volumeM3 = widthM * lengthM * thicknessM;
      }
    } else if (shape === 'disc') {
      const diameterM = parseDimension(dimensions.diameter);
      if (diameterM > 0) {
        const radiusM = diameterM / 2;
        const areaM2 = Math.PI * Math.pow(radiusM, 2);
        volumeM3 = areaM2 * thicknessM;
      }
    }
    
    return volumeM3 * density * qty;
  }, [dimensions, shape]);

  React.useEffect(() => {
    if (calculatedWeight > 0) {
       const roundedWeight = Math.ceil(calculatedWeight);
       setFinalWeight(roundedWeight.toString());
    } else {
      setFinalWeight("");
    }
  }, [calculatedWeight, dimensions]);


  const calculatedPrice = React.useMemo(() => {
    const weightValue = parseFloat(finalWeight.replace(',', '.')) || 0;
    const priceValue = parseFloat(scrapPrice.replace(',', '.')) || 0;
    if (weightValue > 0 && priceValue > 0) {
      return Math.ceil(weightValue * priceValue);
    }
    return 0;
  }, [finalWeight, scrapPrice]);
  
  const description = React.useMemo(() => {
     const material = materialClass || "";
     const thick = dimensions.thickness || "?";
     if (shape === 'rectangle') {
        const width = dimensions.width || "?";
        const len = dimensions.length || "?";
        return `Chapa Ret. Inox ${material} ${thick} X ${width} X ${len}mm`;
     } else {
        const diam = dimensions.diameter || "?";
        return `Disco Inox ${material} Ø${diam} X ${thick}mm`;
     }
  }, [dimensions, shape, materialClass]);


  const addToList = () => {
    const qty = parseInt(dimensions.quantity) || 1;
    const weightValue = parseFloat(finalWeight.replace(',', '.')) || 0;
    const pricePerKg = parseFloat(scrapPrice.replace(',', '.')) || 0;

    if (weightValue > 0 && calculatedPrice > 0) {
        onAddItem({
            id: uuidv4(),
            description: `${description} - ${qty} pç`,
            weight: weightValue,
            price: calculatedPrice,
            pricePerKg,
            quantity: qty,
            unit: 'un',
        });
        toast({ title: "Item Adicionado!", description: `${description} foi adicionado à lista.` });
    } else {
        toast({ variant: "destructive", title: "Dados incompletos", description: "Preencha os campos para calcular e adicionar o item." });
    }
  }

  const formatNumber = (value: string | number, options?: Intl.NumberFormatOptions) => {
    const num = typeof value === 'string' ? parseFloat(value.replace(',', '.')) : value;
    if (isNaN(num)) return "";
    return new Intl.NumberFormat('pt-BR', options).format(num);
  }

  const handleShapeChange = (value: Shape | "") => {
    if (value) {
      setShape(value);
    }
  }
  
  const inputStyles = "h-8 px-1 bg-transparent border-0 border-b rounded-none focus-visible:ring-0 focus-visible:ring-offset-0";
  const labelStyles = "text-xs";


  return (
    <div className="flex flex-col h-full" id="scrap-calculator-form">
        <div className="space-y-1 mt-1 flex-1">
            <div className="space-y-1">
                <div className="pb-1">
                    <Label>Formato</Label>
                    <ToggleGroup type="single" value={shape} onValueChange={handleShapeChange} className="w-full grid grid-cols-2 gap-px">
                        <ToggleGroupItem value="rectangle" aria-label="Retangular">Retangular</ToggleGroupItem>
                        <ToggleGroupItem value="disc" aria-label="Disco">Disco</ToggleGroupItem>
                    </ToggleGroup>
                </div>

                {shape === 'rectangle' ? (
                    <div className="flex gap-px">
                        <div className="space-y-1 flex-1 min-w-0"><Label htmlFor="width" className={labelStyles}>Larg.(mm)</Label><Input id="width" type="text" inputMode="decimal" placeholder="Largura" value={dimensions.width} onChange={(e) => handleDimChange('width', e.target.value)} className={inputStyles}/></div>
                        <div className="space-y-1 flex-1 min-w-0"><Label htmlFor="length" className={labelStyles}>Compr.(mm)</Label><Input id="length" type="text" inputMode="decimal" placeholder="Compr." value={dimensions.length} onChange={(e) => handleDimChange('length', e.target.value)} className={inputStyles}/></div>
                         <div className="space-y-1 flex-1 min-w-0"><Label htmlFor="thickness" className={labelStyles}>Esp.(mm)</Label><Input id="thickness" type="text" inputMode="decimal" placeholder="Espessura" value={dimensions.thickness} onChange={(e) => handleDimChange('thickness', e.target.value)} className={inputStyles}/></div>
                    </div>
                ) : (
                    <div className="flex gap-px">
                        <div className="space-y-1 flex-1 min-w-0">
                            <Label htmlFor="diameter" className={labelStyles}>Diâmetro(mm)</Label>
                            <Input id="diameter" type="text" inputMode="decimal" placeholder="Diâmetro" value={dimensions.diameter} onChange={(e) => handleDimChange('diameter', e.target.value)} className={inputStyles}/>
                        </div>
                         <div className="space-y-1 flex-1 min-w-0"><Label htmlFor="thickness" className={labelStyles}>Esp.(mm)</Label><Input id="thickness" type="text" inputMode="decimal" placeholder="Espessura" value={dimensions.thickness} onChange={(e) => handleDimChange('thickness', e.target.value)} className={inputStyles}/></div>
                    </div>
                )}


                <div className="flex gap-px">
                     <div className="space-y-1 flex-1 min-w-0">
                        <Label htmlFor="material-class" className={labelStyles}>Classe</Label>
                        <Input id="material-class" type="text" placeholder="Ex: 304" value={materialClass} onChange={(e) => setMaterialClass(e.target.value)} className={inputStyles}/>
                     </div>
                     <div className="space-y-1 flex-1 min-w-0">
                        <Label htmlFor="scrap-price" className={labelStyles}>Preço (R$/kg)</Label>
                        <Input id="scrap-price" type="text" inputMode="decimal" value={scrapPrice} onChange={(e) => handleScrapPriceChange(e.target.value)} className={inputStyles}/>
                    </div>
                     <div className="space-y-1 flex-1 min-w-0"><Label htmlFor="quantity" className={labelStyles}>Qtde</Label><Input id="quantity" type="text" inputMode="decimal" placeholder="Qtd." value={dimensions.quantity} onChange={(e) => handleDimChange('quantity', e.target.value)} className={inputStyles}/></div>
                </div>
            </div>
        </div>
    
        <div className="pt-2 mt-2 border-t space-y-2">
            <div className="flex gap-px items-end">
                <div className="space-y-1 flex-1 min-w-0">
                    <Label htmlFor="weight">Peso Final (kg)</Label>
                    <Input id="weight" type="text" inputMode="decimal" placeholder="Peso Final" value={finalWeight} onChange={(e) => setFinalWeight(e.target.value.replace(/[^0-9,.]/g, ''))} className="font-semibold bg-muted/50 px-1 w-full h-10"/>
                </div>
                <div className="space-y-1 flex-1 min-w-0">
                    <Label className="text-accent-price font-semibold">R$ Total</Label>
                    <div className="w-full rounded-md border border-accent-price/50 bg-accent-price/10 px-3 py-2 text-base md:text-sm font-bold text-accent-price h-10 flex items-center">
                        {formatNumber(calculatedPrice, {style: 'currency', currency: 'BRL'})}
                    </div>
                </div>
            </div>
        </div>

        <div className="mt-2">
            <Button onClick={addToList} className="w-full gap-1">
                <PlusCircle/>
                Adicionar à Lista
            </Button>
        </div>
    </div>
  );
}

    