"use client";

import * as React from "react";
import { v4 as uuidv4 } from "uuid";
import { ScrapCalculator } from "./scrap-calculator";
import { PsInoxLogo } from "./ps-inox-logo";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { ScrapList } from "./scrap-list";


const SCRAP_LIST_KEY = "scrapBuilderList";

interface ScrapPiece {
    id: string;
    description: string;
    weight: number;
    price: number;
    pricePerKg?: number;
    quantity?: number;
    unit?: 'm' | 'kg' | 'un';
    listItemId: string;
    basePrice: number; 
    baseWeight: number;
}

export function ScrapListBuilder() {
  const [scrapList, setScrapList] = React.useState<ScrapPiece[]>([]);
  const [editingItemId, setEditingItemId] = React.useState<string | null>(null);
  const { toast } = useToast();
  
  React.useEffect(() => {
    try {
        const savedList = localStorage.getItem(SCRAP_LIST_KEY);
        if (savedList) {
            setScrapList(JSON.parse(savedList));
        }
    } catch(error) {
        console.error("Failed to load data from localStorage", error);
    }
  }, []);

  const saveList = (list: ScrapPiece[]) => {
      try {
          localStorage.setItem(SCRAP_LIST_KEY, JSON.stringify(list));
      } catch (error) {
           console.error("Failed to save scrap list to localStorage", error);
      }
  }
  
  const handleAddItemToList = (item: any) => {
    const newItem: ScrapPiece = {
        ...item,
        listItemId: uuidv4(),
        basePrice: item.price / (item.quantity || 1),
        baseWeight: item.weight / (item.quantity || 1),
    };
    const newList = [...scrapList, newItem];
    setScrapList(newList);
    saveList(newList);
    setEditingItemId(null);
  }
  
  const handleRemoveFromList = (listItemId: string) => {
    const newList = scrapList.filter(item => item.listItemId !== listItemId);
    setScrapList(newList);
    saveList(newList);
    setEditingItemId(null);
  }

  const handleUpdateQuantity = (listItemId: string, newQuantity: number) => {
    const newList = scrapList.map(item => {
        if (item.listItemId === listItemId) {
            return {
                ...item,
                quantity: newQuantity,
                price: item.basePrice * newQuantity,
                weight: item.baseWeight * newQuantity,
            };
        }
        return item;
    });
    setScrapList(newList);
    saveList(newList);
    setEditingItemId(null);
  };
  
  const handleClearList = () => {
    setScrapList([]);
    saveList([]);
    toast({
        title: "Lista Limpa",
        description: "A lista de retalhos foi esvaziada.",
    })
  }

  const handleRowClick = (listItemId: string) => {
      if (editingItemId === listItemId) {
          setEditingItemId(null); 
      } else {
          setEditingItemId(listItemId);
      }
  }
  
  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden bg-background text-foreground p-1 gap-1">
        <div className="flex justify-center py-1 shrink-0">
            <Link href="/">
              <PsInoxLogo />
            </Link>
        </div>

        <div className="flex-1 flex flex-col gap-2 min-h-0">
            <div className="w-full rounded-lg bg-card p-2 flex flex-col border">
                <h2 className="text-lg font-semibold text-center mb-1 text-foreground">Calculadora de Chapas</h2>
                <ScrapCalculator onAddItem={handleAddItemToList} />
            </div>

            <div className="w-full rounded-lg flex flex-col min-h-0 border bg-card p-2">
                <ScrapList 
                    scrapList={scrapList}
                    editingItemId={editingItemId}
                    onRowClick={handleRowClick}
                    onUpdateQuantity={handleUpdateQuantity}
                    onDelete={handleRemoveFromList}
                    onCancelEdit={() => setEditingItemId(null)}
                    onClearList={handleClearList}
                />
            </div>
        </div>
    </div>
  );
}
