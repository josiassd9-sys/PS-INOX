
"use client";

import { Dashboard } from "@/components/dashboard";
import * as React from "react";
import { useToast } from "@/hooks/use-toast";
import { BudgetItem, SupportReaction } from "@/lib/data/index";
import { BudgetTable } from "@/components/perfis/BudgetTable";
import { CalculatorTabs } from "@/components/perfis/CalculatorTabs";
import { CalculatorProvider } from "./CalculatorContext";


export default function CalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [budgetItems, setBudgetItems] = React.useState<BudgetItem[]>([]);
  const [lastSlabLoad, setLastSlabLoad] = React.useState(0);
  const [supportReactions, setSupportReactions] = React.useState<SupportReaction>({ vigaPrincipal: 0, vigaSecundaria: 0 });
  const [finalPillarLoad, setFinalPillarLoad] = React.useState(0);
  const { toast } = useToast();

  const handleAddToBudget = (item: BudgetItem) => {
    setBudgetItems(prev => [...prev, item]);
  };
  
  const handleVigaPrincipalReaction = (reaction: number) => {
    setSupportReactions(prev => ({...prev, vigaPrincipal: reaction}));
  }
  const handleVigaSecundariaReaction = (reaction: number) => {
    setSupportReactions(prev => ({...prev, vigaSecundaria: reaction}));
  }

  const handlePillarLoadCalculated = (load: number) => {
      setFinalPillarLoad(load);
  }

  const handleClearBudget = () => {
      setBudgetItems([]);
      toast({
          title: "Orçamento Limpo",
          description: "A lista de itens foi removida.",
      })
  }
  
  const handleSaveBudget = () => {
    toast({
        title: "Orçamento Salvo!",
        description: "Seu orçamento foi salvo com sucesso (simulação).",
    })
  }

  const handlePrintBudget = () => {
      window.print();
  }

  const contextValue = {
    budgetItems,
    lastSlabLoad,
    supportReactions,
    finalPillarLoad,
    onAddToBudget: handleAddToBudget,
    setLastSlabLoad,
    onVigaPrincipalReactionCalculated: handleVigaPrincipalReaction,
    onVigaSecundariaReactionCalculated: handleVigaSecundariaReaction,
    onPillarLoadCalculated: handlePillarLoadCalculated,
  };
  
  return (
    <CalculatorProvider value={contextValue}>
      <Dashboard initialCategoryId="perfis/calculadora">
        <div className="container mx-auto p-4 space-y-4 print:p-0">
            <CalculatorTabs />
            
            <div className="mt-4">
              {children}
            </div>
            
            {budgetItems.length > 0 && (
                <BudgetTable 
                    items={budgetItems}
                    onClear={handleClearBudget}
                    onSave={handleSaveBudget}
                    onPrint={handlePrintBudget}
                />
            )}
        </div>
      </Dashboard>
    </CalculatorProvider>
  );
}
