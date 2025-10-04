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
import { PlusCircle } from "lucide-react";

interface GlobalSearchResultsProps {
    categories: (Category | { id: 'conexoes'; name: string; items: ConnectionGroup[] })[];
    priceParams: Record<string, { costPrice: number; markup: number; sellingPrice: number }>;
    searchTerm: string;
    onPrefillScrap: (item: SteelItem, sellingPrice: number) => void;
    isScrapCalculatorActive: boolean;
}

export function GlobalSearchResults({ categories, priceParams, searchTerm, onPrefillScrap, isScrapCalculatorActive }: GlobalSearchResultsProps) {
    const [selectedItemId, setSelectedItemId] = React.useState<string | null>(null);

    const handleRowClick = (item: SteelItem, category: Category, sellingPrice: number) => {
        if (isScrapCalculatorActive) {
            onPrefillScrap(item, sellingPrice);
        } else if (category.unit === 'm') {
          if (selectedItemId === item.id) {
            setSelectedItemId(null); // Deselect if clicking the same item
          } else {
            setSelectedItemId(item.id);
          }
        }
    };
    
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
                    const { costPrice: costMultiplier, markup: markupPercentage } = priceParams['conexoes'] || priceParams['global'];
                    const connectionGroups = category.items as ConnectionGroup[];

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
                                                             const itemCost = item.costPrice || 0;
                                                             const finalCost = itemCost * costMultiplier;
                                                             const itemPrice = Math.ceil(finalCost * (1 + markupPercentage / 100));
                                                            return (
                                                                <TableRow key={item.id} className="even:bg-primary/5 odd:bg-transparent flex items-center">
                                                                    <TableCell className="flex-1">{item.description}</TableCell>
                                                                    <TableCell className="w-1/3 text-center">{formatNumber(item.weight)}</TableCell>
                                                                    <TableCell className="w-1/3 text-right font-medium text-primary">{formatCurrency(itemPrice)}</TableCell>
                                                                </TableRow>
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
                const { sellingPrice } = priceParams[priceKey] || priceParams['global'];

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
                                        <TableHead className="w-1/3 text-center">Peso (kg/{(category as Category).unit === 'm' ? 'm' : (category as Category).unit})</TableHead>
                                        <TableHead className="w-1/3 text-right font-semibold text-primary">Preço (R$/{(category as Category).unit === 'm' ? 'm' : (category as Category).unit})</TableHead>
                                    </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {(category.items as SteelItem[]).map(item => {
                                            const itemPrice = (category as Category).unit === 'm' ? Math.ceil(item.weight * sellingPrice) : item.weight * sellingPrice;
                                            const isSelected = selectedItemId === item.id;
                                            return (
                                                <React.Fragment key={item.id}>
                                                    <TableRow
                                                        onClick={() => handleRowClick(item, category as Category, sellingPrice)}
                                                        className={cn(
                                                            'even:bg-primary/5 odd:bg-transparent',
                                                            'flex items-center',
                                                            ((category as Category).unit === 'm' || isScrapCalculatorActive) && 'cursor-pointer',
                                                            isSelected && 'bg-primary/20 hover:bg-primary/20',
                                                            !isSelected && 'hover:bg-primary/10',
                                                        )}
                                                    >
                                                        <TableCell className="flex-1 flex justify-between items-center">
                                                            {item.description}
                                                            {isScrapCalculatorActive && (
                                                                <PlusCircle className="h-5 w-5 text-primary/50 ml-1" />
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="w-1/3 text-center">{formatNumber(item.weight)}</TableCell>
                                                        <TableCell className="w-1/3 text-right font-medium text-primary">
                                                            {formatCurrency(itemPrice)}
                                                            {(category as Category).unit === 'm' && (
                                                                <div className="text-xs text-muted-foreground font-normal">
                                                                    {formatCurrency(itemPrice * 6)} / barra
                                                                </div>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                    {isSelected && (category as Category).unit === 'm' && !isScrapCalculatorActive && (
                                                        <TableRow>
                                                            <TableCell colSpan={3} className="p-0">
                                                                <div className="p-1 bg-primary/5">
                                                                    <CutPriceCalculator
                                                                        selectedItem={item}
                                                                        sellingPrice={sellingPrice}
                                                                        onClose={() => setSelectedItemId(null)}
                                                                    />
                                                                </div>
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

    