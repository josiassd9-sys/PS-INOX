
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, PlusCircle, Sparkles, Loader } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { perfisData, tiposAco, E_ACO_MPA, BudgetItem, Perfil } from "@/lib/data/index";
import { interpretProfileSelection, InterpretProfileSelectionInput, InterpretProfileSelectionOutput } from "@/ai/flows/interpret-profile-selection";

interface VigaPrincipalCalculatorProps {
    onAddToBudget: (item: BudgetItem) => void;
    onReactionCalculated: (reaction: number) => void;
}

interface CalculationResult {
    profile: Perfil;
    requiredWx: number;
    requiredIx: number;
    ltbCheck: {
        msd: number;
        mrd: number;
        passed: boolean;
    };
}

type BeamScheme = "biapoiada" | "balanco" | "dois-balancos";

export function VigaPrincipalCalculator({ onAddToBudget, onReactionCalculated }: VigaPrincipalCalculatorProps) {
  const [span, setSpan] = React.useState("5");
  const [balanco1, setBalanco1] = React.useState("1.5");
  const [balanco2, setBalanco2] = React.useState("1.5");
  const [load, setLoad] = React.useState("300");
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

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
    const sanitizedValue = value.replace(/[^0-9,.]/g, '').replace('.', ',');
    if (/^\d*[,.]?\d*$/.test(sanitizedValue)) {
      setter(sanitizedValue);
    }
  };

  const handleCalculate = () => {
    const L_m = parseFloat(span.replace(",", "."));
    const q_kgf_m = parseFloat(load.replace(",", ".")) || 0;
    const P_kgf = parseFloat(pointLoad.replace(",", ".")) || 0;
    const a_m = parseFloat(pointLoadPosition.replace(",", ".")) || 0;

    setError(null);
    setRecommendedProfile(null);
    setReaction(0);
    setAnalysisResult(null);

    if (isNaN(L_m) || L_m <= 0) {
      setError("Por favor, insira um valor válido e positivo para o vão.");
      return;
    }
    if (q_kgf_m === 0 && P_kgf === 0) {
        setError("Insira um valor para a carga distribuída ou para a carga pontual.");
        return;
    }
    if (P_kgf > 0 && (isNaN(a_m) || a_m < 0 || a_m > L_m)) {
        setError("A posição da carga pontual deve ser um valor entre 0 e o comprimento do vão.");
        return;
    }

    const selectedSteel = tiposAco.find(s => s.nome === steelType);
    if (!selectedSteel) {
        setError("Tipo de aço inválido selecionado.");
        return;
    }

    // --- Conversões ---
    const fy_MPa = selectedSteel.fy;
    const fy_kN_cm2 = fy_MPa / 10;
    const q_kN_m = q_kgf_m * 0.009807;
    const P_kN = P_kgf * 0.009807;
    const E_kN_cm2 = E_ACO_MPA / 10;
    
    // --- Lógica de Cálculo (Apenas para viga bi-apoiada por enquanto) ---
    if (beamScheme !== "biapoiada") {
        setError("Cálculo de carga pontual ainda não implementado para vigas com balanço. Selecione 'Viga Bi-apoiada'.");
        return;
    }

    const L_cm = L_m * 100;
    const a_cm = a_m * 100;
    const b_cm = L_cm - a_cm;
    const q_kN_cm = q_kN_m / 100;

    // --- Momento Fletor Máximo (Msd) ---
    const M_dist_kNm = (q_kN_m * L_m * L_m) / 8;
    const M_pont_kNm = (P_kN * a_m * b_cm) / L_m / 100; 
    const Msd_kNm = M_dist_kNm + M_pont_kNm;
    const Msd_kNcm = Msd_kNm * 100;
    
    // --- Deformação (Flecha) / Ix Mínimo ---
    const allowedDeflection_cm = L_cm / 360;
    const Ix_dist_req = (5 * q_kN_cm * Math.pow(L_cm, 4)) / (384 * E_kN_cm2 * allowedDeflection_cm);
    const Ix_pont_req = (P_kN * a_cm * b_cm * (L_cm + b_cm) * Math.sqrt(3 * a_cm * (L_cm + b_cm))) / (27 * E_kN_cm2 * L_cm * allowedDeflection_cm);
    const requiredIx_cm4 = Ix_dist_req + Ix_pont_req;

    // --- Esforço Cortante / Reação nos Apoios ---
    const R_dist_kN = (q_kN_m * L_m) / 2;
    const R_pont_a_kN = (P_kN * b_cm) / L_cm;
    const R_pont_b_kN = (P_kN * a_cm) / L_cm;
    const R_max_kN = R_dist_kN + Math.max(R_pont_a_kN, R_pont_b_kN);
    const reaction_kgf = R_max_kN / 0.009807;

    const requiredWx_cm3 = Msd_kNcm / fy_kN_cm2;

    const suitableProfiles = perfisData
        .filter(p => p.Wx >= requiredWx_cm3 && p.Ix >= requiredIx_cm4)
        .sort((a,b) => a.peso - b.peso);
    
    if (suitableProfiles.length === 0) {
      setError("Nenhum perfil na tabela atende aos requisitos de resistência e/ou deformação. A carga ou o vão podem ser muito grandes para este esquema.");
      return;
    }
    
    let finalProfile: CalculationResult | null = null;
    for (const profile of suitableProfiles) {
        const Cb = 1.0;
        const Mp_kNcm = profile.Wx * fy_kN_cm2;
        const Mrd_kNcm = Cb * Mp_kNcm;
        const ltbPassed = Mrd_kNcm >= Msd_kNcm;
        
        if (ltbPassed) {
             finalProfile = {
                profile: profile,
                requiredIx: requiredIx_cm4,
                requiredWx: requiredWx_cm3,
                ltbCheck: {
                    msd: Msd_kNm,
                    mrd: Mrd_kNcm / 100,
                    passed: ltbPassed,
                }
            };
            break;
        }
    }

    if (!finalProfile) {
      setError("Nenhum perfil passou na verificação de Flambagem Lateral-Torcional (FLT). Considere um vão menor ou travamentos laterais.");
      return;
    }
    
    setReaction(reaction_kgf);
    onReactionCalculated(reaction_kgf);

    setRecommendedProfile(finalProfile);
    toast({
        title: "Cálculo Concluído",
        description: `O perfil recomendado é ${finalProfile.profile.nome}.`,
    });
  };

  const handleAnalyze = async () => {
    if (!recommendedProfile) {
        toast({ variant: "destructive", title: "Cálculo necessário", description: "Calcule o perfil antes de analisar."});
        return;
    }
    const L_central_m = parseFloat(span.replace(",", "."));
    const q_kgf_m = parseFloat(load.replace(",", "."));
    const selectedSteel = tiposAco.find(s => s.nome === steelType);

    if (!selectedSteel || isNaN(L_central_m) || isNaN(q_kgf_m)) return;

    setIsAnalyzing(true);
    setAnalysisResult(null);
    try {
        const aiInput: InterpretProfileSelectionInput = {
            span: L_central_m,
            load: q_kgf_m,
            steelType: selectedSteel.nome,
            recommendedProfile: {
                nome: recommendedProfile.profile.nome,
                peso: recommendedProfile.profile.peso,
                Wx: recommendedProfile.profile.Wx,
                Ix: recommendedProfile.profile.Ix,
            },
            requiredWx: recommendedProfile.requiredWx,
            requiredIx: recommendedProfile.requiredIx,
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
        toast({
            variant: "destructive",
            title: "Nenhum Perfil Calculado",
            description: "Primeiro, calcule um perfil recomendado.",
        });
        return;
    }

    const L_central_m = parseFloat(span.replace(",", "."));
    const L_balanco1_m = parseFloat(balanco1.replace(",", "."));
    const L_balanco2_m = parseFloat(balanco2.replace(",", "."));
    const qty = parseInt(quantity);
    const price = parseFloat(pricePerKg.replace(",", "."));

    let totalLengthForBudget = 0;
    if (beamScheme === 'biapoiada' || beamScheme === 'balanco') totalLengthForBudget = L_central_m;
    if (beamScheme === 'dois-balancos') totalLengthForBudget = L_central_m + L_balanco1_m + L_balanco2_m;

    if (isNaN(totalLengthForBudget) || isNaN(qty) || isNaN(price) || totalLengthForBudget <= 0 || qty <= 0 || price <= 0) {
        toast({
            variant: "destructive",
            title: "Valores Inválidos",
            description: "Verifique os vãos, quantidade e preço antes de adicionar.",
        });
        return;
    }

    const weightPerUnit = recommendedProfile.profile.peso * totalLengthForBudget;
    const totalWeight = weightPerUnit * qty;
    const costPerUnit = weightPerUnit * price;
    const totalCost = totalWeight * price;

    const newItem: BudgetItem = {
        id: `${recommendedProfile.profile.nome}-${Date.now()}`,
        perfil: recommendedProfile.profile,
        span: totalLengthForBudget,
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
    setAnalysisResult(null);
    toast({
        title: "Item Adicionado!",
        description: `${qty}x viga(s) ${recommendedProfile.profile.nome} adicionada(s) ao orçamento.`,
    })
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Calculadora de Viga Principal (Perfil W)</CardTitle>
          <CardDescription>
            Pré-dimensione o perfil W (considerando resistência, deformação e flambagem) e adicione-o à lista para montar seu orçamento.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

            {beamScheme === 'biapoiada' || beamScheme === 'balanco' ? (
                 <div className="space-y-2">
                    <Label htmlFor="span">Vão / Comprimento (m)</Label>
                    <Input id="span" type="text" inputMode="decimal" value={span} onChange={(e) => handleInputChange(setSpan, e.target.value)} placeholder="Ex: 5,0" />
                 </div>
            ) : (
                <>
                    <div className="space-y-2">
                        <Label htmlFor="vp-balanco1">Balanço 1 (m)</Label>
                        <Input id="vp-balanco1" type="text" inputMode="decimal" value={balanco1} onChange={(e) => handleInputChange(setBalanco1, e.target.value)} placeholder="Ex: 1,5"/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="vp-span-central">Vão Central (m)</Label>
                        <Input id="vp-span-central" type="text" inputMode="decimal" value={span} onChange={(e) => handleInputChange(setSpan, e.target.value)} placeholder="Ex: 5,0"/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="vp-balanco2">Balanço 2 (m)</Label>
                        <Input id="vp-balanco2" type="text" inputMode="decimal" value={balanco2} onChange={(e) => handleInputChange(setBalanco2, e.target.value)} placeholder="Ex: 1,5"/>
                    </div>
                </>
            )}

            <div className="space-y-2">
              <Label htmlFor="load">Carga Distribuída (kgf/m)</Label>
              <Input id="load" type="text" inputMode="decimal" value={load} onChange={(e) => handleInputChange(setLoad, e.target.value)} placeholder="Ex: 300" />
            </div>
             <div className="space-y-2">
                <Label htmlFor="vp-point-load">Carga Pontual (kgf)</Label>
                <Input id="vp-point-load" type="text" inputMode="decimal" value={pointLoad} onChange={e => handleInputChange(setPointLoad, e.target.value)} placeholder="Ex: 1000" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="vp-point-load-pos">Posição da Carga (m)</Label>
                <Input id="vp-point-load-pos" type="text" inputMode="decimal" value={pointLoadPosition} onChange={e => handleInputChange(setPointLoadPosition, e.target.value)} placeholder="Dist. do apoio esquerdo" />
            </div>
             <div className="space-y-2">
                <Label htmlFor="beam-scheme">Esquema da Viga</Label>
                <Select value={beamScheme} onValueChange={(value) => setBeamScheme(value as BeamScheme)}>
                    <SelectTrigger id="beam-scheme">
                        <SelectValue placeholder="Selecione o esquema" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="biapoiada">Viga Bi-apoiada</SelectItem>
                        <SelectItem value="balanco" disabled>Viga com Balanço (em breve)</SelectItem>
                        <SelectItem value="dois-balancos" disabled>Viga com Dois Balanços (em breve)</SelectItem>
                    </SelectContent>
                </Select>
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
          <Button type="button" onClick={handleCalculate} className="w-full md:w-auto">
            Calcular Perfil
          </Button>

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
                        <div className="text-2xl font-bold text-center py-2 text-primary">{recommendedProfile.profile.nome}</div>
                         <div className="grid grid-cols-2 gap-2 text-center text-sm border-t pt-2">
                             <div>
                                <p className="text-muted-foreground">Verificação FLT (kNm)</p>
                                <p className="font-semibold">{`Msd: ${recommendedProfile.ltbCheck.msd.toFixed(1)} ≤ Mrd: ${recommendedProfile.ltbCheck.mrd.toFixed(1)}`}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Status FLT</p>
                                <p className="font-semibold text-green-600">{recommendedProfile.ltbCheck.passed ? 'Aprovado' : 'Reprovado'}</p>
                            </div>
                        </div>
                    </AlertDescription>
                </CardHeader>
                 <CardContent className="space-y-4">
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
                    <Button type="button" onClick={handleAddToBudget} className="w-full gap-2"><PlusCircle/> Adicionar ao Orçamento</Button>
                </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
