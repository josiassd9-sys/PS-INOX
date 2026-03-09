
"use client";

import * as React from "react";
import dynamic from 'next/dynamic';
import { Dashboard } from "@/components/dashboard";
import { Loader } from "lucide-react";

const WeldingGuide = dynamic(() => import('@/components/welding-guide').then(m => m.WeldingGuide), {
  loading: () => <div className="flex justify-center items-center p-4"><Loader className="animate-spin" /></div>,
  ssr: false,
});

export default function WeldingGuidePage() {
  return (
    <Dashboard initialCategoryId="informativos/tipos-de-solda">
      <div className="container mx-auto p-4">
        <WeldingGuide />
      </div>
    </Dashboard>
  );
}
