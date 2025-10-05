"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { ConnectionItem } from "@/lib/data";

interface ConnectionWeightCalculatorProps {
  connection: ConnectionItem;
  sellingPricePerKg: number;
  currentWeight: number;
  onSave: (itemId: string, newWeight: number) => void;
}

export function ConnectionWeightCalculator({
  connection,
  sellingPricePerKg,
  currentWeight,
  onSave,
}: ConnectionWeightCalculatorProps) {
  const [desiredPrice, setDesiredPrice] = React.useState<string>("");
  const [calculatedWeight, setCalculatedWeight] = React.useState<number>(currentWeight);
  
  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
    const sanitizedValue = value.replace(/[^0-9,.]/g, '').replace('.', ',');
    if (/^\d*\,?\d*$/.test(sanitizedValue)) {
      setter(sanitizedValue);
    }
  };

  React.useEffect(() => {
    const price = parseFloat(desiredPrice.replace(",", ".")) || 0;
    if (price > 0 && sellingPricePerKg > 0) {
      const newWeight = price / sellingPricePerKg;
      setCalculatedWeight(newWeight);
    } else {
      setCalculatedWeight(currentWeight);
    }
  }, [desiredPrice, sellingPricePerKg, currentWeight]);
  
  React.useEffect(() => {
    // Pre-fill the desired price based on the current weight
    if (currentWeight > 0 && sellingPricePerKg > 0) {
      const currentPrice = currentWeight * sellingPricePerKg;
      setDesiredPrice(Math.ceil(currentPrice).toFixed(2).replace('.', ','));
    }
  }, [currentWeight, sellingPricePerKg]);

  const handleSave = () => {
    onSave(connection.id, calculatedWeight);
  };
  
  const formatNumber = (value: number, digits: number = 3) => {
    return new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    }).format(value);
  };

  return (
    <Card className="border-none shadow-none">
       <CardHeader className="p-0 mb-1">
        <CardDescription>{connection.description}</CardDescription>
      </CardHeader>
      <CardContent className="p-0 space-y-1">
        <div className="space-y-1">
          <Label htmlFor="desired-price">Preço Final da Peça (R$)</Label>
          <Input
            id="desired-price"
            type="text"
            inputMode="decimal"
            value={desiredPrice}
            onChange={(e) => handleInputChange(setDesiredPrice, e.target.value)}
            placeholder="Digite o preço final"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-accent-price font-semibold">Peso Calculado (kg)</Label>
          <div className="w-full rounded-md border border-accent-price/50 bg-accent-price/10 px-3 py-2 text-base md:text-sm font-bold text-accent-price h-10 flex items-center">
            {formatNumber(calculatedWeight, 3)}
          </div>
        </div>
        <Button onClick={handleSave} className="w-full">
          Salvar Peso
        </Button>
      </CardContent>
    </Card>
  );
}
