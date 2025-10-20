"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useCalculator } from "@/app/perfis/calculadora/CalculatorContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, GitCompareArrows } from "lucide-react";

const SVG_WIDTH = 800;
const SVG_HEIGHT = 500;

const DrawingText = ({ x, y, children, ...props }: React.SVGProps<SVGTextElement>) => (
    <text x={x} y={y} fontSize="12" fill="hsl(var(--foreground))" textAnchor="middle" {...props}>
        {children}
    </text>
);

const DimensionLine = ({ x1, y1, x2, y2, label, vertical = false }: { x1: number, y1: number, x2: number, y2: number, label: string, vertical?: boolean }) => {
    const offset = 15;
    return (
        <g className="text-muted-foreground">
            {/* Dimension Line */}
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="0.5" />
            {/* Ticks */}
            <line x1={x1} y1={y1 - 3} x2={x1} y2={y1 + 3} stroke="currentColor" strokeWidth="0.5" />
            <line x1={x2} y1={y2 - 3} x2={x2} y2={y2 + 3} stroke="currentColor" strokeWidth="0.5" />
            {/* Label */}
            <DrawingText x={(x1 + x2) / 2} y={y1 - 5}>{label}</DrawingText>
        </g>
    )
};

const PlanView = () => {
    const { slabAnalysis, vigaSecundaria } = useCalculator();

    const spanX = parseFloat(slabAnalysis.spanX.replace(',', '.')) || 10;
    const spanY = parseFloat(slabAnalysis.spanY.replace(',', '.')) || 5;
    const spacingVS = parseFloat(vigaSecundaria.spacing?.replace(',', '.')) || 1.5;
    
    if (spanX <= 0 || spanY <= 0) return <Alert variant="destructive">Dimensões de vão inválidas na Aba 1.</Alert>;

    const scale = Math.min(SVG_WIDTH * 0.9 / spanX, SVG_HEIGHT * 0.9 / spanY);
    const scaledWidth = spanX * scale;
    const scaledHeight = spanY * scale;

    const numVigasSecundarias = spacingVS > 0 ? Math.floor(scaledWidth / (spacingVS*scale)) : 0;
    const realSpacing = numVigasSecundarias > 1 ? scaledWidth / numVigasSecundarias : 0;


    const xOffset = (SVG_WIDTH - scaledWidth) / 2;
    const yOffset = (SVG_HEIGHT - scaledHeight) / 2;

    return (
        <svg viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} className="w-full h-auto">
            {/* Laje */}
            <rect x={xOffset} y={yOffset} width={scaledWidth} height={scaledHeight} fill="hsl(var(--muted) / 0.3)" stroke="hsl(var(--border))" strokeWidth="1" />

            {/* Vigas Secundárias */}
            {numVigasSecundarias > 0 && Array.from({ length: numVigasSecundarias + 1 }).map((_, i) => (
                <line key={i} x1={xOffset + i * realSpacing} y1={yOffset} x2={xOffset + i * realSpacing} y2={yOffset + scaledHeight} stroke="hsl(var(--primary) / 0.5)" strokeWidth="2" />
            ))}

            {/* Vigas Principais */}
            <line x1={xOffset} y1={yOffset} x2={xOffset + scaledWidth} y2={yOffset} stroke="hsl(var(--primary))" strokeWidth="4" />
            <line x1={xOffset} y1={yOffset + scaledHeight} x2={xOffset + scaledWidth} y2={yOffset + scaledHeight} stroke="hsl(var(--primary))" strokeWidth="4" />

            {/* Pilares */}
            <rect x={xOffset - 5} y={yOffset - 5} width="10" height="10" fill="hsl(var(--foreground))" />
            <rect x={xOffset + scaledWidth - 5} y={yOffset - 5} width="10" height="10" fill="hsl(var(--foreground))" />
            <rect x={xOffset - 5} y={yOffset + scaledHeight - 5} width="10" height="10" fill="hsl(var(--foreground))" />
            <rect x={xOffset + scaledWidth - 5} y={yOffset + scaledHeight - 5} width="10" height="10" fill="hsl(var(--foreground))" />

            {/* Dimensions */}
            <DimensionLine x1={xOffset} y1={yOffset - 20} x2={xOffset + scaledWidth} y2={yOffset - 20} label={`Vão X: ${spanX} m`} />
            <DimensionLine x1={xOffset + scaledWidth + 35} y1={yOffset} x2={xOffset + scaledWidth + 35} y2={yOffset + scaledHeight} label={`Vão Y: ${spanY} m`} />
            {numVigasSecundarias > 1 && <DimensionLine x1={xOffset} y1={yOffset + scaledHeight + 20} x2={xOffset + realSpacing} y2={yOffset + scaledHeight + 20} label={`~${spacingVS} m`} />}
        </svg>
    );
};

