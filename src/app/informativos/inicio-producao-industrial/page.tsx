
"use client";

import * as React from "react";
import { Dashboard } from "@/components/dashboard";
import { IndustrialRevolutionGuide } from "@/components/industrial-revolution-guide";

export default function IndustrialRevolutionPage() {
  return (
    <Dashboard initialCategoryId="informativos/inicio-producao-industrial">
      <div className="container mx-auto p-4">
        <IndustrialRevolutionGuide />
      </div>
    </Dashboard>
  );
}
