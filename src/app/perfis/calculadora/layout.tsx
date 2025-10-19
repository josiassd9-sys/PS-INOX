
"use client";

import { Dashboard } from "@/components/dashboard";
import * as React from "react";
import { BudgetTable } from "@/components/perfis/BudgetTable";
import { CalculatorTabs } from "@/components/perfis/CalculatorTabs";
import { CalculatorProvider, useCalculator } from "./CalculatorContext";

function CalculatorLayoutContent({ children }: { children: React.ReactNode }) {
    const { budgetItems, onClearBudget, onSaveBudget, onPrintBudget } = useCalculator();
    
    return (
        <Dashboard initialCategoryId="perfis/calculadora">
            <div className="container mx-auto p-4 space-y-4 print:p-0">
                <CalculatorTabs />
                
                <div className="mt-4">
                  {children}
                </div>
                
                {budgetItems.length > 0 && (
                    <BudgetTable 
                        items={budgetItems}
                        onClear={onClearBudget}
                        onSave={onSaveBudget}
                        onPrint={onPrintBudget}
                    />
                )}
            </div>
        </Dashboard>
    );
}

export default function CalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CalculatorProvider>
      <CalculatorLayoutContent>
        {children}
      </CalculatorLayoutContent>
    </CalculatorProvider>
  );
}
