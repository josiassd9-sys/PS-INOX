"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, Info, Sparkles, Loader } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCalculator, SapataArmaduraInputs } from "@/app/perfis/calculadora/CalculatorContext";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface SapataArmaduraResult {
    requiredSteelAreaCm2: number;
    barDiameter: number;
    barSpacing: number;
    totalBars: number;
    analysis: string;
}

const concreteStrengths = ["20", "25", "30", "35", "40"];
const steelStrengths = ["50", "60"]; // CA-50, CA-60
const barDiameters = ["6.3", "8.0", "10.0", "12.5", "16.0", "20.0"];

function getLocalAnalysis(result: SapataArmaduraResult): string {
    const { requiredSteelAreaCm2, barDiameter, barSpacing, totalBars } = result;
    let analysis = `A área de aço mínima necessária para resistir aos esforços de flexão é de ${requiredSteelAreaCm2.toFixed(2)} cm²/m.\n\n`;
    analysis += `Para atender a este requisito, sugerimos uma malha de vergalhões de ${barDiameter} mm espaçados a cada ${barSpacing.toFixed(1)} cm em ambas as direções. Isso resulta em um total de ${totalBars} barras por direção.\n\n`;
    
    if (barSpacing < 7) {
        analysis += "ATENÇÃO: O espaçamento entre barras está muito pequeno (< 7cm), o que pode dificultar a vibração e a passagem do concreto entre as barras. Considere usar um diâmetro de barra maior (ex: 12.5mm) para aumentar o espaçamento.\n\n";
    } else if (barSpacing > 20) {
        analysis += "OBSERVAÇÃO: O espaçamento está relativamente grande (> 20cm). É uma solução econômica, mas a NBR 6118 recomenda espaçamentos máximos (geralmente 20cm ou 2x a altura da sapata) para garantir o controle de fissuração. Verifique se esta solução atende a todos os requisitos normativos para o seu projeto.\n\n";
    } else {
        analysis += "O espaçamento calculado está dentro dos limites práticos e normativos, representando uma boa solução inicial.\n\n"
    }

    analysis += "Esta é uma sugestão de pré-dimensionamento. O detalhamento final, incluindo comprimentos de ancoragem, dobras e verificação de punção, deve ser realizado por um engenheiro estrutural.";
    return analysis;
}

