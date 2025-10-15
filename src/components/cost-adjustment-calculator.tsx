
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
import type { SteelItem } from "@/lib/data/index";
import { Button } from "./ui/button";

interface CostAdjustmentCalculatorProps {
  item: SteelItem;
  baseCostPrice: number;
  markup: number;
  currentAdjustment: number;
  onSave: (itemId: string, adjustment: number) => void;
}

export function CostAdjustmentCalculator({
  item,
  baseCostPrice,
  markup,
  currentAdjustment,
  onSave,
}: CostAdjustmentCalculatorProps) {
  const [adjustment, setAdjustment] = React.useState<string>(
    currentAdjustment.toString().replace(".", ",")
  );

  const handleInputChange = (value: string) => {
    const sanitizedValue = value.replace(/[^0-9,.-]/g, "").replace(".", ",");
    if (/^-?\d*\,?\d*$/.test(sanitizedValue)) {
      setAdjustment(sanitizedValue);
    }
  };

  const { adjustedCost, finalSellingPrice } = React.useMemo(() => {
    const adjustmentValue = parseFloat(adjustment.replace(",", ".")) || 0;
    const adjCost = baseCostPrice * (1 + adjustmentValue / 100);
    const finalPrice = adjCost * (1 + markup / 100);
    return { adjustedCost: adjCost, finalSellingPrice: finalPrice };
  }, [adjustment, baseCostPrice, markup]);

  const handleSave = () => {
    onSave(item.id, parseFloat(adjustment.replace(",", ".")) || 0);
  };
  
  const formatValue = (value: number) => {
      if (value === 0 || value === null || isNaN(value)) return "";
      return value.toFixed(2).replace(".", ",");
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="p-0 mb-1">
        <CardDescription>{item.description}</CardDescription>
      </CardHeader>
      <CardContent className="p-0 space-y-2">
        <div className="grid grid-cols-2 gap-1">
            <div className="space-y-1">
                <Label className="text-xs">Custo Base (R$/kg)</Label>
                <div className="w-full rounded-md border border-input bg-muted/30 px-3 py-2 text-base md:text-sm font-semibold h-10 flex items-center">
                    {formatCurrency(baseCostPrice)}
                </div>
            </div>
             <div className="space-y-1">
                <Label htmlFor="adjustment-factor" className="text-xs">Fator de Ajuste (%)</Label>
                <Input
                id="adjustment-factor"
                type="text"
                inputMode="decimal"
                value={adjustment}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="Ex: 10 ou -5"
                />
            </div>
        </div>

        <div className="grid grid-cols-2 gap-1">
            <div className="space-y-1">
                <Label className="text-primary font-semibold text-xs">Custo Final (R$/kg)</Label>
                <div className="w-full rounded-md border border-primary/50 bg-primary/10 px-3 py-2 text-base md:text-sm font-bold text-primary h-10 flex items-center">
                    {formatCurrency(adjustedCost)}
                </div>
            </div>
            <div className="space-y-1">
                <Label className="text-accent-price font-semibold text-xs">Venda Final (R$/kg)</Label>
                <div className="w-full rounded-md border border-accent-price/50 bg-accent-price/10 px-3 py-2 text-base md:text-sm font-bold text-accent-price h-10 flex items-center">
                    {formatCurrency(finalSellingPrice)}
                </div>
            </div>
        </div>

        <Button onClick={handleSave} className="w-full">
          Salvar Ajuste
        </Button>
      </CardContent>
    </Card>
  );
}
