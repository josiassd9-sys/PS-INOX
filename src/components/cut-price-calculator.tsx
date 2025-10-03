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
import type { SteelItem } from "@/lib/data";
import { Button } from "./ui/button";
import { X } from "lucide-react";

interface CutPriceCalculatorProps {
  selectedItem: SteelItem;
  sellingPrice: number;
  onClose: () => void;
}

export function CutPriceCalculator({
  selectedItem,
  sellingPrice,
  onClose,
}: CutPriceCalculatorProps) {
  const [cutLength, setCutLength] = React.useState<string>("");
  const [pieceWeight, setPieceWeight] = React.useState(0);
  const [finalPrice, setFinalPrice] = React.useState(0);
  const [currentCutPercentage, setCurrentCutPercentage] = React.useState(0);

  // Function to calculate dynamic percentage
  const calculateDynamicPercentage = (lengthInMm: number) => {
    const minLength = 10;
    const midLength = 1000;
    const maxLength = 3000;
    const highPercentage = 100;
    const midPercentage = 30;
    const lowPercentage = 10;

    if (lengthInMm <= minLength) return highPercentage;
    if (lengthInMm >= maxLength) return lowPercentage;

    if (lengthInMm <= midLength) {
      // Interpolate between 10mm (100%) and 1000mm (30%)
      return highPercentage + (lengthInMm - minLength) * (midPercentage - highPercentage) / (midLength - minLength);
    } else {
      // Interpolate between 1000mm (30%) and 3000mm (10%)
      return midPercentage + (lengthInMm - midLength) * (lowPercentage - midPercentage) / (maxLength - midLength);
    }
  };

  React.useEffect(() => {
    const lengthValue = parseFloat(cutLength.replace(",", "."));
    if (cutLength !== "" && lengthValue > 0) {
      const lengthInMeters = lengthValue / 1000;
      const weight = selectedItem.weight * lengthInMeters;
      setPieceWeight(weight);
      
      const dynamicPercentage = calculateDynamicPercentage(lengthValue);
      setCurrentCutPercentage(dynamicPercentage);
      
      const pricePerMeter = selectedItem.weight * sellingPrice;
      const piecePrice = pricePerMeter * lengthInMeters;
      const finalPriceWithCut = piecePrice * (1 + dynamicPercentage / 100);
      setFinalPrice(Math.ceil(finalPriceWithCut));
    } else {
      setCurrentCutPercentage(0);
      setPieceWeight(0);
      setFinalPrice(0);
    }
  }, [cutLength, sellingPrice, selectedItem]);


  React.useEffect(() => {
    // Reset cut length when item changes or when selling price changes
    setCutLength("");
    setFinalPrice(0);
    setPieceWeight(0);
    setCurrentCutPercentage(0);
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
            <div className="space-y-1 flex-1">
                <Label>Peso da Peça (kg)</Label>
                <div className="w-full rounded-md border border-input bg-muted/30 px-3 py-2 text-base md:text-sm font-semibold h-10 flex items-center">
                    {formatNumber(pieceWeight, 3)}
                </div>
            </div>
          </div>
          <div className="flex gap-1">
            <div className="space-y-1 flex-1">
                <Label>Acréscimo de Corte (%)</Label>
                <div className="w-full rounded-md border border-input bg-muted/30 px-3 py-2 text-base md:text-sm font-semibold h-10 flex items-center">
                {currentCutPercentage.toFixed(2)}%
                </div>
            </div>
            <div className="space-y-1 flex-1">
                <Label className="text-accent-price font-semibold">Preço Final da Peça</Label>
                <div className="w-full rounded-md border border-accent-price/50 bg-accent-price/10 px-3 py-2 text-base md:text-sm font-bold text-accent-price h-10 flex items-center">
                {formatCurrency(finalPrice)}
                </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
