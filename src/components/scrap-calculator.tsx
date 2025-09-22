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

export function ScrapCalculator() {
  const [shape, setShape] = React.useState<Shape>("rectangle");
  const [scrapPrice, setScrapPrice] = React.useState<number | "">(23);
  
  // States for rectangle
  const [width, setWidth] = React.useState<number | "">("");
  const [length, setLength] = React.useState<number | "">("");
  const [thickness, setThickness] = React.useState<number | "">("");
  const [weight, setWeight] = React.useState<number | "">("");

  // State for disc
  const [diameter, setDiameter] = React.useState<number | "">("");

  const fieldSetters = {
    width: setWidth,
    length: setLength,
    thickness: setThickness,
    weight: setWeight,
    diameter: setDiameter,
  };

  React.useEffect(() => {
    const density = STAINLESS_STEEL_DENSITY_KG_M3;
    
    if (shape === 'rectangle') {
        const fields = { width, length, thickness, weight };
        const filledFields = Object.entries(fields).filter(([_, v]) => v !== "" && Number(v) > 0);
        
        if (filledFields.length !== 3) return;

        const emptyFieldName = Object.keys(fields).find(key => fields[key as keyof typeof fields] === "" || Number(fields[key as keyof typeof fields]) === 0);
        if (!emptyFieldName) return;

        const w_mm = Number(width);
        const l_mm = Number(length);
        const t_mm = Number(thickness);
        const kg = Number(weight);
        const setter = fieldSetters[emptyFieldName as keyof typeof fieldSetters];


        if (emptyFieldName === 'weight' && w_mm > 0 && l_mm > 0 && t_mm > 0) {
            const calculatedWeight = (w_mm / 1000) * (l_mm / 1000) * (t_mm / 1000) * density;
            setter(Math.ceil(calculatedWeight));
        } else if (emptyFieldName === 'thickness' && w_mm > 0 && l_mm > 0 && kg > 0) {
            const calculatedThickness = (kg * 1000 * 1000 * 1000) / (w_mm * l_mm * density);
            setter(Math.ceil(calculatedThickness));
        } else if (emptyFieldName === 'length' && w_mm > 0 && t_mm > 0 && kg > 0) {
            const calculatedLength = (kg * 1000 * 1000 * 1000) / (w_mm * t_mm * density);
            setter(Math.ceil(calculatedLength));
        } else if (emptyFieldName === 'width' && l_mm > 0 && t_mm > 0 && kg > 0) {
            const calculatedWidth = (kg * 1000 * 1000 * 1000) / (l_mm * t_mm * density);
            setter(Math.ceil(calculatedWidth));
        }

    } else { // disc
        const fields = { diameter, thickness, weight };
        const filledFields = Object.entries(fields).filter(([_, v]) => v !== "" && Number(v) > 0);

        if (filledFields.length !== 2) return;

        const emptyFieldName = Object.keys(fields).find(key => fields[key as keyof typeof fields] === "" || Number(fields[key as keyof typeof fields]) === 0);
        if (!emptyFieldName) return;

        const d_mm = Number(diameter);
        const t_mm = Number(thickness);
        const kg = Number(weight);
        const setter = fieldSetters[emptyFieldName as keyof typeof fieldSetters];


        if (emptyFieldName === 'weight' && d_mm > 0 && t_mm > 0) {
            const radius_m = d_mm / 2 / 1000;
            const volume_m3 = Math.PI * Math.pow(radius_m, 2) * (t_mm / 1000);
            const calculatedWeight = volume_m3 * density;
            setter(Math.ceil(calculatedWeight));
        } else if (emptyFieldName === 'thickness' && d_mm > 0 && kg > 0) {
            const radius_m = d_mm / 2 / 1000;
            const area_m2 = Math.PI * Math.pow(radius_m, 2);
            const calculatedThickness = (kg / (area_m2 * density)) * 1000;
            setter(Math.ceil(calculatedThickness));
        } else if (emptyFieldName === 'diameter' && t_mm > 0 && kg > 0) {
            const volume_m3 = kg / density;
            const area_m2 = volume_m3 / (t_mm / 1000);
            const radius_m = Math.sqrt(area_m2 / Math.PI);
            const calculatedDiameter = radius_m * 2 * 1000;
            setter(Math.ceil(calculatedDiameter));
        }
    }
  }, [width, length, thickness, weight, diameter, shape]);

  const handleShapeChange = (value: Shape | "") => {
    if (value) {
      setShape(value);
      setWidth(''); setLength(''); setThickness(''); setWeight(''); setDiameter('');
    }
  };

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<number | "">>) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setter(value === "" ? "" : Number(value));
    }
  }

  const finalPrice = (Number(weight) || 0) * (Number(scrapPrice) || 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1">
            <CardTitle>Calculadora de Retalhos e Discos</CardTitle>
            <CardDescription className="mt-2">
              Preencha 3 dos 4 campos (ou 2 de 3 para disco) para calcular o valor faltante.
            </CardDescription>
          </div>
          <div className="space-y-2">
            <Label htmlFor="scrap-price">Preço do Retalho (R$/kg)</Label>
            <Input
              id="scrap-price"
              type="number"
              value={scrapPrice}
              onChange={(e) => setScrapPrice(e.target.value === "" ? "" : e.target.valueAsNumber)}
              className="w-full md:w-40"
            />
          </div>
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

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {shape === "rectangle" ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="width">Largura (mm)</Label>
                <Input id="width" type="number" placeholder="Insira a largura" value={width} onChange={handleInputChange(setWidth)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="length">Comprimento (mm)</Label>
                <Input id="length" type="number" placeholder="Insira o comprimento" value={length} onChange={handleInputChange(setLength)} />
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="diameter">Diâmetro (mm)</Label>
              <Input id="diameter" type="number" placeholder="Insira o diâmetro" value={diameter} onChange={handleInputChange(setDiameter)} />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="thickness">Espessura (mm)</Label>
            <Input id="thickness" type="number" placeholder="Insira a espessura" value={thickness} onChange={handleInputChange(setThickness)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="weight">Peso (kg)</Label>
            <Input id="weight" type="number" placeholder="Insira o peso" value={weight} onChange={handleInputChange(setWeight)} />
          </div>
        </div>

        <div className="space-y-2 pt-4">
          <Label className="text-primary font-semibold text-lg">
            Preço Final da Peça
          </Label>
          <div className="w-full rounded-md border border-primary/50 bg-primary/10 px-4 py-3 text-xl font-bold text-primary flex items-center">
            {formatCurrency(finalPrice)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
