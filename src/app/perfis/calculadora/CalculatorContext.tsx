
"use client";

import * as React from 'react';
import { BudgetItem, SupportReaction, Perfil, PerfilIpe, SteelDeck } from '@/lib/data';
import { useToast } from "@/hooks/use-toast";


// --- Tipos para Resultados ---
interface SlabAnalysisResult {
    analysis: string;
}
interface VigaCalcResult {
    profile: Perfil | PerfilIpe;
    requiredWx: number;
    requiredIx: number;
    ltbCheck: { msd: number; mrd: number; passed: boolean; };
    shearCheck: { vsd: number; vrd: number; passed: boolean; };
    connectorCount?: number;
    optimizationData: { name: string; utilization: number }[];
}
interface PilarCalcResult {
    profile: Perfil;
    actingStress: number; 
    allowableStress: number; 
}
interface LajeCalcResult {
    deck: SteelDeck,
    totalLoad: number;
}
interface SapataAnalysisResult {
  analysis: string;
  footingDimensions: {
    requiredAreaM2: number;
    sideLengthM: number;
    recommendedHeightCm: number;
  };
}
interface SapataArmaduraResult {
    requiredSteelAreaCm2: number;
    barDiameter: number;
    barSpacing: number;
    totalBars: number;
    analysis: string;
}
interface AnalysisResult {
    analysis: string;
}

// --- Tipos para Inputs ---
export interface SlabAnalysisInputs {
    spanX: string;
    spanY: string;
    cantileverLeft: string;
    cantileverRight: string;
    cantileverFront: string;
    cantileverBack: string;
    result: SlabAnalysisResult | null;
}
export interface LajeInputs {
    selectedDeckId: string;
    concreteThickness: string;
    selectedLoads: string[];
    extraLoad: string;
    quantity: string;
    pricePerKg: string;
    concretePrice: string;
    safetyFactor: string;
}
export interface VigaInputs {
    span: string;
    balanco1: string;
    balanco2: string;
    distributedLoad: string;
    pointLoad: string;
    pointLoadPosition: string;
    steelType: string;
    beamScheme: "biapoiada" | "balanco" | "dois-balancos";
    quantity: string;
    pricePerKg: string;
    spacing?: string; // Only for viga secundária
    slabLoad?: string; // Only for viga secundária
    safetyFactor: string;
}
export interface PilarInputs {
    height: string;
    additionalHeight?: string;
    axialLoad: string;
    steelType: string;
    quantity: string;
    pricePerKg: string;
    safetyFactor: string;
}

export interface SapataInputs {
    load: string;
    selectedSoil: string;
    concretePrice: string;
    steelPrice: string;
    steelRatio: string;
}
export interface SapataArmaduraInputs {
    concreteStrength: string;
    steelStrength: string;
    barDiameter: string;
}

interface CalculatorState {
    slabAnalysis: SlabAnalysisInputs & { result: SlabAnalysisResult | null };
    laje: LajeInputs & { result: LajeCalcResult | null, analysis: AnalysisResult | null };
    vigaSecundaria: VigaInputs & { result: VigaCalcResult | null, analysis: AnalysisResult | null };
    vigaPrincipal: VigaInputs & { result: VigaCalcResult | null, analysis: AnalysisResult | null };
    pilar: PilarInputs & { result: PilarCalcResult | null, analysis: AnalysisResult | null };
    sapata: SapataInputs & { result: SapataAnalysisResult | null };
    sapataArmadura: SapataArmaduraInputs & { result: SapataArmaduraResult | null };
}

interface CalculatorContextType extends CalculatorState {
  budgetItems: BudgetItem[];
  supportReactions: SupportReaction;
  
  onAddToBudget: (item: BudgetItem) => void;
  onClearBudget: () => void;
  onSaveBudget: () => void;
  onPrintBudget: () => void;
  
  onVigaPrincipalReactionCalculated: (reaction: number) => void;
  onVigaSecundariaReactionCalculated: (reaction: number) => void;
  onPillarLoadCalculated: (load: number) => void;
  
  updateSlabAnalysis: (update: Partial<CalculatorState['slabAnalysis']>) => void;
  updateLaje: (update: Partial<CalculatorState['laje']>) => void;
  updateVigaSecundaria: (update: Partial<CalculatorState['vigaSecundaria']>) => void;
  updateVigaPrincipal: (update: Partial<CalculatorState['vigaPrincipal']>) => void;
  updatePilar: (update: Partial<CalculatorState['pilar']>) => void;
  updateSapata: (update: Partial<CalculatorState['sapata']>) => void;
  updateSapataArmadura: (update: Partial<CalculatorState['sapataArmadura']>) => void;

  clearAllInputs: () => void;
}

const CalculatorContext = React.createContext<CalculatorContextType | undefined>(undefined);

