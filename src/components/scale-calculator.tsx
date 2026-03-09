
"use client";

import React, { useState, useEffect, useCallback, useImperativeHandle, forwardRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHeader, TableRow, TableHead } from "./ui/table";
import { PlusCircle, Tractor, ArrowDownToLine, ArrowUpFromLine, Trash2, Save, Printer, Weight, Keyboard } from "lucide-react";
import { scrapItems } from "@/lib/data/sucata";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "./ui/command";
import { ScrollArea } from "./ui/scroll-area";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "./ui/tooltip";
import { cn } from "@/lib/utils";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
// import { FirebaseApp, initializeApp } from "firebase/app";
// import { Firestore, getFirestore, collection, query, orderBy, limit, getDocs } from "firebase/firestore";
// import { getFirebaseConfig } from "@/lib/firebase-config";
// import { Loader } from "lucide-react";


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
  name: string;
  items: WeighingItem[];
  descontoCacamba: number;
};

type OperationType = 'loading' | 'unloading';
type WeighingMode = 'manual' | 'electronic';


const initialItem: WeighingItem = { id: '', material: '', bruto: 0, tara: 0, descontos: 0, liquido: 0 };
const initialWeighingSet: WeighingSet = { id: uuidv4(), name: "CAÇAMBA 1", items: [], descontoCacamba: 0 };


function FirebaseProvider({ children }: { children: React.ReactNode }) {
    // The Firebase functionality is temporarily disabled.
    return (
        <FirestoreContext.Provider value={null}>
            {children}
        </FirestoreContext.Provider>
    );
}

