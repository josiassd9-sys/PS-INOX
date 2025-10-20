
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
import { steelDeckData, PESO_CONCRETO_KGF_M3, BudgetItem, liveLoadOptions, LiveLoadOption, SteelDeck } from "@/lib/data/index";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useCalculator, LajeInputs } from "@/app/perfis/calculadora/CalculatorContext";

interface AnalysisResult {
  analysis: string;
}

interface LajeCalcResult {
    deck: SteelDeck,
    totalLoad: number;
}

function getLocalAnalysis(deck: any, totalLoad: number, concreteThickness: number, liveLoad: number): AnalysisResult {
    let analysisText = `A carga total de ~${totalLoad.toFixed(0)} kgf/m² é coerente para a sobrecarga de ${liveLoad} kgf/m² e a espessura de concreto de ${concreteThickness} cm.\n\n`;
    if (liveLoad >= 400) analysisText += "Esta sobrecarga é adequada para depósitos leves ou áreas com equipamentos.\n";
    else if (liveLoad >= 200) analysisText += "Esta sobrecarga é comum para escritórios, áreas comerciais e residenciais com maior concentração de pessoas.\n";
    else analysisText += "Esta sobrecarga é típica para áreas residenciais com uso comum.\n";
    if (deck.tipo === 'MD75' && concreteThickness > 15) analysisText += `O uso do ${deck.tipo} com uma laje de ${concreteThickness} cm é uma boa escolha para vencer vãos maiores entre as vigas, otimizando a estrutura secundária.\n`;
    else if (deck.tipo === 'MD57' && concreteThickness <= 12) analysisText += `A combinação de ${deck.tipo} com ${concreteThickness} cm é uma solução econômica e eficiente para vãos moderados.\n`;
    if (concreteThickness < 8) analysisText += "ATENÇÃO: Uma espessura de concreto inferior a 8cm pode não ser suficiente para garantir o cobrimento adequado da armadura e a resistência ao fogo exigida por norma.\n";
    else if (concreteThickness > 20) analysisText += "Observação: Lajes com espessura superior a 20cm adicionam um peso próprio considerável à estrutura, o que impactará no dimensionamento de vigas e pilares.\n";
    analysisText += "\nLembre-se de usar a carga total calculada para dimensionar as vigas secundárias que apoiarão esta laje.";
    return { analysis: analysisText };
}