const FrontElevationView = () => {
    const { slabAnalysis, laje, vigaSecundaria, vigaPrincipal, pilar, sapata } = useCalculator();

    const pilarH = parseFloat(pilar.height.replace(',', '.')) || 3;
    const lajeH = parseFloat(laje.concreteThickness.replace(',', '.')) / 100 || 0.12;
    const vigaPH = (vigaPrincipal.result?.profile.h || 300) / 1000;
    const vigaSH = (vigaSecundaria.result?.profile.h || 200) / 1000;
    const spanY = parseFloat(slabAnalysis.spanY.replace(',', '.')) || 5;

    const sapataResult = sapata.result?.footingDimensions;
    const sapataH = (sapataResult?.recommendedHeightCm || 30) / 100;
    const sapataW = sapataResult?.sideLengthM || 1.5;
    
    if (spanY <= 0) return <Alert variant="destructive">Vão Y inválido na Aba 1.</Alert>;

    const totalHeight = pilarH + vigaPH + sapataH;
    const scale = Math.min(SVG_WIDTH * 0.9 / spanY, SVG_HEIGHT * 0.9 / totalHeight);
    
    const scaledSpan = spanY * scale;
    const xOffset = (SVG_WIDTH - scaledSpan) / 2;
    
    const pilarHeight = pilarH * scale;
    const vigaPHeight = vigaPH * scale;
    const sapataHeight = sapataH * scale;
    const sapataWidth = sapataW * scale;
    
    const baseY = SVG_HEIGHT - 30;
    const sapataY = baseY - sapataHeight;
    const pilarY = sapataY - pilarHeight;
    const vigaPY = pilarY - vigaPHeight;

    return (
         <svg viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} className="w-full h-auto">
             {/* Sapatas */}
             <rect x={xOffset - sapataWidth/2} y={sapataY} width={sapataWidth} height={sapataHeight} fill="hsl(var(--muted))" />
             <rect x={xOffset + scaledSpan - sapataWidth/2} y={sapataY} width={sapataWidth} height={sapataHeight} fill="hsl(var(--muted))" />
             
             {/* Pilares */}
             <rect x={xOffset - 10} y={pilarY} width="20" height={pilarHeight} fill="hsl(var(--foreground) / 0.8)" />
             <rect x={xOffset + scaledSpan - 10} y={pilarY} width="20" height={pilarHeight} fill="hsl(var(--foreground) / 0.8)" />

             {/* Viga Principal */}
             <rect x={xOffset - 10} y={vigaPY} width={scaledSpan + 20} height={vigaPHeight} fill="hsl(var(--primary))" />
             
             {/* Base */}
             <line x1="0" y1={baseY} x2={SVG_WIDTH} y2={baseY} stroke="hsl(var(--foreground))" strokeWidth="1" />
             <path d={`M ${xOffset - 20 - sapataWidth/2} ${baseY} L ${xOffset - 30 - sapataWidth/2} ${baseY+10} L ${xOffset - 10 - sapataWidth/2} ${baseY+10} Z`} fill="hsl(var(--foreground)/0.5)" />
             <path d={`M ${xOffset + scaledSpan + 20 - sapataWidth/2} ${baseY} L ${xOffset + scaledSpan + 10 - sapataWidth/2} ${baseY+10} L ${xOffset + scaledSpan + 30 - sapataWidth/2} ${baseY+10} Z`} fill="hsl(var(--foreground)/0.5)" />


             {/* Labels */}
             <DrawingText x={xOffset + scaledSpan / 2} y={vigaPY + vigaPHeight / 2} fill="hsl(var(--primary-foreground))">{vigaPrincipal.result?.profile.nome || "Viga Principal"}</DrawingText>
             <DrawingText x={xOffset - 40} y={pilarY + pilarHeight / 2} transform={`rotate(-90, ${xOffset-40}, ${pilarY + pilarHeight/2})`}>Pilar: {pilar.result?.profile.nome || "N/C"} (H: {pilar.height}m)</DrawingText>
             <DrawingText x={SVG_WIDTH / 2} y={baseY + 15}>Elevação Frontal (Vista ao longo do Eixo X)</DrawingText>
         </svg>
    )
}

