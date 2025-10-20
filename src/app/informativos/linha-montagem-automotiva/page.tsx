
"use client";

import * as React from "react";
import dynamic from 'next/dynamic';
import { Dashboard } from "@/components/dashboard";
import { Loader } from "lucide-react";

const AutomotiveAssemblyGuide = dynamic(() => import('@/components/automotive-assembly-guide').then(m => m.AutomotiveAssemblyGuide), {
  loading: () => <div className="flex justify-center items-center p-4"><Loader className="animate-spin" /></div>,
  ssr: false,
});

export default function AutomotiveAssemblyPage() {
  return (
    <Dashboard initialCategoryId="informativos/linha-montagem-automotiva">
      <div className="container mx-auto p-4">
        <AutomotiveAssemblyGuide />
      </div>
    </Dashboard>
  );
}