export function SapataArmaduraCalculator() {
    const { sapata, sapataArmadura, updateSapataArmadura } = useCalculator();
    const { concreteStrength, steelStrength, barDiameter, result } = sapataArmadura;
    
    const [isCalculating, setIsCalculating] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const { toast } = useToast();

    const handleInputChange = (field: keyof SapataArmaduraInputs, value: string) => {
        updateSapataArmadura({ [field]: value });
    };

    const handleCalculate = () => {
        if (!sapata.result || !sapata.load) {
            setError("Primeiro, calcule a sapata na aba anterior.");
            return;
        }

        const totalLoadKgf = parseFloat(sapata.load);
        const fck = parseFloat(concreteStrength);
        const fyk = parseFloat(steelStrength) * 10; // MPa
        const selectedBarDiameterMm = parseFloat(barDiameter);
        const { sideLengthM, recommendedHeightCm } = sapata.result.footingDimensions;

        if (isNaN(totalLoadKgf) || isNaN(fck) || isNaN(fyk) || isNaN(selectedBarDiameterMm) || sideLengthM <= 0) {
            setError("Verifique os parâmetros de entrada.");
            return;
        }
        
        setError(null);
        setIsCalculating(true);
        updateSapataArmadura({ result: null });

        setTimeout(() => {
            try {
                // Simplified calculation based on NBR 6118 principles
                const fcd = fck / 1.4;
                const fyd = fyk / 1.15;
                const pilarDim = 0.3; // Assuming a 30x30 cm column base for simplicity
                
                const cantileverSpan = (sideLengthM - pilarDim) / 2;
                const soilPressureKPa = (totalLoadKgf * 9.81) / (sideLengthM * sideLengthM * 1000); // KPa
                
                // Bending moment per meter width
                const bendingMomentKNm_m = (soilPressureKPa * sideLengthM * Math.pow(cantileverSpan, 2)) / 2;
                const M_sk = bendingMomentKNm_m * 1.4; // Factored moment

                const d = recommendedHeightCm - 5; // Effective depth in cm
                
                // Required steel area (cm²/m)
                const As_cm2_m = (M_sk * 100) / (0.9 * (d / 100) * (fyd * 1000));
                
                const minAs_cm2_m = 0.15 / 100 * 100 * recommendedHeightCm; // 0.15% of concrete area
                const requiredSteelAreaCm2 = Math.max(As_cm2_m, minAs_cm2_m);

                const barAreaCm2 = Math.PI * Math.pow(selectedBarDiameterMm / 20, 2); // cm²
                const requiredSpacingCm = (barAreaCm2 / requiredSteelAreaCm2) * 100;
                
                const barSpacing = Math.min(requiredSpacingCm, 20); // Max spacing 20cm
                const totalBars = Math.ceil(sideLengthM * 100 / barSpacing) + 1;

                const analysisResult = {
                    requiredSteelAreaCm2,
                    barDiameter: selectedBarDiameterMm,
                    barSpacing,
                    totalBars,
                    analysis: ""
                };
                const analysisText = getLocalAnalysis(analysisResult);
                
                updateSapataArmadura({ result: { ...analysisResult, analysis: analysisText }});
                toast({ title: "Cálculo de Armadura Concluído", description: "A sugestão de armadura foi gerada." });

            } catch (e: any) {
                setError(e.message || "Ocorreu um erro no cálculo.");
            } finally {
                setIsCalculating(false);
            }
        }, 500);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Calculadora de Armadura da Sapata</CardTitle>
                <CardDescription>
                    Pré-dimensione a armadura de aço para a sapata de fundação com base nas normas brasileiras.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Carga do Pilar</Label>
                        <div className="w-full rounded-md border border-input bg-muted/30 px-3 py-2 text-base md:text-sm font-semibold h-10 flex items-center">
                            {sapata.load || "0"} kgf
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label>Dimensões da Sapata</Label>
                        <div className="w-full rounded-md border border-input bg-muted/30 px-3 py-2 text-base md:text-sm font-semibold h-10 flex items-center">
                           {sapata.result ? `${sapata.result.footingDimensions.sideLengthM.toFixed(2)}m x ${sapata.result.footingDimensions.recommendedHeightCm.toFixed(0)}cm` : "N/D"}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="concrete-strength">fck do Concreto (MPa)</Label>
                        <Select value={concreteStrength} onValueChange={value => handleInputChange('concreteStrength', value)}>
                            <SelectTrigger id="concrete-strength"><SelectValue /></SelectTrigger>
                            <SelectContent>{concreteStrengths.map(fck => <SelectItem key={fck} value={fck}>{fck}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="steel-strength">Aço da Armadura</Label>
                        <Select value={steelStrength} onValueChange={value => handleInputChange('steelStrength', value)}>
                            <SelectTrigger id="steel-strength"><SelectValue /></SelectTrigger>
                            <SelectContent>{steelStrengths.map(fyk => <SelectItem key={fyk} value={fyk}>CA-{fyk}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="bar-diameter">Diâmetro da Barra (mm)</Label>
                        <Select value={barDiameter} onValueChange={value => handleInputChange('barDiameter', value)}>
                            <SelectTrigger id="bar-diameter"><SelectValue /></SelectTrigger>
                            <SelectContent>{barDiameters.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                </div>

                <Button type="button" onClick={handleCalculate} className="w-full md:w-auto" disabled={isCalculating || !sapata.result}>
                    {isCalculating ? <><Loader className="animate-spin mr-2"/> Calculando...</> : <><Sparkles className="mr-2"/> Calcular Armadura</>}
                </Button>

                {error && <Alert variant="destructive"><AlertTitle>Erro</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
                {result && (
                    <Card className="mt-4 bg-primary/5 border-primary/20">
                        <CardHeader>
                             <AlertTitle className="text-primary font-bold flex items-center gap-2"><CheckCircle className="h-5 w-5"/> Sugestão de Armadura</AlertTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-2">
                             <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center text-sm p-2 rounded-lg bg-background border">
                                <div><p className="text-muted-foreground">Área de Aço (cm²/m)</p><p className="font-bold text-lg">{result.requiredSteelAreaCm2.toFixed(2)}</p></div>
                                <div><p className="text-muted-foreground">Espaçamento</p><p className="font-bold text-lg">c/{result.barSpacing.toFixed(1)} cm</p></div>
                                <div><p className="text-muted-foreground">Total de Barras</p><p className="font-bold text-lg">{result.totalBars} un / direção</p></div>
                            </div>
                            <Alert variant="default" className="bg-background">
                                <Sparkles className="h-4 w-4" /><AlertTitle className="font-semibold">Análise Lógica</AlertTitle>
                                <AlertDescription className="whitespace-pre-line">{result.analysis}</AlertDescription>
                            </Alert>
                        </CardContent>
                    </Card>
                )}
            </CardContent>
        </Card>
    );
}
