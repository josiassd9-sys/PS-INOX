
"use client";

import * as React from "react";
import { Dashboard } from "@/components/dashboard";
import { WeldingGuide } from "@/components/welding-guide";

export default function WeldingGuidePage() {
  return (
    <Dashboard initialCategoryId="informativos/tipos-de-solda">
      <div className="container mx-auto p-4">
        <WeldingGuide />
      </div>
    </Dashboard>
  );
}

    