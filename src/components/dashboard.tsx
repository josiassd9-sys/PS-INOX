
"use client";

import * as React from "react";
import { ALL_CATEGORIES, CATEGORY_GROUPS, type Category, type ScrapItem, SteelItem, ConnectionGroup, ConnectionItem } from "@/lib/data";
import {
  SidebarProvider,
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
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { Search, Warehouse, SlidersHorizontal, PlusCircle, Link as LinkIcon, Scissors, ClipboardList, Home, Sheet } from "lucide-react";
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
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { PackageChecker } from "./package-checker";
import { ScaleCalculator } from "./scale-calculator";
import { ScrapTable } from "./scrap-table";
import { cn } from "@/lib/utils";
import { AstmStandards } from "./astm-standards";
import { ManufacturingProcesses } from "./manufacturing-processes";
import { useToast } from "@/hooks/use-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { TechnicalDrawingGuide } from "./technical-drawing-guide";
import { ConnectionsTable } from "./connections-table";
import { CostAdjustmentCalculator } from "./cost-adjustment-calculator";
import Link from "next/link";
import { GaugeStandards } from "./gauge-standards";

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
    const savedParams = localStorage.getItem(PRICE_PARAMS_LOCAL_STORAGE_KEY);
    if (savedParams) {
      const parsed = JSON.parse(savedParams);
      // Basic validation
      if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
          params = parsed;
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

function DashboardComponent({ initialCategoryId }: { initialCategoryId: string }) {
  const { toast } = useToast();
  const [priceParams, setPriceParams] = React.useState<Record<string, PriceParams>>({});
  
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<string | null>(initialCategoryId);
  const [searchTerm, setSearchTerm] = React.useState("");
  const { setOpenMobile, isMobile } = useSidebar();
  const [isScrapItemDialogOpen, setIsScrapItemDialogOpen] = React.useState(false);
  const [customerName, setCustomerName] = React.useState("");
  const [editedWeights, setEditedWeights] = React.useState<Record<string, number>>({});
  const [costAdjustments, setCostAdjustments] = React.useState<Record<string, number>>({});
  const [selectedItemForAdjustment, setSelectedItemForAdjustment] = React.useState<SteelItem | null>(null);


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


  const selectedCategory = ALL_CATEGORIES.find((c) => c.id === selectedCategoryId);
  const currentPriceParamsKey = selectedCategory?.hasOwnPriceControls ? selectedCategoryId : 'global';
  const currentPriceParams = priceParams[currentPriceParamsKey!];

  const handlePriceChange = (key: keyof PriceParams, value: number | null) => {
    const numericValue = value ?? 0;
    const currentParams = priceParams[currentPriceParamsKey!];
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
      [currentPriceParamsKey!]: newParams,
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
  
  const isPackageCheckerCategory = selectedCategoryId === 'package-checker';
  const isScaleCategory = selectedCategoryId === 'balanca';
  const isScrapTableCategory = selectedCategoryId === 'tabela-sucata';
  const isAstmStandardsCategory = selectedCategoryId === 'normas-astm';
  const isManufacturingProcessesCategory = selectedCategoryId === 'processos-fabricacao';
  const isTechnicalDrawingCategory = selectedCategoryId === 'desenho-tecnico';
  const isConnectionsCategory = selectedCategoryId === 'conexoes';
  const isGaugeCategory = selectedCategoryId === 'gauge';

  const showCustomHeader = !searchTerm && !isPackageCheckerCategory && !isScaleCategory && !isScrapTableCategory && !isAstmStandardsCategory && !isManufacturingProcessesCategory && !isTechnicalDrawingCategory && !isConnectionsCategory && !isGaugeCategory;
  
  const showTableHeader = selectedCategory && !isGaugeCategory && !isScrapTableCategory && !isAstmStandardsCategory && !isManufacturingProcessesCategory && !isTechnicalDrawingCategory && !isPackageCheckerCategory && !isScaleCategory;


  const renderContent = () => {
    if (!currentPriceParams) {
      return (
        <div className="flex items-center justify-center h-screen">
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
          isScrapCalculatorActive={false}
          costAdjustments={costAdjustments}
          onItemClick={handleItemClickForAdjustment}
          onAddItem={() => {}}
        />
      );
    }

    if (isPackageCheckerCategory) {
      return <PackageChecker />;
    }
    if (isScaleCategory) {
      return <ScaleCalculator customerName={customerName} onCustomerNameChange={setCustomerName} />;
    }
    if (isScrapTableCategory) {
        return <ScrapTable 
          category={selectedCategory as any}
          isDialogOpen={isScrapItemDialogOpen}
          setIsDialogOpen={setIsScrapItemDialogOpen}
          searchTerm={searchTerm}
         />;
    }
    if (isAstmStandardsCategory) {
        return <AstmStandards />;
    }
    if (isManufacturingProcessesCategory) {
        return <ManufacturingProcesses />;
    }
    if (isTechnicalDrawingCategory) {
        return <TechnicalDrawingGuide />;
    }
    if (isConnectionsCategory) {
        return <ConnectionsTable
            category={selectedCategory as any}
            sellingPrice={currentPriceParams.sellingPrice}
            editedWeights={editedWeights}
            onWeightChange={handleWeightChange}
        />;
    }
    if (isGaugeCategory) {
      return <GaugeStandards />;
    }

    return (
      <ItemTable 
        category={selectedCategory as any} 
        priceParams={currentPriceParams}
        costAdjustments={costAdjustments}
        onItemClick={handleItemClickForAdjustment}
        showTableHeader={!showCustomHeader}
      />
    );
  }
  
  const showPriceControls = selectedCategory && (selectedCategory.hasOwnPriceControls || (!isPackageCheckerCategory && !isScaleCategory && !isScrapTableCategory && !isAstmStandardsCategory && !isManufacturingProcessesCategory && !isTechnicalDrawingCategory && !isGaugeCategory));

  const showGlobalSearch = selectedCategory && !isScaleCategory && !isScrapTableCategory && !isAstmStandardsCategory && !isManufacturingProcessesCategory && !isTechnicalDrawingCategory && !isGaugeCategory;

  
  const priceControlTitle = () => {
    if (!selectedCategory) return 'Ajustar Preços - Global';
    if (selectedCategory.hasOwnPriceControls) {
      return `Ajustar Preços - ${selectedCategory.name}`;
    }
    return 'Ajustar Preços - Global';
  }

  const unitLabel = selectedCategory ? (selectedCategory.unit === "m" ? "m" : selectedCategory.unit === 'm²' ? "m²" : "un") : "";
  const weightUnitLabel = selectedCategory ? `Peso (kg/${unitLabel})` : "";
  const priceUnitLabel = selectedCategory ? `Preço (R$/${unitLabel})` : "";


  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <Link href="/" className="flex items-center gap-1 cursor-pointer w-full text-left" aria-label="Voltar para a tela inicial">
            <Home className="size-6 text-primary" />
            <h1 className="text-lg font-semibold">PS INOX</h1>
          </Link>
        </SidebarHeader>
        <SidebarContent className="p-1">
           <Accordion type="multiple" defaultValue={CATEGORY_GROUPS.map(g => g.title)} className="w-full flex flex-col gap-1">
            {CATEGORY_GROUPS.map((group) => (
               <AccordionItem value={group.title} key={group.title} className="border-none rounded-lg bg-sidebar-accent/10 p-1">
                 <AccordionTrigger className="p-2 text-sm font-semibold text-sidebar-primary hover:no-underline [&[data-state=open]>svg]:-rotate-180">
                   {group.title}
                 </AccordionTrigger>
                 <AccordionContent className="pt-1">
                    <SidebarMenu>
                      {group.items.map((category) => {
                          const href = category.id === 'gauge' ? '/gauge' : `/calculator/${category.id}`;
                          return (
                            <SidebarMenuItem key={category.id}>
                              <Link href={href} passHref>
                                <SidebarMenuButton
                                  isActive={selectedCategoryId === category.id && !searchTerm}
                                  className="w-full justify-start h-8"
                                >
                                  <Icon name={category.icon as any} />
                                  <span>{category.name}</span>
                                </SidebarMenuButton>
                              </Link>
                            </SidebarMenuItem>
                          );
                      })}
                       {group.title === 'FERRAMENTAS' && (
                        <>
                          <SidebarMenuItem>
                            <Link href="/retalho-inox" passHref>
                              <SidebarMenuButton className="w-full justify-start h-8">
                                  <Scissors />
                                  <span>Retalho Inox</span>
                              </SidebarMenuButton>
                            </Link>
                          </SidebarMenuItem>
                          <SidebarMenuItem>
                            <Link href="/lista-sucatas" passHref>
                              <SidebarMenuButton className="w-full justify-start h-8">
                                  <Icon name="Trash2" />
                                  <span>Lista de Sucatas</span>
                              </SidebarMenuButton>
                            </Link>
                          </SidebarMenuItem>
                        </>
                      )}
                      {group.title === 'INFORMATIVOS' && (
                        <SidebarMenuItem>
                          <Link href="/lista-materiais" passHref>
                            <SidebarMenuButton className="w-full justify-start h-8">
                                <ClipboardList />
                                <span>Lista de Materiais</span>
                            </SidebarMenuButton>
                          </Link>
                        </SidebarMenuItem>
                      )}
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
              <div className="flex items-center gap-1">
                <SidebarTrigger className="md:hidden"/>
                <div className="hidden md:block">
                  <h2 className="text-lg font-semibold">{searchTerm ? 'Resultados da Busca' : selectedCategory?.name ?? 'Bem-vindo!'}</h2>
                  <p className="text-sm text-muted-foreground">{searchTerm ? `Buscando por "${searchTerm}"` : selectedCategory?.description ?? 'Selecione uma categoria no menu para começar.'}</p>
                </div>
              </div>
              
              {isScaleCategory ? (
                 <div className="relative flex-1">
                    <Input
                        id="customer-name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Digite o nome do cliente"
                        className="w-full rounded-lg bg-background"
                    />
                </div>
              ) : isScrapTableCategory ? (
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                    type="search"
                    placeholder="Buscar em sucatas..."
                    className="w-full rounded-lg bg-background pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
              ) : showGlobalSearch ? (
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                    type="search"
                    placeholder="Buscar em todas as categorias..."
                    className="w-full rounded-lg bg-background pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
              ) : null}
              
              <div className="flex items-center gap-1">
                {showPriceControls && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-1">
                        <SlidersHorizontal />
                        <span className="hidden sm:inline">Ajustar</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{priceControlTitle()}</DialogTitle>
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
                 {isScrapTableCategory && (
                    <Button variant="outline" size="sm" className="gap-1" onClick={() => setIsScrapItemDialogOpen(true)}>
                      <PlusCircle className="h-4 w-4" />
                      <span className="hidden sm:inline">Adicionar</span>
                    </Button>
                )}
              </div>
            </header>
            
            <div className="flex-1 flex flex-col overflow-hidden">
              {showTableHeader && (
                <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm -mx-1 px-1">
                    <div className="flex h-12 items-center border-b px-1 text-sm font-medium text-muted-foreground">
                        <div className="flex-1 px-1">Descrição</div>
                        <div className="w-1/3 px-1 text-center">{weightUnitLabel}</div>
                        <div className="w-1/3 px-1 text-right font-semibold text-primary">{priceUnitLabel}</div>
                    </div>
                </div>
              )}
              <div className="flex-1 overflow-y-auto">
                <div className={cn("p-1", (isScrapTableCategory || selectedCategoryId === 'conexoes') && "p-0 md:p-0")}>
                 {renderContent()}
                </div>
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

export function Dashboard({ initialCategoryId }: { initialCategoryId?: string }) {
  return (
    <SidebarProvider>
      <DashboardComponent initialCategoryId={initialCategoryId!} />
    </SidebarProvider>
  )
}
 
