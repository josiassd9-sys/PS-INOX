
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
import { PlusCircle, Trash2, Printer, Save, Download } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { Separator } from "./ui/separator";
import { useToast } from "@/hooks/use-toast";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { cn } from "@/lib/utils";

interface MaterialBox {
  id: string;
  name: string;
  weight: string; // Can be tare or gross depending on mode
  discount: string;
  container: string;
  net: number;
}

interface WeighingSet {
  id: string;
  driverName: string;
  plate: string;
  initialWeight: string; // Gross for unloading, Tare for loading
  boxes: MaterialBox[];
  totalNet: number;
}

type WeighingMode = "unloading" | "loading";

const LOCAL_STORAGE_KEY = "scaleCalculatorState";

const sanitizeWeighingSets = (sets: any): WeighingSet[] => {
  if (!Array.isArray(sets)) return [];
  return sets.map(set => ({
    id: set.id || uuidv4(),
    driverName: set.driverName || "",
    plate: set.plate || "",
    initialWeight: set.initialWeight || "",
    totalNet: set.totalNet || 0,
    boxes: Array.isArray(set.boxes) ? set.boxes.map((box: any) => ({
      id: box.id || uuidv4(),
      name: box.name || "",
      weight: box.weight || "",
      discount: box.discount || "",
      container: box.container || "",
      net: box.net || 0,
    })) : [],
  }));
};


