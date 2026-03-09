
"use client";

import * as React from "react";
import dynamic from 'next/dynamic';
import { Dashboard } from "@/components/dashboard";
import { Loader } from "lucide-react";

const ModernIndustrialProcessesGuide = dynamic(() => import('@/components/modern-industrial-processes-guide').then(m => m.ModernIndustrialProcessesGuide), {
  loading: () => <div className="flex justify-center items-center p-4"><Loader className="animate-spin" /></div>,
  ssr: false,
});

export default function ModernProcessesPage() {
  return (
    <Dashboard initialCategoryId="informativos/processos-industriais-modernos">
      <div className="container mx-auto p-4">
        <ModernIndustrialProcessesGuide />
      </div>
    </Dashboard>
  );
}
