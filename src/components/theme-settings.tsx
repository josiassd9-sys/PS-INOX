"use client";

import * as React from "react";
import { Palette, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  applyTheme,
  getStoredTheme,
  storeTheme,
  THEME_LABELS,
  THEMES,
  type AppTheme,
} from "@/lib/theme";
import {
  applyDesignLevel,
  getStoredDesignLevel,
  storeDesignLevel,
  DESIGN_LABELS,
  DESIGN_DESCRIPTIONS,
  DESIGN_LEVELS,
  type DesignLevel,
} from "@/lib/design";
import { AiSettings } from "./ai-settings";

const THEME_PREVIEWS: Record<AppTheme, string[]> = {
  "industrial-light": ["bg-[hsl(211_100%_30%)]", "bg-[hsl(39_89%_55%)]", "bg-[hsl(220_10%_94%)]"],
  "industrial-dark": ["bg-[hsl(211_25%_18%)]", "bg-[hsl(39_89%_55%)]", "bg-[hsl(211_25%_30%)]"],
  sheet: ["bg-[hsl(211_100%_30%)]", "bg-[hsl(39_89%_55%)]", "bg-[hsl(210_45%_96%)]"],
  "minimal-gray": ["bg-[hsl(0_0%_10%)]", "bg-[hsl(152_58%_30%)]", "bg-[hsl(0_0%_95%)]"],
};

type Tab = "aparencia" | "ia";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "aparencia", label: "Aparência", icon: <Palette className="h-4 w-4 shrink-0" /> },
  { id: "ia", label: "Inteligência Artificial", icon: <Sparkles className="h-4 w-4 shrink-0" /> },
];

function SettingRow({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="text-sm font-medium">{label}</p>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      <div className="w-full sm:w-auto sm:shrink-0">{children}</div>
    </div>
  );
}

export function ThemeSettings() {
  const [activeTab, setActiveTab] = React.useState<Tab>("aparencia");
  const [theme, setTheme] = React.useState<AppTheme>("industrial-light");
  const [designLevel, setDesignLevel] = React.useState<DesignLevel>(4);

  React.useEffect(() => {
    setTheme(getStoredTheme());
    setDesignLevel(getStoredDesignLevel());
  }, []);

  const handleSelectTheme = (next: AppTheme) => {
    setTheme(next);
    applyTheme(next);
    storeTheme(next);
  };

  const handleSelectDesign = (next: DesignLevel) => {
    setDesignLevel(next);
    applyDesignLevel(next);
    storeDesignLevel(next);
  };

  return (
    <div className="mx-auto max-w-4xl p-2 pb-6">
      <div className="overflow-hidden rounded-xl border shadow-sm">
        {/* Panel header */}
        <div className="border-b bg-muted/30 px-4 py-2.5">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Configurações
          </p>
        </div>

        {/* Sidebar + content */}
        <div className="grid min-h-[320px] grid-cols-1 md:grid-cols-[200px_1fr]">
          {/* Sidebar nav */}
          <nav className="border-b bg-muted/10 p-2 md:border-b-0 md:border-r">
            <div className="flex gap-1 overflow-x-auto md:flex-col md:overflow-visible">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                    activeTab === tab.id
                      ? "bg-primary/10 font-semibold text-primary"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                  )}
                >
                  {tab.icon}
                  <span className="whitespace-nowrap">{tab.label}</span>
                </button>
              ))}
            </div>
          </nav>

          {/* Content area */}
          <div className="p-4 sm:p-5">
            {activeTab === "aparencia" && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-sm font-semibold">Aparência</h2>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Personalize o visual do aplicativo.
                  </p>
                </div>

                <div className="overflow-hidden divide-y rounded-lg border">
                  <SettingRow label="Tema de cores" description="Paleta visual aplicada ao app">
                    <Select value={theme} onValueChange={handleSelectTheme}>
                      <SelectTrigger className="h-9 w-full sm:w-56">
                        <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
                          <span className="flex shrink-0 gap-1">
                            {(THEME_PREVIEWS[theme] ?? []).map((cls) => (
                              <span
                                key={cls}
                                className={`block h-3 w-3 rounded-full border border-black/10 ${cls}`}
                              />
                            ))}
                          </span>
                          <span className="truncate text-sm">{THEME_LABELS[theme]}</span>
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        {THEMES.map((t) => (
                          <SelectItem key={t} value={t}>
                            <div className="flex items-center gap-2">
                              <span className="flex shrink-0 gap-1">
                                {(THEME_PREVIEWS[t] ?? []).map((cls) => (
                                  <span
                                    key={cls}
                                    className={`block h-3 w-3 rounded-full border border-black/10 ${cls}`}
                                  />
                                ))}
                              </span>
                              {THEME_LABELS[t]}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </SettingRow>

                  <SettingRow
                    label="Nível de design"
                    description="Grau de refinamento visual e micro-interações"
                  >
                    <Select
                      value={String(designLevel)}
                      onValueChange={(v) => handleSelectDesign(Number(v) as DesignLevel)}
                    >
                      <SelectTrigger className="h-9 w-full sm:w-56">
                        <div className="flex min-w-0 flex-1 items-center overflow-hidden">
                          <span className="truncate text-sm">{DESIGN_LABELS[designLevel]}</span>
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        {DESIGN_LEVELS.map((level) => (
                          <SelectItem key={level} value={String(level)}>
                            <div className="flex flex-col gap-0.5">
                              <span>{DESIGN_LABELS[level]}</span>
                              <span className="text-xs text-muted-foreground">
                                {DESIGN_DESCRIPTIONS[level]}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </SettingRow>
                </div>
              </div>
            )}

            {activeTab === "ia" && <AiSettings />}
          </div>
        </div>
      </div>
    </div>
  );
}
