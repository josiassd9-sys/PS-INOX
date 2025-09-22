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
  
  const [lastEdited, setLastEdited] = React.useState<FieldName | null>(null);

  const calculateMissingField = (updatedFields: Record<string, string>, lastEditedField: FieldName | null) => {
    const newFields = { ...updatedFields };

    const getNum = (val: string) => (val !== "" ? Number(val) : 0);
    
    if (shape === 'rectangle') {
      const { width, length, thickness, weight } = newFields;
      const inputs = { width, length, thickness, weight };
      const filledCount = Object.values(inputs).filter(v => v !== "").length;

      if (filledCount === 3) {
        const w = getNum(width);
        const l = getNum(length);
        const t = getNum(thickness);
        const kg = getNum(weight);
        
        if (weight === "" || lastEditedField !== 'weight') {
          if (w > 0 && l > 0 && t > 0) newFields.weight = String(Math.ceil((w / 1000) * (l / 1000) * (t / 1000) * DENSITY));
        }
        if (thickness === "" || lastEditedField !== 'thickness') {
           if (w > 0 && l > 0 && kg > 0) newFields.thickness = String(Math.ceil((kg * 1000000000) / (w * l * DENSITY)));
        }
        if (length === "" || lastEditedField !== 'length') {
           if (w > 0 && t > 0 && kg > 0) newFields.length = String(Math.ceil((kg * 1000000000) / (w * t * DENSITY)));
        }
        if (width === "" || lastEditedField !== 'width') {
           if (l > 0 && t > 0 && kg > 0) newFields.width = String(Math.ceil((kg * 1000000000) / (l * t * DENSITY)));
        }
      }
    } else { // disc
      const { diameter, thickness, weight } = newFields;
      const inputs = { diameter, thickness, weight };
      const filledCount = Object.values(inputs).filter(v => v !== "").length;

      if (filledCount === 2) {
        const d = getNum(diameter);
        const t = getNum(thickness);
        const kg = getNum(weight);

        if (weight === "" || lastEditedField !== 'weight') {
          if (d > 0 && t > 0) {
            const r_m = d / 2000;
            const vol_m3 = Math.PI * r_m * r_m * (t / 1000);
            newFields.weight = String(Math.ceil(vol_m3 * DENSITY));
          }
        }
        if (thickness === "" || lastEditedField !== 'thickness') {
          if (d > 0 && kg > 0) {
            const r_m = d / 2000;
            const area_m2 = Math.PI * r_m * r_m;
            newFields.thickness = String(Math.ceil((kg / (area_m2 * DENSITY)) * 1000));
          }
        }
        if (diameter === "" || lastEditedField !== 'diameter') {
          if (t > 0 && kg > 0) {
            const vol_m3 = kg / DENSITY;
            const area_m2 = vol_m3 / (t / 1000);
            const r_m = Math.sqrt(area_m2 / Math.PI);
            newFields.diameter = String(Math.ceil(r_m * 2 * 1000));
          }
        }
      }
    }
    return newFields;
  };

  const handleInputChange = (fieldName: FieldName) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLastEdited(fieldName);
    
    setFields(prevFields => {
      const updatedFields = {
        ...prevFields,
        [fieldName]: value,
      };
      
      const filledCount = Object.values(updatedFields).filter(v => v !== "" && v !== "0").length;
      const requiredCount = shape === 'rectangle' ? 3 : 2;

      // If user clears a field, clear the calculated field too
      if (value === "") {
        const filledValues = Object.entries(updatedFields)
          .filter(([k,v]) => v !== "");
        if(filledValues.length < requiredCount) {
            for(const key in updatedFields) {
               if(key !== fieldName && prevFields[key as FieldName] !== updatedFields[key as FieldName]) {
                 updatedFields[key as FieldName] = "";
               }
            }
        }
      }
      
      return calculateMissingField(updatedFields, fieldName);
    });
  };

  const handleShapeChange = (value: Shape | "") => {
    if (value) {
      setShape(value);
      setFields({ width: "", length: "", thickness: "", weight: "", diameter: "" });
      setLastEdited(null);
    }
  };
  
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
                <Input id="width" type="number" placeholder="Insira a largura" value={fields.width} onChange={handleInputChange('width')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="length">Comprimento (mm)</Label>
                <Input id="length" type="number" placeholder="Insira o comprimento" value={fields.length} onChange={handleInputChange('length')} />
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="diameter">Diâmetro (mm)</Label>
              <Input id="diameter" type="number" placeholder="Insira o diâmetro" value={fields.diameter} onChange={handleInputChange('diameter')} />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="thickness">Espessura (mm)</Label>
            <Input id="thickness" type="number" placeholder="Insira a espessura" value={fields.thickness} onChange={handleInputChange('thickness')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="weight">Peso (kg)</Label>
            <Input id="weight" type="number" placeholder="Insira o peso" value={fields.weight} onChange={handleInputChange('weight')} />
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
