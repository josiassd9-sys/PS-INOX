
"use client";

import * as React from "react";
import { Dashboard } from "@/components/dashboard";
import { LaserCuttingGuide } from "@/components/laser-cutting-guide";

export default function LaserCuttingPage() {
  return (
    <Dashboard initialCategoryId="informativos/corte-laser">
      <div className="container mx-auto p-4">
        <LaserCuttingGuide />
      </div>
    </Dashboard>
  );
}
