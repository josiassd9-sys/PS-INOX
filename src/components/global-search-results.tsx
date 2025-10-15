

"use client";

import * as React from "react";
import type { Category, ConnectionGroup, SteelItem, ScrapItem } from "@/lib/data/index";
import type { ConnectionItem } from "@/lib/data/types";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { cn } from "@/lib/utils";
import { CutPriceCalculator } from "./cut-price-calculator";
import { PlusCircle, Tag } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";

interface GlobalSearchResultsProps {
    categories: (Category | { id: 'conexoes'; name: string; items: ConnectionGroup[] })[];
    priceParams: Record<string, { costPrice: number; markup: number; sellingPrice: number }>;
    searchTerm: string;
    costAdjustments: Record<string, number>;
    onItemClick: (item: SteelItem | ScrapItem) => void;
    onAddItem: (item: any) => void;
    isScrapCalculatorActive: boolean;
}

function AddByUnitForm({ item, onAdd }: { item: SteelItem & {price: number}; onAdd: (item: any) => void }) {
    const [quantity, setQuantity] = React.useState("1");
    
    const handleAdd = () => {
        const qty = parseInt(quantity) || 1;
        onAdd({
            ...item,
            price: item.price * qty,
            weight: item.weight * qty,
            quantity: qty,
        });
    }

    return (
        <div className="p-2 bg-primary/5">
            <div className="flex gap-2 items-end">
                <div className="space-y-1 flex-1">
                    <Label htmlFor={`qty-${item.id}`} className="text-xs">Quantidade (pç)</Label>
                    <Input
                        id={`qty-${item.id}`}
                        type="text"
                        inputMode="numeric"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="Qtd."
                    />
                </div>
                <Button onClick={handleAdd} className="h-10 gap-2">
                    <PlusCircle /> Adicionar
                </Button>
            </div>
        </div>
    )
}

function AddSheetForm({ item, initialSellingPrice, onAdd }: { item: SteelItem; initialSellingPrice: number; onAdd: (item: any) => void }) {
    const [quantity, setQuantity] = React.useState("1");
    const [sellingPrice, setSellingPrice] = React.useState(initialSellingPrice.toFixed(2).replace('.', ','));
    const [materialClass, setMaterialClass] = React.useState<string>("304");


    const handlePriceChange = (value: string) => {
        const sanitizedValue = value.replace(/[^0-9,.]/g, '').replace('.', ',');
        if (/^\d*\,?\d*$/.test(sanitizedValue)) {
            setSellingPrice(sanitizedValue);
        }
    };
    
    const { finalPrice, finalWeight } = React.useMemo(() => {
        const qty = parseInt(quantity) || 0;
        const pricePerKg = parseFloat(sellingPrice.replace(',', '.')) || 0;
        
        if (qty > 0 && pricePerKg > 0) {
            const calculatedWeight = item.weight * qty;
            const calculatedPrice = calculatedWeight * pricePerKg;
            return { finalPrice: calculatedPrice, finalWeight: calculatedWeight };
        }
        return { finalPrice: 0, finalWeight: 0 };
    }, [quantity, sellingPrice, item.weight]);


    const handleAdd = () => {
        if (finalPrice > 0 && finalWeight > 0) {
             const descriptionParts = item.description.split(" ");
             const inoxIndex = descriptionParts.findIndex(p => p.toLowerCase().includes('inox'));

             if (inoxIndex !== -1) {
                descriptionParts.splice(inoxIndex + 1, 0, materialClass || "");
             } else {
                descriptionParts.splice(1, 0, "Inox", materialClass || "");
             }
             
             const newDescription = descriptionParts.join(" ");

            onAdd({
                ...item,
                description: newDescription,
                price: finalPrice,
                weight: finalWeight,
                quantity: parseInt(quantity) || 1,
            });
        }
    }

    return (
        <div className="p-2 bg-primary/5 space-y-2">
            <div className="flex gap-2 items-end">
                <div className="space-y-1 w-1/4">
                    <Label htmlFor={`qty-${item.id}`} className="text-xs">Quantidade</Label>
                    <Input
                        id={`qty-${item.id}`}
                        type="text"
                        inputMode="numeric"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="Qtd."
                    />
                </div>
                 <div className="space-y-1 w-1/4">
                    <Label htmlFor={`material-class-${item.id}`} className="text-xs">Classe Inox</Label>
                    <Input
                        id={`material-class-${item.id}`}
                        type="text"
                        value={materialClass}
                        onChange={(e) => setMaterialClass(e.target.value)}
                        placeholder="304"
                    />
                </div>
                <div className="space-y-1 flex-1">
                    <Label htmlFor={`price-${item.id}`} className="text-xs">Venda (R$/kg)</Label>
                    <Input
                        id={`price-${item.id}`}
                        type="text"
                        inputMode="decimal"
                        value={sellingPrice}
                        onChange={(e) => handlePriceChange(e.target.value)}
                        placeholder="R$/kg"
                    />
                </div>
            </div>
            <div className="flex gap-2 items-end">
                <div className="space-y-1 flex-1">
                     <Label className="text-accent-price font-semibold">Preço Final da Chapa</Label>
                     <div className="w-full rounded-md border border-accent-price/50 bg-accent-price/10 px-3 py-2 text-base md:text-sm font-bold text-accent-price h-10 flex items-center">
                        {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(finalPrice)}
                     </div>
                </div>
                <Button onClick={handleAdd} className="h-10 gap-2">
                    <PlusCircle /> Adicionar
                </Button>
            </div>
        </div>
    )
}


