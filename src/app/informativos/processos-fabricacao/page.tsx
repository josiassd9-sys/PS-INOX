
"use client";

import * as React from "react";
import dynamic from 'next/dynamic';
import { Dashboard } from "@/components/dashboard";
import { Loader } from "lucide-react";

const ManufacturingProcesses = dynamic(() => import('@/components/manufacturing-processes').then(m => m.ManufacturingProcesses), {
  loading: () => <div className="flex justify-center items-center p-4"><Loader className="animate-spin" /></div>,
  ssr: false,
});


export default function ManufacturingPage() {
  return (
    <Dashboard initialCategoryId="informativos/processos-fabricacao">
      <div className="container mx-auto p-4">
        <ManufacturingProcesses />
      </div>
    </Dashboard>
  );
}
