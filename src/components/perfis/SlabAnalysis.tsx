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

    let analysisText = `Análise da Geometria da Laje:\n\n`;
    
    // Análise do Vão X
    analysisText += `1. Eixo X (Vigas Principais):\n`;
    analysisText += `   - Vão Livre Principal: ${vaoX.toFixed(2)}m.\n`;
    if (vaoX > 12) {
         analysisText += `   - Insight: Vão grande. A deformação (flexa) será um fator crítico no dimensionamento da viga principal. Perfis mais altos (maior inércia) serão necessários.\n`;
    } else if (vaoX > 6) {
         analysisText += `   - Insight: Vão médio. Um bom equilíbrio entre resistência e deformação será necessário.\n`;
    } else {
         analysisText += `   - Insight: Vão pequeno. O dimensionamento provavelmente será governado pela resistência (momento fletor) em vez da deformação.\n`;
    }
    const balancoXTotal = balancoX_E + balancoX_D;
    if (balancoXTotal > 0) {
        const proporcaoX_E = (balancoX_E / vaoX) * 100;
        const proporcaoX_D = (balancoX_D / vaoX) * 100;
        if(proporcaoX_E > 35 || proporcaoX_D > 35) {
             analysisText += `   - Alerta de Balanço: Um dos balanços em X excede 35% do vão livre. Isso pode gerar momentos fletores negativos elevados sobre os apoios e exigir uma viga principal mais robusta.\n`;
        } else if (proporcaoX_E > 15 || proporcaoX_D > 15) {
             analysisText += `   - Otimização: Os balanços em X são moderados (entre 15-35% do vão), o que é eficiente para otimizar os momentos fletores da viga principal (efeito de viga contínua).\n`;
        }
    }
    analysisText += `\n`;

    // Análise do Vão Y
    analysisText += `2. Eixo Y (Vigas Secundárias):\n`;
    analysisText += `   - Vão Livre Principal: ${vaoY.toFixed(2)}m.\n`;
     if (vaoY > 8) {
         analysisText += `   - Insight: Vão relativamente grande para vigas secundárias. A eficiência do sistema de laje (steel deck) será importante.\n`;
    }
    const balancoYTotal = balancoY_F + balancoY_A;
     if (balancoYTotal > 0) {
        const proporcaoY_F = (balancoY_F / vaoY) * 100;
        const proporcaoY_A = (balancoY_A / vaoY) * 100;
        if(proporcaoY_F > 35 || proporcaoY_A > 35) {
             analysisText += `   - Alerta de Balanço: Um dos balanços em Y excede 35% do vão livre, o que é incomum para vigas secundárias e pode exigir uma análise mais detalhada.\n`;
        }
    }
    analysisText += `\n`;

    analysisText += "Conclusão: A geometria é coerente. As dimensões de vãos e balanços foram calculadas e enviadas para as próximas abas.";
    
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
