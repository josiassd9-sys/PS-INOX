
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, PlusCircle, Sparkles, Loader } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { perfisData, tiposAco, BudgetItem, Perfil, E_ACO_MPA } from "@/lib/data/index";
import { useCalculator, PilarInputs } from "@/app/perfis/calculadora/CalculatorContext";

interface PilarCalcResult {
    profile: Perfil;
    actingStress: number; 
    allowableStress: number; 
}

interface AnalysisResult {
    analysis: string;
}

function getLocalAnalysis(result: PilarCalcResult, reactions: { vigaPrincipal: number, vigaSecundaria: number, pilar: number }, safetyFactor: number): AnalysisResult {
    const { profile, actingStress, allowableStress } = result;
    const utilization = (actingStress / allowableStress) * 100;
    let analysisText = `O perfil ${profile.nome} está trabalhando com ${utilization.toFixed(1)}% de sua capacidade resistente à flambagem, indicando um dimensionamento seguro para a carga já majorada pelo fator de segurança de ${safetyFactor.toFixed(2)}.\n\n`;
    
    const totalReactionKGF = reactions.vigaPrincipal + reactions.vigaSecundaria;
    if (totalReactionKGF > 5000) {
        analysisText += "Atenção: As reações de apoio das vigas são significativas. No projeto detalhado, será crucial verificar a alma do pilar quanto ao esmagamento e à flambagem local, podendo ser necessário o uso de enrijecedores para uma transferência segura dos esforços.\n\n";
    } else {
        analysisText += "As reações de apoio são moderadas, sugerindo que uma conexão padrão viga-pilar provavelmente será suficiente, mas a verificação formal ainda é necessária no projeto executivo.\n\n";
    }
    analysisText += `Resumo: O sistema pré-dimensionado aparenta ser coerente. As cargas foram transferidas adequadamente e o pilar ${profile.nome} foi dimensionado com uma margem de segurança adequada. Este resultado serve como uma excelente base para o projeto executivo final.`;
    return { analysis: analysisText };
}

