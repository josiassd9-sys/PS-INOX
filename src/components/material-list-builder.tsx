

"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { PsInoxLogo } from "./ps-inox-logo";
import { Input } from "./ui/input";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";
import { Table, TableBody, TableCell, TableHeader, TableRow, TableHead } from "./ui/table";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import Link from "next/link";
import { SteelItem, ALL_CATEGORIES, ConnectionGroup, ConnectionItem, Category } from "../lib/data";
import { GlobalSearchResults } from "./global-search-results";
import { COST_ADJUSTMENTS_LOCAL_STORAGE_KEY, EDITED_CONNECTIONS_WEIGHTS_KEY } from "./dashboard";
import { Label } from "./ui/label";
import { cn } from "@/lib/utils";
import { ScrapCalculator } from "./scrap-calculator";


const MATERIAL_LIST_KEY = "materialBuilderList";
const PRICE_PARAMS_LOCAL_STORAGE_KEY = "priceParamsState";


interface ListItem extends SteelItem {
    listItemId: string;
    price: number;
    quantity: number;
    length?: number;
    basePrice: number; // Price for quantity 1
    baseWeight: number; // Weight for quantity 1
}

interface PriceParams {
  costPrice: number;
  markup: number;
  sellingPrice: number;
}

const initializePriceParams = (): Record<string, PriceParams> => {
  let params: Record<string, PriceParams> = {
    global: { costPrice: 30, markup: 50, sellingPrice: 45 },
  };

  try {
    const savedParams = localStorage.getItem(PRICE_PARAMS_LOCAL_STORAGE_KEY);
    if (savedParams) {
      const parsed = JSON.parse(savedParams);
      if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
          params = parsed;
      }
    }
  } catch (error) {
    console.error("Failed to load price params from localStorage", error);
  }
  return params;
};

interface EditFormProps {
    item: ListItem;
    onUpdate: (listItemId: string, newQuantity: number) => void;
    onDelete: (listItemId: string) => void;
    onCancel: () => void;
}

