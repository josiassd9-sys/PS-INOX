"use client";

import * as React from "react";
import { v4 as uuidv4 } from "uuid";
import { Table, TableBody, TableCell, TableHeader, TableRow, TableHead } from "./ui/table";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { ScrapCalculator } from "./scrap-calculator";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { PsInoxLogo } from "./ps-inox-logo";
import Link from "next/link";

const SCRAP_LIST_KEY = "scrapBuilderList";

interface ScrapPiece {
    id: string;
    description: string;
    weight: number;
    price: number;
    pricePerKg?: number;
    quantity?: number;
    unit?: 'm' | 'kg' | 'un';
    listItemId: string;
    basePrice: number; 
    baseWeight: number;
}

interface EditFormProps {
    item: ScrapPiece;
    onUpdate: (listItemId: string, newQuantity: number) => void;
    onDelete: (listItemId: string) => void;
    onCancel: () => void;
}

function EditForm({ item, onUpdate, onDelete, onCancel }: EditFormProps) {
    const [quantity, setQuantity] = React.useState(item.quantity?.toString() ?? "1");

    const handleUpdate = () => {
        const newQuantity = parseInt(quantity, 10);
        if (!isNaN(newQuantity) && newQuantity > 0) {
            onUpdate(item.listItemId, newQuantity);
        }
    };
    
    const handleDelete = () => {
        onDelete(item.listItemId);
    }

    return (
        <TableRow className="bg-primary/10">
            <TableCell colSpan={4} className="p-2">
                <div className="flex items-end gap-2">
                    <div className="space-y-1">
                        <Label htmlFor="edit-quantity" className="text-xs">Quantidade</Label>
                        <Input
                            id="edit-quantity"
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            className="h-9 w-20"
                            min="1"
                        />
                    </div>
                    <Button onClick={handleUpdate} size="sm">Salvar</Button>
                    <Button onClick={handleDelete} variant="destructive" size="sm">Deletar</Button>
                    <Button onClick={onCancel} variant="ghost" size="sm">Cancelar</Button>
                </div>
            </TableCell>
        </TableRow>
    );
}

