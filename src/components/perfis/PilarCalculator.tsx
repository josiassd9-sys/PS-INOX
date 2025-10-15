
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
import { perfisData, tiposAco, BudgetItem, Perfil, SupportReaction } from "@/lib/data/index";

interface PilarCalculatorProps {
    onAddToBudget: (item: BudgetItem) => void;
    supportReactions: SupportReaction;
}

export function PilarCalculator({ onAddToBudget, supportReactions }: PilarCalculatorProps) {
    const [height, setHeight] = React.useState("3");
    const [axialLoad, setAxialLoad] = React.useState("5000");
    const [steelType, setSteelType] = React.useState(tiposAco[0].nome);
    const [quantity, setQuantity] = React.useState("1");
    const [pricePerKg, setPricePerKg] = React.useState("8.50");

    const [recommendedProfile, setRecommendedProfile] = React.useState<Perfil | null>(null);
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
        setRecommendedProfile(null);

        if (isNaN(H_m) || isNaN(P_kgf) || H_m <= 0 || P_kgf <= 0) {
            setError("Por favor, insira valores válidos para altura e carga axial.");
            return;
        }

        const selectedSteel = tiposAco.find(s => s.nome === steelType);
        if (!selectedSteel) {
            setError("Tipo de aço inválido selecionado.");
            return;
        }
        
        // Verificação Simplificada por Compressão Axial
        // Tensão = Força / Área -> Área_necessária = Força / Tensão_admissível
        // Considera um fator de segurança e um fator redutor para flambagem simplificado.
        const fy_MPa = selectedSteel.fy;
        const FATOR_SEGURANCA_COMPRESSAO = 1.67;
        const FATOR_REDUTOR_FLAMBAGEM_SIMPLIFICADO = 0.5;
        
        const tensao_admissivel_MPa = (fy_MPa / FATOR_SEGURANCA_COMPRESSAO) * FATOR_REDUTOR_FLAMBAGEM_SIMPLIFICADO;
        const P_N = P_kgf * 9.807; // Converte kgf para Newtons
        const requiredArea_mm2 = P_N / tensao_admissivel_MPa;
        const requiredArea_cm2 = requiredArea_mm2 / 100;

        const suitableProfiles = perfisData.filter(p => p.area >= requiredArea_cm2);
        
        if (suitableProfiles.length === 0) {
            setError("Nenhum perfil W atende à área necessária para a carga especificada (considerando fatores de segurança simplificados). A carga pode ser muito alta.");
            return;
        }

        const lightestProfile = suitableProfiles.reduce((lightest, current) => 
            current.peso < lightest.peso ? current : lightest
        );

        setRecommendedProfile(lightestProfile);
        toast({
            title: "Cálculo do Pilar Concluído",
            description: `O perfil recomendado é ${lightestProfile.nome}.`,
        });
    };

    const handleAddToBudget = () => {
        if (!recommendedProfile) {
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

        const weightPerUnit = recommendedProfile.peso * H;
        const totalWeight = weightPerUnit * qty;
        const costPerUnit = weightPerUnit * price;
        const totalCost = totalWeight * price;

        const newItem: BudgetItem = {
            id: `${recommendedProfile.nome}-pilar-${Date.now()}`,
            perfil: recommendedProfile,
            height: H,
            quantity: qty,
            weightPerUnit,
            totalWeight,
            costPerUnit,
            totalCost,
            type: 'Pilar',
        };

        onAddToBudget(newItem);
        setRecommendedProfile(null);
        toast({ title: "Pilar Adicionado!", description: `${qty}x pilar(es) ${recommendedProfile.nome} adicionado(s).` });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Calculadora de Pilar (Coluna)</CardTitle>
                <CardDescription>
                    Dimensione um perfil W para um pilar submetido à carga axial.
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
                
                {recommendedProfile && (
                     <Card className="mt-4 bg-primary/5 border-primary/20">
                        <CardHeader>
                            <AlertTitle className="text-primary font-bold flex items-center gap-2"><CheckCircle className="h-5 w-5"/> Perfil Recomendado para Pilar</AlertTitle>
                            <AlertDescription className="space-y-2 pt-2">
                                <p>O perfil mais leve que atende à carga axial de <span className="font-semibold">{axialLoad} kgf</span> é:</p>
                                <div className="text-2xl font-bold text-center py-2 text-primary">{recommendedProfile.nome}</div>
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
