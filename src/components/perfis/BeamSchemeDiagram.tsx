"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface BeamSchemeDiagramProps {
  scheme: 'biapoiada' | 'balanco' | 'dois-balancos';
  span: number;
  balanco1?: number;
  balanco2?: number;
  className?: string;
}

export function BeamSchemeDiagram({ scheme, span, balanco1 = 0, balanco2 = 0, className }: BeamSchemeDiagramProps) {
  const totalLength = (scheme === 'biapoiada' ? span : (scheme === 'balanco' ? span + balanco1 : balanco1 + span + balanco2));
  const spanPercent = (span / totalLength) * 100;
  const b1Percent = (balanco1 / totalLength) * 100;
  const b2Percent = (balanco2 / totalLength) * 100;

  const support1Pos = scheme === 'dois-balancos' ? b1Percent : 0;
  const support2Pos = scheme === 'biapoiada' ? 100 : (scheme === 'balanco' ? spanPercent : b1Percent + spanPercent);

  const Arrow = ({ x, y }: { x: number, y: number }) => (
    <g transform={`translate(${x}, ${y})`}>
      <path d="M 0 0 L 0 10" className="stroke-current" />
      <path d="M -2 8 L 0 10 L 2 8" className="stroke-current fill-none" />
    </g>
  );

  return (
    <div className={cn("w-full p-4 rounded-md bg-muted/50 border", className)}>
      <svg viewBox="0 0 100 40" className="w-full h-auto text-muted-foreground">
        {/* Distributed Load Arrows */}
        {Array.from({ length: 10 }).map((_, i) => (
          <Arrow key={i} x={5 + i * 10} y={0} />
        ))}

        {/* Beam */}
        <rect x="0" y="12" width="100" height="2" className="fill-current text-primary/50" />
        
        {/* Supports */}
        <g transform={`translate(${support1Pos}, 14)`}>
           <path d="M 0 0 L 5 8 L -5 8 Z" className="fill-current text-primary" />
        </g>
        <g transform={`translate(${support2Pos}, 14)`}>
           <path d="M 0 0 L 5 8 L -5 8 Z" className="fill-current text-primary" />
        </g>

        {/* Dimensions */}
        {scheme === 'biapoiada' && (
            <text x="50" y="35" textAnchor="middle" className="text-[6px] font-sans fill-current">{span} m</text>
        )}
        {scheme === 'balanco' && (
            <>
                <text x={spanPercent / 2} y="35" textAnchor="middle" className="text-[6px] font-sans fill-current">{span} m</text>
                <text x={spanPercent + b1Percent / 2} y="35" textAnchor="middle" className="text-[6px] font-sans fill-current">{balanco1} m</text>
            </>
        )}
        {scheme === 'dois-balancos' && (
            <>
                <text x={b1Percent / 2} y="35" textAnchor="middle" className="text-[6px] font-sans fill-current">{balanco1} m</text>
                <text x={b1Percent + spanPercent / 2} y="35" textAnchor="middle" className="text-[6px] font-sans fill-current">{span} m</text>
                <text x={b1Percent + spanPercent + b2Percent / 2} y="35" textAnchor="middle" className="text-[6px] font-sans fill-current">{balanco2} m</text>
            </>
        )}
      </svg>
    </div>
  );
}
