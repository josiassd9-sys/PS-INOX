"use client";
import ScaleCalculator from "@/components/scale-calculator";
import { Dashboard } from "@/components/dashboard";
import { useRef } from "react";

export default function BalancaPage() {
  const scaleCalculatorRef = useRef<{ handleClear: () => void; }>(null);
  
  const mainContent = (
    <div className="p-1">
        <ScaleCalculator ref={scaleCalculatorRef} />
    </div>
  );

  return (
      <Dashboard initialCategoryId="balanca">
        {mainContent}
      </Dashboard>
  );
}

    