const SideElevationView = () => {
    const { slabAnalysis, laje, vigaSecundaria, vigaPrincipal, pilar, sapata } = useCalculator();

    const pilarH = parseFloat(pilar.height.replace(',', '.')) || 3;
    const lajeH = (laje.result?.deck ? (laje.result.deck.tipo === 'MD75' ? 7.5 : 5.7) : 5.7) + (parseFloat(laje.concreteThickness.replace(',', '.')) || 12);
    const vigaPH = (vigaPrincipal.result?.profile.h || 300) / 1000;
    const vigaSH = (vigaSecundaria.result?.profile.h || 200) / 1000;
    const vigaSW = (vigaSecundaria.result?.profile.b || 100) / 1000;
    const spanX = parseFloat(slabAnalysis.spanX.replace(',', '.')) || 10;
    const spacingVS = parseFloat(vigaSecundaria.spacing?.replace(',', '.')) || 1.5;

    const sapataResult = sapata.result?.footingDimensions;
    const sapataH = (sapataResult?.recommendedHeightCm || 30) / 100;
    const sapataW = sapataResult?.sideLengthM || 1.5;


    if (spanX <= 0) return <Alert variant="destructive">Vão X inválido na Aba 1.</Alert>;

    const totalHeight = pilarH + vigaPH + sapataH;
    const scale = Math.min(SVG_WIDTH * 0.9 / spanX, SVG_HEIGHT * 0.9 / totalHeight);
    const scaledSpan = spanX * scale;
    const xOffset = (SVG_WIDTH - scaledSpan) / 2;

    const numVigasSecundarias = spacingVS > 0 ? Math.floor(spanX / spacingVS) + 1 : 0;
    const realSpacing = numVigasSecundarias > 1 ? scaledSpan / (numVigasSecundarias - 1) : 0;

    const pilarHeight = pilarH * scale;
    const vigaPHeight = vigaPH * scale;
    const vigaSHeight = vigaSH * scale;
    const vigaSWidth = vigaSW * scale;
    const lajeHeight = lajeH / 100 * scale;

    const sapataHeight = sapataH * scale;
    const sapataWidth = sapataW * scale;

    const baseY = SVG_HEIGHT - 30;
    const sapataY = baseY - sapataHeight;
    const pilarY = sapataY - pilarHeight;
    const vigaPY = pilarY - vigaPHeight;
    const vigaSY = vigaPY - vigaSHeight;
    const lajeY = vigaSY - lajeHeight;

    return (
        <svg viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} className="w-full h-auto">
            {/* Sapatas */}
            <rect x={xOffset - sapataWidth/2} y={sapataY} width={sapataWidth} height={sapataHeight} fill="hsl(var(--muted))" />
            <rect x={xOffset + scaledSpan - sapataWidth/2} y={sapataY} width={sapataWidth} height={sapataHeight} fill="hsl(var(--muted))" />
            
            {/* Pilares nos cantos */}
            <rect x={xOffset - 10} y={pilarY} width="20" height={pilarHeight} fill="hsl(var(--foreground) / 0.8)" />
            <rect x={xOffset + scaledSpan - 10} y={pilarY} width="20" height={pilarHeight} fill="hsl(var(--foreground) / 0.8)" />
            
             {/* Viga Principal (em vista de elevação) */}
            <rect x={xOffset} y={vigaPY} width={scaledSpan} height={vigaPHeight} fill="hsl(var(--primary))" />
            
            {/* Laje */}
            <rect x={xOffset} y={vigaSY - lajeHeight} width={scaledSpan} height={lajeHeight} fill="hsl(var(--muted)/0.7)" />

            {/* Vigas Secundárias (em corte) */}
            {numVigasSecundarias > 0 && Array.from({ length: numVigasSecundarias }).map((_, i) => (
                <rect
                    key={i}
                    x={xOffset + i * realSpacing - (vigaSWidth / 2)}
                    y={vigaSY}
                    width={vigaSWidth}
                    height={vigaSHeight}
                    fill="hsl(var(--primary) / 0.6)"
                    stroke="hsl(var(--border))"
                    strokeWidth="0.5"
                />
            ))}
            
            {/* Base */}
            <line x1="0" y1={baseY} x2={SVG_WIDTH} y2={baseY} stroke="hsl(var(--foreground))" strokeWidth="1" />
            <DrawingText x={SVG_WIDTH / 2} y={baseY + 15}>Elevação Lateral (Vista ao longo do Eixo Y)</DrawingText>
        </svg>
    )
}

