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
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import type { Category, SteelItem } from "@/lib/data";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { PlusCircle, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "./ui/dialog";
import { Label } from "./ui/label";

interface ItemTableProps {
  category: Category;
  sellingPrice: number;
}

export function ItemTable({ category, sellingPrice }: ItemTableProps) {
  const [items, setItems] = React.useState<SteelItem[]>(category.items);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const [newDescription, setNewDescription] = React.useState("");
  const [newWeight, setNewWeight] = React.useState<number | "">("");

  React.useEffect(() => {
    setItems(category.items);
    setSearchTerm("");
  }, [category]);

  const handleAddItem = () => {
    if (newDescription && newWeight) {
      const newItem: SteelItem = {
        id: `custom-${Date.now()}`,
        description: newDescription,
        weight: Number(newWeight),
      };
      setItems([...items, newItem]);
      setNewDescription("");
      setNewWeight("");
      setIsDialogOpen(false);
    }
  };
  
  const filteredItems = items.filter((item) =>
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const unitLabel = category.unit === "m" ? "m" : "m²";
  const weightUnitLabel = `kg/${unitLabel}`;
  const priceUnitLabel = `R$/${unitLabel}`;

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>{category.name}</CardTitle>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar item..."
              className="pl-8 sm:w-[200px] md:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
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
                  <Label htmlFor="description" className="text-right">
                    Descrição
                  </Label>
                  <Input
                    id="description"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="weight" className="text-right">
                    Peso ({weightUnitLabel})
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    value={newWeight}
                    onChange={(e) =>
                      setNewWeight(
                        e.target.value === "" ? "" : e.target.valueAsNumber
                      )
                    }
                    className="col-span-3"
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
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descrição</TableHead>
                <TableHead className="text-right">
                  Peso ({weightUnitLabel})
                </TableHead>
                <TableHead className="text-right font-semibold text-primary">
                  Preço ({priceUnitLabel})
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.description}</TableCell>
                  <TableCell className="text-right">
                    {formatNumber(item.weight, 3)}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(item.weight * sellingPrice)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
