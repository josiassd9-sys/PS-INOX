"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import { useCalculator } from "@/app/perfis/calculadora/CalculatorContext";

export const SlabAnalysis = () => {
    const { slabAnalysis, updateSlabAnalysis } = useCalculator();
    const vaoX = Number(slabAnalysis.spanX.replace(',', '.')) || 0;
    const vaoY = Number(slabAnalysis.spanY.replace(',', '.')) || 0;
    const balancoX_E = Number(slabAnalysis.cantileverLeft.replace(',', '.')) || 0;
    const balancoX_D = Number(slabAnalysis.cantileverRight.replace(',', '.')) || 0;
    const balancoY_S = Number(slabAnalysis.cantileverFront.replace(',', '.')) || 0;
    const balancoY_I = Number(slabAnalysis.cantileverBack.replace(',', '.')) || 0;
    const analysis = slabAnalysis.result?.analysis ?? "";

    const handleInputChange = (field: 'spanX' | 'spanY' | 'cantileverLeft' | 'cantileverRight' | 'cantileverFront' | 'cantileverBack', value: string) => {
        updateSlabAnalysis({ [field]: value });
    };

    const handleAnalyze = () => {
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
                analysisText += `   - Alerta de Balanço Excessivo (Eixo X): Um ou ambos os balanços (Esquerdo: ${proporcaoX_E.toFixed(1)}%, Direito: ${proporcaoX_D.toFixed(1)}%) excedem 35% do vão principal. Isso pode gerar momentos fletores negativos elevados na viga principal, exigindo uma análise cuidadosa e, possivelmente, um aumento da seção do perfil.\n`;
            } else {
                analysisText += `   - Balanços (Eixo X): Os balanços estão dentro de uma proporção comum em relação ao vão principal.\n`;
            }
        }
        analysisText += `\n`;
        // Análise do Vão Y
        analysisText += `2. Eixo Y (Vigas Secundárias):\n`;
        analysisText += `   - Vão Livre Secundário: ${vaoY.toFixed(2)}m.\n`;
        if (vaoY > vaoX) {
            analysisText += `   - Alerta Estrutural: O vão das vigas secundárias (${vaoY.toFixed(2)}m) é maior que o das vigas principais (${vaoX.toFixed(2)}m). Isso é incomum e pode não ser a solução mais econômica. Geralmente, as vigas principais vencem o maior vão.\n`;
        }
        if (vaoY > 8) {
            analysisText += `   - Insight: Vão secundário longo. Pode ser necessário um número maior de vigas secundárias ou perfis secundários mais robustos para garantir a estabilidade e limitar a deformação da laje.\n`;
        } else {
            analysisText += `   - Insight: Vão secundário padrão. O dimensionamento das vigas secundárias deve seguir as práticas comuns.\n`;
        }
        const balancoYTotal = balancoY_S + balancoY_I;
        if (balancoYTotal > 0) {
            const proporcaoY_S = (balancoY_S / vaoY) * 100;
            const proporcaoY_I = (balancoY_I / vaoY) * 100;
            if(proporcaoY_S > 40 || proporcaoY_I > 40) {
                analysisText += `   - Alerta de Balanço Excessivo (Eixo Y): Balanços (${proporcaoY_S.toFixed(1)}% e ${proporcaoY_I.toFixed(1)}%) nas extremidades das vigas secundárias são grandes. Isso pode afetar a estabilidade e a distribuição de carga nas vigas principais.\n`;
            }
        }
        analysisText += `\n`;

        // Relação de Lados
        const relacaoLados = vaoX / vaoY;
        analysisText += `3. Relação de Lados (Vão X / Vão Y): ${relacaoLados.toFixed(2)}\n`;
        if (relacaoLados > 2) {
            analysisText += `   - Comportamento da Laje: Laje armada em uma direção. A carga será predominantemente transferida ao longo do menor vão (Eixo Y). As vigas secundárias são os elementos principais de carga.\n`;
        } else if (relacaoLados > 0.5) {
            analysisText += `   - Comportamento da Laje: Laje armada em duas direções. A carga será distribuída tanto para as vigas principais quanto para as secundárias. É uma solução eficiente.\n`;
        } else {
            analysisText += `   - Comportamento da Laje: Laje armada em uma direção (sentido X). A carga será predominantemente transferida ao longo do menor vão (Eixo X). As vigas principais são os elementos principais de carga.\n`;
        }
        analysisText += `\n`;

        // Conclusão Geral
        analysisText += `**Conclusão e Recomendações:**\n`;
        if (vaoX > 12 || vaoY > vaoX || (balancoX_E / vaoX > 0.35) || (balancoX_D / vaoX > 0.35)) {
            analysisText += `A geometria apresenta desafios significativos que exigirão uma análise estrutural detalhada. Recomenda-se atenção especial ao dimensionamento das vigas principais devido ao vão longo e/ou balanços excessivos, e reavaliação da orientação dos vãos.`;
        } else {
            analysisText += `A configuração geométrica parece razoável e segue as práticas comuns de engenharia. O pré-dimensionamento pode prosseguir com base nesta configuração, focando em um equilíbrio otimizado entre os perfis.`;
        }

        updateSlabAnalysis({ result: { analysis: analysisText } });

    };

    const handleCopy = () => {
        navigator.clipboard.writeText(analysis)
            .then(() => {
                toast({
                    title: "Análise Copiada!",
                    description: "O texto da análise foi copiado para a área de transferência.",
                });
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
                toast({
                    title: "Erro ao Copiar",
                    description: "Não foi possível copiar a análise. Verifique as permissões do navegador.",
                    variant: "destructive",
                });
            });
    };

    return (
        <Card className="w-full max-w-4xl mx-auto overflow-hidden">
            <CardHeader>
                <CardTitle>Análise Estrutural da Geometria da Laje</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-w-0">
                    {/* Coluna de Inputs */}
                    <div className="space-y-4 min-w-0">
                        <h3 className="font-semibold text-lg">Parâmetros da Laje (em metros)</h3>
                        <div className="grid grid-cols-2 gap-2 sm:gap-4 auto-rows-fr">
                            <div className="space-y-1.5 min-w-0">
                                <Label htmlFor="vaoX" className="text-xs sm:text-sm leading-tight break-words">
                                    <span className="block">Vão em X</span>
                                    <span className="block text-[11px] sm:text-xs text-muted-foreground">(principal)</span>
                                </Label>
                                <Input id="vaoX" type="number" className="w-full min-w-0 text-sm" value={slabAnalysis.spanX} onChange={(e) => handleInputChange('spanX', e.target.value)} />
                            </div>

                            <div className="space-y-1.5 min-w-0">
                                <Label htmlFor="vaoY" className="text-xs sm:text-sm leading-tight break-words">
                                    <span className="block">Vão em Y</span>
                                    <span className="block text-[11px] sm:text-xs text-muted-foreground">(secundário)</span>
                                </Label>
                                <Input id="vaoY" type="number" className="w-full min-w-0 text-sm" value={slabAnalysis.spanY} onChange={(e) => handleInputChange('spanY', e.target.value)} />
                            </div>

                            <div className="space-y-1.5 min-w-0">
                                <Label htmlFor="balancoX_E" className="text-xs sm:text-sm leading-tight break-words">
                                    <span className="block">Balanço em X</span>
                                    <span className="block text-[11px] sm:text-xs text-muted-foreground">(esquerda)</span>
                                </Label>
                                <Input id="balancoX_E" type="number" className="w-full min-w-0 text-sm" value={slabAnalysis.cantileverLeft} onChange={(e) => handleInputChange('cantileverLeft', e.target.value)} />
                            </div>

                            <div className="space-y-1.5 min-w-0">
                                <Label htmlFor="balancoX_D" className="text-xs sm:text-sm leading-tight break-words">
                                    <span className="block">Balanço em X</span>
                                    <span className="block text-[11px] sm:text-xs text-muted-foreground">(direita)</span>
                                </Label>
                                <Input id="balancoX_D" type="number" className="w-full min-w-0 text-sm" value={slabAnalysis.cantileverRight} onChange={(e) => handleInputChange('cantileverRight', e.target.value)} />
                            </div>

                            <div className="space-y-1.5 min-w-0">
                                <Label htmlFor="balancoY_S" className="text-xs sm:text-sm leading-tight break-words">
                                    <span className="block">Balanço em Y</span>
                                    <span className="block text-[11px] sm:text-xs text-muted-foreground">(superior)</span>
                                </Label>
                                <Input id="balancoY_S" type="number" className="w-full min-w-0 text-sm" value={slabAnalysis.cantileverFront} onChange={(e) => handleInputChange('cantileverFront', e.target.value)} />
                            </div>

                            <div className="space-y-1.5 min-w-0">
                                <Label htmlFor="balancoY_I" className="text-xs sm:text-sm leading-tight break-words">
                                    <span className="block">Balanço em Y</span>
                                    <span className="block text-[11px] sm:text-xs text-muted-foreground">(inferior)</span>
                                </Label>
                                <Input id="balancoY_I" type="number" className="w-full min-w-0 text-sm" value={slabAnalysis.cantileverBack} onChange={(e) => handleInputChange('cantileverBack', e.target.value)} />
                            </div>
                        </div>
                        <Button onClick={handleAnalyze} className="w-full">Analisar Geometria</Button>
                    </div>

                    {/* Coluna de Análise */}
                    <div className="space-y-4 min-w-0">
                        <h3 className="font-semibold text-lg">Resultado da Análise</h3>
                        <ScrollArea className="h-72 w-full rounded-md border p-4 overflow-x-hidden">
                            <pre className="whitespace-pre-wrap break-words text-sm">{analysis || "A análise aparecerá aqui."}</pre>
                        </ScrollArea>
                        {analysis && (
                            <Button onClick={handleCopy} variant="outline" className="w-full">
                                Copiar Análise
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default SlabAnalysis;