function EditForm({ item, onUpdate, onDelete, onCancel }: EditFormProps) {
    const [quantity, setQuantity] = React.useState(item.quantity.toString());

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
            <TableCell colSpan={3} className="p-2">
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


export function MaterialListBuilder() {
  const [materialList, setMaterialList] = React.useState<ListItem[]>([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [editingItemId, setEditingItemId] = React.useState<string | null>(null);

  const [priceParams, setPriceParams] = React.useState<Record<string, PriceParams>>({});
  const [costAdjustments, setCostAdjustments] = React.useState<Record<string, number>>({});
  
  React.useEffect(() => {
    try {
        const savedList = localStorage.getItem(MATERIAL_LIST_KEY);
        if (savedList) {
            setMaterialList(JSON.parse(savedList));
        }

        setPriceParams(initializePriceParams());

        const savedAdjustments = localStorage.getItem(COST_ADJUSTMENTS_LOCAL_STORAGE_KEY);
        if (savedAdjustments) {
          setCostAdjustments(JSON.parse(savedAdjustments));
        }

    } catch(error) {
        console.error("Failed to load data from localStorage", error);
    }
  }, []);

  const saveList = (list: ListItem[]) => {
      try {
          localStorage.setItem(MATERIAL_LIST_KEY, JSON.stringify(list));
      } catch (error) {
           console.error("Failed to save material list to localStorage", error);
      }
  }
  
  const handleAddItemToList = (item: any) => {
    const newItem: ListItem = {
        ...item,
        listItemId: uuidv4(),
        basePrice: item.price / (item.quantity || 1),
        baseWeight: item.weight / (item.quantity || 1),
    };
    const newList = [...materialList, newItem];
    setMaterialList(newList);
    saveList(newList);
    setSearchTerm("");
    setEditingItemId(null);
  }
  
  const handleRemoveFromList = (listItemId: string) => {
    const newList = materialList.filter(item => item.listItemId !== listItemId);
    setMaterialList(newList);
    saveList(newList);
    setEditingItemId(null);
  }

  const handleUpdateQuantity = (listItemId: string, newQuantity: number) => {
    const newList = materialList.map(item => {
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
    setMaterialList(newList);
    saveList(newList);
    setEditingItemId(null);
  };

  const handleRowClick = (listItemId: string) => {
      if (editingItemId === listItemId) {
          setEditingItemId(null); // Close if clicking the same item
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
      <div className="flex items-baseline justify-end tabular-nums font-sans">
        <span className="text-[15px] font-semibold">{thousandsPart}</span>
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
        <div className="flex items-baseline justify-center tabular-nums font-sans">
            <span className="text-[11px] font-semibold">{integerPart}</span>
            <span className="text-[8px] self-start mt-px">,{decimalPart} kg</span>
        </div>
    )
  }
  
  const totalListPrice = materialList.reduce((acc, item) => acc + item.price, 0);

  const isScrapCalculatorActive = searchTerm.trim().length > 0 && ('retalho'.startsWith(searchTerm.toLowerCase()) || 'ret'.startsWith(searchTerm.toLowerCase()));


  const filteredCategories = React.useMemo(() => {
    if (isScrapCalculatorActive || !searchTerm) {
      return [];
    }
  
    const safeSearchTerm = searchTerm.replace(",", ".").toLowerCase();
  
    return ALL_CATEGORIES.map((category) => {
        let filteredItems: any[] = [];
        
        if (category.id === "conexoes") {
          const connectionGroups = category.items as ConnectionGroup[];
          const filteredGroups = connectionGroups
            .map((group) => {
              const items = group.items.filter(
                (item: ConnectionItem) =>
                  item.description &&
                  item.description
                    .toLowerCase()
                    .replace(",", ".")
                    .includes(safeSearchTerm)
              );
              return { ...group, items };
            })
            .filter((group) => group.items.length > 0);
          
          if (filteredGroups.length > 0) {
             return { ...category, items: filteredGroups };
          }
           return null;
  
        } else {
            if (Array.isArray(category.items)) {
                filteredItems = (category.items as SteelItem[]).filter(
                    (item) =>
                    item.description &&
                    item.description
                        .toLowerCase()
                        .replace(",", ".")
                        .includes(safeSearchTerm)
                );
            }
        }
        
        if (filteredItems.length > 0) {
            return { ...category, items: filteredItems };
        }
        
        return null;
        
      })
      .filter((category): category is Category => category !== null);
  }, [searchTerm, isScrapCalculatorActive]);

  const renderContent = () => {
    if (isScrapCalculatorActive) {
      return (
        <div className="p-2 bg-card rounded-lg border">
          <h2 className="text-lg font-semibold text-center mb-1 text-foreground">Calculadora de Retalhos</h2>
          <ScrapCalculator onAddItem={handleAddItemToList} />
        </div>
      );
    }
    
    if (searchTerm) {
      return (
        <GlobalSearchResults
          categories={filteredCategories as any}
          priceParams={priceParams}
          searchTerm={searchTerm}
          costAdjustments={costAdjustments}
          onItemClick={() => {}} 
          onAddItem={handleAddItemToList}
          isScrapCalculatorActive={isScrapCalculatorActive}
        />
      );
    }
    
    if (materialList.length > 0) {
      return (
        <div id="material-list-section" className="flex-1 flex flex-col min-h-0 pt-2 print:pt-0">
             <Card className="flex-1 overflow-hidden flex flex-col border-black">
                <CardContent className="p-0 flex-1 overflow-y-auto">
                   <Table>
                       <TableHeader>
                           <TableRow className="border-b-black hover:bg-transparent flex">
                               <TableHead className="flex-1 p-1 bg-table-header-bg text-table-header-fg border-r border-black font-bold">Descrição</TableHead>
                               <TableHead className="text-center p-1 w-[80px] bg-table-header-bg text-table-header-fg border-r border-black font-bold">PMQ</TableHead>
                               <TableHead className="text-center p-1 w-[80px] bg-table-header-bg text-table-header-fg font-bold">VALOR</TableHead>
                           </TableRow>
                       </TableHeader>
                       <TableBody>
                           {materialList.map((item, index) => {
                                const isEven = index % 2 === 1;
                               return (
                               <React.Fragment key={item.listItemId}>
                                <TableRow 
                                    onClick={() => handleRowClick(item.listItemId)}
                                    className={cn("flex items-stretch cursor-pointer border-b-black", editingItemId === item.listItemId && "bg-primary/20")}
                                >
                                  <TableCell className={cn(
                                      "font-medium text-[11px] flex-1 p-1 border-r border-black text-table-item-fg",
                                      isEven ? "bg-[hsl(var(--row-even-bg-accent))]" : "bg-[hsl(var(--row-odd-bg-standard))]"
                                  )}>
                                    {item.description}
                                  </TableCell>
                                  <TableCell className={cn(
                                      "text-center p-1 w-[80px] border-r border-black",
                                      isEven ? "bg-[hsl(var(--row-even-bg-strong))]" : "bg-[hsl(var(--row-odd-bg-standard))]"
                                  )}>
                                      <div className="flex flex-col items-center justify-center h-full">
                                        <span className="text-xs">{item.unit === 'm' ? 'M' : item.unit.toUpperCase()}</span>
                                        {formatWeight(item.weight)}
                                      </div>
                                  </TableCell>
                                  <TableCell className={cn(
                                      "text-right font-semibold p-1 w-[80px]",
                                      isEven ? "bg-[hsl(var(--row-even-bg-strong))]" : "bg-[hsl(var(--row-odd-bg-accent))]"
                                  )}>
                                    <div className="h-full flex items-center justify-end text-[hsl(var(--table-price-fg))]">
                                      {formatPrice(item.price)}
                                    </div>
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
                           )})}
                       </TableBody>
                   </Table>
                </CardContent>
             </Card>
        </div>
      );
    }
    
    return (
      <div className="text-center text-muted-foreground py-10">
          <p>Sua lista de materiais está vazia.</p>
          <p>Use a busca acima para adicionar itens.</p>
      </div>
    );
  };


  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden bg-background text-foreground">
        
        <div style={{backgroundColor: 'var(--table-header-bg)'}} className="relative z-40 w-full px-8 py-1 flex flex-col gap-1 shrink-0 print:hidden">
            <div className="flex justify-center pt-1 text-4xl font-bold text-white tracking-wider">
                PS INOX
            </div>
            
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                type="search"
                placeholder="Buscar materiais ou 'retalho'..."
                className="w-full rounded-lg bg-muted pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>

        <div className="flex-1 mt-px overflow-y-auto relative z-0 p-1 min-h-0">
             {renderContent()}
        </div>

        {materialList.length > 0 && !searchTerm && (
            <div style={{backgroundColor: 'var(--table-header-bg)'}} className="shrink-0 border-t-2 border-black p-2 print:hidden">
                <div className="flex items-center justify-end gap-4">
                    <span className="text-lg font-bold text-white">Total</span>
                    <span className="text-right text-lg font-bold text-green-500 bg-white px-2 py-1 rounded-sm min-w-[120px]">{formatCurrency(totalListPrice)}</span>
                </div>
            </div>
        )}
      </div>
  );
}

    