export function ScrapListBuilder() {
  const [scrapList, setScrapList] = React.useState<ScrapPiece[]>([]);
  const [editingItemId, setEditingItemId] = React.useState<string | null>(null);
  
  React.useEffect(() => {
    try {
        const savedList = localStorage.getItem(SCRAP_LIST_KEY);
        if (savedList) {
            setScrapList(JSON.parse(savedList));
        }
    } catch(error) {
        console.error("Failed to load data from localStorage", error);
    }
  }, []);

  const saveList = (list: ScrapPiece[]) => {
      try {
          localStorage.setItem(SCRAP_LIST_KEY, JSON.stringify(list));
      } catch (error) {
           console.error("Failed to save scrap list to localStorage", error);
      }
  }
  
  const handleAddItemToList = (item: any) => {
    const newItem: ScrapPiece = {
        ...item,
        listItemId: uuidv4(),
        basePrice: item.price / (item.quantity || 1),
        baseWeight: item.weight / (item.quantity || 1),
    };
    const newList = [...scrapList, newItem];
    setScrapList(newList);
    saveList(newList);
    setEditingItemId(null);
  }
  
  const handleRemoveFromList = (listItemId: string) => {
    const newList = scrapList.filter(item => item.listItemId !== listItemId);
    setScrapList(newList);
    saveList(newList);
    setEditingItemId(null);
  }

  const handleUpdateQuantity = (listItemId: string, newQuantity: number) => {
    const newList = scrapList.map(item => {
        if (item.listItemId === listItemId) {
            return {
                ...item,
                quantity: newQuantity,
                price: item.basePrice * newQuantity,
                weight: item.baseWeight * newQuantity,
            };
        }
        return item;
    });
    setScrapList(newList);
    saveList(newList);
    setEditingItemId(null);
  };

  const handleRowClick = (listItemId: string) => {
      if (editingItemId === listItemId) {
          setEditingItemId(null); 
      } else {
          setEditingItemId(listItemId);
      }
  }
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatPrice = (value: number) => {
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
      <div className="flex items-baseline justify-end tabular-nums">
        <span className="text-sm font-semibold">R$</span>
        <span className="text-sm font-bold text-[14px]">{thousandsPart}</span>
        <span className="text-[10px] font-semibold">{hundredsPart}</span>
        <span className="text-[6px] self-start mt-px">,{decimalPart}</span>
      </div>
    );
  };
  
  const formatWeight = (value: number) => {
    const formatted = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 3, maximumFractionDigits: 3 }).format(value);
    const parts = formatted.split(',');
    const integerPart = parts[0];
    const decimalPart = parts[1];
    
    return (
        <div className="flex items-baseline justify-center tabular-nums">
            <span className="text-[10px]">{integerPart}</span>
            <span className="text-[6px] self-start mt-px">,{decimalPart} kg</span>
        </div>
    )
  }
  
  const totalListPrice = scrapList.reduce((acc, item) => acc + item.price, 0);
  const totalListWeight = scrapList.reduce((acc, item) => acc + item.weight, 0);

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden bg-background text-foreground p-1 gap-1">
        <div className="flex justify-center py-1">
            <Link href="/">
              <PsInoxLogo />
            </Link>
        </div>
        
        <ScrapCalculator onAddItem={handleAddItemToList} />

        {scrapList.length > 0 && (
            <div id="scrap-list-section" className="flex-1 flex flex-col min-h-0 pt-2 border-t mt-2">
                <h2 className="text-lg font-semibold text-center mb-1 text-foreground">Lista de Retalhos</h2>
                 <Card className="flex-1 overflow-hidden flex flex-col bg-card border-border">
                    <CardContent className="p-0 flex-1 overflow-y-auto">
                       <Table>
                           <TableHeader>
                               <TableRow className="border-b-border hover:bg-muted/50 flex">
                                   <TableHead className="flex-1 pl-2 pr-1 py-1">Descrição</TableHead>
                                   <TableHead className="text-center p-1 w-[80px]">PMQ</TableHead>
                                   <TableHead className="text-right p-1 w-[80px] bg-muted/50">Preço</TableHead>
                               </TableRow>
                           </TableHeader>
                           <TableBody>
                               {scrapList.map(item => (
                                   <React.Fragment key={item.listItemId}>
                                    <TableRow 
                                        onClick={() => handleRowClick(item.listItemId)}
                                        className={cn("flex items-center cursor-pointer", editingItemId === item.listItemId && "bg-primary/20")}
                                    >
                                      <TableCell className="font-medium text-[11px] flex-1 pl-2 pr-1 py-1">{item.description}</TableCell>
                                       <TableCell className="text-center text-muted-foreground p-1 w-[80px]">
                                          <div className="flex flex-col items-center">
                                            <span className="text-xs">{(item.unit === 'un' || item.unit === 'm' || item.unit === 'kg') && item.quantity ? `${item.quantity} pç` : ''}</span>
                                            {formatWeight(item.weight)}
                                          </div>
                                      </TableCell>
                                      <TableCell className="text-right font-semibold text-accent-price p-1 w-[80px] bg-muted/50">
                                        {formatPrice(item.price)}
                                      </TableCell>
                                    </TableRow>
                                    {editingItemId === item.listItemId && (
                                        <EditForm 
                                            item={item}
                                            onUpdate={handleUpdateQuantity}
                                            onDelete={handleRemoveFromList}
                                            onCancel={() => setEditingItemId(null)}
                                        />
                                    )}
                                   </React.Fragment>
                               ))}
                           </TableBody>
                       </Table>
                    </CardContent>
                 </Card>
            </div>
        )}

        {scrapList.length > 0 && (
            <div className="shrink-0 border-t border-border bg-background/95 backdrop-blur-sm p-2 space-y-1">
                <div className="flex items-center justify-between">
                    <span className="text-base font-semibold">Peso Total</span>
                    <span className="text-right text-base font-bold text-primary">{formatWeight(totalListWeight)}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-right text-lg font-bold text-accent-price">{formatCurrency(totalListPrice)}</span>
                </div>
            </div>
        )}
      </div>
  );
}
