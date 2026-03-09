
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
import { perfisIpeData, tiposAco, E_ACO_MPA, BudgetItem, PerfilIpe, RESISTENCIA_CALCULO_CONECTOR_KN } from "@/lib/data/index";
import { BeamSchemeDiagram } from "./BeamSchemeDiagram";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { useCalculator, VigaInputs } from "@/app/perfis/calculadora/CalculatorContext";

interface CalculationResult {
    profile: PerfilIpe;
    requiredWx: number;
    requiredIx: number;
    ltbCheck: { msd: number; mrd: number; passed: boolean; };
    shearCheck: { vsd: number; vrd: number; passed: boolean; };
    connectorCount: number;
    optimizationData: { name: string; utilization: number }[];
}

interface AnalysisResult {
  analysis: string;
}

function getLocalAnalysis(result: CalculationResult, safetyFactor: number): AnalysisResult {
    const { profile, optimizationData, connectorCount } = result;
    const flexao = optimizationData.find(d => d.name === 'Flexão (Wx)')?.utilization || 0;
    const deformacao = optimizationData.find(d => d.name === 'Deform. (Ix)')?.utilization || 0;
    const cortante = optimizationData.find(d => d.name === 'Cortante')?.utilization || 0;
    let analysisText = `O perfil IPE ${profile.nome} foi selecionado como a opção mais leve que atende aos esforços já majorados pelo fator de segurança de ${safetyFactor.toFixed(2)}.\n\n`;
    analysisText += `Análise de Otimização:\n- Utilização (Flexão): ${flexao.toFixed(1)}%\n- Utilização (Deformação): ${deformacao.toFixed(1)}%\n- Utilização (Cortante): ${cortante.toFixed(1)}%\n\n`;
    
    if (flexao > 95 || deformacao > 95) {
        analysisText += "**AVISO DE SEGURANÇA:** O perfil está trabalhando muito próximo do seu limite. Esta é uma solução otimizada, mas com margem de segurança mínima. Recomenda-se fortemente diminuir o espaçamento entre as vigas secundárias para aumentar a segurança.\n\n";
    } else if (flexao > 70 || deformacao > 70) {
        analysisText += "**INSIGHT DE OTIMIZAÇÃO:** A taxa de utilização está acima de 70%. Embora segura, a estrutura pode ser otimizada para maior segurança. **Sugestão:** Tente diminuir o 'Espaçamento entre Vigas' para reduzir a carga em cada viga e aumentar a margem de segurança do sistema.\n\n";
    } else if (flexao < 60 && deformacao < 60) {
        analysisText += "**INSIGHT DE OTIMIZAÇÃO:** O dimensionamento é conservador, com taxas de utilização baixas. Há potencial para usar um perfil mais leve, o que poderia reduzir custos.\n\n";
    } else {
        analysisText += "**CONCLUSÃO:** O dimensionamento aparenta estar seguro e bem otimizado, com um bom equilíbrio entre o uso da capacidade do material e as margens de segurança.\n\n";
    }

    if (connectorCount > 0) {
        analysisText += `Ação Mista: Foram calculados ${connectorCount} conectores de cisalhamento (stud bolts). A correta instalação destes componentes é vital para garantir que a laje e a viga trabalhem em conjunto, conforme previsto no cálculo.`;
    }
    return { analysis: analysisText };
}

