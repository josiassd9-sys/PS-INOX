
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Loader, CheckCircle, Calculator } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCalculator, SapataInputs } from "@/app/perfis/calculadora/CalculatorContext";

interface SapataAnalysisResult {
  analysis: string;
  footingDimensions: {
    requiredAreaM2: number;
    sideLengthM: number;
    recommendedHeightCm: number;
  };
}

const soilTypes = [
    { name: "Rocha Sã", pressure: 10.0 }, // kgf/cm²
    { name: "Argila Dura", pressure: 4.0 },
    { name: "Argila Rija", pressure: 2.0 },
    { name: "Areia Compacta", pressure: 2.5 },
    { name: "Areia Fofa", pressure: 1.0 },
];

function getLocalAnalysis(totalLoadKgf: number, soilName: string, soilPressure: number): SapataAnalysisResult {
    const soilPressureKgfM2 = soilPressure * 10000;
    const requiredAreaM2 = totalLoadKgf / soilPressureKgfM2;
    const sideLengthM = Math.sqrt(requiredAreaM2);
    const recommendedHeightCm = Math.max(30, Math.ceil((sideLengthM * 100) / 3 / 5) * 5);

    let analysisText = `Para suportar a carga de ${totalLoadKgf} kgf sobre um solo do tipo "${soilName}" (tensão admissível de ${soilPressure} kgf/cm²), a sapata precisa de uma área mínima de ${requiredAreaM2.toFixed(2)} m².\n\n`;
    analysisText += `Isso resulta em uma sapata quadrada pré-dimensionada de ${sideLengthM.toFixed(2)}m x ${sideLengthM.toFixed(2)}m, com uma altura recomendada de ${recommendedHeightCm.toFixed(0)}cm. Esta altura é crucial para resistir aos esforços de punção e flexão. Recomenda-se um "colarinho" de concreto sobre a sapata para embutir a base do pilar metálico.\n\n`;
    analysisText += `Lembre-se: este é um pré-dimensionamento. O projeto executivo final, incluindo o detalhamento das armaduras de aço, deve ser realizado por um engenheiro calculista, em conformidade com as normas NBR 6118 e NBR 6122.`;

    return {
        analysis: analysisText,
        footingDimensions: { requiredAreaM2, sideLengthM, recommendedHeightCm }
    };
}

