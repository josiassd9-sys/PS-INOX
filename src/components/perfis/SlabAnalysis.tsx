"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCalculator, SlabAnalysisInputs } from "@/app/perfis/calculadora/CalculatorContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, Sparkles, Loader } from "lucide-react";

function getLocalAnalysis(totalX: number, totalY: number, balancoX_E: number, balancoX_D: number, balancoY_F: number, balancoY_A: number) {
    const vaoX = totalX - balancoX_E - balancoX_D;
    const vaoY = totalY - balancoY_F - balancoY_A;

    if (vaoX <= 0 || vaoY <= 0) {
        return { analysis: "Erro: Os balanços não podem ser maiores que o comprimento total. Verifique as dimensões." };
    }

    let analysisText = `Geometria definida com sucesso. As dimensões totais da laje são ${totalX}m (direção X) por ${totalY}m (direção Y).\n\n`;
    analysisText += `• Eixo X (Viga Principal): Comprimento total de ${totalX}m, com apoios posicionados para criar um vão livre de ${vaoX.toFixed(2)}m.\n`;
    analysisText += `• Eixo Y (Viga Secundária): Comprimento total de ${totalY}m, com apoios posicionados para criar um vão livre de ${vaoY.toFixed(2)}m.\n\n`;
    analysisText += "Estes vãos e balanços foram enviados para as calculadoras de viga correspondentes.";
    
    return { analysis: analysisText };
}

export function SlabAnalysis() {
    const { slabAnalysis, updateSlabAnalysis } = useCalculator();
    const { spanX, spanY, cantileverLeft, cantileverRight, cantileverFront, cantileverBack, result } = slabAnalysis;
    const [isAnalyzing, setIsAnalyzing] = React.useState(false);

    const handleInputChange = (field: keyof SlabAnalysisInputs, value: string) => {
        const sanitizedValue = value.replace(/[^0-9,.]/g, '').replace('.', ',');
        if (/^\d*[,.]?\d*$/.test(sanitizedValue)) {
            updateSlabAnalysis({ [field]: sanitizedValue });
        }
    };

    const handleAnalyze = async () => {
        const totalX = parseFloat(spanX.replace(',', '.')) || 0;
        const totalY = parseFloat(spanY.replace(',', '.')) || 0;
        const balancoX_E = parseFloat(cantileverLeft.replace(',', '.')) || 0;
        const balancoX_D = parseFloat(cantileverRight.replace(',', '.')) || 0;
        const balancoY_F = parseFloat(cantileverFront.replace(',', '.')) || 0;
        const balancoY_A = parseFloat(cantileverBack.replace(',', '.')) || 0;

        if (totalX <= 0 || totalY <= 0) return;

        setIsAnalyzing(true);
        updateSlabAnalysis({ result: null });
        
        // Simulating a short delay for local analysis
        setTimeout(() => {
            const analysisResult = getLocalAnalysis(totalX, totalY, balancoX_E, balancoX_D, balancoY_F, balancoY_A);
            updateSlabAnalysis({ result: { analysis: analysisResult.analysis } });
            setIsAnalyzing(false);
        }, 300);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>1. Geometria da Laje</CardTitle>
                <CardDescription>Defina as dimensões totais da sua laje. O sistema calculará os vãos livres e analisará a geometria.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <h3 className="font-semibold mb-2">Dimensões Totais</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="span-x">Comprimento Total em X (m)</Label>
                            <Input id="span-x" type="text" inputMode="decimal" value={spanX} onChange={e => handleInputChange('spanX', e.target.value)} placeholder="Ex: 10,0" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="span-y">Comprimento Total em Y (m)</Label>
                            <Input id="span-y" type="text" inputMode="decimal" value={spanY} onChange={e => handleInputChange('spanY', e.target.value)} placeholder="Ex: 5,5" />
                        </div>
                    </div>
                </div>
                 <div>
                    <h3 className="font-semibold mb-2">Balanços (definem a posição dos apoios)</h3>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="cantilever-left">Balanço em X (Esquerda)</Label>
                            <Input id="cantilever-left" type="text" inputMode="decimal" value={cantileverLeft} onChange={e => handleInputChange('cantileverLeft', e.target.value)} placeholder="m" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cantilever-right">Balanço em X (Direita)</Label>
                            <Input id="cantilever-right" type="text" inputMode="decimal" value={cantileverRight} onChange={e => handleInputChange('cantileverRight', e.target.value)} placeholder="m" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cantilever-front">Balanço em Y (Frente)</Label>
                            <Input id="cantilever-front" type="text" inputMode="decimal" value={cantileverFront} onChange={e => handleInputChange('cantileverFront', e.target.value)} placeholder="m" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cantilever-back">Balanço em Y (Atrás)</Label>
                            <Input id="cantilever-back" type="text" inputMode="decimal" value={cantileverBack} onChange={e => handleInputChange('cantileverBack', e.target.value)} placeholder="m" />
                        </div>
                    </div>
                </div>

                <Button onClick={handleAnalyze} disabled={isAnalyzing}>
                    {isAnalyzing ? <><Loader className="animate-spin mr-2"/> Analisando...</> : <><Sparkles className="mr-2"/> Analisar Geometria</>}
                </Button>

                {result && (
                    <Alert variant="default" className="mt-4 bg-primary/5 border-primary/20">
                       <CheckCircle className="h-4 w-4 text-primary" />
                      <AlertTitle className="text-primary font-bold">Análise da Geometria</AlertTitle>
                      <AlertDescription className="space-y-2 mt-2 whitespace-pre-line">
                          {result.analysis}
                      </AlertDescription>
                  </Alert>
                )}
            </CardContent>
        </Card>
    );
}
