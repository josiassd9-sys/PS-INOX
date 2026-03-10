
"use client";

import React, { useState, useEffect, useCallback, useImperativeHandle, forwardRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHeader, TableRow, TableHead } from "./ui/table";
import { PlusCircle, Tractor, ArrowDownToLine, ArrowUpFromLine, Trash2, Save, Printer } from "lucide-react";
import { scrapItems } from "@/lib/data/sucata";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "./ui/command";
import { ScrollArea } from "./ui/scroll-area";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "./ui/tooltip";
import { cn } from "@/lib/utils";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

type WeighingItem = {
  id: string;
  material: string;
  bruto: string;
  tara: string;
  descontos: string;
  liquido: number;
};

type WeighingSet = {
  id: string;
  name: string;
  items: WeighingItem[];
  descontoCacamba: string;
};

type OperationType = 'loading' | 'unloading';

const initialWeighingSet: WeighingSet = { id: uuidv4(), name: "CAÇAMBA 1", items: [], descontoCacamba: "" };

const ScaleCalculatorComponent = forwardRef((props, ref) => {
  const [headerData, setHeaderData] = useState({
    client: "",
    plate: "",
    driver: "",
    initialWeight: "",
  });
  const [weighingSets, setWeighingSets] = useState<WeighingSet[]>([initialWeighingSet]);
  const [activeSetId, setActiveSetId] = useState<string>(initialWeighingSet.id);
  const { toast } = useToast();
  const [operationType, setOperationType] = useState<OperationType>('loading');

  const handleHeaderChange = (field: keyof typeof headerData, value: string) => {
    if (field === 'initialWeight') {
        const sanitizedValue = value.replace(/\D/g, '');
        setHeaderData(prev => ({ ...prev, [field]: sanitizedValue }));
    } else if (field === 'plate') {
        let formattedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 7);
        setHeaderData(prev => ({ ...prev, [field]: formattedValue }));
    } else {
        setHeaderData(prev => ({ ...prev, [field]: value.toUpperCase() }));
    }
  };

  const handleInputChange = (setId: string, itemId: string, field: keyof Omit<WeighingItem, 'id' | 'material' | 'liquido'>, value: string) => {
    const sanitizedValue = value.replace(/\D/g, '');
    setWeighingSets(prevSets =>
      prevSets.map(set => {
        if (set.id === setId) {
          const newItems = set.items.map(item => {
            if (item.id === itemId) {
              const updatedItem = { ...item, [field]: sanitizedValue };
              const bruto = parseFloat(updatedItem.bruto) || 0;
              const tara = parseFloat(updatedItem.tara) || 0;
              const descontos = parseFloat(updatedItem.descontos) || 0;
              updatedItem.liquido = bruto - tara - descontos;
              return updatedItem;
            }
            return item;
          });
          return { ...set, items: newItems };
        }
        return set;
      })
    );
  };

  const handleMaterialChange = (setId: string, itemId: string, newMaterial: string) => {
    setWeighingSets(prevSets =>
      prevSets.map(set => {
        if (set.id === setId) {
          const newItems = set.items.map(item =>
            item.id === itemId ? { ...item, material: newMaterial.toUpperCase() } : item
          );
          return { ...set, items: newItems };
        }
        return set;
      })
    );
  };
  
  const handleSetNameChange = (setId: string, newName: string) => {
    setWeighingSets(prevSets =>
      prevSets.map(set =>
        set.id === setId ? { ...set, name: newName.toUpperCase() } : set
      )
    );
  };

  const handleCacambaDiscount = (setId: string, value: string) => {
     const sanitizedValue = value.replace(/\D/g, '');
     setWeighingSets(prev => prev.map(set => set.id === setId ? {...set, descontoCacamba: sanitizedValue} : set));
  };
  
  const addNewMaterial = (setId: string) => {
    setWeighingSets(prevSets =>
      prevSets.map(set => {
        if (set.id === setId) {
            const isFirstItem = set.items.length === 0;
            const lastItem = isFirstItem ? null : set.items[set.items.length - 1];
            const initialWeightValue = parseFloat(headerData.initialWeight) || 0;

            let newBruto = 0;
            let newTara = 0;

            if (isFirstItem) {
                if (initialWeightValue === 0) {
                    toast({ variant: "destructive", title: "Peso Inicial Necessário", description: "Por favor, insira o peso inicial antes de adicionar um material." });
                    return set; // Abort
                }
                if (operationType === 'loading') {
                    newTara = initialWeightValue;
                } else { // unloading
                    newBruto = initialWeightValue;
                }
            } else {
                if (operationType === 'loading') {
                    newTara = parseFloat(lastItem!.bruto) || 0;
                } else { // unloading
                    newBruto = parseFloat(lastItem!.tara) || 0;
                }
            }
            
            const newItem: WeighingItem = {
                id: uuidv4(),
                material: "SUCATA INOX",
                bruto: newBruto > 0 ? String(newBruto) : "",
                tara: newTara > 0 ? String(newTara) : "",
                descontos: "",
                liquido: newBruto - newTara,
            };
            return { ...set, items: [...set.items, newItem] };
        }
        return set;
      })
    );
  };
  
  const addCacamba = () => {
    const firstSet = weighingSets[0];
    const firstItemOfFirstSet = firstSet.items[0];

    if (!firstItemOfFirstSet) {
        toast({
            variant: "destructive",
            title: "Primeira caçamba vazia",
            description: "Adicione e pese pelo menos um material na Caçamba 1 antes de adicionar outra.",
        });
        return;
    }

    const truckTara = operationType === 'loading' ? (parseFloat(firstItemOfFirstSet.tara) || 0) : (parseFloat(firstItemOfFirstSet.bruto) || 0);

    const brutoValue = operationType === 'loading' ? 0 : truckTara;
    const taraValue = operationType === 'unloading' ? 0 : truckTara;

    const newSet: WeighingSet = {
        id: uuidv4(),
        name: `CAÇAMBA ${weighingSets.length + 1}`,
        items: [{
            id: uuidv4(),
            material: "SUCATA INOX",
            bruto: brutoValue > 0 ? String(brutoValue) : "",
            tara: taraValue > 0 ? String(taraValue) : "",
            descontos: "",
            liquido: 0,
        }],
        descontoCacamba: ""
    };
    newSet.items[0].liquido = (parseFloat(newSet.items[0].bruto) || 0) - (parseFloat(newSet.items[0].tara) || 0);

    setWeighingSets(prev => [...prev, newSet]);
    setActiveSetId(newSet.id);
  };

  const handleClear = () => {
    const newWeighingSet: WeighingSet = { id: uuidv4(), name: "CAÇAMBA 1", items: [], descontoCacamba: "" };
    setWeighingSets([newWeighingSet]);
    setActiveSetId(newWeighingSet.id);
    setHeaderData({ client: "", plate: "", driver: "", initialWeight: "" });
  }

  const handleSave = () => {
      try {
        localStorage.setItem("scaleData", JSON.stringify({weighingSets, headerData, operationType}));
        toast({ title: "Pesagem Salva!", description: "Os dados da pesagem foram salvos localmente." });
      } catch (e) {
        toast({ variant: "destructive", title: "Erro ao Salvar", description: "Não foi possível salvar os dados." });
      }
  }

  const handleLoad = () => {
      try {
          const savedData = localStorage.getItem("scaleData");
          if (savedData) {
              const { weighingSets, headerData, operationType } = JSON.parse(savedData);
              setWeighingSets(weighingSets);
              setHeaderData(headerData || { client: "", plate: "", driver: "", initialWeight: "" });
              setOperationType(operationType || 'loading');
              setActiveSetId(weighingSets[0]?.id || initialWeighingSet.id);
              toast({ title: "Dados Carregados", description: "A última pesagem salva foi carregada." });
          } else {
              toast({ variant: "destructive", title: "Nenhum Dado Salvo", description: "Não há dados de pesagem salvos para carregar." });
          }
      } catch (e) {
          toast({ variant: "destructive", title: "Erro ao Carregar", description: "Não foi possível carregar os dados." });
      }
  }

  const handlePrint = () => {
    try {
        const dataToPrint = {
            ...{weighingSets, headerData, operationType},
            weighingSets: weighingSets.map(set => ({
                ...set,
                descontoCacamba: parseFloat(set.descontoCacamba) || 0,
                items: set.items.map(item => ({
                    ...item,
                    bruto: parseFloat(item.bruto) || 0,
                    tara: parseFloat(item.tara) || 0,
                    descontos: parseFloat(item.descontos) || 0,
                }))
            }))
        };
        localStorage.setItem("scaleData", JSON.stringify(dataToPrint));
        window.open('/calculator/balanca/print', '_blank');
    } catch (e) {
        toast({ variant: "destructive", title: "Erro ao Imprimir", description: "Não foi possível preparar os dados para impressão." });
    }
  }

  useImperativeHandle(ref, () => ({
    handleClear,
    handleSave,
    handleLoad,
    handlePrint,
  }));

  const formatNumber = (num: number) => {
    if (isNaN(num) || num === 0) return "0";
    return new Intl.NumberFormat('pt-BR', {useGrouping: false}).format(num);
  }
  
  const grandTotalLiquido = weighingSets.reduce((total, set) => {
    const setItemsTotal = set.items.reduce((acc, item) => acc + item.liquido, 0);
    return total + (setItemsTotal - (parseFloat(set.descontoCacamba) || 0));
  }, 0);

  return (
    <div className="p-px bg-background max-w-7xl mx-auto" id="scale-calculator-printable-area">
      
      <Card className="mb-px print:border-none print:shadow-none print:p-0">
        <CardContent className="p-px print:p-0">
          <div className="w-full space-y-0.5">
            <div className="flex justify-between items-center gap-1">
                  <Label htmlFor="cliente" className="font-semibold text-sm md:text-base">Cliente</Label>
                   <div className="flex items-center gap-1 print:hidden">
                        
                        <ToggleGroup type="single" value={operationType} onValueChange={(value: OperationType) => value && setOperationType(value)} size="sm">
                            <ToggleGroupItem value="loading" aria-label="Carregamento"><ArrowDownToLine className="h-4 w-4" /></ToggleGroupItem>
                            <ToggleGroupItem value="unloading" aria-label="Descarregamento"><ArrowUpFromLine className="h-4 w-4" /></ToggleGroupItem>
                        </ToggleGroup>
                   </div>
              </div>
            <div className="flex flex-col gap-0.5">
                <Input id="cliente" value={headerData.client} onChange={e => handleHeaderChange('client', e.target.value)} className="h-8 print:hidden"/>
                <span className="hidden print:block">{headerData.client || 'N/A'}</span>
                
                 <div className="flex w-full items-end gap-0.5 text-xs sm:text-sm flex-nowrap">
                    <div className="space-y-px flex-1 min-w-0">
                        <Label htmlFor="motorista" className="text-xs sm:text-sm">Motorista</Label>
                        <Input id="motorista" value={headerData.driver} onChange={e => handleHeaderChange('driver', e.target.value)} className="h-8 print:hidden text-sm"/>
                        <span className="hidden print:block">{headerData.driver || 'N/A'}</span>
                    </div>
                    <div className="space-y-px flex-none">
                        <Label htmlFor="placa" className="text-xs sm:text-sm">Placa</Label>
                        <Input id="placa" value={headerData.plate} onChange={e => handleHeaderChange('plate', e.target.value)} className="h-8 print:hidden text-sm text-center w-24"/>
                        <span className="hidden print:block">{headerData.plate || 'N/A'}</span>
                    </div>
                    <div className="space-y-px flex-none w-24">
                        <Label htmlFor="initial-weight" className="text-xs sm:text-sm">
                          {operationType === 'loading' ? 'Tara' : 'Bruto'} Inicial
                        </Label>
                         <Input
                            id="initial-weight"
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            placeholder="0"
                            value={headerData.initialWeight}
                            onChange={e => handleHeaderChange('initialWeight', e.target.value)}
                            className="text-right h-8 print:hidden w-full"
                        />
                        <span className="hidden print:block">{headerData.initialWeight || 'N/A'}</span>
                    </div>
                </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {weighingSets.map((set, setIndex) => {
         const subtotalLiquido = set.items.reduce((acc, item) => acc + item.liquido, 0);
         const totalLiquidoSet = subtotalLiquido - (parseFloat(set.descontoCacamba) || 0);

         return (
          <Card key={set.id} className="mb-px print:border-none print:shadow-none print:p-0 print:mb-0.5">
            <CardHeader className="p-px flex flex-row items-center justify-between print:p-0 print:mb-0.5">
              <Input 
                value={set.name}
                onChange={(e) => handleSetNameChange(set.id, e.target.value)}
                className="text-xl font-bold border-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent p-0 h-auto"
              />
              <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => addNewMaterial(set.id)} className="h-8 w-8 print:hidden">
                            <PlusCircle className="h-5 w-5" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Adicionar Material</p></TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              {/* Mobile Layout */}
              <div className="sm:hidden">
                  {set.items.map((item, itemIndex) => {
                      const isBrutoEditable = operationType === 'loading';
                      const isTaraEditable = operationType === 'unloading';
                      return (
                      <div key={item.id} className="border-b p-0.5 space-y-0.5">
                          <div className="space-y-px">
                            <Label className="text-xs text-muted-foreground">Material</Label>
                            <MaterialSearchInput
                              value={item.material}
                              onValueChange={(newMaterial) => handleMaterialChange(set.id, item.id, newMaterial)}
                            />
                          </div>
                          <div className="grid grid-cols-4 gap-0.5">
                              <div className="space-y-px">
                                  <Label className="text-xs text-muted-foreground">Bruto (kg)</Label>
                                  <Input type="text" inputMode="numeric" pattern="[0-9]*" placeholder="0" value={item.bruto} onChange={e => handleInputChange(set.id, item.id, 'bruto', e.target.value)} disabled={!isBrutoEditable} className="text-right h-8 print:hidden w-full"/>
                                   <span className="hidden print:block text-right">{formatNumber(parseFloat(item.bruto))}</span>
                              </div>
                               <div className="space-y-px">
                                  <Label className="text-xs text-muted-foreground">Tara (kg)</Label>
                                  <Input type="text" inputMode="numeric" pattern="[0-9]*" placeholder="0" value={item.tara} onChange={e => handleInputChange(set.id, item.id, 'tara', e.target.value)} disabled={!isTaraEditable} className="text-right h-8 print:hidden w-full"/>
                                   <span className="hidden print:block text-right">{formatNumber(parseFloat(item.tara))}</span>
                              </div>
                               <div className="space-y-px">
                                  <Label className="text-xs text-muted-foreground">A/L (kg)</Label>
                                  <Input type="text" inputMode="numeric" pattern="[0-9]*" placeholder="0" value={item.descontos} onChange={(e) => handleInputChange(set.id, item.id, 'descontos', e.target.value)} className="text-right h-8 print:hidden w-full" />
                                   <span className="hidden print:block text-right">{formatNumber(parseFloat(item.descontos))}</span>
                              </div>
                               <div className="space-y-px">
                                  <Label className="text-xs text-muted-foreground">Líquido (kg)</Label>
                                  <div className="h-8 flex items-center justify-end font-semibold">
                                      <span className="print:text-black">{formatNumber(item.liquido)}</span>
                                  </div>
                              </div>
                          </div>
                      </div>
                  )})}
              </div>
              {/* Desktop Layout */}
              <Table className="hidden sm:table table-fixed">
                <TableHeader>
                   <TableRow className="print:text-black">
                    <TableHead className="w-[30%]">Material</TableHead>
                    <TableHead className="text-right w-[17.5%]">Bruto (kg)</TableHead>
                    <TableHead className="text-right w-[17.5%]">Tara (kg)</TableHead>
                    <TableHead className="text-right w-[17.5%]">A/L (kg)</TableHead>
                    <TableHead className="text-right font-semibold w-[17.5%]">Líquido (kg)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {set.items.map((item, itemIndex) => {
                      const isBrutoEditable = operationType === 'loading';
                      const isTaraEditable = operationType === 'unloading';
                      return (
                    <TableRow key={item.id} className="print:text-black">
                      <TableCell className="w-[30%] font-medium p-0 sm:p-px">
                          <MaterialSearchInput
                            value={item.material}
                            onValueChange={(newMaterial) => handleMaterialChange(set.id, item.id, newMaterial)}
                          />
                      </TableCell>
                      <TableCell className="w-[17.5%] p-0 sm:p-px">
                            <div className="flex justify-end">
                                <Input type="text" inputMode="numeric" pattern="[0-9]*" placeholder="0" value={item.bruto} onChange={e => handleInputChange(set.id, item.id, 'bruto', e.target.value)} disabled={!isBrutoEditable} className="text-right h-8 print:hidden w-full"/>
                            </div>
                            <span className="hidden print:block text-right">{formatNumber(parseFloat(item.bruto))}</span>
                      </TableCell>
                      <TableCell className="w-[17.5%] p-0 sm:p-px">
                            <div className="flex justify-end">
                                <Input type="text" inputMode="numeric" pattern="[0-9]*" placeholder="0" value={item.tara} onChange={e => handleInputChange(set.id, item.id, 'tara', e.target.value)} disabled={!isTaraEditable} className="text-right h-8 print:hidden w-full"/>
                            </div>
                            <span className="hidden print:block text-right">{formatNumber(parseFloat(item.tara))}</span>
                      </TableCell>
                      <TableCell className="w-[17.5%] p-0 sm:p-px">
                            <div className="flex justify-end">
                                <Input
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                placeholder="0"
                                value={item.descontos}
                                onChange={(e) => handleInputChange(set.id, item.id, 'descontos', e.target.value)}
                                className="text-right h-8 print:hidden w-24"
                                />
                            </div>
                            <span className="hidden print:block text-right">{formatNumber(parseFloat(item.descontos))}</span>
                      </TableCell>
                      <TableCell className="w-[17.5%] text-right font-semibold p-0 sm:p-px">
                            <div className="h-8 sm:h-full flex items-center justify-end">
                                <span className="print:text-black">{formatNumber(item.liquido)}</span>
                            </div>
                      </TableCell>
                    </TableRow>
                  )})}
                </TableBody>
              </Table>
            </CardContent>
            <CardContent className="p-px border-t print:border-t print:border-border print:p-0 print:pt-0.5">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-1">
                     <div className="flex items-center gap-0.5">
                         <Label htmlFor={`desconto-cacamba-${set.id}`} className="shrink-0 text-sm md:text-base">Caçamba (kg)</Label>
                         <Input
                             id={`desconto-cacamba-${set.id}`}
                             type="text"
                             inputMode="numeric"
                             pattern="[0-9]*"
                             placeholder="0"
                             value={set.descontoCacamba}
                             onChange={(e) => handleCacambaDiscount(set.id, e.target.value)}
                             className="h-8 text-right print:hidden flex-1 min-w-[90px] w-14"
                          />
                          <span className="hidden print:block font-semibold">{formatNumber(parseFloat(set.descontoCacamba))}</span>
                     </div>
                     <div className="text-right flex-shrink-0">
                         <p className="text-sm text-muted-foreground">Subtotal</p>
                         <p className="text-lg font-bold print:text-black">{formatNumber(subtotalLiquido)} kg</p>
                     </div>
                      <div className="text-right flex-shrink-0">
                         <p className="text-sm text-muted-foreground">{set.name}</p>
                         <p className="text-xl font-bold text-primary print:text-black">{formatNumber(totalLiquidoSet)} kg</p>
                     </div>
                 </div>
            </CardContent>
          </Card>
        );
      })}

      <div className="flex justify-center my-px print:hidden">
        <Button variant="secondary" onClick={addCacamba} size="sm" className="h-8 px-2"><Tractor className="mr-2 h-4 w-4" /> + Adicionar Caçamba</Button>
      </div>

      <Card className="mt-px bg-primary/10 border-primary/20 print:border print:border-accent-price print:shadow-none print:p-0.5">
         <CardContent className="p-px flex justify-end items-center">
             <div className="text-right">
                <p className="text-lg font-semibold text-primary print:text-2xl print:mb-0.5">Peso Líquido Total</p>
                <p className="text-4xl font-bold text-primary print:text-black">{new Intl.NumberFormat('pt-BR').format(grandTotalLiquido)} kg</p>
            </div>
         </CardContent>
      </Card>
      <div className="flex items-center justify-evenly pt-1 print:hidden">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={handleClear} variant="outline" size="icon" className="h-8 w-8"><Trash2 className="h-4 w-4" /></Button>
            </TooltipTrigger>
            <TooltipContent><p>Limpar Tudo</p></TooltipContent>
          </Tooltip>
            <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={handleSave} variant="outline" size="icon" className="h-8 w-8"><Save className="h-4 w-4" /></Button>
            </TooltipTrigger>
            <TooltipContent><p>Salvar Pesagem</p></TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={handleLoad} variant="outline" size="icon" className="h-8 w-8"><ArrowUpFromLine className="h-4 w-4" /></Button>
            </TooltipTrigger>
            <TooltipContent><p>Carregar Última Pesagem</p></TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={handlePrint} variant="outline" size="icon" className="h-8 w-8"><Printer className="h-4 w-4" /></Button>
            </TooltipTrigger>
            <TooltipContent><p>Imprimir</p></TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
});
ScaleCalculatorComponent.displayName = 'ScaleCalculatorComponent';

function MaterialSearchInput({ value, onValueChange }: { value: string, onValueChange: (value: string) => void }) {
  const [open, setOpen] = useState(false)
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-8 print:hidden"
        >
          <span className="truncate">{value}</span>
        </Button>
      </PopoverTrigger>
       <span className="hidden print:block">{value}</span>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Buscar sucata..." />
          <CommandEmpty>Nenhuma sucata encontrada.</CommandEmpty>
          <ScrollArea className="h-48">
            <CommandGroup>
              {scrapItems.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.material}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  {item.material}
                </CommandItem>
              ))}
            </CommandGroup>
          </ScrollArea>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

const ScaleCalculator = forwardRef((props, ref) => (
    <ScaleCalculatorComponent {...props} ref={ref} />
));

ScaleCalculator.displayName = 'ScaleCalculator';

export default ScaleCalculator;
