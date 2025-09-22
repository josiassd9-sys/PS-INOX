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

interface Field {
  name: "width" | "length" | "diameter" | "thickness" | "weight";
  label: string;
  unit: string;
  value: number | "";
  isCalculated?: boolean;
}

const initialFields: Field[] = [
  { name: "width", label: "Largura", unit: "mm", value: "" },
  { name: "length", label: "Comprimento", unit: "mm", value: "" },
  { name: "diameter", label: "Diâmetro", unit: "mm", value: "" },
  { name: "thickness", label: "Espessura", unit: "mm", value: "" },
  { name: "weight", label: "Peso", unit: "kg", value: "" },
];

export function ScrapCalculator() {
  const [shape, setShape] = React.useState<Shape>("rectangle");
  const [fields, setFields] = React.useState<Field[]>(initialFields);
  const [scrapPrice, setScrapPrice] = React.useState(23);
  const [finalPrice, setFinalPrice] = React.useState(0);

  const calculateAndUpdate = (updatedFields: Field[], currentInputName?: string) => {
    const newFields = updatedFields.map(f => ({ ...f, isCalculated: f.name !== currentInputName && f.isCalculated }));

    const getField = (name: Field["name"]) => newFields.find(f => f.name === name);
    const getValue = (name: Field["name"]): number | null => {
        const field = getField(name);
        const value = field?.value;
        return value !== "" && value != null && !isNaN(Number(value)) && Number(value) > 0 ? Number(value) : null;
    }

    let weightValue: number | "" | null = getValue('weight');

    if (shape === "rectangle") {
        let width = getValue('width');
        let length = getValue('length');
        let thickness = getValue('thickness');
        let weight = getValue('weight');

        const providedFields = [width, length, thickness, weight];
        const nullCount = providedFields.filter(v => v === null).length;

        if (nullCount === 1) {
            if (weight === null) {
                const newWeight = (width! * length! * thickness! * STAINLESS_STEEL_DENSITY_KG_M3) / 1_000_000_000;
                const weightField = getField('weight')!;
                weightField.value = Math.ceil(newWeight);
                weightField.isCalculated = true;
            } else if (thickness === null) {
                const newThickness = (weight * 1_000_000_000) / (width! * length! * STAINLESS_STEEL_DENSITY_KG_M3);
                const thicknessField = getField('thickness')!;
                thicknessField.value = newThickness;
                thicknessField.isCalculated = true;
            } else if (length === null) {
                const newLength = (weight * 1_000_000_000) / (width! * thickness! * STAINLESS_STEEL_DENSITY_KG_M3);
                const lengthField = getField('length')!;
                lengthField.value = newLength;
                lengthField.isCalculated = true;
            } else if (width === null) {
                const newWidth = (weight * 1_000_000_000) / (length! * thickness! * STAINLESS_STEEL_DENSITY_KG_M3);
                const widthField = getField('width')!;
                widthField.value = newWidth;
                widthField.isCalculated = true;
            }
        } else {
             // Clear previously calculated values if not enough fields are filled
             newFields.forEach(f => { if (f.isCalculated) f.value = ""; f.isCalculated = false; });
        }
    } else if (shape === "disc") {
        let diameter = getValue('diameter');
        let thickness = getValue('thickness');
        let weight = getValue('weight');
        
        const providedFields = [diameter, thickness, weight];
        const nullCount = providedFields.filter(v => v === null).length;

        if (nullCount === 1) {
            if (weight === null) {
                const radius = diameter! / 2;
                const newWeight = (Math.PI * radius * radius * thickness! * STAINLESS_STEEL_DENSITY_KG_M3) / 1_000_000_000;
                const weightField = getField('weight')!;
                weightField.value = Math.ceil(newWeight);
                weightField.isCalculated = true;
            } else if (thickness === null) {
                const radius = diameter! / 2;
                const newThickness = (weight * 1_000_000_000) / (Math.PI * radius * radius * STAINLESS_STEEL_DENSITY_KG_M3);
                const thicknessField = getField('thickness')!;
                thicknessField.value = newThickness;
                thicknessField.isCalculated = true;
            } else if (diameter === null) {
                const newDiameter = Math.sqrt((weight * 1_000_000_000) / (thickness! * Math.PI * STAINLESS_STEEL_DENSITY_KG_M3)) * 2;
                const diameterField = getField('diameter')!;
                diameterField.value = newDiameter;
                diameterField.isCalculated = true;
            }
        } else {
            // Clear previously calculated values
            newFields.forEach(f => { if (f.isCalculated) f.value = ""; f.isCalculated = false; });
        }
    }
    
    weightValue = getValue('weight');
    if (weightValue && scrapPrice > 0) {
        setFinalPrice(Number(weightValue) * scrapPrice);
    } else {
        setFinalPrice(0);
    }
    setFields(newFields);
  };

  const handleInputChange = (name: Field['name'], value: string) => {
    const updatedFields = fields.map((field) =>
      field.name === name ? { ...field, value: value, isCalculated: false } : field
    );
    calculateAndUpdate(updatedFields, name);
  };
  
  const handleScrapPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPrice = e.target.valueAsNumber;
    setScrapPrice(isNaN(newPrice) ? 0 : newPrice);
    const weightField = fields.find(f => f.name === 'weight');
    const weight = weightField?.value;
    if (weight && newPrice > 0) {
        setFinalPrice(Number(weight) * newPrice);
    } else {
        setFinalPrice(0);
    }
  }

  const handleShapeChange = (value: Shape | "") => {
    if (value) {
      setShape(value);
      const resetFields = initialFields.map(f => ({...f, value: "", isCalculated: false}));
      setFields(resetFields);
      setFinalPrice(0);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getVisibleFields = () => {
    const commonFields = ["thickness", "weight"];
    if (shape === "rectangle") {
      return ["width", "length", ...commonFields];
    }
    return ["diameter", ...commonFields];
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-1">
                <CardTitle>Calculadora de Retalhos e Discos</CardTitle>
                <CardDescription className="mt-2">
                    Escolha o formato e preencha os campos para calcular a dimensão ou o peso faltante.
                </CardDescription>
            </div>
            <div className="space-y-2 md:w-48">
                <Label htmlFor="scrap-price">Preço do Retalho (R$/kg)</Label>
                <Input
                id="scrap-price"
                type="number"
                value={scrapPrice > 0 ? scrapPrice : ""}
                onChange={handleScrapPriceChange}
                placeholder="Ex: 23.00"
                />
            </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center">
            <ToggleGroup type="single" value={shape} onValueChange={handleShapeChange} className="w-full grid grid-cols-2">
                <ToggleGroupItem value="rectangle" aria-label="Retangular" className="h-12 text-base">
                    Retangular
                </ToggleGroupItem>
                <ToggleGroupItem value="disc" aria-label="Disco" className="h-12 text-base">
                    Disco
                </ToggleGroupItem>
            </ToggleGroup>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {fields
            .filter((f) => getVisibleFields().includes(f.name))
            .map((field) => (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={field.name}>{field.label} ({field.unit})</Label>
                <Input
                  id={field.name}
                  type="number"
                  value={field.value}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  placeholder={`Insira ${field.label.toLowerCase()}`}
                  className={field.isCalculated ? "bg-primary/10 border-primary/50 font-bold" : ""}
                  readOnly={field.isCalculated}
                />
              </div>
            ))}
        </div>
        <div className="space-y-2 pt-4">
            <Label className="text-primary font-semibold text-lg">Preço Final da Peça</Label>
            <div className="w-full rounded-md border border-primary/50 bg-primary/10 px-4 py-3 text-xl font-bold text-primary flex items-center">
            {formatCurrency(finalPrice)}
            </div>
        </div>
      </CardContent>
    </Card>
  );
}

    