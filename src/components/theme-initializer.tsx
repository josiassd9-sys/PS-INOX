"use client";

import * as React from "react";
import { applyTheme, getStoredTheme } from "@/lib/theme";
import { applyDesignLevel, getStoredDesignLevel } from "@/lib/design";

export function ThemeInitializer() {
  React.useEffect(() => {
    applyTheme(getStoredTheme());
    applyDesignLevel(getStoredDesignLevel());
  }, []);

  return null;
}
