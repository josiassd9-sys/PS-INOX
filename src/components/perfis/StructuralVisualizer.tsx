"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useCalculator } from "@/app/perfis/calculadora/CalculatorContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, GitCompareArrows } from "lucide-react";

const SVG_WIDTH = 800;
const SVG_HEIGHT = 500;
const PADDING = 50;

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
    const { slabAnalysis, vigaPrincipal, vigaSecundaria } = useCalculator();

    const totalSpanX = parseFloat(slabAnalysis.spanX.replace(',', '.')) || 10;
    const totalSpanY = parseFloat(slabAnalysis.spanY.replace(',', '.')) || 5;
    const cantileverLeft = parseFloat(slabAnalysis.cantileverLeft.replace(',', '.')) || 0;
    const cantileverRight = parseFloat(slabAnalysis.cantileverRight.replace(',', '.')) || 0;
    const cantileverFront = parseFloat(slabAnalysis.cantileverFront.replace(',', '.')) || 0;
    const cantileverBack = parseFloat(slabAnalysis.cantileverBack.replace(',', '.')) || 0;
    const spacingVS = parseFloat(vigaSecundaria.spacing?.replace(',', '.')) || 1.5;
    
    const vigaP_b = (vigaPrincipal.result?.profile.b || 200) / 1000;
    const vigaS_b = (vigaSecundaria.result?.profile.b || 100) / 1000;

    const spanX = totalSpanX - cantileverLeft - cantileverRight;
    const spanY = totalSpanY - cantileverFront - cantileverBack;

    if (spanX <= 0 || spanY <= 0) return <Alert variant="destructive">Dimensões de vão inválidas. Os balanços não podem ser maiores que o vão total.</Alert>;
    
    const scale = Math.min((SVG_WIDTH - 2 * PADDING) / totalSpanX, (SVG_HEIGHT - 2 * PADDING) / totalSpanY);
    const scaledWidth = totalSpanX * scale;
    const scaledHeight = totalSpanY * scale;

    const numVigasSecundarias = spacingVS > 0 ? Math.floor(spanX / spacingVS) : 0;
    const realSpacing = numVigasSecundarias > 0 ? (spanX * scale) / (numVigasSecundarias + 1) : 0;
    
    const xOffset = (SVG_WIDTH - scaledWidth) / 2;
    const yOffset = (SVG_HEIGHT - scaledHeight) / 2;

    const pilarX1 = xOffset + cantileverLeft * scale;
    const pilarX2 = xOffset + (totalSpanX - cantileverRight) * scale;
    const pilarY1 = yOffset + cantileverFront * scale;
    const pilarY2 = yOffset + (totalSpanY - cantileverBack) * scale;
    
    const vigaP_b_scaled = vigaP_b * scale;
    const vigaS_b_scaled = vigaS_b * scale;

    return (
        <svg viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} className="w-full h-auto">
            {/* Laje */}
            <rect x={xOffset} y={yOffset} width={scaledWidth} height={scaledHeight} fill="hsl(var(--muted) / 0.3)" stroke="hsl(var(--border))" strokeWidth="1" />

            {/* Vigas Secundárias */}
            {numVigasSecundarias > 0 && Array.from({ length: numVigasSecundarias + 2 }).map((_, i) => (
                 <rect key={i} x={pilarX1 + i * realSpacing - vigaS_b_scaled / 2} y={yOffset} width={vigaS_b_scaled} height={scaledHeight} fill="hsl(var(--primary) / 0.5)" />
            ))}

            {/* Vigas Principais */}
            <rect x={xOffset} y={pilarY1 - vigaP_b_scaled / 2} width={scaledWidth} height={vigaP_b_scaled} fill="hsl(var(--primary))" />
            <rect x={xOffset} y={pilarY2 - vigaP_b_scaled / 2} width={scaledWidth} height={vigaP_b_scaled} fill="hsl(var(--primary))" />

            {/* Pilares */}
            <rect x={pilarX1 - 5} y={pilarY1 - 5} width="10" height="10" fill="hsl(var(--foreground))" />
            <rect x={pilarX2 - 5} y={pilarY1 - 5} width="10" height="10" fill="hsl(var(--foreground))" />
            <rect x={pilarX1 - 5} y={pilarY2 - 5} width="10" height="10" fill="hsl(var(--foreground))" />
            <rect x={pilarX2 - 5} y={pilarY2 - 5} width="10" height="10" fill="hsl(var(--foreground))" />

            {/* Dimensions */}
            <DimensionLine x1={xOffset} y1={yOffset} x2={xOffset + scaledWidth} y2={yOffset} label={`Total X: ${totalSpanX} m`} offset={-30} />
            {cantileverLeft > 0 && <DimensionLine x1={xOffset} y1={yOffset} x2={pilarX1} y2={yOffset} label={`${cantileverLeft}m`} offset={-15} />}
            <DimensionLine x1={pilarX1} y1={yOffset} x2={pilarX2} y2={yOffset} label={`${spanX.toFixed(2)}m`} offset={-15} />
            {cantileverRight > 0 && <DimensionLine x1={pilarX2} y1={yOffset} x2={xOffset + scaledWidth} y2={yOffset} label={`${cantileverRight}m`} offset={-15} />}
            
            <DimensionLine x1={xOffset + scaledWidth} y1={yOffset} x2={xOffset + scaledWidth} y2={yOffset + scaledHeight} label={`Total Y: ${totalSpanY} m`} offset={45} vertical />
        </svg>
    );
};

