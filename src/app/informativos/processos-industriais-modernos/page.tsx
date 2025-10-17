
"use client";

import * as React from "react";
import { Dashboard } from "@/components/dashboard";
import { ModernIndustrialProcessesGuide } from "@/components/modern-industrial-processes-guide";

export default function ModernProcessesPage() {
  return (
    <Dashboard initialCategoryId="informativos/processos-industriais-modernos">
      <div className="container mx-auto p-4">
        <ModernIndustrialProcessesGuide />
      </div>
    </Dashboard>
  );
}
    