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
  initialCutPercentage: number;
  onClose: () => void;
}

export function CutPriceCalculator({
  selectedItem,
  sellingPrice,
  initialCutPercentage,
  onClose,
}: CutPriceCalculatorProps) {
  const [cutLength, setCutLength] = React.useState<number | "">("");
  const [finalPrice, setFinalPrice] = React.useState(0);
  const [currentCutPercentage, setCurrentCutPercentage] = React.useState(initialCutPercentage);

  // Function to calculate dynamic percentage
  const calculateDynamicPercentage = (lengthInMm: number) => {
    if (lengthInMm <= 0) return 100;
    if (lengthInMm >= 3000) return 10;

    // Linear interpolation: y = y1 + (x - x1) * (y2 - y1) / (x2 - x1)
    // We are interpolating between (10mm, 100%) and (3000mm, 10%)
    const minLength = 10;
    const maxLength = 3000;
    const minPercentage = 100;
    const maxPercentage = 10;
    
    // Clamp the length to the defined range for calculation
    const clampedLength = Math.max(minLength, Math.min(lengthInMm, maxLength));

    const percentage = minPercentage + (clampedLength - minLength) * (maxPercentage - minPercentage) / (maxLength - minLength);
    
    return percentage;
  };

  React.useEffect(() => {
    if (cutLength !== "" && cutLength > 0) {
      const dynamicPercentage = calculateDynamicPercentage(Number(cutLength));
      setCurrentCutPercentage(dynamicPercentage);
      
      const pricePerMeter = selectedItem.weight * sellingPrice;
      const piecePrice = pricePerMeter * (Number(cutLength) / 1000);
      const finalPriceWithCut = piecePrice * (1 + dynamicPercentage / 100);
      setFinalPrice(Math.ceil(finalPriceWithCut));
    } else {
      setCurrentCutPercentage(initialCutPercentage);
      setFinalPrice(0);
    }
  }, [cutLength, sellingPrice, selectedItem, initialCutPercentage]);


  React.useEffect(() => {
    // Reset cut length when item changes
    setCutLength("");
  }, [selectedItem]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <Card className="sticky top-6">
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
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cut-length">Comprimento do Corte (mm)</Label>
            <Input
              id="cut-length"
              type="number"
              value={cutLength}
              onChange={(e) =>
                setCutLength(
                  e.target.value === "" ? "" : e.target.valueAsNumber
                )
              }
              placeholder="Ex: 500"
            />
          </div>
          <div className="space-y-2">
            <Label>Acréscimo de Corte (%)</Label>
            <div className="w-full rounded-md border border-input bg-muted/30 px-3 py-2 text-base md:text-sm font-semibold h-10 flex items-center">
              {currentCutPercentage.toFixed(2)}%
            </div>
          </div>
          <div className="space-y-2">
            <Label>Preço Final da Peça</Label>
            <div className="w-full rounded-md border border-input bg-muted/30 px-3 py-2 text-base md:text-sm font-semibold text-primary h-10 flex items-center">
              {formatCurrency(finalPrice)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
