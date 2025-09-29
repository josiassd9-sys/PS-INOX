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
import type { Category, ScrapItem } from "@/lib/data";
import { Button } from "./ui/button";
import { PlusCircle, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface ScrapTableProps {
  category: Category;
}

export function ScrapTable({ category }: ScrapTableProps) {
  const [items, setItems] = React.useState<ScrapItem[]>(category.items as ScrapItem[]);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const [newMaterial, setNewMaterial] = React.useState("");
  const [newComposition, setNewComposition] = React.useState("");
  const [newPrice, setNewPrice] = React.useState<number | "">("");

  React.useEffect(() => {
    setItems(category.items as ScrapItem[]);
  }, [category]);

  const handleAddItem = () => {
    if (newMaterial && newPrice !== "") {
      const newItem: ScrapItem = {
        id: `custom-scrap-${Date.now()}`,
        material: newMaterial,
        composition: newComposition,
        price: Number(newPrice),
      };
      setItems([...items, newItem]);
      setNewMaterial("");
      setNewComposition("");
      setNewPrice("");
      setIsDialogOpen(false);
    }
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  }

  const handlePriceChange = (id: string, newPrice: number | string) => {
    const priceAsNumber = typeof newPrice === 'string' ? parseFloat(newPrice) : newPrice;
    if (!isNaN(priceAsNumber)) {
        setItems(items.map(item => item.id === id ? { ...item, price: priceAsNumber } : item));
    }
  }
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <>
    <div className="flex items-center justify-end -mt-6 -mx-6 mb-4 p-6 pb-0">
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
                <Label htmlFor="material" className="text-right">
                  Material
                </Label>
                <Input
                  id="material"
                  value={newMaterial}
                  onChange={(e) => setNewMaterial(e.target.value)}
                  className="col-span-3"
                  placeholder="Ex: Inox 304"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="composition" className="text-right">
                  Composição
                </Label>
                <Input
                  id="composition"
                  value={newComposition}
                  onChange={(e) => setNewComposition(e.target.value)}
                  className="col-span-3"
                   placeholder="Ex: 18% Cr, 8% Ni"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">
                  Preço (R$/kg)
                </Label>
                <Input
                  id="price"
                  type="number"
                  value={newPrice}
                  onChange={(e) =>
                    setNewPrice(
                      e.target.value === "" ? "" : e.target.valueAsNumber
                    )
                  }
                  className="col-span-3"
                   placeholder="Ex: 8.50"
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
      <div className="-mx-6 -mt-6 border-t">
        <Table>
          <TableHeader>
             <TableRow className="bg-primary/5 hover:bg-primary/10 flex">
                <TableHead className="flex-1 px-8">Material (Composição)</TableHead>
                <TableHead className="w-1/3 text-right font-semibold text-primary px-8">
                  Preço (R$/kg)
                </TableHead>
                 <TableHead className="w-12 px-2"></TableHead>
              </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id} className="even:bg-primary/5 odd:bg-transparent flex items-center">
                <TableCell className="flex-1 px-8">
                  <div className="font-medium">{item.material}</div>
                  <div className="text-xs text-muted-foreground">{item.composition}</div>
                </TableCell>
                <TableCell className="w-1/3 text-right font-medium text-primary px-8">
                    <Input
                        type="number"
                        value={item.price}
                        onChange={(e) => handlePriceChange(item.id, e.target.value)}
                        className="h-8 text-right border-primary/20 bg-transparent"
                    />
                </TableCell>
                <TableCell className="w-12 px-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleRemoveItem(item.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      </>
  );
}
