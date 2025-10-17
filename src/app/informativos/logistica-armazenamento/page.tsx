
"use client";

import * as React from "react";
import { Dashboard } from "@/components/dashboard";
import { SteelLogisticsGuide } from "@/components/steel-logistics-guide";

export default function SteelLogisticsPage() {
  return (
    <Dashboard initialCategoryId="informativos/logistica-armazenamento">
      <div className="container mx-auto p-4">
        <SteelLogisticsGuide />
      </div>
    </Dashboard>
  );
}
