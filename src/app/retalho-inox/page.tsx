"use client";

import * as React from "react";
import { Dashboard } from "@/components/dashboard";
import { ScrapCalculator } from "@/components/scrap-calculator";

export default function RetalhoInoxPage() {
    // This component will be used inside the list builders, but we can have a page for it
  const mainContent = (
    <div className="p-4">
        <ScrapCalculator onAddItem={(item) => console.log('Item added:', item)} />
    </div>
  );

  return (
    <Dashboard initialCategoryId="retalho-inox">
      {mainContent}
    </Dashboard>
  );
}
