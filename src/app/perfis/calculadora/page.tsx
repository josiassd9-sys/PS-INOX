
"use client";

import { Dashboard } from "@/components/dashboard";
import * as React from "react";
import { perfisData, Perfil, perfisIpeData, PerfilIpe, steelDeckData, SteelDeck, BudgetItem, SupportReaction } from "@/lib/data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SteelDeckCalculator } from "@/components/perfis/SteelDeckCalculator";
import { VigaSecundariaCalculator } from "@/components/perfis/VigaSecundariaCalculator";
import { VigaPrincipalCalculator } from "@/components/perfis/VigaPrincipalCalculator";
import { PilarCalculator } from "@/components/perfis/PilarCalculator";
import { BudgetTable } from "@/components/perfis/BudgetTable";
import { useToast } from "@/hooks/use-toast";

export default function Page() {
  const [budgetItems, setBudgetItems] = React.useState<BudgetItem[]>([]);
  const [lastSlabLoad, setLastSlabLoad] = React.useState(0);
  const [supportReactions, setSupportReactions] = React.useState<SupportReaction>({ vigaPrincipal: 0, vigaSecundaria: 0 });
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

  return (
      <Dashboard initialCategoryId="perfis/calculadora">
        <div className="container mx-auto p-4 space-y-4 print:p-0">
            <Tabs defaultValue="laje-deck" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="laje-deck">1. Laje</TabsTrigger>
                    <TabsTrigger value="viga-secundaria">2. Viga Sec.</TabsTrigger>
                    <TabsTrigger value="viga-principal">3. Viga Princ.</TabsTrigger>
                    <TabsTrigger value="pilar">4. Pilar</TabsTrigger>
                </TabsList>
                <TabsContent value="laje-deck">
                    <SteelDeckCalculator onCalculated={setLastSlabLoad} onAddToBudget={handleAddToBudget} />
                </TabsContent>
                <TabsContent value="viga-secundaria">
                    <VigaSecundariaCalculator onAddToBudget={handleAddToBudget} lastSlabLoad={lastSlabLoad} onReactionCalculated={handleVigaSecundariaReaction}/>
                </TabsContent>
                 <TabsContent value="viga-principal">
                    <VigaPrincipalCalculator onAddToBudget={handleAddToBudget} onReactionCalculated={handleVigaPrincipalReaction} />
                </TabsContent>
                 <TabsContent value="pilar">
                    <PilarCalculator onAddToBudget={handleAddToBudget} supportReactions={supportReactions} />
                </TabsContent>
            </Tabs>
            
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
