
"use client";

import * as React from "react";
import { Dashboard } from "@/components/dashboard";
import { SealingSystemsGuide } from "@/components/sealing-systems-guide";

export default function SealingSystemsPage() {
  return (
    <Dashboard initialCategoryId="mecanica/sistemas-vedacao">
      <div className="container mx-auto p-4">
        <SealingSystemsGuide />
      </div>
    </Dashboard>
  );
}
