"use client";

import { Menu, Palette } from "lucide-react";
import * as React from "react";
import { useSidebar } from "./ui/sidebar";
import { Button } from "./ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  applyTheme,
  getNextTheme,
  getStoredTheme,
  storeTheme,
  THEME_LABELS,
  type AppTheme,
} from "@/lib/theme";

export function GlobalMenuTrigger() {
  const { toggleSidebar } = useSidebar();
  const isMobile = useIsMobile();
  const [theme, setTheme] = React.useState<AppTheme>("industrial-light");

  React.useEffect(() => {
    setTheme(getStoredTheme());
  }, []);

  const handleThemeSwitch = React.useCallback(() => {
    const nextTheme = getNextTheme(theme);
    setTheme(nextTheme);
    applyTheme(nextTheme);
    storeTheme(nextTheme);
  }, [theme]);

  // No desktop os botões ficam integrados no header do dashboard
  if (!isMobile) return null;

  return (
    <div
      className="fixed z-50 flex items-center gap-2 print:hidden"
      style={{ top: "calc(var(--safe-area-top) + 0.75rem)", right: "calc(var(--safe-area-right) + 0.75rem)" }}
    >
      <Button onClick={toggleSidebar} variant="outline" size="icon" className="h-11 w-11 rounded-xl border-border/70 bg-background/80 shadow-lg backdrop-blur-md">
        <Menu className="h-4 w-4" />
        <span className="sr-only">Abrir menu</span>
      </Button>
      <Button onClick={handleThemeSwitch} variant="outline" size="icon" className="h-11 w-11 rounded-xl border-border/70 bg-background/80 shadow-lg backdrop-blur-md" title={`Tema: ${THEME_LABELS[theme]}`}>
        <Palette className="h-4 w-4" />
        <span className="sr-only">Alternar tema visual</span>
      </Button>
    </div>
  );
}
