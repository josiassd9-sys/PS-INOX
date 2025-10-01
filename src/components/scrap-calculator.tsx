"use client";

import * as React from "react";
import { v4 as uuidv4 } from "uuid";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { STAINLESS_STEEL_DENSITY_KG_M3, SteelItem } from "@/lib/data";
import { Button } from "./ui/button";
import { PlusCircle, Printer, Save, Trash2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type Shape = "rectangle" | "disc";
type FieldName = "width" | "length" | "thickness" | "weight" | "diameter" | "material" | "scrapLength";

interface ScrapPiece {
    id: string;
    description: string;
    weight: number;
    price: number;
}

interface ScrapCalculatorProps {
    prefilledItem: SteelItem | null;
    onClearPrefill: () => void;
    sellingPrice: number;
}

const DENSITY = STAINLESS_STEEL_DENSITY_KG_M3;
const LOCAL_STORAGE_KEY = "scrapCalculatorList";

export function ScrapCalculator({ prefilledItem, onClearPrefill, sellingPrice }: ScrapCalculatorProps) {
  const { toast } = useToast();
  const [shape, setShape] = React.useState<Shape>("rectangle");
  const [scrapPrice, setScrapPrice] = React.useState<string>("23");
  
  const [fields, setFields] = React.useState({
    width: "",
    length: "",
    thickness: "",
    weight: "",
    diameter: "",
    material: "304",
    scrapLength: "",
  });

  const [scrapList, setScrapList] = React.useState<ScrapPiece[]>([]);
  const [calculatedWeight, setCalculatedWeight] = React.useState<number | null>(null);

  React.useEffect(() => {
    try {
      const savedList = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedList) {
        setScrapList(JSON.parse(savedList));
      }
    } catch (error) {
      console.error("Failed to load state from localStorage", error);
    }
  }, []);

  const saveListToLocalStorage = (list: ScrapPiece[]) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
    } catch (error) {
      console.error("Failed to save state to localStorage", error);
      toast({
        variant: "destructive",
        title: "Erro ao Salvar",
        description: "Não foi possível salvar a lista.",
      });
    }
  };

  const handleInputChange = (fieldName: FieldName, value: string) => {
    const sanitizedValue = fieldName === 'material' ? value : value.replace(",", ".");
    
    if (fieldName !== 'material' && sanitizedValue !== '' && !/^[0-9]*\.?[0-9]*$/.test(sanitizedValue)) {
        return;
    }
    setFields(prev => ({
        ...prev,
        [fieldName]: fieldName === 'material' ? sanitizedValue : value
    }));
  };

  const handleScrapPriceChange = (value: string) => {
    const sanitizedValue = value.replace(",", ".");
     if (sanitizedValue !== '' && !/^[0-9]*\.?[0-9]*$/.test(sanitizedValue)) {
        return;
    }
    setScrapPrice(value);
  }

  const resetFields = (keepMaterial = true) => {
    const material = keepMaterial ? fields.material : "304";
    setFields({ width: "", length: "", thickness: "", weight: "", diameter: "", material, scrapLength: "" });
    setCalculatedWeight(null);
    if(prefilledItem) onClearPrefill();
  };

  const handleShapeChange = (value: Shape | "") => {
    if (value) {
      setShape(value);
      resetFields();
    }
  };
  
  React.useEffect(() => {
    if (prefilledItem && sellingPrice) {
        setScrapPrice(sellingPrice.toFixed(2).replace('.', ','));
    } else {
        setScrapPrice("23"); 
    }
  }, [prefilledItem, sellingPrice]);


  React.useEffect(() => {
    const getNum = (val: string) => parseFloat(val.replace(',', '.')) || 0;
    
    if (prefilledItem) {
        const scrapLength_m = getNum(fields.scrapLength) / 1000;
        if (scrapLength_m > 0 && prefilledItem.weight > 0) {
            const weight = scrapLength_m * prefilledItem.weight;
            setFields(prev => ({...prev, weight: Math.ceil(weight).toString()}));
            setCalculatedWeight(weight);
        } else {
             setFields(prev => ({...prev, weight: ''}));
            setCalculatedWeight(null);
        }
        return;
    }

    const w_mm = getNum(fields.width);
    const l_mm = getNum(fields.length);
    const t_mm = getNum(fields.thickness);
    const kg = getNum(fields.weight);
    const d_mm = getNum(fields.diameter);

    let weight: number | null = null;
    let newFields = { ...fields };
  
    if (shape === 'rectangle') {
      const inputs = [w_mm > 0, l_mm > 0, t_mm > 0, kg > 0];
      const filledCount = inputs.filter(Boolean).length;
  
      if (filledCount >= 3) {
          if (kg > 0 && t_mm > 0 && l_mm > 0 && w_mm === 0) {
            const width = (kg / ((l_mm / 1000) * (t_mm / 1000) * DENSITY)) * 1000;
            newFields.width = width.toFixed(2).replace('.', ',');
            weight = kg;
          } else if (kg > 0 && t_mm > 0 && w_mm > 0 && l_mm === 0) {
            const length = (kg / ((w_mm / 1000) * (t_mm / 1000) * DENSITY)) * 1000;
            newFields.length = length.toFixed(2).replace('.', ',');
            weight = kg;
          } else if (kg > 0 && w_mm > 0 && l_mm > 0 && t_mm === 0) {
            const thickness = (kg / ((w_mm / 1000) * (l_mm / 1000) * DENSITY)) * 1000;
            newFields.thickness = thickness.toFixed(2).replace('.', ',');
            weight = kg;
          } else if (w_mm > 0 && l_mm > 0 && t_mm > 0) {
            weight = (w_mm / 1000) * (l_mm / 1000) * (t_mm / 1000) * DENSITY;
            newFields.weight = Math.ceil(weight).toString().replace('.', ',');
          }
      }
    } else { // disc
      const inputs = [d_mm > 0, t_mm > 0, kg > 0];
      const filledCount = inputs.filter(Boolean).length;
  
      if (filledCount >= 2) {
          if (kg > 0 && t_mm > 0 && d_mm === 0) {
            const vol_m3 = kg / DENSITY;
            const area_m2 = vol_m3 / (t_mm / 1000);
            const r_m = Math.sqrt(area_m2 / Math.PI);
            const diameter = r_m * 2 * 1000;
            newFields.diameter = diameter.toFixed(2).replace('.', ',');
            weight = kg;
          } else if (kg > 0 && d_mm > 0 && t_mm === 0) {
            const r_m = d_mm / 2000;
            const area_m2 = Math.PI * r_m * r_m;
            const thickness = (kg / (area_m2 * DENSITY)) * 1000;
            newFields.thickness = thickness.toFixed(2).replace('.', ',');
            weight = kg;
          } else if (d_mm > 0 && t_mm > 0) {
            const r_m = d_mm / 2000;
            const vol_m3 = Math.PI * r_m * r_m * (t_mm / 1000);
            weight = vol_m3 * DENSITY;
            newFields.weight = Math.ceil(weight).toString().replace('.', ',');
          }
      }
    }
    
    setFields(newFields);
    setCalculatedWeight(weight);
  }, [fields.width, fields.length, fields.thickness, fields.weight, fields.diameter, shape, prefilledItem, fields.scrapLength]);

  const finalPrice = (parseFloat(fields.weight.replace(',', '.')) || 0) * (parseFloat(scrapPrice.replace(',', '.')) || 0);

  const formatNumber = (value: string | number, options?: Intl.NumberFormatOptions) => {
    const num = typeof value === 'string' ? parseFloat(value.replace(',', '.')) : value;
    if (isNaN(num)) return "";
    return new Intl.NumberFormat('pt-BR', options).format(num);
  }

  const addToList = () => {
    const getNum = (val: string) => parseFloat(val.replace(',', '.')) || 0;
    const weight = getNum(fields.weight);

    if (weight <= 0) {
        toast({ variant: "destructive", title: "Peso inválido", description: "O peso da peça deve ser maior que zero." });
        return;
    }

    let description = "";
    if (prefilledItem) {
        const scrapLength_mm = getNum(fields.scrapLength);
        if (scrapLength_mm <= 0) {
            toast({ variant: "destructive", title: "Comprimento inválido", description: "O comprimento do retalho deve ser maior que zero." });
            return;
        }
        description = `${prefilledItem.description} x ${formatNumber(scrapLength_mm, {minimumFractionDigits: 0})} mm`;
    } else if (shape === 'rectangle') {
        const t = getNum(fields.thickness);
        const w = getNum(fields.width);
        const l = getNum(fields.length);
        if (t <= 0 || w <= 0 || l <= 0) {
            toast({ variant: "destructive", title: "Dimensões inválidas", description: "Espessura, largura e comprimento devem ser preenchidos." });
            return;
        }
        const dims = [w, l].sort((a,b) => a-b);
        description = `Retalho Chapa ${fields.material} ${formatNumber(t, {minimumFractionDigits: 2})}x${formatNumber(dims[0], {minimumFractionDigits: 0})}x${formatNumber(dims[1], {minimumFractionDigits: 0})} mm`;
    } else { // disc
        const t = getNum(fields.thickness);
        const d = getNum(fields.diameter);
        if (t <= 0 || d <= 0) {
            toast({ variant: "destructive", title: "Dimensões inválidas", description: "Espessura e diâmetro devem ser preenchidos." });
            return;
        }
        description = `Retalho Disco ${fields.material} ${formatNumber(t, {minimumFractionDigits: 2})} Ø${formatNumber(d, {minimumFractionDigits: 0})} mm`;
    }

    const newPiece: ScrapPiece = {
        id: uuidv4(),
        description,
        weight: Math.ceil(weight),
        price: finalPrice,
    };

    const newList = [...scrapList, newPiece];
    setScrapList(newList);
    saveListToLocalStorage(newList);
    toast({ title: "Peça adicionada!", description: description });

    resetFields();
  }

  const removeFromList = (id: string) => {
    const newList = scrapList.filter(p => p.id !== id);
    setScrapList(newList);
    saveListToLocalStorage(newList);
    toast({ title: "Peça removida." });
  }

  const totalListWeight = scrapList.reduce((acc, item) => acc + item.weight, 0);
  const totalListPrice = scrapList.reduce((acc, item) => acc + item.price, 0);

  const handlePrint = () => {
    window.print();
  }

  const handleSave = () => {
    saveListToLocalStorage(scrapList);
    toast({ title: "Lista Salva!", description: "Sua lista de materiais foi salva com sucesso." });
  }

  return (
    <div className="space-y-6">
      <div id="scrap-calculator-form">
        {prefilledItem ? (
            <div className="mb-4 space-y-4 rounded-lg border border-primary/20 bg-primary/5 p-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-semibold text-primary">Calculando retalho de item selecionado:</h3>
                        <p className="text-sm text-muted-foreground">{prefilledItem.description}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0 -mr-2 -mt-2" onClick={resetFields}>
                        <X/>
                    </Button>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="scrapLength">Comprimento do Retalho (mm)</Label>
                    <Input id="scrapLength" type="text" inputMode="decimal" placeholder="Insira o comprimento" value={fields.scrapLength} onChange={(e) => handleInputChange('scrapLength', e.target.value)} />
                </div>
            </div>
        ) : (
            <>
                <div className="flex justify-center">
                    <ToggleGroup type="single" value={shape} onValueChange={handleShapeChange} className="w-full grid grid-cols-2">
                        <ToggleGroupItem value="rectangle" aria-label="Retangular" className="h-12 text-base">Retangular</ToggleGroupItem>
                        <ToggleGroupItem value="disc" aria-label="Disco" className="h-12 text-base">Disco</ToggleGroupItem>
                    </ToggleGroup>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {shape === "rectangle" ? (
                      <>
                        <div className="space-y-2"><Label htmlFor="width">Largura(mm)</Label><Input id="width" type="text" inputMode="decimal" placeholder="Insira a largura" value={fields.width} onChange={(e) => handleInputChange('width', e.target.value)} /></div>
                        <div className="space-y-2"><Label htmlFor="length">Compr.(mm)</Label><Input id="length" type="text" inputMode="decimal" placeholder="Insira o compr." value={fields.length} onChange={(e) => handleInputChange('length', e.target.value)} /></div>
                        <div className="grid grid-cols-3 gap-4 md:col-span-2">
                            <div className="space-y-2"><Label htmlFor="thickness">Espessura(mm)</Label><Input id="thickness" type="text" inputMode="decimal" placeholder="Insira a espessura" value={fields.thickness} onChange={(e) => handleInputChange('thickness', e.target.value)} /></div>
                            <div className="space-y-2"><Label htmlFor="material">Material</Label><Input id="material" placeholder="Ex: 304" value={fields.material} onChange={(e) => handleInputChange('material', e.target.value)} /></div>
                            <div className="space-y-2"><Label htmlFor="scrap-price">Preço (R$/kg)</Label><Input id="scrap-price" type="text" inputMode="decimal" value={scrapPrice} onChange={(e) => handleScrapPriceChange(e.target.value)} /></div>
                        </div>
                      </>
                  ) : (
                    <>
                        <div className="space-y-2"><Label htmlFor="diameter">Diâmetro(mm)</Label><Input id="diameter" type="text" inputMode="decimal" placeholder="Insira o diâmetro" value={fields.diameter} onChange={(e) => handleInputChange('diameter', e.target.value)} /></div>
                         <div className="space-y-2"><Label htmlFor="thickness">Espessura(mm)</Label><Input id="thickness" type="text" inputMode="decimal" placeholder="Insira a espessura" value={fields.thickness} onChange={(e) => handleInputChange('thickness', e.target.value)} /></div>
                        <div className="grid grid-cols-2 gap-4 md:col-span-2">
                            <div className="space-y-2"><Label htmlFor="material">Material</Label><Input id="material" placeholder="Ex: 304" value={fields.material} onChange={(e) => handleInputChange('material', e.target.value)} /></div>
                            <div className="space-y-2"><Label htmlFor="scrap-price">Preço (R$/kg)</Label><Input id="scrap-price" type="text" inputMode="decimal" value={scrapPrice} onChange={(e) => handleScrapPriceChange(e.target.value)} /></div>
                        </div>
                    </>
                  )}
                </div>
            </>
        )}
        
        <div className={cn("grid grid-cols-3 gap-4 pt-4 mt-4 border-t", prefilledItem && "pt-2 mt-2")}>
            <div className="space-y-2"><Label htmlFor="weight">Peso (kg)</Label><Input id="weight" type="text" inputMode="decimal" placeholder="Peso" value={fields.weight} onChange={(e) => handleInputChange('weight', e.target.value)} disabled={!!prefilledItem} /></div>
            <div className="space-y-2"><Label>P. Real (kg)</Label><div className="w-full rounded-md border border-input bg-muted/30 px-3 py-2 text-sm h-10 flex items-center text-muted-foreground">{calculatedWeight !== null ? formatNumber(calculatedWeight, {minimumFractionDigits: 2, maximumFractionDigits: 2}) : "..."}</div></div>
            <div className="space-y-2"><Label className="text-accent-price font-semibold">R$ Peça</Label><div className="w-full rounded-md border border-accent-price/50 bg-accent-price/10 px-3 py-2 text-base md:text-sm font-bold text-accent-price h-10 flex items-center">{formatNumber(finalPrice, {style: 'currency', currency: 'BRL'})}</div></div>
        </div>

        <div className="mt-4">
            <Button onClick={addToList} className="w-full gap-2">
                <PlusCircle/>
                Adicionar à Lista
            </Button>
        </div>
      </div>
      
      {scrapList.length > 0 && (
        <div id="scrap-list-section" className="space-y-4 pt-4 mt-6 border-t">
            <h2 className="text-lg font-semibold text-center">Lista de Materiais</h2>
            <Card>
                <CardContent className="p-0">
                    <div className="overflow-auto">
                        <table className="w-full text-sm">
                           <thead className="text-left">
                                <tr className="border-b">
                                    <th className="p-4 font-medium">Descrição</th>
                                    <th className="p-4 font-medium text-right">Peso (kg)</th>
                                    <th className="p-4 font-medium text-right text-primary">Preço (R$)</th>
                                    <th className="w-10 p-2 print:hidden"></th>
                                </tr>
                           </thead>
                           <tbody>
                               {scrapList.map(item => (
                                   <tr key={item.id} className="border-b last:border-0 even:bg-primary/5">
                                       <td className="p-4">{item.description}</td>
                                       <td className="p-4 text-right">{formatNumber(item.weight, {minimumFractionDigits: 0})}</td>
                                       <td className="p-4 text-right font-medium text-primary">{formatNumber(item.price, {style: 'currency', currency: 'BRL'})}</td>
                                       <td className="p-2 text-center print:hidden">
                                           <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeFromList(item.id)}>
                                               <Trash2 className="h-4 w-4 text-destructive"/>
                                           </Button>
                                       </td>
                                   </tr>
                               ))}
                           </tbody>
                           <tfoot className="font-semibold border-t">
                                <tr>
                                    <td className="p-4">TOTAL</td>
                                    <td className="p-4 text-right">{formatNumber(totalListWeight, {minimumFractionDigits: 0})}</td>
                                    <td className="p-4 text-right text-primary">{formatNumber(totalListPrice, {style: 'currency', currency: 'BRL'})}</td>
                                    <td className="print:hidden"></td>
                                </tr>
                           </tfoot>
                        </table>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end gap-2 print:hidden">
                <Button variant="outline" className="gap-2" onClick={handleSave}><Save/> Salvar</Button>
                <Button className="gap-2" onClick={handlePrint}><Printer/> Imprimir</Button>
            </div>
        </div>
      )}
    </div>
  );
}
