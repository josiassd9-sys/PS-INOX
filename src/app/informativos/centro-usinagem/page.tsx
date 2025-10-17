
"use client";

import * as React from "react";
import { Dashboard } from "@/components/dashboard";
import { MachiningCenterGuide } from "@/components/machining-center-guide";

export default function MachiningCenterPage() {
  return (
    <Dashboard initialCategoryId="informativos/centro-usinagem">
      <div className="container mx-auto p-4">
        <MachiningCenterGuide />
      </div>
    </Dashboard>
  );
}

    