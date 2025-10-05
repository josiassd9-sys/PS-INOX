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
import type { Category, ConnectionGroup, ConnectionItem } from "@/lib/data";
import { Input } from "./ui/input";

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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };
  
  const handleWeightBlur = (itemId: string, event: React.FocusEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(",", ".");
    const newWeight = parseFloat(value);
    if (!isNaN(newWeight)) {
        onWeightChange(itemId, newWeight);
    }
  };

  const handleWeightChangeLocal = (itemId: string, value: string, setter: (val: string) => void) => {
     const sanitizedValue = value.replace(/[^0-9,.]/g, '').replace('.', ',');
      if (/^\d*\,?\d*$/.test(sanitizedValue)) {
        setter(sanitizedValue);
    }
  }


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
                    const currentWeight = editedWeights[item.id] ?? item.weight;
                    const itemPrice = Math.ceil(currentWeight * sellingPrice);
                    
                    const [localWeight, setLocalWeight] = React.useState(currentWeight.toFixed(3).replace('.', ','));

                    React.useEffect(() => {
                        setLocalWeight((editedWeights[item.id] ?? item.weight).toFixed(3).replace('.', ','));
                    }, [editedWeights, item.id, item.weight]);

                    return (
                      <TableRow
                        key={item.id}
                        className="even:bg-primary/5 odd:bg-transparent flex items-center"
                      >
                        <TableCell className="flex-1 px-1">{item.description}</TableCell>
                        <TableCell className="w-1/3 text-center px-1">
                           <Input
                                type="text"
                                inputMode="decimal"
                                value={localWeight}
                                onBlur={(e) => handleWeightBlur(item.id, e)}
                                onChange={(e) => handleWeightChangeLocal(item.id, e.target.value, setLocalWeight)}
                                className="h-8 text-center border-primary/20 bg-transparent"
                            />
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