export function VigaSecundariaCalculator() {
  const { onAddToBudget, onVigaSecundariaReactionCalculated, laje, vigaSecundaria, updateVigaSecundaria, slabAnalysis } = useCalculator();
  const { span, balanco1, balanco2, spacing, slabLoad, distributedLoad, pointLoad, pointLoadPosition, steelType, beamScheme, quantity, pricePerKg, result, analysis, safetyFactor } = vigaSecundaria;

  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { toast } = useToast();

    React.useEffect(() => {
        const { spanY, spanX, cantileverFront, cantileverBack } = slabAnalysis;
        const updates: Partial<VigaInputs> = {};
        
        const totalY = parseFloat(spanY.replace(',', '.')) || 0;
        const balancoY_F = parseFloat(cantileverFront.replace(',', '.')) || 0;
        const balancoY_A = parseFloat(cantileverBack.replace(',', '.')) || 0;
        const vaoY = totalY - balancoY_F - balancoY_A;

        if (vaoY > 0 && vaoY.toFixed(2) !== span) updates.span = vaoY.toFixed(2);
        if (cantileverFront && cantileverFront !== balanco1) updates.balanco1 = cantileverFront;
        if (cantileverBack && cantileverBack !== balanco2) updates.balanco2 = cantileverBack;
        
        const E_m = parseFloat(spacing!.replace(",", "."));
        const L_total_m = parseFloat(spanX.replace(",", "."));
        if (!isNaN(E_m) && E_m > 0 && !isNaN(L_total_m) && L_total_m > 0) {
            const numVigas = Math.ceil(L_total_m / E_m) + 1;
            if (numVigas.toString() !== quantity) updates.quantity = numVigas.toString();
        }

        if (Object.keys(updates).length > 0) {
            updateVigaSecundaria(updates);
        }
    }, [slabAnalysis, spacing, span, balanco1, balanco2, quantity, updateVigaSecundaria]);
  
  React.useEffect(() => {
    const E_m = parseFloat(spacing!.replace(",", "."));
    const S_kgf_m2 = parseFloat(slabLoad!.replace(",", "."));
    if (!isNaN(E_m) && !isNaN(S_kgf_m2) && E_m > 0 && S_kgf_m2 > 0) {
      const q_dist_kgf_m = S_kgf_m2 * E_m;
       if (q_dist_kgf_m.toFixed(2) !== distributedLoad.replace(',', '.')) {
           updateVigaSecundaria({ distributedLoad: q_dist_kgf_m.toFixed(2).replace('.',',') });
       }
    }
  }, [slabLoad, spacing, distributedLoad, updateVigaSecundaria]);

  React.useEffect(() => {
    if (laje.result && laje.result.totalLoad.toFixed(0) !== slabLoad) {
      updateVigaSecundaria({ slabLoad: laje.result.totalLoad.toFixed(0) });
    }
  }, [laje.result, slabLoad, updateVigaSecundaria]);

  const handleInputChange = (field: keyof VigaInputs, value: string) => {
    const sanitizedValue = value.replace(/[^0-9,.]/g, '').replace('.', ',');
    if (/^\d*[,.]?\d*$/.test(sanitizedValue)) {
      updateVigaSecundaria({ [field]: sanitizedValue });
    }
  };

  const handleCalculate = () => {
    const L_m = parseFloat(span.replace(",", "."));
    const L1_m = parseFloat(balanco1.replace(",", ".")) || 0;
    const L2_m = parseFloat(balanco2.replace(",", ".")) || 0;
    const q_kgf_m = parseFloat(distributedLoad.replace(",", ".")) || 0;
    const P_kgf = parseFloat(pointLoad.replace(",", ".")) || 0;
    let a_m = parseFloat(pointLoadPosition.replace(",", ".")) || 0;
    const sf = parseFloat(safetyFactor.replace(',', '.')) || 1.4;
    
    setError(null);
    updateVigaSecundaria({ result: null, analysis: null });
    onVigaSecundariaReactionCalculated(0);

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
        setError("A posição da carga pontual deve estar dentro do vão central.");
        return;
    }
    const selectedSteel = tiposAco.find(s => s.nome === steelType);
    if (!selectedSteel) {
        setError("Tipo de aço inválido.");
        return;
    }

    const fy_MPa = selectedSteel.fy;
    const fy_kN_cm2 = fy_MPa / 10;
    const q_kN_m = q_kgf_m * 0.009807;
    const P_kN = P_kgf * 0.009807;
    const E_kN_cm2 = E_ACO_MPA / 10;
    const q_kN_cm = q_kN_m / 100;
    const L_cm = L_m * 100;

    let Msd_kNm_unfactored = 0, Ix_req_dist = 0, Ix_req_pont = 0, Vsd_kN_unfactored = 0;

    if (beamScheme === "biapoiada") {
        Msd_kNm_unfactored = (q_kN_m * L_m * L_m) / 8 + (P_kN * a_m * (L_m - a_m)) / L_m;
        Ix_req_dist = (5 * q_kN_cm * Math.pow(L_cm, 4)) / (384 * E_kN_cm2 * (L_cm / 360));
        const b_cm = L_cm - (a_m * 100);
        Ix_req_pont = (P_kN * (a_m*100) * b_cm * (L_cm + b_cm) * Math.sqrt(3 * (a_m*100) * (L_cm + b_cm))) / (27 * E_kN_cm2 * L_cm * (L_cm / 360));
        Vsd_kN_unfactored = (q_kN_m * L_m) / 2 + Math.max((P_kN * (L_m - a_m)) / L_m, (P_kN * a_m) / L_m);
    } else if (beamScheme === "balanco") {
        const M_neg = (q_kN_m * L1_m * L1_m) / 2;
        const M_pos_dist = (q_kN_m * L_m * L_m) / 8 - M_neg / 2;
        const M_pos_pont = (P_kN * a_m * (L_m - a_m)) / L_m;
        Msd_kNm_unfactored = Math.max(M_neg, M_pos_dist + M_pos_pont);
        const R2 = q_kN_m * (L_m/2 + L1_m) + (q_kN_m*L1_m*L1_m)/(2*L_m) + (P_kN*a_m)/L_m;
        Vsd_kN_unfactored = R2; 
        Ix_req_dist = (q_kN_cm * Math.pow(L_cm, 4)) / (185 * E_kN_cm2 * (L_cm / 360));
    } else if (beamScheme === "dois-balancos") {
        const M_neg1 = (q_kN_m * L1_m * L1_m) / 2;
        const M_neg2 = (q_kN_m * L2_m * L2_m) / 2;
        const M_pos_dist = (q_kN_m * L_m * L_m) / 8 - (M_neg1 + M_neg2) / 2;
        const M_pos_pont = (P_kN * a_m * (L_m - a_m)) / L_m;
        Msd_kNm_unfactored = Math.max(M_neg1, M_neg2, M_pos_dist + M_pos_pont);
        const R1 = (q_kN_m * L_m / 2) + (M_neg1 - M_neg2) / L_m + (P_kN * (L_m - a_m))/L_m;
        const R2 = (q_kN_m * L_m / 2) - (M_neg1 - M_neg2) / L_m + (P_kN*a_m)/L_m;
        Vsd_kN_unfactored = Math.max(R1 + q_kN_m*L1_m, R2 + q_kN_m*L2_m);
        Ix_req_dist = (5 * q_kN_cm * Math.pow(L_cm, 4)) / (384 * E_kN_cm2 * (L_cm / 360)) - ( (M_neg1 + M_neg2)/2 * Math.pow(L_cm,2) ) / (16*E_kN_cm2);
    }
    
    const Msd_kNm = Msd_kNm_unfactored * sf;
    const Vsd_kN = Vsd_kN_unfactored * sf;
    const requiredIx_cm4 = (Ix_req_dist + Ix_req_pont) * sf;
    const requiredWx_cm3 = (Msd_kNm * 100) / fy_kN_cm2;
    const reaction_kgf = Vsd_kN_unfactored / 0.009807;

    const suitableProfiles = perfisIpeData.filter(p => p.Wx >= requiredWx_cm3 && p.Ix >= requiredIx_cm4).sort((a, b) => a.peso - b.peso);
    
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
            const Ac_cm2 = (parseFloat(spacing!.replace(',', '.')) * 100) * (profile.tf / 10);
            const Fcc_kN = 0.85 * 2.5 * Ac_cm2;
            const Fst_kN = profile.area * fy_kN_cm2;
            const Vh_kN = Math.min(Fcc_kN, Fst_kN);
            const numConnectors = Math.ceil(Vh_kN / RESISTENCIA_CALCULO_CONECTOR_KN);
            const optimizationData = [
                { name: 'Flexão (Wx)', utilization: Math.min(100, (requiredWx_cm3 / profile.Wx) * 100) },
                { name: 'Deform. (Ix)', utilization: Math.min(100, (requiredIx_cm4 / profile.Ix) * 100) },
                { name: 'Cortante', utilization: Math.min(100, (Vsd_kN / Vrd_kN) * 100) },
            ];
            finalProfile = { profile, requiredWx: requiredWx_cm3, requiredIx: requiredIx_cm4, ltbCheck: { msd: Msd_kNm, mrd: Mrd_kNcm / 100, passed: ltbPassed }, shearCheck: { vsd: Vsd_kN, vrd: Vrd_kN, passed: shearPassed }, connectorCount: numConnectors, optimizationData };
            break;
        }
    }

    if (!finalProfile) { setError("Nenhum perfil IPE atende aos requisitos. A carga, vão ou espaçamento podem ser grandes."); return; }
    onVigaSecundariaReactionCalculated(reaction_kgf);
    updateVigaSecundaria({ result: finalProfile });
    toast({ title: "Cálculo de Viga Secundária Concluído", description: `O perfil recomendado é ${finalProfile.profile.nome}.` });
  };

  const handleAnalyze = () => {
    if (!result) { toast({ variant: "destructive", title: "Cálculo necessário", description: "Calcule o perfil antes de analisar."}); return; }
    setIsAnalyzing(true);
    updateVigaSecundaria({ analysis: null });
    const sf = parseFloat(safetyFactor.replace(',', '.')) || 1.4;
    setTimeout(() => {
        const analysisResult = getLocalAnalysis(result, sf);
        updateVigaSecundaria({ analysis: analysisResult });
        setIsAnalyzing(false);
    }, 500);
  };
  
  const handleAddToBudget = () => {
    if (!result) { toast({ variant: "destructive", title: "Nenhum Perfil Calculado" }); return; }
    const L_central_m = parseFloat(span.replace(",", "."));
    const L_balanco1_m = parseFloat(balanco1.replace(",", ".")) || 0;
    const L_balanco2_m = parseFloat(balanco2.replace(",", ".")) || 0;
    const qty = parseInt(quantity);
    const price = parseFloat(pricePerKg.replace(",", "."));
    let totalLengthForBudget = 0;
    if (beamScheme === 'biapoiada') totalLengthForBudget = L_central_m;
    if (beamScheme === 'balanco') totalLengthForBudget = L_central_m + L_balanco1_m;
    if (beamScheme === 'dois-balancos') totalLengthForBudget = L_central_m + L_balanco1_m + L_balanco2_m;
    if (isNaN(totalLengthForBudget) || isNaN(qty) || isNaN(price) || totalLengthForBudget <= 0 || qty <= 0 || price <= 0) {
        toast({ variant: "destructive", title: "Valores Inválidos" }); return;
    }
    const weightPerUnit = result.profile.peso * totalLengthForBudget;
    const totalWeight = weightPerUnit * qty;
    const costPerUnit = weightPerUnit * price;
    const totalCost = totalWeight * price;
    const newItem: BudgetItem = { id: `${result.profile.nome}-${Date.now()}`, perfil: result.profile, span: totalLengthForBudget, quantity: qty, weightPerUnit, totalWeight, costPerUnit, totalCost, type: 'Viga Secundária' };
    onAddToBudget(newItem);
    toast({ title: "Item Adicionado!", description: `${qty}x viga(s) ${result.profile.nome} adicionada(s).`})
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Calculadora de Viga Secundária (Perfil IPE)</CardTitle>
          <CardDescription>Dimensione vigas secundárias que apoiam a laje, como em um sistema de steel deck.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <BeamSchemeDiagram scheme={beamScheme} span={parseFloat(span.replace(",", ".")) || 0} balanco1={parseFloat(balanco1.replace(",", ".")) || 0} balanco2={parseFloat(balanco2.replace(",", ".")) || 0} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
            {beamScheme === 'biapoiada' ? (
                <div className="space-y-2"><Label htmlFor="vs-span">Vão / Comprimento (m)</Label><Input id="vs-span" type="text" inputMode="decimal" value={span} onChange={(e) => handleInputChange('span', e.target.value)} placeholder="Ex: 4,0" /></div>
            ) : beamScheme === 'balanco' ? (
                 <><div className="space-y-2"><Label htmlFor="vs-span-balanco">Vão Central (m)</Label><Input id="vs-span-balanco" type="text" inputMode="decimal" value={span} onChange={(e) => handleInputChange('span', e.target.value)} placeholder="Ex: 4,0"/></div><div className="space-y-2"><Label htmlFor="vs-balanco1-single">Balanço (m)</Label><Input id="vs-balanco1-single" type="text" inputMode="decimal" value={balanco1} onChange={(e) => handleInputChange('balanco1', e.target.value)} placeholder="Ex: 1,0"/></div></>
            ) : (
                <><div className="space-y-2"><Label htmlFor="vs-balanco1">Balanço 1 (m)</Label><Input id="vs-balanco1" type="text" inputMode="decimal" value={balanco1} onChange={(e) => handleInputChange('balanco1', e.target.value)} placeholder="Ex: 1,0"/></div><div className="space-y-2"><Label htmlFor="vs-span-central">Vão Central (m)</Label><Input id="vs-span-central" type="text" inputMode="decimal" value={span} onChange={(e) => handleInputChange('span', e.target.value)} placeholder="Ex: 4,0"/></div><div className="space-y-2"><Label htmlFor="vs-balanco2">Balanço 2 (m)</Label><Input id="vs-balanco2" type="text" inputMode="decimal" value={balanco2} onChange={(e) => handleInputChange('balanco2', e.target.value)} placeholder="Ex: 1,0"/></div></>
            )}
             <div className="space-y-2"><div className="flex items-center justify-between"><Label htmlFor="vs-slab-load">Carga da Laje (kgf/m²)</Label></div><Input id="vs-slab-load" type="text" inputMode="decimal" value={slabLoad} onChange={(e) => handleInputChange('slabLoad', e.target.value)} placeholder="Ex: 450" /></div>
            <div className="space-y-2"><Label htmlFor="vs-spacing">Espaçamento entre Vigas (m)</Label><Input id="vs-spacing" type="text" inputMode="decimal" value={spacing} onChange={(e) => handleInputChange('spacing', e.target.value)} placeholder="Ex: 1,5" /></div>
             <div className="space-y-2"><Label htmlFor="vs-load">Carga Distribuída (kgf/m)</Label><Input id="vs-load" type="text" inputMode="decimal" value={distributedLoad} onChange={(e) => handleInputChange('distributedLoad', e.target.value)} placeholder="Carga linear" /></div>
             <div className="space-y-2"><Label htmlFor="vs-point-load">Carga Pontual (kgf)</Label><Input id="vs-point-load" type="text" inputMode="decimal" value={pointLoad} onChange={e => handleInputChange('pointLoad', e.target.value)} placeholder="Opcional" /></div>
            <div className="space-y-2"><Label htmlFor="vs-point-load-pos">Posição da Carga (m)</Label><Input id="vs-point-load-pos" type="text" inputMode="decimal" value={pointLoadPosition} onChange={e => handleInputChange('pointLoadPosition', e.target.value)} placeholder="Dist. do apoio esquerdo" /></div>
            <div className="space-y-2"><Label htmlFor="vs-beam-scheme">Esquema da Viga</Label><Select value={beamScheme} onValueChange={(value) => updateVigaSecundaria({ beamScheme: value as VigaInputs['beamScheme'] })}><SelectTrigger id="vs-beam-scheme"><SelectValue placeholder="Selecione o esquema" /></SelectTrigger><SelectContent><SelectItem value="biapoiada">Viga Bi-apoiada</SelectItem><SelectItem value="balanco">Viga com Balanço</SelectItem><SelectItem value="dois-balancos">Viga com Dois Balanços</SelectItem></SelectContent></Select></div>
             <div className="space-y-2"><Label htmlFor="vs-steel-type">Tipo de Aço</Label><Select value={steelType} onValueChange={value => updateVigaSecundaria({ steelType: value })}><SelectTrigger id="vs-steel-type"><SelectValue placeholder="Selecione o aço" /></SelectTrigger><SelectContent>{tiposAco.map(aco => <SelectItem key={aco.nome} value={aco.nome}>{aco.nome}</SelectItem>)}</SelectContent></Select></div>
             <div className="space-y-2"><Label htmlFor="safety-factor">Fator de Segurança</Label><Input id="safety-factor" type="text" inputMode="decimal" value={safetyFactor} onChange={e => handleInputChange('safetyFactor', e.target.value)} placeholder="Ex: 1,4"/></div>
          </div>
          <Button type="button" onClick={handleCalculate} className="w-full md:w-auto">Calcular Viga Secundária</Button>
          {error && <Alert variant="destructive"><AlertTitle>Erro</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
          {result && (
             <Card className="mt-4 bg-primary/5 border-primary/20">
                <CardHeader><AlertTitle className="text-primary font-bold flex items-center gap-2"><CheckCircle className="h-5 w-5"/> Perfil IPE Recomendado</AlertTitle><AlertDescription className="space-y-2 pt-2"><div className="text-2xl font-bold text-center py-2 text-primary">{result.profile.nome}</div></AlertDescription></CardHeader>
                 <CardContent className="space-y-4">
                     <div className="h-40"><ResponsiveContainer width="100%" height="100%"><BarChart data={result.optimizationData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}><XAxis type="number" domain={[0, 100]} hide /><YAxis type="category" dataKey="name" hide /><Tooltip cursor={{fill: 'hsla(var(--primary) / 0.1)'}} content={({ active, payload }) => active && payload?.length ? <div className="rounded-lg border bg-background p-2 shadow-sm"><p className="text-sm font-bold">{`${payload[0].payload.name}: ${payload[0].value?.toFixed(1)}% de utilização`}</p></div> : null} /><Bar dataKey="utilization" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]}><LabelList dataKey="name" position="insideLeft" offset={10} className="fill-primary-foreground text-xs" /><LabelList dataKey="utilization" position="right" formatter={(value: number) => `${value.toFixed(0)}%`} className="fill-foreground text-xs" /></Bar></BarChart></ResponsiveContainer></div>
                      <div className="rounded-lg border bg-background p-2"><p className="text-sm font-medium text-center text-muted-foreground">Conectores de Cisalhamento (Stud Bolts 19mm)</p><p className="text-xl font-bold text-center text-primary">{result.connectorCount} unidades</p><p className="text-xs text-center text-muted-foreground">({(result.connectorCount / (beamScheme === 'biapoiada' ? parseFloat(span.replace(',', '.')) : parseFloat(span.replace(',', '.')) + parseFloat(balanco1.replace(',', '.')) + (beamScheme === 'dois-balancos' ? parseFloat(balanco2.replace(',', '.')) : 0))).toFixed(1)} un/m)</p></div>
                      <Button type="button" onClick={handleAnalyze} className="w-full" disabled={isAnalyzing}>{isAnalyzing ? <><Loader className="animate-spin mr-2"/> Analisando...</> : <><Sparkles className="mr-2"/> Analisar Resultado</>}</Button>
                     {isAnalyzing && <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground p-4"><Loader className="animate-spin h-4 w-4" />Gerando análise...</div>}
                     {analysis && <Alert variant="default"><Sparkles className="h-4 w-4" /><AlertTitle className="font-semibold">Análise Lógica</AlertTitle><AlertDescription className="whitespace-pre-line">{analysis.analysis}</AlertDescription></Alert>}
                     <div className="grid grid-cols-2 gap-4 border-t pt-4">
                         <div className="space-y-2"><Label htmlFor="vs-quantity">Quantidade</Label><Input id="vs-quantity" type="text" inputMode="numeric" value={quantity} onChange={(e) => handleInputChange('quantity', e.target.value)} placeholder="Ex: 1" /></div>
                         <div className="space-y-2"><Label htmlFor="vs-pricePerKg">Preço do Aço (R$/kg)</Label><Input id="vs-pricePerKg" type="text" inputMode="decimal" value={pricePerKg} onChange={(e) => handleInputChange('pricePerKg', e.target.value)} placeholder="Ex: 8,50" /></div>
                    </div>
                     {result.shearCheck.vsd > 0 && <div className="text-sm text-center text-muted-foreground">Reação de apoio máxima (não majorada): <span className="font-bold text-foreground">{ (result.shearCheck.vsd / (parseFloat(safetyFactor.replace(',', '.')) || 1.4) / 0.009807).toFixed(0)} kgf</span></div>}
                    <Button type="button" onClick={handleAddToBudget} className="w-full gap-2"><PlusCircle/> Adicionar ao Orçamento</Button>
                </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

    