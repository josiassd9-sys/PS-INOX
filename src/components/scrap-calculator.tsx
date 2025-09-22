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

  const handleShapeChange = (value: Shape | "") => {
    if (value) {
      setShape(value);
    }
  };

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
                    Escolha o formato e preencha os campos para calcular a dimensão ou o peso faltante.
                </CardDescription>
            </div>
            {/* O campo de preço será adicionado aqui novamente */}
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

        {/* Os campos de input serão recriados aqui */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {shape === 'rectangle' ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="width">Largura (mm)</Label>
                <Input id="width" type="number" placeholder="Insira a largura" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="length">Comprimento (mm)</Label>
                <Input id="length" type="number" placeholder="Insira o comprimento" />
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="diameter">Diâmetro (mm)</Label>
              <Input id="diameter" type="number" placeholder="Insira o diâmetro" />
            </div>
          )}
           <div className="space-y-2">
              <Label htmlFor="thickness">Espessura (mm)</Label>
              <Input id="thickness" type="number" placeholder="Insira a espessura" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Peso (kg)</Label>
              <Input id="weight" type="number" placeholder="Insira o peso" />
            </div>
        </div>
        <div className="space-y-2 pt-4">
            <Label className="text-primary font-semibold text-lg">Preço Final da Peça</Label>
            <div className="w-full rounded-md border border-primary/50 bg-primary/10 px-4 py-3 text-xl font-bold text-primary flex items-center">
             {formatCurrency(0)}
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
