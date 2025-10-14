
"use client";

import { Dashboard } from "@/components/dashboard";
import * as React from "react";
import { perfisData, Perfil, perfisIpeData, PerfilIpe, steelDeckData, SteelDeck } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, Calculator, PlusCircle, Trash2, Save, Printer, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const tiposAco = [
    { nome: "ASTM A36", fy: 250 },
    { nome: "ASTM A572 G50", fy: 345 },
];

const PESO_CONCRETO_KGF_M3 = 2400; // kgf/m³
const E_ACO_MPA = 200000; // Módulo de Elasticidade do Aço em MPa

type BudgetItem = {
  id: string;
  perfil: Perfil | PerfilIpe | SteelDeck;
  span?: number; // Opcional para itens como Steel Deck
  quantity: number;
  weightPerBeam: number;
  totalWeight: number;
  costPerBeam: number;
  totalCost: number;
  type: 'Viga Principal' | 'Viga Secundária' | 'Steel Deck';
};

function VigaPrincipalCalculator({ onAddToBudget }: { onAddToBudget: (item: BudgetItem) => void }) {
  const [span, setSpan] = React.useState("5");
  const [load, setLoad] = React.useState("300");
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
    const L_m = parseFloat(span.replace(",", "."));
    const q_kgf_m = parseFloat(load.replace(",", "."));
    setError(null);
    setRecommendedProfile(null);

    if (isNaN(L_m) || isNaN(q_kgf_m) || L_m <= 0 || q_kgf_m <= 0) {
      setError("Por favor, insira valores válidos e positivos para o vão e a carga.");
      return;
    }

    const selectedSteel = tiposAco.find(s => s.nome === steelType);
    if (!selectedSteel) {
        setError("Tipo de aço inválido selecionado.");
        return;
    }

    // --- Verificação de Resistência (Momento Fletor) ---
    const fy_MPa = selectedSteel.fy;
    const fy_kN_cm2 = fy_MPa / 10;
    const q_kN_m = q_kgf_m * 0.009807;
    const maxMoment_kNm = (q_kN_m * Math.pow(L_m, 2)) / 8;
    const maxMoment_kNcm = maxMoment_kNm * 100;
    const requiredWx_cm3 = maxMoment_kNcm / fy_kN_cm2;
    
    // --- Verificação de Deformação (Flecha) ---
    const L_cm = L_m * 100;
    const allowedDeflection_cm = L_cm / 360; // L/360
    const q_kN_cm = q_kN_m / 100;
    const E_kN_cm2 = E_ACO_MPA / 10;
    // requiredIx = (5 * q * L^4) / (384 * E * delta_max)
    const requiredIx_cm4 = (5 * q_kN_cm * Math.pow(L_cm, 4)) / (384 * E_kN_cm2 * allowedDeflection_cm);

    // Filtrar perfis que atendem a AMBOS os critérios
    const suitableProfiles = perfisData.filter(p => p.Wx >= requiredWx_cm3 && p.Ix >= requiredIx_cm4);
    
    if (suitableProfiles.length === 0) {
      setError("Nenhum perfil na tabela atende aos requisitos de resistência e/ou deformação. A carga ou o vão podem ser muito grandes.");
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
        type: 'Viga Principal',
    };

    onAddToBudget(newItem);
    setRecommendedProfile(null); // Reset for next calculation
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
                        <p>Para um vão de <span className="font-semibold">{span}m</span> e carga de <span className="font-semibold">{load}kgf/m</span> com aço <span className="font-semibold">{steelType}</span>, o perfil mais leve que atende aos critérios de resistência e deformação (flecha L/360) é:</p>
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
    </div>
  );
}


