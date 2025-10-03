

"use client";

import * as React from "react";
import { ALL_CATEGORIES, CATEGORY_GROUPS, type Category, type ScrapItem, SteelItem } from "@/lib/data";
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
import { Search, Warehouse, SlidersHorizontal, PlusCircle } from "lucide-react";
import { PriceControls } from "./price-controls";
import { ItemTable } from "./item-table";
import { Icon } from "./icons";
import { Input } from "./ui/input";
import { GlobalSearchResults } from "./global-search-results";
import { ScrapCalculator } from "./scrap-calculator";
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

interface PriceParams {
  costPrice: number;
  markup: number;
  sellingPrice: number;
}

const PRICE_PARAMS_LOCAL_STORAGE_KEY = "priceParamsState";

const initializePriceParams = (): Record<string, PriceParams> => {
  try {
    const savedParams = localStorage.getItem(PRICE_PARAMS_LOCAL_STORAGE_KEY);
    if (savedParams) {
      return JSON.parse(savedParams);
    }
  } catch (error) {
    console.error("Failed to load price params from localStorage", error);
  }

  const params: Record<string, PriceParams> = {
    global: { costPrice: 30, markup: 50, sellingPrice: 45 },
  };
  ALL_CATEGORIES.forEach(cat => {
    if (cat.hasOwnPriceControls) {
      const costPrice = cat.defaultCostPrice || 0;
      const markup = cat.defaultMarkup || 0;
      params[cat.id] = {
        costPrice,
        markup,
        sellingPrice: costPrice * (1 + markup / 100),
      };
    }
  });
  return params;
};

