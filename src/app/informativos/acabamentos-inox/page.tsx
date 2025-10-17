
"use client";

import * as React from "react";
import { Dashboard } from "@/components/dashboard";
import { StainlessSteelFinishesGuide } from "@/components/stainless-steel-finishes-guide";

export default function FinishesPage() {
  return (
    <Dashboard initialCategoryId="informativos/acabamentos-inox">
      <div className="container mx-auto p-4">
        <StainlessSteelFinishesGuide />
      </div>
    </Dashboard>
  );
}
