"use client";

import * as React from "react";
import { applyTheme, getStoredTheme } from "@/lib/theme";

export function ThemeInitializer() {
  React.useEffect(() => {
    applyTheme(getStoredTheme());
  }, []);

  return null;
}
