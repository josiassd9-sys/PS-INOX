"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import type { Category } from "@/lib/data";

interface ItemTableProps {
  category: Category;
  sellingPrice: number;
}

export function ItemTable({ category, sellingPrice }: ItemTableProps) {
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

  const unitLabel = category.unit === 'm' ? 'm' : 'm²';
  const weightUnitLabel = `kg/${unitLabel}`;
  const priceUnitLabel = `R$/${unitLabel}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{category.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descrição</TableHead>
                <TableHead>Especificação</TableHead>
                <TableHead className="text-right">Peso ({weightUnitLabel})</TableHead>
                <TableHead className="text-right font-semibold text-primary">Preço ({priceUnitLabel})</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {category.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.specs}</TableCell>
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
