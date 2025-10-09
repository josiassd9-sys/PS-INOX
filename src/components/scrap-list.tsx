
"use client";

import * as React from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow, TableHead } from "./ui/table";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { Printer, Trash2 } from "lucide-react";

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

interface ScrapListProps {
    scrapList: ScrapPiece[];
    editingItemId: string | null;
    onRowClick: (id: string) => void;
    onUpdateQuantity: (id: string, qty: number) => void;
    onDelete: (id: string) => void;
    onCancelEdit: () => void;
    onClearList: () => void;
}

export function ScrapList({
    scrapList,
    editingItemId,
    onRowClick,
    onUpdateQuantity,
    onDelete,
    onCancelEdit,
    onClearList
}: ScrapListProps) {
    
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
            <span className="font-bold text-[15px]">{thousandsPart}</span>
            <span className="text-[12px] font-semibold">{hundredsPart}</span>
            <span className="text-[9px] self-start mt-px">,{decimalPart}</span>
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
                <span className="text-[11px]">{integerPart}</span>
                <span className="text-[8px] self-start mt-px">,{decimalPart} kg</span>
            </div>
        )
      }
      
      const totalListPrice = scrapList.reduce((acc, item) => acc + item.price, 0);
      const totalListWeight = scrapList.reduce((acc, item) => acc + item.weight, 0);

      if (scrapList.length === 0) {
        return (
            <div className="text-center text-muted-foreground flex-1 flex items-center justify-center">
                <p>A lista de retalhos está vazia.</p>
            </div>
        );
      }

    return (
        <div id="scrap-list-section" className="flex-1 flex flex-col min-h-0">
            <h2 className="text-lg font-semibold text-center mb-1 text-foreground">Lista de Retalhos</h2>
             <Card className="flex-1 overflow-hidden flex flex-col bg-transparent border-none shadow-none">
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
                                    onClick={() => onRowClick(item.listItemId)}
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
                                        onUpdate={onUpdateQuantity}
                                        onDelete={onDelete}
                                        onCancel={onCancelEdit}
                                    />
                                )}
                               </React.Fragment>
                           ))}
                       </TableBody>
                   </Table>
                </CardContent>
             </Card>

            <div className="shrink-0 border-t border-border bg-card/95 backdrop-blur-sm p-2 space-y-1 mt-auto">
                <div className="flex items-center justify-between">
                    <span className="text-base font-semibold">Peso Total</span>
                    <span className="text-right text-base font-bold text-primary">{formatWeight(totalListWeight)}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-right text-lg font-bold text-accent-price">{formatCurrency(totalListPrice)}</span>
                </div>
                <div className="flex justify-end pt-1 gap-1 print:hidden">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                                <Trash2 className="mr-1 h-4 w-4" />
                                Limpar
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Esta ação não pode ser desfeita. Isso limpará todos os itens da sua lista de retalhos.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={onClearList}>Sim, Limpar Lista</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    <Button onClick={() => window.print()} size="sm">
                        <Printer className="mr-1 h-4 w-4" />
                        Imprimir
                    </Button>
                </div>
            </div>
        </div>
    )
}
