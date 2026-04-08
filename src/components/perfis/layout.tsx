
"use client";

import { Dashboard } from "@/components/dashboard";
import * as React from "react";
import { BudgetTable } from "@/components/perfis/BudgetTable";
import { CalculatorTabs } from "@/components/perfis/CalculatorTabs";
import { CalculatorProvider, useCalculator } from "@/app/perfis/calculadora/CalculatorContext";

function CalculatorLayoutContent({ children }: { children: React.ReactNode }) {
    const { budgetItems, onClearBudget, onSaveBudget, onPrintBudget } = useCalculator();
    
    return (
        <Dashboard initialCategoryId="perfis/calculadora">
      <div className="mx-auto w-full max-w-7xl overflow-x-hidden px-3 py-4 md:p-4 space-y-4 print:p-0">
                <CalculatorTabs />
                
                <div className="mt-4 min-w-0 w-full overflow-x-hidden">
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
