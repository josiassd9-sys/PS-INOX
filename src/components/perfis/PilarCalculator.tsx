
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, PlusCircle, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { perfisData, tiposAco, BudgetItem, Perfil, SupportReaction, E_ACO_MPA } from "@/lib/data/index";

interface PilarCalculatorProps {
    onAddToBudget: (item: BudgetItem) => void;
    supportReactions: SupportReaction;
}

interface CalculationResult {
    profile: Perfil;
    actingStress: number; // Tensão atuante
    allowableStress: number; // Tensão admissível
}

export function PilarCalculator({ onAddToBudget, supportReactions }: PilarCalculatorProps) {
    const [height, setHeight] = React.useState("3");
    const [axialLoad, setAxialLoad] = React.useState("5000");
    const [steelType, setSteelType] = React.useState(tiposAco[0].nome);
    const [quantity, setQuantity] = React.useState("1");
    const [pricePerKg, setPricePerKg] = React.useState("8.50");

    const [result, setResult] = React.useState<CalculationResult | null>(null);
    const [error, setError] = React.useState<string | null>(null);
    const { toast } = useToast();

    const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
        const sanitizedValue = value.replace(/[^0-9,.]/g, '').replace('.', ',');
        if (/^\d*\,?\d*$/.test(sanitizedValue)) {
            setter(sanitizedValue);
        }
    };
    
    const handleApplyReaction = (reaction: number) => {
        if (reaction > 0) {
            const currentLoad = parseFloat(axialLoad.replace(',', '.')) || 0;
            const newLoad = currentLoad + reaction;
            setAxialLoad(newLoad.toFixed(0));
            toast({
                title: "Reação da Viga Aplicada!",
                description: `A carga de ${reaction.toFixed(0)} kgf foi somada à carga axial do pilar.`
            });
        }
    }

    const handleCalculate = () => {
        const H_m = parseFloat(height.replace(",", "."));
        const P_kgf = parseFloat(axialLoad.replace(",", "."));
        setError(null);
        setResult(null);

        if (isNaN(H_m) || isNaN(P_kgf) || H_m <= 0 || P_kgf <= 0) {
            setError("Por favor, insira valores válidos para altura e carga axial.");
            return;
        }

        const selectedSteel = tiposAco.find(s => s.nome === steelType);
        if (!selectedSteel) {
            setError("Tipo de aço inválido selecionado.");
            return;
        }

        const P_N = P_kgf * 9.807; // Força em Newtons
        const L_cm = H_m * 100; // Altura em cm
        const K = 1.0; // Fator de comprimento efetivo (pilar bi-rotulado, simplificação conservadora)
        const E_MPa = E_ACO_MPA;
        const fy_MPa = selectedSteel.fy;

        const suitableProfiles = perfisData
            .map(profile => {
                const area_cm2 = profile.area;
                const area_mm2 = area_cm2 * 100;
                
                // Análise de Esbeltez (Slenderness)
                const slenderness = (K * L_cm) / profile.ry; // Usa o menor raio de giração (ry)
                const slendernessLimit = 4.71 * Math.sqrt(E_MPa / fy_MPa);

                let fcr_MPa: number; // Tensão crítica de flambagem
                if (slenderness <= slendernessLimit) {
                    // Flambagem inelástica
                    const fe_MPa = (Math.pow(Math.PI, 2) * E_MPa) / Math.pow(slenderness, 2);
                    fcr_MPa = Math.pow(0.658, fy_MPa / fe_MPa) * fy_MPa;
                } else {
                    // Flambagem elástica
                    fcr_MPa = (0.877 * Math.pow(Math.PI, 2) * E_MPa) / Math.pow(slenderness, 2);
                }

                const FATOR_SEGURANCA = 1.67;
                const allowableStress_MPa = fcr_MPa / FATOR_SEGURANCA;
                const maxLoad_N = allowableStress_MPa * area_mm2;
                
                const actingStress_MPa = P_N / area_mm2;

                if (maxLoad_N >= P_N) {
                    return {
                        profile,
                        allowableStress: allowableStress_MPa,
                        actingStress: actingStress_MPa,
                    };
                }
                return null;
            })
            .filter(p => p !== null) as { profile: Perfil, allowableStress: number, actingStress: number }[];
        
        if (suitableProfiles.length === 0) {
            setError("Nenhum perfil W atende aos requisitos de flambagem para a carga e altura especificadas. Tente uma carga menor ou verifique os parâmetros.");
            return;
        }

        // Encontra o perfil mais leve entre os adequados
        const bestProfileData = suitableProfiles.reduce((lightest, current) => 
            current.profile.peso < lightest.profile.peso ? current : lightest
        );

        setResult(bestProfileData);
        toast({
            title: "Cálculo do Pilar Concluído",
            description: `O perfil recomendado é ${bestProfileData.profile.nome}.`,
        });
    };

    const handleAddToBudget = () => {
        if (!result) {
            toast({ variant: "destructive", title: "Nenhum Perfil Calculado" });
            return;
        }
        const H = parseFloat(height.replace(",", "."));
        const qty = parseInt(quantity);
        const price = parseFloat(pricePerKg.replace(",", "."));

        if (isNaN(H) || isNaN(qty) || isNaN(price) || H <= 0 || qty <= 0 || price <= 0) {
            toast({ variant: "destructive", title: "Valores Inválidos" });
            return;
        }

        const weightPerUnit = result.profile.peso * H;
        const totalWeight = weightPerUnit * qty;
        const costPerUnit = weightPerUnit * price;
        const totalCost = totalWeight * price;

        const newItem: BudgetItem = {
            id: `${result.profile.nome}-pilar-${Date.now()}`,
            perfil: result.profile,
            height: H,
            quantity: qty,
            weightPerUnit,
            totalWeight,
            costPerUnit,
            totalCost,
            type: 'Pilar',
        };

        onAddToBudget(newItem);
        setResult(null);
        toast({ title: "Pilar Adicionado!", description: `${qty}x pilar(es) ${result.profile.nome} adicionado(s).` });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Calculadora de Pilar (Coluna)</CardTitle>
                <CardDescription>
                    Dimensione um perfil W para um pilar submetido à carga axial, com verificação de flambagem.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="pilar-height">Altura do Pilar (m)</Label>
                        <Input id="pilar-height" type="text" inputMode="decimal" value={height} onChange={e => handleInputChange(setHeight, e.target.value)} placeholder="Ex: 3,0" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="pilar-load">Carga Axial (kgf)</Label>
                        <Input id="pilar-load" type="text" inputMode="decimal" value={axialLoad} onChange={e => handleInputChange(setAxialLoad, e.target.value)} placeholder="Ex: 5000" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="pilar-steel-type">Tipo de Aço</Label>
                        <Select value={steelType} onValueChange={setSteelType}>
                            <SelectTrigger id="pilar-steel-type">
                                <SelectValue placeholder="Selecione o aço" />
                            </SelectTrigger>
                            <SelectContent>
                                {tiposAco.map(aco => (
                                    <SelectItem key={aco.nome} value={aco.nome}>{aco.nome}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {(supportReactions.vigaPrincipal > 0 || supportReactions.vigaSecundaria > 0) && (
                     <div className="space-y-2 rounded-md border p-2">
                        <p className="text-sm font-medium">Reações de Apoio Calculadas</p>
                        <div className="flex gap-2">
                             {supportReactions.vigaPrincipal > 0 && (
                                <Button variant="outline" size="sm" onClick={() => handleApplyReaction(supportReactions.vigaPrincipal)} className="flex-1 gap-1">
                                    <Send size={16}/> Enviar {supportReactions.vigaPrincipal.toFixed(0)} kgf (Viga Princ.)
                                </Button>
                            )}
                            {supportReactions.vigaSecundaria > 0 && (
                                <Button variant="outline" size="sm" onClick={() => handleApplyReaction(supportReactions.vigaSecundaria)} className="flex-1 gap-1">
                                    <Send size={16}/> Enviar {supportReactions.vigaSecundaria.toFixed(0)} kgf (Viga Sec.)
                                </Button>
                            )}
                        </div>
                    </div>
                )}
                

                <Button onClick={handleCalculate} className="w-full md:w-auto">Calcular Pilar</Button>

                {error && <Alert variant="destructive"><AlertTitle>Erro</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
                
                {result && (
                     <Card className="mt-4 bg-primary/5 border-primary/20">
                        <CardHeader>
                            <AlertTitle className="text-primary font-bold flex items-center gap-2"><CheckCircle className="h-5 w-5"/> Perfil Recomendado para Pilar</AlertTitle>
                            <AlertDescription className="space-y-2 pt-2">
                                <p>O perfil mais leve que atende à carga axial de <span className="font-semibold">{axialLoad} kgf</span> e altura de <span className="font-semibold">{height}m</span> é:</p>
                                <div className="text-2xl font-bold text-center py-2 text-primary">{result.profile.nome}</div>
                                 <div className="grid grid-cols-2 gap-2 text-center text-sm">
                                    <div>
                                        <p className="text-muted-foreground">Tensão Atuante</p>
                                        <p className="font-semibold">{result.actingStress.toFixed(1)} MPa</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Tensão Admissível</p>
                                        <p className="font-semibold">{result.allowableStress.toFixed(1)} MPa</p>
                                    </div>
                                </div>
                            </AlertDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 border-t pt-4">
                                <div className="space-y-2">
                                    <Label htmlFor="pilar-quantity">Quantidade</Label>
                                    <Input id="pilar-quantity" type="text" inputMode="numeric" value={quantity} onChange={e => handleInputChange(setQuantity, e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="pilar-pricePerKg">Preço Aço (R$/kg)</Label>
                                    <Input id="pilar-pricePerKg" type="text" inputMode="decimal" value={pricePerKg} onChange={e => handleInputChange(setPricePerKg, e.target.value)} />
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
