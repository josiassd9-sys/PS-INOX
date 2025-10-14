
"use client";

import { Dashboard } from "@/components/dashboard";
import * as React from "react";

export default function CalculatorPage({ params }: { params: { id: string } }) {
  return (
    <>
      <main className="min-h-screen bg-background">
          <Dashboard initialCategoryId={params.id} />
      </main>
    </>
  );
}