const initialSlabAnalysisState: CalculatorState['slabAnalysis'] = {
    spanX: "10",
    spanY: "5.5",
    cantileverLeft: "1.5",
    cantileverRight: "1.7",
    cantileverFront: "1.0",
    cantileverBack: "0.5",
    result: null,
};
const initialLajeState: CalculatorState['laje'] = {
    selectedDeckId: "MD57 - Chapa 0.80mm",
    concreteThickness: "12",
    selectedLoads: ['office'],
    extraLoad: "200",
    quantity: "1",
    pricePerKg: "7.80",
    concretePrice: "750",
    safetyFactor: "1.4",
    result: null,
    analysis: null,
};
const initialVigaState: Omit<VigaInputs, 'safetyFactor'> = {
    span: "4", balanco1: "1", balanco2: "1", distributedLoad: "", pointLoad: "",
    pointLoadPosition: "2", steelType: "ASTM A36", beamScheme: "biapoiada",
    quantity: "1", pricePerKg: "8.50"
};
const initialVigaSecundariaState: CalculatorState['vigaSecundaria'] = {
    ...initialVigaState,
    safetyFactor: "1.4",
    spacing: "1.5", slabLoad: "0", result: null, analysis: null,
};
const initialVigaPrincipalState: CalculatorState['vigaPrincipal'] = {
    ...initialVigaState,
    safetyFactor: "1.4",
    span: "5", pointLoadPosition: "2.5", result: null, analysis: null
};
const initialPilarState: CalculatorState['pilar'] = {
    height: "3", additionalHeight: "3", axialLoad: "0", steelType: "ASTM A36", quantity: "1", pricePerKg: "8.50",
    safetyFactor: "1.4", result: null, analysis: null
};
const initialSapataState: CalculatorState['sapata'] = {
    load: "0", selectedSoil: "Argila Rija", concretePrice: "750", steelPrice: "8.50", steelRatio: "100",
    result: null
};
const initialSapataArmaduraState: CalculatorState['sapataArmadura'] = {
    concreteStrength: "25",
    steelStrength: "50",
    barDiameter: "10",
    result: null,
};

const initialState: CalculatorState = {
    slabAnalysis: initialSlabAnalysisState,
    laje: initialLajeState,
    vigaSecundaria: initialVigaSecundariaState,
    vigaPrincipal: initialVigaPrincipalState,
    pilar: initialPilarState,
    sapata: initialSapataState,
    sapataArmadura: initialSapataArmaduraState,
};


export function CalculatorProvider({ children }: { children: React.ReactNode }) {
  const [budgetItems, setBudgetItems] = React.useState<BudgetItem[]>([]);
  const [supportReactions, setSupportReactions] = React.useState<SupportReaction>({ vigaPrincipal: 0, vigaSecundaria: 0, pilar: 0 });
  const [calculatorState, setCalculatorState] = React.useState<CalculatorState>(initialState);
  const { toast } = useToast();

  const handleUpdate = React.useCallback(<T extends keyof CalculatorState>(key: T, update: Partial<CalculatorState[T]>) => {
      setCalculatorState(prev => ({
          ...prev,
          [key]: { ...prev[key], ...update }
      }))
  }, []);

  const handleClearAllInputs = React.useCallback(() => {
      setCalculatorState(initialState);
      setSupportReactions({ vigaPrincipal: 0, vigaSecundaria: 0, pilar: 0 });
      setBudgetItems([]);
      toast({
          title: "Calculadora Limpa",
          description: "Todos os dados de entrada e o orçamento foram resetados.",
      })
  }, [toast]);

  const handleAddToBudget = React.useCallback((item: BudgetItem) => {
    setBudgetItems(prev => [...prev, item]);
  }, []);
  
  const handleVigaPrincipalReaction = React.useCallback((reaction: number) => {
    setSupportReactions(prev => ({...prev, vigaPrincipal: reaction}));
  }, [])
  const handleVigaSecundariaReaction = React.useCallback((reaction: number) => {
    setSupportReactions(prev => ({...prev, vigaSecundaria: reaction}));
  }, [])

  const handlePillarLoad = React.useCallback((load: number) => {
    setSupportReactions(prev => ({...prev, pilar: load}));
  }, [])


  const handleClearBudget = React.useCallback(() => {
      setBudgetItems([]);
      toast({
          title: "Orçamento Limpo",
          description: "A lista de itens foi removida.",
      })
  }, [toast])
  
  const handleSaveBudget = React.useCallback(() => {
    toast({
        title: "Orçamento Salvo!",
        description: "Seu orçamento foi salvo com sucesso (simulação).",
    })
  }, [toast])

  const handlePrintBudget = () => {
      window.print();
  }


  const contextValue: CalculatorContextType = React.useMemo(() => ({
    ...calculatorState,
    budgetItems,
    supportReactions,
    onAddToBudget: handleAddToBudget,
    onClearBudget: handleClearBudget,
    onSaveBudget: handleSaveBudget,
    onPrintBudget: handlePrintBudget,
    onVigaPrincipalReactionCalculated: handleVigaPrincipalReaction,
    onVigaSecundariaReactionCalculated: handleVigaSecundariaReaction,
    onPillarLoadCalculated: handlePillarLoad,
    updateSlabAnalysis: (update) => handleUpdate('slabAnalysis', update),
    updateLaje: (update) => handleUpdate('laje', update),
    updateVigaSecundaria: (update) => handleUpdate('vigaSecundaria', update),
    updateVigaPrincipal: (update) => handleUpdate('vigaPrincipal', update),
    updatePilar: (update) => handleUpdate('pilar', update),
    updateSapata: (update) => handleUpdate('sapata', update),
    updateSapataArmadura: (update) => handleUpdate('sapataArmadura', update),
    clearAllInputs: handleClearAllInputs,
  }), [calculatorState, budgetItems, supportReactions, handleAddToBudget, handleClearBudget, handleSaveBudget, handleVigaPrincipalReaction, handleVigaSecundariaReaction, handlePillarLoad, handleUpdate, handleClearAllInputs]);

  return (
    <CalculatorContext.Provider value={contextValue}>
      {children}
    </CalculatorContext.Provider>
  );
}

export function useCalculator() {
  const context = React.useContext(CalculatorContext);
  if (context === undefined) {
    throw new Error('useCalculator must be used within a CalculatorProvider');
  }
  return context;
}
