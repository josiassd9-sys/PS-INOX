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
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Refinamento Visual</CardTitle>
        <CardDescription>
          Controle o nível de polimento da interface.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid gap-2 sm:grid-cols-2">
          {DESIGN_LEVELS.map((level) => {
            const isActive = designLevel === level;
            return (
              <RefinedButton
                key={level}
                variant={isActive ? "primary" : "outline"}
                animation={isActive ? "lift" : "scale"}
                className="h-auto min-h-16 w-full justify-between rounded-xl p-3 text-left"
                onClick={() => handleSelectDesign(level)}
              >
                <span className="flex w-full items-start justify-between gap-3">
                  <span className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium">{DESIGN_LABELS[level]}</span>
                    <span className="text-xs opacity-70 line-clamp-2">{DESIGN_DESCRIPTIONS[level]}</span>
                  </span>
                  {isActive ? <Check className="mt-0.5 h-4 w-4 flex-shrink-0" /> : null}
                </span>
              </RefinedButton>
            );
          })}
        </div>
      </CardContent>
    </RefinedCard>
  );
}
