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
    prefilledItem: SteelItem | null;
    onClearPrefill: () => void;
    sellingPrice: number;
    onAddItem: (item: ScrapPiece) => void;
}

const calculateCutPercentage = (lengthInMm: number, weightInKg: number): number => {
    if (lengthInMm >= 6000) return 0;
    if (lengthInMm > 3000) return 5;

    const minLength = 10;
    const maxLength = 3000;

    if (lengthInMm <= minLength) lengthInMm = minLength;
    if (lengthInMm > maxLength) lengthInMm = maxLength;

    let highPercentage: number;
    let lowPercentage: number;

    if (weightInKg <= 0.5) {
      highPercentage = 100;
      lowPercentage = 10;
    } else if (weightInKg <= 2) {
      highPercentage = 50;
      lowPercentage = 10;
    } else {
      highPercentage = 30;
      lowPercentage = 10;
    }

    const percentage = highPercentage + (lengthInMm - minLength) * (lowPercentage - highPercentage) / (maxLength - minLength);
    return percentage;
};

export function ScrapCalculator({ prefilledItem, onClearPrefill, sellingPrice, onAddItem }: ScrapCalculatorProps) {
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
  
  const { calculatedWeight, calculatedPrice, description, pricePerKg, cutPercentage } = React.useMemo(() => {
    const qty = parseInt(dimensions.quantity) || 1;
    let weight = 0;
    let price = 0;
    let desc = "Retalho";
    let p_pricePerKg = parseFloat(scrapPrice.replace(',', '.')) || 0;
    let p_cutPercentage = 0;

    if (prefilledItem) {
        p_pricePerKg = sellingPrice;
        const scrapLengthMm = parseFloat(dimensions.scrapLength.replace(',', '.')) || 0;
        
        if (prefilledItem.unit === 'm' && scrapLengthMm > 0) {
            const pieceWeight = prefilledItem.weight * (scrapLengthMm / 1000);
            p_cutPercentage = calculateCutPercentage(scrapLengthMm, pieceWeight);
            const piecePrice = pieceWeight * p_pricePerKg;
            const finalPiecePrice = piecePrice * (1 + p_cutPercentage / 100);
            
            weight = pieceWeight * qty;
            price = Math.ceil(finalPiecePrice) * qty;
            desc = `${prefilledItem.description} - ${dimensions.scrapLength}mm`;
        } else if (prefilledItem.unit === 'un') {
            weight = prefilledItem.weight * qty;
            price = p_pricePerKg * qty;
            desc = prefilledItem.description;
        }

    } else { // Custom scrap calculation
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
    }

    const finalWeight = parseFloat(manualWeight.replace(',', '.')) || weight;
    if (manualWeight && finalWeight > 0) {
        const basePrice = finalWeight * p_pricePerKg;
        price = basePrice * (1 + p_cutPercentage / 100);
    }
    
    if (prefilledItem?.unit === 'm' || (!prefilledItem && shape === 'rectangle')) {
        price = Math.ceil(price);
    }


    return { 
        calculatedWeight: weight, 
        calculatedPrice: price, 
        description: desc,
        pricePerKg: p_pricePerKg,
        cutPercentage: p_cutPercentage,
    };

  }, [dimensions, shape, scrapPrice, prefilledItem, sellingPrice, manualWeight]);


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
            length: prefilledItem ? parseFloat(dimensions.scrapLength.replace(',', '.')) : undefined,
            quantity: qty,
            unit: prefilledItem?.unit || 'un',
        });
        toast({ title: "Item Adicionado!", description: `${description} foi adicionado à lista.` });
        setDimensions({ width: "", length: "", thickness: "", diameter: "", material: "304", scrapLength: "", quantity: "1" });
        setManualWeight("");
        if(prefilledItem) onClearPrefill();

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
        {prefilledItem ? (
            <div className="mb-1 space-y-1 rounded-lg border border-primary/20 bg-primary/5 p-1">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-semibold text-primary">Calcular retalho de item selecionado:</h3>
                        <p className="text-sm text-muted-foreground">{prefilledItem.description}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0 -mr-2 -mt-2" onClick={onClearPrefill}>
                        <X/>
                    </Button>
                </div>
                {prefilledItem.unit !== 'un' ? (
                    <div className="flex gap-1">
                        <div className="space-y-1 flex-1">
                            <Label htmlFor="scrapLength">Comprimento do Retalho (mm)</Label>
                            <Input id="scrapLength" type="text" inputMode="decimal" placeholder="Insira o comprimento" value={dimensions.scrapLength} onChange={(e) => handleDimChange('scrapLength', e.target.value)} />
                        </div>
                        <div className="space-y-1 w-1/3">
                            <Label htmlFor="quantity">Quantidade</Label>
                            <Input id="quantity" type="text" inputMode="decimal" placeholder="Qtd." value={dimensions.quantity} onChange={(e) => handleDimChange('quantity', e.target.value)} />
                        </div>
                   </div>
                ) : (
                    <div className="space-y-1">
                        <Label htmlFor="quantity">Quantidade de Peças</Label>
                        <Input id="quantity" type="text" inputMode="decimal" placeholder="Insira a quantidade" value={dimensions.quantity} onChange={(e) => handleDimChange('quantity', e.target.value)} />
                    </div>
                )}
            </div>
        ) : (
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
                                <Input id="scrap-price" type="text" inputMode="decimal" value={scrapPrice} onChange={(e) => handleScrapPriceChange(e.target.value)} disabled={!!prefilledItem}/>
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
                                <Input id="scrap-price" type="text" inputMode="decimal" value={scrapPrice} onChange={(e) => handleScrapPriceChange(e.target.value)} disabled={!!prefilledItem}/>
                            </div>
                             <div className="space-y-1 flex-1 min-w-0"><Label htmlFor="quantity">Quantidade</Label><Input id="quantity" type="text" inputMode="decimal" placeholder="Qtd." value={dimensions.quantity} onChange={(e) => handleDimChange('quantity', e.target.value)} /></div>
                        </div>
                    </div>
                  )}
                </div>
            </>
        )}
        
        <div className="pt-1 mt-1 border-t space-y-1">
             {prefilledItem && prefilledItem.unit === 'm' && (
                <div className="space-y-1 flex-1 min-w-0">
                    <Label htmlFor="cut-percentage">Acréscimo de Corte (%)</Label>
                    <div className="w-full rounded-md border border-input bg-muted/30 px-3 py-2 text-base md:text-sm h-10 flex items-center">
                        {cutPercentage.toFixed(2).replace('.', ',')}%
                    </div>
                </div>
             )}
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