function VigaSecundariaCalculator({ onAddToBudget, lastSlabLoad }: { onAddToBudget: (item: BudgetItem) => void, lastSlabLoad: number }) {
  const [span, setSpan] = React.useState("4");
  const [spacing, setSpacing] = React.useState("1.5");
  const [slabLoad, setSlabLoad] = React.useState("450");
  const [distributedLoad, setDistributedLoad] = React.useState("");
  const [steelType, setSteelType] = React.useState(tiposAco[0].nome);
  const [quantity, setQuantity] = React.useState("1");
  const [pricePerKg, setPricePerKg] = React.useState("8.50");

  const [recommendedProfile, setRecommendedProfile] = React.useState<PerfilIpe | null>(null);
  const [error, setError] = React.useState<string | null>(null);
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

    if (isNaN(L_m) || isNaN(q_dist_kgf_m) || L_m <= 0 || q_dist_kgf_m <= 0) {
      setError("Por favor, insira valores válidos e positivos para todos os campos.");
      return;
    }
    
    const selectedSteel = tiposAco.find(s => s.nome === steelType);
    if (!selectedSteel) {
        setError("Tipo de aço inválido selecionado.");
        return;
    }

    // --- Verificação de Resistência (Momento Fletor) ---
    const fy_MPa = selectedSteel.fy;
    const fy_kN_cm2 = fy_MPa / 10;
    const q_kN_m = q_dist_kgf_m * 0.009807;
    const maxMoment_kNm = (q_kN_m * Math.pow(L_m, 2)) / 8;
    const maxMoment_kNcm = maxMoment_kNm * 100;
    const requiredWx_cm3 = maxMoment_kNcm / fy_kN_cm2;
    
    // --- Verificação de Deformação (Flecha) ---
    const L_cm = L_m * 100;
    const allowedDeflection_cm = L_cm / 360;
    const q_kN_cm = q_kN_m / 100;
    const E_kN_cm2 = E_ACO_MPA / 10;
    const requiredIx_cm4 = (5 * q_kN_cm * Math.pow(L_cm, 4)) / (384 * E_kN_cm2 * allowedDeflection_cm);

    // Filtrar perfis que atendem a AMBOS os critérios
    const suitableProfiles = perfisIpeData.filter(p => p.Wx >= requiredWx_cm3 && p.Ix >= requiredIx_cm4);
    
    if (suitableProfiles.length === 0) {
      setError("Nenhum perfil IPE na tabela atende aos requisitos. A carga, vão ou espaçamento podem ser muito grandes.");
      return;
    }
    
    const lightestProfile = suitableProfiles.reduce((lightest, current) => {
      return current.peso < lightest.peso ? current : lightest;
    });

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
        type: 'Viga Secundária',
    };

    onAddToBudget(newItem);
    setRecommendedProfile(null);
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
                        <p>Carga linear calculada na viga: <span className="font-semibold">{parseFloat(distributedLoad.replace(',','.')).toFixed(2)} kgf/m</span>. O perfil mais leve que atende aos critérios de resistência e deformação é:</p>
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
                    <Button onClick={handleAddToBudget} className="w-full gap-2"><PlusCircle/> Adicionar ao Orçamento</Button>
                </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function SteelDeckCalculator({ onCalculated, onAddToBudget }: { onCalculated: (load: number) => void, onAddToBudget: (item: BudgetItem) => void }) {
    const [selectedDeckId, setSelectedDeckId] = React.useState<string>(steelDeckData[0].nome);
    const [concreteThickness, setConcreteThickness] = React.useState<string>("10");
    const [extraLoad, setExtraLoad] = React.useState<string>("250");
    const [totalLoad, setTotalLoad] = React.useState<number>(0);
    const { toast } = useToast();

    // Budget fields
    const [quantity, setQuantity] = React.useState("1");
    const [pricePerKg, setPricePerKg] = React.useState("7.80"); // Galvanized steel price

    const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
        const sanitizedValue = value.replace(/[^0-9,.]/g, '').replace('.', ',');
        if (/^\d*[,.]?\d*$/.test(sanitizedValue)) {
          setter(sanitizedValue);
        }
    };

    const handleCalculate = () => {
        const deck = steelDeckData.find(d => d.nome === selectedDeckId);
        if (!deck) return;

        const h_cm = parseFloat(concreteThickness.replace(',', '.')) || 0;
        const S_kgf = parseFloat(extraLoad.replace(',', '.')) || 0;
        
        if (h_cm > 0) {
            const concreteWeight = (h_cm / 100) * PESO_CONCRETO_KGF_M3;
            const finalLoad = deck.pesoProprio + concreteWeight + S_kgf;
            setTotalLoad(finalLoad);
            onCalculated(finalLoad);
            toast({
              title: "Cálculo da Laje Concluído!",
              description: `A carga total de ${finalLoad.toFixed(0)} kgf/m² foi calculada.`,
            })
        } else {
            setTotalLoad(0);
        }
    };

    const handleAddToBudget = () => {
        const deck = steelDeckData.find(d => d.nome === selectedDeckId);
        if (!deck) return;

        const qty = parseInt(quantity);
        const price = parseFloat(pricePerKg.replace(",", "."));
        
        if (isNaN(qty) || isNaN(price) || qty <= 0 || price <= 0) {
            toast({ variant: "destructive", title: "Valores Inválidos para Orçamento" });
            return;
        }

        // Assuming the deck is sold per square meter, we use its weight per m²
        const weightPerUnit = deck.pesoProprio; // weight in kg/m²
        const totalWeight = weightPerUnit * qty; // Here quantity is treated as m²
        const costPerUnit = weightPerUnit * price;
        const totalCost = totalWeight * price;

        const newItem: BudgetItem = {
            id: `${deck.nome}-${Date.now()}`,
            perfil: deck,
            quantity: qty,
            weightPerBeam: weightPerUnit,
            totalWeight,
            costPerBeam: costPerUnit,
            totalCost,
            type: 'Steel Deck',
        };

        onAddToBudget(newItem);
        toast({ title: "Item Adicionado!", description: `${qty}m² de ${deck.nome} adicionado(s) ao orçamento.` });
    };

    React.useEffect(() => {
        // Reset total load if inputs change before recalculating
        setTotalLoad(0);
    }, [selectedDeckId, concreteThickness, extraLoad]);

    const selectedDeck = steelDeckData.find(d => d.nome === selectedDeckId);

    const formatNumber = (value: number, decimals = 2) => {
        return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value);
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Calculadora de Carga de Laje Steel Deck</CardTitle>
                <CardDescription>
                    Calcule a carga total (kgf/m²) da sua laje e adicione o material ao orçamento.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label>Tipo de Steel Deck</Label>
                        <Select value={selectedDeckId} onValueChange={setSelectedDeckId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione o deck" />
                            </SelectTrigger>
                            <SelectContent>
                                {steelDeckData.map(deck => (
                                    <SelectItem key={deck.nome} value={deck.nome}>{deck.nome}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="concrete-thickness">Espessura do Concreto (cm)</Label>
                        <Input id="concrete-thickness" type="text" inputMode="decimal" value={concreteThickness} onChange={e => handleInputChange(setConcreteThickness, e.target.value)} placeholder="Ex: 10"/>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="extra-load">Sobrecarga de Utilização (kgf/m²)</Label>
                        <Input id="extra-load" type="text" inputMode="decimal" value={extraLoad} onChange={e => handleInputChange(setExtraLoad, e.target.value)} placeholder="Ex: 250"/>
                    </div>
                </div>
                 <Button onClick={handleCalculate} className="w-full md:w-auto">Calcular Carga da Laje</Button>

                {totalLoad > 0 && selectedDeck && (
                     <Card className="mt-4 bg-primary/5 border-primary/20">
                        <CardHeader>
                            <AlertTitle className="text-primary font-bold flex items-center gap-2"><CheckCircle className="h-5 w-5"/> Resultado do Cálculo</AlertTitle>
                        </CardHeader>
                         <CardContent className="space-y-4">
                            <div className="text-center py-2">
                                <p className="text-sm text-muted-foreground">Carga Total da Laje (kgf/m²)</p>
                                <p className="text-4xl font-bold text-primary">{formatNumber(totalLoad, 0)}</p>
                                <p className="text-xs text-muted-foreground mt-1">Use este valor na aba "Viga Secundária (IPE)".</p>
                            </div>
                            <Separator />
                            <div className="grid grid-cols-2 gap-4 border-t pt-4">
                               <div className="space-y-2">
                                  <Label htmlFor="deck-quantity">Quantidade (m²)</Label>
                                  <Input id="deck-quantity" type="text" inputMode="numeric" value={quantity} onChange={(e) => handleInputChange(setQuantity, e.target.value)} placeholder="Ex: 50" />
                              </div>
                               <div className="space-y-2">
                                  <Label htmlFor="deck-pricePerKg">Preço Aço Galvanizado (R$/kg)</Label>
                                  <Input id="deck-pricePerKg" type="text" inputMode="decimal" value={pricePerKg} onChange={(e) => handleInputChange(setPricePerKg, e.target.value)} placeholder="Ex: 7,80" />
                              </div>
                            </div>
                            <Button onClick={handleAddToBudget} className="w-full gap-2"><PlusCircle/> Adicionar Steel Deck ao Orçamento</Button>

                        </CardContent>
                    </Card>
                )}
            </CardContent>
        </Card>
    );
}

export default function Page() {
  const [budgetItems, setBudgetItems] = React.useState<BudgetItem[]>([]);
  const [lastSlabLoad, setLastSlabLoad] = React.useState(0);
  const { toast } = useToast();

  const handleAddToBudget = (item: BudgetItem) => {
    setBudgetItems(prev => [...prev, item]);
  };

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
      <Dashboard initialCategoryId="perfis/calculadora">
        <div className="container mx-auto p-4 space-y-4 print:p-0">
            <Tabs defaultValue="laje-deck" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="laje-deck">1. Laje Steel Deck</TabsTrigger>
                    <TabsTrigger value="viga-secundaria">2. Viga Secundária (IPE)</TabsTrigger>
                    <TabsTrigger value="viga-principal">3. Viga Principal (W)</TabsTrigger>
                </TabsList>
                <TabsContent value="laje-deck">
                    <SteelDeckCalculator onCalculated={setLastSlabLoad} onAddToBudget={handleAddToBudget} />
                </TabsContent>
                <TabsContent value="viga-secundaria">
                    <VigaSecundariaCalculator onAddToBudget={handleAddToBudget} lastSlabLoad={lastSlabLoad}/>
                </TabsContent>
                 <TabsContent value="viga-principal">
                    <VigaPrincipalCalculator onAddToBudget={handleAddToBudget} />
                </TabsContent>
            </Tabs>
            
            {budgetItems.length > 0 && (
                <Card className="print:shadow-none print:border-none">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <CardTitle className="flex items-center gap-2"><Calculator className="h-6 w-6"/> Orçamento de Perfis Estruturais</CardTitle>
                                <CardDescription>Lista de itens calculados para o projeto.</CardDescription>
                            </div>
                            <div className="flex items-center gap-1 print:hidden">
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
                                    <TableHead>Item</TableHead>
                                    <TableHead>Perfil/Descrição</TableHead>
                                    <TableHead className="text-center">Qtd.</TableHead>
                                    <TableHead className="text-center">Vão/Área</TableHead>
                                    <TableHead className="text-center">Peso/Unid. (kg)</TableHead>
                                    <TableHead className="text-center">Peso Total (kg)</TableHead>
                                    <TableHead className="text-right">Custo/Unid. (R$)</TableHead>
                                    <TableHead className="text-right">Custo Total (R$)</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {budgetItems.map(item => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">{item.type}</TableCell>
                                        <TableCell>{(item.perfil as any).nome}</TableCell>
                                        <TableCell className="text-center">{item.quantity}</TableCell>
                                        <TableCell className="text-center">{item.type === 'Steel Deck' ? `${item.quantity} m²` : `${formatNumber(item.span || 0)} m`}</TableCell>
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
      </Dashboard>
  );
}

    
