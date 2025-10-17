
"use client";

import * as React from "react";
import { Dashboard } from "@/components/dashboard";
import { ManufacturingProcesses } from "@/components/manufacturing-processes";

export default function ManufacturingPage() {
  return (
    <Dashboard initialCategoryId="informativos/processos-fabricacao">
      <div className="container mx-auto p-4">
        <ManufacturingProcesses />
      </div>
    </Dashboard>
  );
}
