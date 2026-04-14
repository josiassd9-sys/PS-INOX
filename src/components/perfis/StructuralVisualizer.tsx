"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCalculator } from "@/app/perfis/calculadora/CalculatorContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, GitCompareArrows, Loader, Sparkles, ZoomIn, ZoomOut, RotateCcw, Move, Camera, RefreshCcw } from "lucide-react";
import { RefinedButton } from "@/components/refined-components";
import { getAiSettings } from "@/lib/ai-settings";
import { useToast } from "@/hooks/use-toast";
import { StaleStepAlert } from "./linked-field-controls";

const SVG_WIDTH = 800;
const SVG_HEIGHT = 500;
const PADDING = 50;

const NORMATIVE_REFERENCES = [
    "ABNT NBR 8800: projeto de estruturas de aço e estruturas mistas de aço e concreto.",
    "ABNT NBR 6120: ações para o cálculo de estruturas de edificações.",
    "ABNT NBR 8681: ações e segurança nas estruturas.",
    "ABNT NBR 6118: projeto de estruturas de concreto.",
    "ABNT NBR 6122: projeto e execução de fundações.",
];

function formatNumber(value: number, decimals = 2) {
    if (!Number.isFinite(value)) return "0";
    return new Intl.NumberFormat("pt-BR", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(value);
}

function safeParse(value?: string, fallback = 0) {
    if (!value) return fallback;
    const parsed = parseFloat(value.replace(',', '.'));
    return Number.isFinite(parsed) ? parsed : fallback;
}

function buildHybridReportData(data: Pick<ReturnType<typeof useCalculator>, 'slabAnalysis' | 'laje' | 'vigaSecundaria' | 'vigaPrincipal' | 'pilar' | 'sapata' | 'sapataArmadura' | 'budgetItems' | 'supportReactions'>) {
    const { slabAnalysis, laje, vigaSecundaria, vigaPrincipal, pilar, sapata, sapataArmadura, budgetItems, supportReactions } = data;

    const totalSpanX = safeParse(slabAnalysis.spanX);
    const totalSpanY = safeParse(slabAnalysis.spanY);
    const cantileverLeft = safeParse(slabAnalysis.cantileverLeft);
    const cantileverRight = safeParse(slabAnalysis.cantileverRight);
    const cantileverFront = safeParse(slabAnalysis.cantileverFront);
    const cantileverBack = safeParse(slabAnalysis.cantileverBack);

    const missingSteps: string[] = [];
    if (!slabAnalysis.result) missingSteps.push("Geometria");
    if (!laje.result) missingSteps.push("Laje");
    if (!vigaSecundaria.result) missingSteps.push("Viga Secundária");
    if (!vigaPrincipal.result) missingSteps.push("Viga Principal");
    if (!pilar.result) missingSteps.push("Pilar");
    if (!sapata.result) missingSteps.push("Sapata");
    if (!sapataArmadura.result) missingSteps.push("Armadura da Sapata");

    const sections = [
        {
            title: "1. Visão Geral da Estrutura",
            body: [
                `Geometria base considerada: ${formatNumber(totalSpanX)} m em X e ${formatNumber(totalSpanY)} m em Y.`,
                `Balanços informados: X esquerdo ${formatNumber(cantileverLeft)} m, X direito ${formatNumber(cantileverRight)} m, Y superior ${formatNumber(cantileverFront)} m e Y inferior ${formatNumber(cantileverBack)} m.`,
                slabAnalysis.result?.analysis ? `Síntese da geometria: ${slabAnalysis.result.analysis}` : "A análise da geometria ainda não foi executada.",
            ],
        },
        {
            title: "2. Cadeia de Cargas e Transferências",
            body: [
                laje.result
                    ? `Laje steel deck calculada com carga total majorada de ${formatNumber(laje.result.totalLoad, 0)} kgf/m².`
                    : "A carga da laje ainda não foi calculada.",
                vigaSecundaria.result
                    ? `Viga secundária dimensionada em ${vigaSecundaria.result.profile.nome}, com reação máxima estimada de ${formatNumber(supportReactions.vigaSecundaria, 0)} kgf para transferência à viga principal.`
                    : "A viga secundária ainda não foi dimensionada.",
                vigaPrincipal.result
                    ? `Viga principal dimensionada em ${vigaPrincipal.result.profile.nome}, com reação máxima estimada de ${formatNumber(supportReactions.vigaPrincipal, 0)} kgf para transferência ao pilar.`
                    : "A viga principal ainda não foi dimensionada.",
                pilar.result
                    ? `Pilar dimensionado em ${pilar.result.profile.nome}, trabalhando com carga axial de ${formatNumber(supportReactions.pilar, 0)} kgf para a fundação.`
                    : "O pilar ainda não foi dimensionado.",
            ],
        },
        {
            title: "3. Elementos Dimensionados e Fundação",
            body: [
                laje.result?.deck ? `Deck selecionado: ${laje.result.deck.nome}, com concreto de ${laje.concreteThickness} cm.` : "O deck ainda não foi consolidado.",
                sapata.result
                    ? `Sapata pré-dimensionada com lado de ${formatNumber(sapata.result.footingDimensions.sideLengthM)} m e altura recomendada de ${formatNumber(sapata.result.footingDimensions.recommendedHeightCm, 0)} cm.`
                    : "A fundação ainda não foi pré-dimensionada.",
                sapataArmadura.result
                    ? `Armadura sugerida: barras de ${formatNumber(sapataArmadura.result.barDiameter, 1)} mm, espaçamento de ${formatNumber(sapataArmadura.result.barSpacing, 1)} cm e ${formatNumber(sapataArmadura.result.totalBars, 0)} barras por direção.`
                    : "A armadura da sapata ainda não foi calculada.",
                budgetItems.length > 0
                    ? `O orçamento possui ${budgetItems.length} item(ns) estruturais consolidados para revisão de peso e custo.`
                    : "Ainda não há itens lançados no orçamento final.",
            ],
        },
        {
            title: "4. Checklist Normativo Fixo",
            body: [
                "Verificar se as ações permanentes e variáveis adotadas estão coerentes com o uso real da edificação.",
                "Confirmar combinações de ações e fator de segurança compatíveis com o nível de confiabilidade desejado.",
                "Revisar estabilidade global, flechas, ligações, flambagem local e global dos elementos metálicos no projeto executivo.",
                "Conferir detalhamento da sapata, armaduras, cobrimentos, punção e ancoragens antes da execução.",
                "Validar o modelo final com memorial de cálculo e responsabilidade técnica de engenheiro habilitado.",
            ],
        },
    ];

    return {
        sections,
        missingSteps,
        context: {
            geometry: {
                spanX: slabAnalysis.spanX,
                spanY: slabAnalysis.spanY,
                cantileverLeft: slabAnalysis.cantileverLeft,
                cantileverRight: slabAnalysis.cantileverRight,
                cantileverFront: slabAnalysis.cantileverFront,
                cantileverBack: slabAnalysis.cantileverBack,
                localAnalysis: slabAnalysis.result?.analysis ?? null,
            },
            slab: {
                inputs: {
                    selectedDeckId: laje.selectedDeckId,
                    concreteThickness: laje.concreteThickness,
                    extraLoad: laje.extraLoad,
                    safetyFactor: laje.safetyFactor,
                },
                result: laje.result,
                localAnalysis: laje.analysis?.analysis ?? null,
            },
            secondaryBeam: {
                inputs: {
                    span: vigaSecundaria.span,
                    spacing: vigaSecundaria.spacing,
                    slabLoad: vigaSecundaria.slabLoad,
                    distributedLoad: vigaSecundaria.distributedLoad,
                    pointLoad: vigaSecundaria.pointLoad,
                    beamScheme: vigaSecundaria.beamScheme,
                    safetyFactor: vigaSecundaria.safetyFactor,
                },
                result: vigaSecundaria.result,
                localAnalysis: vigaSecundaria.analysis?.analysis ?? null,
            },
            primaryBeam: {
                inputs: {
                    span: vigaPrincipal.span,
                    distributedLoad: vigaPrincipal.distributedLoad,
                    pointLoad: vigaPrincipal.pointLoad,
                    beamScheme: vigaPrincipal.beamScheme,
                    safetyFactor: vigaPrincipal.safetyFactor,
                },
                result: vigaPrincipal.result,
                localAnalysis: vigaPrincipal.analysis?.analysis ?? null,
            },
            column: {
                inputs: {
                    height: pilar.height,
                    additionalHeight: pilar.additionalHeight,
                    axialLoad: pilar.axialLoad,
                    safetyFactor: pilar.safetyFactor,
                },
                result: pilar.result,
                localAnalysis: pilar.analysis?.analysis ?? null,
            },
            footing: {
                inputs: {
                    load: sapata.load,
                    selectedSoil: sapata.selectedSoil,
                    concretePrice: sapata.concretePrice,
                },
                result: sapata.result,
            },
            footingReinforcement: {
                inputs: {
                    concreteStrength: sapataArmadura.concreteStrength,
                    steelStrength: sapataArmadura.steelStrength,
                    barDiameter: sapataArmadura.barDiameter,
                },
                result: sapataArmadura.result,
            },
            supportReactions,
            budgetSummary: {
                itemCount: budgetItems.length,
                items: budgetItems.map((item) => ({
                    type: item.type,
                    perfil: item.perfil?.nome,
                    quantity: item.quantity,
                    totalWeight: item.totalWeight,
                    totalCost: item.totalCost,
                })),
            },
            fixedNormativeReferences: NORMATIVE_REFERENCES,
            missingSteps,
        },
    };
}

function clamp(value: number, min: number, max: number) {
    return Math.min(max, Math.max(min, value));
}

function distanceBetween(a: { x: number; y: number }, b: { x: number; y: number }) {
    return Math.hypot(b.x - a.x, b.y - a.y);
}

function midpointBetween(a: { x: number; y: number }, b: { x: number; y: number }) {
    return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

function ZoomableViewport({ children }: { children: React.ReactNode }) {
    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const pointersRef = React.useRef(new Map<number, { x: number; y: number }>());
    const dragRef = React.useRef<{ startX: number; startY: number; offsetX: number; offsetY: number } | null>(null);
    const pinchRef = React.useRef<{ initialDistance: number; initialScale: number; initialMidpoint: { x: number; y: number }; offsetX: number; offsetY: number } | null>(null);

    const [scale, setScale] = React.useState(1);
    const [offset, setOffset] = React.useState({ x: 0, y: 0 });

    const setScaleClamped = React.useCallback((next: number) => {
        setScale(clamp(next, 1, 4));
    }, []);

    const resetView = React.useCallback(() => {
        setScale(1);
        setOffset({ x: 0, y: 0 });
        dragRef.current = null;
        pinchRef.current = null;
    }, []);

    const handlePointerDown = React.useCallback((event: React.PointerEvent<HTMLDivElement>) => {
        if (event.pointerType === "mouse" && event.button !== 0) return;

        event.currentTarget.setPointerCapture(event.pointerId);
        pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

        if (pointersRef.current.size === 1 && scale > 1) {
            dragRef.current = {
                startX: event.clientX,
                startY: event.clientY,
                offsetX: offset.x,
                offsetY: offset.y,
            };
        }

        if (pointersRef.current.size === 2) {
            const [pointA, pointB] = Array.from(pointersRef.current.values());
            pinchRef.current = {
                initialDistance: distanceBetween(pointA, pointB),
                initialScale: scale,
                initialMidpoint: midpointBetween(pointA, pointB),
                offsetX: offset.x,
                offsetY: offset.y,
            };
            dragRef.current = null;
        }
    }, [offset.x, offset.y, scale]);

    const handlePointerMove = React.useCallback((event: React.PointerEvent<HTMLDivElement>) => {
        if (!pointersRef.current.has(event.pointerId)) return;

        pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

        if (pointersRef.current.size === 2 && pinchRef.current) {
            const [pointA, pointB] = Array.from(pointersRef.current.values());
            const nextDistance = distanceBetween(pointA, pointB);
            const nextMidpoint = midpointBetween(pointA, pointB);
            const nextScale = clamp((nextDistance / pinchRef.current.initialDistance) * pinchRef.current.initialScale, 1, 4);

            setScale(nextScale);
            setOffset({
                x: pinchRef.current.offsetX + (nextMidpoint.x - pinchRef.current.initialMidpoint.x),
                y: pinchRef.current.offsetY + (nextMidpoint.y - pinchRef.current.initialMidpoint.y),
            });
            return;
        }

        if (pointersRef.current.size === 1 && dragRef.current && scale > 1) {
            setOffset({
                x: dragRef.current.offsetX + (event.clientX - dragRef.current.startX),
                y: dragRef.current.offsetY + (event.clientY - dragRef.current.startY),
            });
        }
    }, [scale]);

    const handlePointerUp = React.useCallback((event: React.PointerEvent<HTMLDivElement>) => {
        pointersRef.current.delete(event.pointerId);

        if (pointersRef.current.size < 2) {
            pinchRef.current = null;
        }

        if (pointersRef.current.size === 0) {
            dragRef.current = null;
        }
    }, []);

    const handleWheel = React.useCallback((event: React.WheelEvent<HTMLDivElement>) => {
        event.preventDefault();
        const delta = -event.deltaY * 0.0015;
        setScale((current) => clamp(current + delta, 1, 4));
    }, []);

    React.useEffect(() => {
        if (scale <= 1 && (offset.x !== 0 || offset.y !== 0)) {
            setOffset({ x: 0, y: 0 });
        }
    }, [scale, offset.x, offset.y]);

    return (
        <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border bg-muted/30 px-2 py-1.5 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                    <Move className="h-3.5 w-3.5" />
                    <span>Use dois dedos para zoom, arraste para mover e roda do mouse para aproximar.</span>
                </div>
                <div className="flex items-center gap-1">
                    <Button type="button" variant="outline" size="icon" className="h-7 w-7" onClick={() => setScaleClamped(scale - 0.2)}>
                        <ZoomOut className="h-3.5 w-3.5" />
                    </Button>
                    <div className="min-w-[52px] text-center font-medium text-foreground">{Math.round(scale * 100)}%</div>
                    <Button type="button" variant="outline" size="icon" className="h-7 w-7" onClick={() => setScaleClamped(scale + 0.2)}>
                        <ZoomIn className="h-3.5 w-3.5" />
                    </Button>
                    <Button type="button" variant="outline" size="icon" className="h-7 w-7" onClick={resetView}>
                        <RotateCcw className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </div>

            <div
                ref={containerRef}
                className="relative overflow-hidden rounded-lg border bg-background"
                style={{ touchAction: "none" }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                onPointerLeave={handlePointerUp}
                onWheel={handleWheel}
            >
                <div
                    className="transition-transform duration-75 ease-out select-none"
                    style={{
                        transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
                        transformOrigin: "center center",
                    }}
                >
                    {children}
                </div>
            </div>
        </div>
    );
}

const DrawingText = ({ x, y, children, ...props }: React.SVGProps<SVGTextElement>) => (
    <text x={x} y={y} fontSize="12" fill="hsl(var(--foreground))" textAnchor="middle" {...props}>
        {children}
    </text>
);

const DimensionLine = ({ x1, y1, x2, y2, label, vertical = false, offset = 15 }: { x1: number, y1: number, x2: number, y2: number, label: string, vertical?: boolean, offset?: number }) => {
    const textOffset = 5;
    
    if (vertical) {
        return (
             <g className="text-muted-foreground">
                <line x1={x1 - offset} y1={y1} x2={x1 - offset} y2={y2} stroke="currentColor" strokeWidth="0.5" />
                <line x1={x1 - offset - 3} y1={y1} x2={x1} y2={y1} stroke="currentColor" strokeWidth="0.5" />
                <line x1={x1 - offset - 3} y1={y2} x2={x1} y2={y2} stroke="currentColor" strokeWidth="0.5" />
                <text x={x1 - offset - textOffset} y={(y1 + y2) / 2} fontSize="12" fill="currentColor" textAnchor="end" dominantBaseline="middle">{label}</text>
            </g>
        )
    }

    return (
        <g className="text-muted-foreground">
            <line x1={x1} y1={y1 + offset} x2={x2} y2={y1 + offset} stroke="currentColor" strokeWidth="0.5" />
            <line x1={x1} y1={y1 + offset + 3} x2={x1} y2={y1} stroke="currentColor" strokeWidth="0.5" />
            <line x1={x2} y1={y2 + offset + 3} x2={x2} y2={y2} stroke="currentColor" strokeWidth="0.5" />
            <DrawingText x={(x1 + x2) / 2} y={y1 + offset + textOffset + 5}>{label}</DrawingText>
        </g>
    )
};

const PlanView = () => {
    const { slabAnalysis, vigaPrincipal, vigaSecundaria, pilar } = useCalculator();

    const totalSpanX = parseFloat(slabAnalysis.spanX.replace(',', '.')) || 10;
    const totalSpanY = parseFloat(slabAnalysis.spanY.replace(',', '.')) || 5;
    const cantileverLeft = parseFloat(slabAnalysis.cantileverLeft.replace(',', '.')) || 0;
    const cantileverRight = parseFloat(slabAnalysis.cantileverRight.replace(',', '.')) || 0;
    const cantileverFront = parseFloat(slabAnalysis.cantileverFront.replace(',', '.')) || 0;
    const cantileverBack = parseFloat(slabAnalysis.cantileverBack.replace(',', '.')) || 0;
    const spacingVS = parseFloat((vigaSecundaria.spacing ?? '').replace(',', '.')) || 1.5;
    
    const vigaP_b = (vigaPrincipal.result?.profile.b || 200) / 1000;
    const vigaS_b = (vigaSecundaria.result?.profile.b || 100) / 1000;
    const pilar_b = (pilar.result?.profile.b || 200) / 1000;

    const spanX = totalSpanX - cantileverLeft - cantileverRight;
    const spanY = totalSpanY - cantileverFront - cantileverBack;

    if (spanX <= 0 || spanY <= 0) return <Alert variant="destructive">Dimensões de vão inválidas. Os balanços não podem ser maiores que o vão total.</Alert>;
    
    const scale = Math.min((SVG_WIDTH - 2 * PADDING) / totalSpanX, (SVG_HEIGHT - 2 * PADDING) / totalSpanY);
    const scaledWidth = totalSpanX * scale;
    const scaledHeight = totalSpanY * scale;

    const secondaryBeamSpanCount = spacingVS > 0 ? Math.max(1, Math.ceil(totalSpanX / spacingVS)) : 1;
    const numVigasSecundarias = secondaryBeamSpanCount + 1;
    const realSpacing = (totalSpanX * scale) / secondaryBeamSpanCount;
    
    const xOffset = (SVG_WIDTH - scaledWidth) / 2;
    const yOffset = (SVG_HEIGHT - scaledHeight) / 2;

    const pilarX1 = xOffset + cantileverLeft * scale;
    const pilarX2 = xOffset + (totalSpanX - cantileverRight) * scale;
    const pilarY1 = yOffset + cantileverFront * scale;
    const pilarY2 = yOffset + (totalSpanY - cantileverBack) * scale;
    
    const vigaP_b_scaled = vigaP_b * scale;
    const vigaS_b_scaled = vigaS_b * scale;
    const pilar_b_scaled = pilar_b * scale;

    return (
        <svg viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} className="w-full h-auto">
            {/* Laje */}
            <rect x={xOffset} y={yOffset} width={scaledWidth} height={scaledHeight} fill="hsl(var(--muted) / 0.3)" stroke="hsl(var(--border))" strokeWidth="1" />

             {/* Vigas Principais */}
            <rect x={xOffset} y={pilarY1 - vigaP_b_scaled / 2} width={scaledWidth} height={vigaP_b_scaled} fill="hsl(var(--primary))" />
            <rect x={xOffset} y={pilarY2 - vigaP_b_scaled / 2} width={scaledWidth} height={vigaP_b_scaled} fill="hsl(var(--primary))" />

            {/* Vigas Secundárias */}
              {numVigasSecundarias > 0 && Array.from({ length: numVigasSecundarias }).map((_, i) => (
                  <rect key={i} x={xOffset + i * realSpacing - vigaS_b_scaled / 2} y={yOffset} width={vigaS_b_scaled} height={scaledHeight} fill="hsl(var(--primary) / 0.5)" />
            ))}

            {/* Pilares */}
            <rect x={pilarX1 - pilar_b_scaled / 2} y={pilarY1 - pilar_b_scaled / 2} width={pilar_b_scaled} height={pilar_b_scaled} fill="hsl(var(--foreground))" />
            <rect x={pilarX2 - pilar_b_scaled / 2} y={pilarY1 - pilar_b_scaled / 2} width={pilar_b_scaled} height={pilar_b_scaled} fill="hsl(var(--foreground))" />
            <rect x={pilarX1 - pilar_b_scaled / 2} y={pilarY2 - pilar_b_scaled / 2} width={pilar_b_scaled} height={pilar_b_scaled} fill="hsl(var(--foreground))" />
            <rect x={pilarX2 - pilar_b_scaled / 2} y={pilarY2 - pilar_b_scaled / 2} width={pilar_b_scaled} height={pilar_b_scaled} fill="hsl(var(--foreground))" />

            {/* Dimensions */}
            <DimensionLine x1={xOffset} y1={yOffset} x2={xOffset + scaledWidth} y2={yOffset} label={`Total X: ${totalSpanX.toFixed(2)} m`} offset={-30} />
            {cantileverLeft > 0 && <DimensionLine x1={xOffset} y1={yOffset} x2={pilarX1} y2={yOffset} label={`${cantileverLeft.toFixed(2)}m`} offset={-15} />}
            <DimensionLine x1={pilarX1} y1={yOffset} x2={pilarX2} y2={yOffset} label={`${spanX.toFixed(2)}m`} offset={-15} />
            {cantileverRight > 0 && <DimensionLine x1={pilarX2} y1={yOffset} x2={xOffset + scaledWidth} y2={yOffset} label={`${cantileverRight.toFixed(2)}m`} offset={-15} />}
            
            <DimensionLine x1={xOffset + scaledWidth} y1={yOffset} x2={xOffset + scaledWidth} y2={yOffset + scaledHeight} label={`Total Y: ${totalSpanY.toFixed(2)} m`} offset={45} vertical />
            {cantileverFront > 0 && <DimensionLine x1={xOffset + scaledWidth} y1={yOffset} x2={xOffset + scaledWidth} y2={pilarY1} label={`${cantileverFront.toFixed(2)}m`} offset={20} vertical />}
            <DimensionLine x1={xOffset + scaledWidth} y1={pilarY1} x2={xOffset + scaledWidth} y2={pilarY2} label={`${spanY.toFixed(2)}m`} offset={20} vertical />
            {cantileverBack > 0 && <DimensionLine x1={xOffset + scaledWidth} y1={pilarY2} x2={xOffset + scaledWidth} y2={yOffset + scaledHeight} label={`${cantileverBack.toFixed(2)}m`} offset={20} vertical />}
        </svg>
    );
};

const FrontElevationView = () => {
    const { slabAnalysis, laje, vigaPrincipal, vigaSecundaria, pilar, sapata } = useCalculator();

    const pilarH = parseFloat(pilar.height.replace(',', '.')) || 3;
    const addPilarH = parseFloat((pilar.additionalHeight ?? '').replace(',', '.')) || 0;
    const totalPilarH = pilarH + addPilarH;
    
    const vigaP = vigaPrincipal.result?.profile;
    const vigaPH_m = (vigaP?.h || 300) / 1000;

    const vigaS = vigaSecundaria.result?.profile;
    const vigaSH_m = (vigaS?.h || 200) / 1000;
    
    const pilarProfile = pilar.result?.profile;
    const pilarW_m = (pilarProfile?.b || 200) / 1000;

    const concreteH_cm = parseFloat(laje.concreteThickness.replace(',', '.')) || 12;
    const lajeH_m = vigaSH_m + (concreteH_cm / 100);
    
    const totalSpanX = parseFloat(slabAnalysis.spanX.replace(',', '.')) || 10;
    const cantileverLeft = parseFloat(slabAnalysis.cantileverLeft.replace(',', '.')) || 0;
    const cantileverRight = parseFloat(slabAnalysis.cantileverRight.replace(',', '.')) || 0;
    const spanX = totalSpanX - cantileverLeft - cantileverRight;
    const spacingVS = parseFloat((vigaSecundaria.spacing ?? '').replace(',', '.')) || 1.5;

    const sapataResult = sapata.result?.footingDimensions;
    const sapataH = (sapataResult?.recommendedHeightCm || 30) / 100;
    const sapataW = sapataResult?.sideLengthM || 1.5;

    if (spanX <= 0) return <Alert variant="destructive">Vão X inválido na Aba 1.</Alert>;

    const totalDrawingHeight = totalPilarH + vigaPH_m + lajeH_m + sapataH;
    const scale = Math.min((SVG_WIDTH - 2 * PADDING) / totalSpanX, (SVG_HEIGHT - 2 * PADDING) / totalDrawingHeight);
    
    const scaledSpanX = totalSpanX * scale;
    const xOffset = (SVG_WIDTH - scaledSpanX) / 2;
    
    const pilarHeight = pilarH * scale;
    const pilarWidth = pilarW_m * scale;
    const vigaPHeight = vigaPH_m * scale;
    const sapataHeight = sapataH * scale;
    const sapataWidth = sapataW * scale;

    const baseY = SVG_HEIGHT - PADDING;
    const sapataY = baseY - sapataHeight;
    const pilarBaseY = sapataY;
    const vigaPY = pilarBaseY - pilarHeight;
    const pilarTopoY = vigaPY - (addPilarH * scale);
    
    const pilarX1 = xOffset + cantileverLeft * scale;
    const pilarX2 = xOffset + (totalSpanX - cantileverRight) * scale;
    
    const secondaryBeamSpanCount = spacingVS > 0 ? Math.max(1, Math.ceil(totalSpanX / spacingVS)) : 1;
    const numVigasSecundarias = secondaryBeamSpanCount + 1;
    const realSpacing = (totalSpanX * scale) / secondaryBeamSpanCount;
    
    const vigaS_h_scaled = vigaSH_m * scale;
    const concreteH_scaled = (concreteH_cm / 100) * scale;
    const lajeBaseY = vigaPY-vigaPHeight;

    return (
         <svg viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} className="w-full h-auto">
             <line x1="0" y1={baseY} x2={SVG_WIDTH} y2={baseY} stroke="hsl(var(--foreground))" strokeWidth="1" strokeDasharray="5 5" />
             <DrawingText x={PADDING} y={baseY + 15} textAnchor="start">Nível 0.00</DrawingText>
             
             {/* Sapatas */}
             <rect x={pilarX1 - sapataWidth/2} y={sapataY} width={sapataWidth} height={sapataHeight} fill="hsl(var(--muted))" />
             <rect x={pilarX2 - sapataWidth/2} y={sapataY} width={sapataWidth} height={sapataHeight} fill="hsl(var(--muted))" />
             
             {/* Pilares */}
             <rect x={pilarX1 - pilarWidth/2} y={pilarTopoY} width={pilarWidth} height={totalPilarH * scale} fill="hsl(var(--foreground) / 0.8)" />
             <rect x={pilarX2 - pilarWidth/2} y={pilarTopoY} width={pilarWidth} height={totalPilarH * scale} fill="hsl(var(--foreground) / 0.8)" />

             {/* Viga Principal */}
             <rect x={xOffset} y={vigaPY - vigaPHeight} width={scaledSpanX} height={vigaPHeight} fill="hsl(var(--primary))" />
             
             {/* Laje e Vigas Secundárias em corte */}
             <rect x={xOffset} y={lajeBaseY - concreteH_scaled} width={scaledSpanX} height={concreteH_scaled} fill="hsl(var(--muted)/0.5)" />
             {vigaS && numVigasSecundarias > 0 && Array.from({ length: numVigasSecundarias }).map((_, i) => {
                const vigaSX = xOffset + i * realSpacing;
                const vigaS_b_scaled = (vigaS.b / 1000) * scale;
                const vigaS_tf_scaled = (vigaS.tf / 1000) * scale;
                const vigaS_tw_scaled = (vigaS.tw / 1000) * scale;
                
                return (
                    <g key={i} transform={`translate(${vigaSX}, ${lajeBaseY - vigaS_h_scaled})`}>
                       <rect x={-vigaS_b_scaled/2} y={0} width={vigaS_b_scaled} height={vigaS_tf_scaled} fill="hsl(var(--primary) / 0.6)" />
                       <rect x={-vigaS_tw_scaled/2} y={vigaS_tf_scaled} width={vigaS_tw_scaled} height={vigaS_h_scaled - 2*vigaS_tf_scaled} fill="hsl(var(--primary) / 0.6)" />
                       <rect x={-vigaS_b_scaled/2} y={vigaS_h_scaled - vigaS_tf_scaled} width={vigaS_b_scaled} height={vigaS_tf_scaled} fill="hsl(var(--primary) / 0.6)" />
                    </g>
                )
             })}
             
             {/* Dimensions */}
             <DimensionLine x1={xOffset} y1={vigaPY} x2={xOffset + scaledSpanX} y2={vigaPY} label={`Vão X Total: ${totalSpanX.toFixed(2)}m`} offset={30} />
             {cantileverLeft > 0 && <DimensionLine x1={xOffset} y1={vigaPY} x2={pilarX1} y2={vigaPY} label={`${cantileverLeft.toFixed(2)}m`} offset={10} />}
             <DimensionLine x1={pilarX1} y1={vigaPY} x2={pilarX2} y2={vigaPY} label={`${spanX.toFixed(2)}m`} offset={10} />
             {cantileverRight > 0 && <DimensionLine x1={pilarX2} y1={vigaPY} x2={xOffset+scaledSpanX} y2={vigaPY} label={`${cantileverRight.toFixed(2)}m`} offset={10} />}

             <DimensionLine x1={pilarX1} y1={sapataY} x2={pilarX1} y2={vigaPY} label={`Pé-Direito: ${pilarH.toFixed(2)}m`} offset={-pilarWidth - 5} vertical/>
             {addPilarH > 0 && <DimensionLine x1={pilarX1} y1={pilarTopoY} x2={pilarX1} y2={vigaPY - vigaPHeight} label={`Comp. adicional: ${addPilarH.toFixed(2)}m`} offset={-pilarWidth - 30} vertical/>}
         </svg>
    )
}

const SideElevationView = () => {
    const { slabAnalysis, laje, vigaSecundaria, vigaPrincipal, pilar, sapata } = useCalculator();

    const pilarH = parseFloat(pilar.height.replace(',', '.')) || 3;
    const addPilarH = parseFloat((pilar.additionalHeight ?? '').replace(',', '.')) || 0;
    const totalPilarH = pilarH + addPilarH;
    const deckInfo = laje.result?.deck;
    const deckHeight_mm = deckInfo ? (deckInfo.tipo === 'MD75' ? 75 : 57) : 57;
    const concreteH_cm = parseFloat(laje.concreteThickness.replace(',', '.')) || 12;
    
    const vigaP = vigaPrincipal.result?.profile;
    const vigaPH_m = (vigaP?.h || 300) / 1000;
    const vigaPW_m = (vigaP?.b || 200) / 1000;
    
    const pilarProfile = pilar.result?.profile;
    const pilarW_m = (pilarProfile?.b || 200) / 1000;

    const vigaSH_m = (vigaSecundaria.result?.profile?.h || 200) / 1000;
    
    const lajeH_m = vigaSH_m + (concreteH_cm / 100);
    
    const totalSpanY = parseFloat(slabAnalysis.spanY.replace(',', '.')) || 5;
    const cantileverFront = parseFloat(slabAnalysis.cantileverFront.replace(',', '.')) || 0;
    const cantileverBack = parseFloat(slabAnalysis.cantileverBack.replace(',', '.')) || 0;
    const spanY = totalSpanY - cantileverFront - cantileverBack;

    const sapataResult = sapata.result?.footingDimensions;
    const sapataH = (sapataResult?.recommendedHeightCm || 30) / 100;
    const sapataW = sapataResult?.sideLengthM || 1.5;

    if (spanY <= 0) return <Alert variant="destructive">Vão Y inválido na Aba 1.</Alert>;

    const totalDrawingHeight = totalPilarH + vigaPH_m + lajeH_m + sapataH;
    const scale = Math.min((SVG_WIDTH - 2*PADDING) / totalSpanY, (SVG_HEIGHT - 2*PADDING) / totalDrawingHeight);
    const scaledSpanY = totalSpanY * scale;
    const xOffset = (SVG_WIDTH - scaledSpanY) / 2;
    
    const pilarHeight = pilarH * scale;
    const pilarWidth = pilarW_m * scale;
    const vigaPHeight = vigaPH_m * scale;
    const vigaPWidth = vigaPW_m * scale;
    const sapataHeight = sapataH * scale;
    const sapataWidth = sapataW * scale;

    const baseY = SVG_HEIGHT - PADDING;
    const sapataY = baseY - sapataHeight;
    const pilarBaseY = sapataY;
    const vigaPY = pilarBaseY - pilarHeight;
    const pilarTopoY = vigaPY - (addPilarH * scale);
    const lajeBaseY = vigaPY - vigaPHeight;
    
    const pilarX1 = xOffset + cantileverFront * scale;
    const pilarX2 = xOffset + (totalSpanY - cantileverBack) * scale;
    
    const deckProfilePath = () => {
        let path = ``;
        const waveWidth = 20 * (scale/50); 
        const numWaves = Math.floor(scaledSpanY / waveWidth);
        const waveHeight = (deckHeight_mm / 1000) * scale;
        const concreteHeight = (concreteH_cm / 100) * scale;
        const vigaS_H_scaled = vigaSH_m * scale;

        const deckBaseY = lajeBaseY - vigaS_H_scaled;
        const concreteTop = deckBaseY - concreteHeight;
        
        path += `M ${xOffset},${concreteTop} L ${xOffset + scaledSpanY},${concreteTop} L ${xOffset + scaledSpanY},${deckBaseY} `;

        for (let i = numWaves; i > 0; i--) {
            const x = xOffset + (i-1) * waveWidth;
            path += `L ${x + waveWidth * 0.75},${deckBaseY - waveHeight} `;
            path += `L ${x + waveWidth * 0.25},${deckBaseY - waveHeight} `;
            path += `L ${x},${deckBaseY} `;
        }
        path += `Z`;
        return path;
    };

    return (
        <svg viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} className="w-full h-auto">
             <line x1="0" y1={baseY} x2={SVG_WIDTH} y2={baseY} stroke="hsl(var(--foreground))" strokeWidth="1" strokeDasharray="5 5" />
             <DrawingText x={PADDING} y={baseY + 15} textAnchor="start">Nível 0.00</DrawingText>

            {/* Sapatas */}
            <rect x={pilarX1 - sapataWidth/2} y={sapataY} width={sapataWidth} height={sapataHeight} fill="hsl(var(--muted))" />
            <rect x={pilarX2 - sapataWidth/2} y={sapataY} width={sapataWidth} height={sapataHeight} fill="hsl(var(--muted))" />
            
            {/* Pilares */}
            <rect x={pilarX1 - pilarWidth/2} y={pilarTopoY} width={pilarWidth} height={totalPilarH * scale} fill="hsl(var(--foreground) / 0.8)" />
            <rect x={pilarX2 - pilarWidth/2} y={pilarTopoY} width={pilarWidth} height={totalPilarH * scale} fill="hsl(var(--foreground) / 0.8)" />
            
             {/* Viga Principal (em corte) */}
             {vigaP && <>
                <rect x={pilarX1 - vigaPWidth/2} y={vigaPY - vigaPHeight} width={vigaPWidth} height={(vigaP.tf/1000)*scale} fill="hsl(var(--primary))" />
                <rect x={pilarX1 - (vigaP.tw/1000)*scale/2} y={vigaPY - vigaPHeight + (vigaP.tf/1000)*scale} width={(vigaP.tw/1000)*scale} height={vigaPHeight - 2*(vigaP.tf/1000)*scale} fill="hsl(var(--primary))" />
                <rect x={pilarX1 - vigaPWidth/2} y={vigaPY - (vigaP.tf/1000)*scale} width={vigaPWidth} height={(vigaP.tf/1000)*scale} fill="hsl(var(--primary))" />
                
                <rect x={pilarX2 - vigaPWidth/2} y={vigaPY - vigaPHeight} width={vigaPWidth} height={(vigaP.tf/1000)*scale} fill="hsl(var(--primary))" />
                <rect x={pilarX2 - (vigaP.tw/1000)*scale/2} y={vigaPY - vigaPHeight + (vigaP.tf/1000)*scale} width={(vigaP.tw/1000)*scale} height={vigaPHeight - 2*(vigaP.tf/1000)*scale} fill="hsl(var(--primary))" />
                <rect x={pilarX2 - vigaPWidth/2} y={vigaPY - (vigaP.tf/1000)*scale} width={vigaPWidth} height={(vigaP.tf/1000)*scale} fill="hsl(var(--primary))" />
             </>}
            
             {/* Vigas Secundárias (em elevação) e Laje */}
             <rect x={xOffset} y={lajeBaseY - vigaSH_m * scale} width={scaledSpanY} height={vigaSH_m * scale} fill="hsl(var(--primary)/0.6)" />
             <path d={deckProfilePath()} fill="hsl(var(--muted)/0.7)" stroke="hsl(var(--border))" strokeWidth="0.5" />
            
            <DimensionLine x1={xOffset} y1={lajeBaseY} x2={pilarX1} y2={lajeBaseY} label={`${cantileverFront.toFixed(2)}m`} offset={10} />
            <DimensionLine x1={pilarX1} y1={lajeBaseY} x2={pilarX2} y2={lajeBaseY} label={`${spanY.toFixed(2)}m`} offset={10} />
            {cantileverBack > 0 && <DimensionLine x1={pilarX2} y1={lajeBaseY} x2={xOffset+scaledSpanY} y2={lajeBaseY} label={`${cantileverBack.toFixed(2)}m`} offset={10} />}

            <DrawingText x={SVG_WIDTH / 2} y={baseY + 25}>Elevação Lateral (Vista ao longo do Eixo X)</DrawingText>
        </svg>
    )
}