const FirestoreContext = React.createContext<any | null>(null);
const useFirestore = () => React.useContext(FirestoreContext);


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
  const [weighingMode, setWeighingMode] = useState<WeighingMode>('manual');

  const firestore = useFirestore();

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

  useEffect(() => {
    const initialWeightValue = parseFloat(headerData.initialWeight) || 0;
    
    if (initialWeightValue > 0 && weighingSets.length > 0 && weighingSets[0].items.length === 0) {
       const newItem: WeighingItem = {
            id: uuidv4(),
            material: "SUCATA INOX",
            bruto: operationType === 'loading' ? 0 : initialWeightValue,
            tara: operationType === 'unloading' ? 0 : initialWeightValue,
            descontos: 0,
            liquido: 0
       };

        if (operationType === 'loading') {
            newItem.tara = initialWeightValue;
        } else { // unloading
            newItem.bruto = initialWeightValue;
        }
       
       newItem.liquido = newItem.bruto - newItem.tara - newItem.descontos;
       
       setWeighingSets(prev => {
           const newSets = [...prev];
           newSets[0] = { ...newSets[0], items: [newItem] };
           return newSets;
       });

    } else if (initialWeightValue > 0 && weighingSets.length > 0 && weighingSets[0].items.length > 0) {
      setWeighingSets(prevSets => {
        const newSets = [...prevSets];
        const firstSet = { ...newSets[0] };
        
        const firstItem = { ...firstSet.items[0] };
        let needsUpdate = false;
        if (operationType === 'loading' && firstItem.tara !== initialWeightValue) {
          firstItem.tara = initialWeightValue;
          needsUpdate = true;
        } else if (operationType === 'unloading' && firstItem.bruto !== initialWeightValue) {
          firstItem.bruto = initialWeightValue;
          needsUpdate = true;
        }

        if (needsUpdate) {
            firstItem.liquido = firstItem.bruto - firstItem.tara - firstItem.descontos;
            
            firstSet.items = [firstItem, ...firstSet.items.slice(1)];
            newSets[0] = firstSet;
            
            return newSets;
        }
        
        return prevSets;
      });
    }
  }, [headerData.initialWeight, operationType]);


  const handleInputChange = (setId: string, itemId: string, field: keyof WeighingItem, value: string) => {
    const numValue = parseInt(value.replace(/\D/g, ''), 10) || 0;
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

  const fetchLatestWeightAndApply = async (callback: (weight: number) => void) => {
    if (!firestore) {
      toast({ variant: 'destructive', title: 'Erro de Conexão', description: 'Não foi possível conectar ao Firestore.' });
      return;
    }
    try {
    //   const pesagensRef = collection(firestore, 'pesagens');
    //   const q = query(pesagensRef, orderBy('timestamp', 'desc'), limit(1));
    //   const querySnapshot = await getDocs(q);

    //   if (querySnapshot.empty) {
    //     toast({ variant: 'destructive', title: 'Sem Dados', description: 'Nenhuma pesagem encontrada na balança eletrônica.' });
    //   } else {
    //     const latestDoc = querySnapshot.docs[0];
    //     const pesoString = latestDoc.data().peso;
    //     const pesoNumerico = parseFloat(pesoString.replace(',', '.')) || 0;
        
    //     callback(pesoNumerico);
    //     toast({ title: 'Peso Capturado!', description: `Peso de ${pesoNumerico} kg recebido da balança.` });
    //   }
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Erro ao Buscar Peso', description: 'Falha ao comunicar com o Firestore.' });
    }
  };

  const fetchInitialWeight = () => {
    fetchLatestWeightAndApply((weight) => {
        setHeaderData(prev => ({...prev, initialWeight: String(Math.round(weight))}));
    });
  };

  const fetchItemWeight = (setId: string, itemId: string, field: keyof WeighingItem) => {
    fetchLatestWeightAndApply((weight) => {
        handleInputChange(setId, itemId, field, String(Math.round(weight)));
    });
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
     const numValue = parseInt(value.replace(/\D/g, ''), 10) || 0;
     setWeighingSets(prev => prev.map(set => set.id === setId ? {...set, descontoCacamba: numValue} : set));
  };
  
 const addNewMaterial = (setId: string) => {
    setWeighingSets(prevSets =>
      prevSets.map(set => {
        if (set.id === setId) {
          const lastItem = set.items.length > 0 ? set.items[set.items.length - 1] : null;
          let newBruto = 0;
          let newTara = 0;
  
          if (operationType === 'loading') {
            newBruto = lastItem ? lastItem.tara : 0; 
          } else { // unloading
            newTara = lastItem ? lastItem.bruto : 0;
          }
           
          const newItem: WeighingItem = {
            id: uuidv4(),
            material: "SUCATA INOX",
            bruto: newBruto,
            tara: newTara,
            descontos: 0,
            liquido: newBruto - newTara,
          };
          return { ...set, items: [...set.items, newItem] };
        }
        return set;
      })
    );
  };
  
  const addBitrem = () => {
    if (weighingSets.length >= 2) return;

    const firstSet = weighingSets[0];
    const firstItemOfFirstSet = firstSet.items[0];

    if (!firstItemOfFirstSet) {
        toast({
            variant: "destructive",
            title: "Primeira caçamba vazia",
            description: "Adicione e pese pelo menos um material na Caçamba 1 antes de adicionar o bitrem.",
        });
        return;
    }

    const truckTara = operationType === 'loading' ? firstItemOfFirstSet.tara : firstItemOfFirstSet.bruto;

    const newSet: WeighingSet = {
        id: uuidv4(),
        name: "BITREM / CAÇAMBA 2",
        items: [{
            id: uuidv4(),
            material: "SUCATA INOX",
            bruto: operationType === 'loading' ? 0 : truckTara,
            tara: operationType === 'unloading' ? 0 : truckTara,
            descontos: 0,
            liquido: 0,
        }],
        descontoCacamba: 0
    };
    newSet.items[0].liquido = newSet.items[0].bruto - newSet.items[0].tara;

    setWeighingSets(prev => [...prev, newSet]);
    setActiveSetId(newSet.id);
  };

  const handleClear = () => {
    const newWeighingSet: WeighingSet = { id: uuidv4(), name: "CAÇAMBA 1", items: [], descontoCacamba: 0 };
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
        localStorage.setItem("scaleData", JSON.stringify({ weighingSets, headerData, operationType }));
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
    if (isNaN(num) || num === 0) return "";
    return new Intl.NumberFormat('pt-BR', {useGrouping: false}).format(num);
  }
  
  const grandTotalLiquido = weighingSets.reduce((total, set) => {
    const setItemsTotal = set.items.reduce((acc, item) => acc + item.liquido, 0);
    return total + (setItemsTotal - set.descontoCacamba);
  }, 0);

  const WeightInput = ({value, onChange, disabled, onFetch, showFetchButton}: {value: number, onChange: (val: string) => void, disabled: boolean, onFetch?: () => void, showFetchButton: boolean}) => {
    if (showFetchButton && !disabled) {
      return <Button variant="outline" className="h-8 w-full print:hidden" onClick={onFetch}><Weight className="mr-2 h-4 w-4"/> Buscar Peso</Button>
    }
    return <Input type="text" placeholder="0" value={formatNumber(value)} onChange={(e) => onChange(e.target.value)} className="text-right h-8 print:hidden w-full" disabled={disabled} />
  }

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
                         <WeightInput
                            value={parseFloat(headerData.initialWeight)}
                            onChange={v => handleHeaderChange('initialWeight', v)}
                            disabled={false}
                            onFetch={fetchInitialWeight}
                            showFetchButton={weighingMode === 'electronic'}
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
         const totalLiquidoSet = subtotalLiquido - set.descontoCacamba;

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
                      const isBrutoEditable = operationType === 'loading' && itemIndex > 0;
                      const isTaraEditable = operationType === 'unloading' && itemIndex > 0;
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
                                  <WeightInput value={item.bruto} onChange={v => handleInputChange(set.id, item.id, 'bruto', v)} disabled={!isBrutoEditable} onFetch={() => fetchItemWeight(set.id, item.id, 'bruto')} showFetchButton={weighingMode === 'electronic'} />
                                   <span className="hidden print:block text-right">{formatNumber(item.bruto)}</span>
                              </div>
                               <div className="space-y-px">
                                  <Label className="text-xs text-muted-foreground">Tara (kg)</Label>
                                  <WeightInput value={item.tara} onChange={v => handleInputChange(set.id, item.id, 'tara', v)} disabled={!isTaraEditable} onFetch={() => fetchItemWeight(set.id, item.id, 'tara')} showFetchButton={weighingMode === 'electronic'} />
                                   <span className="hidden print:block text-right">{formatNumber(item.tara)}</span>
                              </div>
                               <div className="space-y-px">
                                  <Label className="text-xs text-muted-foreground">A/L (kg)</Label>
                                  <Input type="text" placeholder="0" value={formatNumber(item.descontos)} onChange={(e) => handleInputChange(set.id, item.id, 'descontos', e.target.value)} className="text-right h-8 print:hidden w-full" />
                                   <span className="hidden print:block text-right">{formatNumber(item.descontos)}</span>
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
                      const isBrutoEditable = operationType === 'loading' && itemIndex > 0;
                      const isTaraEditable = operationType === 'unloading' && itemIndex > 0;
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
                                <WeightInput value={item.bruto} onChange={v => handleInputChange(set.id, item.id, 'bruto', v)} disabled={!isBrutoEditable} onFetch={() => fetchItemWeight(set.id, item.id, 'bruto')} showFetchButton={weighingMode === 'electronic'} />
                            </div>
                            <span className="hidden print:block text-right">{formatNumber(item.bruto)}</span>
                      </TableCell>
                      <TableCell className="w-[17.5%] p-0 sm:p-px">
                            <div className="flex justify-end">
                                <WeightInput value={item.tara} onChange={v => handleInputChange(set.id, item.id, 'tara', v)} disabled={!isTaraEditable} onFetch={() => fetchItemWeight(set.id, item.id, 'tara')} showFetchButton={weighingMode === 'electronic'} />
                            </div>
                            <span className="hidden print:block text-right">{formatNumber(item.tara)}</span>
                      </TableCell>
                      <TableCell className="w-[17.5%] p-0 sm:p-px">
                            <div className="flex justify-end">
                                <Input
                                type="text"
                                placeholder="0"
                                value={formatNumber(item.descontos)}
                                onChange={(e) => handleInputChange(set.id, item.id, 'descontos', e.target.value)}
                                className="text-right h-8 print:hidden w-24"
                                />
                            </div>
                            <span className="hidden print:block text-right">{formatNumber(item.descontos)}</span>
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
                             placeholder="0"
                             value={formatNumber(set.descontoCacamba)}
                             onChange={(e) => handleCacambaDiscount(set.id, e.target.value)}
                             className="h-8 text-right print:hidden flex-1 min-w-[90px] w-14"
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
        <div className="flex justify-center my-px print:hidden">
          <Button variant="secondary" onClick={addBitrem} size="sm" className="h-8 px-2"><Tractor className="mr-2 h-4 w-4" /> + Bitrem / Caçamba 2</Button>
        </div>
      )}

      <Card className="mt-px bg-primary/10 border-primary/20 print:border print:border-accent-price print:shadow-none print:p-0.5">
         <CardContent className="p-px flex justify-end items-center">
             <div className="text-right">
                <p className="text-lg font-semibold text-primary print:text-2xl print:mb-0.5">Peso Líquido Total</p>
                <p className="text-4xl font-bold text-primary print:text-black">{new Intl.NumberFormat('pt-BR').format(grandTotalLiquido)} kg</p>
            </div>
         </CardContent>
      </Card>
      <div className="flex items-center gap-1 justify-center pt-1 print:hidden">
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
    <FirebaseProvider>
        <ScaleCalculatorComponent {...props} ref={ref} />
    </FirebaseProvider>
));

ScaleCalculator.displayName = 'ScaleCalculator';

export default ScaleCalculator;
