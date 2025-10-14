
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, PlusCircle, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { perfisIpeData, tiposAco, E_ACO_MPA, BudgetItem, PerfilIpe } from "@/lib/data";

interface VigaSecundariaCalculatorProps {
    onAddToBudget: (item: BudgetItem) => void;
    lastSlabLoad: number;
    onReactionCalculated: (reaction: number) => void;
}

export function VigaSecundariaCalculator({ onAddToBudget, lastSlabLoad, onReactionCalculated }: VigaSecundariaCalculatorProps) {
  const [span, setSpan] = React.useState("4");
  const [spacing, setSpacing] = React.useState("1.5");
  const [slabLoad, setSlabLoad] = React.useState("450");
  const [distributedLoad, setDistributedLoad] = React.useState("");
  const [steelType, setSteelType] = React.useState(tiposAco[0].nome);
  const [quantity, setQuantity] = React.useState("1");
  const [pricePerKg, setPricePerKg] = React.useState("8.50");

  const [recommendedProfile, setRecommendedProfile] = React.useState<PerfilIpe | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [reaction, setReaction] = React.useState(0);
  const { toast } = useToast();
  
  React.useEffect(() => {
    const E_m = parseFloat(spacing.replace(",", "."));
    const S_kgf_m2 = parseFloat(slabLoad.replace(",", "."));
    if (!isNaN(E_m) && !isNaN(S_kgf_m2) && E_m > 0 && S_kgf_m2 > 0) {
      const q_dist_kgf_m = S_kgf_m2 * E_m;
      setDistributedLoad(q_dist_kgf_m.toFixed(2).replace('.',','));
    }
  }, [slabLoad, spacing])

  const handleApplySlabLoad = () => {
    if (lastSlabLoad > 0) {
      setSlabLoad(lastSlabLoad.toFixed(0));
      toast({
        title: "Carga da Laje Aplicada!",
        description: `O valor ${lastSlabLoad.toFixed(0)} kgf/m² foi inserido no campo de carga.`
      })
    }
  }

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
    const sanitizedValue = value.replace(/[^0-9,.]/g, '').replace('.', ',');
    if (/^\d*[,.]?\d*$/.test(sanitizedValue)) {
      setter(sanitizedValue);
    }
  };

  const handleCalculate = () => {
    const L_m = parseFloat(span.replace(",", "."));
    const q_dist_kgf_m = parseFloat(distributedLoad.replace(",", "."));

    setError(null);
    setRecommendedProfile(null);
    setReaction(0);

    if (isNaN(L_m) || isNaN(q_dist_kgf_m) || L_m <= 0 || q_dist_kgf_m <= 0) {
      setError("Por favor, insira valores válidos e positivos para todos os campos.");
      return;
    }
    
    const selectedSteel = tiposAco.find(s => s.nome === steelType);
    if (!selectedSteel) {
        setError("Tipo de aço inválido selecionado.");
        return;
    }

    const fy_MPa = selectedSteel.fy;
    const fy_kN_cm2 = fy_MPa / 10;
    const q_kN_m = q_dist_kgf_m * 0.009807;
    const maxMoment_kNm = (q_kN_m * Math.pow(L_m, 2)) / 8;
    const maxMoment_kNcm = maxMoment_kNm * 100;
    const requiredWx_cm3 = maxMoment_kNcm / fy_kN_cm2;
    
    const L_cm = L_m * 100;
    const allowedDeflection_cm = L_cm / 360;
    const q_kN_cm = q_kN_m / 100;
    const E_kN_cm2 = E_ACO_MPA / 10;
    const requiredIx_cm4 = (5 * q_kN_cm * Math.pow(L_cm, 4)) / (384 * E_kN_cm2 * allowedDeflection_cm);

    const suitableProfiles = perfisIpeData.filter(p => p.Wx >= requiredWx_cm3 && p.Ix >= requiredIx_cm4);
    
    if (suitableProfiles.length === 0) {
      setError("Nenhum perfil IPE na tabela atende aos requisitos. A carga, vão ou espaçamento podem ser muito grandes.");
      return;
    }
    
    const lightestProfile = suitableProfiles.reduce((lightest, current) => {
      return current.peso < lightest.peso ? current : lightest;
    });

    const reaction_kN = (q_kN_m * L_m) / 2;
    const reaction_kgf = reaction_kN / 0.009807;
    setReaction(reaction_kgf);
    onReactionCalculated(reaction_kgf);

    setRecommendedProfile(lightestProfile);
    toast({
        title: "Cálculo de Viga Secundária Concluído",
        description: `O perfil recomendado é ${lightestProfile.nome}. Adicione-o ao orçamento.`,
    })
  };
  
  const handleAddToBudget = () => {
    if (!recommendedProfile) {
        toast({ variant: "destructive", title: "Nenhum Perfil Calculado" });
        return;
    }
    const L = parseFloat(span.replace(",", "."));
    const qty = parseInt(quantity);
    const price = parseFloat(pricePerKg.replace(",", "."));

    if (isNaN(L) || isNaN(qty) || isNaN(price) || L <= 0 || qty <= 0 || price <= 0) {
        toast({ variant: "destructive", title: "Valores Inválidos" });
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
        type: 'Viga Secundária',
    };

    onAddToBudget(newItem);
    setRecommendedProfile(null);
    setReaction(0);
    toast({ title: "Item Adicionado!", description: `${qty}x viga(s) ${recommendedProfile.nome} adicionada(s).`})
  }

  const isSlabLoadSynced = lastSlabLoad > 0 && lastSlabLoad.toFixed(0) === slabLoad;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Calculadora de Viga Secundária (Perfil IPE)</CardTitle>
          <CardDescription>
            Dimensione vigas secundárias que apoiam a laje, como em um sistema de steel deck.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="vs-span">Vão da Viga (m)</Label>
              <Input id="vs-span" type="text" inputMode="decimal" value={span} onChange={(e) => handleInputChange(setSpan, e.target.value)} placeholder="Ex: 4,0" />
            </div>
             <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label htmlFor="vs-slab-load">Carga da Laje (kgf/m²)</Label>
                    {lastSlabLoad > 0 && (
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-primary" onClick={handleApplySlabLoad} title="Aplicar carga calculada na aba de laje">
                        <RefreshCw className={`h-4 w-4 ${isSlabLoadSynced ? 'text-green-500' : 'animate-pulse'}`}/>
                    </Button>
                    )}
                </div>
                <Input id="vs-slab-load" type="text" inputMode="decimal" value={slabLoad} onChange={(e) => handleInputChange(setSlabLoad, e.target.value)} placeholder="Ex: 450" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vs-spacing">Espaçamento entre Vigas (m)</Label>
              <Input id="vs-spacing" type="text" inputMode="decimal" value={spacing} onChange={(e) => handleInputChange(setSpacing, e.target.value)} placeholder="Ex: 1,5" />
            </div>
             <div className="space-y-2">
              <Label htmlFor="vs-load">Carga na Viga (kgf/m)</Label>
              <Input id="vs-load" type="text" inputMode="decimal" value={distributedLoad} onChange={(e) => handleInputChange(setDistributedLoad, e.target.value)} placeholder="Carga linear" />
            </div>
             <div className="space-y-2">
              <Label htmlFor="vs-steel-type">Tipo de Aço</Label>
               <Select value={steelType} onValueChange={setSteelType}>
                <SelectTrigger id="vs-steel-type">
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
          <Button onClick={handleCalculate} className="w-full md:w-auto">Calcular Viga Secundária</Button>

          {error && <Alert variant="destructive"><AlertTitle>Erro</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}

          {recommendedProfile && (
             <Card className="mt-4 bg-primary/5 border-primary/20">
                <CardHeader>
                    <AlertTitle className="text-primary font-bold flex items-center gap-2"><CheckCircle className="h-5 w-5"/> Perfil IPE Recomendado</AlertTitle>
                    <AlertDescription className="space-y-2 pt-2">
                        <p>Carga linear calculada na viga: <span className="font-semibold">{parseFloat(distributedLoad.replace(',','.')).toFixed(2)} kgf/m</span>. O perfil mais leve que atende aos critérios é:</p>
                        <div className="text-2xl font-bold text-center py-2 text-primary">{recommendedProfile.nome}</div>
                    </AlertDescription>
                </CardHeader>
                 <CardContent className="space-y-4">
                     <div className="grid grid-cols-2 gap-4 border-t pt-4">
                         <div className="space-y-2">
                            <Label htmlFor="vs-quantity">Quantidade</Label>
                            <Input id="vs-quantity" type="text" inputMode="numeric" value={quantity} onChange={(e) => handleInputChange(setQuantity, e.target.value)} placeholder="Ex: 1" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="vs-pricePerKg">Preço do Aço (R$/kg)</Label>
                            <Input id="vs-pricePerKg" type="text" inputMode="decimal" value={pricePerKg} onChange={(e) => handleInputChange(setPricePerKg, e.target.value)} placeholder="Ex: 8,50" />
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
