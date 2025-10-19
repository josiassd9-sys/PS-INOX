
"use client";

import { Dashboard } from "@/components/dashboard";
import * as React from "react";
import { useToast } from "@/hooks/use-toast";
import { BudgetItem, SupportReaction } from "@/lib/data/index";
import { BudgetTable } from "@/components/perfis/BudgetTable";
import { CalculatorTabs } from "@/components/perfis/CalculatorTabs";

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

  // Inject shared state and handlers into child components
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child) && typeof child.type === 'function') {
      const pageName = (child.type as any).displayName;
      let extraProps: any = {
          onAddToBudget: handleAddToBudget,
      };

      if (pageName === 'LajePage') {
        extraProps.onCalculated = setLastSlabLoad;
      }
      if (pageName === 'VigaSecundariaPage') {
          extraProps.lastSlabLoad = lastSlabLoad;
          extraProps.onReactionCalculated = handleVigaSecundariaReaction;
      }
       if (pageName === 'VigaPrincipalPage') {
          extraProps.onReactionCalculated = handleVigaPrincipalReaction;
      }
      if (pageName === 'PilarPage') {
          extraProps.supportReactions = supportReactions;
          extraProps.onPillarLoadCalculated = handlePillarLoadCalculated;
      }
      if (pageName === 'SapataPage') {
          extraProps.pillarLoad = finalPillarLoad;
      }

      return React.cloneElement(child, extraProps);
    }
    return child;
  });
  
  return (
    <Dashboard initialCategoryId="perfis/calculadora">
      <div className="container mx-auto p-4 space-y-4 print:p-0">
          <CalculatorTabs />
          
          <div className="mt-4">
            {childrenWithProps}
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
  );
}
