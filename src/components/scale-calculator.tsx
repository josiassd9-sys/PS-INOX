
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
import { PlusCircle, Printer, Save, Sparkles, Trash2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { Icon } from "./icons";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Separator } from "./ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";


interface MaterialItem {
  id: string;
  name: string;
  gross: string;
  waste: string;
  tare: string;
  net: number;
}

interface WeighingSet {
  id:string;
  items: MaterialItem[];
  containerWeight: string;
  subTotalNet: number;
  totalNet: number;
}

const LOCAL_STORAGE_KEY = "scaleCalculatorState_v4";

const createNewItem = (previousItem?: MaterialItem): MaterialItem => {
    const grossValue = previousItem ? previousItem.tare : "";
    return {
        id: uuidv4(),
        name: "",
        gross: grossValue,
        waste: "",
        tare: "",
        net: 0,
    };
};

const createNewWeighingSet = (): WeighingSet => ({
  id: uuidv4(),
  items: [createNewItem()],
  containerWeight: "",
  subTotalNet: 0,
  totalNet: 0,
});

const sanitizeState = (state: any): { weighingSets: WeighingSet[], headerData: any } => {
    const headerData = state?.headerData || { client: "", plate: "", driver: "", city: "" };

    if (!state || !Array.isArray(state.weighingSets)) {
        return { weighingSets: [createNewWeighingSet()], headerData };
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
            tare: item.tare || "",
            net: typeof item.net === 'number' ? item.net : 0,
        }));
        return {
            id: set.id,
            items: sanitizedItems.length > 0 ? sanitizedItems : [createNewItem()],
            containerWeight: set.containerWeight || "",
            subTotalNet: typeof set.subTotalNet === 'number' ? set.subTotalNet : 0,
            totalNet: typeof set.totalNet === 'number' ? set.totalNet : 0,
        };
    });

    return {
        weighingSets: sanitizedSets.length > 0 ? sanitizedSets : [createNewWeighingSet()],
        headerData,
    };
};


