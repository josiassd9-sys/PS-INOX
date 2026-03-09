
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
import type { Category, SteelItem } from "@/lib/data/index";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { PlusCircle, Tag } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { cn } from "@/lib/utils";
import { CutPriceCalculator } from "./cut-price-calculator";

interface ItemTableProps {
  category: Category;
  priceParams: { costPrice: number; markup: number; sellingPrice: number };
  costAdjustments: Record<string, number>;
  onItemClick: (item: SteelItem) => void;
  showTableHeader?: boolean;
}

export function ItemTable({ category, priceParams, costAdjustments, onItemClick, showTableHeader = true }: ItemTableProps) {
  const [items, setItems] = React.useState<SteelItem[]>(category.items as SteelItem[]);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedItemIdForCut, setSelectedItemIdForCut] = React.useState<string | null>(null);

  const [newDescription, setNewDescription] = React.useState("");
  const [newWeight, setNewWeight] = React.useState<string>("");

  React.useEffect(() => {
    setItems(category.items as SteelItem[]);
    setSelectedItemIdForCut(null); 
  }, [category]);
  
  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
    const sanitizedValue = value.replace(/[^0-9,.]/g, '').replace('.', ',');
    if (/^\d*\,?\d*$/.test(sanitizedValue)) {
      setter(sanitizedValue);
    }
  };


  const handleAddItem = () => {
    if (newDescription && newWeight) {
      const newItem: SteelItem = {
        id: `custom-${Date.now()}`,
        description: newDescription,
        weight: parseFloat(newWeight.replace(',', '.')),
        unit: category.unit,
        categoryName: category.id,
      };
      setItems([...items, newItem]);
      setNewDescription("");
      setNewWeight("");
      setIsDialogOpen(false);
    }
  };
  
  const handleCutCalculatorToggle = (item: SteelItem) => {
    if (category.unit === 'm') {
      if (selectedItemIdForCut === item.id) {
        setSelectedItemIdForCut(null); // Deselect if clicking the same item
      } else {
        setSelectedItemIdForCut(item.id);
      }
    }
  };

  const handleCostAdjustmentClick = (item: SteelItem) => {
    onItemClick(item);
  }

  const filteredItems = items;

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
      <div className="flex items-baseline justify-end tabular-nums font-sans">
        <span className="text-sm font-semibold">{integerPart}</span>
        <span className="text-[10px] self-start mt-px">,{decimalPart}</span>
      </div>
    );
  };

  const formatWeight = (value: number) => {
    const formatted = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 3, maximumFractionDigits: 3 }).format(value);
    const parts = formatted.split(',');
    const integerPart = parts[0];
    const decimalPart = parts[1];
    
    return (
        <div className="flex items-baseline justify-center tabular-nums font-sans text-destructive">
            <span className="text-xs font-semibold">{integerPart}</span>
            <span className="text-[9px] self-start mt-px">,{decimalPart} kg</span>
        </div>
    )
  }
  
  const unitLabel = category.unit === "m" ? "m" : category.unit === 'm²' ? "m²" : "un";
  const weightUnitLabel = `Peso (kg/${unitLabel})`;
  const priceUnitLabel = `Preço (R$/${unitLabel})`;

  const calculateItemPrice = React.useCallback((item: SteelItem) => {
    const adjustment = costAdjustments[item.id] || 0;
    const adjustedCost = priceParams.costPrice * (1 + adjustment / 100);
    const sellingPrice = adjustedCost * (1 + priceParams.markup / 100);

    if (category.unit === 'm') {
      return Math.ceil(item.weight * sellingPrice);
    }
    return item.weight * sellingPrice;
  }, [costAdjustments, priceParams, category.unit]);


  return (
    <>
      <div className="flex items-center justify-end mb-1">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="h-8 gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Adicionar Item
              </span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Item em {category.name}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-1 py-1">
              <div className="grid grid-cols-4 items-center gap-1">
                <Label htmlFor="description" className="text-right">
                  Descrição
                </Label>
                <Input
                  id="description"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-1">
                <Label htmlFor="weight" className="text-right">
                  Peso ({`kg/${unitLabel}`})
                </Label>
                <Input
                  id="weight"
                  type="text"
                  inputMode="decimal"
                  value={newWeight}
                  onChange={(e) => handleInputChange(setNewWeight, e.target.value)}
                  className="col-span-3"
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
      <div className="border rounded-lg overflow-hidden">
        <Table>
          {showTableHeader && (
             <TableHeader>
                <TableRow className="hover:bg-transparent flex">
                    <TableHead className="flex-1 p-1 bg-sheet-table-header-bg text-sheet-table-header-fg font-bold text-sm">Descrição</TableHead>
                    <TableHead className="text-center p-1 w-[120px] bg-sheet-table-header-bg text-sheet-table-header-fg font-bold text-sm">{weightUnitLabel}</TableHead>
                    <TableHead className="text-center p-1 w-[120px] bg-sheet-table-header-bg text-sheet-table-header-fg font-bold text-sm">{priceUnitLabel}</TableHead>
                </TableRow>
            </TableHeader>
          )}
          <TableBody>
            {filteredItems.map((item, index) => {
                const itemPrice = calculateItemPrice(item);
                const isSelectedForCut = selectedItemIdForCut === item.id;
                const hasAdjustment = (costAdjustments[item.id] || 0) !== 0;
                const isEven = index % 2 === 1;

              return (
                  <React.Fragment key={item.id}>
                      <TableRow 
                          className={cn(
                              'flex items-stretch cursor-pointer',
                              !isEven ? "bg-row-odd-bg" : "bg-row-even-bg",
                              isSelectedForCut && 'bg-primary/20 hover:bg-primary/20'
                          )}
                          >
                          <TableCell 
                            onClick={() => handleCostAdjustmentClick(item)}
                            className="font-medium text-text-item-pink text-xs flex-1 p-1 flex items-center gap-1"
                          >
                            {hasAdjustment && <Tag className="h-3 w-3 text-accent-price" />}
                            {item.description}
                          </TableCell>
                          <TableCell 
                             onClick={() => handleCutCalculatorToggle(item)}
                             className={cn("text-center p-1 w-[120px]", !isEven ? "bg-row-odd-bg" : "bg-row-pmq-bg")}
                          >
                              <div className="h-full flex items-center justify-center">{formatWeight(item.weight)}</div>
                          </TableCell>
                          <TableCell 
                            onClick={() => handleCutCalculatorToggle(item)}
                            className={cn("text-right font-semibold p-1 w-[120px]", !isEven ? "bg-row-even-bg" : "bg-row-pmq-bg")}
                          >
                            <div className="h-full flex flex-col items-end justify-center text-sheet-total-price-fg">
                                {formatCurrency(itemPrice)}
                                {category.unit === 'm' && (
                                    <div className="text-xs text-muted-foreground font-normal">
                                        / barra: {formatCurrency(itemPrice * 6)}
                                    </div>
                                )}
                            </div>
                          </TableCell>
                      </TableRow>
                      {isSelectedForCut && category.unit === 'm' && (
                            <TableRow>
                              <TableCell colSpan={3} className="p-0">
                                  <div className="p-1 bg-primary/5">
                                    <CutPriceCalculator
                                        selectedItem={item}
                                        sellingPrice={itemPrice / item.weight}
                                        onClose={() => setSelectedItemIdForCut(null)}
                                        onAddItem={() => {}}
                                    />
                                  </div>
                              </TableCell>
                          </TableRow>
                      )}
                  </React.Fragment>
            )})}
          </TableBody>
        </Table>
      </div>
      </>
  );
}

    