
"use client";

import { Dashboard } from "@/components/dashboard";
import * as React from "react";
import { perfisData, Perfil } from "@/lib/data/perfis";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, Calculator, PlusCircle, Trash2, Save, Printer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

const tiposAco = [
    { nome: "ASTM A36", fy: 250 },
    { nome: "ASTM A572 G50", fy: 345 },
];

type BudgetItem = {
  id: string;
  perfil: Perfil;
  span: number;
  quantity: number;
  weightPerBeam: number;
  totalWeight: number;
  costPerBeam: number;
  totalCost: number;
};

function CalculatorComponent() {
  const [span, setSpan] = React.useState("5");
  const [load, setLoad] = React.useState("300");
  const [steelType, setSteelType] = React.useState(tiposAco[0].nome);
  const [quantity, setQuantity] = React.useState("1");
  const [pricePerKg, setPricePerKg] = React.useState("8.50");
  
  const [recommendedProfile, setRecommendedProfile] = React.useState<Perfil | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const { toast } = useToast();

  const [budgetItems, setBudgetItems] = React.useState<BudgetItem[]>([]);

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

    const weightPerBeam = recommendedProfile.peso * L;
    const totalWeight = weightPerBeam * qty;
    const costPerBeam = weightPerBeam * price;
    const totalCost = totalWeight * price;

    const newItem: BudgetItem = {
        id: `${recommendedProfile.nome}-${Date.now()}`,
        perfil: recommendedProfile,
        span: L,
        quantity: qty,
        weightPerBeam,
        totalWeight,
        costPerBeam,
        totalCost,
    };

    setBudgetItems(prev => [...prev, newItem]);
    setRecommendedProfile(null); // Reset for next calculation
    toast({
        title: "Item Adicionado!",
        description: `${qty}x viga(s) ${recommendedProfile.nome} adicionada(s) ao orçamento.`,
    })
  }

  const handleClearBudget = () => {
      setBudgetItems([]);
      toast({
          title: "Orçamento Limpo",
          description: "A lista de itens foi removida.",
      })
  }
  
  const handleSaveBudget = () => {
    toast({
        title: "Orçamento Salvo!",
        description: "Seu orçamento foi salvo com sucesso (simulação).",
    })
  }

  const handlePrintBudget = () => {
      window.print();
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  }

  const formatNumber = (value: number, decimals = 2) => {
    return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value);
  }
  
  const totalBudgetCost = budgetItems.reduce((acc, item) => acc + item.totalCost, 0);
  const totalBudgetWeight = budgetItems.reduce((acc, item) => acc + item.totalWeight, 0);

  return (
    <div className="container mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Calculadora e Orçamento de Vigas</CardTitle>
          <CardDescription>
            Pré-dimensione o perfil W e adicione-o à lista para montar seu orçamento.
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
                        <p>Para um vão de <span className="font-semibold">{span}m</span> e carga de <span className="font-semibold">{load}kgf/m</span> com aço <span className="font-semibold">{steelType}</span>, o perfil mais leve é:</p>
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
                    <Button onClick={handleAddToBudget} className="w-full gap-2"><PlusCircle/> Adicionar ao Orçamento</Button>
                </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {budgetItems.length > 0 && (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2"><Calculator className="h-6 w-6"/> Orçamento de Vigas</CardTitle>
                        <CardDescription>Lista de itens calculados para o projeto.</CardDescription>
                    </div>
                     <div className="flex items-center gap-1">
                         <Button variant="ghost" size="icon" onClick={handleSaveBudget} className="text-muted-foreground hover:text-primary">
                            <Save className="h-5 w-5"/>
                         </Button>
                          <Button variant="ghost" size="icon" onClick={handlePrintBudget} className="text-muted-foreground hover:text-primary">
                            <Printer className="h-5 w-5"/>
                         </Button>
                         <Button variant="ghost" size="icon" onClick={handleClearBudget} className="text-destructive/70 hover:text-destructive">
                            <Trash2 className="h-5 w-5"/>
                         </Button>
                     </div>
                </div>
            </CardHeader>
            <CardContent className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Perfil</TableHead>
                            <TableHead className="text-center">Qtd.</TableHead>
                            <TableHead className="text-center">Vão (m)</TableHead>
                            <TableHead className="text-center">Peso/Viga (kg)</TableHead>
                            <TableHead className="text-center">Peso Total (kg)</TableHead>
                            <TableHead className="text-right">Custo/Viga (R$)</TableHead>
                            <TableHead className="text-right">Custo Total (R$)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {budgetItems.map(item => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.perfil.nome}</TableCell>
                                <TableCell className="text-center">{item.quantity}</TableCell>
                                <TableCell className="text-center">{formatNumber(item.span)}</TableCell>
                                <TableCell className="text-center">{formatNumber(item.weightPerBeam)}</TableCell>
                                <TableCell className="text-center font-semibold">{formatNumber(item.totalWeight)}</TableCell>
                                <TableCell className="text-right">{formatCurrency(item.costPerBeam)}</TableCell>
                                <TableCell className="text-right font-semibold">{formatCurrency(item.totalCost)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Separator className="my-4"/>
                <div className="flex justify-end items-center gap-8">
                     <div className="text-right">
                        <p className="text-sm text-muted-foreground">Peso Total do Orçamento</p>
                        <p className="text-xl font-bold">{formatNumber(totalBudgetWeight, 2)} kg</p>
                    </div>
                     <div className="text-right rounded-lg bg-primary/10 p-2 border border-primary/20">
                        <p className="text-sm text-primary">Custo Total do Orçamento</p>
                        <p className="text-2xl font-bold text-primary">{formatCurrency(totalBudgetCost)}</p>
                    </div>
                </div>
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
