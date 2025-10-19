
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

export function CalculatorProvider({ children, value }: { children: React.ReactNode; value: CalculatorContextType }) {
  return (
    <CalculatorContext.Provider value={value}>
      {children}
    </CalculatorContext.Provider>
  );
}

export function useCalculator() {
  const context = React.useContext(CalculatorContext);
  if (context === undefined) {
    throw new Error('useCalculator must be used within a CalculatorProvider');
  }
  return context;
}
