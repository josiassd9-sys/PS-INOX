"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "./ui/button";
import { Loader2, Sparkles } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { suggestOptimalMarkup } from "@/ai/flows/suggest-optimal-markup";
import { useToast } from "@/hooks/use-toast";

interface PriceControlsProps {
  costPrice: number;
  markup: number;
  sellingPrice: number;
  onCostChange: (value: number | null) => void;
  onMarkupChange: (value: number | null) => void;
  onSellingPriceChange: (value: number | null) => void;
}

export function PriceControls({
  costPrice,
  markup,
  sellingPrice,
  onCostChange,
  onMarkupChange,
  onSellingPriceChange,
}: PriceControlsProps) {
  const { toast } = useToast();
  const [aiSuggestion, setAiSuggestion] = React.useState<{ suggestedMarkup: number; reasoning: string } | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const handleGenerateSuggestion = async () => {
    setIsLoading(true);
    setAiSuggestion(null);
    try {
      const result = await suggestOptimalMarkup({
        costPrice,
        currentMarkup: markup,
        itemDescription: "Peça de aço inoxidável para uso industrial geral",
      });
      setAiSuggestion(result);
    } catch (error) {
      console.error("Error fetching AI suggestion:", error);
      toast({
        variant: "destructive",
        title: "Erro ao buscar sugestão",
        description: "Não foi possível obter uma sugestão da IA. Tente novamente.",
      });
      setIsDialogOpen(false);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleApplySuggestion = () => {
    if (aiSuggestion) {
      onMarkupChange(aiSuggestion.suggestedMarkup);
      toast({
        title: "Markup Atualizado",
        description: `O markup foi atualizado para ${aiSuggestion.suggestedMarkup.toFixed(2)}%.`,
      });
    }
    setIsDialogOpen(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Parâmetros de Preço Universal</CardTitle>
        <CardDescription>
          Altere os valores de custo, margem ou venda. Os preços de todos os
          itens serão atualizados em tempo real.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-2">
            <Label htmlFor="cost-price">Custo (R$/kg)</Label>
            <Input
              id="cost-price"
              type="number"
              value={costPrice > 0 ? costPrice : ""}
              onChange={(e) => onCostChange(e.target.valueAsNumber)}
              placeholder="Ex: 25.50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="markup">Margem de Lucro (%)</Label>
            <Input
              id="markup"
              type="number"
              value={markup > 0 ? markup.toFixed(2) : ""}
              onChange={(e) => onMarkupChange(e.target.valueAsNumber)}
              placeholder="Ex: 40"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="selling-price">Venda (R$/kg)</Label>
            <Input
              id="selling-price"
              type="number"
              value={sellingPrice > 0 ? sellingPrice.toFixed(2) : ""}
              onChange={(e) => onSellingPriceChange(e.target.valueAsNumber)}
              placeholder="Ex: 35.70"
            />
          </div>

          <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="outline" onClick={handleGenerateSuggestion}>
                <Sparkles className="mr-2" />
                Sugerir Margem (IA)
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Sugestão de Markup (IA)</AlertDialogTitle>
                <AlertDialogDescription>
                  {isLoading && "Analisando dados de mercado para sugerir o markup ideal..."}
                  {!isLoading && !aiSuggestion && "Não foi possível obter uma sugestão. Tente novamente."}
                  {aiSuggestion && "Com base nos dados, aqui está uma sugestão de markup:"}
                </AlertDialogDescription>
              </AlertDialogHeader>
              {isLoading && (
                <div className="flex justify-center items-center h-24">
                  <Loader2 className="animate-spin h-8 w-8 text-primary" />
                </div>
              )}
              {aiSuggestion && !isLoading && (
                <div className="space-y-4">
                  <p className="text-4xl font-bold text-center text-primary">
                    {aiSuggestion.suggestedMarkup.toFixed(2)}%
                  </p>
                  <Card className="bg-muted/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Justificativa</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {aiSuggestion.reasoning}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleApplySuggestion} disabled={!aiSuggestion || isLoading}>
                  Aplicar Sugestão
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
