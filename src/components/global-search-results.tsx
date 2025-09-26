"use client";

import * as React from "react";
import type { Category, SteelItem } from "@/lib/data";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { cn } from "@/lib/utils";
import { CutPriceCalculator } from "./cut-price-calculator";

interface GlobalSearchResultsProps {
    categories: Category[];
    sellingPrice: number;
    searchTerm: string;
}

export function GlobalSearchResults({ categories, sellingPrice, searchTerm }: GlobalSearchResultsProps) {
    const [selectedItemId, setSelectedItemId] = React.useState<string | null>(null);

    const handleRowClick = (itemId: string, category: Category) => {
        if (category.unit === 'm') {
          if (selectedItemId === itemId) {
            setSelectedItemId(null); // Deselect if clicking the same item
          } else {
            setSelectedItemId(itemId);
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
    <div className="space-y-4">
        <h2 className="text-xl font-semibold">Resultados da Busca para "{searchTerm}"</h2>
        <Accordion type="multiple" className="w-full space-y-2" defaultValue={categories.map(c => c.id)}>
            {categories.map((category) => (
                <AccordionItem value={category.id} key={category.id} className="border rounded-lg overflow-hidden bg-card">
                    <AccordionTrigger className="px-6 py-4 hover:bg-primary/10 text-lg font-semibold">
                        {category.name} ({category.items.length})
                    </AccordionTrigger>
                    <AccordionContent className="p-0">
                        <div className="overflow-auto border-t">
                            <Table>
                                <TableHeader>
                                <TableRow className="bg-primary/5 hover:bg-primary/10 flex items-center">
                                    <TableHead className="flex-1">Descrição</TableHead>
                                    <TableHead className="w-1/4 text-center">Peso (kg/{category.unit === 'm' ? 'm' : category.unit})</TableHead>
                                    <TableHead className="w-1/4 text-right font-semibold text-primary">Preço (R$/{category.unit === 'm' ? 'm' : category.unit})</TableHead>
                                </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {category.items.map(item => {
                                        const itemPrice = category.unit === 'm' ? Math.ceil(item.weight * sellingPrice) : item.weight * sellingPrice;
                                        const isSelected = selectedItemId === item.id;
                                        return (
                                            <React.Fragment key={item.id}>
                                                <TableRow
                                                    onClick={() => handleRowClick(item.id, category)}
                                                    className={cn(
                                                        'even:bg-primary/5 odd:bg-transparent',
                                                        'flex items-center',
                                                        category.unit === 'm' && 'cursor-pointer',
                                                        isSelected && 'bg-primary/20 hover:bg-primary/20',
                                                        category.unit !== 'm' && 'hover:bg-primary/10',
                                                    )}
                                                >
                                                    <TableCell className="flex-1">{item.description}</TableCell>
                                                    <TableCell className="w-1/4 text-center">{formatNumber(item.weight)}</TableCell>
                                                    <TableCell className="w-1/4 text-right font-medium text-primary">
                                                        {formatCurrency(itemPrice)}
                                                        {category.unit === 'm' && (
                                                            <div className="text-xs text-muted-foreground font-normal">
                                                                {formatCurrency(itemPrice * 6)} / barra
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                                {isSelected && category.unit === 'm' && (
                                                    <TableRow>
                                                        <TableCell colSpan={3} className="p-0">
                                                            <div className="p-4 bg-primary/5">
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
            ))}
        </Accordion>
    </div>
  )
}
