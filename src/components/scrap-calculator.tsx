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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { STAINLESS_STEEL_DENSITY_KG_M3 } from "@/lib/data";

type Shape = "rectangle" | "disc";
type FieldName = "width" | "length" | "thickness" | "weight" | "diameter";

const DENSITY = STAINLESS_STEEL_DENSITY_KG_M3;

export function ScrapCalculator() {
  const [shape, setShape] = React.useState<Shape>("rectangle");
  const [scrapPrice, setScrapPrice] = React.useState<number | "">(23);
  
  const [fields, setFields] = React.useState({
    width: "",
    length: "",
    thickness: "",
    weight: "",
    diameter: "",
  });

  const [realWeight, setRealWeight] = React.useState<number | null>(null);

  const handleInputChange = (fieldName: FieldName, value: string) => {
    // Only allow numeric input, including decimals, but also allow empty string
    if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
        setFields(prev => ({
            ...prev,
            [fieldName]: value
        }));
    }
  };

  const handleShapeChange = (value: Shape | "") => {
    if (value) {
      setShape(value);
      // Reset all fields when changing shape to start fresh
      setFields({ width: "", length: "", thickness: "", weight: "", diameter: "" });
      setRealWeight(null);
    }
  };

  React.useEffect(() => {
    const w = parseFloat(fields.width) || 0;
    const l = parseFloat(fields.length) || 0;
    const t = parseFloat(fields.thickness) || 0;
    const kg = parseFloat(fields.weight) || 0;
    const d = parseFloat(fields.diameter) || 0;

    let newFields = { ...fields };
    let newRealWeight: number | null = realWeight;
    let calculationDone = false;

    if (shape === 'rectangle') {
        const inputs = [w > 0, l > 0, t > 0, kg > 0];
        const filledCount = inputs.filter(Boolean).length;
        
        if (filledCount === 3) {
            calculationDone = true;
            if (!kg && w > 0 && l > 0 && t > 0) {
                const calculatedWeight = (w / 1000) * (l / 1000) * (t / 1000) * DENSITY;
                newRealWeight = calculatedWeight;
                newFields.weight = String(Math.ceil(calculatedWeight));
            } else if (!t && w > 0 && l > 0 && kg > 0) {
                const calculatedThickness = (kg / ((w / 1000) * (l / 1000) * DENSITY)) * 1000;
                newFields.thickness = calculatedThickness.toFixed(2);
                newRealWeight = kg;
            } else if (!l && w > 0 && t > 0 && kg > 0) {
                const calculatedLength = (kg / ((w / 1000) * (t / 1000) * DENSITY)) * 1000;
                newFields.length = calculatedLength.toFixed(2);
                newRealWeight = kg;
            } else if (!w && l > 0 && t > 0 && kg > 0) {
                const calculatedWidth = (kg / ((l / 1000) * (t / 1000) * DENSITY)) * 1000;
                newFields.width = calculatedWidth.toFixed(2);
                newRealWeight = kg;
            } else {
                calculationDone = false;
            }
        }
    } else { // disc
        const inputs = [d > 0, t > 0, kg > 0];
        const filledCount = inputs.filter(Boolean).length;

        if (filledCount === 2) {
            calculationDone = true;
            if (!kg && d > 0 && t > 0) {
                const r_m = d / 2000;
                const vol_m3 = Math.PI * r_m * r_m * (t / 1000);
                const calculatedWeight = vol_m3 * DENSITY;
                newRealWeight = calculatedWeight;
                newFields.weight = String(Math.ceil(calculatedWeight));
            } else if (!t && d > 0 && kg > 0) {
                const r_m = d / 2000;
                const area_m2 = Math.PI * r_m * r_m;
                const calculatedThickness = (kg / (area_m2 * DENSITY)) * 1000;
                newFields.thickness = calculatedThickness.toFixed(2);
                newRealWeight = kg;
            } else if (!d && t > 0 && kg > 0) {
                const vol_m3 = kg / DENSITY;
                const area_m2 = vol_m3 / (t / 1000);
                const r_m = Math.sqrt(area_m2 / Math.PI);
                const calculatedDiameter = r_m * 2 * 1000;
                newFields.diameter = calculatedDiameter.toFixed(2);
                newRealWeight = kg;
            } else {
                calculationDone = false;
            }
        }
    }
    
    if (calculationDone) {
        setFields(newFields);
        setRealWeight(newRealWeight);
    } else {
        const hasDim = shape === 'rectangle' ? (w > 0 && l > 0 && t > 0) : (d > 0 && t > 0);
        if (hasDim && kg > 0) {
            const calculatedWeight = shape === 'rectangle' 
                ? (w / 1000) * (l / 1000) * (t / 1000) * DENSITY 
                : Math.PI * (d/2000) * (d/2000) * (t / 1000) * DENSITY;
            setRealWeight(calculatedWeight);
        } else {
             setRealWeight(null);
        }
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields, shape]);


  const finalPrice = (Number(fields.weight) || 0) * (Number(scrapPrice) || 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };
  
  return (
    <Card>
      <CardHeader>
          <div className="flex-1">
            <CardTitle>Calculadora de Retalhos e Discos</CardTitle>
            <CardDescription className="mt-2">
              Preencha os campos para calcular o valor faltante.
            </CardDescription>
          </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <ToggleGroup
            type="single"
            value={shape}
            onValueChange={handleShapeChange}
            className="w-full grid grid-cols-2"
          >
            <ToggleGroupItem value="rectangle" aria-label="Retangular" className="h-12 text-base">
              Retangular
            </ToggleGroupItem>
            <ToggleGroupItem value="disc" aria-label="Disco" className="h-12 text-base">
              Disco
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {shape === "rectangle" ? (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="width">Largura(mm)</Label>
              <Input id="width" type="text" placeholder="Insira a largura" value={fields.width} onChange={(e) => handleInputChange('width', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="thickness">Espessura(mm)</Label>
              <Input id="thickness" type="text" placeholder="Insira a espessura" value={fields.thickness} onChange={(e) => handleInputChange('thickness', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="length">Compr.(mm)</Label>
              <Input id="length" type="text" placeholder="Insira o compr." value={fields.length} onChange={(e) => handleInputChange('length', e.target.value)} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="scrap-price">Preço (R$/kg)</Label>
                <Input
                id="scrap-price"
                type="number"
                step="0.01"
                value={scrapPrice}
                onChange={(e) => setScrapPrice(e.target.value === "" ? "" : e.target.valueAsNumber)}
                />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="diameter">Diâmetro(mm)</Label>
              <Input id="diameter" type="text" placeholder="Insira o diâmetro" value={fields.diameter} onChange={(e) => handleInputChange('diameter', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="thickness">Espessura(mm)</Label>
              <Input id="thickness" type="text" placeholder="Insira a espessura" value={fields.thickness} onChange={(e) => handleInputChange('thickness', e.target.value)} />
            </div>
            <div className="space-y-2 col-span-2">
                <Label htmlFor="scrap-price">Preço (R$/kg)</Label>
                <Input
                id="scrap-price"
                type="number"
                step="0.01"
                value={scrapPrice}
                onChange={(e) => setScrapPrice(e.target.value === "" ? "" : e.target.valueAsNumber)}
                />
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="space-y-2">
              <Label htmlFor="weight">Peso (kg)</Label>
              <Input id="weight" type="text" placeholder="Insira o peso" value={fields.weight} onChange={(e) => handleInputChange('weight', e.target.value)} />
            </div>
            <div className="space-y-2">
                <Label>Peso Real (kg)</Label>
                <div className="w-full rounded-md border border-input bg-muted/30 px-3 py-2 text-sm h-10 flex items-center text-muted-foreground">
                {realWeight !== null ? realWeight.toFixed(2) : "..."}
                </div>
            </div>
            <div className="space-y-2">
                <Label className="text-primary font-semibold">
                Preço Peça (R$)
                </Label>
                <div className="w-full rounded-md border border-primary/50 bg-primary/10 px-3 py-2 text-base md:text-sm font-bold text-primary h-10 flex items-center">
                {formatCurrency(finalPrice)}
                </div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
