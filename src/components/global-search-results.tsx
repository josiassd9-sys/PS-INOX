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

interface GlobalSearchResultsProps {
    categories: (Category | { id: 'conexoes'; name: string; items: ConnectionGroup[] })[];
    priceParams: Record<string, { costPrice: number; markup: number; sellingPrice: number }>;
    searchTerm: string;
    onPrefillScrap: (item: SteelItem, sellingPrice: number) => void;
    isScrapCalculatorActive: boolean;
    costAdjustments: Record<string, number>;
    onItemClick: (item: SteelItem) => void;
}

export function GlobalSearchResults({ categories, priceParams, searchTerm, onPrefillScrap, isScrapCalculatorActive, costAdjustments, onItemClick }: GlobalSearchResultsProps) {
    const [selectedItemIdForCut, setSelectedItemIdForCut] = React.useState<string | null>(null);

    const handleCutCalculatorToggle = (item: SteelItem, category: Category) => {
        if (isScrapCalculatorActive) {
            const priceKey = category.hasOwnPriceControls ? category.id : 'global';
            const { costPrice, markup } = priceParams[priceKey] || priceParams['global'];
            const adjustment = costAdjustments[item.id] || 0;
            const adjustedCost = costPrice * (1 + adjustment / 100);
            const sellingPrice = adjustedCost * (1 + markup / 100);
            onPrefillScrap(item, sellingPrice);
        } else if (category.unit === 'm') {
          if (selectedItemIdForCut === item.id) {
            setSelectedItemIdForCut(null);
          } else {
            setSelectedItemIdForCut(item.id);
          }
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
                                            const isSelectedForCut = selectedItemIdForCut === item.id;
                                            const hasAdjustment = adjustment !== 0;

                                            return (
                                                <React.Fragment key={item.id}>
                                                    <TableRow
                                                        className={cn(
                                                            'even:bg-primary/5 odd:bg-transparent',
                                                            'flex items-center',
                                                            isSelectedForCut && 'bg-primary/20 hover:bg-primary/20',
                                                        )}
                                                    >
                                                        <TableCell 
                                                          onClick={() => handleCostAdjustmentClick(item as SteelItem, category as Category)}
                                                          className={cn('flex-1 flex justify-between items-center cursor-pointer', !isSelectedForCut && 'hover:bg-primary/10')}
                                                        >
                                                           <div className="flex items-center gap-1">
                                                                {hasAdjustment && <Tag className="h-3 w-3 text-accent-price" />}
                                                                {item.description}
                                                            </div>
                                                            {isScrapCalculatorActive && (
                                                                <PlusCircle className="h-5 w-5 text-primary/50 ml-1" />
                                                            )}
                                                        </TableCell>
                                                        <TableCell
                                                            onClick={() => handleCutCalculatorToggle(item as SteelItem, category as Category)} 
                                                            className={cn("w-1/3 text-center", (category as Category).unit === 'm' && 'cursor-pointer', !isSelectedForCut && 'hover:bg-primary/10')}
                                                        >
                                                          {formatNumber(item.weight)}
                                                        </TableCell>
                                                        <TableCell 
                                                            onClick={() => handleCutCalculatorToggle(item as SteelItem, category as Category)} 
                                                            className={cn("w-1/3 text-right font-medium text-primary", (category as Category).unit === 'm' && 'cursor-pointer', !isSelectedForCut && 'hover:bg-primary/10')}
                                                        >
                                                            {formatCurrency(itemPrice)}
                                                            {(category as Category).unit === 'm' && (
                                                                <div className="text-xs text-muted-foreground font-normal">
                                                                    {formatCurrency(itemPrice * 6)} / barra
                                                                </div>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                    {isSelectedForCut && (category as Category).unit === 'm' && !isScrapCalculatorActive && (
                                                        <TableRow>
                                                            <TableCell colSpan={3} className="p-0">
                                                                <div className="p-1 bg-primary/5">
                                                                    <CutPriceCalculator
                                                                        selectedItem={item as SteelItem}
                                                                        sellingPrice={sellingPrice}
                                                                        onClose={() => setSelectedItemIdForCut(null)}
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

    
