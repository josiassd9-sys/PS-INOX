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

  const handleInputChange = (fieldName: FieldName) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFields(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleShapeChange = (value: Shape | "") => {
    if (value) {
      setShape(value);
      setFields({ width: "", length: "", thickness: "", weight: "", diameter: "" });
    }
  };

  const calculate = () => {
    const getNum = (val: string) => (val !== "" ? Number(val) : 0);
    const { width, length, thickness, weight, diameter } = fields;
    
    const calculatedFields = { ...fields };

    if (shape === 'rectangle') {
        const w = getNum(width);
        const l = getNum(length);
        const t = getNum(thickness);
        const kg = getNum(weight);
        const filledCount = [w, l, t, kg].filter(v => v > 0).length;

        if (filledCount === 3) {
            if (kg === 0) calculatedFields.weight = String(Math.ceil((w / 1000) * (l / 1000) * (t / 1000) * DENSITY));
            else if (t === 0) calculatedFields.thickness = String(Math.ceil((kg * 1000000000) / (w * l * DENSITY)));
            else if (l === 0) calculatedFields.length = String(Math.ceil((kg * 1000000000) / (w * t * DENSITY)));
            else if (w === 0) calculatedFields.width = String(Math.ceil((kg * 1000000000) / (l * t * DENSITY)));
        }
    } else { // disc
        const d = getNum(diameter);
        const t = getNum(thickness);
        const kg = getNum(weight);
        const filledCount = [d, t, kg].filter(v => v > 0).length;

        if (filledCount === 2) {
            if (kg === 0) {
                const r_m = d / 2000;
                const vol_m3 = Math.PI * r_m * r_m * (t / 1000);
                calculatedFields.weight = String(Math.ceil(vol_m3 * DENSITY));
            } else if (t === 0) {
                const r_m = d / 2000;
                const area_m2 = Math.PI * r_m * r_m;
                calculatedFields.thickness = String(Math.ceil((kg / (area_m2 * DENSITY)) * 1000));
            } else if (d === 0) {
                const vol_m3 = kg / DENSITY;
                const area_m2 = vol_m3 / (t / 1000);
                const r_m = Math.sqrt(area_m2 / Math.PI);
                calculatedFields.diameter = String(Math.ceil(r_m * 2 * 1000));
            }
        }
    }
    if(JSON.stringify(calculatedFields) !== JSON.stringify(fields)) {
        setFields(calculatedFields);
    }
    return calculatedFields;
  }

  React.useEffect(() => {
    calculate();
  }, [fields.width, fields.length, fields.thickness, fields.diameter, fields.weight, shape]);

  const displayFields = fields;
  const finalPrice = (Number(displayFields.weight) || 0) * (Number(scrapPrice) || 0);

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
              <Label htmlFor="width">Largura (mm)</Label>
              <Input id="width" type="number" placeholder="Insira a largura" value={displayFields.width} onChange={handleInputChange('width')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="thickness">Espessura (mm)</Label>
              <Input id="thickness" type="number" placeholder="Insira a espessura" value={displayFields.thickness} onChange={handleInputChange('thickness')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="length">Compr. (mm)</Label>
              <Input id="length" type="number" placeholder="Insira o comprimento" value={displayFields.length} onChange={handleInputChange('length')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Peso (kg)</Label>
              <Input id="weight" type="number" placeholder="Insira o peso" value={displayFields.weight} onChange={handleInputChange('weight')} />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="diameter">Diâmetro (mm)</Label>
              <Input id="diameter" type="number" placeholder="Insira o diâmetro" value={displayFields.diameter} onChange={handleInputChange('diameter')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="thickness">Espessura (mm)</Label>
              <Input id="thickness" type="number" placeholder="Insira a espessura" value={displayFields.thickness} onChange={handleInputChange('thickness')} />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="weight">Peso (kg)</Label>
              <Input id="weight" type="number" placeholder="Insira o peso" value={displayFields.weight} onChange={handleInputChange('weight')} />
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="space-y-2">
            <Label htmlFor="scrap-price" className="shrink-0">(R$/kg)</Label>
            <Input
              id="scrap-price"
              type="number"
              step="0.01"
              value={scrapPrice !== '' ? Number(scrapPrice).toFixed(2) : ''}
              onChange={(e) => setScrapPrice(e.target.value === "" ? "" : e.target.valueAsNumber)}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-primary font-semibold">
              Preço Final
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
