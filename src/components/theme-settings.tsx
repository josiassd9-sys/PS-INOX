"use client";

import * as React from "react";
import { Check } from "lucide-react";
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
    <div className="mx-auto max-w-3xl p-2 space-y-6">
      <RefinedCard hover="subtle" className="overflow-hidden p-0">
        <CardHeader>
          <CardTitle>Tema de Cores</CardTitle>
          <CardDescription>
            Escolha o tema visual oficial do aplicativo. Essa alteração é apenas visual e não afeta cálculos, dados ou fluxos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3">
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
                  className="h-auto min-h-28 w-full justify-between p-4 text-left"
                  onClick={() => handleSelectTheme(themeOption)}
                >
                  <span className="flex flex-col gap-3 w-full">
                    <span className="flex items-center justify-between gap-3">
                      <span className="font-medium">{THEME_LABELS[themeOption]}</span>
                      {isActive ? <Check className="h-4 w-4" /> : null}
                    </span>
                    <span className="flex gap-2">
                      {previewSwatches.map((previewClass) => (
                        <span key={previewClass} className={`h-3 flex-1 rounded-full border border-black/10 ${previewClass}`} />
                      ))}
                    </span>
                  </span>
                </RefinedButton>
              );
            })}
          </div>
        </CardContent>
      </RefinedCard>

      <DesignSelector />
    </div>
  );
}
