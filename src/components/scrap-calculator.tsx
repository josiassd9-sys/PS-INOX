

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
  
  const [dimensions, setDimensions] = React.useState({
    width: "",
    length: "",
    thickness: "",
    diameter: "",
    material: "304",
    scrapLength: "",
    quantity: "1",
  });
  
  const [manualWeight, setManualWeight] = React.useState<string>("");
  const [isWeightModified, setIsWeightModified] = React.useState(false);


  const [scrapList, setScrapList] = React.useState<ScrapPiece[]>([]);

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
  
  const getNum = (val: string | number | undefined): number => {
    if (typeof val === 'number') return val;
    if (typeof val === 'string' && val.trim() !== '') {
        const num = parseFloat(val.replace(',', '.'));
        return isNaN(num) ? 0 : num;
    }
    return 0;
  };
  
  const handleDimChange = (field: keyof typeof dimensions, value: string) => {
    const sanitizedValue = field === 'material' ? value : value.replace(/[^0-9,.]/g, '');
    if (field !== 'material' && !/^\d*[,.]?\d*$/.test(sanitizedValue)) {
        return;
    }
    setDimensions(prev => ({...prev, [field]: sanitizedValue}));
    setIsWeightModified(false);
  };
  
  const handleWeightChange = (value: string) => {
    const sanitizedValue = value.replace(/[^0-9,.]/g, '');
     if (!/^\d*[,.]?\d*$/.test(sanitizedValue)) {
        return;
    }
    setManualWeight(sanitizedValue);
    setIsWeightModified(true);
  }


  const handleScrapPriceChange = (value: string) => {
    const sanitizedValue = value.replace(/[^0-9,.]/g, '');
     if (!/^\d*[,.]?\d*$/.test(sanitizedValue)) {
        return;
    }
    setScrapPrice(sanitizedValue);
  }

  const resetFields = (keepMaterial = true) => {
    const material = keepMaterial ? dimensions.material : "304";
    setDimensions({ width: "", length: "", thickness: "", diameter: "", material, scrapLength: "", quantity: "1" });
    setManualWeight("");
    setIsWeightModified(false);
    if(prefilledItem) onClearPrefill();
  };

  const handleShapeChange = (value: Shape | "") => {
    if (value) {
      setShape(value);
      resetFields();
    }
  };
  
  const isPrefilledItemSheet = prefilledItem?.unit === 'un';

  React.useEffect(() => {
    if (prefilledItem) {
        if (sellingPrice > 0) {
            setScrapPrice(sellingPrice.toFixed(2).replace('.', ','));
        }
        if (isPrefilledItemSheet) {
          setDimensions(prev => ({ ...prev, scrapLength: "", quantity: "1" }));
          setManualWeight(prefilledItem.weight > 0 ? prefilledItem.weight.toFixed(3).replace('.', ',') : '');
          setIsWeightModified(true);
        }
    } else {
        setScrapPrice("23"); 
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefilledItem, sellingPrice, isPrefilledItemSheet]);


  // DERIVED VALUES - The core of the calculation logic
  const { calculatedWeight, currentCutPercentage, finalPrice, weightForDisplay } = React.useMemo(() => {
    let realWeight: number | null = null;
    let cutPercentage = 0;

    // --- 1. Calculate Real Weight ---
    if (prefilledItem && !isPrefilledItemSheet) {
        const scrapLength_mm = getNum(dimensions.scrapLength);
        if (scrapLength_mm > 0 && prefilledItem.weight > 0) {
          realWeight = (scrapLength_mm / 1000) * prefilledItem.weight;
          cutPercentage = calculateDynamicPercentage(scrapLength_mm, realWeight);
        }
    } else if (!prefilledItem) { // Manual calculation
      const w_mm = getNum(dimensions.width);
      const l_mm = getNum(dimensions.length);
      const t_mm = getNum(dimensions.thickness);
      const d_mm = getNum(dimensions.diameter);
      
      if (shape === 'rectangle' && w_mm > 0 && l_mm > 0 && t_mm > 0) {
        realWeight = (w_mm / 1000) * (l_mm / 1000) * (t_mm / 1000) * DENSITY;
      } else if (shape === 'disc' && d_mm > 0 && t_mm > 0) {
        const r_m = d_mm / 2000;
        const vol_m3 = Math.PI * r_m * r_m * (t_mm / 1000);
        realWeight = vol_m3 * DENSITY;
      }
    }
    
    // --- 2. Determine Weight for Price Calculation ---
    let weightForPriceCalc: number;
    let finalWeightForDisplay: string;

    if(isWeightModified) {
        weightForPriceCalc = getNum(manualWeight);
        finalWeightForDisplay = manualWeight;
    } else if (realWeight !== null && realWeight > 0) {
        weightForPriceCalc = Math.ceil(realWeight);
        finalWeightForDisplay = weightForPriceCalc.toString().replace('.', ',');
    } else {
        weightForPriceCalc = 0;
        finalWeightForDisplay = '';
    }
    
    // --- 3. Calculate Final Price ---
    const quantity = getNum(dimensions.quantity) || 1;
    let totalFinalPrice = 0;

    if (weightForPriceCalc > 0) {
      if (prefilledItem) {
        if (isPrefilledItemSheet) {
          const basePrice = getNum(manualWeight) * sellingPrice;
          totalFinalPrice = basePrice;
        } else {
          const pricePerMeter = Math.ceil(sellingPrice * prefilledItem.weight);
          const scrapLength_mm = getNum(dimensions.scrapLength);
          const singlePiecePrice = pricePerMeter * (scrapLength_mm / 1000);
          totalFinalPrice = singlePiecePrice * (1 + cutPercentage / 100);
        }
      } else {
        const pricePerKg = getNum(scrapPrice);
        totalFinalPrice = weightForPriceCalc * pricePerKg;
      }
    }
    
    const finalPrice = Math.ceil(totalFinalPrice) * quantity;

    return { calculatedWeight: realWeight, currentCutPercentage: cutPercentage, finalPrice, weightForDisplay: finalWeightForDisplay };

  }, [dimensions, shape, prefilledItem, scrapPrice, sellingPrice, isPrefilledItemSheet, manualWeight, isWeightModified]);


  const addToList = () => {
    let description = "";
    
    const weightValue = getNum(isWeightModified ? manualWeight : weightForDisplay);
    const quantity = getNum(dimensions.quantity) || 1;

     if (weightValue <= 0) {
        toast({ variant: "destructive", title: "Peso inválido", description: "O peso da peça deve ser maior que zero." });
        return;
    }

    if (prefilledItem) {
        let newPiece: ScrapPiece;
        if (isPrefilledItemSheet) {
            description = `${prefilledItem.description} ${quantity > 1 ? `${quantity}pç` : ''}`.trim();
            newPiece = {
                id: uuidv4(),
                description,
                weight: weightValue * quantity,
                price: finalPrice,
                pricePerKg: sellingPrice,
                unit: 'un',
                quantity: quantity
            };
        } else {
            const scrapLength_mm = getNum(dimensions.scrapLength);
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
                weight: (calculatedWeight || 0) * quantity,
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
        const pricePerUnit = getNum(scrapPrice);
        const quantityText = quantity > 1 ? `(${quantity}x) ` : '';
        if (shape === 'rectangle') {
            const t = getNum(dimensions.thickness);
            const w = getNum(dimensions.width);
            const l = getNum(dimensions.length);
            if (t <= 0 || w <= 0 || l <= 0) {
                toast({ variant: "destructive", title: "Dimensões inválidas", description: "Espessura, largura e comprimento devem ser preenchidos." });
                return;
            }
            const dims = [w, l].sort((a,b) => a-b);
            description = `${quantityText}Ret. Chapa ${dimensions.material} ${formatNumber(t, {minimumFractionDigits: 2})}x${formatNumber(dims[0], {minimumFractionDigits: 0})}x${formatNumber(dims[1], {minimumFractionDigits: 0})} mm`;
        } else { // disc
            const t = getNum(dimensions.thickness);
            const d = getNum(dimensions.diameter);
            if (t <= 0 || d <= 0) {
                toast({ variant: "destructive", title: "Dimensões inválidas", description: "Espessura e diâmetro devem ser preenchidos." });
                return;
            }
            description = `${quantityText}Ret. Disco ${dimensions.material} ${formatNumber(t, {minimumFractionDigits: 2})} Ø${formatNumber(d, {minimumFractionDigits: 0})} mm`;
        }
        
        newPiece = {
            id: uuidv4(),
            description,
            weight: weightValue * quantity,
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
                        <Input id="quantity" type="text" inputMode="decimal" placeholder="Insira a quantidade" value={dimensions.quantity} onChange={(e) => handleDimChange('quantity', e.target.value)} />
                    </div>
                ) : (
                    <div className="flex gap-1">
                        <div className="space-y-1 flex-1">
                            <Label htmlFor="scrapLength">Comprimento do Retalho (mm)</Label>
                            <Input id="scrapLength" type="text" inputMode="decimal" placeholder="Insira o comprimento" value={dimensions.scrapLength} onChange={(e) => handleDimChange('scrapLength', e.target.value)} />
                        </div>
                        <div className="space-y-1 w-1/3">
                            <Label htmlFor="quantity">Quantidade</Label>
                            <Input id="quantity" type="text" inputMode="decimal" placeholder="Qtd." value={dimensions.quantity} onChange={(e) => handleDimChange('quantity', e.target.value)} />
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
                            <div className="space-y-1 flex-1 min-w-0"><Label htmlFor="width">Larg.(mm)</Label><Input id="width" type="text" inputMode="decimal" placeholder="Largura" value={dimensions.width} onChange={(e) => handleDimChange('width', e.target.value)} /></div>
                            <div className="space-y-1 flex-1 min-w-0"><Label htmlFor="length">Compr.(mm)</Label><Input id="length" type="text" inputMode="decimal" placeholder="Compr." value={dimensions.length} onChange={(e) => handleDimChange('length', e.target.value)} /></div>
                            <div className="space-y-1 flex-1 min-w-0"><Label htmlFor="thickness">Esp.(mm)</Label><Input id="thickness" type="text" inputMode="decimal" placeholder="Espessura" value={dimensions.thickness} onChange={(e) => handleDimChange('thickness', e.target.value)} /></div>
                        </div>
                        <div className="flex gap-1">
                             <div className="space-y-1 flex-1 min-w-0"><Label htmlFor="material">Material</Label><Input id="material" placeholder="Ex: 304" value={dimensions.material} onChange={(e) => handleDimChange('material', e.target.value)} /></div>
                             <div className="space-y-1 flex-1 min-w-0">
                                <Label htmlFor="scrap-price">Preço (R$/kg)</Label>
                                <Input id="scrap-price" type="text" inputMode="decimal" value={scrapPrice} onChange={(e) => handleScrapPriceChange(e.target.value)} disabled={!!prefilledItem}/>
                            </div>
                             <div className="space-y-1 flex-1 min-w-0"><Label htmlFor="quantity">Qtde</Label><Input id="quantity" type="text" inputMode="decimal" placeholder="Qtd." value={dimensions.quantity} onChange={(e) => handleDimChange('quantity', e.target.value)} /></div>
                        </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                        <div className="flex gap-1">
                            <div className="space-y-1 flex-1 min-w-0"><Label htmlFor="diameter">Diâmetro(mm)</Label><Input id="diameter" type="text" inputMode="decimal" placeholder="Diâmetro" value={dimensions.diameter} onChange={(e) => handleDimChange('diameter', e.target.value)} /></div>
                            <div className="space-y-1 flex-1 min-w-0"><Label htmlFor="thickness">Espessura(mm)</Label><Input id="thickness" type="text" inputMode="decimal" placeholder="Espessura" value={dimensions.thickness} onChange={(e) => handleDimChange('thickness', e.target.value)} /></div>
                        </div>
                        <div className="flex gap-1">
                           <div className="space-y-1 flex-1 min-w-0"><Label htmlFor="material">Material</Label><Input id="material" placeholder="Ex: 304" value={dimensions.material} onChange={(e) => handleDimChange('material', e.target.value)} /></div>
                            <div className="space-y-1 flex-1 min-w-0">
                                <Label htmlFor="scrap-price">Preço (R$/kg)</Label>
                                <Input id="scrap-price" type="text" inputMode="decimal" value={scrapPrice} onChange={(e) => handleScrapPriceChange(e.target.value)} disabled={!!prefilledItem}/>
                            </div>
                             <div className="space-y-1 flex-1 min-w-0"><Label htmlFor="quantity">Quantidade</Label><Input id="quantity" type="text" inputMode="decimal" placeholder="Qtd." value={dimensions.quantity} onChange={(e) => handleDimChange('quantity', e.target.value)} /></div>
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
                        readOnly
                        placeholder="0,00"
                        className="bg-muted/30"
                    />
                </div>
             )}
            <div className="flex gap-1 items-end">
                <div className="space-y-1 flex-1 min-w-0">
                    <Label htmlFor="weight">Peso (kg)</Label>
                    <Input id="weight" type="text" inputMode="decimal" placeholder="Peso Final" value={weightForDisplay} onChange={(e) => handleWeightChange(e.target.value)} />
                </div>
                <div className="space-y-1 flex-1 min-w-0">
                    <Label>P. Real (kg)</Label>
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

    