export function SteelDeckCalculator() {
    const { onAddToBudget, updateLaje, laje } = useCalculator();
    const { selectedDeckId, concreteThickness, selectedLoads, extraLoad, quantity, pricePerKg, result, analysis } = laje;
    
    const [isAnalyzing, setIsAnalyzing] = React.useState(false);
    const { toast } = useToast();
    
    React.useEffect(() => {
        const total = selectedLoads.reduce((acc, id) => {
            const load = liveLoadOptions.find(o => o.id === id);
            return acc + (load?.value || 0);
        }, 0);
        if (total.toString() !== extraLoad) {
            updateLaje({ extraLoad: total.toString() });
        }
    }, [selectedLoads, extraLoad, updateLaje]);

    const handleInputChange = (field: keyof LajeInputs, value: string) => {
        const sanitizedValue = value.replace(/[^0-9,.]/g, '').replace('.', ',');
        if (/^\d*\,?\d*$/.test(sanitizedValue)) {
            updateLaje({ [field]: sanitizedValue });
        }
    };
    
    const handleCalculate = () => {
        const deck = steelDeckData.find(d => d.nome === selectedDeckId);
        if (!deck) return;
        const h_cm = parseFloat(concreteThickness.replace(',', '.')) || 0;
        const S_kgf = parseFloat(extraLoad.replace(',', '.')) || 0;
        
        updateLaje({ analysis: null, result: null });
        if (h_cm > 0) {
            const concreteWeight = (h_cm / 100) * PESO_CONCRETO_KGF_M3;
            const finalLoad = deck.pesoProprio + concreteWeight + S_kgf;
            updateLaje({ result: { deck, totalLoad: finalLoad } });
            toast({ title: "Cálculo da Laje Concluído!", description: `A carga total é de ${finalLoad.toFixed(0)} kgf/m².` });
        } else {
             updateLaje({ result: null });
        }
    };

    const handleAnalyze = () => {
        if (!result) {
            toast({ variant: "destructive", title: "Cálculo necessário", description: "Calcule a carga antes de analisar."});
            return;
        };
        const h_cm = parseFloat(concreteThickness.replace(',', '.')) || 0;
        const S_kgf = parseFloat(extraLoad.replace(',', '.')) || 0;
        setIsAnalyzing(true);
        updateLaje({ analysis: null });
        setTimeout(() => {
            const analysisResult = getLocalAnalysis(result.deck, result.totalLoad, h_cm, S_kgf);
            updateLaje({ analysis: analysisResult });
            setIsAnalyzing(false);
        }, 500);
    };

    const handleAddToBudget = () => {
        if (!result) return;
        const qty = parseInt(quantity);
        const price = parseFloat(pricePerKg.replace(",", "."));
        if (isNaN(qty) || isNaN(price) || qty <= 0 || price <= 0) {
            toast({ variant: "destructive", title: "Valores Inválidos para Orçamento" });
            return;
        }
        const weightPerUnit = result.deck.pesoProprio;
        const totalWeight = weightPerUnit * qty; 
        const costPerUnit = weightPerUnit * price;
        const totalCost = totalWeight * price;
        const newItem: BudgetItem = {
            id: `${result.deck.nome}-${Date.now()}`, perfil: result.deck, quantity: qty,
            weightPerUnit, totalWeight, costPerUnit, totalCost, type: 'Steel Deck',
        };
        onAddToBudget(newItem);
        toast({ title: "Item Adicionado!", description: `${qty}m² de ${result.deck.nome} adicionado(s) ao orçamento.` });
    };

    React.useEffect(() => {
        updateLaje({ result: null, analysis: null });
    }, [selectedDeckId, concreteThickness, extraLoad, updateLaje]);

    const formatNumber = (value: number, decimals = 2) => new Intl.NumberFormat('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value);
    
    const handleLoadSelection = (id: string, checked: boolean) => {
        const optionInfo = liveLoadOptions.find(o => o.id === id);
        if (!optionInfo) return;
        
        let newSelectedLoads;
        if (checked) {
             if (optionInfo.exclusive) {
                const exclusiveGroup = optionInfo.group;
                const othersInGroup = liveLoadOptions.filter(o => o.group === exclusiveGroup && o.id !== id).map(o => o.id);
                const filteredPrev = selectedLoads.filter(p => !othersInGroup.includes(p));
                newSelectedLoads = [...filteredPrev, id];
            } else {
                newSelectedLoads = [...selectedLoads, id];
            }
        } else {
            newSelectedLoads = selectedLoads.filter(lId => lId !== id);
        }
        updateLaje({ selectedLoads: newSelectedLoads });
    }
    
    const renderLoadOptions = (group: LiveLoadOption['group']) => {
        return liveLoadOptions.filter(o => o.group === group).map(option => (
             <div key={option.id} className="flex items-center space-x-2 p-2 rounded-md bg-background border">
                <Checkbox id={option.id} checked={selectedLoads.includes(option.id)} onCheckedChange={(checked) => handleLoadSelection(option.id, !!checked)} />
                <label htmlFor={option.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                   {option.label} <span className="text-xs text-muted-foreground">({option.value} kgf/m²)</span>
                </label>
            </div>
        ))
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Calculadora de Carga de Laje Steel Deck</CardTitle>
                <CardDescription>Calcule a carga total (kgf/m²) da sua laje e adicione o material ao orçamento.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Tipo de Steel Deck</Label>
                        <Select value={selectedDeckId} onValueChange={(value) => updateLaje({ selectedDeckId: value })}>
                            <SelectTrigger><SelectValue placeholder="Selecione o deck" /></SelectTrigger>
                            <SelectContent>{steelDeckData.map(deck => <SelectItem key={deck.nome} value={deck.nome}>{deck.nome}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="concrete-thickness">Espessura do Concreto (cm)</Label>
                             <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild><Info className="h-4 w-4 text-muted-foreground cursor-help" /></TooltipTrigger>
                                    <TooltipContent className="max-w-xs"><p className="font-bold mb-1">Recomendações Típicas:</p><ul className="list-disc pl-4 text-xs"><li><strong>8-12 cm:</strong> Lajes leves.</li><li><strong>12-16 cm:</strong> Pisos de escritórios e residenciais.</li><li><strong>16-20 cm:</strong> Garagens, áreas de armazenamento leve.</li></ul></TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <Input id="concrete-thickness" type="text" inputMode="decimal" value={concreteThickness} onChange={e => handleInputChange('concreteThickness', e.target.value)} placeholder="Ex: 10"/>
                    </div>
                </div>
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="load-builder" className="border rounded-md px-2 bg-muted/30">
                        <AccordionTrigger className="text-base font-semibold hover:no-underline">Construtor de Sobrecarga de Utilização</AccordionTrigger>
                        <AccordionContent className="pt-2">
                             <div className="space-y-3">
                                <div><h4 className="font-medium text-sm mb-1">Uso Principal <span className="text-xs text-muted-foreground">(selecione um)</span></h4><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">{renderLoadOptions('uso')}</div></div>
                                <div><h4 className="font-medium text-sm mb-1">Cobertura <span className="text-xs text-muted-foreground">(selecione um)</span></h4><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">{renderLoadOptions('cobertura')}</div></div>
                                <div><h4 className="font-medium text-sm mb-1">Cargas Adicionais <span className="text-xs text-muted-foreground">(selecione quantas precisar)</span></h4><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">{renderLoadOptions('adicional')}</div></div>
                                <Separator />
                                <div className="space-y-2 pt-2">
                                    <Label htmlFor="extra-load">Sobrecarga de Utilização Total (kgf/m²)</Label>
                                    <Input id="extra-load" type="text" value={extraLoad} readOnly className="font-bold bg-background"/>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
                <Button type="button" onClick={handleCalculate} className="w-full md:w-auto">Calcular Carga</Button>
                {result && (
                     <Card className="mt-4 bg-primary/5 border-primary/20">
                        <CardHeader>
                            <AlertTitle className="text-primary font-bold flex items-center gap-2"><CheckCircle className="h-5 w-5"/> Resultado do Cálculo</AlertTitle>
                        </CardHeader>
                         <CardContent className="space-y-4">
                            <div className="text-center py-2">
                                <p className="text-sm text-muted-foreground">Carga Total da Laje (kgf/m²)</p>
                                <p className="text-4xl font-bold text-primary">{formatNumber(result.totalLoad, 0)}</p>
                                <p className="text-xs text-muted-foreground mt-1">Use este valor na aba "Viga Secundária (IPE)".</p>
                            </div>
                            <Button type="button" onClick={handleAnalyze} className="w-full" disabled={isAnalyzing}>
                                {isAnalyzing ? <><Loader className="animate-spin mr-2"/> Analisando...</> : <><Sparkles className="mr-2"/> Analisar Seleção</>}
                            </Button>
                            {isAnalyzing && <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground p-4"><Loader className="animate-spin h-4 w-4" />Gerando análise local...</div>}
                            {analysis && (
                                <Alert variant="default">
                                    <Sparkles className="h-4 w-4" /><AlertTitle className="font-semibold">Análise Lógica</AlertTitle>
                                    <AlertDescription className="whitespace-pre-line">{analysis.analysis}</AlertDescription>
                                </Alert>
                            )}
                            <Separator />
                            <div className="grid grid-cols-2 gap-4 border-t pt-4">
                               <div className="space-y-2">
                                  <Label htmlFor="deck-quantity">Quantidade (m²)</Label>
                                  <Input id="deck-quantity" type="text" inputMode="numeric" value={quantity} onChange={(e) => handleInputChange('quantity', e.target.value)} placeholder="Ex: 50" />
                              </div>
                               <div className="space-y-2">
                                  <Label htmlFor="deck-pricePerKg">Preço Aço Galvanizado (R$/kg)</Label>
                                  <Input id="deck-pricePerKg" type="text" inputMode="decimal" value={pricePerKg} onChange={(e) => handleInputChange('pricePerKg', e.target.value)} placeholder="Ex: 7,80" />
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
