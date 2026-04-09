
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

export type WorkflowStepId = 'laje' | 'vigaSecundaria' | 'vigaPrincipal' | 'pilar' | 'sapata' | 'sapataArmadura' | 'visualizacao';
type ComputationStepId = Exclude<WorkflowStepId, 'visualizacao'>;

export interface DerivedFieldLinks {
    laje: {
        quantity: boolean;
    };
    vigaSecundaria: {
        span: boolean;
        balanco1: boolean;
        balanco2: boolean;
        quantity: boolean;
        slabLoad: boolean;
        distributedLoad: boolean;
    };
    vigaPrincipal: {
        span: boolean;
        balanco1: boolean;
        balanco2: boolean;
        distributedLoad: boolean;
    };
    pilar: {
        axialLoad: boolean;
    };
    sapata: {
        load: boolean;
    };
}

export interface FinalCalculatorSnapshot {
    capturedAt: string;
    calculatorState: CalculatorState;
    supportReactions: SupportReaction;
    budgetItems: BudgetItem[];
}

interface CalculatorContextType extends CalculatorState {
  budgetItems: BudgetItem[];
  supportReactions: SupportReaction;
    fieldLinks: DerivedFieldLinks;
    staleSteps: Record<ComputationStepId, boolean>;
    finalSnapshot: FinalCalculatorSnapshot | null;
  
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
    setFieldLink: <T extends keyof DerivedFieldLinks, K extends keyof DerivedFieldLinks[T]>(step: T, field: K, linked: boolean) => void;
    isStepStale: (step: WorkflowStepId) => boolean;
    captureFinalSnapshot: () => boolean;
    clearFinalSnapshot: () => void;

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

const initialFieldLinks: DerivedFieldLinks = {
    laje: {
        quantity: true,
    },
    vigaSecundaria: {
        span: true,
        balanco1: true,
        balanco2: true,
        quantity: true,
        slabLoad: true,
        distributedLoad: true,
    },
    vigaPrincipal: {
        span: true,
        balanco1: true,
        balanco2: true,
        distributedLoad: true,
    },
    pilar: {
        axialLoad: true,
    },
    sapata: {
        load: true,
    },
};

const initialStaleSteps: Record<ComputationStepId, boolean> = {
    laje: false,
    vigaSecundaria: false,
    vigaPrincipal: false,
    pilar: false,
    sapata: false,
    sapataArmadura: false,
};

const staleCascadeMap: Record<keyof CalculatorState, ComputationStepId[]> = {
    slabAnalysis: ['laje', 'vigaSecundaria', 'vigaPrincipal', 'pilar', 'sapata', 'sapataArmadura'],
    laje: ['laje', 'vigaSecundaria', 'vigaPrincipal', 'pilar', 'sapata', 'sapataArmadura'],
    vigaSecundaria: ['vigaSecundaria', 'vigaPrincipal', 'pilar', 'sapata', 'sapataArmadura'],
    vigaPrincipal: ['vigaPrincipal', 'pilar', 'sapata', 'sapataArmadura'],
    pilar: ['pilar', 'sapata', 'sapataArmadura'],
    sapata: ['sapata', 'sapataArmadura'],
    sapataArmadura: ['sapataArmadura'],
};

const cloneData = <T,>(value: T): T => JSON.parse(JSON.stringify(value));

function resetInvalidatedReactions(
    current: SupportReaction,
    affectedSteps: ComputationStepId[]
): SupportReaction {
    return {
        vigaSecundaria: affectedSteps.includes('vigaSecundaria') ? 0 : current.vigaSecundaria,
        vigaPrincipal: affectedSteps.includes('vigaPrincipal') ? 0 : current.vigaPrincipal,
        pilar: affectedSteps.includes('pilar') ? 0 : current.pilar,
    };
}

function resetComputedStep(state: CalculatorState, step: ComputationStepId): CalculatorState {
    switch (step) {
        case 'laje':
            return {
                ...state,
                laje: { ...state.laje, result: null, analysis: null },
            };
        case 'vigaSecundaria':
            return {
                ...state,
                vigaSecundaria: { ...state.vigaSecundaria, result: null, analysis: null },
            };
        case 'vigaPrincipal':
            return {
                ...state,
                vigaPrincipal: { ...state.vigaPrincipal, result: null, analysis: null },
            };
        case 'pilar':
            return {
                ...state,
                pilar: { ...state.pilar, result: null, analysis: null },
            };
        case 'sapata':
            return {
                ...state,
                sapata: { ...state.sapata, result: null },
            };
        case 'sapataArmadura':
            return {
                ...state,
                sapataArmadura: { ...state.sapataArmadura, result: null },
            };
        default:
            return state;
    }
}

function hasCompleteResults(state: CalculatorState) {
    return Boolean(
        state.slabAnalysis.result &&
        state.laje.result &&
        state.vigaSecundaria.result &&
        state.vigaPrincipal.result &&
        state.pilar.result &&
        state.sapata.result &&
        state.sapataArmadura.result
    );
}


export function CalculatorProvider({ children }: { children: React.ReactNode }) {
  const [budgetItems, setBudgetItems] = React.useState<BudgetItem[]>([]);
  const [supportReactions, setSupportReactions] = React.useState<SupportReaction>({ vigaPrincipal: 0, vigaSecundaria: 0, pilar: 0 });
  const [calculatorState, setCalculatorState] = React.useState<CalculatorState>(initialState);
  const [fieldLinks, setFieldLinks] = React.useState<DerivedFieldLinks>(initialFieldLinks);
  const [staleSteps, setStaleSteps] = React.useState<Record<ComputationStepId, boolean>>(initialStaleSteps);
  const [finalSnapshot, setFinalSnapshot] = React.useState<FinalCalculatorSnapshot | null>(null);
  const { toast } = useToast();

  const handleUpdate = React.useCallback(<T extends keyof CalculatorState>(key: T, update: Partial<CalculatorState[T]>) => {
      const changedKeys = Object.keys(update) as Array<keyof CalculatorState[T]>;
      const hasInputChanges = changedKeys.some((changedKey) => changedKey !== 'result' && changedKey !== 'analysis');
      const setsResult = changedKeys.includes('result' as keyof CalculatorState[T]);

      if (hasInputChanges) {
          const affectedSteps = staleCascadeMap[key];
          setCalculatorState(prev => {
              let nextState: CalculatorState = {
                  ...prev,
                  [key]: { ...prev[key], ...update }
              };

              for (const step of affectedSteps) {
                  nextState = resetComputedStep(nextState, step);
              }

              return nextState;
          });
          setSupportReactions(prev => resetInvalidatedReactions(prev, affectedSteps));
          setStaleSteps(prev => ({
              ...prev,
              ...affectedSteps.reduce((acc, step) => {
                  acc[step] = true;
                  return acc;
              }, {} as Record<ComputationStepId, boolean>),
          }));
          setFinalSnapshot(null);
          return;
      }

      setCalculatorState(prev => ({
          ...prev,
          [key]: { ...prev[key], ...update }
      }));

      if (setsResult && update.result) {
          if (key !== 'slabAnalysis') {
              setStaleSteps(prev => ({
                  ...prev,
                  [key]: false,
              }));
          }
      }
  }, []);

  const handleClearAllInputs = React.useCallback(() => {
      setCalculatorState(initialState);
      setFieldLinks(initialFieldLinks);
      setStaleSteps(initialStaleSteps);
      setFinalSnapshot(null);
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

  const handleSetFieldLink = React.useCallback(<T extends keyof DerivedFieldLinks, K extends keyof DerivedFieldLinks[T]>(step: T, field: K, linked: boolean) => {
      setFieldLinks(prev => ({
          ...prev,
          [step]: {
              ...prev[step],
              [field]: linked,
          }
      }));

      const affectedSteps = staleCascadeMap[step as keyof CalculatorState];
      setCalculatorState(prev => {
          let nextState = prev;
          for (const affectedStep of affectedSteps) {
              nextState = resetComputedStep(nextState, affectedStep);
          }
          return nextState;
      });
      setSupportReactions(prev => resetInvalidatedReactions(prev, affectedSteps));
      setStaleSteps(prev => ({
          ...prev,
          ...affectedSteps.reduce((acc, affectedStep) => {
              acc[affectedStep] = true;
              return acc;
          }, {} as Record<ComputationStepId, boolean>),
      }));
      setFinalSnapshot(null);
  }, []);

  const isStepStale = React.useCallback((step: WorkflowStepId) => {
      if (step === 'visualizacao') {
          return Object.values(staleSteps).some(Boolean);
      }
      return staleSteps[step];
  }, [staleSteps]);

  const handleCaptureFinalSnapshot = React.useCallback(() => {
      if (Object.values(staleSteps).some(Boolean)) {
          toast({
              variant: 'destructive',
              title: 'Etapas desatualizadas',
              description: 'Recalcule as etapas marcadas como desatualizadas antes de congelar o snapshot final.',
          });
          return false;
      }

      if (!hasCompleteResults(calculatorState)) {
          toast({
              variant: 'destructive',
              title: 'Cálculos incompletos',
              description: 'Finalize geometria, laje, vigas, pilar, sapata e armadura antes de capturar o snapshot final.',
          });
          return false;
      }

      setFinalSnapshot({
          capturedAt: new Date().toISOString(),
          calculatorState: cloneData(calculatorState),
          supportReactions: cloneData(supportReactions),
          budgetItems: cloneData(budgetItems),
      });
      toast({
          title: 'Snapshot final congelado',
          description: 'O relatório final passa a usar esta fotografia estável até você atualizar ou limpar o snapshot.',
      });
      return true;
  }, [budgetItems, calculatorState, staleSteps, supportReactions, toast]);

  const handleClearFinalSnapshot = React.useCallback(() => {
      setFinalSnapshot(null);
  }, []);


  const contextValue: CalculatorContextType = React.useMemo(() => ({
    ...calculatorState,
    budgetItems,
    supportReactions,
    fieldLinks,
    staleSteps,
    finalSnapshot,
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
        setFieldLink: handleSetFieldLink,
        isStepStale,
        captureFinalSnapshot: handleCaptureFinalSnapshot,
        clearFinalSnapshot: handleClearFinalSnapshot,
    clearAllInputs: handleClearAllInputs,
    }), [calculatorState, budgetItems, supportReactions, fieldLinks, staleSteps, finalSnapshot, handleAddToBudget, handleClearBudget, handleSaveBudget, handleVigaPrincipalReaction, handleVigaSecundariaReaction, handlePillarLoad, handleUpdate, handleSetFieldLink, isStepStale, handleCaptureFinalSnapshot, handleClearFinalSnapshot, handleClearAllInputs]);

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
