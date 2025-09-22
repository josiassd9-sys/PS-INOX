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
  const [lastEdited, setLastEdited] = React.useState<string | null>(null);
  const [scrapPrice, setScrapPrice] = React.useState(23);
  const [finalPrice, setFinalPrice] = React.useState(0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  React.useEffect(() => {
    const weightField = fields.find((f) => f.name === "weight");
    if (weightField && weightField.value && scrapPrice) {
      setFinalPrice(Math.ceil(Number(weightField.value)) * scrapPrice);
    } else {
      setFinalPrice(0);
    }
  }, [fields, scrapPrice]);

  React.useEffect(() => {
    const fieldValues = fields.reduce((acc, field) => {
      acc[field.name] =
        field.value !== "" ? parseFloat(field.value as string) : null;
      return acc;
    }, {} as Record<keyof Omit<Field, "isCalculated" | "label" | "unit">, number | null>);

    const filledFields = fields.filter(
      (f) => f.value !== "" && (shape === "rectangle" ? ["width", "length", "thickness", "weight"].includes(f.name) : ["diameter", "thickness", "weight"].includes(f.name))
    );

    if (filledFields.length < 3 && shape === 'rectangle') return;
    if (filledFields.length < 2 && shape === 'disc') return;

    let newFields = [...fields];
    let calculated = false;

    // Rectangle Calculations
    if (shape === "rectangle") {
      const { width, length, thickness, weight } = fieldValues;
      // Calculate weight
      if (width && length && thickness && lastEdited !== "weight") {
        const newWeight = (width * length * thickness * STAINLESS_STEEL_DENSITY_KG_M3) / 1000000;
        newFields = newFields.map(f => f.name === 'weight' ? {...f, value: Math.ceil(newWeight), isCalculated: true} : f);
        calculated = true;
      }
      // Calculate thickness
      else if (width && length && weight && lastEdited !== "thickness") {
        const newThickness = (weight * 1000000) / (width * length * STAINLESS_STEEL_DENSITY_KG_M3);
        newFields = newFields.map(f => f.name === 'thickness' ? {...f, value: newThickness, isCalculated: true} : f);
        calculated = true;
      }
      // Calculate length
      else if (width && thickness && weight && lastEdited !== "length") {
        const newLength = (weight * 1000000) / (width * thickness * STAINLESS_STEEL_DENSITY_KG_M3);
        newFields = newFields.map(f => f.name === 'length' ? {...f, value: newLength, isCalculated: true} : f);
        calculated = true;
      }
      // Calculate width
      else if (length && thickness && weight && lastEdited !== "width") {
        const newWidth = (weight * 1000000) / (length * thickness * STAINLESS_STEEL_DENSITY_KG_M3);
        newFields = newFields.map(f => f.name === 'width' ? {...f, value: newWidth, isCalculated: true} : f);
        calculated = true;
      }
    }
    // Disc Calculations
    else if (shape === "disc") {
        const { diameter, thickness, weight } = fieldValues;
        // Calculate weight
        if(diameter && thickness && lastEdited !== "weight"){
            const radius = diameter / 2;
            const newWeight = (Math.PI * radius * radius * thickness * STAINLESS_STEEL_DENSITY_KG_M3) / 1000000;
            newFields = newFields.map(f => f.name === 'weight' ? {...f, value: Math.ceil(newWeight), isCalculated: true} : f);
            calculated = true;
        }
        // Calculate thickness
        else if(diameter && weight && lastEdited !== "thickness"){
            const radius = diameter / 2;
            const newThickness = (weight * 1000000) / (Math.PI * radius * radius * STAINLESS_STEEL_DENSITY_KG_M3);
            newFields = newFields.map(f => f.name === 'thickness' ? {...f, value: newThickness, isCalculated: true} : f);
            calculated = true;
        }
        // Calculate diameter
        else if(thickness && weight && lastEdited !== "diameter"){
            const newDiameter = Math.sqrt((weight * 1000000) / (thickness * Math.PI * STAINLESS_STEEL_DENSITY_KG_M3)) * 2;
            newFields = newFields.map(f => f.name === 'diameter' ? {...f, value: newDiameter, isCalculated: true} : f);
            calculated = true;
        }
    }
    
    if (calculated) {
      setFields(newFields);
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields, lastEdited, shape]);


  const handleInputChange = (name: string, value: string) => {
    setLastEdited(name);
    setFields(
      fields.map((field) =>
        field.name === name ? { ...field, value: value, isCalculated: false } : {...field, isCalculated: false}
      )
    );
  };
  
  const handleShapeChange = (value: Shape | "") => {
    if (value) {
      setShape(value);
      setFields(initialFields.map(f => ({...f, value: ""})));
      setLastEdited(null);
    }
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
        <CardTitle>Calculadora de Retalhos e Discos</CardTitle>
        <CardDescription>
          Escolha o formato e preencha os campos para calcular a dimensão ou o peso faltante.
        </CardDescription>
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
             <div className="space-y-2">
                <Label htmlFor="scrap-price">Preço do Retalho (R$/kg)</Label>
                <Input
                id="scrap-price"
                type="number"
                value={scrapPrice}
                onChange={(e) => setScrapPrice(e.target.valueAsNumber)}
                placeholder="Ex: 23.00"
                />
            </div>
            <div className="space-y-2">
                <Label className="text-primary font-semibold">Preço Final da Peça</Label>
                <div className="w-full rounded-md border border-primary/50 bg-primary/10 px-3 py-2 text-base md:text-sm font-bold text-primary h-10 flex items-center">
                {formatCurrency(finalPrice)}
                </div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
