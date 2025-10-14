
"use client";

import { Dashboard } from "@/components/dashboard";
import * as React from "react";
import { perfisData, Perfil } from "@/lib/data/perfis";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, Calculator } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const tiposAco = [
    { nome: "ASTM A36", fy: 250 },
    { nome: "ASTM A572 G50", fy: 345 },
];


function CalculatorComponent() {
  const [span, setSpan] = React.useState("5"); // Vão em metros
  const [load, setLoad] = React.useState("300"); // Carga em kgf/m
  const [steelType, setSteelType] = React.useState(tiposAco[0].nome);
  const [quantity, setQuantity] = React.useState("1");
  const [pricePerKg, setPricePerKg] = React.useState("8.50");
  const [recommendedProfile, setRecommendedProfile] = React.useState<Perfil | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const { toast } = useToast();

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
    const sanitizedValue = value.replace(/[^0-9,.]/g, '').replace('.', ',');
    if (/^\d*[,.]?\d*$/.test(sanitizedValue)) {
      setter(sanitizedValue);
    }
  };

  const handleCalculate = () => {
    const L = parseFloat(span.replace(",", "."));
    const q = parseFloat(load.replace(",", "."));
    setError(null);
    setRecommendedProfile(null);

    if (isNaN(L) || isNaN(q) || L <= 0 || q <= 0) {
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
    
    const q_kN_m = q * 0.009807;
    const maxMoment_kNm = (q_kN_m * Math.pow(L, 2)) / 8;
    
    const maxMoment_kNcm = maxMoment_kNm * 100;
    
    const requiredWx = maxMoment_kNcm / fy_kN_cm2;
    
    const suitableProfiles = perfisData.filter(p => p.Wx >= requiredWx);
    
    if (suitableProfiles.length === 0) {
      setError("Nenhum perfil na tabela atende aos requisitos. A carga ou o vão podem ser muito grandes.");
      return;
    }
    
    const lightestProfile = suitableProfiles.reduce((lightest, current) => {
      return current.peso < lightest.peso ? current : lightest;
    });

    setRecommendedProfile(lightestProfile);
    toast({
        title: "Cálculo Concluído",
        description: `O perfil recomendado é ${lightestProfile.nome}.`,
    })
  };

  const budgetResults = React.useMemo(() => {
    if (!recommendedProfile) return null;
    
    const L = parseFloat(span.replace(",", ".")) || 0;
    const qty = parseInt(quantity) || 0;
    const price = parseFloat(pricePerKg.replace(",", ".")) || 0;

    if (L <= 0 || qty <= 0 || price <= 0) return null;

    const weightPerBeam = recommendedProfile.peso * L;
    const totalWeight = weightPerBeam * qty;
    const costPerBeam = weightPerBeam * price;
    const totalCost = totalWeight * price;

    return { weightPerBeam, totalWeight, costPerBeam, totalCost };
  }, [recommendedProfile, span, quantity, pricePerKg]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  }

  const formatNumber = (value: number, decimals = 2) => {
    return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value);
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Calculadora de Vigas e Orçamento</CardTitle>
          <CardDescription>
            Pré-dimensione o perfil W e estime o custo do material para seu projeto.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
             <Alert variant="default" className="bg-primary/5 border-primary/20">
                 <CheckCircle className="h-4 w-4 text-primary" />
                <AlertTitle className="text-primary font-bold">Perfil Recomendado</AlertTitle>
                <AlertDescription className="space-y-2">
                    <p>Considerando um aço <span className="font-semibold">{steelType}</span>, o perfil mais leve que atende aos requisitos é:</p>
                    <div className="text-2xl font-bold text-center py-4 text-primary">{recommendedProfile.nome}</div>
                    <ul className="text-sm text-muted-foreground list-disc pl-5">
                        <li><strong>Peso:</strong> {recommendedProfile.peso} kg/m</li>
                        <li><strong>Módulo de Resistência (Wx):</strong> {recommendedProfile.Wx} cm³</li>
                    </ul>
                     <p className="text-xs text-muted-foreground pt-2">
                        <strong>Aviso:</strong> Este é um pré-dimensionamento. A escolha final deve ser validada por um engenheiro calculista.
                    </p>
                </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {recommendedProfile && (
        <Card className="mt-4">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Calculator className="h-6 w-6"/> Orçamento do Material</CardTitle>
                <CardDescription>Insira a quantidade de vigas e o preço do aço para estimar o custo.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <Label htmlFor="quantity">Quantidade de Vigas</Label>
                        <Input id="quantity" type="text" inputMode="numeric" value={quantity} onChange={(e) => handleInputChange(setQuantity, e.target.value)} placeholder="Ex: 1" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="pricePerKg">Preço do Aço (R$/kg)</Label>
                        <Input id="pricePerKg" type="text" inputMode="decimal" value={pricePerKg} onChange={(e) => handleInputChange(setPricePerKg, e.target.value)} placeholder="Ex: 8,50" />
                    </div>
                </div>
                
                {budgetResults && (
                    <div className="pt-4 border-t">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                            <div className="space-y-1 rounded-lg bg-muted/50 p-2">
                                <p className="text-sm text-muted-foreground">Peso / Viga</p>
                                <p className="text-lg font-bold">{formatNumber(budgetResults.weightPerBeam)} kg</p>
                            </div>
                             <div className="space-y-1 rounded-lg bg-muted/50 p-2">
                                <p className="text-sm text-muted-foreground">Peso Total</p>
                                <p className="text-lg font-bold">{formatNumber(budgetResults.totalWeight)} kg</p>
                            </div>
                             <div className="space-y-1 rounded-lg bg-muted/50 p-2">
                                <p className="text-sm text-muted-foreground">Custo / Viga</p>
                                <p className="text-lg font-bold">{formatCurrency(budgetResults.costPerBeam)}</p>
                            </div>
                             <div className="space-y-1 rounded-lg bg-primary/10 p-2 border border-primary/20">
                                <p className="text-sm text-primary">Custo Total</p>
                                <p className="text-2xl font-bold text-primary">{formatCurrency(budgetResults.totalCost)}</p>
                            </div>
                        </div>
                    </div>
                )}

            </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function Page() {
  return (
      <Dashboard initialCategoryId="perfis/calculadora">
        <CalculatorComponent />
      </Dashboard>
  );
}

    