
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { perfisData, tiposAco, E_ACO_MPA, BudgetItem, Perfil } from "@/lib/data";

interface VigaPrincipalCalculatorProps {
    onAddToBudget: (item: BudgetItem) => void;
    onReactionCalculated: (reaction: number) => void;
}

export function VigaPrincipalCalculator({ onAddToBudget, onReactionCalculated }: VigaPrincipalCalculatorProps) {
  const [span, setSpan] = React.useState("5");
  const [load, setLoad] = React.useState("300");
  const [steelType, setSteelType] = React.useState(tiposAco[0].nome);
  const [quantity, setQuantity] = React.useState("1");
  const [pricePerKg, setPricePerKg] = React.useState("8.50");
  
  const [recommendedProfile, setRecommendedProfile] = React.useState<Perfil | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [reaction, setReaction] = React.useState(0);
  const { toast } = useToast();

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
    const sanitizedValue = value.replace(/[^0-9,.]/g, '').replace('.', ',');
    if (/^\d*[,.]?\d*$/.test(sanitizedValue)) {
      setter(sanitizedValue);
    }
  };

  const handleCalculate = () => {
    const L_m = parseFloat(span.replace(",", "."));
    const q_kgf_m = parseFloat(load.replace(",", "."));
    setError(null);
    setRecommendedProfile(null);
    setReaction(0);

    if (isNaN(L_m) || isNaN(q_kgf_m) || L_m <= 0 || q_kgf_m <= 0) {
      setError("Por favor, insira valores válidos e positivos para o vão e a carga.");
      return;
    }

    const selectedSteel = tiposAco.find(s => s.nome === steelType);
    if (!selectedSteel) {
        setError("Tipo de aço inválido selecionado.");
        return;
    }

    const fy_MPa = selectedSteel.fy;
    const fy_kN_cm2 = fy_MPa / 10;
    const q_kN_m = q_kgf_m * 0.009807;
    const maxMoment_kNm = (q_kN_m * Math.pow(L_m, 2)) / 8;
    const maxMoment_kNcm = maxMoment_kNm * 100;
    const requiredWx_cm3 = maxMoment_kNcm / fy_kN_cm2;
    
    const L_cm = L_m * 100;
    const allowedDeflection_cm = L_cm / 360;
    const q_kN_cm = q_kN_m / 100;
    const E_kN_cm2 = E_ACO_MPA / 10;
    const requiredIx_cm4 = (5 * q_kN_cm * Math.pow(L_cm, 4)) / (384 * E_kN_cm2 * allowedDeflection_cm);

    const suitableProfiles = perfisData.filter(p => p.Wx >= requiredWx_cm3 && p.Ix >= requiredIx_cm4);
    
    if (suitableProfiles.length === 0) {
      setError("Nenhum perfil na tabela atende aos requisitos de resistência e/ou deformação. A carga ou o vão podem ser muito grandes.");
      return;
    }
    
    const lightestProfile = suitableProfiles.reduce((lightest, current) => {
      return current.peso < lightest.peso ? current : lightest;
    });

    // Calcular reação de apoio (viga biapoiada) = (q * L) / 2
    const reaction_kN = (q_kN_m * L_m) / 2;
    const reaction_kgf = reaction_kN / 0.009807;
    setReaction(reaction_kgf);
    onReactionCalculated(reaction_kgf);


    setRecommendedProfile(lightestProfile);
    toast({
        title: "Cálculo Concluído",
        description: `O perfil recomendado é ${lightestProfile.nome}. Agora você pode adicioná-lo ao orçamento.`,
    })
  };
  
  const handleAddToBudget = () => {
    if (!recommendedProfile) {
        toast({
            variant: "destructive",
            title: "Nenhum Perfil Calculado",
            description: "Primeiro, calcule um perfil recomendado.",
        });
        return;
    }

    const L = parseFloat(span.replace(",", "."));
    const qty = parseInt(quantity);
    const price = parseFloat(pricePerKg.replace(",", "."));

    if (isNaN(L) || isNaN(qty) || isNaN(price) || L <= 0 || qty <= 0 || price <= 0) {
        toast({
            variant: "destructive",
            title: "Valores Inválidos",
            description: "Verifique o vão, quantidade e preço antes de adicionar.",
        });
        return;
    }

    const weightPerUnit = recommendedProfile.peso * L;
    const totalWeight = weightPerUnit * qty;
    const costPerUnit = weightPerUnit * price;
    const totalCost = totalWeight * price;

    const newItem: BudgetItem = {
        id: `${recommendedProfile.nome}-${Date.now()}`,
        perfil: recommendedProfile,
        span: L,
        quantity: qty,
        weightPerUnit,
        totalWeight,
        costPerUnit,
        totalCost,
        type: 'Viga Principal',
    };

    onAddToBudget(newItem);
    setRecommendedProfile(null); 
    setReaction(0);
    toast({
        title: "Item Adicionado!",
        description: `${qty}x viga(s) ${recommendedProfile.nome} adicionada(s) ao orçamento.`,
    })
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Calculadora de Viga Principal (Perfil W)</CardTitle>
          <CardDescription>
            Pré-dimensione o perfil W (considerando resistência e deformação) e adicione-o à lista para montar seu orçamento.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="span">Comprimento do Vão (m)</Label>
              <Input id="span" type="text" inputMode="decimal" value={span} onChange={(e) => handleInputChange(setSpan, e.target.value)} placeholder="Ex: 5,0" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="load">Carga Distribuída (kgf/m)</Label>
              <Input id="load" type="text" inputMode="decimal" value={load} onChange={(e) => handleInputChange(setLoad, e.target.value)} placeholder="Ex: 300" />
            </div>
             <div className="space-y-2">
              <Label htmlFor="steel-type">Tipo de Aço</Label>
               <Select value={steelType} onValueChange={setSteelType}>
                <SelectTrigger id="steel-type">
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
          <Button onClick={handleCalculate} className="w-full md:w-auto">Calcular Perfil Recomendado</Button>

          {error && (
             <Alert variant="destructive">
                <AlertTitle>Erro no Cálculo</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {recommendedProfile && (
             <Card className="mt-4 bg-primary/5 border-primary/20">
                <CardHeader>
                    <AlertTitle className="text-primary font-bold flex items-center gap-2"><CheckCircle className="h-5 w-5"/> Perfil Recomendado</AlertTitle>
                    <AlertDescription className="space-y-2 pt-2">
                        <p>Para um vão de <span className="font-semibold">{span}m</span> e carga de <span className="font-semibold">{load}kgf/m</span> com aço <span className="font-semibold">{steelType}</span>, o perfil mais leve que atende aos critérios é:</p>
                        <div className="text-2xl font-bold text-center py-2 text-primary">{recommendedProfile.nome}</div>
                         <p className="text-xs text-muted-foreground pt-1">
                            Agora, defina a quantidade e o preço para adicionar ao orçamento.
                        </p>
                    </AlertDescription>
                </CardHeader>
                 <CardContent className="space-y-4">
                     <div className="grid grid-cols-2 gap-4 border-t pt-4">
                         <div className="space-y-2">
                            <Label htmlFor="quantity">Quantidade de Vigas</Label>
                            <Input id="quantity" type="text" inputMode="numeric" value={quantity} onChange={(e) => handleInputChange(setQuantity, e.target.value)} placeholder="Ex: 1" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="pricePerKg">Preço do Aço (R$/kg)</Label>
                            <Input id="pricePerKg" type="text" inputMode="decimal" value={pricePerKg} onChange={(e) => handleInputChange(setPricePerKg, e.target.value)} placeholder="Ex: 8,50" />
                        </div>
                    </div>
                    {reaction > 0 && (
                        <div className="text-sm text-center text-muted-foreground">Reação de apoio por extremidade: <span className="font-bold text-foreground">{reaction.toFixed(0)} kgf</span></div>
                    )}
                    <Button onClick={handleAddToBudget} className="w-full gap-2"><PlusCircle/> Adicionar ao Orçamento</Button>
                </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