export function GlobalSearchResults({ categories, priceParams, searchTerm, costAdjustments, onItemClick, onAddItem, isScrapCalculatorActive }: GlobalSearchResultsProps) {
    const [selectedItemId, setSelectedItemId] = React.useState<string | null>(null);

    const handleItemSelection = (item: SteelItem | ScrapItem, category: Category) => {
         if (selectedItemId === item.id) {
            setSelectedItemId(null);
        } else {
            setSelectedItemId(item.id);
        }
    };

    const handleCostAdjustmentClick = (item: SteelItem, category: Category) => {
        if (category.id === 'conexoes') return;
        onItemClick(item);
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
              <span className="text-[9px] self-start mt-px">,{decimalPart}</span>
          </div>
      )
    }

    if (categories.length === 0 && !isScrapCalculatorActive) {
        return <div className="text-center text-muted-foreground py-10">Nenhum item encontrado para "{searchTerm}".</div>
    }

  return (
    <div className="space-y-1">
        {!isScrapCalculatorActive && <h2 className="text-xl font-semibold">Resultados da Busca para "{searchTerm}"</h2>}
        <Accordion type="multiple" className="w-full space-y-1" defaultValue={categories.map(c => c.id)}>
            {categories.map((category) => {
                 if (category.id === 'conexoes') {
                    const connectionGroups = category.items as ConnectionGroup[];
                    const sellingPrice = priceParams['conexoes']?.sellingPrice || priceParams['global'].sellingPrice;

                    return (
                        <AccordionItem value={category.id} key={category.id} className="border rounded-lg overflow-hidden bg-card">
                             <AccordionTrigger className="px-2 py-2 hover:bg-primary/10 text-base font-semibold">
                                {category.name} ({connectionGroups.reduce((acc, g) => acc + g.items.length, 0)})
                            </AccordionTrigger>
                            <AccordionContent>
                                {connectionGroups.map(group => (
                                     <Accordion type="single" collapsible key={group.id} className="w-full" >
                                        <AccordionItem value={group.id} className="border-t">
                                            <AccordionTrigger className="px-2 py-1 bg-primary/5 hover:bg-primary/10 text-sm font-semibold">
                                                {group.name} ({group.items.length})
                                            </AccordionTrigger>
                                            <AccordionContent className="p-0">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow className="hover:bg-transparent flex">
                                                            <TableHead className="flex-1 p-1 bg-sheet-table-header-bg text-sheet-table-header-fg font-bold text-sm">Descrição</TableHead>
                                                            <TableHead className="text-center p-1 w-[80px] bg-sheet-table-header-bg text-sheet-table-header-fg font-bold text-sm">Peso</TableHead>
                                                            <TableHead className="text-center p-1 w-[80px] bg-sheet-table-header-bg text-sheet-table-header-fg font-bold text-sm">Preço</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {group.items.map((item, index) => {
                                                             const isEven = index % 2 === 1;
                                                             const itemPrice = Math.ceil(item.weight * sellingPrice);
                                                             const isSelected = selectedItemId === item.id;
                                                            return (
                                                                <React.Fragment key={item.id}>
                                                                <TableRow 
                                                                    onClick={() => handleItemSelection(item as any, category as any)}
                                                                    className={cn(
                                                                        "flex items-stretch cursor-pointer",
                                                                        !isEven ? "bg-row-odd-bg" : "bg-row-even-bg",
                                                                        isSelected && "bg-primary/20"
                                                                    )}
                                                                >
                                                                    <TableCell className="font-medium text-text-item-pink text-xs flex-1 p-1">{item.description}</TableCell>
                                                                    <TableCell className={cn("text-center p-1 w-[80px]", !isEven ? "bg-row-odd-bg" : "bg-row-pmq-bg")}>
                                                                        <div className="h-full flex items-center justify-center">{formatWeight(item.weight)}</div>
                                                                    </TableCell>
                                                                    <TableCell className={cn("text-right font-semibold p-1 w-[80px]", !isEven ? "bg-row-even-bg" : "bg-row-pmq-bg")}>
                                                                        <div className="h-full flex items-center justify-end text-sheet-total-price-fg">{formatCurrency(itemPrice)}</div>
                                                                    </TableCell>
                                                                </TableRow>
                                                                {isSelected && (
                                                                     <TableRow>
                                                                         <TableCell colSpan={3} className="p-0">
                                                                             <AddByUnitForm 
                                                                                item={{...(item as any), unit: 'un', price: itemPrice}}
                                                                                onAdd={(newItem) => {
                                                                                    onAddItem(newItem);
                                                                                    setSelectedItemId(null);
                                                                                }}/>
                                                                         </TableCell>
                                                                     </TableRow>
                                                                )}
                                                                </React.Fragment>
                                                            )
                                                        })}
                                                    </TableBody>
                                                </Table>
                                            </AccordionContent>
                                        </AccordionItem>
                                     </Accordion>
                                ))}
                            </AccordionContent>
                        </AccordionItem>
                    )
                }

                const priceKey = (category as Category).hasOwnPriceControls ? category.id : 'global';
                const { costPrice, markup } = priceParams[priceKey] || priceParams['global'];

                return (
                    <AccordionItem value={category.id} key={category.id} className="border rounded-lg overflow-hidden bg-card">
                        <AccordionTrigger className="px-2 py-2 hover:bg-primary/10 text-base font-semibold">
                            {category.name} ({category.items.length})
                        </AccordionTrigger>
                        <AccordionContent className="p-0">
                            <div className="overflow-auto">
                                <Table>
                                    <TableHeader>
                                    <TableRow className="hover:bg-transparent flex">
                                        <TableHead className="flex-1 p-1 bg-sheet-table-header-bg text-sheet-table-header-fg font-bold text-sm">Descrição</TableHead>
                                        <TableHead className="text-center p-1 w-[120px] bg-sheet-table-header-bg text-sheet-table-header-fg font-bold text-sm">Peso (kg/{(category as Category).unit})</TableHead>
                                        <TableHead className="text-center p-1 w-[120px] bg-sheet-table-header-bg text-sheet-table-header-fg font-bold text-sm">Preço (R$/{(category as Category).unit})</TableHead>
                                    </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {(category.items as SteelItem[]).map((item, index) => {
                                            const isEven = index % 2 === 1;
                                            const adjustment = costAdjustments[item.id] || 0;
                                            const adjustedCost = costPrice * (1 + adjustment / 100);
                                            const sellingPrice = adjustedCost * (1 + markup / 100);

                                            const itemPrice = (category as Category).unit === 'm' ? Math.ceil(item.weight * sellingPrice) : item.weight * sellingPrice;
                                            const isSelected = selectedItemId === item.id;
                                            const hasAdjustment = adjustment !== 0;

                                            return (
                                                <React.Fragment key={item.id}>
                                                    <TableRow
                                                        onClick={() => handleItemSelection(item as SteelItem, category as Category)}
                                                        className={cn(
                                                            "flex items-stretch cursor-pointer",
                                                            !isEven ? "bg-row-odd-bg" : "bg-row-even-bg",
                                                            isSelected && "bg-primary/20"
                                                        )}
                                                    >
                                                        <TableCell 
                                                          onDoubleClick={() => handleCostAdjustmentClick(item as SteelItem, category as Category)}
                                                          className="font-medium text-text-item-pink text-xs flex-1 p-1 flex items-center gap-1"
                                                        >
                                                           {hasAdjustment && <Tag className="h-3 w-3 text-accent-price" />}
                                                            {item.description}
                                                        </TableCell>
                                                        <TableCell className={cn("text-center p-1 w-[120px]", !isEven ? "bg-row-odd-bg" : "bg-row-pmq-bg")}>
                                                            <div className="h-full flex items-center justify-center">{formatWeight(item.weight)}</div>
                                                        </TableCell>
                                                        <TableCell className={cn("text-right font-semibold p-1 w-[120px]", !isEven ? "bg-row-even-bg" : "bg-row-pmq-bg")}>
                                                            <div className="h-full flex flex-col items-end justify-center text-sheet-total-price-fg">
                                                                {formatCurrency(itemPrice)}
                                                                {(category as Category).unit === 'm' && (
                                                                    <div className="text-xs text-muted-foreground font-normal">
                                                                        / barra: {formatCurrency(itemPrice * 6)}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                    {isSelected && (
                                                        <TableRow>
                                                            <TableCell colSpan={3} className="p-0">
                                                                {(category as Category).unit === 'm' ? (
                                                                    <div className="p-1 bg-primary/5">
                                                                        <CutPriceCalculator
                                                                            selectedItem={item as SteelItem}
                                                                            sellingPrice={sellingPrice}
                                                                            onClose={() => setSelectedItemId(null)}
                                                                            onAddItem={onAddItem}
                                                                        />
                                                                    </div>
                                                                ) : (category as Category).id === 'chapas' ? (
                                                                    <AddSheetForm
                                                                        item={item as SteelItem}
                                                                        initialSellingPrice={sellingPrice}
                                                                        onAdd={(newItem) => {
                                                                            onAddItem(newItem);
                                                                            setSelectedItemId(null);
                                                                        }}
                                                                    />
                                                                ) : (
                                                                     <AddByUnitForm 
                                                                        item={{...item, unit: 'un', price: itemPrice}}
                                                                        onAdd={(newItem) => {
                                                                            onAddItem(newItem);
                                                                            setSelectedItemId(null);
                                                                        }}/>
                                                                )}
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </React.Fragment>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                )})}
        </Accordion>
    </div>
  )
}