const SectionCutView = () => {
    const { laje, vigaSecundaria } = useCalculator();
    const deckInfo = laje.result?.deck;
    const concreteH_cm = parseFloat(laje.concreteThickness.replace(',', '.')) || 12;
    const vigaS = vigaSecundaria.result?.profile;
    const sectionWidth_m = Math.max(parseFloat((vigaSecundaria.spacing ?? '').replace(',', '.')) || 1.5, 0.6);

    const deckHeight_mm = (deckInfo?.tipo === 'MD75' ? 75 : 57);
    const totalHeight = deckHeight_mm + concreteH_cm * 10;
    const sectionWidth_mm = sectionWidth_m * 1000;

    const scale = Math.min((SVG_WIDTH - 2*PADDING) / sectionWidth_mm, (SVG_HEIGHT - 2*PADDING) / totalHeight);
    const sectionWidthScaled = sectionWidth_mm * scale;
    const xOffset = (SVG_WIDTH - sectionWidthScaled) / 2;
    
    const vigaS_h = (vigaS?.h || 200);
    const vigaS_b = (vigaS?.b || 100);
    const vigaS_tf = (vigaS?.tf || 8.5);
    const vigaS_tw = (vigaS?.tw || 5.6);

    const scaled_vigaS_h = vigaS_h * scale;
    const scaled_vigaS_b = vigaS_b * scale;
    const scaled_vigaS_tf = vigaS_tf * scale;
    const scaled_vigaS_tw = vigaS_tw * scale;

    const concreteHeight = concreteH_cm * 10 * scale;
    const deck_h_scaled = deckHeight_mm * scale;

    const baseY = SVG_HEIGHT - PADDING;
    const vigaY = baseY - scaled_vigaS_h;
    const deckTopY = vigaY;
    const concreteTopY = deckTopY - deck_h_scaled;
    const centerX = xOffset + sectionWidthScaled / 2;
    
    const deckPoints = [
        { x: xOffset, y: deckTopY },
        { x: xOffset + sectionWidthScaled, y: deckTopY },
        { x: xOffset + sectionWidthScaled, y: concreteTopY },
        { x: xOffset, y: concreteTopY },
    ].map(p => `${p.x},${p.y}`).join(' ');

    return (
        <svg viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} className="w-full h-auto">
            {/* Viga Secundária em Corte */}
            {vigaS && <>
                <rect x={centerX - scaled_vigaS_b/2} y={vigaY} width={scaled_vigaS_b} height={scaled_vigaS_tf} fill="hsl(var(--primary)/0.6)" />
                <rect x={centerX - scaled_vigaS_tw/2} y={vigaY + scaled_vigaS_tf} width={scaled_vigaS_tw} height={scaled_vigaS_h - 2 * scaled_vigaS_tf} fill="hsl(var(--primary)/0.6)" />
                <rect x={centerX - scaled_vigaS_b/2} y={vigaY + scaled_vigaS_h - scaled_vigaS_tf} width={scaled_vigaS_b} height={scaled_vigaS_tf} fill="hsl(var(--primary)/0.6)" />
                <DrawingText x={centerX} y={baseY + 15}>{vigaS.nome}</DrawingText>
            </>}

            {/* Steel Deck */}
            {deckInfo && <polygon points={deckPoints} fill="url(#deck-pattern)" stroke="hsl(var(--border))" />}

            {/* Concreto */}
            <rect x={xOffset} y={concreteTopY - concreteHeight} width={sectionWidthScaled} height={concreteHeight} fill="hsl(var(--muted))" />

            <defs>
                <pattern id="deck-pattern" width="10" height="10" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
                    <line x1="0" y1="0" x2="0" y2="10" stroke="hsl(var(--border))" strokeWidth="1" />
                </pattern>
            </defs>

            {/* Labels */}
            <DimensionLine x1={xOffset-10} y1={concreteTopY - concreteHeight} x2={xOffset-10} y2={concreteTopY} label={`${concreteH_cm} cm`} vertical offset={-15} />
            <DimensionLine x1={xOffset-10} y1={deckTopY - deck_h_scaled} x2={xOffset-10} y2={deckTopY} label={`${deckHeight_mm} mm`} vertical offset={-15}/>
            <DimensionLine x1={xOffset} y1={deckTopY} x2={xOffset + sectionWidthScaled} y2={deckTopY} label={`Faixa analisada: ${sectionWidth_m.toFixed(2)}m`} offset={20} />
        </svg>
    )
}

