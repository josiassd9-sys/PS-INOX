"use client";

import * as React from "react";
import { Check, Palette, SlidersHorizontal } from "lucide-react";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  applyTheme,
  getStoredTheme,
  storeTheme,
  THEME_LABELS,
  THEMES,
  type AppTheme,
} from "@/lib/theme";
import { RefinedButton, RefinedCard } from "./refined-components";
import { DesignSelector } from "./design-selector";
import { AiSettings } from "./ai-settings";

const THEME_PREVIEWS: Record<AppTheme, string[]> = {
  "industrial-light": ["bg-[hsl(211_100%_30%)]", "bg-[hsl(39_89%_55%)]", "bg-[hsl(220_10%_94%)]"],
  "industrial-dark": ["bg-[hsl(211_25%_18%)]", "bg-[hsl(39_89%_55%)]", "bg-[hsl(211_25%_30%)]"],
  sheet: ["bg-[hsl(211_100%_30%)]", "bg-[hsl(39_89%_55%)]", "bg-[hsl(210_45%_96%)]"],
  "minimal-gray": ["bg-[hsl(0_0%_10%)]", "bg-[hsl(152_58%_30%)]", "bg-[hsl(0_0%_95%)]"],
};

export function ThemeSettings() {
  const [theme, setTheme] = React.useState<AppTheme>("industrial-light");

  React.useEffect(() => {
    setTheme(getStoredTheme());
  }, []);

  const handleSelectTheme = React.useCallback((nextTheme: AppTheme) => {
    setTheme(nextTheme);
    applyTheme(nextTheme);
    storeTheme(nextTheme);
  }, []);

  return (
    <div className="mx-auto max-w-4xl p-2 space-y-4">
      <div className="rounded-2xl border bg-gradient-to-br from-primary/5 via-background to-accent/10 p-4 sm:p-5">
        <h1 className="text-xl font-semibold tracking-tight">Configurações</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ajuste aparência e IA de forma rápida, com foco em produtividade.
        </p>
      </div>

      <RefinedCard hover="subtle" className="overflow-hidden p-0">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Palette className="h-4 w-4" />
            Tema de Cores
          </CardTitle>
          <CardDescription>
            Escolha o visual do app. Essa mudança não altera cálculos nem dados.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {THEMES.map((themeOption) => {
              const isActive = theme === themeOption;
              const previewSwatches = THEME_PREVIEWS[themeOption] ?? [
                "bg-[hsl(0_0%_12%)]",
                "bg-[hsl(0_0%_72%)]",
                "bg-[hsl(0_0%_95%)]",
              ];
              return (
                <RefinedButton
                  key={themeOption}
                  variant={isActive ? "primary" : "outline"}
                  animation={isActive ? "lift" : "scale"}
                  className="h-auto min-h-20 w-full justify-between rounded-xl p-3 text-left"
                  onClick={() => handleSelectTheme(themeOption)}
                >
                  <span className="flex w-full flex-col gap-2">
                    <span className="flex items-center justify-between gap-3">
                      <span className="text-sm font-medium">{THEME_LABELS[themeOption]}</span>
                      {isActive ? <Check className="h-4 w-4" /> : null}
                    </span>
                    <span className="flex gap-2">
                      {previewSwatches.map((previewClass) => (
                        <span key={previewClass} className={`h-2.5 flex-1 rounded-full border border-black/10 ${previewClass}`} />
                      ))}
                    </span>
                  </span>
                </RefinedButton>
              );
            })}
          </div>
        </CardContent>
      </RefinedCard>

      <AiSettings />

      <div className="rounded-2xl border bg-gradient-to-br from-accent/10 via-background to-primary/5 p-3">
        <div className="mb-2 flex items-center gap-2 px-1">
          <SlidersHorizontal className="h-4 w-4" />
          <p className="text-sm font-medium">Nível de Design</p>
        </div>
        <DesignSelector />
      </div>

    </div>
  );
}
