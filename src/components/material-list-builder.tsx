"use client";

import * as React from "react";
import { Search, X, Trash2 } from "lucide-react";
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


const MATERIAL_LIST_KEY = "materialBuilderList";
const PRICE_PARAMS_LOCAL_STORAGE_KEY = "priceParamsState";


interface ListItem extends SteelItem {
    listItemId: string;
    price: number;
    quantity: number;
    length?: number;
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


export function MaterialListBuilder() {
  const [materialList, setMaterialList] = React.useState<ListItem[]>([]);
  const [searchTerm, setSearchTerm] = React.useState("");

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
    };
    const newList = [...materialList, newItem];
    setMaterialList(newList);
    saveList(newList);
  }
  
  const handleRemoveFromList = (listItemId: string) => {
    const newList = materialList.filter(item => item.listItemId !== listItemId);
    setMaterialList(newList);
    saveList(newList);
  }
  
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
  
  const totalListPrice = materialList.reduce((acc, item) => acc + item.price, 0);

  const filteredCategories = React.useMemo(() => {
    if (!searchTerm) return [];
  
    const safeSearchTerm = searchTerm.replace(",", ".").toLowerCase();
  
    return ALL_CATEGORIES.map((category) => {
        let filteredItems: any[] = [];
        
        if (category.id === "retalhos" && "retalho".includes(safeSearchTerm)) {
          return category;
        }
  
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
  }, [searchTerm]);


  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden bg-background text-foreground">
        
        <div className="relative z-40 w-full px-8 py-1 flex flex-col gap-1 shrink-0">
            <div className="flex justify-center pt-1">
                <Link href="/">
                  <PsInoxLogo />
                </Link>
            </div>
            
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                type="search"
                placeholder="Buscar materiais para adicionar à lista..."
                className="w-full rounded-lg bg-muted pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>

        <div className="flex-1 mt-px overflow-y-auto relative z-0 p-1 min-h-0">
             {searchTerm ? (
                <GlobalSearchResults
                    categories={filteredCategories as any}
                    priceParams={priceParams}
                    searchTerm={searchTerm}
                    onPrefillScrap={() => {}}
                    isScrapCalculatorActive={false}
                    costAdjustments={costAdjustments}
                    onItemClick={() => {}} 
                    onAddItem={handleAddItemToList}
                />
             ) : (
                <>
                {materialList.length > 0 ? (
                    <div id="material-list-section" className="flex-1 flex flex-col min-h-0 pt-2">
                        <h2 className="text-lg font-semibold text-center mb-1 text-foreground">Lista de Materiais</h2>
                         <Card className="flex-1 overflow-hidden flex flex-col bg-card border-border">
                            <CardContent className="p-0 flex-1 overflow-y-auto">
                               <Table>
                                   <TableHeader>
                                       <TableRow className="border-b-border hover:bg-muted/50 flex">
                                           <TableHead className="flex-1 p-2">Descrição</TableHead>
                                           <TableHead className="text-center p-2 w-[70px] bg-muted/50">Detalhe</TableHead>
                                           <TableHead className="text-center p-2 w-[80px]">Preço</TableHead>
                                           <TableHead className="px-1 w-[40px]"></TableHead>
                                       </TableRow>
                                   </TableHeader>
                                   <TableBody>
                                       {materialList.map(item => (
                                            <TableRow key={item.listItemId} className="flex items-center">
                                              <TableCell className="font-medium flex-1 p-2">{item.description}</TableCell>
                                               <TableCell className="text-center text-muted-foreground p-2 w-[70px] bg-muted/50">
                                                  <div className="flex flex-col items-center">
                                                    <span>{(item.unit === 'm' || item.unit === 'un' || item.unit === 'kg') && item.quantity ? `${item.quantity} pç` : ''}</span>
                                                    <span className="text-xs">{formatNumber(item.weight, 3)} kg</span>
                                                  </div>
                                              </TableCell>
                                              <TableCell className="text-right font-semibold text-accent-price p-2 w-[80px]">{formatCurrency(item.price)}</TableCell>
                                               <TableCell className="px-1 w-[40px]">
                                                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleRemoveFromList(item.listItemId)}>
                                                      <Trash2 className="h-4 w-4 text-destructive" />
                                                  </Button>
                                              </TableCell>
                                            </TableRow>
                                       ))}
                                   </TableBody>
                               </Table>
                            </CardContent>
                         </Card>
                    </div>
                ) : (
                     <div className="text-center text-muted-foreground py-10">
                        <p>Sua lista de materiais está vazia.</p>
                        <p>Use a busca acima para adicionar itens.</p>
                    </div>
                )}
                </>
             )}
        </div>

        {materialList.length > 0 && (
            <div className="shrink-0 border-t border-border bg-background/95 backdrop-blur-sm p-2">
                <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-right text-lg font-bold text-accent-price">{formatCurrency(totalListPrice)}</span>
                </div>
            </div>
        )}
      </div>
  );
}
