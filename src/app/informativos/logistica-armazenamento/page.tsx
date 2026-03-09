
"use client";

import * as React from "react";
import dynamic from 'next/dynamic';
import { Dashboard } from "@/components/dashboard";
import { Loader } from "lucide-react";

const SteelLogisticsGuide = dynamic(() => import('@/components/steel-logistics-guide').then(m => m.SteelLogisticsGuide), {
  loading: () => <div className="flex justify-center items-center p-4"><Loader className="animate-spin" /></div>,
  ssr: false,
});


export default function SteelLogisticsPage() {
  return (
    <Dashboard initialCategoryId="informativos/logistica-armazenamento">
      <div className="container mx-auto p-4">
        <SteelLogisticsGuide />
      </div>
    </Dashboard>
  );
}
