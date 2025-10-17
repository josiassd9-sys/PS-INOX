
"use client";

import * as React from "react";
import { Dashboard } from "@/components/dashboard";
import { FastenersGuide } from "@/components/fasteners-guide";

export default function FastenersPage() {
  return (
    <Dashboard initialCategoryId="mecanica/elementos-fixacao">
      <div className="container mx-auto p-4">
        <FastenersGuide />
      </div>
    </Dashboard>
  );
}
