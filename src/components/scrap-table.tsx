"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Category, ScrapItem } from "@/lib/data";
import { Button } from "./ui/button";
import { Eye, EyeOff } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Icon } from "./icons";

interface ScrapTableProps {
  category: Category;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
}

const LOCAL_STORAGE_HIDDEN_KEY = "scrapTableHiddenItems";

export function ScrapTable({ category, isDialogOpen, setIsDialogOpen }: ScrapTableProps) {
  const [allItems, setAllItems] = React.useState<ScrapItem[]>(category.items as ScrapItem[]);
  const [hiddenItemIds, setHiddenItemIds] = React.useState<Set<string>>(new Set());
  
  const [newMaterial, setNewMaterial] = React.useState("");
  const [newComposition, setNewComposition] = React.useState("");
  const [newPrice, setNewPrice] = React.useState<number | "">("");

  // Load hidden items from localStorage on initial render
  React.useEffect(() => {
    try {
      const savedHiddenIds = localStorage.getItem(LOCAL_STORAGE_HIDDEN_KEY);
      if (savedHiddenIds) {
        setHiddenItemIds(new Set(JSON.parse(savedHiddenIds)));
      }
    } catch (error) {
      console.error("Failed to load hidden items from localStorage", error);
    }
  }, []);

  // Update localStorage when hidden items change
  const updateHiddenItems = (newHiddenIds: Set<string>) => {
    setHiddenItemIds(newHiddenIds);
    try {
      localStorage.setItem(LOCAL_STORAGE_HIDDEN_KEY, JSON.stringify(Array.from(newHiddenIds)));
    } catch (error) {
      console.error("Failed to save hidden items to localStorage", error);
    }
  };

  const toggleItemVisibility = (id: string) => {
    const newHiddenIds = new Set(hiddenItemIds);
    if (newHiddenIds.has(id)) {
      newHiddenIds.delete(id);
    } else {
      newHiddenIds.add(id);
    }
    updateHiddenItems(newHiddenIds);
  };
  
  const showAllItems = () => {
    updateHiddenItems(new Set());
  }

  React.useEffect(() => {
    setAllItems(category.items as ScrapItem[]);
  }, [category]);

  const handleAddItem = () => {
    if (newMaterial && newPrice !== "") {
      const newItem: ScrapItem = {
        id: `custom-scrap-${Date.now()}`,
        material: newMaterial,
        composition: newComposition,
        price: Number(newPrice),
      };
      setAllItems([...allItems, newItem]);
      setNewMaterial("");
      setNewComposition("");
      setNewPrice("");
      setIsDialogOpen(false);
    }
  };

  const handlePriceChange = (id: string, newPriceValue: string) => {
    const sanitizedValue = newPriceValue.replace(/[^0-9,.]/g, '').replace(',', '.');
    const priceAsNumber = parseFloat(sanitizedValue);
    
    setAllItems(prevItems => prevItems.map(item => {
        if (item.id === id) {
            return { ...item, price: isNaN(priceAsNumber) ? item.price : priceAsNumber };
        }
        return item;
    }));
  }

  const visibleItems = allItems.filter(item => !hiddenItemIds.has(item.id));
  const hasHiddenItems = hiddenItemIds.size > 0;

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div>
          {hasHiddenItems && (
            <Button size="sm" className="h-8 gap-1" variant="outline" onClick={showAllItems}>
              <Eye className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Mostrar Todos
              </span>
            </Button>
          )}
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>Adicionar Novo Item em {category.name}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="material" className="text-right">
                    Material
                    </Label>
                    <Input
                    id="material"
                    value={newMaterial}
                    onChange={(e) => setNewMaterial(e.target.value)}
                    className="col-span-3"
                    placeholder="Ex: Inox 304"
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="composition" className="text-right">
                    Composição
                    </Label>
                    <Input
                    id="composition"
                    value={newComposition}
                    onChange={(e) => setNewComposition(e.target.value)}
                    className="col-span-3"
                    placeholder="Ex: 18% Cr, 8% Ni"
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="price" className="text-right">
                    Preço (R$/kg)
                    </Label>
                    <Input
                    id="price"
                    type="number"
                    value={newPrice}
                    onChange={(e) =>
                        setNewPrice(
                        e.target.value === "" ? "" : e.target.valueAsNumber
                        )
                    }
                    className="col-span-3"
                    placeholder="Ex: 8.50"
                    />
                </div>
                </div>
                <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline">Cancelar</Button>
                </DialogClose>
                <Button onClick={handleAddItem}>Adicionar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      </div>
      <div className="-mx-6 -mt-4 border-t">
        <Table>
          <TableHeader>
             <TableRow className="bg-primary/5 hover:bg-primary/10 flex">
                <TableHead className="flex-1 px-8">Material (Composição)</TableHead>
                <TableHead className="w-1/3 text-right font-semibold text-primary px-8">
                  Preço (R$/kg)
                </TableHead>
                 <TableHead className="w-12 px-2"></TableHead>
              </TableRow>
          </TableHeader>
          <TableBody>
            {visibleItems.map((item) => (
              <TableRow key={item.id} className="even:bg-primary/5 odd:bg-transparent flex items-center">
                <TableCell className="flex-1 px-8">
                  <div className="font-medium">{item.material}</div>
                  <div className="text-xs text-muted-foreground">{item.composition}</div>
                </TableCell>
                <TableCell className="w-1/3 text-right font-medium text-primary px-8">
                    <Input
                        type="text"
                        inputMode="decimal"
                        value={item.price.toFixed(2).replace('.', ',')}
                        onBlur={(e) => handlePriceChange(item.id, e.target.value)}
                        onChange={(e) => {
                            const value = e.target.value;
                            setAllItems(prevItems => prevItems.map(i => i.id === item.id ? {...i, price: parseFloat(value.replace(',', '.')) || 0} : i))
                        }}
                        className="h-8 text-right border-primary/20 bg-transparent"
                    />
                </TableCell>
                <TableCell className="w-12 px-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleItemVisibility(item.id)}>
                        <Icon name={hiddenItemIds.has(item.id) ? "EyeOff" : "Eye"} className="h-4 w-4 text-muted-foreground" />
                    </Button>
                </TableCell>
              </TableRow>
            ))}
             {hasHiddenItems && visibleItems.length === 0 && (
                <TableRow className="odd:bg-transparent">
                  <TableCell colSpan={3} className="text-center text-muted-foreground py-4">
                    <button onClick={showAllItems} className="flex items-center gap-2 mx-auto text-sm hover:text-primary">
                       <Icon name="Eye" />
                       Todos os {hiddenItemIds.size} {hiddenItemIds.size > 1 ? "itens estão ocultos" : "item está oculto"}. Clique para reexibir.
                    </button>
                  </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      </>
  );
}
