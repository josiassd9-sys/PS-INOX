
"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useCalculator } from "@/app/perfis/calculadora/CalculatorContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

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
    const { slabAnalysis, vigaSecundaria, vigaPrincipal, pilar } = useCalculator();

    const spanX = parseFloat(slabAnalysis.spanX.replace(',', '.')) || 10;
    const spanY = parseFloat(slabAnalysis.spanY.replace(',', '.')) || 5;
    const spacingVS = parseFloat(vigaSecundaria.spacing?.replace(',', '.')) || 1.5;
    
    const scale = Math.min(SVG_WIDTH * 0.9 / spanX, SVG_HEIGHT * 0.9 / spanY);
    const scaledWidth = spanX * scale;
    const scaledHeight = spanY * scale;

    const numVigasSecundarias = Math.floor(spanX / spacingVS) + 1;

    const xOffset = (SVG_WIDTH - scaledWidth) / 2;
    const yOffset = (SVG_HEIGHT - scaledHeight) / 2;

    return (
        <svg viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} className="w-full h-auto">
            {/* Laje */}
            <rect x={xOffset} y={yOffset} width={scaledWidth} height={scaledHeight} fill="hsl(var(--muted) / 0.3)" stroke="hsl(var(--border))" strokeWidth="1" />

            {/* Vigas Secundárias */}
            {Array.from({ length: numVigasSecundarias }).map((_, i) => (
                <line key={i} x1={xOffset + i * spacingVS * scale} y1={yOffset} x2={xOffset + i * spacingVS * scale} y2={yOffset + scaledHeight} stroke="hsl(var(--primary) / 0.5)" strokeWidth="2" />
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
             <DimensionLine x1={xOffset} y1={yOffset + scaledHeight + 20} x2={xOffset + spacingVS * scale} y2={yOffset + scaledHeight + 20} label={`${spacingVS} m`} />
        </svg>
    );
};

const ElevationView = () => {
    const { slabAnalysis, laje, vigaSecundaria, vigaPrincipal, pilar } = useCalculator();

    const pilarH = parseFloat(pilar.height.replace(',', '.')) || 3;
    const lajeH = parseFloat(laje.concreteThickness.replace(',', '.')) / 100 || 0.12;
    const vigaPH = (vigaPrincipal.result?.profile.h || 300) / 1000;
    const vigaSH = (vigaSecundaria.result?.profile.h || 200) / 1000;
    const spanY = parseFloat(slabAnalysis.spanY.replace(',', '.')) || 5;

    const totalHeight = pilarH + vigaPH + vigaSH + lajeH;
    const scale = Math.min(SVG_WIDTH * 0.9 / spanY, SVG_HEIGHT * 0.9 / totalHeight);
    const scaledSpan = spanY * scale;
    const xOffset = (SVG_WIDTH - scaledSpan) / 2;
    
    let currentY = SVG_HEIGHT - 30;
    
    const pilarHeight = pilarH * scale;
    const vigaPHeight = vigaPH * scale;
    const vigaSHeight = vigaSH * scale;
    const lajeHeight = lajeH * scale;
    
    const pilarY = currentY - pilarHeight;
    const vigaPY = pilarY - vigaPHeight;
    const vigaSY = vigaPY - vigaSHeight;
    const lajeY = vigaSY - lajeHeight;
    
    return (
         <svg viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} className="w-full h-auto">
             {/* Pilares */}
             <rect x={xOffset - 10} y={pilarY} width="20" height={pilarHeight} fill="hsl(var(--foreground) / 0.8)" />
             <rect x={xOffset + scaledSpan - 10} y={pilarY} width="20" height={pilarHeight} fill="hsl(var(--foreground) / 0.8)" />

             {/* Viga Principal */}
             <rect x={xOffset - 10} y={vigaPY} width={scaledSpan + 20} height={vigaPHeight} fill="hsl(var(--primary))" />
             
             {/* Viga Secundária */}
             <rect x={xOffset + scaledSpan/2 - 10} y={vigaSY} width="20" height={vigaSHeight} fill="hsl(var(--primary) / 0.6)" />

             {/* Laje */}
             <rect x={xOffset} y={lajeY} width={scaledSpan} height={lajeHeight} fill="hsl(var(--muted))" stroke="hsl(var(--border))" />
             
             {/* Base */}
             <line x1="0" y1={currentY} x2={SVG_WIDTH} y2={currentY} stroke="hsl(var(--foreground))" strokeWidth="1" />
             <path d={`M ${xOffset - 20} ${currentY} L ${xOffset - 30} ${currentY+10} L ${xOffset - 10} ${currentY+10} Z`} fill="hsl(var(--foreground)/0.5)" />
             <path d={`M ${xOffset + scaledSpan + 20} ${currentY} L ${xOffset + scaledSpan + 10} ${currentY+10} L ${xOffset + scaledSpan + 30} ${currentY+10} Z`} fill="hsl(var(--foreground)/0.5)" />

             {/* Labels */}
             <DrawingText x={xOffset + scaledSpan / 2} y={vigaPY - 5}>Viga Principal {vigaPrincipal.result?.profile.nome}</DrawingText>
             <DrawingText x={xOffset + scaledSpan / 2} y={vigaSY - 5}>Viga Secundária {vigaSecundaria.result?.profile.nome}</DrawingText>
             <DrawingText x={xOffset + scaledSpan / 2} y={lajeY - 5}>Laje {laje.result?.deck.nome} + {laje.concreteThickness}cm Concreto</DrawingText>
             <DrawingText x={xOffset - 40} y={pilarY + pilarHeight / 2} transform={`rotate(-90, ${xOffset-40}, ${pilarY + pilarHeight/2})`}>Pilar {pilar.result?.profile.nome} (H: {pilar.height}m)</DrawingText>
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
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="plan">Planta Baixa</TabsTrigger>
                        <TabsTrigger value="elevation">Elevação</TabsTrigger>
                    </TabsList>
                    <TabsContent value="plan">
                        <Card className="mt-2">
                            <CardContent className="p-2">
                                <PlanView />
                                <Alert variant="default" className="mt-2">
                                    <Info className="h-4 w-4" />
                                    <AlertTitle>Legenda</AlertTitle>
                                    <AlertDescription>
                                        <div className="flex items-center gap-4 text-xs">
                                            <div className="flex items-center gap-1"><div className="h-2 w-4 bg-primary"/>Viga Principal</div>
                                            <div className="flex items-center gap-1"><div className="h-2 w-4 bg-primary/50"/>Viga Secundária</div>
                                            <div className="flex items-center gap-1"><div className="h-2 w-2 bg-foreground"/>Pilar</div>
                                        </div>
                                    </AlertDescription>
                                </Alert>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="elevation">
                         <Card className="mt-2">
                            <CardContent className="p-2">
                                <ElevationView />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
