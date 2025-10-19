
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, PlusCircle, RefreshCw, Sparkles, Loader } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { perfisIpeData, tiposAco, E_ACO_MPA, BudgetItem, PerfilIpe, RESISTENCIA_CALCULO_CONECTOR_KN } from "@/lib/data/index";
import { interpretProfileSelection, InterpretProfileSelectionInput, InterpretProfileSelectionOutput } from "@/ai/flows/interpret-profile-selection";

interface VigaSecundariaCalculatorProps {
    onAddToBudget: (item: BudgetItem) => void;
    lastSlabLoad: number;
    onReactionCalculated: (reaction: number) => void;
}

interface CalculationResult {
    profile: PerfilIpe;
    requiredWx: number;
    requiredIx: number;
    ltbCheck: {
        msd: number;
        mrd: number;
        passed: boolean;
    };
    shearCheck: {
        vsd: number; // kN
        vrd: number; // kN
        passed: boolean;
    };
    connectorCount: number;
}

type BeamScheme = "biapoiada" | "balanco" | "dois-balancos";

export function VigaSecundariaCalculator({ onAddToBudget, lastSlabLoad, onReactionCalculated }: VigaSecundariaCalculatorProps) {
  const [span, setSpan] = React.useState("4");
  const [balanco1, setBalanco1] = React.useState("1");
  const [balanco2, setBalanco2] = React.useState("1");
  const [spacing, setSpacing] = React.useState("1.5");
  const [slabLoad, setSlabLoad] = React.useState("450");
  const [distributedLoad, setDistributedLoad] = React.useState("");
  const [pointLoad, setPointLoad] = React.useState("");
  const [pointLoadPosition, setPointLoadPosition] = React.useState("");
  const [steelType, setSteelType] = React.useState(tiposAco[0].nome);
  const [beamScheme, setBeamScheme] = React.useState<BeamScheme>("biapoiada");
  const [quantity, setQuantity] = React.useState("1");
  const [pricePerKg, setPricePerKg] = React.useState("8.50");

  const [recommendedProfile, setRecommendedProfile] = React.useState<CalculationResult | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [reaction, setReaction] = React.useState(0);
  const { toast } = useToast();

  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [analysisResult, setAnalysisResult] = React.useState<InterpretProfileSelectionOutput | null>(null);
  
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
    const L1_m = parseFloat(balanco1.replace(",", "."));
    const L2_m = parseFloat(balanco2.replace(",", "."));
    const q_kgf_m = parseFloat(distributedLoad.replace(",", ".")) || 0;
    const P_kgf = parseFloat(pointLoad.replace(",", ".")) || 0;
    let a_m = parseFloat(pointLoadPosition.replace(",", ".")) || 0;
    
    setError(null);
    setRecommendedProfile(null);
    setReaction(0);
    setAnalysisResult(null);

    const checkNaN = (...vals: number[]) => vals.some(v => isNaN(v));

    if (checkNaN(L_m) || (beamScheme === 'balanco' && checkNaN(L1_m)) || (beamScheme === 'dois-balancos' && checkNaN(L1_m, L2_m))) {
        setError("Por favor, insira valores válidos para todos os vãos e balanços.");
        return;
    }

    if (q_kgf_m === 0 && P_kgf === 0) {
        setError("Insira um valor para a carga distribuída ou para a carga pontual.");
        return;
    }
     if (P_kgf > 0 && (a_m < 0 || a_m > L_m)) {
        setError("A posição da carga pontual deve ser um valor entre 0 e o comprimento do vão central.");
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
    const P_kN = P_kgf * 0.009807;
    const E_kN_cm2 = E_ACO_MPA / 10;
    const q_kN_cm = q_kN_m / 100;
    const L_cm = L_m * 100;

    let Msd_kNm = 0, Ix_req_dist = 0, Ix_req_pont = 0, Vsd_kN = 0;

    if (beamScheme === "biapoiada") {
        Msd_kNm = (q_kN_m * L_m * L_m) / 8 + (P_kN * a_m * (L_m - a_m)) / L_m;
        Ix_req_dist = (5 * q_kN_cm * Math.pow(L_cm, 4)) / (384 * E_kN_cm2 * (L_cm / 360));
        const b_cm = L_cm - (a_m * 100);
        Ix_req_pont = (P_kN * (a_m*100) * b_cm * (L_cm + b_cm) * Math.sqrt(3 * (a_m*100) * (L_cm + b_cm))) / (27 * E_kN_cm2 * L_cm * (L_cm / 360));
        Vsd_kN = (q_kN_m * L_m) / 2 + Math.max((P_kN * (L_m - a_m)) / L_m, (P_kN * a_m) / L_m);
    } else if (beamScheme === "balanco") {
        // Assume pontual no vão central apenas
        const M_neg = (q_kN_m * L1_m * L1_m) / 2;
        const M_pos_dist = (q_kN_m * L_m * L_m) / 8 - M_neg / 2;
        const M_pos_pont = (P_kN * a_m * (L_m - a_m)) / L_m; // Simplificado - aproximação boa
        Msd_kNm = Math.max(M_neg, M_pos_dist + M_pos_pont);
        const R2 = q_kN_m * (L_m/2 + L1_m) + (q_kN_m*L1_m*L1_m)/(2*L_m) + (P_kN*a_m)/L_m;
        Vsd_kN = R2; 
        Ix_req_dist = (q_kN_cm * Math.pow(L_cm, 4)) / (185 * E_kN_cm2 * (L_cm / 360)); // Simplificação
    } else if (beamScheme === "dois-balancos") {
        const M_neg1 = (q_kN_m * L1_m * L1_m) / 2;
        const M_neg2 = (q_kN_m * L2_m * L2_m) / 2;
        const M_pos_dist = (q_kN_m * L_m * L_m) / 8 - (M_neg1 + M_neg2) / 2;
        const M_pos_pont = (P_kN * a_m * (L_m - a_m)) / L_m; // Simplificado
        Msd_kNm = Math.max(M_neg1, M_neg2, M_pos_dist + M_pos_pont);
        const R1 = (q_kN_m * L_m / 2) + (M_neg1 - M_neg2) / L_m + (P_kN * (L_m - a_m))/L_m;
        const R2 = (q_kN_m * L_m / 2) - (M_neg1 - M_neg2) / L_m + (P_kN*a_m)/L_m;
        Vsd_kN = Math.max(R1 + q_kN_m*L1_m, R2 + q_kN_m*L2_m);
        Ix_req_dist = (5 * q_kN_cm * Math.pow(L_cm, 4)) / (384 * E_kN_cm2 * (L_cm / 360)) - ( (M_neg1 + M_neg2)/2 * Math.pow(L_cm,2) ) / (16*E_kN_cm2); // Aprox
    }

    const requiredIx_cm4 = Ix_req_dist + Ix_req_pont;
    const requiredWx_cm3 = (Msd_kNm * 100) / fy_kN_cm2;
    const reaction_kgf = Vsd_kN / 0.009807;

    const suitableProfiles = perfisIpeData
        .filter(p => p.Wx >= requiredWx_cm3 && p.Ix >= requiredIx_cm4)
        .sort((a, b) => a.peso - b.peso);
    
    let finalProfile: CalculationResult | null = null;
    for (const profile of suitableProfiles) {
        const Cb = 1.0; 
        const Mp_kNcm = profile.Wx * fy_kN_cm2;
        const Mrd_kNcm = Cb * Mp_kNcm;
        const ltbPassed = Mrd_kNcm >= Msd_kNm * 100;
        
        const Aw_cm2 = (profile.h / 10) * (profile.tw / 10);
        const Vrd_kN = (0.6 * fy_kN_cm2 * Aw_cm2);
        const shearPassed = Vrd_kN >= Vsd_kN;

        if (ltbPassed && shearPassed) {
            const Ac_cm2 = (parseFloat(spacing.replace(',', '.')) * 100) * (profile.tf / 10);
            const Fcc_kN = 0.85 * 2.5 * Ac_cm2;
            const Fst_kN = profile.area * fy_kN_cm2;
            const Vh_kN = Math.min(Fcc_kN, Fst_kN);
            const numConnectors = Math.ceil(Vh_kN / RESISTENCIA_CALCULO_CONECTOR_KN);

             finalProfile = { profile, requiredWx: requiredWx_cm3, requiredIx: requiredIx_cm4, ltbCheck: { msd: Msd_kNm, mrd: Mrd_kNcm / 100, passed: ltbPassed }, shearCheck: { vsd: Vsd_kN, vrd: Vrd_kN, passed: shearPassed }, connectorCount: numConnectors };
            break;
        }
    }

    if (!finalProfile) {
      setError("Nenhum perfil IPE atende a todos os requisitos. A carga, vão ou espaçamento podem ser muito grandes.");
      return;
    }
    
    setReaction(reaction_kgf);
    onReactionCalculated(reaction_kgf);
    setRecommendedProfile(finalProfile);
    toast({ title: "Cálculo de Viga Secundária Concluído", description: `O perfil recomendado é ${finalProfile.profile.nome}.` });
  };

  const handleAnalyze = async () => {
    if (!recommendedProfile) {
        toast({ variant: "destructive", title: "Cálculo necessário", description: "Calcule o perfil antes de analisar."});
        return;
    }
    const L_central_m = parseFloat(span.replace(",", "."));
    const q_dist_kgf_m = parseFloat(distributedLoad.replace(",", "."));
    const P_kgf = parseFloat(pointLoad.replace(",", ".")) || undefined;
    const a_m = parseFloat(pointLoadPosition.replace(",", ".")) || undefined;
    const selectedSteel = tiposAco.find(s => s.nome === steelType);

    if (!selectedSteel || isNaN(L_central_m) || isNaN(q_dist_kgf_m)) return;

    setIsAnalyzing(true);
    setAnalysisResult(null);
    try {
        const aiInput: InterpretProfileSelectionInput = {
            span: L_central_m,
            load: q_dist_kgf_m,
            pointLoad: P_kgf,
            pointLoadPosition: a_m,
            beamScheme: beamScheme,
            steelType: selectedSteel.nome,
            recommendedProfile: {
                nome: recommendedProfile.profile.nome,
                peso: recommendedProfile.profile.peso,
                Wx: recommendedProfile.profile.Wx,
                Ix: recommendedProfile.profile.Ix,
            },
            requiredWx: recommendedProfile.requiredWx,
            requiredIx: recommendedProfile.requiredIx,
            shearCheck: {
                vsd: recommendedProfile.shearCheck.vsd,
                vrd: recommendedProfile.shearCheck.vrd,
            },
            connectorCount: recommendedProfile.connectorCount
        };
        const analysis = await interpretProfileSelection(aiInput);
        setAnalysisResult(analysis);
    } catch (e) {
        console.error("AI analysis failed:", e);
        setAnalysisResult({ analysis: "A análise da IA não pôde ser concluída no momento." });
    } finally {
        setIsAnalyzing(false);
    }
  };
  
  const handleAddToBudget = () => {
    if (!recommendedProfile) {
        toast({ variant: "destructive", title: "Nenhum Perfil Calculado" });
        return;
    }
    const L_central_m = parseFloat(span.replace(",", "."));
    const L_balanco1_m = parseFloat(balanco1.replace(",", "."));
    const L_balanco2_m = parseFloat(balanco2.replace(",", "."));
    const qty = parseInt(quantity);
    const price = parseFloat(pricePerKg.replace(",", "."));

    let totalLengthForBudget = 0;
    if (beamScheme === 'biapoiada') totalLengthForBudget = L_central_m;
    if (beamScheme === 'balanco') totalLengthForBudget = L_central_m + L_balanco1_m;
    if (beamScheme === 'dois-balancos') totalLengthForBudget = L_central_m + L_balanco1_m + L_balanco2_m;

    if (isNaN(totalLengthForBudget) || isNaN(qty) || isNaN(price) || totalLengthForBudget <= 0 || qty <= 0 || price <= 0) {
        toast({ variant: "destructive", title: "Valores Inválidos" });
        return;
    }

    const weightPerUnit = recommendedProfile.profile.peso * totalLengthForBudget;
    const totalWeight = weightPerUnit * qty;
    const costPerUnit = weightPerUnit * price;
    const totalCost = totalWeight * price;

    const newItem: BudgetItem = { id: `${recommendedProfile.profile.nome}-${Date.now()}`, perfil: recommendedProfile.profile, span: totalLengthForBudget, quantity: qty, weightPerUnit, totalWeight, costPerUnit, totalCost, type: 'Viga Secundária' };

    onAddToBudget(newItem);
    setRecommendedProfile(null);
    setReaction(0);
    setAnalysisResult(null);
    toast({ title: "Item Adicionado!", description: `${qty}x viga(s) ${recommendedProfile.profile.nome} adicionada(s).`})
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
            
            {beamScheme === 'biapoiada' ? (
                <div className="space-y-2">
                  <Label htmlFor="vs-span">Vão / Comprimento (m)</Label>
                  <Input id="vs-span" type="text" inputMode="decimal" value={span} onChange={(e) => handleInputChange(setSpan, e.target.value)} placeholder="Ex: 4,0" />
                </div>
            ) : beamScheme === 'balanco' ? (
                 <>
                    <div className="space-y-2">
                        <Label htmlFor="vs-span-balanco">Vão Central (m)</Label>
                        <Input id="vs-span-balanco" type="text" inputMode="decimal" value={span} onChange={(e) => handleInputChange(setSpan, e.target.value)} placeholder="Ex: 4,0"/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="vs-balanco1-single">Balanço (m)</Label>
                        <Input id="vs-balanco1-single" type="text" inputMode="decimal" value={balanco1} onChange={(e) => handleInputChange(setBalanco1, e.target.value)} placeholder="Ex: 1,0"/>
                    </div>
                 </>
            ) : (
                <>
                    <div className="space-y-2">
                        <Label htmlFor="vs-balanco1">Balanço 1 (m)</Label>
                        <Input id="vs-balanco1" type="text" inputMode="decimal" value={balanco1} onChange={(e) => handleInputChange(setBalanco1, e.target.value)} placeholder="Ex: 1,0"/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="vs-span-central">Vão Central (m)</Label>
                        <Input id="vs-span-central" type="text" inputMode="decimal" value={span} onChange={(e) => handleInputChange(setSpan, e.target.value)} placeholder="Ex: 4,0"/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="vs-balanco2">Balanço 2 (m)</Label>
                        <Input id="vs-balanco2" type="text" inputMode="decimal" value={balanco2} onChange={(e) => handleInputChange(setBalanco2, e.target.value)} placeholder="Ex: 1,0"/>
                    </div>
                </>
            )}


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
              <Label htmlFor="vs-load">Carga Distribuída (kgf/m)</Label>
              <Input id="vs-load" type="text" inputMode="decimal" value={distributedLoad} onChange={(e) => handleInputChange(setDistributedLoad, e.target.value)} placeholder="Carga linear" />
            </div>
             <div className="space-y-2">
                <Label htmlFor="vs-point-load">Carga Pontual (kgf)</Label>
                <Input id="vs-point-load" type="text" inputMode="decimal" value={pointLoad} onChange={e => handleInputChange(setPointLoad, e.target.value)} placeholder="Opcional" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="vs-point-load-pos">Posição da Carga (m)</Label>
                <Input id="vs-point-load-pos" type="text" inputMode="decimal" value={pointLoadPosition} onChange={e => handleInputChange(setPointLoadPosition, e.target.value)} placeholder="Dist. do apoio esquerdo" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="vs-beam-scheme">Esquema da Viga</Label>
                <Select value={beamScheme} onValueChange={(value) => setBeamScheme(value as BeamScheme)}>
                    <SelectTrigger id="vs-beam-scheme">
                        <SelectValue placeholder="Selecione o esquema" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="biapoiada">Viga Bi-apoiada</SelectItem>
                        <SelectItem value="balanco">Viga com Balanço</SelectItem>
                        <SelectItem value="dois-balancos">Viga com Dois Balanços</SelectItem>
                    </SelectContent>
                </Select>
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
          <Button type="button" onClick={handleCalculate} className="w-full md:w-auto">
            Calcular Viga Secundária
          </Button>

          {error && <Alert variant="destructive"><AlertTitle>Erro</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}

          {recommendedProfile && (
             <Card className="mt-4 bg-primary/5 border-primary/20">
                <CardHeader>
                    <AlertTitle className="text-primary font-bold flex items-center gap-2"><CheckCircle className="h-5 w-5"/> Perfil IPE Recomendado</AlertTitle>
                    <AlertDescription className="space-y-2 pt-2">
                         <div className="text-2xl font-bold text-center py-2 text-primary">{recommendedProfile.profile.nome}</div>
                         <div className="grid grid-cols-2 gap-2 text-center text-sm border-t pt-2">
                            <div>
                                <p className="text-muted-foreground">Cortante (kN)</p>
                                <p className={`font-semibold ${recommendedProfile.shearCheck.passed ? 'text-green-600' : 'text-destructive'}`}>
                                    {`Vsd: ${recommendedProfile.shearCheck.vsd.toFixed(1)} ≤ Vrd: ${recommendedProfile.shearCheck.vrd.toFixed(1)}`}
                                </p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Momento Fletor (kNm)</p>
                                <p className={`font-semibold ${recommendedProfile.ltbCheck.passed ? 'text-green-600' : 'text-destructive'}`}>
                                    {`Msd: ${recommendedProfile.ltbCheck.msd.toFixed(1)} ≤ Mrd: ${recommendedProfile.ltbCheck.mrd.toFixed(1)}`}
                                </p>
                            </div>
                        </div>
                    </AlertDescription>
                </CardHeader>
                 <CardContent className="space-y-4">
                      <div className="rounded-lg border bg-background p-2">
                        <p className="text-sm font-medium text-center text-muted-foreground">Conectores de Cisalhamento (Stud Bolts 19mm)</p>
                        <p className="text-xl font-bold text-center text-primary">{recommendedProfile.connectorCount} unidades</p>
                        <p className="text-xs text-center text-muted-foreground">({(recommendedProfile.connectorCount / (beamScheme === 'biapoiada' ? parseFloat(span.replace(',', '.')) : parseFloat(span.replace(',', '.')) + parseFloat(balanco1.replace(',', '.')) + (beamScheme === 'dois-balancos' ? parseFloat(balanco2.replace(',', '.')) : 0))).toFixed(1)} un/m)</p>
                      </div>
                      <Button type="button" onClick={handleAnalyze} className="w-full" disabled={isAnalyzing}>
                         {isAnalyzing ? <><Loader className="animate-spin mr-2"/> Analisando...</> : <><Sparkles className="mr-2"/> Analisar com IA</>}
                      </Button>
                     {isAnalyzing && (
                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground p-4">
                           <Loader className="animate-spin h-4 w-4" />
                           IA está analisando o resultado...
                        </div>
                     )}
                     {analysisResult && (
                        <Alert variant="default">
                           <Sparkles className="h-4 w-4" />
                           <AlertTitle className="font-semibold">Análise da IA</AlertTitle>
                           <AlertDescription>
                               {analysisResult.analysis}
                           </AlertDescription>
                        </Alert>
                     )}
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
                        <div className="text-sm text-center text-muted-foreground">Reação de apoio máxima: <span className="font-bold text-foreground">{reaction.toFixed(0)} kgf</span></div>
                    )}
                    <Button type="button" onClick={handleAddToBudget} className="w-full gap-2"><PlusCircle/> Adicionar ao Orçamento</Button>
                </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