const SectionCutView = () => {
    const { laje, vigaSecundaria } = useCalculator();
    const deckInfo = laje.result?.deck;
    const concreteH = parseFloat(laje.concreteThickness.replace(',', '.')) || 12;
    const vigaS = vigaSecundaria.result?.profile;

    const deckHeight = (deckInfo?.tipo === 'MD75' ? 75 : 57);
    const totalHeight = deckHeight + concreteH;

    const scale = Math.min(SVG_WIDTH * 0.9 / 500, SVG_HEIGHT * 0.9 / totalHeight);
    const xOffset = 100;
    let currentY = SVG_HEIGHT - 50;

    const vigaS_h = (vigaS?.h || 200);
    const vigaS_b = (vigaS?.b || 100);
    const vigaS_tf = (vigaS?.tf || 8.5);
    const vigaS_tw = (vigaS?.tw || 5.6);

    const scaled_vigaS_h = vigaS_h * scale;
    const scaled_vigaS_b = vigaS_b * scale;
    const scaled_vigaS_tf = vigaS_tf * scale;
    const scaled_vigaS_tw = vigaS_tw * scale;

    const concreteHeight = concreteH * scale;
    const deck_h_scaled = deckHeight * scale;

    const vigaY = currentY - scaled_vigaS_h;
    const deckY = vigaY - deck_h_scaled;
    const concreteY = deckY - concreteHeight;

    const deckPoints = [
        { x: xOffset, y: vigaY }, { x: xOffset, y: deckY }, { x: xOffset + 400, y: deckY }, { x: xOffset + 400, y: vigaY }
    ].map(p => `${p.x},${p.y}`).join(' ');

    return (
        <svg viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} className="w-full h-auto">
            {/* Viga Secundária em Corte */}
            {vigaS && <>
                <rect x={xOffset + 200 - scaled_vigaS_b/2} y={vigaY} width={scaled_vigaS_b} height={scaled_vigaS_tf} fill="hsl(var(--primary)/0.6)" />
                <rect x={xOffset + 200 - scaled_vigaS_tw/2} y={vigaY + scaled_vigaS_tf} width={scaled_vigaS_tw} height={scaled_vigaS_h - 2 * scaled_vigaS_tf} fill="hsl(var(--primary)/0.6)" />
                <rect x={xOffset + 200 - scaled_vigaS_b/2} y={vigaY + scaled_vigaS_h - scaled_vigaS_tf} width={scaled_vigaS_b} height={scaled_vigaS_tf} fill="hsl(var(--primary)/0.6)" />
                <DrawingText x={xOffset + 200} y={currentY + 15}>{vigaS.nome}</DrawingText>
            </>}

            {/* Steel Deck */}
            {deckInfo && <polygon points={deckPoints} fill="url(#deck-pattern)" stroke="hsl(var(--border))" />}

            {/* Concreto */}
            <rect x={xOffset} y={concreteY} width="400" height={concreteHeight} fill="hsl(var(--muted))" />

            {/* SVG Defs for patterns */}
            <defs>
                <pattern id="deck-pattern" width="10" height="10" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
                    <line x1="0" y1="0" x2="0" y2="10" stroke="hsl(var(--border))" strokeWidth="1" />
                </pattern>
            </defs>

            {/* Labels */}
            <DrawingText x={xOffset - 40} y={concreteY + concreteHeight/2}>Concreto ({laje.concreteThickness} cm)</DrawingText>
            <DrawingText x={xOffset - 40} y={deckY + deck_h_scaled/2}>Steel Deck ({deckInfo?.nome || 'N/A'})</DrawingText>
        </svg>
    )
}

export function StructuralVisualizer() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Visualização Estrutural</CardTitle>
                <CardDescription>Esquema simplificado da estrutura dimensionada. Todos os valores são baseados nos dados das abas anteriores.</CardDescription>
            </CardHeader>
            <CardContent>
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
                                <PlanView />
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
                                <FrontElevationView />
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="elevation-side">
                         <Card className="mt-2">
                            <CardContent className="p-2">
                                <SideElevationView />
                            </CardContent>
                        </Card>
                    </TabsContent>
                     <TabsContent value="section-cut">
                         <Card className="mt-2">
                            <CardContent className="p-2">
                                <SectionCutView />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
