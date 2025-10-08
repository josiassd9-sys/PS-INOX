
"use client";

import * as React from "react";
import { Search, Trash2 } from "lucide-react";
import { PsInoxLogo } from "./ps-inox-logo";
import { Input } from "./ui/input";
import { ALL_CATEGORIES, Category, ConnectionGroup, ConnectionItem, SteelItem } from "@/lib/data";
import { GlobalSearchResults } from "./global-search-results";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";

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
  }
  
  const handleRemoveFromList = (listItemId: string) => {
    const newList = materialList.filter(item => item.listItemId !== listItemId);
    setMaterialList(newList);
    saveList(newList);
    toast({ title: "Item Removido" });
  }

  const handlePrefillScrap = (item: SteelItem, sellingPrice: number) => {
    toast({ title: "Ação não disponível", description: "A adição à lista de retalhos não está ativa nesta tela." });
  };
  
  const handleItemClick = (item: SteelItem) => {
     toast({ title: "Ação não disponível", description: "O ajuste de custo não está ativo nesta tela." });
  }

  const filteredCategories = React.useMemo(() => {
    if (!searchTerm) return [];
  
    const safeSearchTerm = searchTerm.replace(",", ".").toLowerCase();
  
    return ALL_CATEGORIES.map((category) => {
        // Skip categories that are just tools/info
        if (['retalhos', 'package-checker', 'balanca', 'tabela-sucata', 'normas-astm', 'processos-fabricacao', 'desenho-tecnico'].includes(category.id)) {
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
  const totalListWeight = materialList.reduce((acc, item) => acc + item.weight, 0);


  const renderResults = () => {
    if (!searchTerm) {
      return (
        <div className="text-center text-slate-500 py-10">
          <p>Comece a digitar para buscar um material.</p>
        </div>
      );
    }

    if (filteredCategories.length === 0) {
        return (
            <div className="text-center text-slate-500 py-10">
                <p>Nenhum material encontrado para "{searchTerm}".</p>
            </div>
        );
    }

    return (
        <GlobalSearchResults
            categories={filteredCategories}
            priceParams={mockPriceParams}
            searchTerm={searchTerm}
            onPrefillScrap={handlePrefillScrap}
            isScrapCalculatorActive={false}
            costAdjustments={mockCostAdjustments}
            onItemClick={handleItemClick}
            onAddItem={handleAddItemToList}
        />
    );
  }

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden bg-slate-800 text-slate-100 p-1">
        <div className="absolute inset-0 bg-grid-slate-700/[0.4] [mask-image:linear-gradient(to_bottom,white_10%,transparent_90%)]"></div>
        
        <div className="relative z-10 w-full p-1 flex flex-col gap-2 shrink-0">
            <div className="flex justify-center pt-2">
                <PsInoxLogo />
            </div>

            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                    type="search"
                    placeholder="Buscar material..."
                    className="w-full rounded-lg bg-slate-900/80 border-slate-700 text-slate-300 pl-8 focus:ring-slate-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>

        <div className="flex-1 mt-2 overflow-y-auto relative z-10 p-1">
            {searchTerm ? renderResults() : null}
            
            {materialList.length > 0 && (
                <div id="material-list-section" className="border-t border-slate-700 flex-1 flex flex-col min-h-0 pt-2 mt-2">
                    <h2 className="text-lg font-semibold text-center mb-1 text-slate-300">Lista de Materiais</h2>
                     <Card className="flex-1 overflow-hidden flex flex-col bg-slate-900/50 border-slate-700">
                        <CardContent className="p-0 flex-1 overflow-y-auto">
                           <Table>
                               <TableHeader>
                                   <TableRow className="border-b-slate-700 hover:bg-slate-800/50">
                                       <TableHead className="text-slate-300">Descrição</TableHead>
                                       <TableHead className="text-slate-300 text-center w-28">Detalhe</TableHead>
                                       <TableHead className="text-slate-300 text-right w-28">Preço</TableHead>
                                       <TableHead className="w-12"></TableHead>
                                   </TableRow>
                               </TableHeader>
                               <TableBody>
                                   {materialList.map(item => (
                                       <TableRow key={item.listItemId} className="border-b-slate-800">
                                            <TableCell className="font-medium text-slate-300">{item.description}</TableCell>
                                            <TableCell className="text-center text-slate-400">
                                                {item.unit === 'm' ? `${item.quantity} pç` : ''}
                                                {item.unit === 'un' ? `${item.quantity} pç` : ''}
                                                <div className="text-xs">{formatNumber(item.weight, 3)} kg</div>
                                            </TableCell>
                                            <TableCell className="text-right font-semibold text-slate-200">{formatCurrency(item.price)}</TableCell>
                                            <TableCell>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive/70 hover:text-destructive" onClick={() => handleRemoveFromList(item.listItemId)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                       </TableRow>
                                   ))}
                               </TableBody>
                               <TableFooter>
                                   <TableRow className="border-t-slate-700 hover:bg-slate-800/50">
                                       <TableHead colSpan={2} className="text-lg text-slate-200">Total</TableHead>
                                       <TableHead className="text-right text-lg font-bold text-slate-100">{formatCurrency(totalListPrice)}</TableHead>
                                       <TableHead></TableHead>
                                   </TableRow>
                               </TableFooter>
                           </Table>
                        </CardContent>
                     </Card>
                </div>
            )}
            
            {!searchTerm && materialList.length === 0 && (
                 <div className="text-center text-slate-500 py-10">
                    <p>Sua lista de materiais está vazia.</p>
                    <p>Use a busca acima para adicionar itens.</p>
                </div>
            )}
        </div>
      </div>
  );
}
