"use client";

import * as React from "react";
import { CATEGORIES, type Category } from "@/lib/data";
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
} from "@/components/ui/sidebar";
import { Search, Warehouse, SlidersHorizontal } from "lucide-react";
import { PriceControls } from "./price-controls";
import { ItemTable } from "./item-table";
import { Icon } from "./icons";
import { Input } from "./ui/input";
import { GlobalSearchResults } from "./global-search-results";
import { ScrapCalculator } from "./scrap-calculator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";

function DashboardComponent() {
  const [costPrice, setCostPrice] = React.useState(30);
  const [markup, setMarkup] = React.useState(50);
  const [sellingPrice, setSellingPrice] = React.useState(
    costPrice * (1 + markup / 100)
  );
  const [selectedCategoryId, setSelectedCategoryId] = React.useState(
    CATEGORIES[0]?.id || ""
  );
  const [searchTerm, setSearchTerm] = React.useState("");
  const { setOpenMobile, isMobile } = useSidebar();


  const handleCostChange = (newCost: number | null) => {
    const cost = newCost ?? 0;
    setCostPrice(cost);
    setSellingPrice(cost * (1 + markup / 100));
  };

  const handleMarkupChange = (newMarkup: number | null) => {
    const mk = newMarkup ?? 0;
    setMarkup(mk);
    setSellingPrice(costPrice * (1 + mk / 100));
  };

  const handleSellingPriceChange = (newSelling: number | null) => {
    const selling = newSelling ?? 0;
    setSellingPrice(selling);
    if (costPrice > 0) {
      setMarkup(((selling / costPrice) - 1) * 100);
    }
  };

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setSearchTerm(""); // Clear search when a category is selected
    if (isMobile) {
      setOpenMobile(false);
    }
  }

  const selectedCategory =
    CATEGORIES.find((c) => c.id === selectedCategoryId) || CATEGORIES[0];
  
  const filteredCategories = React.useMemo(() => {
    if (!searchTerm) return [];
    
    return CATEGORIES.filter(cat => cat.id !== 'retalhos').map(category => {
      const filteredItems = category.items.filter(item => 
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return { ...category, items: filteredItems };
    }).filter(category => category.items.length > 0);
  }, [searchTerm]);
  
  const isScrapCategory = selectedCategoryId === 'retalhos';
  
  const showCustomHeader = !searchTerm && !isScrapCategory;
  const unitLabel = selectedCategory.unit === "m" ? "m" : selectedCategory.unit === 'm²' ? "m²" : "un";
  const weightUnitLabel = `Peso (kg/${unitLabel})`;
  const priceUnitLabel = `Preço (R$/${unitLabel})`;

  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Warehouse className="size-6 text-primary" />
            <h1 className="text-lg font-semibold">Inox PriceCalc</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {CATEGORIES.map((category) => (
              <SidebarMenuItem key={category.id}>
                <SidebarMenuButton
                  onClick={() => handleSelectCategory(category.id)}
                  isActive={selectedCategoryId === category.id && !searchTerm}
                >
                  <Icon name={category.icon as any} />
                  <span>{category.name}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="p-4 md:p-6 flex flex-col gap-6 h-screen">
          <header className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="md:hidden"/>
            </div>
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
            <div className="flex items-center gap-2">
              {!isScrapCategory && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <SlidersHorizontal />
                      <span className="hidden sm:inline">Ajustar</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Ajustar Parâmetros de Preço</DialogTitle>
                    </DialogHeader>
                    <PriceControls
                      costPrice={costPrice}
                      markup={markup}
                      sellingPrice={sellingPrice}
                      onCostChange={handleCostChange}
                      onMarkupChange={handleMarkupChange}
                      onSellingPriceChange={handleSellingPriceChange}
                    />
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </header>
          
          <div className="flex-1 flex flex-col overflow-hidden">
            {showCustomHeader && (
              <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm -mx-4 px-4">
                  <div className="flex h-12 items-center border-b bg-primary/5 px-4 text-sm font-medium text-muted-foreground">
                      <div className="flex-1">Descrição</div>
                      <div className="w-1/4 text-right">{weightUnitLabel}</div>
                      <div className="w-1/4 text-right font-semibold text-primary">{priceUnitLabel}</div>
                  </div>
              </div>
            )}
            <div className="flex-1 overflow-y-auto">
              {searchTerm ? (
                <GlobalSearchResults 
                  categories={filteredCategories}
                  sellingPrice={sellingPrice}
                  searchTerm={searchTerm}
                />
              ) : isScrapCategory ? (
                  <ScrapCalculator />
              ) : (
                <ItemTable 
                  category={selectedCategory} 
                  sellingPrice={sellingPrice}
                  showTableHeader={!showCustomHeader}
                />
              )}
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