export function ScaleCalculator() {
  const { toast } = useToast();
  const [weighingSets, setWeighingSets] = React.useState<WeighingSet[]>([createNewWeighingSet()]);
  const [headerData, setHeaderData] = React.useState({
      client: "",
      plate: "",
      driver: "",
      city: "",
  });
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
    try {
      const savedStateJSON = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedStateJSON) {
        const savedState = JSON.parse(savedStateJSON);
        const sanitized = sanitizeState(savedState);
        setWeighingSets(sanitized.weighingSets);
        setHeaderData(sanitized.headerData);
      }
    } catch (error) {
      console.error("Failed to load from localStorage", error);
      setWeighingSets([createNewWeighingSet()]);
    }
  }, []);
  
  const saveData = () => {
    if (isClient) {
      try {
        const stateToSave = { weighingSets, headerData };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
        toast({ title: "Pesagem Salva!", description: "Os dados da pesagem foram salvos localmente." });
      } catch (error) {
        console.error("Failed to save to localStorage", error);
        toast({ title: "Erro ao Salvar", description: "Não foi possível salvar os dados.", variant: "destructive" });
      }
    }
  }

  React.useEffect(() => {
    // This effect can be removed if we only save on button click
    // saveData(); 
  }, [weighingSets, headerData, isClient]);


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
  
  const handleContainerWeightChange = (setId: string, value: string) => {
     const sanitizedValue = value.replace(/[^0-9,.]/g, "").replace(".", ",");
     if (!/^\d*\,?\d*$/.test(sanitizedValue)) return;
     
     setWeighingSets(prev =>
        prev.map(set => 
            set.id === setId ? { ...set, containerWeight: sanitizedValue } : set
        )
     );
  }

  React.useEffect(() => {
    setWeighingSets(prev =>
      prev.map(set => {
        const newItems = set.items.map(item => {
          const gross = parseFloat(item.gross.replace(',', '.')) || 0;
          const waste = parseFloat(item.waste.replace(',', '.')) || 0;
          const tare = parseFloat(item.tare.replace(',', '.')) || 0;
          const net = gross - waste - tare;
          return { ...item, net: net > 0 ? net : 0 };
        });

        const subTotalNet = newItems.reduce((acc, item) => acc + item.net, 0);
        const containerDiscount = parseFloat(set.containerWeight.replace(',', '.')) || 0;
        const totalNet = subTotalNet - containerDiscount;

        return { ...set, items: newItems, subTotalNet, totalNet };
      })
    );
  }, [weighingSets.map(s => `${s.containerWeight},` + s.items.map(i => `${i.gross}${i.waste}${i.tare}`).join()).join()]);


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
    setHeaderData({ client: "", plate: "", driver: "", city: "" });
    toast({ title: "Tudo limpo!", description: "Você pode iniciar uma nova pesagem." });
  };

   const handleHeaderChange = (field: keyof typeof headerData, value: string) => {
      setHeaderData(prev => ({...prev, [field]: value}));
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
        <div className="mb-2 print:mb-2" id="scale-calculator-header">
            <h1 className="text-3xl font-bold text-center mb-2 print:text-2xl">Balança</h1>
            <Card className="p-2 print:border-none print:shadow-none print:p-0">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div className="space-y-1">
                        <Label htmlFor="client" className="text-xs">Cliente</Label>
                        <Input id="client" value={headerData.client} onChange={e => handleHeaderChange('client', e.target.value)} placeholder="Nome do Cliente" className="h-8"/>
                        <span className="hidden print:block print:text-black">{headerData.client}</span>
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="plate" className="text-xs">Placa</Label>
                        <Input id="plate" value={headerData.plate} onChange={e => handleHeaderChange('plate', e.target.value)} placeholder="Placa do Veículo" className="h-8"/>
                         <span className="hidden print:block print:text-black">{headerData.plate}</span>
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="driver" className="text-xs">Motorista</Label>
                        <Input id="driver" value={headerData.driver} onChange={e => handleHeaderChange('driver', e.target.value)} placeholder="Nome do Motorista" className="h-8"/>
                         <span className="hidden print:block print:text-black">{headerData.driver}</span>
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="city" className="text-xs">Cidade</Label>
                        <Input id="city" value={headerData.city} onChange={e => handleHeaderChange('city', e.target.value)} placeholder="Cidade/UF" className="h-8"/>
                         <span className="hidden print:block print:text-black">{headerData.city}</span>
                    </div>
                </div>
            </Card>
        </div>

        {weighingSets.map((set, setIndex) => (
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
                                    <TableHead className="min-w-[100px] p-1">Tara (kg)</TableHead>
                                    <TableHead className="min-w-[110px] p-1 font-bold text-accent-price text-center">Líquido (kg)</TableHead>
                                    <TableHead className="w-[40px] p-1 print:hidden"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {set.items.map((item, itemIndex) => {
                                    const isGrossDisabled = itemIndex > 0 && set.items[itemIndex - 1]?.tare !== "";
                                    
                                    return (
                                    <TableRow key={item.id}>
                                        <TableCell className="p-1"><Input value={item.name} onChange={e => handleItemChange(set.id, item.id, 'name', e.target.value)} placeholder="Nome" className="h-8"/></TableCell>
                                        <TableCell className="p-1"><Input value={item.gross} onChange={e => handleItemChange(set.id, item.id, 'gross', e.target.value)} placeholder="0,00" className="h-8" disabled={isGrossDisabled} /></TableCell>
                                        <TableCell className="p-1"><Input value={item.waste} onChange={e => handleItemChange(set.id, item.id, 'waste', e.target.value)} placeholder="0,00" className="h-8"/></TableCell>
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
                    <div className="p-2 space-y-2">
                        <Button variant="outline" size="sm" onClick={() => addItem(set.id)} className="print:hidden">
                            <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Material
                        </Button>
                        <Separator className="my-2"/>
                        <div className="flex justify-end items-end gap-2">
                             <div className="space-y-1">
                                <span className="font-semibold text-sm">Subtotal Materiais:</span>
                                <div className="font-bold text-lg text-primary text-right">{formatNumber(set.subTotalNet)} kg</div>
                            </div>
                            <div className="space-y-1 w-40">
                                <Label htmlFor={`container-weight-${set.id}`} className="text-xs">Desconto Caçamba (kg)</Label>
                                <Input 
                                    id={`container-weight-${set.id}`}
                                    value={set.containerWeight}
                                    onChange={(e) => handleContainerWeightChange(set.id, e.target.value)}
                                    placeholder="0,00" 
                                    className="h-9"
                                />
                            </div>
                            <div className="space-y-1">
                                <span className="font-semibold">Total Líquido:</span>
                                <div className="font-bold text-xl text-primary text-right">{formatNumber(set.totalNet)} kg</div>
                            </div>
                        </div>
                    </div>
                 </CardContent>
            </Card>
        ))}
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

        <div className="flex justify-end pt-2 gap-1 print:hidden">
            <TooltipProvider>
                <AlertDialog>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <AlertDialogTrigger asChild>
                                <Button variant="outline" size="icon">
                                    <Sparkles />
                                </Button>
                            </AlertDialogTrigger>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Limpar Tudo</p>
                        </TooltipContent>
                    </Tooltip>
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

                <Tooltip>
                    <TooltipTrigger asChild>
                         <Button variant="outline" size="icon" onClick={saveData}>
                            <Save />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Salvar Pesagem</p>
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" onClick={() => window.print()}>
                            <Printer />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Imprimir</p>
                    </TooltipContent>
                </Tooltip>
             </TooltipProvider>
        </div>
    </div>
  );
}
