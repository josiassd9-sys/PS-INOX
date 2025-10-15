
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
import { PlusCircle, Trash, Tractor, Printer, Save, Trash2 } from "lucide-react";
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

const initialItem: WeighingItem = { id: '', material: '', bruto: 0, tara: 0, descontos: 0, liquido: 0 };
const initialWeighingSet: WeighingSet = { id: uuidv4(), items: [], descontoCacamba: 0 };

function ScaleCalculator() {
  const [headerData, setHeaderData] = useState({
    client: "",
    plate: "",
    driver: "",
    city: "",
  });
  const [weighingSets, setWeighingSets] = useState<WeighingSet[]>([initialWeighingSet]);
  const [activeSetId, setActiveSetId] = useState<string>(initialWeighingSet.id);
  const { toast } = useToast();

  const handleHeaderChange = (field: keyof typeof headerData, value: string) => {
    setHeaderData(prev => ({ ...prev, [field]: value }));
  };

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
      prevSets.map(set => {
        if (set.id === setId) {
          const lastItem = set.items[set.items.length - 1];
          const newBruto = lastItem ? lastItem.tara : 0;
          const newItem: WeighingItem = {
            id: uuidv4(),
            material: "Sucata Inox",
            bruto: newBruto,
            tara: 0,
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
    setWeighingSets([initialWeighingSet]);
    setActiveSetId(initialWeighingSet.id);
    setHeaderData({ client: "", plate: "", driver: "", city: "" });
  }

  const handleSave = () => {
      try {
        localStorage.setItem("scaleData", JSON.stringify({weighingSets, headerData}));
        toast({ title: "Pesagem Salva!", description: "Os dados da pesagem foram salvos localmente." });
      } catch (e) {
        toast({ variant: "destructive", title: "Erro ao Salvar", description: "Não foi possível salvar os dados." });
      }
  }

  const handleLoad = () => {
      try {
          const savedData = localStorage.getItem("scaleData");
          if (savedData) {
              const { weighingSets, headerData } = JSON.parse(savedData);
              setWeighingSets(weighingSets);
              setHeaderData(headerData);
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
        <h1 className="text-3xl font-bold text-foreground">Balança</h1>
        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={handleClear} variant="outline" size="icon" className="h-8 w-8"><Trash2 /></Button>
              </TooltipTrigger>
              <TooltipContent><p>Limpar Tudo</p></TooltipContent>
            </Tooltip>
             <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={handleSave} variant="outline" size="icon" className="h-8 w-8"><Save/></Button>
              </TooltipTrigger>
              <TooltipContent><p>Salvar Pesagem</p></TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={handlePrint} variant="outline" size="icon" className="h-8 w-8"><Printer /></Button>
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
          <div className="grid grid-cols-1 gap-4">
            <div>
                <Label htmlFor="cliente">Cliente</Label>
                <Input id="cliente" value={headerData.client} onChange={e => handleHeaderChange('client', e.target.value)} className="h-8 print:hidden"/>
                <span className="hidden print:block">{headerData.client || 'N/A'}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="motorista">Motorista</Label>
                <Input id="motorista" value={headerData.driver} onChange={e => handleHeaderChange('driver', e.target.value)} className="h-8 print:hidden"/>
                <span className="hidden print:block">{headerData.driver || 'N/A'}</span>
              </div>
               <div>
                <Label htmlFor="cidade">Cidade</Label>
                <Input id="cidade" value={headerData.city} onChange={e => handleHeaderChange('city', e.target.value)} className="h-8 print:hidden"/>
                <span className="hidden print:block">{headerData.city || 'N/A'}</span>
              </div>
              <div>
                <Label htmlFor="placa">Placa</Label>
                <Input id="placa" value={headerData.plate} onChange={e => handleHeaderChange('plate', e.target.value)} className="h-8 print:hidden"/>
                <span className="hidden print:block">{headerData.plate || 'N/A'}</span>
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
                    <TableHead className="min-w-[200px]">Material</TableHead>
                    <TableHead className="text-right min-w-[120px]">Bruto (kg)</TableHead>
                    <TableHead className="text-right min-w-[120px]">Tara (kg)</TableHead>
                    <TableHead className="text-right min-w-[120px]">Descontos (kg)</TableHead>
                    <TableHead className="text-right font-semibold min-w-[120px]">Líquido (kg)</TableHead>
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
                          disabled={itemIndex > 0}
                        />
                         <span className="hidden print:block text-right">{formatNumber(item.bruto)}</span>
                      </TableCell>
                       <TableCell>
                        <Input
                          type="text"
                          value={formatNumber(item.tara)}
                          onChange={(e) => handleInputChange(set.id, item.id, 'tara', e.target.value)}
                          className="text-right h-8 print:hidden"
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
                  <Button size="sm" onClick={() => addNewMaterial(set.id)} className="h-8">
                    <PlusCircle className="mr-2 h-4 w-4 sm:hidden" />
                    <span className="hidden sm:inline"><PlusCircle className="mr-2 h-4 w-4" /></span>
                    <span className="hidden sm:inline">Adicionar Material</span>
                  </Button>
              </div>
            </CardContent>
            <CardContent className="p-4 border-t print:border-t print:border-border print:p-0 print:pt-2">
                 <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-end">
                     <div className="flex items-center gap-2">
                         <Label htmlFor={`desconto-cacamba-${set.id}`} className="shrink-0">Desconto Caçamba (kg)</Label>
                         <Input
                             id={`desconto-cacamba-${set.id}`}
                             type="text"
                             value={formatNumber(set.descontoCacamba)}
                             onChange={(e) => handleCacambaDiscount(set.id, e.target.value)}
                             className="w-32 h-8 text-right print:hidden"
                          />
                          <span className="hidden print:block font-semibold">{formatNumber(set.descontoCacamba)}</span>
                     </div>
                     <div className="text-right">
                         <p className="text-sm text-muted-foreground">Subtotal Líquido</p>
                         <p className="text-lg font-bold print:text-black">{formatNumber(subtotalLiquido)} kg</p>
                     </div>
                      <div className="text-right">
                         <p className="text-sm text-muted-foreground">Total Líquido ({setIndex === 0 ? "Caçamba 1" : "Bitrem"})</p>
                         <p className="text-xl font-bold text-primary print:text-black">{formatNumber(totalLiquidoSet)} kg</p>
                     </div>
                 </div>
            </CardContent>
          </Card>
        );
      })}

      {weighingSets.length < 2 && (
        <div className="flex justify-center my-4 print:hidden">
          <Button variant="secondary" onClick={addBitrem}><Tractor className="mr-2 h-4 w-4" /> Adicionar Bitrem / Caçamba 2</Button>
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

    