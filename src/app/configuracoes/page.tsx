"use client";

import * as React from "react";
import { Dashboard } from "@/components/dashboard";
import { ThemeSettings } from "@/components/theme-settings";
import { AiSettings } from "@/components/ai-settings";

export default function ConfiguracoesPage() {
  return (
    <Dashboard initialCategoryId="configuracoes">
      <ThemeSettings />
      <div className="mx-auto max-w-3xl px-2 pb-6">
        <AiSettings />
      </div>
    </Dashboard>
  );
}
