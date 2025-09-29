
"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "./ui/button";
import { PlusCircle, Trash2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { Separator } from "./ui/separator";

interface MaterialBox {
  id: string;
  name: string;
  tare: string;
  discount: string;
  container: string;
  net: number;
}

interface WeighingSet {
  id: string;
  gross: string;
  boxes: MaterialBox[];
  totalNet: number;
}

export function ScaleCalculator() {
  const [customerName, setCustomerName] = React.useState("");
  const [weighingSets, setWeighingSets] = React.useState<WeighingSet[]>([
    {
      id: uuidv4(),
      gross: "",
      boxes: [{ id: uuidv4(), name: "Material 1", tare: "", discount: "", container: "", net: 0 }],
      totalNet: 0,
    },
  ]);

  const handleInputChange = (
    value: string,
    setId: string,
    field: keyof Omit<WeighingSet, "boxes" | "totalNet" | "id">,
    boxId?: string
  ) => {
    const sanitizedValue = value.replace(/[^0-9,]/g, "").replace(",", ".");
    if (/^\d*\.?\d*$/.test(sanitizedValue)) {
      const newValue = sanitizedValue.replace(".", ",");
      setWeighingSets((prevSets) =>
        prevSets.map((set) => {
          if (set.id !== setId) return set;
          if (boxId) {
            const updatedBoxes = set.boxes.map((box) =>
              box.id === boxId ? { ...box, [field]: newValue } : box
            );
            return { ...set, boxes: updatedBoxes };
          }
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


  React.useEffect(() => {
    setWeighingSets((prevSets) =>
      prevSets.map((set) => {
        const gross = parseFloat(set.gross.replace(",", ".")) || 0;
        const updatedBoxes = set.boxes.map((box) => {
          const tare = parseFloat(box.tare.replace(",", ".")) || 0;
          const discount = parseFloat(box.discount.replace(",", ".")) || 0;
          const container = parseFloat(box.container.replace(",", ".")) || 0;
          const net = gross - tare - discount - container;
          return { ...box, net };
        });
        const totalNet = updatedBoxes.reduce((acc, box) => acc + box.net, 0);
        return { ...set, boxes: updatedBoxes, totalNet };
      })
    );
  }, [weighingSets.map(s => s.gross).join(), weighingSets.flatMap(s => s.boxes.map(b => `${b.tare}${b.discount}${b.container}`)).join()]);


  const addMaterialBox = (setId: string) => {
    setWeighingSets((prevSets) =>
      prevSets.map((set) =>
        set.id === setId
          ? {
              ...set,
              boxes: [
                ...set.boxes,
                { id: uuidv4(), name: `Material ${set.boxes.length + 1}`, tare: "", discount: "", container: "", net: 0 },
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
        // If the last box is removed, add a new empty one to prevent an empty state
        if (updatedBoxes.length === 0) {
          return { ...set, boxes: [{ id: uuidv4(), name: "Material 1", tare: "", discount: "", container: "", net: 0 }] };
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
        gross: "",
        boxes: [{ id: uuidv4(), name: "Material 1", tare: "", discount: "", container: "", net: 0 }],
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
              gross: "",
              boxes: [{ id: uuidv4(), name: "Material 1", tare: "", discount: "", container: "", net: 0 }],
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

  return (
    <Card className="border-0 shadow-none bg-transparent">
      <CardHeader>
        <CardTitle>Balança</CardTitle>
        <CardDescription>
          Insira os dados de pesagem para calcular o peso líquido.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="customer-name">Nome do Cliente</Label>
          <Input
            id="customer-name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Digite o nome do cliente"
          />
        </div>

        {weighingSets.map((set, setIndex) => (
          <Card key={set.id} className="bg-card/50 pt-4">
            <CardHeader className="flex-row items-center justify-between pt-0 pb-4">
                <div className="space-y-1.5">
                    <CardTitle className="text-xl">Conjunto de Pesagem {setIndex + 1}</CardTitle>
                    <CardDescription>
                        {setIndex > 0 ? "Para o segundo caminhão/caixa (bitrem)." : "Para o primeiro caminhão/caixa."}
                    </CardDescription>
                </div>
              {weighingSets.length > 1 && (
                <Button variant="ghost" size="icon" onClick={() => removeWeighingSet(set.id)}>
                  <Trash2 className="text-destructive"/>
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 col-span-2 md:col-span-1">
                        <Label htmlFor={`gross-${set.id}`}>Bruto (kg)</Label>
                        <Input
                            id={`gross-${set.id}`}
                            value={set.gross}
                            onChange={(e) => handleInputChange(e.target.value, set.id, "gross")}
                            placeholder="Peso inicial"
                        />
                    </div>
                </div>

              {set.boxes.map((box) => (
                <div key={box.id} className="space-y-4 rounded-lg border bg-background p-4 relative">
                  <div className="flex items-center justify-between">
                    <Input 
                      value={box.name}
                      onChange={(e) => handleBoxInputChange(e.target.value, set.id, box.id, 'name')}
                      className="text-base font-semibold border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto bg-transparent w-full"
                    />
                    {set.boxes.length > 1 && (
                      <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => removeMaterialBox(set.id, box.id)}>
                          <Trash2 className="text-destructive h-4 w-4"/>
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor={`tare-${box.id}`}>Tara (kg)</Label>
                          <Input
                            id={`tare-${box.id}`}
                            value={box.tare}
                            onChange={(e) => handleBoxInputChange(e.target.value, set.id, box.id, 'tare')}
                            placeholder="Peso descarregado"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`discount-${box.id}`}>Desconto (kg)</Label>
                          <Input
                            id={`discount-${box.id}`}
                            value={box.discount}
                            onChange={(e) => handleBoxInputChange(e.target.value, set.id, box.id, 'discount')}
                            placeholder="Lixo, outros"
                          />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor={`container-${box.id}`}>Caçamba (kg)</Label>
                          <Input
                            id={`container-${box.id}`}
                            value={box.container}
                            onChange={(e) => handleBoxInputChange(e.target.value, set.id, box.id, 'container')}
                            placeholder="Peso da caçamba"
                          />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-accent-price font-semibold">Peso Líquido</Label>
                            <div className="w-full rounded-md border border-accent-price/50 bg-accent-price/10 px-3 py-2 text-base md:text-sm font-bold text-accent-price h-10 flex items-center">
                                {formatNumber(box.net)} kg
                            </div>
                        </div>
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => addMaterialBox(set.id)} className="gap-2">
                <PlusCircle />
                Adicionar Material
              </Button>
            </CardContent>
          </Card>
        ))}

        <div className="flex flex-col gap-4">
            <Button variant="secondary" onClick={addWeighingSet} className="gap-2">
                <PlusCircle />
                Adicionar Conjunto de Pesagem (Bitrem)
            </Button>

            <Separator />

            <div className="flex justify-end items-center gap-4 pt-4">
                <h3 className="text-lg font-semibold">Total Geral Líquido:</h3>
                <div className="text-2xl font-bold text-primary min-w-[150px] text-right">
                    {formatNumber(grandTotalNet)} kg
                </div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}

    