"use client";

import * as React from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PriceControlsProps {
  costPrice: number;
  markup: number;
  sellingPrice: number;
  onCostChange: (value: number | null) => void;
  onMarkupChange: (value: number | null) => void;
  onSellingPriceChange: (value: number | null) => void;
  isConnections?: boolean;
}

export function PriceControls({
  costPrice,
  markup,
  sellingPrice,
  onCostChange,
  onMarkupChange,
  onSellingPriceChange,
  isConnections = false,
}: PriceControlsProps) {

  const handleInputChange = (callback: (value: number | null) => void, value: string) => {
    if (value === "") {
        callback(null);
        return;
    }
    const sanitizedValue = value.replace(",", ".");
    const numValue = parseFloat(sanitizedValue);
    if (!isNaN(numValue)) {
        callback(numValue);
    }
  };

  const formatValue = (value: number) => {
      if (value === 0 || value === null || isNaN(value)) return "";
      return value.toFixed(2).replace(".", ",");
  }
  
  const costLabel = isConnections ? "Multiplicador de Custo" : "Custo (R$/kg)";
  const sellingPriceLabel = isConnections ? "Margem de Lucro (%)" : "Venda (R$/kg)";
  const markupLabel = isConnections ? "Preço Final (Calculado)" : "Margem (%)";


  return (
    <Card className="border-none shadow-none">
      <CardContent className="pt-2">
        <div className="grid grid-cols-3 gap-1">
          <div className="space-y-1">
            <Label htmlFor="cost-price" className="text-xs">{costLabel}</Label>
            <Input
              id="cost-price"
              type="text"
              inputMode="decimal"
              value={formatValue(costPrice)}
              onChange={(e) => handleInputChange(onCostChange, e.target.value)}
              placeholder={isConnections ? "Ex: 1,00" : "Ex: 25,50"}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="markup" className="text-xs">{isConnections ? 'Margem (%)' : 'Margem (%)'}</Label>
            <Input
              id="markup"
              type="text"
              inputMode="decimal"
              value={formatValue(markup)}
              onChange={(e) => handleInputChange(onMarkupChange, e.target.value)}
              placeholder="Ex: 40,00"
            />
          </div>
          <div className="space-y-1">
             <Label htmlFor="selling-price" className="text-primary font-semibold text-xs">{isConnections ? 'Preço Final (Calculado)' : 'Venda (R$/kg)'}</Label>
            <Input
              id="selling-price"
              type="text"
              inputMode="decimal"
              value={formatValue(sellingPrice)}
              onChange={(e) => handleInputChange(onSellingPriceChange, e.target.value)}
              placeholder={isConnections ? "" : "Ex: 35,70"}
              className="border-primary/50 text-primary font-bold text-sm"
              disabled={isConnections}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
