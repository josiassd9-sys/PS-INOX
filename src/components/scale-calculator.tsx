
"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "./ui/button";
import { PlusCircle, Printer, Sparkles, Trash2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { Icon } from "./icons";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Separator } from "./ui/separator";

interface MaterialItem {
  id: string;
  name: string;
  gross: string;
  waste: string;
  container: string;
  tare: string;
  net: number;
}

interface WeighingSet {
  id:string;
  items: MaterialItem[];
  totalNet: number;
}

const LOCAL_STORAGE_KEY = "scaleCalculatorState_v2";

const createNewItem = (previousItem?: MaterialItem): MaterialItem => {
    const grossValue = previousItem ? previousItem.tare : "";
    return {
        id: uuidv4(),
        name: "",
        gross: grossValue,
        waste: "",
        container: "",
        tare: "",
        net: 0,
    };
};

const createNewWeighingSet = (): WeighingSet => ({
  id: uuidv4(),
  items: [createNewItem()],
  totalNet: 0,
});

const sanitizeState = (state: any): { weighingSets: WeighingSet[] } => {
    if (!state || !Array.isArray(state.weighingSets)) {
        return { weighingSets: [createNewWeighingSet()] };
    }
    const sanitizedSets = state.weighingSets.map((set: any) => {
        if (!set || !set.id || !Array.isArray(set.items)) {
            return createNewWeighingSet();
        }
        const sanitizedItems = set.items.map((item: any) => ({
            id: item.id || uuidv4(),
            name: item.name || "",
            gross: item.gross || "",
            waste: item.waste || "",
            container: item.container || "",
            tare: item.tare || "",
            net: typeof item.net === 'number' ? item.net : 0,
        }));
        return {
            id: set.id,
            items: sanitizedItems.length > 0 ? sanitizedItems : [createNewItem()],
            totalNet: typeof set.totalNet === 'number' ? set.totalNet : 0,
        };
    });

    return {
        weighingSets: sanitizedSets.length > 0 ? sanitizedSets : [createNewWeighingSet()],
    };
};


