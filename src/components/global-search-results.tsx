
"use client";

import * as React from "react";
import type { Category, ConnectionGroup, SteelItem } from "@/lib/data";
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
    onItemClick: (item: SteelItem) => void;
    onAddItem: (item: any) => void;
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

export function GlobalSearchResults({ categories, priceParams, searchTerm, costAdjustments, onItemClick, onAddItem }: GlobalSearchResultsProps) {
    const [selectedItemId, setSelectedItemId] = React.useState<string | null>(null);

    const handleItemSelection = (item: SteelItem, category: Category) => {
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

    if (categories.length === 0) {
        return <div className="text-center text-muted-foreground py-10">Nenhum item encontrado para "{searchTerm}".</div>
    }

  return (
    <div className="space-y-1">
        <h2 className="text-xl font-semibold">Resultados da Busca para "{searchTerm}"</h2>
        <Accordion type="multiple" className="w-full space-y-1" defaultValue={categories.map(c => c.id)}>
            {categories.map((category) => {
                 if (category.id === 'conexoes') {
                    const connectionGroups = category.items as ConnectionGroup[];
                    const sellingPrice = priceParams['conexoes']?.sellingPrice || priceParams['global'].sellingPrice;

                    return (
                        <AccordionItem value={category.id} key={category.id} className="border rounded-lg overflow-hidden bg-card">
                             <AccordionTrigger className="px-1 py-1 hover:bg-primary/10 text-lg font-semibold">
                                {category.name} ({connectionGroups.reduce((acc, g) => acc + g.items.length, 0)})
                            </AccordionTrigger>
                            <AccordionContent>
                                {connectionGroups.map(group => (
                                     <Accordion type="single" collapsible key={group.id} className="w-full" >
                                        <AccordionItem value={group.id} className="border-t">
                                            <AccordionTrigger className="px-1 py-1 bg-primary/5 hover:bg-primary/10 text-base font-semibold">
                                                {group.name} ({group.items.length})
                                            </AccordionTrigger>
                                            <AccordionContent className="p-0">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow className="bg-primary/10 hover:bg-primary/10 flex items-center">
                                                            <TableHead className="flex-1">Descrição</TableHead>
                                                            <TableHead className="w-1/3 text-center">Peso (kg/un)</TableHead>
                                                            <TableHead className="w-1/3 text-right font-semibold text-primary">Preço (R$/un)</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {group.items.map(item => {
                                                             const itemPrice = Math.ceil(item.weight * sellingPrice);
                                                             const isSelected = selectedItemId === item.id;
                                                            return (
                                                                <React.Fragment key={item.id}>
                                                                <TableRow 
                                                                    onClick={() => handleItemSelection(item as any, category as any)}
                                                                    className={cn("even:bg-primary/5 odd:bg-transparent flex items-center cursor-pointer", isSelected && 'bg-primary/20 hover:bg-primary/20')}
                                                                >
                                                                    <TableCell className="flex-1">{item.description}</TableCell>
                                                                    <TableCell className="w-1/3 text-center">{formatNumber(item.weight)}</TableCell>
                                                                    <TableCell className="w-1/3 text-right font-medium text-primary">{formatCurrency(itemPrice)}</TableCell>
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
                        <AccordionTrigger className="px-1 py-1 hover:bg-primary/10 text-lg font-semibold">
                            {category.name} ({category.items.length})
                        </AccordionTrigger>
                        <AccordionContent className="p-0">
                            <div className="overflow-auto border-t">
                                <Table>
                                    <TableHeader>
                                    <TableRow className="bg-primary/5 hover:bg-primary/10 flex items-center">
                                        <TableHead className="flex-1">Descrição</TableHead>
                                        <TableHead className="w-1/3 text-center">Peso (kg/{(category as Category).unit})</TableHead>
                                        <TableHead className="w-1/3 text-right font-semibold text-primary">Preço (R$/{(category as Category).unit})</TableHead>
                                    </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {(category.items as SteelItem[]).map(item => {
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
                                                            'even:bg-primary/5 odd:bg-transparent',
                                                            'flex items-center cursor-pointer',
                                                            isSelected && 'bg-primary/20 hover:bg-primary/20',
                                                        )}
                                                    >
                                                        <TableCell 
                                                          onDoubleClick={() => handleCostAdjustmentClick(item as SteelItem, category as Category)}
                                                          className={cn('flex-1 flex justify-between items-center', !isSelected && 'hover:bg-primary/10')}
                                                        >
                                                           <div className="flex items-center gap-1">
                                                                {hasAdjustment && <Tag className="h-3 w-3 text-accent-price" />}
                                                                {item.description}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell
                                                            className={cn("w-1/3 text-center", !isSelected && 'hover:bg-primary/10')}
                                                        >
                                                          {formatNumber(item.weight)}
                                                        </TableCell>
                                                        <TableCell 
                                                            className={cn("w-1/3 text-right font-medium text-primary", !isSelected && 'hover:bg-primary/10')}
                                                        >
                                                            {formatCurrency(itemPrice)}
                                                            {(category as Category).unit === 'm' && (
                                                                <div className="text-xs text-muted-foreground font-normal">
                                                                    {formatCurrency(itemPrice * 6)} / barra
                                                                </div>
                                                            )}
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
