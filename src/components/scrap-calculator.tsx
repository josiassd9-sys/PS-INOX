
"use client";

import * as React from "react";
import { v4 as uuidv4 } from "uuid";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { STAINLESS_STEEL_DENSITY_KG_M3 } from "@/lib/data";
import { Button } from "./ui/button";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

export function ScrapCalculator({ onAddItem }: ScrapCalculatorProps) {
  const { toast } = useToast();
  const [scrapPrice, setScrapPrice] = React.useState<string>("23");
  
  const [dimensions, setDimensions] = React.useState({
    width: "580",
    length: "1500",
    thickness: "3,5",
    quantity: "1",
  });
  
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

  const { calculatedWeight, description } = React.useMemo(() => {
    const parseDimension = (val: string) => parseFloat(val.replace(',', '.')) / 1000 || 0;

    const widthM = parseDimension(dimensions.width);
    const lengthM = parseDimension(dimensions.length);
    const thicknessM = parseDimension(dimensions.thickness);
    const qty = parseInt(dimensions.quantity) || 0;
    
    let weight = 0;
    let desc = "Retalho";

    if (widthM > 0 && lengthM > 0 && thicknessM > 0 && qty > 0) {
        const volumeM3 = widthM * lengthM * thicknessM;
        weight = volumeM3 * STAINLESS_STEEL_DENSITY_KG_M3 * qty;
        desc = `Chapa ${dimensions.width}x${dimensions.length}x${dimensions.thickness}mm`;
    }
    
    return { calculatedWeight: weight, description: desc };
  }, [dimensions]);


  React.useEffect(() => {
    setFinalWeight(calculatedWeight > 0 ? calculatedWeight.toFixed(3).replace('.', ',') : "");
  }, [calculatedWeight]);


  const calculatedPrice = React.useMemo(() => {
    const weightValue = parseFloat(finalWeight.replace(',', '.')) || 0;
    const priceValue = parseFloat(scrapPrice.replace(',', '.')) || 0;
    if (weightValue > 0 && priceValue > 0) {
      return Math.ceil(weightValue * priceValue);
    }
    return 0;
  }, [finalWeight, scrapPrice]);


  const addToList = () => {
    const qty = parseInt(dimensions.quantity) || 1;
    const weightValue = parseFloat(finalWeight.replace(',', '.')) || 0;
    const pricePerKg = parseFloat(scrapPrice.replace(',', '.')) || 0;

    if (weightValue > 0 && calculatedPrice > 0) {
        onAddItem({
            id: uuidv4(),
            description: `${description} ${qty > 1 ? `(${qty} pçs)` : ''}`,
            weight: weightValue,
            price: calculatedPrice,
            pricePerKg,
            quantity: qty,
            unit: 'un',
        });
        toast({ title: "Item Adicionado!", description: `${description} foi adicionado à lista.` });
        setDimensions(prev => ({ ...prev, width: "", length: "", thickness: "", quantity: "1"}));
    } else {
        toast({ variant: "destructive", title: "Dados incompletos", description: "Preencha os campos para calcular e adicionar o item." });
    }
  }

  const formatNumber = (value: string | number, options?: Intl.NumberFormatOptions) => {
    const num = typeof value === 'string' ? parseFloat(value.replace(',', '.')) : value;
    if (isNaN(num)) return "";
    return new Intl.NumberFormat('pt-BR', options).format(num);
  }

  return (
    <div className="flex flex-col h-full p-1" id="scrap-calculator-form">
        <div className="space-y-1 mt-1">
            <div className="space-y-1">
                <div className="flex gap-1">
                    <div className="space-y-1 flex-1 min-w-0"><Label htmlFor="width">Larg.(mm)</Label><Input id="width" type="text" inputMode="decimal" placeholder="Largura" value={dimensions.width} onChange={(e) => handleDimChange('width', e.target.value)} /></div>
                    <div className="space-y-1 flex-1 min-w-0"><Label htmlFor="length">Compr.(mm)</Label><Input id="length" type="text" inputMode="decimal" placeholder="Compr." value={dimensions.length} onChange={(e) => handleDimChange('length', e.target.value)} /></div>
                    <div className="space-y-1 flex-1 min-w-0"><Label htmlFor="thickness">Esp.(mm)</Label><Input id="thickness" type="text" inputMode="decimal" placeholder="Espessura" value={dimensions.thickness} onChange={(e) => handleDimChange('thickness', e.target.value)} /></div>
                </div>
                <div className="flex gap-1">
                     <div className="space-y-1 flex-1 min-w-0">
                        <Label htmlFor="scrap-price">Preço (R$/kg)</Label>
                        <Input id="scrap-price" type="text" inputMode="decimal" value={scrapPrice} onChange={(e) => handleScrapPriceChange(e.target.value)} />
                    </div>
                     <div className="space-y-1 flex-1 min-w-0"><Label htmlFor="quantity">Qtde</Label><Input id="quantity" type="text" inputMode="decimal" placeholder="Qtd." value={dimensions.quantity} onChange={(e) => handleDimChange('quantity', e.target.value)} /></div>
                </div>
            </div>
        </div>
    
        <div className="pt-1 mt-1 border-t space-y-1">
            <div className="flex gap-1 items-end">
                <div className="space-y-1 flex-1 min-w-0">
                    <Label htmlFor="weight">Peso Final (kg)</Label>
                    <Input id="weight" type="text" inputMode="decimal" placeholder="Peso Final" value={finalWeight} readOnly className="font-semibold bg-muted/50"/>
                </div>
                <div className="space-y-1 flex-1 min-w-0">
                    <Label className="text-accent-price font-semibold">R$ Total</Label>
                    <div className="w-full rounded-md border border-accent-price/50 bg-accent-price/10 px-3 py-2 text-base md:text-sm font-bold text-accent-price h-10 flex items-center">
                        {formatNumber(calculatedPrice, {style: 'currency', currency: 'BRL'})}
                    </div>
                </div>
            </div>
        </div>

        <div className="mt-1">
            <Button onClick={addToList} className="w-full gap-1">
                <PlusCircle/>
                Adicionar à Lista
            </Button>
        </div>
    </div>
  );
}
