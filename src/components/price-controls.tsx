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
    <Card className="border-none shadow-none">
      <CardContent className="pt-2">
        <div className="grid grid-cols-3 gap-1">
          <div className="space-y-1">
            <Label htmlFor="cost-price" className="text-xs">Custo (R$/kg)</Label>
            <Input
              id="cost-price"
              type="number"
              value={costPrice > 0 ? costPrice : ""}
              onChange={(e) => onCostChange(e.target.valueAsNumber)}
              placeholder="Ex: 25.50"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="markup" className="text-xs">Margem (%)</Label>
            <Input
              id="markup"
              type="number"
              value={markup > 0 ? markup.toFixed(2) : ""}
              onChange={(e) => onMarkupChange(e.target.valueAsNumber)}
              placeholder="Ex: 40"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="selling-price" className="text-primary font-semibold text-xs">Venda (R$/kg)</Label>
            <Input
              id="selling-price"
              type="number"
              value={sellingPrice > 0 ? sellingPrice.toFixed(2) : ""}
              onChange={(e) => onSellingPriceChange(e.target.valueAsNumber)}
              placeholder="Ex: 35.70"
              className="border-primary/50 text-primary font-bold text-sm"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
