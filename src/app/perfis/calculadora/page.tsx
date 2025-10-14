
"use client";

import { Dashboard } from "@/components/dashboard";
import * as React from "react";
import { perfisData, Perfil } from "@/lib/data/perfis";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function CalculatorComponent() {
  const [span, setSpan] = React.useState("5"); // Vão em metros
  const [load, setLoad] = React.useState("300"); // Carga em kgf/m
  const [recommendedProfile, setRecommendedProfile] = React.useState<Perfil | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const { toast } = useToast();

  const handleCalculate = () => {
    const L = parseFloat(span.replace(",", "."));
    const q = parseFloat(load.replace(",", "."));
    setError(null);
    setRecommendedProfile(null);

    if (isNaN(L) || isNaN(q) || L <= 0 || q <= 0) {
      setError("Por favor, insira valores válidos e positivos para o vão e a carga.");
      return;
    }

    // Tensão de escoamento do aço (fy) para ASTM A36 em MPa (N/mm²)
    const fy_MPa = 250; 
    // Convertendo para kN/cm² para compatibilizar com unidades de momento e Wx
    const fy_kN_cm2 = fy_MPa / 10;
    
    // Momento fletor máximo para viga biapoiada com carga distribuída (M = q * L² / 8)
    // Carga q de kgf/m para kN/m (1 kgf ≈ 0.009807 kN)
    const q_kN_m = q * 0.009807;
    const maxMoment_kNm = (q_kN_m * Math.pow(L, 2)) / 8;
    
    // Momento em kN.cm
    const maxMoment_kNcm = maxMoment_kNm * 100;
    
    // Módulo de resistência mínimo necessário (Wx = M / fy)
    const requiredWx = maxMoment_kNcm / fy_kN_cm2;
    
    // Encontrar o perfil mais leve (menor peso) que satisfaz o Wx necessário
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

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Calculadora de Resistência de Vigas</CardTitle>
          <CardDescription>
            Pré-dimensione o perfil de aço (W) mais leve para uma viga biapoiada com carga distribuída.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="span">Comprimento do Vão (m)</Label>
              <Input
                id="span"
                type="text"
                inputMode="decimal"
                value={span}
                onChange={(e) => setSpan(e.target.value)}
                placeholder="Ex: 5,0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="load">Carga Uniformemente Distribuída (kgf/m)</Label>
              <Input
                id="load"
                type="text"
                inputMode="decimal"
                value={load}
                onChange={(e) => setLoad(e.target.value)}
                placeholder="Ex: 300"
              />
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
                    <p>O perfil mais leve que atende aos requisitos de resistência é:</p>
                    <div className="text-2xl font-bold text-center py-4 text-primary">{recommendedProfile.nome}</div>
                    <ul className="text-sm text-muted-foreground list-disc pl-5">
                        <li><strong>Peso:</strong> {recommendedProfile.peso} kg/m</li>
                        <li><strong>Módulo de Resistência (Wx):</strong> {recommendedProfile.Wx} cm³</li>
                    </ul>
                     <p className="text-xs text-muted-foreground pt-2">
                        <strong>Aviso:</strong> Este é um pré-dimensionamento. A escolha final do perfil deve ser validada por um engenheiro calculista, considerando todos os esforços, normas e critérios de segurança aplicáveis ao projeto.
                    </p>
                </AlertDescription>
            </Alert>
          )}

        </CardContent>
      </Card>
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
