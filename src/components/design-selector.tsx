"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  applyDesignLevel,
  getStoredDesignLevel,
  storeDesignLevel,
  DESIGN_LABELS,
  DESIGN_DESCRIPTIONS,
  DESIGN_LEVELS,
  type DesignLevel,
} from "@/lib/design";
import { RefinedButton, RefinedCard } from "./refined-components";

export function DesignSelector() {
  const [designLevel, setDesignLevel] = React.useState<DesignLevel>(4);

  React.useEffect(() => {
    setDesignLevel(getStoredDesignLevel());
  }, []);

  const handleSelectDesign = React.useCallback((level: DesignLevel) => {
    setDesignLevel(level);
    applyDesignLevel(level);
    storeDesignLevel(level);
  }, []);

  return (
    <RefinedCard hover="subtle" className="overflow-hidden p-0">
      <CardHeader>
        <CardTitle>Nível de Design</CardTitle>
        <CardDescription>
          Escolha o nível de refinamento visual da interface. Varia de polimento sutil até redesign completo com micro-interações.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {DESIGN_LEVELS.map((level) => {
            const isActive = designLevel === level;
            return (
              <RefinedButton
                key={level}
                variant={isActive ? "primary" : "outline"}
                animation={isActive ? "lift" : "scale"}
                className="w-full justify-between p-4 text-left h-auto"
                onClick={() => handleSelectDesign(level)}
              >
                <span className="flex items-start justify-between gap-4 w-full">
                  <span className="flex flex-col gap-1">
                    <span className="font-medium">{DESIGN_LABELS[level]}</span>
                    <span className="text-xs opacity-70">{DESIGN_DESCRIPTIONS[level]}</span>
                  </span>
                  {isActive ? <Check className="h-4 w-4 flex-shrink-0 mt-0.5" /> : null}
                </span>
              </RefinedButton>
            );
          })}
        </div>
      </CardContent>
    </RefinedCard>
  );
}
