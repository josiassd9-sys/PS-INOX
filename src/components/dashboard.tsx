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
} from "@/components/ui/sidebar";
import { Search, Warehouse } from "lucide-react";
import { PriceControls } from "./price-controls";
import { ItemTable } from "./item-table";
import { Icon } from "./icons";
import { Input } from "./ui/input";
import { GlobalSearchResults } from "./global-search-results";

export function Dashboard() {
  const [costPrice, setCostPrice] = React.useState(30);
  const [markup, setMarkup] = React.useState(50);
  const [sellingPrice, setSellingPrice] = React.useState(
    costPrice * (1 + markup / 100)
  );
  const [selectedCategoryId, setSelectedCategoryId] = React.useState(
    CATEGORIES[0]?.id || ""
  );
  const [searchTerm, setSearchTerm] = React.useState("");

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
  }

  const selectedCategory =
    CATEGORIES.find((c) => c.id === selectedCategoryId) || CATEGORIES[0];
  
  const filteredCategories = React.useMemo(() => {
    if (!searchTerm) return [];
    
    return CATEGORIES.map(category => {
      const filteredItems = category.items.filter(item => 
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return { ...category, items: filteredItems };
    }).filter(category => category.items.length > 0);
  }, [searchTerm]);

  return (
    <SidebarProvider>
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
        <div className="p-4 md:p-6 flex flex-col gap-6">
          <header className="flex items-center justify-between">
            <SidebarTrigger className="md:hidden"/>
          </header>
          <div className="space-y-4">
            <PriceControls
              costPrice={costPrice}
              markup={markup}
              sellingPrice={sellingPrice}
              onCostChange={handleCostChange}
              onMarkupChange={handleMarkupChange}
              onSellingPriceChange={handleSellingPriceChange}
            />
             <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                type="search"
                placeholder="Buscar em todas as categorias..."
                className="w-full rounded-lg bg-background pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
          </div>
          <div>
            {searchTerm ? (
              <GlobalSearchResults 
                categories={filteredCategories}
                sellingPrice={sellingPrice}
                searchTerm={searchTerm}
              />
            ) : (
              <ItemTable 
                category={selectedCategory} 
                sellingPrice={sellingPrice} 
              />
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
