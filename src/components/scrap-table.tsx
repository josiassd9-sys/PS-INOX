
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
import { cn } from "@/lib/utils";

interface ScrapTableProps {
  category: Category;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  searchTerm: string;
}

const LOCAL_STORAGE_HIDDEN_KEY = "scrapTableHiddenItems";

export function ScrapTable({ category, isDialogOpen, setIsDialogOpen, searchTerm }: ScrapTableProps) {
  const [allItems, setAllItems] = React.useState<ScrapItem[]>(category.items as ScrapItem[]);
  const [hiddenItemIds, setHiddenItemIds] = React.useState<Set<string>>(new Set());
  
  const [newMaterial, setNewMaterial] = React.useState("");
  const [newComposition, setNewComposition] = React.useState("");
  const [newPrice, setNewPrice] = React.useState<string>("");

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
  
  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
    const sanitizedValue = value.replace(/[^0-9,.]/g, '').replace('.', ',');
    if (/^\d*\,?\d*$/.test(sanitizedValue)) {
      setter(sanitizedValue);
    }
  };


  const handleAddItem = () => {
    if (newMaterial && newPrice !== "") {
      const newItem: ScrapItem = {
        id: `custom-scrap-${Date.now()}`,
        material: newMaterial,
        composition: newComposition,
        price: parseFloat(newPrice.replace(",", ".")),
      };
      setAllItems([...allItems, newItem]);
      setNewMaterial("");
      setNewComposition("");
      setNewPrice("");
      setIsDialogOpen(false);
    }
  };

  const handlePriceChange = (id: string, newPriceValue: string) => {
    const sanitizedValue = newPriceValue.replace(",", ".");
    const priceAsNumber = parseFloat(sanitizedValue);
    
    setAllItems(prevItems => prevItems.map(item => {
        if (item.id === id) {
            return { ...item, price: isNaN(priceAsNumber) ? item.price : priceAsNumber };
        }
        return item;
    }));
  }

    const formatCurrency = (value: number) => {
        const formatter = new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        });
        const formatted = formatter.format(value); 

        const parts = formatted.split(',');
        const integerPart = parts[0];
        const decimalPart = parts[1];

        return (
        <div className="flex items-baseline justify-end tabular-nums font-sans text-[hsl(var(--sheet-total-price-fg))]">
            <span className="text-[12px] font-semibold">{integerPart}</span>
            <span className="text-[9px] self-start mt-px">,{decimalPart}</span>
        </div>
        );
    };

  const filteredAndVisibleItems = React.useMemo(() => {
    const visibleItems = allItems.filter(item => !hiddenItemIds.has(item.id));
    if (!searchTerm) {
      return visibleItems;
    }
    const safeSearchTerm = searchTerm.toLowerCase().replace(",", ".");
    return visibleItems.filter(item => 
      item.material.toLowerCase().replace(",", ".").includes(safeSearchTerm) ||
      (item.composition && item.composition.toLowerCase().replace(",", ".").includes(safeSearchTerm))
    );
  }, [allItems, hiddenItemIds, searchTerm]);


  const hasHiddenItems = hiddenItemIds.size > 0;

  return (
    <>
      <div className="flex items-center justify-between mb-1">
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
                <div className="grid gap-1 py-1">
                <div className="grid grid-cols-4 items-center gap-1">
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
                <div className="grid grid-cols-4 items-center gap-1">
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
                <div className="grid grid-cols-4 items-center gap-1">
                    <Label htmlFor="price" className="text-right">
                    Preço (R$/kg)
                    </Label>
                    <Input
                    id="price"
                    type="text"
                    inputMode="decimal"
                    value={newPrice}
                    onChange={(e) => handleInputChange(setNewPrice, e.target.value) }
                    className="col-span-3"
                    placeholder="Ex: 8,50"
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
      <div className="-mx-1 rounded-lg overflow-hidden flex-1 flex flex-col">
        <div className="relative overflow-auto flex-1">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm">
             <TableRow className="hover:bg-transparent flex">
                <TableHead className="flex-1 p-1 bg-[hsl(var(--sheet-table-header-bg))] text-[hsl(var(--sheet-table-header-fg))] font-bold">Material (Composição)</TableHead>
                <TableHead className="text-center p-1 w-32 bg-[hsl(var(--sheet-table-header-bg))] text-[hsl(var(--sheet-table-header-fg))] font-bold">Preço (R$/kg)</TableHead>
              </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndVisibleItems.length > 0 ? (
                filteredAndVisibleItems.map((item, index) => {
                    const isEven = index % 2 === 1;
                    return (
                    <TableRow key={item.id} className={cn("flex items-stretch group", !isEven ? "bg-[hsl(var(--row-odd-bg))]" : "bg-[hsl(var(--row-even-bg))]")}>
                        <TableCell className="font-medium text-[hsl(var(--text-item-pink))] text-[11px] flex-1 p-1">
                            <div>{item.material}</div>
                            <div className="text-xs text-muted-foreground">{item.composition}</div>
                        </TableCell>
                        <TableCell className={cn(
                            "text-right font-semibold p-1 w-32 relative", 
                            !isEven ? "bg-[hsl(var(--row-even-bg))]" : "bg-[hsl(var(--row-pmq-bg))]")}
                        >
                            <Input
                                type="text"
                                inputMode="decimal"
                                value={item.price.toFixed(2).replace('.', ',')}
                                onBlur={(e) => handlePriceChange(item.id, e.target.value)}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setAllItems(prevItems => prevItems.map(i => i.id === item.id ? {...i, price: parseFloat(value.replace(',', '.')) || 0} : i))
                                }}
                                className="h-8 text-right bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 pr-8"
                                style={{color: 'hsl(var(--sheet-total-price-fg))'}}
                            />
                             <Button variant="ghost" size="icon" className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => toggleItemVisibility(item.id)}>
                                <Icon name="EyeOff" className="h-4 w-4 text-muted-foreground" />
                            </Button>
                        </TableCell>
                    </TableRow>
                )})
            ) : (
                <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground py-10">
                    {searchTerm ? `Nenhum item encontrado para "${searchTerm}"` : (
                        <button onClick={showAllItems} className="flex items-center gap-1 mx-auto text-sm hover:text-primary">
                        <Icon name="Eye" />
                        Todos os {hiddenItemIds.size} {hiddenItemIds.size > 1 ? "itens estão ocultos" : "item está oculto"}. Clique para reexibir.
                        </button>
                    )}
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
        </div>
      </div>
      </>
  );
}