export function SapataCalculator() {
    const { pilar, sapata, updateSapata } = useCalculator();
    const { load, selectedSoil, concretePrice, steelPrice, steelRatio, result } = sapata;
    
    const [isAnalyzing, setIsAnalyzing] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

     React.useEffect(() => {
        if (pilar.axialLoad) {
            const pilarLoad = parseFloat(pilar.axialLoad.replace(',', '.'));
            if (!isNaN(pilarLoad) && pilarLoad > 0) {
                 updateSapata({ load: pilarLoad.toFixed(0) });
            }
        }
    }, [pilar.axialLoad, updateSapata]);


    const handleInputChange = (field: keyof SapataInputs, value: string) => {
        const sanitizedValue = value.replace(/[^0-9,.]/g, '').replace('.', ',');
        if (/^\d*\,?\d*$/.test(sanitizedValue)) {
            updateSapata({ [field]: sanitizedValue });
        }
    };

    const handleAnalyze = () => {
        const totalLoadKgf = parseFloat(load.replace(',', '.'));
        const soilInfo = soilTypes.find(s => s.name === selectedSoil);

        if (!soilInfo || isNaN(totalLoadKgf) || totalLoadKgf <= 0) {
            setError("Por favor, insira uma carga válida e selecione um tipo de solo.");
            return;
        }

        setError(null);
        updateSapata({ result: null });
        setIsAnalyzing(true);
        
        setTimeout(() => {
            const analysisResult = getLocalAnalysis(totalLoadKgf, soilInfo.name, soilInfo.pressure);
            updateSapata({ result: analysisResult });
            setIsAnalyzing(false);
        }, 500);
    };
    
    const { volumeM3, concreteCost, steelCost, totalCost } = React.useMemo(() => {
        if (!result) return { volumeM3: 0, concreteCost: 0, steelCost: 0, totalCost: 0 };
        
        const cPrice = parseFloat(concretePrice.replace(",", ".")) || 0;
        const sPrice = parseFloat(steelPrice.replace(",", ".")) || 0;
        const sRatio = parseFloat(steelRatio.replace(",", ".")) || 0;

        const vol = result.footingDimensions.sideLengthM * result.footingDimensions.sideLengthM * (result.footingDimensions.recommendedHeightCm / 100);
        const totalSteelKg = vol * sRatio;

        const cCost = vol * cPrice;
        const sCost = totalSteelKg * sPrice;
        
        return { volumeM3: vol, concreteCost: cCost, steelCost: sCost, totalCost: cCost + sCost };

    }, [result, concretePrice, steelPrice, steelRatio]);

    const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Assistente de Fundação (Sapata)</CardTitle>
                <CardDescription>Obtenha uma recomendação de pré-dimensionamento para a sapata de concreto do pilar.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="pillar-load">Carga Total do Pilar (kgf)</Label>
                        <Input id="pillar-load" type="text" inputMode="decimal" value={load} onChange={e => handleInputChange('load', e.target.value)} placeholder="Ex: 12000" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="soil-type">Tipo de Solo (Tensão Admissível)</Label>
                        <Select value={selectedSoil} onValueChange={value => updateSapata({ selectedSoil: value })}>
                            <SelectTrigger id="soil-type"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {soilTypes.map(soil => <SelectItem key={soil.name} value={soil.name}>{soil.name} ({soil.pressure} kgf/cm²)</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Button type="button" onClick={handleAnalyze} className="w-full md:w-auto" disabled={isAnalyzing}>
                    {isAnalyzing ? <><Loader className="animate-spin mr-2"/> Analisando...</> : <><Sparkles className="mr-2"/> Analisar Fundação</>}
                </Button>

                {error && <Alert variant="destructive"><AlertTitle>Erro</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
                {isAnalyzing && <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground p-4"><Loader className="animate-spin h-4 w-4" />Dimensionando...</div>}
                {result && (
                    <Card className="mt-4 bg-primary/5 border-primary/20">
                        <CardHeader>
                            <AlertTitle className="text-primary font-bold flex items-center gap-2"><CheckCircle className="h-5 w-5"/> Análise da Fundação</AlertTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-2">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center text-sm p-2 rounded-lg bg-background border">
                                <div><p className="text-muted-foreground">Área Necessária</p><p className="font-bold text-lg">{result.footingDimensions.requiredAreaM2.toFixed(2)} m²</p></div>
                                <div><p className="text-muted-foreground">Sapata Quadrada</p><p className="font-bold text-lg">{result.footingDimensions.sideLengthM.toFixed(2)} m</p></div>
                                <div><p className="text-muted-foreground">Altura Recomendada</p><p className="font-bold text-lg">{result.footingDimensions.recommendedHeightCm.toFixed(0)} cm</p></div>
                            </div>
                            <Alert variant="default" className="bg-background">
                                <Sparkles className="h-4 w-4" /><AlertTitle className="font-semibold">Análise Lógica</AlertTitle>
                                <AlertDescription className="whitespace-pre-line">{result.analysis}</AlertDescription>
                            </Alert>
                            <Card>
                                <CardHeader className="p-3"><CardTitle className="text-lg flex items-center gap-2"><Calculator className="h-5 w-5"/> Estimativa de Custo</CardTitle></CardHeader>
                                <CardContent className="space-y-4 p-3 pt-0">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                        <div className="space-y-1"><Label htmlFor="concrete-price" className="text-xs">Preço Concreto (R$/m³)</Label><Input id="concrete-price" type="text" inputMode="decimal" value={concretePrice} onChange={e => handleInputChange('concretePrice', e.target.value)} /></div>
                                        <div className="space-y-1"><Label htmlFor="steel-price" className="text-xs">Preço Aço (R$/kg)</Label><Input id="steel-price" type="text" inputMode="decimal" value={steelPrice} onChange={e => handleInputChange('steelPrice', e.target.value)} /></div>
                                        <div className="space-y-1"><Label htmlFor="steel-ratio" className="text-xs">Taxa de Aço (kg/m³)</Label><Input id="steel-ratio" type="text" inputMode="decimal" value={steelRatio} onChange={e => handleInputChange('steelRatio', e.target.value)} /></div>
                                    </div>
                                    <div className="space-y-2 rounded-lg border bg-background p-2">
                                        <div className="flex justify-between items-center text-sm"><span className="text-muted-foreground">Volume de Concreto:</span><span className="font-medium">{volumeM3.toFixed(3)} m³</span></div>
                                        <div className="flex justify-between items-center text-sm"><span className="text-muted-foreground">Custo Concreto:</span><span className="font-medium">{formatCurrency(concreteCost)}</span></div>
                                        <div className="flex justify-between items-center text-sm"><span className="text-muted-foreground">Custo Aço:</span><span className="font-medium">{formatCurrency(steelCost)}</span></div>
                                        <div className="flex justify-between items-center text-lg font-bold text-primary border-t pt-1 mt-1"><span>Custo Total Estimado:</span><span>{formatCurrency(totalCost)}</span></div>
                                    </div>
                                </CardContent>
                            </Card>
                        </CardContent>
                    </Card>
                )}
            </CardContent>
        </Card>
    );
}