export function StructuralVisualizer() {
    const calculator = useCalculator();
    const { toast } = useToast();
    const [isAiAnalyzing, setIsAiAnalyzing] = React.useState(false);
    const [aiAnalysis, setAiAnalysis] = React.useState<string | null>(null);
    const [aiError, setAiError] = React.useState<string | null>(null);

    const reportSource = React.useMemo(() => {
        if (!calculator.finalSnapshot) {
            return {
                slabAnalysis: calculator.slabAnalysis,
                laje: calculator.laje,
                vigaSecundaria: calculator.vigaSecundaria,
                vigaPrincipal: calculator.vigaPrincipal,
                pilar: calculator.pilar,
                sapata: calculator.sapata,
                sapataArmadura: calculator.sapataArmadura,
                budgetItems: calculator.budgetItems,
                supportReactions: calculator.supportReactions,
            };
        }

        return {
            ...calculator.finalSnapshot.calculatorState,
            budgetItems: calculator.finalSnapshot.budgetItems,
            supportReactions: calculator.finalSnapshot.supportReactions,
        };
    }, [calculator]);

    const hybridReport = React.useMemo(() => buildHybridReportData(reportSource), [reportSource]);

    const snapshotCapturedAt = calculator.finalSnapshot
        ? new Intl.DateTimeFormat("pt-BR", {
              dateStyle: "short",
              timeStyle: "short",
          }).format(new Date(calculator.finalSnapshot.capturedAt))
        : null;

    const handleAnalyzeWithAI = async () => {
        const aiSettings = getAiSettings();
        if (aiSettings.provider === "local") {
            toast({ variant: "destructive", title: "IA não configurada", description: "Configure um provedor de IA em Ferramentas > Configurações." });
            return;
        }

        setIsAiAnalyzing(true);
        setAiAnalysis(null);
        setAiError(null);

        try {
            const response = await fetch("/api/ai-compare", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    analysisType: "estrutura-completa",
                    context: {
                        reportSections: hybridReport.sections,
                        ...hybridReport.context,
                    },
                    ...(aiSettings.apiKey.trim() ? { apiKey: aiSettings.apiKey.trim() } : {}),
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data?.error || "IA indisponivel nesta versao/dispositivo.");
            }

            setAiAnalysis(data.analysis);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Falha ao consultar IA.";
            setAiError(message);
        } finally {
            setIsAiAnalyzing(false);
        }
    };

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Visualização Estrutural</CardTitle>
                    <CardDescription>Esquema simplificado da estrutura dimensionada. Todos os valores são baseados nos dados das abas anteriores.</CardDescription>
                </CardHeader>
                <CardContent>
                    {calculator.isStepStale('visualizacao') && (
                        <StaleStepAlert
                            title="Visualização final com dependências desatualizadas"
                            description="Uma ou mais etapas anteriores mudaram. As vistas continuam exibidas, mas o relatório final só deve ser congelado após recalcular as etapas marcadas."
                        />
                    )}
                    <Tabs defaultValue="plan">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="plan">Planta</TabsTrigger>
                            <TabsTrigger value="elevation-front">Elev. Frontal</TabsTrigger>
                            <TabsTrigger value="elevation-side">Elev. Lateral</TabsTrigger>
                            <TabsTrigger value="section-cut">Corte</TabsTrigger>
                        </TabsList>
                        <TabsContent value="plan">
                            <Card className="mt-2">
                                <CardContent className="p-2">
                                    <ZoomableViewport>
                                        <PlanView />
                                    </ZoomableViewport>
                                    <Alert variant="default" className="mt-2">
                                        <Info className="h-4 w-4" />
                                        <AlertTitle>Legenda</AlertTitle>
                                        <AlertDescription>
                                            <div className="flex flex-wrap items-center gap-4 text-xs">
                                                <div className="flex items-center gap-1"><div className="h-2 w-4 bg-primary"/>Viga Principal</div>
                                                <div className="flex items-center gap-1"><div className="h-2 w-4 bg-primary/50"/>Viga Secundária</div>
                                                <div className="flex items-center gap-1"><div className="h-2 w-2 bg-foreground"/>Pilar</div>
                                            </div>
                                        </AlertDescription>
                                    </Alert>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="elevation-front">
                            <Card className="mt-2">
                                <CardContent className="p-2">
                                    <ZoomableViewport>
                                        <FrontElevationView />
                                    </ZoomableViewport>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="elevation-side">
                            <Card className="mt-2">
                                <CardContent className="p-2">
                                    <ZoomableViewport>
                                        <SideElevationView />
                                    </ZoomableViewport>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="section-cut">
                            <Card className="mt-2">
                                <CardContent className="p-2">
                                    <ZoomableViewport>
                                        <SectionCutView />
                                    </ZoomableViewport>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Relatório Técnico Híbrido</CardTitle>
                    <CardDescription>
                        Consolidação técnica da calculadora com base fixa do aplicativo, checklist normativo guiado e complemento opcional por IA.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-wrap items-center gap-2 border-b pb-4">
                        <RefinedButton type="button" onClick={() => calculator.captureFinalSnapshot()} className="gap-2">
                            <Camera className="h-4 w-4" />
                            {calculator.finalSnapshot ? 'Atualizar snapshot final' : 'Congelar snapshot final'}
                        </RefinedButton>
                        {calculator.finalSnapshot && (
                            <Button type="button" variant="outline" onClick={calculator.clearFinalSnapshot} className="gap-2">
                                <RefreshCcw className="h-4 w-4" />
                                Voltar ao modo ao vivo
                            </Button>
                        )}
                        <div className="text-sm text-muted-foreground">
                            {calculator.finalSnapshot
                                ? `Relatório congelado em ${snapshotCapturedAt}. As vistas continuam ao vivo.`
                                : 'Sem snapshot: o relatório abaixo reflete os dados atuais da calculadora.'}
                        </div>
                    </div>

                    {hybridReport.missingSteps.length > 0 && (
                        <Alert>
                            <Info className="h-4 w-4" />
                            <AlertTitle>Etapas ainda não concluídas</AlertTitle>
                            <AlertDescription>
                                O relatório já pode ser lido, mas ficará mais completo após finalizar: {hybridReport.missingSteps.join(", ")}.
                            </AlertDescription>
                        </Alert>
                    )}

                    {hybridReport.sections.map((section) => (
                        <Card key={section.title} className="border-primary/10 bg-primary/5">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base">{section.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="list-disc space-y-2 pl-5 text-sm text-foreground">
                                    {section.body.map((item) => (
                                        <li key={item}>{item}</li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    ))}

                    <Alert>
                        <GitCompareArrows className="h-4 w-4" />
                        <AlertTitle>Referências normativas para conferência</AlertTitle>
                        <AlertDescription>
                            <ul className="list-disc space-y-1 pl-5 text-sm">
                                {NORMATIVE_REFERENCES.map((reference) => (
                                    <li key={reference}>{reference}</li>
                                ))}
                            </ul>
                        </AlertDescription>
                    </Alert>

                    <div className="flex flex-col gap-3 border-t pt-4">
                        <RefinedButton type="button" onClick={handleAnalyzeWithAI} className="w-full md:w-auto gap-2" disabled={isAiAnalyzing}>
                            {isAiAnalyzing ? <><Loader className="animate-spin mr-2"/> Gerando relatório por IA...</> : <><Sparkles className="mr-2"/> Gerar Complemento Técnico por IA</>}
                        </RefinedButton>

                        {isAiAnalyzing && (
                            <div className="text-sm text-muted-foreground">A IA está consolidando os dados da geometria, laje, vigas, pilar, sapata e armadura para emitir um parecer complementar.</div>
                        )}

                        {aiError && (
                            <Alert variant="destructive">
                                <AlertTitle>Falha ao consultar IA</AlertTitle>
                                <AlertDescription>{aiError}</AlertDescription>
                            </Alert>
                        )}

                        {aiAnalysis && (
                            <Alert>
                                <Sparkles className="h-4 w-4" />
                                <AlertTitle>Parecer Complementar por IA</AlertTitle>
                                <AlertDescription className="whitespace-pre-line">{aiAnalysis}</AlertDescription>
                            </Alert>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
