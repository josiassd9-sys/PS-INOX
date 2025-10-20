"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCalculator, SlabAnalysisInputs } from "@/app/perfis/calculadora/CalculatorContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle } from "lucide-react";

export function SlabAnalysis() {
    const { slabAnalysis, updateSlabAnalysis } = useCalculator();
    const { spanX, spanY, cantileverLeft, cantileverRight, cantileverFront, cantileverBack, result } = slabAnalysis;

    const handleInputChange = (field: keyof SlabAnalysisInputs, value: string) => {
        const sanitizedValue = value.replace(/[^0-9,.]/g, '').replace('.', ',');
        if (/^\d*[,.]?\d*$/.test(sanitizedValue)) {
            updateSlabAnalysis({ [field]: sanitizedValue });
        }
    };

    const handleAnalyze = React.useCallback(() => {
        const totalX = parseFloat(spanX.replace(',', '.')) || 0;
        const totalY = parseFloat(spanY.replace(',', '.')) || 0;
        const balancoX_E = parseFloat(cantileverLeft.replace(',', '.')) || 0;
        const balancoX_D = parseFloat(cantileverRight.replace(',', '.')) || 0;
        const balancoY_F = parseFloat(cantileverFront.replace(',', '.')) || 0;
        const balancoY_A = parseFloat(cantileverBack.replace(',', '.')) || 0;

        const vaoX = totalX - balancoX_E - balancoX_D;
        const vaoY = totalY - balancoY_F - balancoY_A;

        let text = `Geometria definida com sucesso. As dimensões totais são ${totalX}m (X) por ${totalY}m (Y).\n\n`;
        text += `• Eixo X: Comprimento total de ${totalX}m, com balanços de ${balancoX_E}m e ${balancoX_D}m, resulta em um **vão livre de ${vaoX.toFixed(2)}m** para a Viga Principal.\n`;
        text += `• Eixo Y: Comprimento total de ${totalY}m, com balanços de ${balancoY_F}m e ${balancoY_A}m, resulta em um **vão livre de ${vaoY.toFixed(2)}m** para a Viga Secundária.\n\n`;
        text += `Estes valores foram enviados automaticamente para as próximas abas para agilizar o seu projeto.`;
        updateSlabAnalysis({ result: { analysis: text } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [spanX, spanY, cantileverLeft, cantileverRight, cantileverFront, cantileverBack]);
    
    React.useEffect(() => {
        handleAnalyze();
    }, [handleAnalyze]);


    return (
        <Card>
            <CardHeader>
                <CardTitle>1. Geometria da Laje</CardTitle>
                <CardDescription>Defina as dimensões totais da sua laje. O sistema calculará os vãos livres entre os apoios.</CardDescription>
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
