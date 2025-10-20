
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

    const handleAnalyze = () => {
        const x = parseFloat(spanX.replace(',', '.'));
        const y = parseFloat(spanY.replace(',', '.'));

        let text = `Geometria definida com sucesso. O vão principal (X) é de ${x}m e o vão secundário (Y) é de ${y}m.\n\n`;
        text += `Isso significa que as vigas secundárias (IPE) vencerão o vão de ${y}m, e as vigas principais (W) vencerão o vão de ${x}m.\n\n`;
        text += `Estes valores foram enviados automaticamente para as próximas abas para agilizar o seu projeto.`;
        updateSlabAnalysis({ result: { analysis: text } });
    };
    
    React.useEffect(() => {
        handleAnalyze();
    }, [spanX, spanY, cantileverLeft, cantileverRight, cantileverFront, cantileverBack]);


    return (
        <Card>
            <CardHeader>
                <CardTitle>1. Geometria da Laje</CardTitle>
                <CardDescription>Defina as dimensões gerais da sua laje ou piso. Estes valores serão usados nas próximas etapas.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <h3 className="font-semibold mb-2">Vãos Principais</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="span-x">Vão na direção X (m)</Label>
                            <Input id="span-x" type="text" inputMode="decimal" value={spanX} onChange={e => handleInputChange('spanX', e.target.value)} placeholder="Ex: 10,0" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="span-y">Vão na direção Y (m)</Label>
                            <Input id="span-y" type="text" inputMode="decimal" value={spanY} onChange={e => handleInputChange('spanY', e.target.value)} placeholder="Ex: 5,5" />
                        </div>
                    </div>
                </div>
                 <div>
                    <h3 className="font-semibold mb-2">Balanços (Opcional)</h3>
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
