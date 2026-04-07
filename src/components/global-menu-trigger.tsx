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

  return (
    <div
      className={isMobile ? "fixed z-50 flex items-center gap-2 print:hidden" : "fixed top-2 left-2 z-50 flex items-center gap-1 print:hidden"}
      style={isMobile ? { top: "calc(var(--safe-area-top) + 0.75rem)", left: "calc(var(--safe-area-left) + 0.75rem)" } : undefined}
    >
      <Button onClick={toggleSidebar} variant="outline" size="icon" className={isMobile ? "h-11 w-11 rounded-xl border-border/70 bg-background/80 shadow-lg backdrop-blur-md" : "h-8 w-8 bg-background/50 backdrop-blur-sm"}>
        <Menu className="h-4 w-4" />
        <span className="sr-only">Abrir menu</span>
      </Button>
      <Button onClick={handleThemeSwitch} variant="outline" size="icon" className={isMobile ? "h-11 w-11 rounded-xl border-border/70 bg-background/80 shadow-lg backdrop-blur-md" : "h-8 w-8 bg-background/50 backdrop-blur-sm"} title={`Tema: ${THEME_LABELS[theme]}`}>
        <Palette className="h-4 w-4" />
        <span className="sr-only">Alternar tema visual</span>
      </Button>
    </div>
  );
}
