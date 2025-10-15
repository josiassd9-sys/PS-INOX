
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
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { steelDeckData } from "@/lib/data/steel-deck";
import type { SteelDeck } from "@/lib/data/steel-deck";
import { Dashboard } from "@/components/dashboard";
import { Badge } from "@/components/ui/badge";

function SteelDeckTableComponent() {

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Tabela de Steel Deck</CardTitle>
          <CardDescription>
            Consulte as propriedades e vãos máximos para lajes colaborantes tipo Steel Deck.
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold">Modelo</TableHead>
                <TableHead>Espessura (mm)</TableHead>
                <TableHead>Peso (kg/m²)</TableHead>
                <TableHead colSpan={3} className="text-center">Vão Simples (m)</TableHead>
                <TableHead colSpan={3} className="text-center">Vão Duplo (m)</TableHead>
              </TableRow>
              <TableRow>
                <TableHead></TableHead>
                <TableHead></TableHead>
                <TableHead></TableHead>
                <TableHead className="text-center"><Badge variant="outline">150 kgf</Badge></TableHead>
                <TableHead className="text-center"><Badge variant="outline">250 kgf</Badge></TableHead>
                <TableHead className="text-center"><Badge variant="outline">400 kgf</Badge></TableHead>
                <TableHead className="text-center"><Badge variant="outline">150 kgf</Badge></TableHead>
                <TableHead className="text-center"><Badge variant="outline">250 kgf</Badge></TableHead>
                <TableHead className="text-center"><Badge variant="outline">400 kgf</Badge></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {steelDeckData.map((deck) => (
                <TableRow key={deck.nome}>
                  <TableCell className="font-medium">{deck.nome}</TableCell>
                  <TableCell>{formatNumber(deck.espessuraChapa)}</TableCell>
                  <TableCell>{formatNumber(deck.pesoProprio)}</TableCell>
                  <TableCell className="text-center">{formatNumber(deck.vaosMaximos.simples['150kgf'])}</TableCell>
                  <TableCell className="text-center">{formatNumber(deck.vaosMaximos.simples['250kgf'])}</TableCell>
                  <TableCell className="text-center">{formatNumber(deck.vaosMaximos.simples['400kgf'])}</TableCell>
                  <TableCell className="text-center bg-muted/50">{formatNumber(deck.vaosMaximos.duplo['150kgf'])}</TableCell>
                  <TableCell className="text-center bg-muted/50">{formatNumber(deck.vaosMaximos.duplo['250kgf'])}</TableCell>
                  <TableCell className="text-center bg-muted/50">{formatNumber(deck.vaosMaximos.duplo['400kgf'])}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Page() {
  return (
    <Dashboard initialCategoryId="perfis/tabela-steel-deck">
      <SteelDeckTableComponent />
    </Dashboard>
  );
}
