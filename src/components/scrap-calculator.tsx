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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };
  
  const calculateAndUpdate = React.useCallback((updatedFields: Field[]) => {
    const newFields = updatedFields.map(f => ({ ...f, isCalculated: false }));
    
    const getField = (name: Field["name"]) => newFields.find(f => f.name === name);
    const getValue = (name: Field["name"]): number | null => {
        const field = getField(name);
        const value = field?.value;
        return value !== "" && value != null ? Number(value) : null;
    }

    if (shape === "rectangle") {
        let { width, length, thickness, weight } = {
            width: getValue('width'),
            length: getValue('length'),
            thickness: getValue('thickness'),
            weight: getValue('weight')
        };
        const filledCount = [width, length, thickness, weight].filter(v => v !== null).length;

        if (filledCount === 3) {
            if (weight === null && width && length && thickness) {
                const newWeight = (width * length * thickness * STAINLESS_STEEL_DENSITY_KG_M3) / 1_000_000_000;
                const weightField = getField('weight')!;
                weightField.value = Math.ceil(newWeight);
                weightField.isCalculated = true;
            } else if (thickness === null && width && length && weight) {
                const newThickness = (weight * 1_000_000_000) / (width * length * STAINLESS_STEEL_DENSITY_KG_M3);
                const thicknessField = getField('thickness')!;
                thicknessField.value = newThickness;
                thicknessField.isCalculated = true;
            } else if (length === null && width && thickness && weight) {
                const newLength = (weight * 1_000_000_000) / (width * thickness * STAINLESS_STEEL_DENSITY_KG_M3);
                const lengthField = getField('length')!;
                lengthField.value = newLength;
                lengthField.isCalculated = true;
            } else if (width === null && length && thickness && weight) {
                const newWidth = (weight * 1_000_000_000) / (length * thickness * STAINLESS_STEEL_DENSITY_KG_M3);
                const widthField = getField('width')!;
                widthField.value = newWidth;
                widthField.isCalculated = true;
            }
        }
    } else if (shape === "disc") {
        let { diameter, thickness, weight } = {
            diameter: getValue('diameter'),
            thickness: getValue('thickness'),
            weight: getValue('weight')
        };
        const filledCount = [diameter, thickness, weight].filter(v => v !== null).length;

        if (filledCount === 2) {
            if (weight === null && diameter && thickness) {
                const radius = diameter / 2;
                const newWeight = (Math.PI * radius * radius * thickness * STAINLESS_STEEL_DENSITY_KG_M3) / 1_000_000_000;
                const weightField = getField('weight')!;
                weightField.value = Math.ceil(newWeight);
                weightField.isCalculated = true;
            } else if (thickness === null && diameter && weight) {
                const radius = diameter / 2;
                const newThickness = (weight * 1_000_000_000) / (Math.PI * radius * radius * STAINLESS_STEEL_DENSITY_KG_M3);
                const thicknessField = getField('thickness')!;
                thicknessField.value = newThickness;
                thicknessField.isCalculated = true;
            } else if (diameter === null && thickness && weight) {
                const newDiameter = Math.sqrt((weight * 1_000_000_000) / (thickness * Math.PI * STAINLESS_STEEL_DENSITY_KG_M3)) * 2;
                const diameterField = getField('diameter')!;
                diameterField.value = newDiameter;
                diameterField.isCalculated = true;
            }
        }
    }
    
    const finalWeight = getValue('weight');
    if (finalWeight) {
        setFinalPrice(finalWeight * scrapPrice);
    } else {
        setFinalPrice(0);
    }
    setFields(newFields);
  }, [shape, scrapPrice]);


  React.useEffect(() => {
    calculateAndUpdate(fields);
  }, [scrapPrice, shape, fields, calculateAndUpdate]);

  const handleInputChange = (name: string, value: string) => {
    const newFields = fields.map((field) =>
      field.name === name ? { ...field, value: value, isCalculated: false } : field
    );
    calculateAndUpdate(newFields);
  };

  const getVisibleFields = () => {
    const commonFields = ["thickness", "weight"];
    if (shape === "rectangle") {
      return ["width", "length", ...commonFields];
    }
    return ["diameter", ...commonFields];
  };

  const handleShapeChange = (value: Shape | "") => {
    if (value) {
      setShape(value);
      setFields(initialFields.map(f => ({...f, value: ""})));
      setFinalPrice(0);
    }
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
                onChange={(e) => setScrapPrice(e.target.valueAsNumber || 0)}
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
                  className={field.isCalculated ? "bg-primary/10 border-primary/50" : ""}
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
