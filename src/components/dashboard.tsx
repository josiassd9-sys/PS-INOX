

"use client";

import * as React from "react";
import { ALL_CATEGORIES, CATEGORY_GROUPS, SteelItem, ScrapItem, ConnectionGroup, Category } from "@/lib/data/index";
import type { ConnectionItem } from "@/lib/data/types";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  useSidebar,
  SidebarGroup,
} from "@/components/ui/sidebar";
import { Search, SlidersHorizontal, PlusCircle, Calculator, BookOpen, Ruler, Variable, X, Trash2, Save, ArrowUpFromLine, Printer } from "lucide-react";
import { PriceControls } from "./price-controls";
import { ItemTable } from "./item-table";
import { Icon } from "./icons";
import { Input } from "./ui/input";
import { GlobalSearchResults } from "./global-search-results";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { PackageChecker } from "./package-checker";
import ScaleCalculator from "./scale-calculator";
import { ScrapTable } from "./scrap-table";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { ConnectionsTable } from "./connections-table";
import { CostAdjustmentCalculator } from "./cost-adjustment-calculator";
import Link from "next/link";
import { GaugeStandards } from "./gauge-standards";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "./ui/tooltip";

interface PriceParams {
  costPrice: number;
  markup: number;
  sellingPrice: number;
}

const PRICE_PARAMS_LOCAL_STORAGE_KEY = "priceParamsState";
export const EDITED_CONNECTIONS_WEIGHTS_KEY = "editedConnectionsWeights";
export const COST_ADJUSTMENTS_LOCAL_STORAGE_KEY = "costAdjustments";

const initializePriceParams = (): Record<string, PriceParams> => {
  let params: Record<string, PriceParams> = {
    global: { costPrice: 30, markup: 50, sellingPrice: 45 },
  };

  try {
    if (typeof window !== 'undefined') {
        const savedParams = localStorage.getItem(PRICE_PARAMS_LOCAL_STORAGE_KEY);
        if (savedParams) {
          const parsed = JSON.parse(savedParams);
          // Basic validation
          if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
              params = parsed;
          }
        }
    }
  } catch (error) {
    console.error("Failed to load price params from localStorage", error);
  }

  // Ensure all categories with own controls are initialized
  ALL_CATEGORIES.forEach(cat => {
    if (cat.hasOwnPriceControls && !params[cat.id]) {
      const costPrice = cat.defaultCostPrice || 30;
      const markup = cat.defaultMarkup || 50;
      params[cat.id] = {
        costPrice,
        markup,
        sellingPrice: costPrice * (1 + markup / 100),
      };
    }
  });

  return params;
};

