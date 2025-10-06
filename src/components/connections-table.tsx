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
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };
  
  const formatNumber = (value: number) => {
     return new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    }).format(value);
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

                    return (
                      <TableRow
                        key={item.id}
                        className="even:bg-primary/5 odd:bg-transparent flex items-center"
                      >
                        <TableCell className="flex-1 px-1">{item.description}</TableCell>
                        <TableCell className="w-1/3 text-center px-1">
                           <Button
                              variant="outline"
                              className="h-8 w-full justify-center text-center border-primary/20 bg-transparent"
                              onClick={() => handleEditClick(item)}
                           >
                            {formatNumber(currentWeight)}
                           </Button>
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
