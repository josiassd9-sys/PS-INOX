
"use client";

import * as React from "react";
import dynamic from 'next/dynamic';
import { Dashboard } from "@/components/dashboard";
import { Loader } from "lucide-react";

const IndustrialRevolutionGuide = dynamic(() => import('@/components/industrial-revolution-guide').then(m => m.IndustrialRevolutionGuide), {
  loading: () => <div className="flex justify-center items-center p-4"><Loader className="animate-spin" /></div>,
  ssr: false,
});


export default function IndustrialRevolutionPage() {
  return (
    <Dashboard initialCategoryId="informativos/inicio-producao-industrial">
      <div className="container mx-auto p-4">
        <IndustrialRevolutionGuide />
      </div>
    </Dashboard>
  );
}
