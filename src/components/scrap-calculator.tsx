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
  
  const [lastEdited, setLastEdited] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fields =
      shape === "rectangle"
        ? { width, length, thickness, weight }
        : { diameter, thickness, weight };
    
    const filledFields = Object.values(fields).filter(v => v !== "" && v !== 0).length;
    const expectedFilled = shape === 'rectangle' ? 3 : 2;

    if (filledFields < expectedFilled) {
        if (lastEdited) {
             const resetField = (field: string) => {
                if (field === 'width') setWidth('');
                if (field === 'length') setLength('');
                if (field === 'thickness') setThickness('');
                if (field === 'weight') setWeight('');
                if (field === 'diameter') setDiameter('');
            }
            // If we have less than the required fields, find the one that wasn't last edited and clear it.
            const fieldToClear = Object.keys(fields).find(k => k !== lastEdited && Object.values(fields).filter(v => v === '').length < Object.keys(fields).length -1);
            if (fieldToClear) {
               // resetField(fieldToClear);
            }
        }
       return;
    };
    if (filledFields > expectedFilled) return;

    // --- Calculation Logic ---
    const w_mm = Number(width);
    const l_mm = Number(length);
    const t_mm = Number(thickness);
    const kg = Number(weight);
    const d_mm = Number(diameter);
    const density = STAINLESS_STEEL_DENSITY_KG_M3; // kg/m³

    if (shape === 'rectangle') {
        if (weight === "" && width && length && thickness && lastEdited !== 'weight') {
            const calculatedWeight = (w_mm / 1000) * (l_mm / 1000) * (t_mm / 1000) * density;
            setWeight(Math.ceil(calculatedWeight));
        } else if (thickness === "" && width && length && weight && lastEdited !== 'thickness') {
            const calculatedThickness = (kg * 1000) / ((w_mm / 1000) * (l_mm / 1000) * density);
            setThickness(Math.ceil(calculatedThickness));
        } else if (length === "" && width && thickness && weight && lastEdited !== 'length') {
            const calculatedLength = (kg * 1000) / ((w_mm / 1000) * (t_mm / 1000) * density);
            setLength(Math.ceil(calculatedLength));
        } else if (width === "" && length && thickness && weight && lastEdited !== 'width') {
             const calculatedWidth = (kg * 1000) / ((l_mm / 1000) * (t_mm / 1000) * density);
            setWidth(Math.ceil(calculatedWidth));
        }
    } else { // disc
        if (weight === "" && diameter && thickness && lastEdited !== 'weight') {
            const radius_m = d_mm / 2 / 1000;
            const volume_m3 = Math.PI * Math.pow(radius_m, 2) * (t_mm / 1000);
            const calculatedWeight = volume_m3 * density;
            setWeight(Math.ceil(calculatedWeight));
        } else if (thickness === "" && diameter && weight && lastEdited !== 'thickness') {
            const radius_m = d_mm / 2 / 1000;
            const area_m2 = Math.PI * Math.pow(radius_m, 2);
            const calculatedThickness = (kg / (area_m2 * density)) * 1000;
            setThickness(Math.ceil(calculatedThickness));
        } else if (diameter === "" && thickness && weight && lastEdited !== 'diameter') {
            const volume_m3 = kg / density;
            const area_m2 = volume_m3 / (t_mm / 1000);
            const radius_m = Math.sqrt(area_m2 / Math.PI);
            const calculatedDiameter = radius_m * 2 * 1000;
            setDiameter(Math.ceil(calculatedDiameter));
        }
    }

  }, [width, length, thickness, weight, diameter, shape, lastEdited]);


  const handleShapeChange = (value: Shape | "") => {
    if (value) {
      setShape(value);
      setWidth('');
      setLength('');
      setThickness('');
      setWeight('');
      setDiameter('');
      setLastEdited(null);
    }
  };

  const createInputHandler = (setter: React.Dispatch<React.SetStateAction<number | "">>, fieldName: string) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
        setLastEdited(fieldName);
        
        // Reset the calculated field to allow new calculation
        const allFields = shape === 'rectangle' ? ['width', 'length', 'thickness', 'weight'] : ['diameter', 'thickness', 'weight'];
        const currentValues = shape === 'rectangle' ? {width, length, thickness, weight} : {diameter, thickness, weight};
        
        const filledCount = allFields.filter(f => {
            if (f === 'width') return width !== '';
            if (f === 'length') return length !== '';
            if (f === 'thickness') return thickness !== '';
            if (f === 'weight') return weight !== '';
            if (f === 'diameter') return diameter !== '';
            return false;
        }).length;

        if(filledCount >= (shape === 'rectangle' ? 3 : 2)) {
             const fieldToReset = allFields.find(f => f !== fieldName);
             if (fieldToReset) {
                 if (fieldToReset === 'width') setWidth('');
                 if (fieldToReset === 'length') setLength('');
                 if (fieldToReset === 'thickness') setThickness('');
                 if (fieldToReset === 'weight') setWeight('');
                 if (fieldToReset === 'diameter') setDiameter('');
             }
        }
       
        setter(e.target.value === "" ? "" : e.target.valueAsNumber);
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
              Preencha os campos para calcular a dimensão ou o peso faltante.
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
                <Input id="width" type="number" placeholder="Insira a largura" value={width} onChange={createInputHandler(setWidth, 'width')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="length">Comprimento (mm)</Label>
                <Input id="length" type="number" placeholder="Insira o comprimento" value={length} onChange={createInputHandler(setLength, 'length')} />
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="diameter">Diâmetro (mm)</Label>
              <Input id="diameter" type="number" placeholder="Insira o diâmetro" value={diameter} onChange={createInputHandler(setDiameter, 'diameter')} />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="thickness">Espessura (mm)</Label>
            <Input id="thickness" type="number" placeholder="Insira a espessura" value={thickness} onChange={createInputHandler(setThickness, 'thickness')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="weight">Peso (kg)</Label>
            <Input id="weight" type="number" placeholder="Insira o peso" value={weight} onChange={createInputHandler(setWeight, 'weight')} />
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
