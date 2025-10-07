

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
import { SwipeToDelete } from "./ui/swipe-to-delete";
import { AnimatePresence, motion } from "framer-motion";

type Shape = "rectangle" | "disc";
type FieldName = "width" | "length" | "thickness" | "weight" | "diameter" | "material" | "scrapLength" | "quantity";

interface ScrapPiece {
    id: string;
    description: string;
    weight: number;
    price: number;
    pricePerKg?: number;
    length?: number;
    quantity?: number;
    unit?: 'm' | 'kg' | 'un';
}

interface ScrapCalculatorProps {
    prefilledItem: SteelItem | null;
    onClearPrefill: () => void;
    sellingPrice: number;
}

const DENSITY = STAINLESS_STEEL_DENSITY_KG_M3;
const LOCAL_STORAGE_KEY = "scrapCalculatorList";

const calculateDynamicPercentage = (lengthInMm: number, weightInKg: number): number => {
    if (lengthInMm >= 6000) {
      return 0;
    }
    if (lengthInMm > 3000) {
      return 5;
    }

    const minLength = 10;
    const maxLength = 3000;

    if (lengthInMm <= minLength) lengthInMm = minLength;
    if (lengthInMm > maxLength) lengthInMm = maxLength; 

    let highPercentage: number;
    let lowPercentage: number;

    if (weightInKg <= 0.5) {
      highPercentage = 100;
      lowPercentage = 10;
    } else if (weightInKg <= 2) {
      highPercentage = 50;
      lowPercentage = 10;
    } else {
      highPercentage = 30;
      lowPercentage = 10;
    }

    const percentage = highPercentage + (lengthInMm - minLength) * (lowPercentage - highPercentage) / (maxLength - minLength);

    return percentage;
  };


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
    quantity: "1",
  });

  const [scrapList, setScrapList] = React.useState<ScrapPiece[]>([]);
  const [calculatedWeight, setCalculatedWeight] = React.useState<number | null>(null);
  const [currentCutPercentage, setCurrentCutPercentage] = React.useState(0);
  const [isPrefilledItemUnit, setIsPrefilledItemUnit] = React.useState(false);
  const [finalPrice, setFinalPrice] = React.useState(0);
  const [isPrefilledItemSheet, setIsPrefilledItemSheet] = React.useState(false);


  React.useEffect(() => {
    if (prefilledItem) {
        setIsPrefilledItemSheet(prefilledItem.unit === 'un');
        if (prefilledItem.unit === 'un') {
            setFields(prev => ({
                ...prev,
                weight: prefilledItem.weight > 0 ? prefilledItem.weight.toFixed(3).replace('.', ',') : '',
                scrapLength: "",
                quantity: "1",
            }));
        } else {
           setFields(prev => ({...prev, weight: ''}));
        }
    } else {
        setIsPrefilledItemSheet(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefilledItem]);


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
        [fieldName]: fieldName === 'material' ? sanitizedValue : value.replace('.',',')
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
    setFields({ width: "", length: "", thickness: "", weight: "", diameter: "", material, scrapLength: "", quantity: "1" });
    setCalculatedWeight(null);
    setCurrentCutPercentage(0);
    setFinalPrice(0);
    if(prefilledItem) onClearPrefill();
  };

  const handleShapeChange = (value: Shape | "") => {
    if (value) {
      setShape(value);
      resetFields();
    }
  };
  
    React.useEffect(() => {
    if (prefilledItem && sellingPrice > 0) {
        setScrapPrice(sellingPrice.toFixed(2).replace('.', ','));
    } else if (!prefilledItem) {
        setScrapPrice("23"); 
    }
  }, [prefilledItem, sellingPrice]);


  React.useEffect(() => {
    const getNum = (val: string) => parseFloat(val.replace(',', '.')) || 0;
    
    let weight = 0;
    if (prefilledItem) {
        if (isPrefilledItemSheet) {
            weight = getNum(fields.weight);
        } else {
            const scrapLength_mm = getNum(fields.scrapLength);
            if (scrapLength_mm > 0 && prefilledItem.weight > 0) {
                const calculated = (scrapLength_mm / 1000) * prefilledItem.weight;
                weight = calculated;
                setCurrentCutPercentage(calculateDynamicPercentage(scrapLength_mm, calculated));
            } else {
                setCurrentCutPercentage(0);
            }
        }
    } else { // Manual calculation
      const w_mm = getNum(fields.width);
      const l_mm = getNum(fields.length);
      const t_mm = getNum(fields.thickness);
      const d_mm = getNum(fields.diameter);
      
      let calculatedWeightValue = null;
      if (shape === 'rectangle') {
        if (w_mm > 0 && l_mm > 0 && t_mm > 0) {
            calculatedWeightValue = (w_mm / 1000) * (l_mm / 1000) * (t_mm / 1000) * DENSITY;
        }
      } else { // disc
        if (d_mm > 0 && t_mm > 0) {
            const r_m = d_mm / 2000;
            const vol_m3 = Math.PI * r_m * r_m * (t_mm / 1000);
            calculatedWeightValue = vol_m3 * DENSITY;
        }
      }
      
      if (calculatedWeightValue) {
          const roundedUpWeight = Math.ceil(calculatedWeightValue);
          setCalculatedWeight(calculatedWeightValue);
          // Auto-fill the editable weight field with the rounded up value
          setFields(prev => ({...prev, weight: roundedUpWeight.toFixed(3).replace('.',',')}));
      } else {
          setCalculatedWeight(null);
      }
      weight = calculatedWeightValue || 0;
    }
    
    const activeElement = document.activeElement;
    if (activeElement?.id !== 'weight' && !isPrefilledItemSheet && !prefilledItem) {
      // Don't auto-set weight for prefilled sheets or when manually calculating, as it's rounded up
    } else if (activeElement?.id !== 'weight' && !isPrefilledItemSheet) {
        setFields(prev => ({...prev, weight: weight ? weight.toFixed(3).replace('.', ',') : ''}));
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields.width, fields.length, fields.thickness, fields.diameter, shape, prefilledItem, fields.scrapLength, isPrefilledItemSheet]);
  
  React.useEffect(() => {
      const getNum = (val: string) => parseFloat(val.replace(',', '.')) || 0;
      
      const weightForPrice = getNum(fields.weight);
      const quantity = getNum(fields.quantity) || 1;
      let totalFinalPrice = 0;

      if (weightForPrice > 0) {
          if (prefilledItem) {
               if (isPrefilledItemSheet) {
                  totalFinalPrice = prefilledItem.weight * sellingPrice;
              } else {
                  const pricePerMeter = Math.ceil(sellingPrice * prefilledItem.weight);
                  const scrapLength_mm = getNum(fields.scrapLength);
                  const singlePiecePrice = pricePerMeter * (scrapLength_mm / 1000);
                  totalFinalPrice = singlePiecePrice * (1 + currentCutPercentage / 100);
              }
          } else {
              const pricePerKg = getNum(scrapPrice);
              totalFinalPrice = weightForPrice * pricePerKg;
          }
      }
      
      setFinalPrice(Math.ceil(totalFinalPrice) * quantity);

  }, [fields.weight, scrapPrice, sellingPrice, prefilledItem, fields.scrapLength, currentCutPercentage, isPrefilledItemSheet, fields.quantity]);


  const addToList = () => {
    let description = "";
    const getNumPrice = (val: string) => parseFloat(val.replace(',', '.')) || 0;
    
    const weight = getNumPrice(fields.weight);
    const quantity = getNumPrice(fields.quantity) || 1;

     if (weight <= 0) {
        toast({ variant: "destructive", title: "Peso inválido", description: "O peso da peça deve ser maior que zero." });
        return;
    }


    if (prefilledItem) {
        let newPiece: ScrapPiece;
        if (isPrefilledItemSheet) {
            description = `${prefilledItem.description} ${quantity}pç`;
            newPiece = {
                id: uuidv4(),
                description,
                weight: weight * quantity,
                price: finalPrice,
                pricePerKg: prefilledItem.weight * sellingPrice,
                unit: 'un',
                quantity: quantity
            };
        } else {
            const scrapLength_mm = getNumPrice(fields.scrapLength);
            if (scrapLength_mm <= 0) {
                toast({ variant: "destructive", title: "Comprimento inválido", description: "O comprimento do retalho deve ser maior que zero." });
                return;
            }
            const quantityText = quantity > 1 ? `(${quantity}x) ` : '';
            description = `${quantityText}${prefilledItem.description} x ${formatNumber(scrapLength_mm, {minimumFractionDigits: 0})} mm`;
            const pricePerMeter = Math.ceil(sellingPrice * prefilledItem.weight);
            newPiece = {
                id: uuidv4(),
                description,
                weight: weight * quantity,
                price: finalPrice,
                pricePerKg: pricePerMeter, // This is price per meter here
                length: scrapLength_mm,
                unit: 'm',
                quantity: quantity
            };
        }
        
        const newList = [...scrapList, newPiece];
        setScrapList(newList);
        saveListToLocalStorage(newList);
        toast({ title: "Peça adicionada!", description: newPiece.description });


    } else { // Manual scrap
        let newPiece: ScrapPiece;
        const pricePerUnit = getNumPrice(scrapPrice);
        const quantityText = quantity > 1 ? `(${quantity}x) ` : '';
        if (shape === 'rectangle') {
            const t = getNumPrice(fields.thickness);
            const w = getNumPrice(fields.width);
            const l = getNumPrice(fields.length);
            if (t <= 0 || w <= 0 || l <= 0) {
                toast({ variant: "destructive", title: "Dimensões inválidas", description: "Espessura, largura e comprimento devem ser preenchidos." });
                return;
            }
            const dims = [w, l].sort((a,b) => a-b);
            description = `${quantityText}Ret. Chapa ${fields.material} ${formatNumber(t, {minimumFractionDigits: 2})}x${formatNumber(dims[0], {minimumFractionDigits: 0})}x${formatNumber(dims[1], {minimumFractionDigits: 0})} mm`;
        } else { // disc
            const t = getNumPrice(fields.thickness);
            const d = getNumPrice(fields.diameter);
            if (t <= 0 || d <= 0) {
                toast({ variant: "destructive", title: "Dimensões inválidas", description: "Espessura e diâmetro devem ser preenchidos." });
                return;
            }
            description = `${quantityText}Ret. Disco ${fields.material} ${formatNumber(t, {minimumFractionDigits: 2})} Ø${formatNumber(d, {minimumFractionDigits: 0})} mm`;
        }
        
        newPiece = {
            id: uuidv4(),
            description,
            weight: weight * quantity,
            price: finalPrice,
            pricePerKg: pricePerUnit,
            unit: 'kg',
            quantity: quantity,
        };

        const newList = [...scrapList, newPiece];
        setScrapList(newList);
        saveListToLocalStorage(newList);
        toast({ title: "Peça adicionada!", description: newPiece.description });
    }
    
    resetFields();
  }

  const removeFromList = (id: string) => {
    const newList = scrapList.filter(p => p.id !== id);
    setScrapList(newList);
    saveListToLocalStorage(newList);
    toast({ title: "Peça removida." });
  }

  const formatNumber = (value: string | number, options?: Intl.NumberFormatOptions) => {
    const num = typeof value === 'string' ? parseFloat(value.replace(',', '.')) : value;
    if (isNaN(num)) return "";
    return new Intl.NumberFormat('pt-BR', options).format(num);
  }

  const totalListPrice = scrapList.reduce((acc, item) => acc + item.price, 0);

  const handlePrint = () => {
    window.print();
  }

  const handleSave = () => {
    saveListToLocalStorage(scrapList);
    toast({ title: "Lista Salva!", description: "Sua lista de materiais foi salva com sucesso." });
  }

  const totalListWeight = scrapList.reduce((acc, item) => acc + item.weight, 0);

  return (
    <div className="flex flex-col h-full p-1">
      <div id="scrap-calculator-form">
        {prefilledItem ? (
            <div className="mb-1 space-y-1 rounded-lg border border-primary/20 bg-primary/5 p-1">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-semibold text-primary">Calculando retalho de item selecionado:</h3>
                        <p className="text-sm text-muted-foreground">{prefilledItem.description}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0 -mr-2 -mt-2" onClick={() => resetFields()}>
                        <X/>
                    </Button>
                </div>
                {isPrefilledItemSheet ? (
                    <div className="space-y-1">
                        <Label htmlFor="quantity">Quantidade de Peças</Label>
                        <Input id="quantity" type="text" inputMode="decimal" placeholder="Insira a quantidade" value={fields.quantity} onChange={(e) => handleInputChange('quantity', e.target.value)} />
                    </div>
                ) : (
                    <div className="flex gap-1">
                        <div className="space-y-1 flex-1">
                            <Label htmlFor="scrapLength">Comprimento do Retalho (mm)</Label>
                            <Input id="scrapLength" type="text" inputMode="decimal" placeholder="Insira o comprimento" value={fields.scrapLength} onChange={(e) => handleInputChange('scrapLength', e.target.value)} />
                        </div>
                        <div className="space-y-1 w-1/3">
                            <Label htmlFor="quantity">Quantidade</Label>
                            <Input id="quantity" type="text" inputMode="decimal" placeholder="Qtd." value={fields.quantity} onChange={(e) => handleInputChange('quantity', e.target.value)} />
                        </div>
                   </div>
                )}
            </div>
        ) : (
            <>
                <div className="flex justify-center">
                    <ToggleGroup type="single" value={shape} onValueChange={handleShapeChange} className="w-full grid grid-cols-2">
                        <ToggleGroupItem value="rectangle" aria-label="Retangular" className="h-12 text-base">Retangular</ToggleGroupItem>
                        <ToggleGroupItem value="disc" aria-label="Disco" className="h-12 text-base">Disco</ToggleGroupItem>
                    </ToggleGroup>
                </div>

                <div className="space-y-1 mt-1">
                  {shape === "rectangle" ? (
                    <div className="space-y-1">
                        <div className="flex gap-1">
                            <div className="space-y-1 flex-1 min-w-0"><Label htmlFor="width">Larg.(mm)</Label><Input id="width" type="text" inputMode="decimal" placeholder="Largura" value={fields.width} onChange={(e) => handleInputChange('width', e.target.value)} /></div>
                            <div className="space-y-1 flex-1 min-w-0"><Label htmlFor="length">Compr.(mm)</Label><Input id="length" type="text" inputMode="decimal" placeholder="Compr." value={fields.length} onChange={(e) => handleInputChange('length', e.target.value)} /></div>
                            <div className="space-y-1 flex-1 min-w-0"><Label htmlFor="quantity">Qtde</Label><Input id="quantity" type="text" inputMode="decimal" placeholder="Qtd." value={fields.quantity} onChange={(e) => handleInputChange('quantity', e.target.value)} /></div>
                        </div>
                        <div className="flex gap-1">
                            <div className="space-y-1 flex-1 min-w-0"><Label htmlFor="thickness">Esp.(mm)</Label><Input id="thickness" type="text" inputMode="decimal" placeholder="Espessura" value={fields.thickness} onChange={(e) => handleInputChange('thickness', e.target.value)} /></div>
                             <div className="space-y-1 flex-1 min-w-0"><Label htmlFor="material">Material</Label><Input id="material" placeholder="Ex: 304" value={fields.material} onChange={(e) => handleInputChange('material', e.target.value)} /></div>
                             <div className="space-y-1 flex-1 min-w-0">
                                <Label htmlFor="scrap-price">Preço (R$/kg)</Label>
                                <Input id="scrap-price" type="text" inputMode="decimal" value={scrapPrice} onChange={(e) => handleScrapPriceChange(e.target.value)} disabled={!!prefilledItem}/>
                            </div>
                        </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                        <div className="flex gap-1">
                            <div className="space-y-1 flex-1 min-w-0"><Label htmlFor="diameter">Diâmetro(mm)</Label><Input id="diameter" type="text" inputMode="decimal" placeholder="Diâmetro" value={fields.diameter} onChange={(e) => handleInputChange('diameter', e.target.value)} /></div>
                             <div className="space-y-1 flex-1 min-w-0"><Label htmlFor="quantity">Quantidade</Label><Input id="quantity" type="text" inputMode="decimal" placeholder="Qtd." value={fields.quantity} onChange={(e) => handleInputChange('quantity', e.target.value)} /></div>
                        </div>
                        <div className="flex gap-1">
                           <div className="space-y-1 flex-1 min-w-0"><Label htmlFor="thickness">Espessura(mm)</Label><Input id="thickness" type="text" inputMode="decimal" placeholder="Espessura" value={fields.thickness} onChange={(e) => handleInputChange('thickness', e.target.value)} /></div>
                            <div className="space-y-1 flex-1 min-w-0"><Label htmlFor="material">Material</Label><Input id="material" placeholder="Ex: 304" value={fields.material} onChange={(e) => handleInputChange('material', e.target.value)} /></div>
                            <div className="space-y-1 flex-1 min-w-0">
                                <Label htmlFor="scrap-price">Preço (R$/kg)</Label>
                                <Input id="scrap-price" type="text" inputMode="decimal" value={scrapPrice} onChange={(e) => handleScrapPriceChange(e.target.value)} disabled={!!prefilledItem}/>
                            </div>
                        </div>
                    </div>
                  )}
                </div>
            </>
        )}
        
        <div className="pt-1 mt-1 border-t space-y-1">
             {prefilledItem && !isPrefilledItemSheet && (
                <div className="space-y-1 flex-1 min-w-0">
                    <Label htmlFor="cut-percentage">Acréscimo de Corte (%)</Label>
                    <Input
                        id="cut-percentage"
                        type="text"
                        inputMode="decimal"
                        value={currentCutPercentage > 0 ? formatNumber(currentCutPercentage, {minimumFractionDigits: 2}) : ""}
                        onChange={(e) => setCurrentCutPercentage(parseFloat(e.target.value.replace(',', '.')) || 0)}
                        placeholder="Ex: 20"
                    />
                </div>
             )}
            <div className="flex gap-1 items-end">
                <div className="space-y-1 flex-1 min-w-0">
                    <Label htmlFor="weight">Peso (kg)</Label>
                    <Input id="weight" type="text" inputMode="decimal" placeholder="Peso Final" value={fields.weight} onChange={(e) => handleInputChange('weight', e.target.value)} />
                </div>
                <div className="space-y-1 flex-1 min-w-0">
                    <Label>Peso Total (kg)</Label>
                    <div className="w-full rounded-md border border-input bg-muted/30 px-3 py-2 text-base md:text-sm h-10 flex items-center text-muted-foreground">
                        {calculatedWeight ? formatNumber(calculatedWeight, {minimumFractionDigits:3}) : '...'}
                    </div>
                </div>
                <div className="space-y-1 flex-1 min-w-0">
                    <Label className="text-accent-price font-semibold">R$ Total</Label>
                    <div className="w-full rounded-md border border-accent-price/50 bg-accent-price/10 px-3 py-2 text-base md:text-sm font-bold text-accent-price h-10 flex items-center">{formatNumber(finalPrice, {style: 'currency', currency: 'BRL'})}</div>
                </div>
            </div>
        </div>

        <div className="mt-1">
            <Button onClick={addToList} className="w-full gap-1">
                <PlusCircle/>
                Adicione à Lista
            </Button>
        </div>
      </div>
      
      {scrapList.length > 0 && (
        <div id="scrap-list-section" className="border-t flex-1 flex flex-col min-h-0 pt-1 mt-1">
            <h2 className="text-lg font-semibold text-center mb-1">Lista de Materiais</h2>
            <Card className="flex-1 overflow-hidden flex flex-col">
                <CardContent className="p-0 flex-1 overflow-y-auto">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm table-fixed">
                           <thead className="text-left sticky top-0 bg-background z-10">
                                <tr className="border-b">
                                    <th className="p-1 font-medium w-auto break-words">Descrição</th>
                                    <th className="p-1 font-medium text-right w-24">Peso/Detalhe</th>
                                    <th className="p-1 font-medium text-right text-primary w-28">Preço (R$)</th>
                                </tr>
                           </thead>
                           <tbody>
                               <AnimatePresence>
                               {scrapList.map(item => (
                                   <motion.tr
                                     key={item.id}
                                     layout
                                     initial={{ opacity: 0, height: 0 }}
                                     animate={{ opacity: 1, height: 'auto' }}
                                     exit={{ opacity: 0, x: -200, transition: { duration: 0.2 } }}
                                     className="border-b last:border-0 even:bg-primary/5"
                                   >
                                     <td colSpan={3} className="p-0">
                                       <SwipeToDelete onDelete={() => removeFromList(item.id)}>
                                         <div className="flex items-center">
                                           <div className="p-1 flex-1 w-full break-words">{item.description}</div>
                                           <div className="p-1 text-right w-24">
                                             {item.unit === 'm' && item.length ? (
                                               <>
                                                 <div>{formatNumber(item.weight, { minimumFractionDigits: 3, maximumFractionDigits: 3 })} kg</div>
                                                 <div className="text-xs text-muted-foreground font-normal">
                                                     {`${formatNumber(item.length / 1000, { minimumFractionDigits: 3, maximumFractionDigits: 3 })} m`}
                                                 </div>
                                               </>
                                             ) : item.unit === 'un' && item.quantity ? (
                                                <>
                                                  <div>{formatNumber(item.weight, { minimumFractionDigits: 3, maximumFractionDigits: 3 })} kg</div>
                                                  <div className="text-xs text-muted-foreground font-normal">
                                                     {`(${item.quantity} pç)`}
                                                   </div>
                                                </>
                                             ) : (
                                               <>
                                                 <div>{formatNumber(item.weight, { minimumFractionDigits: 3, maximumFractionDigits: 3 })} kg</div>
                                                 {item.pricePerKg && (
                                                   <div className="text-xs text-muted-foreground font-normal">
                                                     {`${formatNumber(item.pricePerKg, { style: 'currency', currency: 'BRL' })}/kg`}
                                                   </div>
                                                 )}
                                               </>
                                             )}
                                           </div>
                                           <div className="p-1 text-right font-medium text-primary w-28">{formatNumber(item.price, { style: 'currency', currency: 'BRL' })}</div>
                                         </div>
                                       </SwipeToDelete>
                                     </td>
                                   </motion.tr>
                               ))}
                               </AnimatePresence>
                           </tbody>
                           <tfoot className="font-semibold border-t sticky bottom-0 bg-background/95">
                                <tr>
                                    <td className="p-1 pt-10">TOTAL</td>
                                    <td className="p-1 pt-10 text-right">{formatNumber(totalListWeight, {minimumFractionDigits: 3, maximumFractionDigits: 3})} kg</td>
                                    <td className="p-1 pt-10 text-right text-primary">{formatNumber(totalListPrice, {style: 'currency', currency: 'BRL'})}</td>
                                </tr>
                           </tfoot>
                        </table>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end gap-1 print:hidden pt-1">
                <Button variant="outline" className="gap-1" onClick={handleSave}><Save/> Salvar</Button>
                <Button className="gap-1" onClick={handlePrint}><Printer/> Imprimir</Button>
            </div>
        </div>
      )}
    </div>
  );
}
