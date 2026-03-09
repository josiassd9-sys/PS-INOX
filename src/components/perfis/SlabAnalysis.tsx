"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";

const SlabAnalysis = () => {
    const [vaoX, setVaoX] = useState(10);
    const [vaoY, setVaoY] = useState(8);
    const [balancoX_E, setBalancoX_E] = useState(1);
    const [balancoX_D, setBalancoX_D] = useState(1);
    const [balancoY_S, setBalancoY_S] = useState(1);
    const [balancoY_I, setBalancoY_I] = useState(1);

    const [analysis, setAnalysis] = useState("");

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

        setAnalysis(analysisText);

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
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>Análise Estrutural da Geometria da Laje</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Coluna de Inputs */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Parâmetros da Laje (em metros)</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <Label htmlFor="vaoX">Vão em X (Principal)</Label>
                            <Input id="vaoX" type="number" value={vaoX} onChange={(e) => setVaoX(Number(e.target.value))} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Label htmlFor="vaoY">Vão em Y (Secundário)</Label>
                            <Input id="vaoY" type="number" value={vaoY} onChange={(e) => setVaoY(Number(e.target.value))} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Label htmlFor="balancoX_E">Balanço em X (Esquerda)</Label>
                            <Input id="balancoX_E" type="number" value={balancoX_E} onChange={(e) => setBalancoX_E(Number(e.target.value))} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Label htmlFor="balancoX_D">Balanço em X (Direita)</Label>
                            <Input id="balancoX_D" type="number" value={balancoX_D} onChange={(e) => setBalancoX_D(Number(e.target.value))} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Label htmlFor="balancoY_S">Balanço em Y (Superior)</Label>
                            <Input id="balancoY_S" type="number" value={balancoY_S} onChange={(e) => setBalancoY_S(Number(e.target.value))} />
                        </div>
                         <div className="grid grid-cols-2 gap-4">
                            <Label htmlFor="balancoY_I">Balanço em Y (Inferior)</Label>
                            <Input id="balancoY_I" type="number" value={balancoY_I} onChange={(e) => setBalancoY_I(Number(e.target.value))} />
                        </div>
                        <Button onClick={handleAnalyze} className="w-full">Analisar Geometria</Button>
                    </div>

                    {/* Coluna de Análise */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Resultado da Análise</h3>
                        <ScrollArea className="h-72 w-full rounded-md border p-4">
                            <pre className="whitespace-pre-wrap text-sm">{analysis || "A análise aparecerá aqui."}</pre>
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
