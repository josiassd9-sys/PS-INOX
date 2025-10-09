
"use client";

import { Dashboard } from "@/components/dashboard";
import * as React from "react";

export default function CalculatorPage({ params }: { params: { id: string } }) {
  const { id } = params;
  
  return (
    <>
      <main className="min-h-screen bg-background">
          <Dashboard initialCategoryId={id} />
      </main>
    </>
  );
}
