
"use client";

import * as React from "react";
import { Dashboard } from "@/components/dashboard";
import { TechnicalDrawingGuide } from "@/components/technical-drawing-guide";

export default function TechnicalDrawingPage() {
  return (
    <Dashboard initialCategoryId="informativos/desenho-tecnico">
      <div className="container mx-auto p-4">
        <TechnicalDrawingGuide />
      </div>
    </Dashboard>
  );
}
