
"use client";

import * as React from 'react';
import { BudgetItem, SupportReaction } from '@/lib/data';

interface CalculatorContextType {
  budgetItems: BudgetItem[];
  lastSlabLoad: number;
  supportReactions: SupportReaction;
  finalPillarLoad: number;
  onAddToBudget: (item: BudgetItem) => void;
  setLastSlabLoad: (load: number) => void;
  onVigaPrincipalReactionCalculated: (reaction: number) => void;
  onVigaSecundariaReactionCalculated: (reaction: number) => void;
  onPillarLoadCalculated: (load: number) => void;
}

const CalculatorContext = React.createContext<CalculatorContextType | undefined>(undefined);

export function CalculatorProvider({ children }: { children: React.ReactNode }) {
  const [budgetItems, setBudgetItems] = React.useState<BudgetItem[]>([]);
  const [lastSlabLoad, setLastSlabLoad] = React.useState(0);
  const [supportReactions, setSupportReactions] = React.useState<SupportReaction>({ vigaPrincipal: 0, vigaSecundaria: 0 });
  const [finalPillarLoad, setFinalPillarLoad] = React.useState(0);
  const { toast } = React.useContext(ToastContext);


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
    onClearBudget: handleClearBudget,
    onSaveBudget: handleSaveBudget,
    onPrintBudget: handlePrintBudget,
  };

  return (
    <CalculatorContext.Provider value={contextValue}>
      {children}
    </CalculatorContext.Provider>
  );
}

// Dummy ToastContext to avoid breaking changes if not present
const ToastContext = React.createContext({ toast: (options: any) => {} });

export function useCalculator() {
  const context = React.useContext(CalculatorContext);
  if (context === undefined) {
    throw new Error('useCalculator must be used within a CalculatorProvider');
  }
  return context;
}
