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
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import type { Category, SteelItem } from "@/lib/data";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { PlusCircle, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { cn } from "@/lib/utils";
import { CutPriceCalculator } from "./cut-price-calculator";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
  } from "@/components/ui/collapsible"

interface ItemTableProps {
  category: Category;
  sellingPrice: number;
}

export function ItemTable({ category, sellingPrice }: ItemTableProps) {
  const [items, setItems] = React.useState<SteelItem[]>(category.items);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<SteelItem | null>(null);

  const [newDescription, setNewDescription] = React.useState("");
  const [newWeight, setNewWeight] = React.useState<number | "">("");

  React.useEffect(() => {
    setItems(category.items);
    setSearchTerm("");
    setSelectedItem(null); 
  }, [category]);

  const handleAddItem = () => {
    if (newDescription && newWeight) {
      const newItem: SteelItem = {
        id: `custom-${Date.now()}`,
        description: newDescription,
        weight: Number(newWeight),
      };
      setItems([...items, newItem]);
      setNewDescription("");
      setNewWeight("");
      setIsDialogOpen(false);
    }
  };
  
  const handleRowClick = (item: SteelItem) => {
    if (category.unit === 'm') {
      if (selectedItem?.id === item.id) {
        setSelectedItem(null); // Deselect if clicking the same item
      } else {
        setSelectedItem(item);
      }
    }
  };

  const filteredItems = items.filter((item) =>
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatNumber = (value: number, digits: number = 3) => {
    return new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    }).format(value);
  };
  
  const parseSizeFromDescription = (description: string): number | null => {
    const regex = /(\d+[,.]?\d*)"|(\d+[,.]?\d*)\s?mm/i;
    const match = description.match(regex);
  
    if (match) {
      const inchValue = match[1];
      const mmValue = match[2];
  
      if (inchValue) {
        // Handle fractions like 1/2" or 1.1/2"
        if (inchValue.includes('/')) {
            const parts = inchValue.split(/[. ]/);
            let totalInches = 0;
            if (parts.length > 1) {
                totalInches = parseFloat(parts[0]);
                const fractionParts = parts[1].split('/');
                if (fractionParts.length === 2) {
                    totalInches += parseInt(fractionParts[0]) / parseInt(fractionParts[1]);
                }
            } else {
                const fractionParts = inchValue.split('/');
                if (fractionParts.length === 2) {
                    totalInches = parseInt(fractionParts[0]) / parseInt(fractionParts[1]);
                }
            }
            return totalInches * 25.4;
        }
        return parseFloat(inchValue.replace(',', '.')) * 25.4;
      }
      if (mmValue) {
        return parseFloat(mmValue.replace(',', '.'));
      }
    }
    return null;
  };

  const calculateFractionalMarkup = (sizeInMm: number | null): number => {
    if (sizeInMm === null || sizeInMm > 25.4) {
      return 0; // No markup for items > 1 inch or if size can't be parsed
    }
    const minSize = 3.17; // 1/8 inch
    const maxSize = 25.4; // 1 inch
    const minMarkup = 30; // 30%
    const maxMarkup = 10; // 10%
    
    if (sizeInMm <= minSize) return minMarkup;

    // Linear interpolation
    const markup = minMarkup - ((sizeInMm - minSize) * (minMarkup - maxMarkup)) / (maxSize - minSize);
    return markup;
  };

  const unitLabel = category.unit === "m" ? "m" : category.unit === 'm²' ? "m²" : "un";
  const weightUnitLabel = `kg/${unitLabel}`;
  const priceUnitLabel = `R$/${unitLabel}`;

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>{category.name}</CardTitle>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar item..."
              className="pl-8 sm:w-[200px] md:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
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
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
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
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="weight" className="text-right">
                    Peso ({weightUnitLabel})
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    value={newWeight}
                    onChange={(e) =>
                      setNewWeight(
                        e.target.value === "" ? "" : e.target.valueAsNumber
                      )
                    }
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
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-primary/5 hover:bg-primary/10">
                <TableHead>Descrição</TableHead>
                <TableHead className="text-right">
                  Peso ({weightUnitLabel})
                </TableHead>
                <TableHead className="text-right font-semibold text-primary">
                  Preço ({priceUnitLabel})
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => {
                 const sizeInMm = category.unit === 'm' ? parseSizeFromDescription(item.description) : null;
                 const fractionalMarkup = calculateFractionalMarkup(sizeInMm);
                 const finalSellingPrice = sellingPrice * (1 + fractionalMarkup / 100);
                 const itemPrice = item.weight * finalSellingPrice;

                return (
                <Collapsible asChild key={item.id} open={selectedItem?.id === item.id}>
                    <>
                    <CollapsibleTrigger asChild disabled={category.unit !== 'm'}>
                        <TableRow 
                            onClick={() => handleRowClick(item)}
                            className={cn(
                                'even:bg-primary/5 odd:bg-transparent',
                                category.unit === 'm' && 'cursor-pointer',
                                selectedItem?.id === item.id && 'bg-primary/20 hover:bg-primary/20',
                                category.unit !== 'm' && 'hover:bg-primary/10',
                            )}
                            >
                            <TableCell>{item.description}</TableCell>
                            <TableCell className="text-right">
                                {formatNumber(item.weight, 3)}
                            </TableCell>
                            <TableCell className="text-right font-medium text-primary">
                                <div className="flex items-center justify-end gap-2">
                                  {fractionalMarkup > 0 && (
                                    <Badge variant="secondary" className="h-5 text-xs">
                                        +{fractionalMarkup.toFixed(0)}%
                                    </Badge>
                                  )}
                                  <span>{formatCurrency(itemPrice)}</span>
                                </div>
                                {category.unit === 'm' && (
                                    <div className="text-xs text-muted-foreground font-normal">
                                        {formatCurrency(itemPrice * 6)} / barra
                                    </div>
                                )}
                            </TableCell>
                        </TableRow>
                    </CollapsibleTrigger>
                    {category.unit === 'm' && (
                        <CollapsibleContent asChild>
                            <tr>
                                <td colSpan={3}>
                                    <div className="p-4 bg-primary/5">
                                    <CutPriceCalculator
                                        selectedItem={item}
                                        sellingPrice={finalSellingPrice}
                                        onClose={() => setSelectedItem(null)}
                                    />
                                    </div>
                                </td>
                            </tr>
                        </CollapsibleContent>
                    )}
                    </>
                </Collapsible>
              )})}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