export function PilarCalculator() {
    const { onAddToBudget, supportReactions, onPillarLoadCalculated, pilar, updatePilar } = useCalculator();
    const { height, axialLoad, steelType, quantity, pricePerKg, result, analysis, safetyFactor, additionalHeight } = pilar;
    
    const [isAnalyzing, setIsAnalyzing] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const { toast } = useToast();
    
    React.useEffect(() => {
        const totalReaction = supportReactions.vigaPrincipal + supportReactions.vigaSecundaria;
        if (totalReaction > 0 && totalReaction.toFixed(0) !== axialLoad) {
            updatePilar({ axialLoad: totalReaction.toFixed(0) });
        }
    }, [supportReactions.vigaPrincipal, supportReactions.vigaSecundaria, axialLoad]);

    React.useEffect(() => {
        const load = parseFloat(axialLoad.replace(',', '.'));
        onPillarLoadCalculated(!isNaN(load) && load > 0 ? load : 0);
    }, [axialLoad, onPillarLoadCalculated]);

    const handleInputChange = (field: keyof PilarInputs, value: string) => {
        const sanitizedValue = value.replace(/[^0-9,.]/g, '').replace('.', ',');
        if (/^\d*\,?\d*$/.test(sanitizedValue)) {
            updatePilar({ [field]: sanitizedValue });
        }
    };
    
    const handleCalculate = () => {
        const H_m = parseFloat(height.replace(",", "."));
        const P_kgf = parseFloat(axialLoad.replace(",", "."));
        const sf = parseFloat(safetyFactor.replace(",", ".")) || 1.4;
        setError(null);
        updatePilar({ result: null, analysis: null });

        if (isNaN(H_m) || isNaN(P_kgf) || H_m <= 0 || P_kgf <= 0) {
            setError("Por favor, insira valores válidos para altura e carga axial.");
            return;
        }

        const selectedSteel = tiposAco.find(s => s.nome === steelType);
        if (!selectedSteel) {
            setError("Tipo de aço inválido selecionado.");
            return;
        }

        const P_N = (P_kgf * 9.807) * sf; // Majorando a carga
        const L_cm = H_m * 100;
        const K = 1.0;
        const E_MPa = E_ACO_MPA;
        const fy_MPa = selectedSteel.fy;

        const suitableProfiles = perfisData.map(profile => {
            const area_cm2 = profile.area;
            const area_mm2 = area_cm2 * 100;
            const slenderness = (K * L_cm) / profile.ry;
            const slendernessLimit = 4.71 * Math.sqrt(E_MPa / fy_MPa);

            let fcr_MPa: number;
            if (slenderness <= slendernessLimit) {
                const fe_MPa = (Math.pow(Math.PI, 2) * E_MPa) / Math.pow(slenderness, 2);
                fcr_MPa = Math.pow(0.658, fy_MPa / fe_MPa) * fy_MPa;
            } else {
                fcr_MPa = (0.877 * Math.pow(Math.PI, 2) * E_MPa) / Math.pow(slenderness, 2);
            }

            const FATOR_SEGURANCA_RESISTENCIA = 1.67; // Este é o fator de resistência, não o de carga
            const allowableStress_MPa = fcr_MPa / FATOR_SEGURANCA_RESISTENCIA;
            const maxLoad_N = allowableStress_MPa * area_mm2;
            const actingStress_MPa = P_N / area_mm2;

            if (maxLoad_N >= P_N) {
                return { profile, allowableStress: allowableStress_MPa, actingStress: actingStress_MPa };
            }
            return null;
        }).filter(p => p !== null) as { profile: Perfil, allowableStress: number, actingStress: number }[];
        
        if (suitableProfiles.length === 0) {
            setError("Nenhum perfil W atende aos requisitos. Tente uma carga menor ou verifique os parâmetros.");
            return;
        }

        const bestProfileData = suitableProfiles.reduce((lightest, current) => current.profile.peso < lightest.profile.peso ? current : lightest);

        updatePilar({ result: bestProfileData });
        toast({ title: "Cálculo do Pilar Concluído", description: `O perfil recomendado é ${bestProfileData.profile.nome}.` });
    };

    const handleAnalyze = () => {
        if (!result) {
            toast({ variant: "destructive", title: "Cálculo necessário", description: "Calcule o perfil antes de analisar."});
            return;
        }
        setIsAnalyzing(true);
        updatePilar({ analysis: null });
        const sf = parseFloat(safetyFactor.replace(',', '.')) || 1.4;
        setTimeout(() => {
            const analysisResult = getLocalAnalysis(result, supportReactions, sf);
            updatePilar({ analysis: analysisResult });
            setIsAnalyzing(false);
        }, 500);
    };

    const handleAddToBudget = () => {
        if (!result) {
            toast({ variant: "destructive", title: "Nenhum Perfil Calculado" });
            return;
        }
        const H = parseFloat(height.replace(",", "."));
        const addH = parseFloat(additionalHeight?.replace(",", ".")) || 0;
        const totalHeight = H + addH;

        const qty = parseInt(quantity);
        const price = parseFloat(pricePerKg.replace(",", "."));

        if (isNaN(totalHeight) || isNaN(qty) || isNaN(price) || totalHeight <= 0 || qty <= 0 || price <= 0) {
            toast({ variant: "destructive", title: "Valores Inválidos" });
            return;
        }

        const weightPerUnit = result.profile.peso * totalHeight;
        const totalWeight = weightPerUnit * qty;
        const costPerUnit = weightPerUnit * price;
        const totalCost = totalWeight * price;

        const newItem: BudgetItem = {
            id: `${result.profile.nome}-pilar-${Date.now()}`,
            perfil: result.profile, height: totalHeight, quantity: qty,
            weightPerUnit, totalWeight, costPerUnit, totalCost, type: 'Pilar',
        };

        onAddToBudget(newItem);
        toast({ title: "Pilar Adicionado!", description: `${qty}x pilar(es) ${result.profile.nome} com ${totalHeight}m adicionado(s).` });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Calculadora de Pilar (Coluna)</CardTitle>
                <CardDescription>Dimensione um perfil W para um pilar submetido à carga axial, com verificação de flambagem.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="pilar-height">Pé-Direito (Altura de Flambagem) (m)</Label>
                        <Input id="pilar-height" type="text" inputMode="decimal" value={height} onChange={e => handleInputChange('height', e.target.value)} placeholder="Ex: 3,0" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="pilar-additional-height">Comp. Adicional Acima (m)</Label>
                        <Input id="pilar-additional-height" type="text" inputMode="decimal" value={additionalHeight} onChange={e => handleInputChange('additionalHeight', e.target.value)} placeholder="Ex: 3,0" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="pilar-load">Carga Axial (kgf)</Label>
                        <Input id="pilar-load" type="text" inputMode="decimal" value={axialLoad} onChange={e => handleInputChange('axialLoad', e.target.value)} placeholder="Ex: 5000" readOnly className="bg-muted/70"/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="pilar-steel-type">Tipo de Aço</Label>
                        <Select value={steelType} onValueChange={value => updatePilar({ steelType: value })}>
                            <SelectTrigger id="pilar-steel-type"><SelectValue placeholder="Selecione o aço" /></SelectTrigger>
                            <SelectContent>{tiposAco.map(aco => <SelectItem key={aco.nome} value={aco.nome}>{aco.nome}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="safety-factor">Fator de Segurança</Label>
                        <Input id="safety-factor" type="text" inputMode="decimal" value={safetyFactor} onChange={e => handleInputChange('safetyFactor', e.target.value)} placeholder="Ex: 1,4"/>
                    </div>
                </div>
                <Button type="button" onClick={handleCalculate} className="w-full md:w-auto">Calcular Pilar</Button>
                {error && <Alert variant="destructive"><AlertTitle>Erro</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
                {result && (
                     <Card className="mt-4 bg-primary/5 border-primary/20">
                        <CardHeader>
                            <AlertTitle className="text-primary font-bold flex items-center gap-2"><CheckCircle className="h-5 w-5"/> Perfil Recomendado para Pilar</AlertTitle>
                            <AlertDescription className="space-y-2 pt-2">
                                <p>O perfil mais leve que atende à carga axial de <span className="font-semibold">{axialLoad} kgf</span> e pé-direito de <span className="font-semibold">{height}m</span> é:</p>
                                <div className="text-2xl font-bold text-center py-2 text-primary">{result.profile.nome}</div>
                                <div className="grid grid-cols-2 gap-2 text-center text-sm">
                                    <div><p className="text-muted-foreground">Tensão Atuante (Majorada)</p><p className="font-semibold">{result.actingStress.toFixed(1)} MPa</p></div>
                                    <div><p className="text-muted-foreground">Tensão Admissível</p><p className="font-semibold">{result.allowableStress.toFixed(1)} MPa</p></div>
                                </div>
                            </AlertDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Button type="button" onClick={handleAnalyze} className="w-full" disabled={isAnalyzing}>
                                {isAnalyzing ? <><Loader className="animate-spin mr-2"/> Analisando...</> : <><Sparkles className="mr-2"/> Analisar Resultado</>}
                            </Button>
                            {isAnalyzing && <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground p-4"><Loader className="animate-spin h-4 w-4" />Gerando análise local...</div>}
                            {analysis && (
                                <Alert variant="default">
                                    <Sparkles className="h-4 w-4" /><AlertTitle className="font-semibold">Análise Lógica</AlertTitle>
                                    <AlertDescription className="whitespace-pre-line">{analysis.analysis}</AlertDescription>
                                </Alert>
                            )}
                            <div className="grid grid-cols-2 gap-4 border-t pt-4">
                                <div className="space-y-2">
                                    <Label htmlFor="pilar-quantity">Quantidade</Label>
                                    <Input id="pilar-quantity" type="text" inputMode="numeric" value={quantity} onChange={e => handleInputChange('quantity', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="pilar-pricePerKg">Preço Aço (R$/kg)</Label>
                                    <Input id="pilar-pricePerKg" type="text" inputMode="decimal" value={pricePerKg} onChange={e => handleInputChange('pricePerKg', e.target.value)} />
                                </div>
                            </div>
                            <Button onClick={handleAddToBudget} className="w-full gap-2"><PlusCircle/> Adicionar ao Orçamento</Button>
                        </CardContent>
                    </Card>
                )}
            </CardContent>
        </Card>
    );
}
