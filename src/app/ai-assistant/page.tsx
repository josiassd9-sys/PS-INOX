
"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dashboard } from "@/components/dashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { suggestOptimalMarkup, SuggestOptimalMarkupInput, SuggestOptimalMarkupOutput } from "@/ai/flows/suggest-optimal-markup";
import { Lightbulb } from "lucide-react";

const formSchema = z.object({
  itemDescription: z.string().min(1, "A descrição do item é obrigatória."),
  costPrice: z.coerce.number().positive("O preço de custo deve ser um número positivo."),
  currentMarkup: z.coerce.number().min(0, "A margem atual não pode ser negativa."),
});

type FormData = z.infer<typeof formSchema>;

function OptimalMarkupAssistant() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [result, setResult] = React.useState<SuggestOptimalMarkupOutput | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      itemDescription: "",
      costPrice: 0,
      currentMarkup: 0,
    }
  });

  const onSubmit = async (data: FormData) => {
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
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Assistente de Markup Ideal</CardTitle>
          <CardDescription>
            Use o poder da IA para obter uma sugestão de markup otimizada para seus produtos de aço inoxidável, maximizando o lucro e a competitividade.
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
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Analisando..." : "Obter Sugestão"}
              </Button>
            </form>
          </Form>

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
      </Card>
    </div>
  );
}


export default function Page() {
    return (
        <Dashboard initialCategoryId="ai-assistant">
            <OptimalMarkupAssistant />
        </Dashboard>
    )
}
