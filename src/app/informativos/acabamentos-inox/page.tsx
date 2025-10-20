
"use client";

import * as React from "react";
import dynamic from 'next/dynamic';
import { Dashboard } from "@/components/dashboard";
import { Loader } from "lucide-react";

const StainlessSteelFinishesGuide = dynamic(() => import('@/components/stainless-steel-finishes-guide').then(m => m.StainlessSteelFinishesGuide), {
  loading: () => <div className="flex justify-center items-center p-4"><Loader className="animate-spin" /></div>,
  ssr: false,
});


export default function FinishesPage() {
  return (
    <Dashboard initialCategoryId="informativos/acabamentos-inox">
      <div className="container mx-auto p-4">
        <StainlessSteelFinishesGuide />
      </div>
    </Dashboard>
  );
}