function DashboardComponent() {
  const { toast } = useToast();
  const [priceParams, setPriceParams] = React.useState<Record<string, PriceParams>>(initializePriceParams());
  const [selectedCategoryId, setSelectedCategoryId] = React.useState(ALL_CATEGORIES[0]?.id || "");
  const [searchTerm, setSearchTerm] = React.useState("");
  const { setOpenMobile, isMobile } = useSidebar();
  const [isScrapItemDialogOpen, setIsScrapItemDialogOpen] = React.useState(false);
  const [prefillScrapItem, setPrefillScrapItem] = React.useState<SteelItem | null>(null);
  const [prefillSellingPrice, setPrefillSellingPrice] = React.useState<number>(0);
  const [customerName, setCustomerName] = React.useState("");
  
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

  const selectedCategory = ALL_CATEGORIES.find((c) => c.id === selectedCategoryId) || ALL_CATEGORIES[0];
  const currentPriceParamsKey = selectedCategory.hasOwnPriceControls ? selectedCategoryId : 'global';
  const currentPriceParams = priceParams[currentPriceParamsKey];

  const handlePriceChange = (key: keyof PriceParams, value: number | null) => {
    const numericValue = value ?? 0;
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

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setSearchTerm("");
    setPrefillScrapItem(null);
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const handlePrefillScrapItem = (item: SteelItem, sellingPrice: number) => {
    setPrefillScrapItem(item);
    setPrefillSellingPrice(sellingPrice);
    setSelectedCategoryId('retalhos');
    setSearchTerm("");
  };
  
  const filteredCategories = React.useMemo(() => {
    if (!searchTerm) return [];
    
    return ALL_CATEGORIES.filter(cat => cat.unit === 'm' || cat.unit === 'un').map(category => {
      const filteredItems = (category.items as any[]).filter(item => 
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return { ...category, items: filteredItems };
    }).filter(category => category.items.length > 0);
  }, [searchTerm]);
  
  const isScrapCategory = selectedCategoryId === 'retalhos';
  const isPackageCheckerCategory = selectedCategoryId === 'package-checker';
  const isScaleCategory = selectedCategoryId === 'balanca';
  const isScrapTableCategory = selectedCategoryId === 'tabela-sucata';
  const isAstmStandardsCategory = selectedCategoryId === 'normas-astm';
  const isManufacturingProcessesCategory = selectedCategoryId === 'processos-fabricacao';
  
  const showCustomHeader = !searchTerm && !isScrapCategory && !isPackageCheckerCategory && !isScaleCategory && !isScrapTableCategory && !isAstmStandardsCategory && !isManufacturingProcessesCategory;
  const unitLabel = selectedCategory.unit === "m" ? "m" : selectedCategory.unit === 'm²' ? "m²" : "un";
  const weightUnitLabel = `Peso (kg/${unitLabel})`;
  const priceUnitLabel = `Preço (R$/${unitLabel})`;

  const renderContent = () => {
    const showSearchResults = searchTerm && (filteredCategories.length > 0 || isScrapCategory);
  
    if (isScrapCategory) {
      if (showSearchResults) {
        return (
          <GlobalSearchResults
            categories={filteredCategories as any}
            priceParams={priceParams}
            searchTerm={searchTerm}
            onPrefillScrap={handlePrefillScrapItem}
            isScrapCalculatorActive={isScrapCategory}
          />
        );
      }
      return <ScrapCalculator prefilledItem={prefillScrapItem} onClearPrefill={() => setPrefillScrapItem(null)} sellingPrice={prefillSellingPrice} />;
    }

    if (showSearchResults) {
      return (
        <GlobalSearchResults
          categories={filteredCategories as any}
          priceParams={priceParams}
          searchTerm={searchTerm}
          onPrefillScrap={handlePrefillScrapItem}
          isScrapCalculatorActive={isScrapCategory}
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
    return (
      <ItemTable 
        category={selectedCategory as any} 
        sellingPrice={currentPriceParams.sellingPrice}
        showTableHeader={!showCustomHeader}
      />
    );
  }
  
  const showPriceControls = !isScrapCategory && !isPackageCheckerCategory && !isScaleCategory && !isAstmStandardsCategory && !isManufacturingProcessesCategory;
  const showGlobalSearch = !isPackageCheckerCategory && !isScaleCategory && !isScrapTableCategory;


  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-1">
            <Warehouse className="size-6 text-primary" />
            <h1 className="text-lg font-semibold">PS INOX</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <Accordion type="single" collapsible className="w-full" defaultValue={CATEGORY_GROUPS[0].title}>
            {CATEGORY_GROUPS.map((group, index) => (
               <AccordionItem value={group.title} key={group.title} className="border-none">
                 <AccordionTrigger className="px-2 py-1.5 text-sm font-medium text-sidebar-primary hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md [&[data-state=open]]:bg-sidebar-accent">
                   {group.title}
                 </AccordionTrigger>
                 <AccordionContent className="pt-1">
                    <SidebarMenu>
                      {group.items.map((category) => (
                        <SidebarMenuItem key={category.id}>
                          <SidebarMenuButton
                            onClick={() => handleSelectCategory(category.id)}
                            isActive={selectedCategoryId === category.id && !searchTerm}
                            className="w-full justify-start h-8"
                          >
                            <Icon name={category.icon as any} />
                            <span>{category.name}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                 </AccordionContent>
               </AccordionItem>
            ))}
          </Accordion>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className={cn("p-1 h-screen flex flex-col gap-1", isScrapCategory ? "p-1 gap-1" : "p-1")}>
          <div className="bg-background rounded-lg border flex-1 flex flex-col overflow-hidden">
            <header className={cn(
              "flex items-center justify-between gap-1 p-1 border-b"
            )}>
              <div className="flex items-center gap-1">
                <SidebarTrigger className="md:hidden"/>
                <div className="hidden md:block">
                  <h2 className="text-lg font-semibold">{searchTerm ? 'Resultados da Busca' : selectedCategory.name}</h2>
                  <p className="text-sm text-muted-foreground">{searchTerm ? `Buscando por "${searchTerm}"` : selectedCategory.description}</p>
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
                        <DialogTitle>Ajustar Preços - {selectedCategory.hasOwnPriceControls ? selectedCategory.name : 'Global'}</DialogTitle>
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
              {showCustomHeader && (
                <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm -mx-1 px-1">
                    <div className="flex h-12 items-center border-b px-1 text-sm font-medium text-muted-foreground">
                        <div className="flex-1 px-1">Descrição</div>
                        <div className="w-1/3 px-1 text-center">{weightUnitLabel}</div>
                        <div className="w-1/3 px-1 text-right font-semibold text-primary">{priceUnitLabel}</div>
                    </div>
                </div>
              )}
              <div className="flex-1 overflow-y-auto">
                <div className={cn("p-1", (isScrapTableCategory || (isScrapCategory && !searchTerm)) && "p-0 md:p-0")}>
                 {renderContent()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </>
  );
}

export function Dashboard() {
  return (
    <SidebarProvider>
      <DashboardComponent />
    </SidebarProvider>
  )
}
