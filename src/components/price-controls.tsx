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

interface PriceControlsProps {
  costPrice: number;
  markup: number;
  sellingPrice: number;
  onCostChange: (value: number | null) => void;
  onMarkupChange: (value: number | null) => void;
  onSellingPriceChange: (value: number | null) => void;
}

export function PriceControls({
  costPrice,
  markup,
  sellingPrice,
  onCostChange,
  onMarkupChange,
  onSellingPriceChange,
}: PriceControlsProps) {

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle>Parâmetros de Preço Universal</CardTitle>
        <CardDescription>
          Altere os valores de custo, margem ou venda. Os preços de todos os
          itens serão atualizados em tempo real.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2 md:gap-4 items-end">
          <div className="space-y-2">
            <Label htmlFor="cost-price">Custo (R$/kg)</Label>
            <Input
              id="cost-price"
              type="number"
              value={costPrice > 0 ? costPrice : ""}
              onChange={(e) => onCostChange(e.target.valueAsNumber)}
              placeholder="Ex: 25.50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="markup">Margem (%)</Label>
            <Input
              id="markup"
              type="number"
              value={markup > 0 ? markup.toFixed(2) : ""}
              onChange={(e) => onMarkupChange(e.target.valueAsNumber)}
              placeholder="Ex: 40"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="selling-price" className="text-primary font-semibold">Venda (R$/kg)</Label>
            <Input
              id="selling-price"
              type="number"
              value={sellingPrice > 0 ? sellingPrice.toFixed(2) : ""}
              onChange={(e) => onSellingPriceChange(e.target.valueAsNumber)}
              placeholder="Ex: 35.70"
              className="border-primary/50 text-primary font-bold text-base"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