const FrontElevationView = () => {
    const { slabAnalysis, laje, vigaPrincipal, vigaSecundaria, pilar, sapata } = useCalculator();

    const pilarH = parseFloat(pilar.height.replace(',', '.')) || 3;
    const addPilarH = parseFloat(pilar.additionalHeight?.replace(',', '.')) || 0;
    const totalPilarH = pilarH + addPilarH;
    
    const vigaP = vigaPrincipal.result?.profile;
    const vigaPH_m = (vigaP?.h || 300) / 1000;

    const vigaS = vigaSecundaria.result?.profile;
    const vigaSH_m = (vigaS?.h || 200) / 1000;
    const vigaSW_m = (vigaS?.b || 100) / 1000;

    const concreteH_cm = parseFloat(laje.concreteThickness.replace(',', '.')) || 12;
    const lajeH_m = vigaSH_m + (concreteH_cm / 100);
    
    const totalSpanX = parseFloat(slabAnalysis.spanX.replace(',', '.')) || 10;
    const cantileverLeft = parseFloat(slabAnalysis.cantileverLeft.replace(',', '.')) || 0;
    const cantileverRight = parseFloat(slabAnalysis.cantileverRight.replace(',', '.')) || 0;
    const spanX = totalSpanX - cantileverLeft - cantileverRight;
    const spacingVS = parseFloat(vigaSecundaria.spacing?.replace(',', '.')) || 1.5;

    const sapataResult = sapata.result?.footingDimensions;
    const sapataH = (sapataResult?.recommendedHeightCm || 30) / 100;
    const sapataW = sapataResult?.sideLengthM || 1.5;

    if (spanX <= 0) return <Alert variant="destructive">Vão X inválido na Aba 1.</Alert>;

    const totalDrawingHeight = totalPilarH + vigaPH_m + sapataH;
    const scale = Math.min((SVG_WIDTH - 2 * PADDING) / totalSpanX, (SVG_HEIGHT - 2 * PADDING) / totalDrawingHeight);
    
    const scaledSpanX = totalSpanX * scale;
    const xOffset = (SVG_WIDTH - scaledSpanX) / 2;
    
    const pilarHeight = pilarH * scale;
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
    
    const numVigasSecundarias = spacingVS > 0 ? Math.floor(spanX / spacingVS) : 0;
    const realSpacing = numVigasSecundarias > 0 ? (spanX * scale) / (numVigasSecundarias + 1) : 0;
    
    const vigaS_h_scaled = vigaSH_m * scale;
    const vigaS_b_scaled = vigaSW_m * scale;
    const vigaS_tf_scaled = ((vigaS?.tf || 8.5) / 1000) * scale;
    const vigaS_tw_scaled = ((vigaS?.tw || 5.6) / 1000) * scale;
    const lajeH_scaled = lajeH_m * scale;

    return (
         <svg viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} className="w-full h-auto">
             <line x1="0" y1={baseY} x2={SVG_WIDTH} y2={baseY} stroke="hsl(var(--foreground))" strokeWidth="1" strokeDasharray="5 5" />
             <DrawingText x={PADDING} y={baseY + 15} textAnchor="start">Nível 0.00</DrawingText>
             
             {/* Sapatas */}
             <rect x={pilarX1 - sapataWidth/2} y={sapataY} width={sapataWidth} height={sapataHeight} fill="hsl(var(--muted))" />
             <rect x={pilarX2 - sapataWidth/2} y={sapataY} width={sapataWidth} height={sapataHeight} fill="hsl(var(--muted))" />
             
             {/* Pilares */}
             <rect x={pilarX1 - 10} y={pilarTopoY} width="20" height={totalPilarH * scale} fill="hsl(var(--foreground) / 0.8)" />
             <rect x={pilarX2 - 10} y={pilarTopoY} width="20" height={totalPilarH * scale} fill="hsl(var(--foreground) / 0.8)" />

             {/* Viga Principal */}
             <rect x={xOffset} y={vigaPY - vigaPHeight} width={scaledSpanX} height={vigaPHeight} fill="hsl(var(--primary))" />
             
             {/* Laje e Vigas Secundárias em corte */}
             <rect x={xOffset} y={vigaPY-vigaPHeight-lajeH_scaled} width={scaledSpanX} height={lajeH_scaled - vigaS_h_scaled} fill="hsl(var(--muted)/0.5)" />
             {numVigasSecundarias > 0 && Array.from({ length: numVigasSecundarias + 2 }).map((_, i) => {
                const vigaSX = xOffset + i * realSpacing;
                return vigaS && (
                    <g key={i} transform={`translate(${vigaSX}, ${vigaPY - vigaPHeight - vigaS_h_scaled})`}>
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

             <DimensionLine x1={pilarX1} y1={sapataY} x2={pilarX1} y2={vigaPY} label={`Pé-Direito: ${pilarH.toFixed(2)}m`} offset={-25} vertical/>
         </svg>
    )
}

const SideElevationView = () => {
    const { slabAnalysis, laje, vigaSecundaria, vigaPrincipal, pilar, sapata } = useCalculator();

    const pilarH = parseFloat(pilar.height.replace(',', '.')) || 3;
    const addPilarH = parseFloat(pilar.additionalHeight?.replace(',', '.')) || 0;
    const totalPilarH = pilarH + addPilarH;
    const deckInfo = laje.result?.deck;
    const deckHeight_mm = deckInfo ? (deckInfo.tipo === 'MD75' ? 75 : 57) : 57;
    const concreteH_cm = parseFloat(laje.concreteThickness.replace(',', '.')) || 12;
    
    const vigaP = vigaPrincipal.result?.profile;
    const vigaPH_m = (vigaP?.h || 300) / 1000;
    const vigaPW_m = (vigaP?.b || 200) / 1000;

    const vigaS = vigaSecundaria.result?.profile;
    const vigaSH_m = (vigaS?.h || 200) / 1000;
    
    const lajeH_m = vigaSH_m + (concreteH_cm / 100);
    
    const totalSpanY = parseFloat(slabAnalysis.spanY.replace(',', '.')) || 5;
    const cantileverFront = parseFloat(slabAnalysis.cantileverFront.replace(',', '.')) || 0;
    const cantileverBack = parseFloat(slabAnalysis.cantileverBack.replace(',', '.')) || 0;
    const spanY = totalSpanY - cantileverFront - cantileverBack;

    const sapataResult = sapata.result?.footingDimensions;
    const sapataH = (sapataResult?.recommendedHeightCm || 30) / 100;
    const sapataW = sapataResult?.sideLengthM || 1.5;

    if (spanY <= 0) return <Alert variant="destructive">Vão Y inválido na Aba 1.</Alert>;

    const totalDrawingHeight = totalPilarH + lajeH_m + sapataH;
    const scale = Math.min((SVG_WIDTH - 2*PADDING) / totalSpanY, (SVG_HEIGHT - 2*PADDING) / totalDrawingHeight);
    const scaledSpanY = totalSpanY * scale;
    const xOffset = (SVG_WIDTH - scaledSpanY) / 2;
    
    const pilarHeight = pilarH * scale;
    const vigaPHeight = vigaPH_m * scale;
    const vigaPWidth = vigaPW_m * scale;
    const sapataHeight = sapataH * scale;
    const sapataWidth = sapataW * scale;

    const baseY = SVG_HEIGHT - PADDING;
    const sapataY = baseY - sapataHeight;
    const pilarBaseY = sapataY;
    const vigaPY = pilarBaseY - pilarHeight;
    const pilarTopoY = vigaPY - (addPilarH * scale);
    const lajeBaseY = vigaPY;
    
    const pilarX1 = xOffset + cantileverFront * scale;
    const pilarX2 = xOffset + (totalSpanY - cantileverBack) * scale;
    
     // Steel Deck Profile Path
    const deckProfilePath = () => {
        let path = ``;
        const waveWidth = 20 * (scale/50); 
        const numWaves = Math.floor(scaledSpanY / waveWidth);
        const waveHeight = (deckHeight_mm / 1000) * scale;
        const concreteHeight = (concreteH_cm / 100) * scale;
        const vigaS_H_scaled = vigaSH_m * scale;

        const deckStartY = lajeBaseY - vigaS_H_scaled;
        const concreteTop = deckStartY - concreteHeight;
        
        path += `M ${xOffset},${concreteTop} L ${xOffset + scaledSpanY},${concreteTop} L ${xOffset + scaledSpanY},${deckStartY} `;

        for (let i = numWaves; i > 0; i--) {
            const x = xOffset + (i-1) * waveWidth;
            path += `L ${x + waveWidth * 0.75},${deckStartY - waveHeight} `;
            path += `L ${x + waveWidth * 0.25},${deckStartY - waveHeight} `;
            path += `L ${x},${deckStartY} `;
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
            <rect x={pilarX1 - 10} y={pilarTopoY} width="20" height={totalPilarH * scale} fill="hsl(var(--foreground) / 0.8)" />
            <rect x={pilarX2 - 10} y={pilarTopoY} width="20" height={totalPilarH * scale} fill="hsl(var(--foreground) / 0.8)" />
            
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

    const deckHeight_mm = (deckInfo?.tipo === 'MD75' ? 75 : 57);
    const totalHeight = deckHeight_mm + concreteH_cm * 10;

    const scale = Math.min((SVG_WIDTH - 2*PADDING) / 500, (SVG_HEIGHT - 2*PADDING) / totalHeight);
    const xOffset = PADDING * 2;
    
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
    
    const deckPoints = [
        { x: xOffset, y: deckTopY },
        { x: xOffset + 400, y: deckTopY },
        { x: xOffset + 400, y: concreteTopY },
        { x: xOffset, y: concreteTopY },
    ].map(p => `${p.x},${p.y}`).join(' ');

    return (
        <svg viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} className="w-full h-auto">
            {/* Viga Secundária em Corte */}
            {vigaS && <>
                <rect x={xOffset + 200 - scaled_vigaS_b/2} y={vigaY} width={scaled_vigaS_b} height={scaled_vigaS_tf} fill="hsl(var(--primary)/0.6)" />
                <rect x={xOffset + 200 - scaled_vigaS_tw/2} y={vigaY + scaled_vigaS_tf} width={scaled_vigaS_tw} height={scaled_vigaS_h - 2 * scaled_vigaS_tf} fill="hsl(var(--primary)/0.6)" />
                <rect x={xOffset + 200 - scaled_vigaS_b/2} y={vigaY + scaled_vigaS_h - scaled_vigaS_tf} width={scaled_vigaS_b} height={scaled_vigaS_tf} fill="hsl(var(--primary)/0.6)" />
                <DrawingText x={xOffset + 200} y={baseY + 15}>{vigaS.nome}</DrawingText>
            </>}

            {/* Steel Deck */}
            {deckInfo && <polygon points={deckPoints} fill="url(#deck-pattern)" stroke="hsl(var(--border))" />}

            {/* Concreto */}
            <rect x={xOffset} y={concreteTopY - concreteHeight} width="400" height={concreteHeight} fill="hsl(var(--muted))" />

            <defs>
                <pattern id="deck-pattern" width="10" height="10" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
                    <line x1="0" y1="0" x2="0" y2="10" stroke="hsl(var(--border))" strokeWidth="1" />
                </pattern>
            </defs>

            {/* Labels */}
            <DimensionLine x1={xOffset-10} y1={concreteTopY - concreteHeight} x2={xOffset-10} y2={concreteTopY} label={`${concreteH_cm} cm`} vertical offset={-15} />
            <DimensionLine x1={xOffset-10} y1={deckTopY - deck_h_scaled} x2={xOffset-10} y2={deckTopY} label={`${deckHeight_mm} mm`} vertical offset={-15}/>
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
