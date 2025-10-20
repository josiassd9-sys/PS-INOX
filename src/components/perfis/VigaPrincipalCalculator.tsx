
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
import { BeamSchemeDiagram } from "./BeamSchemeDiagram";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { useCalculator } from "@/app/perfis/calculadora/CalculatorContext";

interface CalculationResult {
    profile: Perfil;
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
    optimizationData: { name: string; utilization: number }[];
}

interface AnalysisResult {
  analysis: string;
}

type BeamScheme = "biapoiada" | "balanco" | "dois-balancos";

function getLocalAnalysis(result: CalculationResult): AnalysisResult {
    const { profile, optimizationData, shearCheck } = result;

    const flexao = optimizationData.find(d => d.name === 'Flexão (Wx)')?.utilization || 0;
    const deformacao = optimizationData.find(d => d.name === 'Deform. (Ix)')?.utilization || 0;
    const cortante = optimizationData.find(d => d.name === 'Cortante')?.utilization || 0;

    let analysisText = `O perfil ${profile.nome} foi selecionado por ser a opção mais leve que atendeu a todos os critérios de segurança e serviço.\n\n`;
    analysisText += `Análise de Otimização:\n`;
    analysisText += `- Resistência à Flexão: O perfil está com ${flexao.toFixed(1)}% de sua capacidade utilizada.\n`;
    analysisText += `- Limite de Deformação: O perfil está com ${deformacao.toFixed(1)}% de sua capacidade utilizada.\n`;
    analysisText += `- Esforço Cortante: A viga utiliza ${cortante.toFixed(1)}% de sua resistência ao cisalhamento.\n\n`;

    if (flexao > 95 || deformacao > 95 || cortante > 95) {
        analysisText += "AVISO: O perfil está trabalhando muito próximo do seu limite. Considere revisar as cargas ou o esquema estrutural.\n\n";
    } else if (flexao < 60 && deformacao < 60) {
        analysisText += "INSIGHT: O dimensionamento parece conservador. Há potencial para otimizar e utilizar um perfil mais leve, reduzindo custos.\n\n";
    } else {
        analysisText += "CONCLUSÃO: O dimensionamento aparenta estar seguro e bem otimizado.\n\n";
    }

    return { analysis: analysisText };
}


