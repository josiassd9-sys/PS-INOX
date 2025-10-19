
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Loader, RefreshCw, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { analyzeSapata, AnalyzeSapataInput, AnalyzeSapataOutput } from "@/ai/flows/sapata-analysis-flow";

interface SapataCalculatorProps {
    pillarLoad: number;
}

const soilTypes = [
    { name: "Rocha Sã", pressure: 10.0 }, // kgf/cm²
    { name: "Argila Dura", pressure: 4.0 },
    { name: "Argila Rija", pressure: 2.0 },
    { name: "Areia Compacta", pressure: 2.5 },
    { name: "Areia Fofa", pressure: 1.0 },
];

export function SapataCalculator({ pillarLoad }: SapataCalculatorProps) {
    const [load, setLoad] = React.useState("0");
    const [selectedSoil, setSelectedSoil] = React.useState(soilTypes[2].name); // Argila Rija
    
    const [isAnalyzing, setIsAnalyzing] = React.useState(false);
    const [analysisResult, setAnalysisResult] = React.useState<AnalyzeSapataOutput | null>(null);
    const [error, setError] = React.useState<string | null>(null);
    const { toast } = useToast();

    const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
        const sanitizedValue = value.replace(/[^0-9,.]/g, '').replace('.', ',');
        if (/^\d*\,?\d*$/.test(sanitizedValue)) {
            setter(sanitizedValue);
        }
    };

    const handleApplyPillarLoad = () => {
        if (pillarLoad > 0) {
            setLoad(pillarLoad.toFixed(0));
            toast({
                title: "Carga do Pilar Aplicada!",
                description: `A carga de ${pillarLoad.toFixed(0)} kgf foi inserida no campo.`
            });
        }
    };
    
    const isPillarLoadSynced = pillarLoad > 0 && pillarLoad.toFixed(0) === load;

    const handleAnalyze = async () => {
        const totalLoadKgf = parseFloat(load.replace(',', '.'));
        const soilInfo = soilTypes.find(s => s.name === selectedSoil);

        if (!soilInfo || isNaN(totalLoadKgf) || totalLoadKgf <= 0) {
            setError("Por favor, insira uma carga válida e selecione um tipo de solo.");
            return;
        }

        setError(null);
        setAnalysisResult(null);
        setIsAnalyzing(true);
        try {
            const input: AnalyzeSapataInput = {
                totalLoadKgf: totalLoadKgf,
                soilType: soilInfo.name,
                allowableSoilPressure: soilInfo.pressure
            };
            const result = await analyzeSapata(input);
            setAnalysisResult(result);
        } catch (e) {
            console.error("AI sapata analysis failed:", e);
            setError("A análise da IA não pôde ser concluída. Tente novamente.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Assistente de Fundação (Sapata)</CardTitle>
                <CardDescription>
                    Obtenha uma recomendação de pré-dimensionamento para a sapata de concreto do pilar, com base na carga e no tipo de solo.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                         <div className="flex items-center justify-between">
                            <Label htmlFor="pillar-load">Carga Total do Pilar (kgf)</Label>
                            {pillarLoad > 0 && (
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-primary" onClick={handleApplyPillarLoad} title="Aplicar carga calculada na aba de pilar">
                                <RefreshCw className={`h-4 w-4 ${isPillarLoadSynced ? 'text-green-500' : 'animate-pulse'}`}/>
                            </Button>
                            )}
                        </div>
                        <Input id="pillar-load" type="text" inputMode="decimal" value={load} onChange={e => handleInputChange(setLoad, e.target.value)} placeholder="Ex: 12000" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="soil-type">Tipo de Solo (Tensão Admissível)</Label>
                        <Select value={selectedSoil} onValueChange={setSelectedSoil}>
                            <SelectTrigger id="soil-type">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {soilTypes.map(soil => (
                                    <SelectItem key={soil.name} value={soil.name}>{soil.name} ({soil.pressure} kgf/cm²)</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Button type="button" onClick={handleAnalyze} className="w-full md:w-auto" disabled={isAnalyzing}>
                    {isAnalyzing ? <><Loader className="animate-spin mr-2"/> Analisando...</> : <><Sparkles className="mr-2"/> Analisar Fundação</>}
                </Button>

                {error && <Alert variant="destructive"><AlertTitle>Erro</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}

                 {isAnalyzing && (
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground p-4">
                        <Loader className="animate-spin h-4 w-4" />
                        IA está dimensionando a fundação...
                    </div>
                )}

                {analysisResult && (
                    <Card className="mt-4 bg-primary/5 border-primary/20">
                        <CardHeader>
                            <AlertTitle className="text-primary font-bold flex items-center gap-2"><CheckCircle className="h-5 w-5"/> Análise da Fundação</AlertTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-2">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center text-sm p-2 rounded-lg bg-background border">
                                <div>
                                    <p className="text-muted-foreground">Área Necessária</p>
                                    <p className="font-bold text-lg">{analysisResult.footingDimensions.requiredAreaM2.toFixed(2)} m²</p>
                                </div>
                                 <div>
                                    <p className="text-muted-foreground">Sapata Quadrada</p>
                                    <p className="font-bold text-lg">{analysisResult.footingDimensions.sideLengthM.toFixed(2)} m</p>
                                </div>
                                 <div>
                                    <p className="text-muted-foreground">Altura Recomendada</p>
                                    <p className="font-bold text-lg">{analysisResult.footingDimensions.recommendedHeightCm.toFixed(0)} cm</p>
                                </div>
                            </div>
                            <Alert variant="default" className="bg-background">
                                <Sparkles className="h-4 w-4" />
                                <AlertTitle className="font-semibold">Análise da IA</AlertTitle>
                                <AlertDescription className="whitespace-pre-wrap">
                                    {analysisResult.analysis}
                                </AlertDescription>
                            </Alert>
                        </CardContent>
                    </Card>
                )}

            </CardContent>
        </Card>
    );
}
