
"use client";

import * as React from "react";
import { Dashboard } from "@/components/dashboard";
import { AutomotiveAssemblyGuide } from "@/components/automotive-assembly-guide";

export default function AutomotiveAssemblyPage() {
  return (
    <Dashboard initialCategoryId="informativos/linha-montagem-automotiva">
      <div className="container mx-auto p-4">
        <AutomotiveAssemblyGuide />
      </div>
    </Dashboard>
  );
}