export function VigaPrincipalCalculator() {
  const { onAddToBudget, onVigaPrincipalReactionCalculated, supportReactions } = useCalculator();
  const [span, setSpan] = React.useState("5");
  const [balanco1, setBalanco1] = React.useState("1.5");
  const [balanco2, setBalanco2] = React.useState("1.5");
  const [distributedLoad, setDistributedLoad] = React.useState("");
  const [pointLoad, setPointLoad] = React.useState("");
  const [pointLoadPosition, setPointLoadPosition] = React.useState("2.5");
  const [steelType, setSteelType] = React.useState(tiposAco[0].nome);
  const [beamScheme, setBeamScheme] = React.useState<BeamScheme>("biapoiada");
  const [quantity, setQuantity] = React.useState("1");
  const [pricePerKg, setPricePerKg] = React.useState("8.50");
  
  const [recommendedProfile, setRecommendedProfile] = React.useState<CalculationResult | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const { toast } = useToast();

  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [analysisResult, setAnalysisResult] = React.useState<AnalysisResult | null>(null);

  React.useEffect(() => {
    if (supportReactions.vigaSecundaria > 0) {
      setPointLoad(supportReactions.vigaSecundaria.toFixed(0));
    }
  }, [supportReactions.vigaSecundaria]);


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
    onVigaPrincipalReactionCalculated(0);
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
        const M_neg = (q_kN_m * L1_m * L1_m) / 2;
        const M_pos_max_span = (q_kN_m * L_m * L_m) / 8 - M_neg / 2;
        Msd_kNm = Math.max(M_neg, M_pos_max_span);
        Vsd_kN = q_kN_m * L_m / 2 + (q_kN_m * L1_m * L1_m) / (2 * L_m) + q_kN_m * L1_m;
        Ix_req_dist = (q_kN_cm * Math.pow(L_cm, 4)) / (185 * E_kN_cm2 * (L_cm / 360));
    } else if (beamScheme === "dois-balancos") {
        const M_neg1 = (q_kN_m * L1_m * L1_m) / 2;
        const M_neg2 = (q_kN_m * L2_m * L2_m) / 2;
        const M_pos_max_span = (q_kN_m * L_m * L_m) / 8 - (M_neg1 + M_neg2) / 2;
        Msd_kNm = Math.max(M_neg1, M_neg2, M_pos_max_span);
        const R1 = (q_kN_m * L_m / 2) + (M_neg1 - M_neg2) / L_m;
        const R2 = (q_kN_m * L_m / 2) - (M_neg1 - M_neg2) / L_m;
        Vsd_kN = Math.max(R1 + q_kN_m*L1_m, R2 + q_kN_m*L2_m);
        Ix_req_dist = (5 * q_kN_cm * Math.pow(L_cm, 4)) / (384 * E_kN_cm2 * (L_cm / 360)) - ( (M_neg1 + M_neg2)/2 * Math.pow(L_cm,2) ) / (16*E_kN_cm2);
    }

    const requiredIx_cm4 = Ix_req_dist + Ix_req_pont;
    const requiredWx_cm3 = (Msd_kNm * 100) / fy_kN_cm2;
    const reaction_kgf = Vsd_kN / 0.009807;

    const suitableProfiles = perfisData
        .filter(p => p.Wx >= requiredWx_cm3 && p.Ix >= requiredIx_cm4)
        .sort((a,b) => a.peso - b.peso);
    
    let finalProfile: CalculationResult | null = null;
    for (const profile of suitableProfiles) {
        const Cb = 1.0;
        const Mp_kNcm = profile.Wx * fy_kN_cm2;
        const Mrd_kNcm = Cb * Mp_kNcm;
        const ltbPassed = Mrd_kNcm >= Msd_kNm * 100;

        const Aw_cm2 = profile.d / 10 * profile.tw / 10;
        const Vrd_kN = (0.6 * fy_kN_cm2 * Aw_cm2);
        const shearPassed = Vrd_kN >= Vsd_kN;
        
        if (ltbPassed && shearPassed) {
            const optimizationData = [
                { name: 'Flexão (Wx)', utilization: Math.min(100, (requiredWx_cm3 / profile.Wx) * 100) },
                { name: 'Deform. (Ix)', utilization: Math.min(100, (requiredIx_cm4 / profile.Ix) * 100) },
                { name: 'Cortante', utilization: Math.min(100, (Vsd_kN / Vrd_kN) * 100) },
            ];
             finalProfile = { profile, requiredIx: requiredIx_cm4, requiredWx: requiredWx_cm3, ltbCheck: { msd: Msd_kNm, mrd: Mrd_kNcm / 100, passed: ltbPassed }, shearCheck: { vsd: Vsd_kN, vrd: Vrd_kN, passed: shearPassed }, optimizationData };
            break;
        }
    }

    if (!finalProfile) {
      setError("Nenhum perfil W atende a todos os requisitos (Flexão, Deformação, FLT, Cortante). Tente uma carga menor, vão menor ou um esquema de viga diferente.");
      return;
    }
    
    onVigaPrincipalReactionCalculated(reaction_kgf);
    setRecommendedProfile(finalProfile);
    toast({ title: "Cálculo Concluído", description: `O perfil recomendado é ${finalProfile.profile.nome}.` });
  };

  const handleAnalyze = () => {
    if (!recommendedProfile) {
        toast({ variant: "destructive", title: "Cálculo necessário", description: "Calcule o perfil antes de analisar."});
        return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);

    // Simulate async operation for local analysis
    setTimeout(() => {
        const analysis = getLocalAnalysis(recommendedProfile);
        setAnalysisResult(analysis);
        setIsAnalyzing(false);
    }, 500); // 500ms delay to simulate processing
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
        toast({ variant: "destructive", title: "Valores Inválidos para Orçamento" });
        return;
    }

    const weightPerUnit = recommendedProfile.profile.peso * totalLengthForBudget;
    const totalWeight = weightPerUnit * qty;
    const costPerUnit = weightPerUnit * price;
    const totalCost = totalWeight * price;

    const newItem: BudgetItem = { id: `${recommendedProfile.profile.nome}-${Date.now()}`, perfil: recommendedProfile.profile, span: totalLengthForBudget, quantity: qty, weightPerUnit, totalWeight, costPerUnit, totalCost, type: 'Viga Principal' };

    onAddToBudget(newItem);
    setRecommendedProfile(null); 
    onVigaPrincipalReactionCalculated(0);
    setAnalysisResult(null);
    toast({ title: "Item Adicionado!", description: `${qty}x viga(s) ${recommendedProfile.profile.nome} adicionada(s) ao orçamento.` });
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
          <BeamSchemeDiagram 
            scheme={beamScheme}
            span={parseFloat(span.replace(",", ".")) || 0}
            balanco1={parseFloat(balanco1.replace(",", ".")) || 0}
            balanco2={parseFloat(balanco2.replace(",", ".")) || 0}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {beamScheme === 'biapoiada' ? (
                 <div className="space-y-2">
                    <Label htmlFor="span">Vão / Comprimento (m)</Label>
                    <Input id="span" type="text" inputMode="decimal" value={span} onChange={(e) => handleInputChange(setSpan, e.target.value)} placeholder="Ex: 5,0" />
                 </div>
            ) : beamScheme === 'balanco' ? (
                 <>
                    <div className="space-y-2">
                        <Label htmlFor="vp-span-balanco">Vão Central (m)</Label>
                        <Input id="vp-span-balanco" type="text" inputMode="decimal" value={span} onChange={(e) => handleInputChange(setSpan, e.target.value)} placeholder="Ex: 5,0"/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="vp-balanco1-single">Balanço (m)</Label>
                        <Input id="vp-balanco1-single" type="text" inputMode="decimal" value={balanco1} onChange={(e) => handleInputChange(setBalanco1, e.target.value)} placeholder="Ex: 1,5"/>
                    </div>
                 </>
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
              <Input id="load" type="text" inputMode="decimal" value={distributedLoad} onChange={(e) => handleInputChange(setDistributedLoad, e.target.value)} placeholder="Peso próprio, etc." />
            </div>
             <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="vp-point-load">Carga Pontual (kgf)</Label>
                </div>
                <Input id="vp-point-load" type="text" inputMode="decimal" value={pointLoad} onChange={e => handleInputChange(setPointLoad, e.target.value)} placeholder="Reação da viga secundária" />
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
                        <SelectItem value="balanco">Viga com Balanço</SelectItem>
                        <SelectItem value="dois-balancos">Viga com Dois Balanços</SelectItem>
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
                    </AlertDescription>
                </CardHeader>
                 <CardContent className="space-y-4">
                     <div className="h-40">
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={recommendedProfile.optimizationData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <XAxis type="number" domain={[0, 100]} hide />
                                <YAxis type="category" dataKey="name" hide />
                                <Tooltip
                                    cursor={{fill: 'hsla(var(--primary) / 0.1)'}}
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="rounded-lg border bg-background p-2 shadow-sm">
                                                    <p className="text-sm font-bold">{`${payload[0].payload.name}: ${payload[0].value?.toFixed(1)}% de utilização`}</p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Bar dataKey="utilization" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]}>
                                    <LabelList dataKey="name" position="insideLeft" offset={10} className="fill-primary-foreground text-xs" />
                                    <LabelList dataKey="utilization" position="right" formatter={(value: number) => `${value.toFixed(0)}%`} className="fill-foreground text-xs" />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                     </div>
                     <Button type="button" onClick={handleAnalyze} className="w-full" disabled={isAnalyzing}>
                         {isAnalyzing ? <><Loader className="animate-spin mr-2"/> Analisando...</> : <><Sparkles className="mr-2"/> Analisar Resultado</>}
                      </Button>
                     {isAnalyzing && (
                         <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground p-4">
                             <Loader className="animate-spin h-4 w-4" />
                             Gerando análise local...
                         </div>
                     )}
                     {analysisResult && (
                        <Alert variant="default">
                            <Sparkles className="h-4 w-4" />
                            <AlertTitle className="font-semibold">Análise Lógica</AlertTitle>
                            <AlertDescription className="whitespace-pre-line">
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
                    {recommendedProfile.shearCheck.vsd > 0 && (
                        <div className="text-sm text-center text-muted-foreground">Reação de apoio máxima: <span className="font-bold text-foreground">{ (recommendedProfile.shearCheck.vsd / 0.009807).toFixed(0)} kgf</span></div>
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
