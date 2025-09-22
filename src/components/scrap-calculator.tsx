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

interface Fields {
  width: number | "";
  length: number | "";
  diameter: number | "";
  thickness: number | "";
  weight: number | "";
}

export function ScrapCalculator() {
  const [shape, setShape] = React.useState<Shape>("rectangle");
  const [fields, setFields] = React.useState<Fields>({
    width: "",
    length: "",
    diameter: "",
    thickness: "",
    weight: "",
  });
  const [scrapPrice, setScrapPrice] = React.useState(23);
  const [finalPrice, setFinalPrice] = React.useState(0);
  const [calculating, setCalculating] = React.useState<keyof Fields | null>(null);

  const handleInputChange = (name: keyof Fields, value: string) => {
    setCalculating(null); // Stop highlighting any field as calculated when user types
    setFields(prev => ({
        ...prev,
        [name]: value === "" ? "" : Number(value)
    }));
  };

  React.useEffect(() => {
    const vals = {
        width: fields.width !== "" ? Number(fields.width) : null,
        length: fields.length !== "" ? Number(fields.length) : null,
        diameter: fields.diameter !== "" ? Number(fields.diameter) : null,
        thickness: fields.thickness !== "" ? Number(fields.thickness) : null,
        weight: fields.weight !== "" ? Number(fields.weight) : null,
    };

    let calculatedField: keyof Fields | null = null;
    let newFields = { ...fields };

    if (shape === "rectangle") {
        const { width, length, thickness, weight } = vals;
        const providedFields = [width, length, thickness, weight].filter(v => v !== null).length;

        if (providedFields === 3) {
            if (weight === null && width && length && thickness) {
                const newWeight = (width * length * thickness * STAINLESS_STEEL_DENSITY_KG_M3) / 1_000_000_000;
                newFields.weight = Math.ceil(newWeight);
                calculatedField = 'weight';
            } else if (thickness === null && width && length && weight) {
                const newThickness = (weight * 1_000_000_000) / (width * length * STAINLESS_STEEL_DENSITY_KG_M3);
                newFields.thickness = Math.ceil(newThickness);
                calculatedField = 'thickness';
            } else if (length === null && width && thickness && weight) {
                const newLength = (weight * 1_000_000_000) / (width * thickness * STAINLESS_STEEL_DENSITY_KG_M3);
                newFields.length = Math.ceil(newLength);
                calculatedField = 'length';
            } else if (width === null && length && thickness && weight) {
                const newWidth = (weight * 1_000_000_000) / (length * thickness * STAINLESS_STEEL_DENSITY_KG_M3);
                newFields.width = Math.ceil(newWidth);
                calculatedField = 'width';
            }
        }
    } else { // Disc
        const { diameter, thickness, weight } = vals;
        const providedFields = [diameter, thickness, weight].filter(v => v !== null).length;

        if (providedFields === 2) {
            if (weight === null && diameter && thickness) {
                const radius = diameter / 2;
                const newWeight = (Math.PI * radius * radius * thickness * STAINLESS_STEEL_DENSITY_KG_M3) / 1_000_000_000;
                newFields.weight = Math.ceil(newWeight);
                calculatedField = 'weight';
            } else if (thickness === null && diameter && weight) {
                const radius = diameter / 2;
                const newThickness = (weight * 1_000_000_000) / (Math.PI * radius * radius * STAINLESS_STEEL_DENSITY_KG_M3);
                newFields.thickness = Math.ceil(newThickness);
                calculatedField = 'thickness';
            } else if (diameter === null && thickness && weight) {
                const newDiameter = Math.sqrt((weight * 1_000_000_000) / (thickness * Math.PI * STAINLESS_STEEL_DENSITY_KG_M3)) * 2;
                newFields.diameter = Math.ceil(newDiameter);
                calculatedField = 'diameter';
            }
        }
    }

    if (calculatedField) {
        setFields(newFields);
        setCalculating(calculatedField);
    }
    
    const finalWeight = newFields.weight !== "" ? Number(newFields.weight) : 0;
    if (finalWeight > 0 && scrapPrice > 0) {
        setFinalPrice(finalWeight * scrapPrice);
    } else {
        setFinalPrice(0);
    }

  }, [fields, shape, scrapPrice]);

  
  const handleScrapPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPrice = e.target.valueAsNumber;
    setScrapPrice(isNaN(newPrice) ? 0 : newPrice);
  }

  const handleShapeChange = (value: Shape | "") => {
    if (value) {
      setShape(value);
      setFields({ width: "", length: "", diameter: "", thickness: "", weight: "" });
      setFinalPrice(0);
      setCalculating(null);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };
  
  const renderInput = (name: keyof Fields, label: string, unit: string) => {
    const isCalculated = calculating === name;
    return (
        <div key={name} className="space-y-2">
            <Label htmlFor={name}>{label} ({unit})</Label>
            <Input
              id={name}
              type="number"
              value={fields[name]}
              onChange={(e) => handleInputChange(name, e.target.value)}
              placeholder={`Insira ${label.toLowerCase()}`}
              className={isCalculated ? "bg-primary/10 border-primary/50 font-bold" : ""}
              readOnly={isCalculated}
            />
        </div>
    );
  }

  const visibleFields: (keyof Fields)[] = shape === 'rectangle' 
    ? ["width", "length", "thickness", "weight"] 
    : ["diameter", "thickness", "weight"];
  
  const fieldLabels: Record<keyof Fields, { label: string, unit: string }> = {
    width: { label: "Largura", unit: "mm" },
    length: { label: "Comprimento", unit: "mm" },
    diameter: { label: "Diâmetro", unit: "mm" },
    thickness: { label: "Espessura", unit: "mm" },
    weight: { label: "Peso", unit: "kg" }
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
          {visibleFields.map(fieldName => renderInput(fieldName, fieldLabels[fieldName].label, fieldLabels[fieldName].unit))}
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
