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
import { Warehouse } from "lucide-react";
import { PriceControls } from "./price-controls";
import { ItemTable } from "./item-table";
import { Icon } from "./icons";

export function Dashboard() {
  const [costPrice, setCostPrice] = React.useState(30);
  const [markup, setMarkup] = React.useState(50);
  const [sellingPrice, setSellingPrice] = React.useState(
    costPrice * (1 + markup / 100)
  );
  const [selectedCategoryId, setSelectedCategoryId] = React.useState(
    CATEGORIES[0]?.id || ""
  );

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

  const selectedCategory =
    CATEGORIES.find((c) => c.id === selectedCategoryId) || CATEGORIES[0];

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
                  onClick={() => setSelectedCategoryId(category.id)}
                  isActive={selectedCategoryId === category.id}
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
          <header className="flex items-center justify-between md:justify-end">
            <SidebarTrigger className="md:hidden"/>
            <h2 className="text-xl font-semibold md:hidden">
                {selectedCategory?.name}
            </h2>
            <div className="w-7"/>
          </header>
          <div className="sticky top-0 z-10 bg-background/95 py-4 backdrop-blur-sm -mx-4 px-4 -mt-4 pt-4 md:-mx-6 md:px-6">
            <PriceControls
              costPrice={costPrice}
              markup={markup}
              sellingPrice={sellingPrice}
              onCostChange={handleCostChange}
              onMarkupChange={handleMarkupChange}
              onSellingPriceChange={handleSellingPriceChange}
            />
          </div>
          <div className="-mt-4">
            <ItemTable 
              category={selectedCategory} 
              sellingPrice={sellingPrice} 
            />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
