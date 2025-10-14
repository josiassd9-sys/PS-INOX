
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Calculator, Printer, Save, Trash2 } from "lucide-react";
import type { BudgetItem } from "@/lib/data";

interface BudgetTableProps {
    items: BudgetItem[];
    onClear: () => void;
    onSave: () => void;
    onPrint: () => void;
}

export function BudgetTable({ items, onClear, onSave, onPrint }: BudgetTableProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    }

    const formatNumber = (value: number, decimals = 2) => {
        return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value);
    }
    
    const totalBudgetCost = items.reduce((acc, item) => acc + item.totalCost, 0);
    const totalBudgetWeight = items.reduce((acc, item) => acc + item.totalWeight, 0);

    return (
        <Card className="print:shadow-none print:border-none">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2"><Calculator className="h-6 w-6"/> Orçamento de Perfis Estruturais</CardTitle>
                        <CardDescription>Lista de itens calculados para o projeto.</CardDescription>
                    </div>
                    <div className="flex items-center gap-1 print:hidden">
                        <Button variant="ghost" size="icon" onClick={onSave} className="text-muted-foreground hover:text-primary">
                            <Save className="h-5 w-5"/>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={onPrint} className="text-muted-foreground hover:text-primary">
                            <Printer className="h-5 w-5"/>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={onClear} className="text-destructive/70 hover:text-destructive">
                            <Trash2 className="h-5 w-5"/>
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Item</TableHead>
                            <TableHead>Perfil/Descrição</TableHead>
                            <TableHead className="text-center">Qtd.</TableHead>
                            <TableHead className="text-center">Vão/Área/Alt.</TableHead>
                            <TableHead className="text-center">Peso/Unid. (kg)</TableHead>
                            <TableHead className="text-center">Peso Total (kg)</TableHead>
                            <TableHead className="text-right">Custo/Unid. (R$)</TableHead>
                            <TableHead className="text-right">Custo Total (R$)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.map(item => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.type}</TableCell>
                                <TableCell>{(item.perfil as any).nome}</TableCell>
                                <TableCell className="text-center">{item.quantity}</TableCell>
                                <TableCell className="text-center">
                                    {item.type === 'Steel Deck' ? `${item.quantity} m²` : item.type === 'Pilar' ? `${formatNumber(item.height || 0)} m` : `${formatNumber(item.span || 0)} m`}
                                </TableCell>
                                <TableCell className="text-center">{formatNumber(item.weightPerUnit)}</TableCell>
                                <TableCell className="text-center font-semibold">{formatNumber(item.totalWeight)}</TableCell>
                                <TableCell className="text-right">{formatCurrency(item.costPerUnit)}</TableCell>
                                <TableCell className="text-right font-semibold">{formatCurrency(item.totalCost)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Separator className="my-4"/>
                <div className="flex justify-end items-center gap-8">
                    <div className="text-right">
                        <p className="text-sm text-muted-foreground">Peso Total do Orçamento</p>
                        <p className="text-xl font-bold">{formatNumber(totalBudgetWeight, 2)} kg</p>
                    </div>
                    <div className="text-right rounded-lg bg-primary/10 p-2 border border-primary/20">
                        <p className="text-sm text-primary">Custo Total do Orçamento</p>
                        <p className="text-2xl font-bold text-primary">{formatCurrency(totalBudgetCost)}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
