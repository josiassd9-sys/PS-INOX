
"use client";

import * as React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Category, ConnectionGroup } from "@/lib/data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ConnectionWeightCalculator } from "./connection-weight-calculator";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface ConnectionsTableProps {
  category: Category;
  sellingPrice: number;
  editedWeights: Record<string, number>;
  onWeightChange: (itemId: string, newWeight: number) => void;
}

export function ConnectionsTable({
  category,
  sellingPrice,
  editedWeights,
  onWeightChange,
}: ConnectionsTableProps) {
  const connectionGroups = category.items as ConnectionGroup[];
  const [selectedItemForEdit, setSelectedItemForEdit] = React.useState<any>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const formatCurrency = (value: number) => {
    const formatter = new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    const formatted = formatter.format(value); 

    const parts = formatted.split(',');
    const integerPart = parts[0];
    const decimalPart = parts[1];

    let thousandsPart = '';
    let hundredsPart = '';

    if (integerPart.includes('.')) {
      const integerSplits = integerPart.split('.');
      thousandsPart = integerSplits.slice(0, -1).join('.') + '.';
      hundredsPart = integerSplits.slice(-1)[0];
    } else {
      hundredsPart = integerPart;
    }

    return (
      <div className="flex items-baseline justify-end tabular-nums font-sans">
        <span className="text-[15px] font-semibold">{thousandsPart}</span>
        <span className="text-[12px] font-semibold">{hundredsPart}</span>
        <span className="text-[9px] self-start mt-px">,{decimalPart}</span>
      </div>
    );
  };
  
  const formatWeight = (value: number) => {
    const formatted = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 3, maximumFractionDigits: 3 }).format(value);
    const parts = formatted.split(',');
    const integerPart = parts[0];
    const decimalPart = parts[1];
    
    return (
        <div className="flex items-baseline justify-center tabular-nums font-sans text-[hsl(var(--text-item-red))]">
            <span className="text-[11px] font-semibold">{integerPart}</span>
            <span className="text-[8px] self-start mt-px">,{decimalPart} kg</span>
        </div>
    )
  }

  const handleEditClick = (item: any) => {
    setSelectedItemForEdit(item);
    setIsModalOpen(true);
  };

  const handleSaveWeight = (itemId: string, newWeight: number) => {
    onWeightChange(itemId, newWeight);
    setIsModalOpen(false);
    setSelectedItemForEdit(null);
  };
  
  const handleModalOpenChange = (isOpen: boolean) => {
      setIsModalOpen(isOpen);
      if (!isOpen) {
          setSelectedItemForEdit(null);
      }
  }


  return (
    <>
    <Accordion
      type="single"
      collapsible
      className="w-full space-y-1"
    >
      {connectionGroups.map((group) => (
        <AccordionItem
          value={group.id}
          key={group.id}
          className="border rounded-lg overflow-hidden bg-card"
        >
          <AccordionTrigger className="px-1 py-1 hover:bg-primary/10 text-lg font-semibold">
            {group.name} ({group.items.length})
          </AccordionTrigger>
          <AccordionContent className="p-0">
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent flex">
                      <TableHead className="flex-1 p-1 bg-[hsl(var(--sheet-table-header-bg))] text-[hsl(var(--sheet-table-header-fg))] font-bold">Descrição</TableHead>
                      <TableHead className="text-center p-1 w-[120px] bg-[hsl(var(--sheet-table-header-bg))] text-[hsl(var(--sheet-table-header-fg))] font-bold">Peso (kg/un)</TableHead>
                      <TableHead className="text-center p-1 w-[120px] bg-[hsl(var(--sheet-table-header-bg))] text-[hsl(var(--sheet-table-header-fg))] font-bold">Preço (R$/un)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {group.items.map((item, index) => {
                    const isEven = index % 2 === 1;
                    const currentWeight = editedWeights[item.id] ?? item.weight;
                    const itemPrice = Math.ceil(currentWeight * sellingPrice);

                    return (
                      <TableRow
                        key={item.id}
                        className={cn(
                            "flex items-stretch",
                            !isEven ? "bg-[hsl(var(--row-odd-bg))]" : "bg-[hsl(var(--row-even-bg))]"
                        )}
                      >
                        <TableCell className="font-medium text-[hsl(var(--text-item-pink))] text-[11px] flex-1 p-1">{item.description}</TableCell>
                        <TableCell className={cn("text-center p-1 w-[120px]",
                            !isEven ? "bg-[hsl(var(--row-odd-bg))]" : "bg-[hsl(var(--row-pmq-bg))]"
                          )}>
                           <Button
                              variant="outline"
                              className="h-8 w-full justify-center text-center border-primary/20 bg-transparent"
                              onClick={() => handleEditClick(item)}
                           >
                            <div className="flex flex-col items-center justify-center h-full">
                                {formatWeight(currentWeight)}
                            </div>
                           </Button>
                        </TableCell>
                        <TableCell className={cn(
                              "text-right font-semibold p-1 w-[120px]",
                               !isEven ? "bg-[hsl(var(--row-even-bg))]" : "bg-[hsl(var(--row-pmq-bg))]"
                          )}>
                          <div className="h-full flex items-center justify-end text-[hsl(var(--sheet-total-price-fg))]">
                            {formatCurrency(itemPrice)}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>

    <Dialog open={isModalOpen} onOpenChange={handleModalOpenChange}>
      <DialogContent>
         {selectedItemForEdit && (
          <>
            <DialogHeader>
              <DialogTitle>Ajustar Preço/Peso</DialogTitle>
            </DialogHeader>
            <ConnectionWeightCalculator
                connection={selectedItemForEdit}
                sellingPricePerKg={sellingPrice}
                currentWeight={editedWeights[selectedItemForEdit.id] ?? selectedItemForEdit.weight}
                onSave={handleSaveWeight}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
    </>
  );
}
