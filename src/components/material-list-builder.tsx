
"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { PsInoxLogo } from "./ps-inox-logo";
import { Input } from "./ui/input";
import { ALL_CATEGORIES, Category, ConnectionGroup, ConnectionItem, SteelItem } from "@/lib/data";
import { GlobalSearchResults } from "./global-search-results";
import { useToast } from "@/hooks/use-toast";


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
            {renderResults()}
        </div>
      </div>
  );
}

    