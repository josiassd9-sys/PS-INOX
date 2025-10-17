
"use client";

import * as React from "react";
import { Dashboard } from "@/components/dashboard";
import { PowerTransmissionGuide } from "@/components/power-transmission-guide";

export default function PowerTransmissionPage() {
  return (
    <Dashboard initialCategoryId="mecanica/transmissao-potencia">
      <div className="container mx-auto p-4">
        <PowerTransmissionGuide />
      </div>
    </Dashboard>
  );
}
