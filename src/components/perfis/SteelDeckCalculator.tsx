
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, PlusCircle, Info, Sparkles, Loader } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { steelDeckData, PESO_CONCRETO_KGF_M3, BudgetItem } from "@/lib/data/index";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { analyzeSlabSelection, AnalyzeSlabSelectionInput, AnalyzeSlabSelectionOutput } from "@/ai/flows/slab-analysis-flow";

interface SteelDeckCalculatorProps {
    onCalculated: (load: number) => void;
    onAddToBudget: (item: BudgetItem) => void;
}

export function SteelDeckCalculator({ onCalculated, onAddToBudget }: SteelDeckCalculatorProps) {
    const [selectedDeckId, setSelectedDeckId] = React.useState<string>(steelDeckData[0].nome);
    const [concreteThickness, setConcreteThickness] = React.useState<string>("12");
    const [extraLoad, setExtraLoad] = React.useState<string>("250");
    const [totalLoad, setTotalLoad] = React.useState<number>(0);
    const { toast } = useToast();

    const [quantity, setQuantity] = React.useState("1");
    const [pricePerKg, setPricePerKg] = React.useState("7.80"); 

    const [isAnalyzing, setIsAnalyzing] = React.useState(false);
    const [analysisResult, setAnalysisResult] = React.useState<AnalyzeSlabSelectionOutput | null>(null);

    const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
        const sanitizedValue = value.replace(/[^0-9,.]/g, '').replace('.', ',');
        if (/^\d*\,?\d*$/.test(sanitizedValue)) {
          setter(sanitizedValue);
        }
    };

    const handleCalculate = async () => {
        const deck = steelDeckData.find(d => d.nome === selectedDeckId);
        if (!deck) return;

        const h_cm = parseFloat(concreteThickness.replace(',', '.')) || 0;
        const S_kgf = parseFloat(extraLoad.replace(',', '.')) || 0;
        
        setAnalysisResult(null);

        if (h_cm > 0) {
            const concreteWeight = (h_cm / 100) * PESO_CONCRETO_KGF_M3;
            const finalLoad = deck.pesoProprio + concreteWeight + S_kgf;
            setTotalLoad(finalLoad);
            onCalculated(finalLoad);
            toast({
              title: "Cálculo da Laje Concluído!",
              description: `A carga total é de ${finalLoad.toFixed(0)} kgf/m². Iniciando análise...`,
            });

            // AI Analysis
            setIsAnalyzing(true);
            try {
                const aiInput: AnalyzeSlabSelectionInput = {
                    deckType: deck.tipo,
                    deckThickness: deck.espessuraChapa,
                    concreteSlabThickness: h_cm,
                    liveLoad: S_kgf,
                    totalLoad: finalLoad,
                };
                const analysis = await analyzeSlabSelection(aiInput);
                setAnalysisResult(analysis);
            } catch (e) {
                console.error("AI slab analysis failed:", e);
                setAnalysisResult({ analysis: "A análise da IA não pôde ser concluída no momento." });
            } finally {
                setIsAnalyzing(false);
            }

        } else {
            setTotalLoad(0);
        }
    };

    const handleAddToBudget = () => {
        const deck = steelDeckData.find(d => d.nome === selectedDeckId);
        if (!deck) return;

        const qty = parseInt(quantity);
        const price = parseFloat(pricePerKg.replace(",", "."));
        
        if (isNaN(qty) || isNaN(price) || qty <= 0 || price <= 0) {
            toast({ variant: "destructive", title: "Valores Inválidos para Orçamento" });
            return;
        }

        const weightPerUnit = deck.pesoProprio; // weight in kg/m²
        const totalWeight = weightPerUnit * qty; 
        const costPerUnit = weightPerUnit * price;
        const totalCost = totalWeight * price;

        const newItem: BudgetItem = {
            id: `${deck.nome}-${Date.now()}`,
            perfil: deck,
            quantity: qty,
            weightPerUnit: weightPerUnit,
            totalWeight,
            costPerUnit,
            totalCost,
            type: 'Steel Deck',
        };

        onAddToBudget(newItem);
        toast({ title: "Item Adicionado!", description: `${qty}m² de ${deck.nome} adicionado(s) ao orçamento.` });
    };

    React.useEffect(() => {
        setTotalLoad(0);
        setAnalysisResult(null);
    }, [selectedDeckId, concreteThickness, extraLoad]);

    const selectedDeck = steelDeckData.find(d => d.nome === selectedDeckId);

    const formatNumber = (value: number, decimals = 2) => {
        return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value);
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Calculadora de Carga de Laje Steel Deck</CardTitle>
                <CardDescription>
                    Calcule a carga total (kgf/m²) da sua laje e adicione o material ao orçamento.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label>Tipo de Steel Deck</Label>
                        <Select value={selectedDeckId} onValueChange={setSelectedDeckId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione o deck" />
                            </SelectTrigger>
                            <SelectContent>
                                {steelDeckData.map(deck => (
                                    <SelectItem key={deck.nome} value={deck.nome}>{deck.nome}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="concrete-thickness">Espessura do Concreto (cm)</Label>
                             <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-xs">
                                        <p className="font-bold mb-1">Recomendações Típicas:</p>
                                        <ul className="list-disc pl-4 text-xs">
                                            <li><strong>8-12 cm:</strong> Lajes leves (coberturas, mezaninos residenciais).</li>
                                            <li><strong>12-16 cm:</strong> Pisos de escritórios e residenciais.</li>
                                            <li><strong>16-20 cm:</strong> Garagens, áreas de armazenamento leve.</li>
                                        </ul>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <Input id="concrete-thickness" type="text" inputMode="decimal" value={concreteThickness} onChange={e => handleInputChange(setConcreteThickness, e.target.value)} placeholder="Ex: 10"/>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="extra-load">Sobrecarga de Utilização (kgf/m²)</Label>
                        <Input id="extra-load" type="text" inputMode="decimal" value={extraLoad} onChange={e => handleInputChange(setExtraLoad, e.target.value)} placeholder="Ex: 250"/>
                    </div>
                </div>
                 <Button onClick={handleCalculate} className="w-full md:w-auto" disabled={isAnalyzing}>
                   {isAnalyzing ? <><Loader className="animate-spin mr-2"/> Analisando...</> : "Calcular Carga e Analisar"}
                </Button>

                {totalLoad > 0 && selectedDeck && (
                     <Card className="mt-4 bg-primary/5 border-primary/20">
                        <CardHeader>
                            <AlertTitle className="text-primary font-bold flex items-center gap-2"><CheckCircle className="h-5 w-5"/> Resultado do Cálculo</AlertTitle>
                        </CardHeader>
                         <CardContent className="space-y-4">
                            <div className="text-center py-2">
                                <p className="text-sm text-muted-foreground">Carga Total da Laje (kgf/m²)</p>
                                <p className="text-4xl font-bold text-primary">{formatNumber(totalLoad, 0)}</p>
                                <p className="text-xs text-muted-foreground mt-1">Use este valor na aba "Viga Secundária (IPE)".</p>
                            </div>

                             {isAnalyzing && (
                                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground p-4">
                                    <Loader className="animate-spin h-4 w-4" />
                                    IA está analisando a seleção...
                                </div>
                             )}
                             {analysisResult && (
                                <Alert variant="default">
                                    <Sparkles className="h-4 w-4" />
                                    <AlertTitle className="font-semibold">Análise da IA</AlertTitle>
                                    <AlertDescription>
                                        {analysisResult.analysis}
                                    </AlertDescription>
                                </Alert>
                             )}

                            <Separator />
                            <div className="grid grid-cols-2 gap-4 border-t pt-4">
                               <div className="space-y-2">
                                  <Label htmlFor="deck-quantity">Quantidade (m²)</Label>
                                  <Input id="deck-quantity" type="text" inputMode="numeric" value={quantity} onChange={(e) => handleInputChange(setQuantity, e.target.value)} placeholder="Ex: 50" />
                              </div>
                               <div className="space-y-2">
                                  <Label htmlFor="deck-pricePerKg">Preço Aço Galvanizado (R$/kg)</Label>
                                  <Input id="deck-pricePerKg" type="text" inputMode="decimal" value={pricePerKg} onChange={(e) => handleInputChange(setPricePerKg, e.target.value)} placeholder="Ex: 7,80" />
                              </div>
                            </div>
                            <Button onClick={handleAddToBudget} className="w-full gap-2"><PlusCircle/> Adicionar Steel Deck ao Orçamento</Button>

                        </CardContent>
                    </Card>
                )}
            </CardContent>
        </Card>
    );
}
