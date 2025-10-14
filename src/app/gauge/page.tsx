
"use client";

import { Dashboard } from "@/components/dashboard";
import * as React from "react";

export default function GaugePage() {
  return (
    <>
      <main className="min-h-screen bg-background">
          <Dashboard initialCategoryId="gauge" />
      </main>
    </>
  );
}