export function ScaleCalculator() {
  const { toast } = useToast();
  const [weighingSets, setWeighingSets] = React.useState<WeighingSet[]>([createNewWeighingSet()]);
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
    try {
      const savedStateJSON = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedStateJSON) {
        const savedState = JSON.parse(savedStateJSON);
        const sanitized = sanitizeState(savedState);
        setWeighingSets(sanitized.weighingSets);
      }
    } catch (error) {
      console.error("Failed to load from localStorage", error);
      setWeighingSets([createNewWeighingSet()]);
    }
  }, []);
  
  React.useEffect(() => {
    if (isClient) {
      try {
        const stateToSave = { weighingSets };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
      } catch (error) {
        console.error("Failed to save to localStorage", error);
      }
    }
  }, [weighingSets, isClient]);


  const handleItemChange = (setId: string, itemId: string, field: keyof Omit<MaterialItem, 'id' | 'net'>, value: string) => {
    setWeighingSets(prev =>
      prev.map(set => {
        if (set.id !== setId) return set;
        const newItems = set.items.map(item => {
          if (item.id !== itemId) return item;
          
          if (field !== 'name') {
            const sanitizedValue = value.replace(/[^0-9,.]/g, "").replace(".", ",");
             if (!/^\d*\,?\d*$/.test(sanitizedValue)) return item;
             return { ...item, [field]: sanitizedValue };
          }
          return { ...item, [field]: value };
        });
        return { ...set, items: newItems };
      })
    );
  };
  
  React.useEffect(() => {
    setWeighingSets(prev =>
      prev.map(set => {
        const newItems = set.items.map(item => {
          const gross = parseFloat(item.gross.replace(',', '.')) || 0;
          const waste = parseFloat(item.waste.replace(',', '.')) || 0;
          const container = parseFloat(item.container.replace(',', '.')) || 0;
          const tare = parseFloat(item.tare.replace(',', '.')) || 0;
          const net = gross - waste - container - tare;
          return { ...item, net: net > 0 ? net : 0 };
        });
        const totalNet = newItems.reduce((acc, item) => acc + item.net, 0);
        return { ...set, items: newItems, totalNet };
      })
    );
  }, [weighingSets.map(s => s.items.map(i => `${i.gross}${i.waste}${i.container}${i.tare}`).join()).join()]);


  const addItem = (setId: string) => {
    setWeighingSets(prev =>
      prev.map(set => {
        if (set.id !== setId) return set;
        const lastItem = set.items[set.items.length - 1];
        return { ...set, items: [...set.items, createNewItem(lastItem)] };
      })
    );
  };

  const removeItem = (setId: string, itemId: string) => {
    setWeighingSets(prev =>
      prev.map(set => {
        if (set.id !== setId) return set;
        const newItems = set.items.filter(item => item.id !== itemId);
        if (newItems.length === 0) {
            return {...set, items: [createNewItem()]}
        }
        return { ...set, items: newItems };
      })
    );
  };
  
  const addWeighingSet = () => {
    setWeighingSets(prev => [...prev, createNewWeighingSet()]);
  };
  
  const removeWeighingSet = (setId: string) => {
    setWeighingSets(prev => {
      const newSets = prev.filter(set => set.id !== setId);
      if (newSets.length === 0) return [createNewWeighingSet()];
      return newSets;
    });
  };
  
  const handleClearAll = () => {
    setWeighingSets([createNewWeighingSet()]);
    toast({ title: "Tudo limpo!", description: "Você pode iniciar uma nova pesagem." });
  };
  
  const grandTotalNet = weighingSets.reduce((acc, set) => acc + set.totalNet, 0);
  
  const formatNumber = (value: number) => {
    if (isNaN(value)) return "0,00";
    return new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="space-y-2 p-1" id="scale-calculator-printable-area">
        {weighingSets.map((set, setIndex) => {
            const containerValueUsed = set.items.some(item => (parseFloat(item.container.replace(',', '.')) || 0) > 0);
            return (
            <Card key={set.id} className="bg-card/50 print:shadow-none print:border-border">
                 <CardHeader className="flex-row items-center justify-between p-2">
                    <CardTitle className="text-lg">Caçamba {setIndex + 1}</CardTitle>
                    {weighingSets.length > 1 && (
                        <Button variant="ghost" size="icon" onClick={() => removeWeighingSet(set.id)} className="print:hidden h-7 w-7 text-destructive/80 hover:text-destructive">
                           <Icon name="Trash2" />
                        </Button>
                    )}
                 </CardHeader>
                 <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                             <TableHeader>
                                <TableRow className="text-xs">
                                    <TableHead className="min-w-[150px] p-1">Material</TableHead>
                                    <TableHead className="min-w-[100px] p-1">Bruto (kg)</TableHead>
                                    <TableHead className="min-w-[100px] p-1">Lixo (kg)</TableHead>
                                    <TableHead className="min-w-[100px] p-1">Caçamba (kg)</TableHead>
                                    <TableHead className="min-w-[100px] p-1">Tara (kg)</TableHead>
                                    <TableHead className="min-w-[110px] p-1 font-bold text-accent-price text-center">Líquido (kg)</TableHead>
                                    <TableHead className="w-[40px] p-1 print:hidden"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {set.items.map((item, itemIndex) => {
                                    const isGrossDisabled = itemIndex > 0 && set.items[itemIndex - 1]?.tare !== "";
                                    const isContainerDisabled = containerValueUsed && (parseFloat(item.container.replace(',', '.')) || 0) === 0;

                                    return (
                                    <TableRow key={item.id}>
                                        <TableCell className="p-1"><Input value={item.name} onChange={e => handleItemChange(set.id, item.id, 'name', e.target.value)} placeholder="Nome" className="h-8"/></TableCell>
                                        <TableCell className="p-1"><Input value={item.gross} onChange={e => handleItemChange(set.id, item.id, 'gross', e.target.value)} placeholder="0,00" className="h-8" disabled={isGrossDisabled} /></TableCell>
                                        <TableCell className="p-1"><Input value={item.waste} onChange={e => handleItemChange(set.id, item.id, 'waste', e.target.value)} placeholder="0,00" className="h-8"/></TableCell>
                                        <TableCell className="p-1"><Input value={item.container} onChange={e => handleItemChange(set.id, item.id, 'container', e.target.value)} placeholder="0,00" className="h-8" disabled={isContainerDisabled} /></TableCell>
                                        <TableCell className="p-1"><Input value={item.tare} onChange={e => handleItemChange(set.id, item.id, 'tare', e.target.value)} placeholder="0,00" className="h-8"/></TableCell>
                                        <TableCell className="p-1 text-center font-bold text-accent-price align-middle">{formatNumber(item.net)}</TableCell>
                                        <TableCell className="p-1 print:hidden">
                                          {set.items.length > 1 && <Button variant="ghost" size="icon" onClick={() => removeItem(set.id, item.id)} className="h-8 w-8 text-destructive/70 hover:text-destructive"><Icon name="X" className="h-4 w-4"/></Button>}
                                        </TableCell>
                                    </TableRow>
                                )})}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="p-2 flex justify-between items-center">
                        <Button variant="outline" size="sm" onClick={() => addItem(set.id)} className="print:hidden">
                            <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Material
                        </Button>
                         <div className="flex items-center gap-4">
                            <span className="font-semibold">Subtotal Líquido:</span>
                            <span className="font-bold text-lg text-primary">{formatNumber(set.totalNet)} kg</span>
                        </div>
                    </div>
                 </CardContent>
            </Card>
        )})}
         <div className="flex flex-col sm:flex-row gap-2 print:hidden">
            <Button variant="secondary" onClick={addWeighingSet} className="flex-1">
                <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Bitrem
            </Button>
        </div>

        <Separator className="my-2"/>

        <div className="flex justify-end items-center gap-2 pt-2">
            <h3 className="text-lg font-semibold">Total Geral Líquido:</h3>
            <div className="text-2xl font-bold text-primary min-w-[150px] text-right">
                {formatNumber(grandTotalNet)} kg
            </div>
        </div>

        <div className="flex justify-end pt-2 gap-2 print:hidden">
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="gap-1">
                        <Icon name="Sparkles" />
                        <span className="hidden sm:inline">Limpar</span>
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta ação não pode ser desfeita. Isso limpará todos os campos da pesagem atual.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClearAll}>Continuar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <Button onClick={() => window.print()} className="gap-1">
                <Printer />
                <span className="hidden sm:inline">Imprimir</span>
            </Button>
        </div>
    </div>
  );
}

