
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Calculator, Printer, Save, Trash2 } from "lucide-react";
import type { BudgetItem } from "@/lib/data";
import { cn } from "@/lib/utils";

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

    const DataRow = ({ label, value, className }: { label: string, value: React.ReactNode, className?: string }) => (
        <div className={cn("flex justify-between items-center text-sm py-1 border-b border-dashed", className)}>
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="font-semibold text-right">{value}</dd>
        </div>
    );

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
            <CardContent>
                {/* Desktop and Print View */}
                <div className="overflow-x-auto hidden md:block print:block">
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
                </div>
                
                {/* Mobile View */}
                <div className="space-y-2 md:hidden print:hidden">
                    {items.map(item => (
                        <Card key={item.id} className="bg-muted/50">
                            <CardContent className="p-2">
                                <dl>
                                    <DataRow label="Item" value={item.type} />
                                    <DataRow label="Perfil/Descrição" value={(item.perfil as any).nome} />
                                    <DataRow label="Qtd." value={item.quantity} />
                                    <DataRow label="Vão/Área/Alt." value={item.type === 'Steel Deck' ? `${item.quantity} m²` : item.type === 'Pilar' ? `${formatNumber(item.height || 0)} m` : `${formatNumber(item.span || 0)} m`} />
                                    <DataRow label="Peso/Unid. (kg)" value={formatNumber(item.weightPerUnit)} />
                                    <DataRow label="Peso Total (kg)" value={formatNumber(item.totalWeight)} />
                                    <DataRow label="Custo/Unid. (R$)" value={formatCurrency(item.costPerUnit)} />
                                    <DataRow label="Custo Total (R$)" value={<span className="text-primary font-bold">{formatCurrency(item.totalCost)}</span>} />
                                </dl>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Separator className="my-4"/>
                <div className="flex flex-col md:flex-row justify-end items-stretch md:items-center gap-4">
                    <div className="text-right p-2 rounded-lg border">
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
