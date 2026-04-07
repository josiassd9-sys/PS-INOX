"use client";

import * as React from "react";
import { Dashboard } from "@/components/dashboard";
import { ThemeSettings } from "@/components/theme-settings";

export default function ConfiguracoesPage() {
  return (
    <Dashboard initialCategoryId="configuracoes">
      <ThemeSettings />
    </Dashboard>
  );
}
