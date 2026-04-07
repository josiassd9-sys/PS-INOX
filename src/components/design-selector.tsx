"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  applyDesignLevel,
  getStoredDesignLevel,
  storeDesignLevel,
  DESIGN_LABELS,
  DESIGN_DESCRIPTIONS,
  DESIGN_LEVELS,
  type DesignLevel,
} from "@/lib/design";

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
    <Card>
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
              <Button
                key={level}
                variant={isActive ? "default" : "outline"}
                className="w-full justify-between p-4 text-left h-auto"
                onClick={() => handleSelectDesign(level)}
              >
                <div className="flex flex-col gap-1">
                  <span className="font-medium">{DESIGN_LABELS[level]}</span>
                  <span className="text-xs opacity-70">{DESIGN_DESCRIPTIONS[level]}</span>
                </div>
                {isActive ? <Check className="h-4 w-4 flex-shrink-0" /> : null}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
