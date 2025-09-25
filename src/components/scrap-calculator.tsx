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
    const sanitizedValue = value.replace(",", ".");
    if (sanitizedValue === '' || /^[0-9]*\.?[0-9]*$/.test(sanitizedValue)) {
        setFields(prev => ({
            ...prev,
            [fieldName]: value
        }));
    }
  };

  const handleScrapPriceChange = (value: string) => {
    const sanitizedValue = value.replace(",", ".");
    if (sanitizedValue === "") {
      setScrapPrice("");
      return;
    }
    if (/^[0-9]*\.?[0-9]{0,2}$/.test(sanitizedValue)) {
        const numValue = parseFloat(sanitizedValue);
        if (!isNaN(numValue)) {
            setScrapPrice(numValue);
        } else {
            setScrapPrice("")
        }
    }
  };

  const handleShapeChange = (value: Shape | "") => {
    if (value) {
      setShape(value);
      setFields({ width: "", length: "", thickness: "", weight: "", diameter: "" });
      setRealWeight(null);
    }
  };

  React.useEffect(() => {
    const getNum = (val: string) => parseFloat(val.replace(',', '.')) || 0;

    const w_mm = getNum(fields.width);
    const l_mm = getNum(fields.length);
    const t_mm = getNum(fields.thickness);
    const kg = getNum(fields.weight);
    const d_mm = getNum(fields.diameter);
  
    let calculatedWeight: number | null = null;
  
    if (shape === 'rectangle') {
      const inputs = [w_mm > 0, l_mm > 0, t_mm > 0, kg > 0];
      const filledCount = inputs.filter(Boolean).length;
  
      if (filledCount !== 3) {
        setRealWeight(null);
        return;
      };
      
      if (!kg) {
        calculatedWeight = (w_mm / 1000) * (l_mm / 1000) * (t_mm / 1000) * DENSITY;
      } else if (!t_mm) {
        const thickness = (kg / ((w_mm / 1000) * (l_mm / 1000) * DENSITY)) * 1000;
        setFields(prev => ({ ...prev, thickness: thickness.toFixed(2).replace('.', ',') }));
        calculatedWeight = kg;
      } else if (!l_mm) {
        const length = (kg / ((w_mm / 1000) * (t_mm / 1000) * DENSITY)) * 1000;
        setFields(prev => ({ ...prev, length: length.toFixed(2).replace('.', ',') }));
        calculatedWeight = kg;
      } else if (!w_mm) {
        const width = (kg / ((l_mm / 1000) * (t_mm / 1000) * DENSITY)) * 1000;
        setFields(prev => ({ ...prev, width: width.toFixed(2).replace('.', ',') }));
        calculatedWeight = kg;
      }

    } else { // disc
      const inputs = [d_mm > 0, t_mm > 0, kg > 0];
      const filledCount = inputs.filter(Boolean).length;
  
      if (filledCount !== 2) {
        setRealWeight(null);
        return;
      }
      
      if (!kg) {
        const r_m = d_mm / 2000;
        const vol_m3 = Math.PI * r_m * r_m * (t_mm / 1000);
        calculatedWeight = vol_m3 * DENSITY;
      } else if (!t_mm) {
        const r_m = d_mm / 2000;
        const area_m2 = Math.PI * r_m * r_m;
        const thickness = (kg / (area_m2 * DENSITY)) * 1000;
        setFields(prev => ({ ...prev, thickness: thickness.toFixed(2).replace('.', ',') }));
        calculatedWeight = kg;
      } else if (!d_mm) {
        const vol_m3 = kg / DENSITY;
        const area_m2 = vol_m3 / (t_mm / 1000);
        const r_m = Math.sqrt(area_m2 / Math.PI);
        const diameter = r_m * 2 * 1000;
        setFields(prev => ({ ...prev, diameter: diameter.toFixed(2).replace('.', ',') }));
        calculatedWeight = kg;
      }
    }
    
    if (calculatedWeight !== null) {
      setRealWeight(calculatedWeight);
    } else {
      // If weight is entered manually, that's the real weight
      if (kg > 0 && (shape === 'rectangle' ? filledCount < 3 : filledCount < 2)) {
         setRealWeight(kg);
      } else {
        setRealWeight(null);
      }
    }

  }, [fields.width, fields.length, fields.thickness, fields.weight, fields.diameter, shape]);

  React.useEffect(() => {
    if (realWeight !== null) {
      const roundedWeight = Math.ceil(realWeight);
      const currentWeightField = fields.weight.replace(',', '.');
      // Only update if the calculated rounded weight is different from what's in the field
      if (String(roundedWeight) !== currentWeightField) {
        setFields(prev => ({ ...prev, weight: String(roundedWeight).replace('.', ',') }));
      }
    }
  }, [realWeight]);


  const finalPrice = (parseFloat(fields.weight.replace(',', '.')) || 0) * (Number(scrapPrice) || 0);

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };
  
  return (
    <Card>
      <CardHeader>
          <div className="flex-1">
            <CardTitle>Calculadora de Retalhos</CardTitle>
            <CardDescription className="mt-2">
              Preencha os campos para calcular o valor.
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
                  type="text"
                  value={typeof scrapPrice === 'number' ? scrapPrice.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2}) : ""}
                  onChange={(e) => handleScrapPriceChange(e.target.value)}
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
                  type="text"
                  value={typeof scrapPrice === 'number' ? scrapPrice.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2}) : ""}
                  onChange={(e) => handleScrapPriceChange(e.target.value)}
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
                <Label>P. Real (kg)</Label>
                <div className="w-full rounded-md border border-input bg-muted/30 px-3 py-2 text-sm h-10 flex items-center text-muted-foreground">
                {realWeight !== null ? realWeight.toFixed(2).replace('.', ',') : "..."}
                </div>
            </div>
            <div className="space-y-2">
                <Label className="text-primary font-semibold">
                (R$)Peça
                </Label>
                <div className="w-full rounded-md border border-primary/50 bg-primary/10 px-3 py-2 text-base md:text-sm font-bold text-primary h-10 flex items-center">
                {formatPrice(finalPrice)}
                </div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