function DashboardComponent({ initialCategoryId, children }: { initialCategoryId: string | null, children?: React.ReactNode }) {
  const { toast } = useToast();
  const [priceParams, setPriceParams] = React.useState<Record<string, PriceParams>>({});
  
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<string | null>(initialCategoryId);
  const [searchTerm, setSearchTerm] = React.useState("");
  const { setOpenMobile, isMobile } = useSidebar();
  const [isScrapItemDialogOpen, setIsScrapItemDialogOpen] = React.useState(false);
  const [editedWeights, setEditedWeights] = React.useState<Record<string, number>>({});
  const [costAdjustments, setCostAdjustments] = React.useState<Record<string, number>>({});
  const [selectedItemForAdjustment, setSelectedItemForAdjustment] = React.useState<SteelItem | null>(null);

  // Expose scale calculator actions
  const scaleCalculatorRef = React.useRef<{ handleClear: () => void; handleSave: () => void; handleLoad: () => void; handlePrint: () => void; }>(null);


  React.useEffect(() => {
    // Navigate to initial category on load
    if (initialCategoryId) {
      setSelectedCategoryId(initialCategoryId);
    } else {
      setSelectedCategoryId('lista-materiais');
    }
  }, [initialCategoryId]);

  React.useEffect(() => {
    setPriceParams(initializePriceParams());
    try {
      const savedWeights = localStorage.getItem(EDITED_CONNECTIONS_WEIGHTS_KEY);
      if (savedWeights) {
        setEditedWeights(JSON.parse(savedWeights));
      }
      const savedAdjustments = localStorage.getItem(COST_ADJUSTMENTS_LOCAL_STORAGE_KEY);
      if (savedAdjustments) {
        setCostAdjustments(JSON.parse(savedAdjustments));
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
    }
  }, []);
  
  const savePriceParams = () => {
    try {
      localStorage.setItem(PRICE_PARAMS_LOCAL_STORAGE_KEY, JSON.stringify(priceParams));
      toast({
        title: "Preços Salvos!",
        description: "Os custos e margens foram salvos com sucesso.",
      });
    } catch (error) {
       console.error("Failed to save price params to localStorage", error);
       toast({
        variant: "destructive",
        title: "Erro ao Salvar",
        description: "Não foi possível salvar os parâmetros de preço.",
      });
    }
  };

  const handleWeightChange = (itemId: string, newWeight: number) => {
    const updatedWeights = { ...editedWeights, [itemId]: newWeight };
    setEditedWeights(updatedWeights);
    try {
        localStorage.setItem(EDITED_CONNECTIONS_WEIGHTS_KEY, JSON.stringify(updatedWeights));
        toast({
            title: "Peso Atualizado",
            description: "O novo peso da conexão foi salvo.",
        });
    } catch (error) {
        console.error("Failed to save edited weights", error);
        toast({
            variant: "destructive",
            title: "Erro ao Salvar Peso",
            description: "Não foi possível salvar a alteração do peso.",
        });
    }
  };

  const handleCostAdjustmentChange = (itemId: string, adjustment: number) => {
    const updatedAdjustments = { ...costAdjustments, [itemId]: adjustment };
    setCostAdjustments(updatedAdjustments);
    try {
      localStorage.setItem(COST_ADJUSTMENTS_LOCAL_STORAGE_KEY, JSON.stringify(updatedAdjustments));
      toast({
        title: "Ajuste de Custo Salvo",
        description: "O novo fator de ajuste para o item foi salvo.",
      });
    } catch (error) {
      console.error("Failed to save cost adjustments", error);
      toast({
        variant: "destructive",
        title: "Erro ao Salvar Ajuste",
        description: "Não foi possível salvar o ajuste de custo.",
      });
    }
    setSelectedItemForAdjustment(null);
  };

  const selectedCategory = React.useMemo(() => {
    if (!selectedCategoryId) return null;
    return ALL_CATEGORIES.find((c) => c.id === selectedCategoryId);
  }, [selectedCategoryId]);

  const currentPriceParamsKey = selectedCategory?.hasOwnPriceControls ? selectedCategoryId : 'global';
  const currentPriceParams = currentPriceParamsKey ? priceParams[currentPriceParamsKey] : undefined;

  const handlePriceChange = (key: keyof PriceParams, value: number | null) => {
    const numericValue = value ?? 0;
    if (!currentPriceParamsKey) return;
    
    const currentParams = priceParams[currentPriceParamsKey];
    let newParams = { ...currentParams };

    if (key === 'costPrice') {
      newParams.costPrice = numericValue;
      newParams.sellingPrice = numericValue * (1 + newParams.markup / 100);
    } else if (key === 'markup') {
      newParams.markup = numericValue;
      newParams.sellingPrice = newParams.costPrice * (1 + numericValue / 100);
    } else if (key === 'sellingPrice') {
      newParams.sellingPrice = numericValue;
      if (newParams.costPrice > 0) {
        newParams.markup = ((numericValue / newParams.costPrice) - 1) * 100;
      }
    }

    setPriceParams(prev => ({
      ...prev,
      [currentPriceParamsKey]: newParams,
    }));
  };

  const handleSelectCategory = (categoryId: string | null) => {
    setSelectedCategoryId(categoryId);
    setSearchTerm("");
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const handleItemClickForAdjustment = (item: SteelItem) => {
    if (selectedCategory?.id === 'conexoes') return;
    setSelectedItemForAdjustment(item);
  }
  
  const filteredCategories = React.useMemo(() => {
    if (!searchTerm) return [];
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
      .filter((category): category is Category => category !== null && category.items.length > 0);
  }, [searchTerm]);
  
  const isSpecialPage = children ||
                         selectedCategoryId === 'balanca' ||
                         selectedCategoryId === 'tabela-sucata' ||
                         selectedCategoryId === 'conexoes' ||
                         selectedCategoryId === 'gauge' ||
                         selectedCategoryId === 'ai-assistant' ||
                         selectedCategoryId === 'lista-materiais' ||
                         selectedCategoryId === 'lista-sucatas' ||
                         selectedCategoryId?.startsWith('perfis/') ||
                         selectedCategoryId?.startsWith('informativos/') ||
                         selectedCategoryId === 'print-preview';

  const renderContent = () => {
    if (children && selectedCategoryId) return children;

    if (!selectedCategory) {
      return <div/>;
    }

    if (!currentPriceParams) {
      return (
        <div className="flex items-center justify-center h-full">
          <p>Carregando...</p>
        </div>
      );
    }
  
    const showSearchResults = searchTerm && filteredCategories.length > 0;
  
    if (showSearchResults) {
      return (
        <GlobalSearchResults
          categories={filteredCategories as any}
          priceParams={priceParams}
          searchTerm={searchTerm}
          costAdjustments={costAdjustments}
          onItemClick={handleItemClickForAdjustment}
          onAddItem={() => {}}
          isScrapCalculatorActive={false}
        />
      );
    }
    
    switch (selectedCategoryId) {
      case 'package-checker': return <PackageChecker />;
      case 'balanca': return <ScaleCalculator ref={scaleCalculatorRef} />;
      case 'tabela-sucata': return <ScrapTable category={selectedCategory as any} isDialogOpen={isScrapItemDialogOpen} setIsDialogOpen={setIsScrapItemDialogOpen} searchTerm={searchTerm} />;
      case 'conexoes': return <ConnectionsTable category={selectedCategory as any} sellingPrice={currentPriceParams.sellingPrice} editedWeights={editedWeights} onWeightChange={handleWeightChange} />;
      case 'gauge': return <GaugeStandards />;
      case 'lista-materiais': return <div/>;
      case 'lista-sucatas': return <div/>;
      default:
        if (selectedCategory) {
          return <ItemTable category={selectedCategory as any} priceParams={currentPriceParams} costAdjustments={costAdjustments} onItemClick={handleItemClickForAdjustment} />;
        }
        return <div className="p-4 text-center text-muted-foreground">Selecione uma categoria para começar.</div>;
    }
  }
  
  const showPriceControls = selectedCategory && !isSpecialPage;

  const getPageTitle = () => {
    if (searchTerm) return "Resultados da Busca";
    if (selectedCategory) return selectedCategory.name;
    return "Bem-vindo!";
  }

  const getPageDescription = () => {
      if (searchTerm) return `Buscando por "${searchTerm}"`;
      if (selectedCategory) return selectedCategory.description;
      return "Selecione uma categoria no menu para começar.";
  }

  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-1 w-full" aria-label="Voltar para a tela inicial">
            <Icon name="Home" className="size-6 text-primary" />
            <h1 className="text-lg font-semibold">PS INOX</h1>
          </div>
        </SidebarHeader>
        <SidebarContent className="p-1">
           <Accordion type="multiple" className="w-full flex flex-col gap-1">
            {CATEGORY_GROUPS.map((group) => (
               <AccordionItem value={group.title} key={group.title} className="border-none rounded-lg bg-sidebar-accent/10 p-1">
                 <AccordionTrigger className="p-2 text-sm font-semibold text-sidebar-primary hover:no-underline [&[data-state=open]>svg]:-rotate-180">
                   {group.title}
                 </AccordionTrigger>
                 <AccordionContent className="pt-1">
                    <SidebarMenu>
                      {group.items.map((category) => {
                          const href = category.path || `/calculator/${category.id}`;
                          return (
                            <SidebarMenuItem key={category.id}>
                              <Link href={href} passHref>
                                <SidebarMenuButton
                                  isActive={selectedCategoryId === category.id && !searchTerm}
                                  className="w-full justify-start h-8"
                                  onClick={() => handleSelectCategory(category.id)}
                                >
                                  <Icon name={category.icon as any} />
                                  <span>{category.name}</span>
                                </SidebarMenuButton>
                              </Link>
                            </SidebarMenuItem>
                          );
                      })}
                    </SidebarMenu>
                 </AccordionContent>
               </AccordionItem>
            ))}
          </Accordion>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className={cn("p-1 h-screen flex flex-col gap-1")}>
          <div className="bg-background rounded-lg border flex-1 flex flex-col overflow-hidden">
            <header className={cn(
              "flex items-center justify-between gap-1 p-1 border-b"
            )}>
              <div className="flex items-center gap-1 flex-1 min-w-0">
                <SidebarTrigger className="md:hidden"/>
                <div className="hidden md:block overflow-hidden">
                  <h2 className="text-lg font-semibold truncate">{getPageTitle()}</h2>
                  <p className="text-sm text-muted-foreground truncate">{getPageDescription()}</p>
                </div>
              </div>
              
             {selectedCategoryId !== 'balanca' && (
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                    type="search"
                    placeholder="Buscar..."
                    className="w-full rounded-lg bg-background pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    />
                   {searchTerm && (
                      <Button variant="ghost" size="icon" className="absolute right-0 top-0 h-full" onClick={() => setSearchTerm("")}>
                         <X className="h-4 w-4" />
                      </Button>
                   )}
                </div>
              )}
              
              <div className="flex items-center gap-1">
                
                {showPriceControls && currentPriceParams && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-1">
                        <SlidersHorizontal />
                        <span className="hidden sm:inline">Ajustar</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{`Ajustar Preços - ${selectedCategory?.hasOwnPriceControls ? selectedCategory.name : 'Global'}`}</DialogTitle>
                      </DialogHeader>
                      <PriceControls
                        costPrice={currentPriceParams.costPrice}
                        markup={currentPriceParams.markup}
                        sellingPrice={currentPriceParams.sellingPrice}
                        onCostChange={(v) => handlePriceChange('costPrice', v)}
                        onMarkupChange={(v) => handlePriceChange('markup', v)}
                        onSellingPriceChange={(v) => handlePriceChange('sellingPrice', v)}
                      />
                      <DialogFooter>
                        <DialogClose asChild>
                           <Button onClick={savePriceParams}>Salvar</Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
                 {selectedCategoryId === 'tabela-sucata' && (
                    <Button variant="outline" size="sm" className="gap-1" onClick={() => setIsScrapItemDialogOpen(true)}>
                      <PlusCircle className="h-4 w-4" />
                      <span className="hidden sm:inline">Adicionar</span>
                    </Button>
                )}
              </div>
            </header>
            
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className={cn("p-1 flex-1 overflow-y-auto", (selectedCategoryId === 'tabela-sucata' || selectedCategoryId === 'conexoes') && "p-0 md:p-0")}>
                 {renderContent()}
              </div>
            </div>
          </div>
        </div>
        <Dialog open={!!selectedItemForAdjustment} onOpenChange={(open) => !open && setSelectedItemForAdjustment(null)}>
          <DialogContent>
            {selectedItemForAdjustment && currentPriceParams && (
              <>
                <DialogHeader>
                  <DialogTitle>Ajuste Fino de Custo</DialogTitle>
                </DialogHeader>
                <CostAdjustmentCalculator
                  item={selectedItemForAdjustment}
                  baseCostPrice={currentPriceParams.costPrice}
                  markup={currentPriceParams.markup}
                  currentAdjustment={costAdjustments[selectedItemForAdjustment.id] || 0}
                  onSave={handleCostAdjustmentChange}
                />
              </>
            )}
          </DialogContent>
        </Dialog>
      </SidebarInset>
    </>
  );
}

export function Dashboard({ initialCategoryId, children }: { initialCategoryId: string | null, children?: React.ReactNode }) {
  return <DashboardComponent initialCategoryId={initialCategoryId} children={children} />
}
