"use client";

import * as React from "react";
import { Search, X, Trash2 } from "lucide-react";
import { PsInoxLogo } from "./ps-inox-logo";
import { Input } from "./ui/input";
import { ALL_CATEGORIES, Category, ConnectionGroup, ConnectionItem, SteelItem } from "@/lib/data";
import { GlobalSearchResults } from "./global-search-results";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";
import { Table, TableBody, TableCell, TableHeader, TableRow, TableHead } from "./ui/table";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { ScrapCalculator } from "./scrap-calculator";
import Link from "next/link";
import { SwipeToDelete } from "./ui/swipe-to-delete";


const MATERIAL_LIST_KEY = "materialBuilderList";

interface ListItem extends SteelItem {
    listItemId: string;
    price: number;
    quantity: number;
    length?: number;
}


// Mock data, to be replaced with state management
const mockPriceParams = {
    global: { costPrice: 30, markup: 50, sellingPrice: 45 },
    "tubos-od": { costPrice: 32, markup: 55, sellingPrice: 49.6 },
    chapas: { costPrice: 28, markup: 60, sellingPrice: 44.8 },
    conexoes: { costPrice: 50, markup: 100, sellingPrice: 100 },
};
const mockCostAdjustments = {};


export function MaterialListBuilder() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const { toast } = useToast();
  const [materialList, setMaterialList] = React.useState<ListItem[]>([]);
  const [isScrapCalculatorOpen, setIsScrapCalculatorOpen] = React.useState(false);
  
  React.useEffect(() => {
    try {
        const savedList = localStorage.getItem(MATERIAL_LIST_KEY);
        if (savedList) {
            setMaterialList(JSON.parse(savedList));
        }
    } catch(error) {
        console.error("Failed to load material list from localStorage", error);
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
    toast({ title: "Item Adicionado!", description: `${item.description} foi adicionado à lista.` });
    setSearchTerm("");
    setIsScrapCalculatorOpen(false);
  }
  
  const handleRemoveFromList = (listItemId: string) => {
    const newList = materialList.filter(item => item.listItemId !== listItemId);
    setMaterialList(newList);
    saveList(newList);
    toast({ title: "Item Removido" });
  }
  
  const handleItemClick = (item: SteelItem) => {
     if (item.id === 'retalhos') {
        setIsScrapCalculatorOpen(true);
        setSearchTerm("");
     } else {
        toast({ title: "Ação não disponível", description: "O ajuste de custo não está ativo nesta tela." });
     }
  }

  const filteredCategories = React.useMemo(() => {
    if (!searchTerm) return [];
  
    const safeSearchTerm = searchTerm.replace(",", ".").toLowerCase();
  
    return ALL_CATEGORIES.map((category) => {
        // Allow searching for "Retalhos"
        if (category.id === 'retalhos' && category.name.toLowerCase().includes(safeSearchTerm)) {
             return { ...category, items: [ {id: 'retalhos', description: 'Calcular retalho personalizado', categoryName: 'retalhos'} ]};
        }

        // Skip other tool categories
        if (['package-checker', 'balanca', 'tabela-sucata', 'normas-astm', 'processos-fabricacao', 'desenho-tecnico'].includes(category.id)) {
            return null;
        }

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
      .filter((category): category is Category => category !== null && category.items.length > 0);
  }, [searchTerm]);

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


  const renderResults = () => {
    if (!searchTerm) {
      return null;
    }

    if (filteredCategories.length === 0 && !isScrapCalculatorOpen) {
        return (
             <div className="absolute inset-x-0 top-full mt-1 bg-background z-40 border rounded-lg shadow-lg p-2 max-h-[60vh] overflow-y-auto">
                <div className="text-center text-muted-foreground py-1">
                    <p>Nenhum material encontrado para "{searchTerm}".</p>
                </div>
            </div>
        );
    }

    return (
        <div className="absolute inset-x-0 top-full mt-1 bg-background z-40 border rounded-lg shadow-lg p-1 max-h-[60vh] overflow-y-auto">
            <GlobalSearchResults
                categories={filteredCategories}
                priceParams={mockPriceParams}
                searchTerm={searchTerm}
                isScrapCalculatorActive={false} // This is for prefilling the main scrap calculator, not for adding to list.
                costAdjustments={mockCostAdjustments}
                onItemClick={handleItemClick}
                onAddItem={handleAddItemToList}
                onPrefillScrap={() => {}}
            />
        </div>
    );
  }

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
                    placeholder="Buscar material ou 'retalho'..."
                    className="w-full rounded-lg bg-muted/50 border-input pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setIsScrapCalculatorOpen(false)}
                />
                {renderResults()}
            </div>
        </div>

        <div className="flex-1 mt-px overflow-y-auto relative z-0 p-1 min-h-0">
             {isScrapCalculatorOpen && (
                <div className="mb-2">
                     <Card>
                        <CardContent className="p-1">
                             <div className="flex justify-between items-center pb-1">
                                <h3 className="font-semibold px-1">Calcular Retalho Personalizado</h3>
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsScrapCalculatorOpen(false)}><X/></Button>
                            </div>
                            <ScrapCalculator 
                                prefilledItem={null} 
                                onClearPrefill={() => {}} 
                                sellingPrice={0} // Not used for custom scrap
                                onAddItem={handleAddItemToList}
                            />
                        </CardContent>
                    </Card>
                </div>
             )}

            
            {materialList.length > 0 && (
                <div id="material-list-section" className="flex-1 flex flex-col min-h-0 pt-2">
                    <h2 className="text-lg font-semibold text-center mb-1 text-foreground">Lista de Materiais</h2>
                     <Card className="flex-1 overflow-hidden flex flex-col bg-card border-border">
                        <CardContent className="p-0 flex-1 overflow-y-auto">
                           <Table>
                               <TableHeader>
                                   <TableRow className="border-b-border hover:bg-muted/50 flex">
                                       <TableHead className="flex-1 p-2">Descrição</TableHead>
                                       <TableHead className="text-right p-2 w-[80px]">Preço</TableHead>
                                       <TableHead className="text-center p-2 w-[70px] bg-muted/50">Detalhe</TableHead>
                                   </TableRow>
                               </TableHeader>
                               <TableBody>
                                   {materialList.map(item => (
                                        <SwipeToDelete key={item.listItemId} onDelete={() => handleRemoveFromList(item.listItemId)}>
                                          <TableCell className="font-medium flex-1 p-2">{item.description}</TableCell>
                                          <TableCell className="text-right font-semibold text-accent-price p-2 w-[80px]">{formatCurrency(item.price)}</TableCell>
                                          <TableCell className="text-center text-muted-foreground p-2 w-[70px] bg-muted/50">
                                              {(item.unit === 'm' || item.unit === 'un' || item.unit === 'kg') && item.quantity ? `${item.quantity} pç` : ''}
                                              <div className="text-xs">{formatNumber(item.weight, 3)} kg</div>
                                          </TableCell>
                                        </SwipeToDelete>
                                   ))}
                               </TableBody>
                           </Table>
                        </CardContent>
                     </Card>
                </div>
            )}
            
            {!searchTerm && materialList.length === 0 && !isScrapCalculatorOpen && (
                 <div className="text-center text-muted-foreground py-10">
                    <p>Sua lista de materiais está vazia.</p>
                    <p>Use a busca acima para adicionar itens.</p>
                </div>
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
