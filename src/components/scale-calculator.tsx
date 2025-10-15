
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHeader, TableRow, TableHead } from "./ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { PlusCircle, Trash, Tractor, Printer, Save, Trash2, ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import { scrapItems } from "@/lib/data/sucata";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "./ui/command";
import { ScrollArea } from "./ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { cn } from "@/lib/utils";

type WeighingItem = {
  id: string;
  material: string;
  bruto: number;
  tara: number;
  descontos: number;
  liquido: number;
};

type WeighingSet = {
  id: string;
  items: WeighingItem[];
  descontoCacamba: number;
};

type OperationType = 'loading' | 'unloading';

const initialItem: WeighingItem = { id: '', material: '', bruto: 0, tara: 0, descontos: 0, liquido: 0 };
const initialWeighingSet: WeighingSet = { id: uuidv4(), items: [], descontoCacamba: 0 };

function ScaleCalculator() {
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
    const sanitizedValue = value.replace(/[^0-9,]/g, '').replace('.', ',');
    if(field === 'initialWeight') {
        if(/^\d*\,?\d*$/.test(sanitizedValue)) {
             setHeaderData(prev => ({ ...prev, [field]: sanitizedValue }));
        }
    } else {
        setHeaderData(prev => ({ ...prev, [field]: value }));
    }
  };

  useEffect(() => {
    const initialWeightValue = parseFloat(headerData.initialWeight.replace(',', '.')) || 0;
    
    // Only proceed if there's an initial weight and at least one item
    if (initialWeightValue > 0 && weighingSets[0] && weighingSets[0].items.length > 0) {
      setWeighingSets(prevSets => {
        const newSets = [...prevSets];
        const firstSet = { ...newSets[0] };
        const firstItem = { ...firstSet.items[0] };
        
        if (operationType === 'loading') {
          firstItem.bruto = initialWeightValue;
        } else { // unloading
          firstItem.tara = initialWeightValue;
        }

        // Recalculate liquido for the first item
        firstItem.liquido = firstItem.bruto - firstItem.tara - firstItem.descontos;
        
        firstSet.items = [firstItem, ...firstSet.items.slice(1)];
        newSets[0] = firstSet;
        
        return newSets;
      });
    }
  }, [headerData.initialWeight, operationType]);


  const handleInputChange = (setId: string, itemId: string, field: keyof WeighingItem, value: string) => {
    const numValue = parseFloat(value.replace(',', '.')) || 0;
    setWeighingSets(prevSets =>
      prevSets.map(set => {
        if (set.id === setId) {
          const newItems = set.items.map(item => {
            if (item.id === itemId) {
              const updatedItem = { ...item, [field]: numValue };
              const bruto = updatedItem.bruto;
              const tara = updatedItem.tara;
              const descontos = updatedItem.descontos;
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
            item.id === itemId ? { ...item, material: newMaterial } : item
          );
          return { ...set, items: newItems };
        }
        return set;
      })
    );
  };

  const handleCacambaDiscount = (setId: string, value: string) => {
     const numValue = parseFloat(value.replace(',', '.')) || 0;
     setWeighingSets(prev => prev.map(set => set.id === setId ? {...set, descontoCacamba: numValue} : set));
  };
  
  const addNewMaterial = (setId: string) => {
    setWeighingSets(prevSets =>
      prevSets.map((set, setIndex) => {
        if (set.id === setId) {
          const lastItem = set.items[set.items.length - 1];
          
          let newBruto = 0;
          let newTara = 0;

          if (operationType === 'loading') {
            newBruto = lastItem ? lastItem.tara : 0;
          } else { // unloading
             // If there's a last item, the new tara is its bruto.
             if (lastItem) {
              newTara = lastItem.bruto;
             }
          }
           
          const newItem: WeighingItem = {
            id: uuidv4(),
            material: "Sucata Inox",
            bruto: newBruto,
            tara: newTara,
            descontos: 0,
            liquido: 0,
          };
          return { ...set, items: [...set.items, newItem] };
        }
        return set;
      })
    );
  };
  
  const addBitrem = () => {
    if (weighingSets.length < 2) {
      const newSet: WeighingSet = { id: uuidv4(), items: [], descontoCacamba: 0 };
      setWeighingSets(prev => [...prev, newSet]);
      setActiveSetId(newSet.id);
    }
  };

  const handleClear = () => {
    const newWeighingSet = { id: uuidv4(), items: [], descontoCacamba: 0 };
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
    window.print();
  }

  const formatNumber = (num: number, decimals = 2) => {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  }
  
  const grandTotalLiquido = weighingSets.reduce((total, set) => {
    const setItemsTotal = set.items.reduce((acc, item) => acc + item.liquido, 0);
    return total + (setItemsTotal - set.descontoCacamba);
  }, 0);

  return (
    <div className="p-4 bg-background max-w-7xl mx-auto" id="scale-calculator-printable-area">
      <div className="print:hidden flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold text-foreground">Balança</h1>
            <TooltipProvider>
                <div className="flex items-center gap-1 rounded-full border bg-muted p-0.5">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant={operationType === 'loading' ? 'default' : 'ghost'} size="icon" className="h-7 w-7 rounded-full" onClick={() => setOperationType('loading')}>
                                <ArrowDownToLine className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Carregamento (Entrada)</p></TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant={operationType === 'unloading' ? 'default' : 'ghost'} size="icon" className="h-7 w-7 rounded-full" onClick={() => setOperationType('unloading')}>
                                <ArrowUpFromLine className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Descarregamento (Saída)</p></TooltipContent>
                    </Tooltip>
                </div>
            </TooltipProvider>
        </div>
        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={handleClear} variant="outline" size="icon" className="h-8 w-8"><Trash2 className="h-4 w-4" /></Button>
              </TooltipTrigger>
              <TooltipContent><p>Limpar Tudo</p></TooltipContent>
            </Tooltip>
             <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={handleSave} variant="outline" size="icon" className="h-8 w-8"><Save className="h-4 w-4"/></Button>
              </TooltipTrigger>
              <TooltipContent><p>Salvar Pesagem</p></TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={handleLoad} variant="outline" size="icon" className="h-8 w-8"><ArrowUpFromLine className="h-4 w-4"/></Button>
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
      
      <div className="hidden print:block mb-4">
        <h1 className="text-4xl font-bold text-center">Balança</h1>
      </div>

      <Card className="mb-4 print:border-none print:shadow-none print:p-0">
        <CardContent className="p-4 print:p-0">
          <div className="w-full space-y-2">
            <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                    <Label htmlFor="cliente" className="font-semibold text-sm md:text-base">Cliente</Label>
                </div>
                <Input id="cliente" value={headerData.client} onChange={e => handleHeaderChange('client', e.target.value)} className="h-8 print:hidden"/>
                <span className="hidden print:block">{headerData.client || 'N/A'}</span>
                
                <div className="grid grid-cols-[repeat(auto-fit,minmax(80px,1fr))] gap-2 w-full text-xs sm:text-sm">
                    <div className="space-y-1">
                        <Label htmlFor="motorista" className="text-xs sm:text-sm">Motorista</Label>
                        <Input id="motorista" value={headerData.driver} onChange={e => handleHeaderChange('driver', e.target.value)} className="h-8 print:hidden text-sm"/>
                        <span className="hidden print:block">{headerData.driver || 'N/A'}</span>
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="placa" className="text-xs sm:text-sm">Placa</Label>
                        <Input id="placa" value={headerData.plate} onChange={e => handleHeaderChange('plate', e.target.value)} className="h-8 print:hidden text-sm"/>
                        <span className="hidden print:block">{headerData.plate || 'N/A'}</span>
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="initial-weight" className="text-xs sm:text-sm">
                          {operationType === 'loading' ? 'Bruto' : 'Tara'}
                        </Label>
                        <Input id="initial-weight" type="text" inputMode="decimal" value={headerData.initialWeight} onChange={e => handleHeaderChange('initialWeight', e.target.value)} className="h-8 print:hidden text-sm"/>
                        <span className="hidden print:block">{headerData.initialWeight || 'N/A'}</span>
                    </div>
                </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {weighingSets.map((set, setIndex) => {
         const subtotalLiquido = set.items.reduce((acc, item) => acc + item.liquido, 0);
         const totalLiquidoSet = subtotalLiquido - set.descontoCacamba;

         return (
          <Card key={set.id} className="mb-4 print:border-none print:shadow-none print:p-0 print:mb-2">
            <CardHeader className="p-4 print:p-0 print:mb-2">
              <CardTitle className="text-xl">
                {setIndex === 0 ? "Caçamba 1" : "Bitrem / Caçamba 2"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader>
                   <TableRow className="print:text-black">
                    <TableHead className="w-[30%]">Material</TableHead>
                    <TableHead className="text-right w-[17.5%]">Bruto (kg)</TableHead>
                    <TableHead className="text-right w-[17.5%]">Tara (kg)</TableHead>
                    <TableHead className="text-right w-[17.5%]">Descontos (kg)</TableHead>
                    <TableHead className="text-right font-semibold w-[17.5%]">Líquido (kg)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {set.items.map((item, itemIndex) => (
                    <TableRow key={item.id} className="print:text-black">
                      <TableCell>
                          <MaterialSearchInput
                            value={item.material}
                            onValueChange={(newMaterial) => handleMaterialChange(set.id, item.id, newMaterial)}
                          />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="text"
                          value={formatNumber(item.bruto)}
                          onChange={(e) => handleInputChange(set.id, item.id, 'bruto', e.target.value)}
                          className="text-right h-8 print:hidden"
                          disabled={itemIndex > 0 || (setIndex === 0 && !!headerData.initialWeight && operationType === 'loading')}
                        />
                         <span className="hidden print:block text-right">{formatNumber(item.bruto)}</span>
                      </TableCell>
                       <TableCell>
                        <Input
                          type="text"
                          value={formatNumber(item.tara)}
                          onChange={(e) => handleInputChange(set.id, item.id, 'tara', e.target.value)}
                          className="text-right h-8 print:hidden"
                          disabled={setIndex === 0 && itemIndex === 0 && !!headerData.initialWeight && operationType === 'unloading'}
                        />
                         <span className="hidden print:block text-right">{formatNumber(item.tara)}</span>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="text"
                          value={formatNumber(item.descontos)}
                          onChange={(e) => handleInputChange(set.id, item.id, 'descontos', e.target.value)}
                          className="text-right h-8 print:hidden"
                        />
                         <span className="hidden print:block text-right">{formatNumber(item.descontos)}</span>
                      </TableCell>
                       <TableCell className="text-right font-semibold">
                           <span className="print:text-black">{formatNumber(item.liquido)}</span>
                       </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-start p-2 print:hidden">
                  <Button size="sm" onClick={() => addNewMaterial(set.id)} className="h-8 px-2">
                    <PlusCircle className="mr-1 h-4 w-4" />
                    Adicionar Material
                  </Button>
              </div>
            </CardContent>
            <CardContent className="p-4 border-t print:border-t print:border-border print:p-0 print:pt-2">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-4">
                     <div className="flex items-center gap-2">
                         <Label htmlFor={`desconto-cacamba-${set.id}`} className="shrink-0 text-sm md:text-base">Desconto Caçamba (kg)</Label>
                         <Input
                             id={`desconto-cacamba-${set.id}`}
                             type="text"
                             value={formatNumber(set.descontoCacamba)}
                             onChange={(e) => handleCacambaDiscount(set.id, e.target.value)}
                             className="h-8 text-right print:hidden flex-1 min-w-[90px]"
                          />
                          <span className="hidden print:block font-semibold">{formatNumber(set.descontoCacamba)}</span>
                     </div>
                     <div className="text-right flex-shrink-0">
                         <p className="text-sm text-muted-foreground">Subtotal</p>
                         <p className="text-lg font-bold print:text-black">{formatNumber(subtotalLiquido)} kg</p>
                     </div>
                      <div className="text-right flex-shrink-0">
                         <p className="text-sm text-muted-foreground">{setIndex === 0 ? "Caçamba 1" : "Bitrem / Caçamba 2"}</p>
                         <p className="text-xl font-bold text-primary print:text-black">{formatNumber(totalLiquidoSet)} kg</p>
                     </div>
                 </div>
            </CardContent>
          </Card>
        );
      })}

      {weighingSets.length < 2 && (
        <div className="flex justify-center my-4 print:hidden">
          <Button variant="secondary" onClick={addBitrem} size="sm" className="h-8 px-2"><Tractor className="mr-2 h-4 w-4" /> + Bitrem / Caçamba 2</Button>
        </div>
      )}

      <Card className="mt-4 bg-primary/10 border-primary/20 print:border print:border-accent-price print:shadow-none print:p-2">
         <CardContent className="p-4 flex justify-end items-center">
             <div className="text-right">
                <p className="text-lg font-semibold text-primary print:text-2xl print:mb-2">Peso Líquido Total</p>
                <p className="text-4xl font-bold text-primary print:text-black">{formatNumber(grandTotalLiquido)} kg</p>
            </div>
         </CardContent>
      </Card>
    </div>
  );
}

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

export default ScaleCalculator;

    