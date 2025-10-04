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
import type { Category, ConnectionGroup, SteelItem } from "@/lib/data";

interface ConnectionsTableProps {
  category: Category;
  costMultiplier: number;
  markupPercentage: number;
}

export function ConnectionsTable({
  category,
  costMultiplier,
  markupPercentage,
}: ConnectionsTableProps) {
  const connectionGroups = category.items as ConnectionGroup[];

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

  const calculateItemPrice = (item: SteelItem) => {
    const itemCost = item.costPrice || 0;
    const finalCost = itemCost * costMultiplier;
    return Math.ceil(finalCost * (1 + markupPercentage / 100));
  };

  return (
    <Accordion
      type="multiple"
      className="w-full space-y-1"
      defaultValue={connectionGroups.map((g) => g.id)}
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
            <div className="overflow-auto border-t">
              <Table>
                <TableHeader>
                  <TableRow className="bg-primary/5 hover:bg-primary/10 flex">
                    <TableHead className="flex-1 px-1">Descrição</TableHead>
                    <TableHead className="w-1/3 text-center px-1">
                      Peso (kg/un)
                    </TableHead>
                    <TableHead className="w-1/3 text-right font-semibold text-primary px-1">
                      Preço (R$/un)
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {group.items.map((item) => {
                    const itemPrice = calculateItemPrice(item);
                    return (
                      <TableRow
                        key={item.id}
                        className="even:bg-primary/5 odd:bg-transparent flex items-center"
                      >
                        <TableCell className="flex-1 px-1">{item.description}</TableCell>
                        <TableCell className="w-1/3 text-center px-1">
                          {formatNumber(item.weight)}
                        </TableCell>
                        <TableCell className="w-1/3 text-right font-medium text-primary px-1">
                          {formatCurrency(itemPrice)}
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
  );
}
