"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  applyTheme,
  getStoredTheme,
  storeTheme,
  THEME_LABELS,
  THEMES,
  type AppTheme,
} from "@/lib/theme";
import { DesignSelector } from "./design-selector";

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
      <Card>
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
              return (
                <Button
                  key={themeOption}
                  variant={isActive ? "default" : "outline"}
                  className="h-auto min-h-20 justify-between p-4 text-left"
                  onClick={() => handleSelectTheme(themeOption)}
                >
                  <span className="font-medium">{THEME_LABELS[themeOption]}</span>
                  {isActive ? <Check className="h-4 w-4" /> : null}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <DesignSelector />
    </div>
  );
}
