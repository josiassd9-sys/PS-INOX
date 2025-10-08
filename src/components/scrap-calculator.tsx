"use client";

import * as React from "react";
import { v4 as uuidv4 } from "uuid";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { STAINLESS_STEEL_DENSITY_KG_M3, SteelItem } from "@/lib/data";
import { Button } from "./ui/button";
import { PlusCircle, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Shape = "rectangle" | "disc";

interface ScrapPiece {
    id: string;
    description: string;
    weight: number;
    price: number;
    pricePerKg?: number;
    length?: number;
    quantity?: number;
    unit?: 'm' | 'kg' | 'un';
}

interface ScrapCalculatorProps {
    onAddItem: (item: ScrapPiece) => void;
}


export function ScrapCalculator({ onAddItem }: ScrapCalculatorProps) {
  const { toast } = useToast();
  const [shape, setShape] = React.useState<Shape>("rectangle");
  const [scrapPrice, setScrapPrice] = React.useState<string>("23");
  
  const [dimensions, setDimensions] = React.useState({
    width: "",
    length: "",
    thickness: "",
    diameter: "",
    material: "304",
    scrapLength: "",
    quantity: "1",
  });
  
  const [manualWeight, setManualWeight] = React.useState<string>("");

  const handleDimChange = (field: keyof typeof dimensions, value: string) => {
    const sanitizedValue = value.replace(/[^0-9,.]/g, '').replace('.', ',');
    if (/^\d*\,?\d*$/.test(sanitizedValue)) {
        setDimensions(prev => ({ ...prev, [field]: sanitizedValue }));
        setManualWeight(""); // Clear manual weight when dimensions change
    }
  };
  
  const handleWeightChange = (value: string) => {
    const sanitizedValue = value.replace(/[^0-9,.]/g, '').replace('.', ',');
    if (/^\d*\,?\d*$/.test(sanitizedValue)) {
       setManualWeight(sanitizedValue);
    }
  }

  const handleScrapPriceChange = (value: string) => {
    const sanitizedValue = value.replace(/[^0-9,.]/g, '').replace('.', ',');
     if (/^\d*\,?\d*$/.test(sanitizedValue)) {
       setScrapPrice(sanitizedValue);
    }
  }

  const handleShapeChange = (value: Shape | "") => {
    if (value) {
      setShape(value);
      setDimensions({ width: "", length: "", thickness: "", diameter: "", material: "304", scrapLength: "", quantity: "1" });
      setManualWeight("");
    }
  };
  
  const { calculatedWeight, calculatedPrice, description, pricePerKg } = React.useMemo(() => {
    const qty = parseInt(dimensions.quantity) || 1;
    let weight = 0;
    let price = 0;
    let desc = "Retalho";
    let p_pricePerKg = parseFloat(scrapPrice.replace(',', '.')) || 0;
    
    const thick = parseFloat(dimensions.thickness.replace(',', '.')) || 0;
    
    if (shape === "rectangle") {
        const width = parseFloat(dimensions.width.replace(',', '.')) || 0;
        const length = parseFloat(dimensions.length.replace(',', '.')) || 0;
        if (width > 0 && length > 0 && thick > 0) {
            const volumeM3 = (width / 1000) * (length / 1000) * (thick / 1000);
            weight = volumeM3 * STAINLESS_STEEL_DENSITY_KG_M3;
            desc = `Chapa ${dimensions.material} ${dimensions.width}x${dimensions.length}x${dimensions.thickness}mm`;
        }
    } else { // Disc
        const diameter = parseFloat(dimensions.diameter.replace(',', '.')) || 0;
        if (diameter > 0 && thick > 0) {
            const radiusM = (diameter / 1000) / 2;
            const volumeM3 = Math.PI * Math.pow(radiusM, 2) * (thick / 1000);
            weight = volumeM3 * STAINLESS_STEEL_DENSITY_KG_M3;
            desc = `Disco ${dimensions.material} ø${dimensions.diameter}x${dimensions.thickness}mm`;
        }
    }
    weight *= qty;
    price = weight * p_pricePerKg;
    
    const finalWeight = parseFloat(manualWeight.replace(',', '.')) || weight;
    if (manualWeight && finalWeight > 0) {
        price = finalWeight * p_pricePerKg;
    }
    
    price = Math.ceil(price);

    return { 
        calculatedWeight: weight, 
        calculatedPrice: price, 
        description: desc,
        pricePerKg: p_pricePerKg,
    };

  }, [dimensions, shape, scrapPrice, manualWeight]);


  const addToList = () => {
    const qty = parseInt(dimensions.quantity) || 1;
    const finalWeight = parseFloat(manualWeight.replace(',', '.')) || calculatedWeight;

    if (finalWeight > 0 && calculatedPrice > 0) {
        onAddItem({
            id: uuidv4(),
            description: `${description} ${qty > 1 ? `(${qty} pçs)` : ''}`,
            weight: finalWeight,
            price: calculatedPrice,
            pricePerKg,
            quantity: qty,
            unit: 'un',
        });
        toast({ title: "Item Adicionado!", description: `${description} foi adicionado à lista.` });
        setDimensions({ width: "", length: "", thickness: "", diameter: "", material: "304", scrapLength: "", quantity: "1" });
        setManualWeight("");

    } else {
        toast({ variant: "destructive", title: "Dados incompletos", description: "Preencha os campos para calcular e adicionar o item." });
    }
  }

  const formatNumber = (value: string | number, options?: Intl.NumberFormatOptions) => {
    const num = typeof value === 'string' ? parseFloat(value.replace(',', '.')) : value;
    if (isNaN(num)) return "";
    return new Intl.NumberFormat('pt-BR', options).format(num);
  }

  const finalWeightToShow = parseFloat(manualWeight.replace(',', '.')) || calculatedWeight;

  return (
    <div className="flex flex-col h-full p-1" id="scrap-calculator-form">
        <>
            <div className="flex justify-center">
                <ToggleGroup type="single" value={shape} onValueChange={handleShapeChange} className="w-full grid grid-cols-2">
                    <ToggleGroupItem value="rectangle" aria-label="Retangular" className="h-12 text-base">Retangular</ToggleGroupItem>
                    <ToggleGroupItem value="disc" aria-label="Disco" className="h-12 text-base">Disco</ToggleGroupItem>
                </ToggleGroup>
            </div>

            <div className="space-y-1 mt-1">
              {shape === "rectangle" ? (
                <div className="space-y-1">
                    <div className="flex gap-1">
                        <div className="space-y-1 flex-1 min-w-0"><Label htmlFor="width">Larg.(mm)</Label><Input id="width" type="text" inputMode="decimal" placeholder="Largura" value={dimensions.width} onChange={(e) => handleDimChange('width', e.target.value)} /></div>
                        <div className="space-y-1 flex-1 min-w-0"><Label htmlFor="length">Compr.(mm)</Label><Input id="length" type="text" inputMode="decimal" placeholder="Compr." value={dimensions.length} onChange={(e) => handleDimChange('length', e.target.value)} /></div>
                        <div className="space-y-1 flex-1 min-w-0"><Label htmlFor="thickness">Esp.(mm)</Label><Input id="thickness" type="text" inputMode="decimal" placeholder="Espessura" value={dimensions.thickness} onChange={(e) => handleDimChange('thickness', e.target.value)} /></div>
                    </div>
                    <div className="flex gap-1">
                         <div className="space-y-1 flex-1 min-w-0"><Label htmlFor="material">Material</Label><Input id="material" placeholder="Ex: 304" value={dimensions.material} onChange={(e) => handleDimChange('material', e.target.value)} /></div>
                         <div className="space-y-1 flex-1 min-w-0">
                            <Label htmlFor="scrap-price">Preço (R$/kg)</Label>
                            <Input id="scrap-price" type="text" inputMode="decimal" value={scrapPrice} onChange={(e) => handleScrapPriceChange(e.target.value)} />
                        </div>
                         <div className="space-y-1 flex-1 min-w-0"><Label htmlFor="quantity">Qtde</Label><Input id="quantity" type="text" inputMode="decimal" placeholder="Qtd." value={dimensions.quantity} onChange={(e) => handleDimChange('quantity', e.target.value)} /></div>
                    </div>
                </div>
              ) : (
                <div className="space-y-1">
                    <div className="flex gap-1">
                        <div className="space-y-1 flex-1 min-w-0"><Label htmlFor="diameter">Diâmetro(mm)</Label><Input id="diameter" type="text" inputMode="decimal" placeholder="Diâmetro" value={dimensions.diameter} onChange={(e) => handleDimChange('diameter', e.target.value)} /></div>
                        <div className="space-y-1 flex-1 min-w-0"><Label htmlFor="thickness">Espessura(mm)</Label><Input id="thickness" type="text" inputMode="decimal" placeholder="Espessura" value={dimensions.thickness} onChange={(e) => handleDimChange('thickness', e.target.value)} /></div>
                    </div>
                    <div className="flex gap-1">
                       <div className="space-y-1 flex-1 min-w-0"><Label htmlFor="material">Material</Label><Input id="material" placeholder="Ex: 304" value={dimensions.material} onChange={(e) => handleDimChange('material', e.target.value)} /></div>
                        <div className="space-y-1 flex-1 min-w-0">
                            <Label htmlFor="scrap-price">Preço (R$/kg)</Label>
                            <Input id="scrap-price" type="text" inputMode="decimal" value={scrapPrice} onChange={(e) => handleScrapPriceChange(e.target.value)} />
                        </div>
                         <div className="space-y-1 flex-1 min-w-0"><Label htmlFor="quantity">Quantidade</Label><Input id="quantity" type="text" inputMode="decimal" placeholder="Qtd." value={dimensions.quantity} onChange={(e) => handleDimChange('quantity', e.target.value)} /></div>
                    </div>
                </div>
              )}
            </div>
        </>
        
        <div className="pt-1 mt-1 border-t space-y-1">
            <div className="flex gap-1 items-end">
                <div className="space-y-1 flex-1 min-w-0">
                    <Label htmlFor="weight">Peso Manual (kg)</Label>
                    <Input id="weight" type="text" inputMode="decimal" placeholder="Peso Final" value={manualWeight} onChange={(e) => handleWeightChange(e.target.value)} />
                </div>
                <div className="space-y-1 flex-1 min-w-0">
                    <Label>Peso Calculado (kg)</Label>
                    <div className="w-full rounded-md border border-input bg-muted/30 px-3 py-2 text-base md:text-sm h-10 flex items-center">
                        {formatNumber(finalWeightToShow, { minimumFractionDigits: 3 })}
                    </div>
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
