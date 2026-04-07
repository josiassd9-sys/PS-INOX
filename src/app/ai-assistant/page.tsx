
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dashboard } from "@/components/dashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { suggestOptimalMarkup, SuggestOptimalMarkupInput, SuggestOptimalMarkupOutput } from "@/ai/flows/suggest-optimal-markup";
import { forecastMaterialCost, ForecastMaterialCostInput, ForecastMaterialCostOutput } from "@/ai/flows/material-cost-forecaster";
import { Lightbulb, TrendingUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefinedButton, RefinedCard } from "@/components/refined-components";
import { FormSkeleton } from "@/components/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";

// Schema for Optimal Markup Assistant
const optimalMarkupFormSchema = z.object({
  itemDescription: z.string().min(1, "A descrição do item é obrigatória."),
  costPrice: z.coerce.number().positive("O preço de custo deve ser um número positivo."),
  currentMarkup: z.coerce.number().min(0, "A margem atual não pode ser negativa."),
});
type OptimalMarkupFormData = z.infer<typeof optimalMarkupFormSchema>;

// Schema for Cost Forecast Assistant
const costForecastFormSchema = z.object({
  marketTrends: z.string().min(1, "A descrição das tendências de mercado é obrigatória."),
  costPrice: z.coerce.number().positive("O preço de custo deve ser um número positivo."),
  marginPercentage: z.coerce.number().min(0, "A margem desejada não pode ser negativa."),
});
type CostForecastFormData = z.infer<typeof costForecastFormSchema>;


function OptimalMarkupAssistant() {
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = React.useState(false);
  const [result, setResult] = React.useState<SuggestOptimalMarkupOutput | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  
  const form = useForm<OptimalMarkupFormData>({
    resolver: zodResolver(optimalMarkupFormSchema),
    defaultValues: {
      itemDescription: "",
      costPrice: 0,
      currentMarkup: 0,
    }
  });

  const onSubmit = async (data: OptimalMarkupFormData) => {
    setIsLoading(true);
    setResult(null);
    setError(null);
    try {
      const input: SuggestOptimalMarkupInput = data;
      const response = await suggestOptimalMarkup(input);
      setResult(response);
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Ocorreu um erro ao consultar o assistente de IA.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RefinedCard hover="subtle" className="p-0 overflow-hidden">
      <CardHeader>
        <CardTitle>Assistente de Markup Ideal</CardTitle>
        <CardDescription>
          Obtenha uma sugestão de markup otimizada para maximizar o lucro e a competitividade.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="itemDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição do Item</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Ex: Barra Chata Inox 304 1.1/2 x 1/4" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="costPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço de Custo (R$)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Ex: 25.50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="currentMarkup"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Markup Atual (%)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Ex: 50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <RefinedButton type="submit" disabled={isLoading} className={isMobile ? "w-full" : ""}>
              {isLoading ? "Analisando..." : "Obter Sugestão"}
            </RefinedButton>
          </form>
        </Form>

        {isLoading && <FormSkeleton />}

        {error && (
           <Alert variant="destructive">
              <AlertTitle>Erro na Análise</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {result && (
           <Alert variant="default" className="mt-4 bg-primary/5 border-primary/20">
               <Lightbulb className="h-4 w-4 text-primary" />
              <AlertTitle className="text-primary font-bold">Sugestão do Assistente</AlertTitle>
              <AlertDescription className="space-y-2 mt-2">
                 <div className="text-center py-2">
                      <p className="text-sm text-muted-foreground">Markup Sugerido</p>
                      <p className="text-4xl font-bold text-primary">{result.suggestedMarkup.toFixed(2)}%</p>
                 </div>
                  <div>
                      <h4 className="font-semibold text-foreground">Justificativa:</h4>
                      <p className="text-muted-foreground">{result.reasoning}</p>
                  </div>
              </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </RefinedCard>
  );
}


function MaterialCostForecaster() {
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = React.useState(false);
  const [result, setResult] = React.useState<ForecastMaterialCostOutput | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  
  const form = useForm<CostForecastFormData>({
    resolver: zodResolver(costForecastFormSchema),
    defaultValues: {
      marketTrends: "",
      costPrice: 0,
      marginPercentage: 0,
    }
  });

  const onSubmit = async (data: CostForecastFormData) => {
    setIsLoading(true);
    setResult(null);
    setError(null);
    try {
      const input: ForecastMaterialCostInput = data;
      const response = await forecastMaterialCost(input);
      setResult(response);
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Ocorreu um erro ao consultar o assistente de IA.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RefinedCard hover="subtle" className="p-0 overflow-hidden">
      <CardHeader>
        <CardTitle>Previsão de Custo de Material</CardTitle>
        <CardDescription>
          Antecipe flutuações no custo do aço inoxidável e ajuste seu preço de venda para proteger sua margem.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="marketTrends"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tendências de Mercado</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Ex: Aumento na demanda asiática, novos impostos de importação..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="costPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custo Atual (R$/kg)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Ex: 30.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="marginPercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Margem Desejada (%)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Ex: 50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <RefinedButton type="submit" disabled={isLoading} className={isMobile ? "w-full" : ""}>
              {isLoading ? "Prevendo..." : "Obter Previsão"}
            </RefinedButton>
          </form>
        </Form>

        {isLoading && <FormSkeleton />}

        {error && (
           <Alert variant="destructive">
              <AlertTitle>Erro na Previsão</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {result && (
           <Alert variant="default" className="mt-4 bg-primary/5 border-primary/20">
               <TrendingUp className="h-4 w-4 text-primary" />
              <AlertTitle className="text-primary font-bold">Previsão do Assistente</AlertTitle>
              <AlertDescription className="space-y-3 mt-2">
                   <div>
                        <h4 className="font-semibold text-foreground">Previsão de Flutuação de Custo:</h4>
                        <p className="text-muted-foreground">{result.costFluctuationForecast}</p>
                   </div>
                   <div className="text-center py-2">
                        <p className="text-sm text-muted-foreground">Preço de Venda Ajustado Sugerido (R$/kg)</p>
                        <p className="text-4xl font-bold text-primary">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(result.adjustedSellingPrice)}
                        </p>
                   </div>
              </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </RefinedCard>
  );
}


export default function Page() {
    const isMobile = useIsMobile();

    return (
        <Dashboard initialCategoryId="ai-assistant">
          <div className="container mx-auto px-3 py-4 md:p-4">
             <Tabs defaultValue="markup" className="w-full">
                <TabsList className={isMobile ? "grid w-full grid-cols-1 h-auto gap-2 bg-transparent p-0" : "grid w-full grid-cols-2"}>
                  <TabsTrigger value="markup">Markup Ideal</TabsTrigger>
                  <TabsTrigger value="cost-forecast">Previsão de Custo</TabsTrigger>
                </TabsList>
                <TabsContent value="markup" className="mt-4">
                  <OptimalMarkupAssistant />
                </TabsContent>
                <TabsContent value="cost-forecast" className="mt-4">
                  <MaterialCostForecaster />
                </TabsContent>
              </Tabs>
          </div>
        </Dashboard>
    )
}