export function ScaleCalculator() {
  const { toast } = useToast();
  const [customerName, setCustomerName] = React.useState("");
  const [weighingMode, setWeighingMode] = React.useState<WeighingMode>("unloading");
  const [weighingSets, setWeighingSets] = React.useState<WeighingSet[]>([
    {
      id: uuidv4(),
      driverName: "",
      plate: "",
      initialWeight: "",
      boxes: [{ id: uuidv4(), name: "Material 1", weight: "", discount: "", container: "", net: 0 }],
      totalNet: 0,
    },
  ]);

  const saveStateToLocalStorage = () => {
    try {
      const stateToSave = {
        customerName,
        weighingSets,
        weighingMode,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
      toast({
        title: "Progresso Salvo!",
        description: "Sua pesagem foi salva localmente no seu dispositivo.",
      });
    } catch (error) {
      console.error("Failed to save state to localStorage", error);
      toast({
        variant: "destructive",
        title: "Erro ao Salvar",
        description: "Não foi possível salvar os dados. O armazenamento local pode estar cheio ou indisponível.",
      });
    }
  };

  const loadStateFromLocalStorage = () => {
    try {
      const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        
        if (parsedState && typeof parsedState === 'object') {
            const { customerName, weighingSets, weighingMode } = parsedState;
            setCustomerName(customerName || "");
            
            const sanitizedSets = sanitizeWeighingSets(weighingSets);

            if (sanitizedSets.length > 0) {
              setWeighingSets(sanitizedSets);
            } else {
               setWeighingSets([
                {
                  id: uuidv4(),
                  driverName: "",
                  plate: "",
                  initialWeight: "",
                  boxes: [{ id: uuidv4(), name: "Material 1", weight: "", discount: "", container: "", net: 0 }],
                  totalNet: 0,
                },
              ]);
            }
            setWeighingMode(weighingMode || "unloading");
            toast({
                title: "Dados Carregados",
                description: "A última pesagem salva foi carregada.",
            });
        } else {
             throw new Error("Invalid data format in localStorage");
        }

      } else {
        toast({
            variant: "default",
            title: "Nenhum dado salvo",
            description: "Não há nenhuma pesagem salva para carregar.",
        });
      }
    } catch (error) {
      console.error("Failed to load state from localStorage", error);
       toast({
        variant: "destructive",
        title: "Erro ao Carregar",
        description: "Não foi possível carregar os dados salvos. O formato pode ser inválido.",
      });
      // Reset to a clean state if loading fails
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setCustomerName("");
      setWeighingSets([
        {
          id: uuidv4(),
          driverName: "",
          plate: "",
          initialWeight: "",
          boxes: [{ id: uuidv4(), name: "Material 1", weight: "", discount: "", container: "", net: 0 }],
          totalNet: 0,
        },
      ]);
      setWeighingMode("unloading");
    }
  };
  
  React.useEffect(() => {
    try {
      const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedState) {
        const parsedState = JSON.parse(savedState);
         if (parsedState && typeof parsedState === 'object') {
            const { customerName, weighingSets, weighingMode } = parsedState;
            if(customerName) setCustomerName(customerName);
            const sanitizedSets = sanitizeWeighingSets(weighingSets);
            if (sanitizedSets.length > 0) {
              setWeighingSets(sanitizedSets);
            }
            if(weighingMode) setWeighingMode(weighingMode);
        }
      }
    } catch (error) {
       console.error("Failed to auto-load state from localStorage", error);
       localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }, []);


  const handleSetTextChange = (
    value: string,
    setId: string,
    field: keyof Omit<WeighingSet, "boxes" | "totalNet" | "id" | "initialWeight">
  ) => {
    setWeighingSets((prevSets) =>
      prevSets.map((set) => {
        if (set.id !== setId) return set;
        return { ...set, [field]: value };
      })
    );
  };
  
  const handleInputChange = (
    value: string,
    setId: string,
    field: keyof Omit<WeighingSet, "boxes" | "totalNet" | "id" | "driverName" | "plate">,
  ) => {
    const sanitizedValue = value.replace(/[^0-9,]/g, "").replace(",", ".");
    if (/^\d*\.?\d*$/.test(sanitizedValue)) {
      const newValue = sanitizedValue.replace(".", ",");
      setWeighingSets((prevSets) =>
        prevSets.map((set) => {
          if (set.id !== setId) return set;
          return { ...set, [field]: newValue };
        })
      );
    }
  };
  
  const handleBoxInputChange = (value: string, setId: string, boxId: string, field: keyof Omit<MaterialBox, 'id' | 'net'>) => {
    if (field === 'name') {
      setWeighingSets(prevSets => prevSets.map(set => {
        if (set.id !== setId) return set;
        const updatedBoxes = set.boxes.map(box => 
          box.id === boxId ? { ...box, name: value } : box
        );
        return { ...set, boxes: updatedBoxes };
      }));
      return;
    }
    
    const sanitizedValue = value.replace(/[^0-9,]/g, "").replace(",", ".");
    if (/^\d*\.?\d*$/.test(sanitizedValue)) {
      const newValue = sanitizedValue.replace(".", ",");
      setWeighingSets(prevSets => prevSets.map(set => {
        if (set.id !== setId) return set;
        const updatedBoxes = set.boxes.map(box => 
          box.id === boxId ? { ...box, [field]: newValue } : box
        );
        return { ...set, boxes: updatedBoxes };
      }));
    }
  };

  const calculateWeighingSets = (sets: WeighingSet[], mode: WeighingMode): WeighingSet[] => {
    return sets.map((set) => {
      let cumulativeWeight = parseFloat((set.initialWeight || "0").replace(",", ".")) || 0;
      
      const updatedBoxes = set.boxes.map((box) => {
        const boxWeight = parseFloat((box.weight || "0").replace(",", ".")) || 0;
        const discount = parseFloat((box.discount || "0").replace(",", ".")) || 0;
        const container = parseFloat((box.container || "0").replace(",", ".")) || 0;
        
        let net = 0;
        if (mode === 'unloading') { // Descarregamento
          if (cumulativeWeight > 0 && boxWeight > 0) {
            net = cumulativeWeight - boxWeight - discount - container;
          }
          cumulativeWeight = boxWeight;
        } else { // Carregamento
          if (cumulativeWeight >= 0 && boxWeight > 0) {
            net = boxWeight - cumulativeWeight - discount - container;
          }
          cumulativeWeight = boxWeight;
        }

        return { ...box, net: net > 0 ? net : 0 };
      });

      const totalNet = updatedBoxes.reduce((acc, box) => acc + box.net, 0);
      return { ...set, boxes: updatedBoxes, totalNet };
    });
  };

  React.useEffect(() => {
    const newWeighingSets = calculateWeighingSets(weighingSets, weighingMode);
    // Deep comparison to avoid infinite loops
    if (JSON.stringify(newWeighingSets) !== JSON.stringify(weighingSets)) {
        setWeighingSets(newWeighingSets);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weighingSets, weighingMode]);


  const addMaterialBox = (setId: string) => {
    setWeighingSets((prevSets) =>
      prevSets.map((set) =>
        set.id === setId
          ? {
              ...set,
              boxes: [
                ...set.boxes,
                { id: uuidv4(), name: `Material ${set.boxes.length + 1}`, weight: "", discount: "", container: "", net: 0 },
              ],
            }
          : set
      )
    );
  };

  const removeMaterialBox = (setId: string, boxId: string) => {
    setWeighingSets((prevSets) =>
      prevSets.map((set) => {
        if (set.id !== setId) return set;
        const updatedBoxes = set.boxes.filter((box) => box.id !== boxId);
        if (updatedBoxes.length === 0) {
          return { ...set, boxes: [{ id: uuidv4(), name: "Material 1", weight: "", discount: "", container: "", net: 0 }] };
        }
        return { ...set, boxes: updatedBoxes };
      })
    );
  };

  const addWeighingSet = () => {
    setWeighingSets((prevSets) => [
      ...prevSets,
      {
        id: uuidv4(),
        driverName: "",
        plate: "",
        initialWeight: "",
        boxes: [{ id: uuidv4(), name: "Material 1", weight: "", discount: "", container: "", net: 0 }],
        totalNet: 0,
      },
    ]);
  };

  const removeWeighingSet = (setId: string) => {
    setWeighingSets(prevSets => {
        const updatedSets = prevSets.filter(set => set.id !== setId);
        if (updatedSets.length === 0) {
            return [{
              id: uuidv4(),
              driverName: "",
              plate: "",
              initialWeight: "",
              boxes: [{ id: uuidv4(), name: "Material 1", weight: "", discount: "", container: "", net: 0 }],
              totalNet: 0,
            }];
        }
        return updatedSets;
    });
  };

  const grandTotalNet = weighingSets.reduce((acc, set) => acc + set.totalNet, 0);

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };
  
  const handleModeChange = (mode: WeighingMode | "") => {
    if (mode) {
        setWeighingMode(mode);
    }
  }

  const initialWeightLabel = weighingMode === 'unloading' ? 'Bruto (Saída)' : 'Tara (Entrada)';
  const boxWeightLabel = weighingMode === 'unloading' ? 'Tara (kg)' : 'Bruto (kg)';


  return (
    <div id="scale-calculator-printable-area" className="space-y-1">
        <div className="space-y-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <div className="space-y-1 flex-1">
                <Label htmlFor="customer-name">Nome do Cliente</Label>
                <Input
                    id="customer-name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Digite o nome do cliente"
                />
                </div>
                <div className="space-y-1">
                    <Label>Modo de Pesagem</Label>
                    <ToggleGroup type="single" value={weighingMode} onValueChange={handleModeChange} className="w-full grid grid-cols-2">
                        <ToggleGroupItem value="unloading" aria-label="Descarregamento" className="h-10">Descarregamento</ToggleGroupItem>
                        <ToggleGroupItem value="loading" aria-label="Carregamento" className="h-10">Carregamento</ToggleGroupItem>
                    </ToggleGroup>
                </div>
            </div>
        </div>

        {weighingSets.map((set, setIndex) => (
          <Card key={set.id} className="bg-card/50 pt-1 print:shadow-none print:border-border">
            <CardHeader className="flex-row items-center justify-between p-1">
                <div className="space-y-1 flex-1">
                    <CardTitle className="text-lg">Pesagem {setIndex + 1}</CardTitle>
                </div>
              {weighingSets.length > 1 && (
                <Button variant="ghost" size="icon" onClick={() => removeWeighingSet(set.id)} className="print:hidden h-8 w-8">
                  <Trash2 className="text-destructive"/>
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-1 p-1 pt-0">
                <div className="grid grid-cols-3 gap-1">
                    <div className="space-y-1">
                        <Label htmlFor={`driver-name-${set.id}`} className="text-xs text-muted-foreground">Motorista</Label>
                        <Input
                            id={`driver-name-${set.id}`}
                            value={set.driverName}
                            onChange={(e) => handleSetTextChange(e.target.value, set.id, "driverName")}
                            placeholder="Nome"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor={`plate-${set.id}`} className="text-xs text-muted-foreground">Placa</Label>
                        <Input
                            id={`plate-${set.id}`}
                            value={set.plate}
                            onChange={(e) => handleSetTextChange(e.target.value, set.id, "plate")}
                            placeholder="Placa"
                        />
                    </div>
                     <div className="space-y-1">
                        <Label htmlFor={`initialWeight-${set.id}`} className="text-xs text-muted-foreground">{initialWeightLabel}</Label>
                        <Input
                            id={`initialWeight-${set.id}`}
                            type="text"
                            inputMode="decimal"
                            value={set.initialWeight}
                            onChange={(e) => handleInputChange(e.target.value, set.id, "initialWeight")}
                            placeholder="Peso inicial"
                        />
                    </div>
                </div>

              {set.boxes.map((box) => (
                <div key={box.id} className="space-y-1 rounded-lg border bg-background p-1 relative print:border-border">
                  <div className="flex items-center justify-between">
                    <Input 
                      value={box.name}
                      onChange={(e) => handleBoxInputChange(e.target.value, set.id, box.id, 'name')}
                      className="text-base font-semibold border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto bg-transparent w-full"
                    />
                    {set.boxes.length > 1 && (
                      <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0 print:hidden" onClick={() => removeMaterialBox(set.id, box.id)}>
                          <Trash2 className="text-destructive h-4 w-4"/>
                      </Button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1">
                      <div className="space-y-1 w-[calc(50%-0.25rem)]">
                        <Label htmlFor={`weight-${box.id}`} className="text-xs text-muted-foreground">{boxWeightLabel}</Label>
                        <Input
                          id={`weight-${box.id}`}
                          type="text"
                          inputMode="decimal"
                          value={box.weight}
                          onChange={(e) => handleBoxInputChange(e.target.value, set.id, box.id, 'weight')}
                          placeholder="Peso"
                        />
                      </div>
                      <div className="space-y-1 w-[calc(50%-0.25rem)]">
                        <Label htmlFor={`discount-${box.id}`} className="text-xs text-muted-foreground">Desconto (kg)</Label>
                        <Input
                          id={`discount-${box.id}`}
                          type="text"
                          inputMode="decimal"
                          value={box.discount}
                          onChange={(e) => handleBoxInputChange(e.target.value, set.id, box.id, 'discount')}
                          placeholder="Lixo, outros"
                        />
                      </div>
                      <div className="space-y-1 w-[calc(50%-0.25rem)]">
                        <Label htmlFor={`container-${box.id}`} className="text-xs text-muted-foreground">Caçamba (kg)</Label>
                        <Input
                          id={`container-${box.id}`}
                          type="text"
                          inputMode="decimal"
                          value={box.container}
                          onChange={(e) => handleBoxInputChange(e.target.value, set.id, box.id, 'container')}
                          placeholder="Peso"
                        />
                      </div>
                      <div className="space-y-1 w-[calc(50%-0.25rem)]">
                          <Label className="text-accent-price font-semibold text-xs">Peso Líquido</Label>
                          <div className="w-full rounded-md border border-accent-price/50 bg-accent-price/10 px-3 py-1 text-sm font-bold text-accent-price h-10 flex items-center print:bg-transparent print:border-accent-price">
                              {formatNumber(box.net)} kg
                          </div>
                      </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => addMaterialBox(set.id)} className="gap-1 print:hidden h-9">
                <PlusCircle className="h-4 w-4"/>
                Adicionar Material
              </Button>
            </CardContent>
          </Card>
        ))}

        <div className="flex flex-col gap-1 print:hidden">
            <Button variant="secondary" onClick={addWeighingSet} className="gap-1 h-9">
                <PlusCircle className="h-4 w-4" />
                Adicionar Pesagem (Bitrem)
            </Button>
        </div>

        <Separator />

        <div className="flex justify-end items-center gap-1 pt-1">
            <h3 className="text-lg font-semibold">Total Geral Líquido:</h3>
            <div className="text-2xl font-bold text-primary min-w-[150px] text-right">
                {formatNumber(grandTotalNet)} kg
            </div>
        </div>

        <div className="flex justify-end flex-wrap pt-1 gap-1 print:hidden">
            <Button onClick={saveStateToLocalStorage} className="gap-1" variant="outline">
                <Save />
                Salvar Progresso
            </Button>
             <Button onClick={loadStateFromLocalStorage} className="gap-1" variant="outline">
                <Download />
                Carregar Última Pesagem
            </Button>
            <Button onClick={() => window.print()} className="gap-1">
                <Printer />
                Imprimir / Salvar PDF
            </Button>
        </div>
    </div>
  );
}

    