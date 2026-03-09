
"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SteelItem } from "@/lib/data/types";
import { Button } from "./ui/button";
import { PlusCircle, X } from "lucide-react";

interface CutPriceCalculatorProps {
  selectedItem: SteelItem;
  sellingPrice: number;
  onClose: () => void;
  onAddItem: (item: any) => void;
}

export function CutPriceCalculator({
  selectedItem,
  sellingPrice,
  onClose,
  onAddItem,
}: CutPriceCalculatorProps) {
  const [cutLength, setCutLength] = React.useState<string>("");
  const [pieceWeight, setPieceWeight] = React.useState(0);
  const [finalPrice, setFinalPrice] = React.useState(0);
  const [currentCutPercentage, setCurrentCutPercentage] = React.useState(0);
  const [quantity, setQuantity] = React.useState<string>("1");
  const [materialClass, setMaterialClass] = React.useState<string>("304");


  // Function to calculate dynamic percentage based on length and weight
  const calculateDynamicPercentage = (lengthInMm: number, weightInKg: number): number => {
    // Rule: For any cut of 6m (6000mm) or more, the markup is 0%.
    if (lengthInMm >= 6000) {
      return 0;
    }
    // Rule: For any cut above 3m (3000mm) up to 6m, the markup is 5%.
    if (lengthInMm > 3000) {
      return 5;
    }

    const minLength = 10;
    const maxLength = 3000;

    if (lengthInMm <= minLength) lengthInMm = minLength;
    if (lengthInMm > maxLength) lengthInMm = maxLength; // Cap at 3000 for interpolation

    let highPercentage: number;
    let lowPercentage: number;

    // Determine percentage range based on weight tier
    if (weightInKg <= 0.5) {
      // Tier 1: up to 0.5 kg -> 100% to 10%
      highPercentage = 100;
      lowPercentage = 10;
    } else if (weightInKg <= 2) {
      // Tier 2: 0.5 kg to 2 kg -> 50% to 10%
      highPercentage = 50;
      lowPercentage = 10;
    } else {
      // Tier 3: above 2 kg -> 30% to 10%
      highPercentage = 30;
      lowPercentage = 10;
    }

    // Linear interpolation between minLength and maxLength
    const percentage = highPercentage + (lengthInMm - minLength) * (lowPercentage - highPercentage) / (maxLength - minLength);

    return percentage;
  };


  React.useEffect(() => {
    const lengthValue = parseFloat(cutLength.replace(",", "."));
    let calculatedWeight = 0;
    if (cutLength !== "" && lengthValue > 0) {
      const lengthInMeters = lengthValue / 1000;
      calculatedWeight = selectedItem.weight * lengthInMeters;
    }
    setPieceWeight(calculatedWeight);

    if (calculatedWeight > 0) {
      const dynamicPercentage = calculateDynamicPercentage(lengthValue, calculatedWeight);
      setCurrentCutPercentage(dynamicPercentage);

      const pricePerMeter = selectedItem.weight * sellingPrice;
      const piecePrice = pricePerMeter * (lengthValue / 1000);

      const finalPriceWithCut = piecePrice * (1 + dynamicPercentage / 100);
      setFinalPrice(Math.ceil(finalPriceWithCut));
    } else {
      setCurrentCutPercentage(0);
      setFinalPrice(0);
    }
  }, [cutLength, sellingPrice, selectedItem]);


  React.useEffect(() => {
    // Reset cut length when item changes or when selling price changes
    setCutLength("");
    setFinalPrice(0);
    setPieceWeight(0);
    setCurrentCutPercentage(0);
    setQuantity("1");
    setMaterialClass("304");
  }, [selectedItem, sellingPrice]);
  
  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
    const sanitizedValue = value.replace(/[^0-9,.]/g, '').replace('.', ',');
    if (/^\d*\,?\d*$/.test(sanitizedValue)) {
      setter(sanitizedValue);
    }
  };


  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };
  
  const formatNumber = (value: number, digits: number = 3) => {
    return new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    }).format(value);
  };
  
  const handleAdd = () => {
    const qty = parseInt(quantity) || 1;
    if (finalPrice > 0 && pieceWeight > 0) {
        
        const descriptionParts = selectedItem.description.split(" ");
        // Find the word that contains "Inox", but case-insensitive
        const inoxIndex = descriptionParts.findIndex(p => p.toLowerCase().includes('inox'));

        if (inoxIndex !== -1) {
            descriptionParts.splice(inoxIndex + 1, 0, materialClass || "");
        } else {
             descriptionParts.splice(1, 0, "Inox", materialClass || "");
        }

        const newDescription = descriptionParts.join(" ");

        onAddItem({
            ...selectedItem,
            description: `${newDescription} - ${cutLength}mm`,
            price: finalPrice * qty,
            weight: pieceWeight * qty,
            length: parseFloat(cutLength.replace(",", ".")),
            quantity: qty,
            unit: 'm'
        })
        onClose();
    }
  }

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle>Cálculo de Corte</CardTitle>
                <CardDescription className="mt-1">
                    {selectedItem.description}
                </CardDescription>
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={onClose}>
                <X/>
            </Button>
        </div>

      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <div className="flex gap-1">
            <div className="space-y-1 flex-1">
              <Label htmlFor="cut-length">Comprimento do Corte (mm)</Label>
              <Input
                id="cut-length"
                type="text"
                inputMode="decimal"
                value={cutLength}
                onChange={(e) => handleInputChange(setCutLength, e.target.value)}
                placeholder="Ex: 500"
              />
            </div>
            <div className="space-y-1 w-1/4">
              <Label htmlFor="material-class">Classe Inox</Label>
              <Input
                id="material-class"
                type="text"
                value={materialClass}
                onChange={(e) => setMaterialClass(e.target.value)}
                placeholder="304"
              />
            </div>
             <div className="space-y-1 w-1/4">
              <Label htmlFor="quantity">Quantidade</Label>
              <Input
                id="quantity"
                type="text"
                inputMode="decimal"
                value={quantity}
                onChange={(e) => handleInputChange(setQuantity, e.target.value)}
                placeholder="Qtd."
              />
            </div>
          </div>
          <div className="flex gap-1">
             <div className="space-y-1 flex-1">
                <Label>Peso da Peça (kg)</Label>
                <div className="w-full rounded-md border border-input bg-muted/30 px-3 py-2 text-base md:text-sm font-semibold h-10 flex items-center">
                    {formatNumber(pieceWeight, 3)}
                </div>
            </div>
            <div className="space-y-1 flex-1">
                <Label>Acréscimo de Corte (%)</Label>
                <div className="w-full rounded-md border border-input bg-muted/30 px-3 py-2 text-base md:text-sm font-semibold h-10 flex items-center">
                {currentCutPercentage.toFixed(2).replace('.',',')}%
                </div>
            </div>
          </div>
           <div className="flex gap-1 items-end">
             <div className="space-y-1 flex-1">
                <Label className="text-accent-price font-semibold">Preço Final da Peça</Label>
                <div className="w-full rounded-md border border-accent-price/50 bg-accent-price/10 px-3 py-2 text-base md:text-sm font-bold text-accent-price h-10 flex items-center">
                {formatCurrency(finalPrice)}
                </div>
            </div>
            <Button onClick={handleAdd} className="h-10 gap-1">
                <PlusCircle />
                Adicionar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

    