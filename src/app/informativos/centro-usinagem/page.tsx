
"use client";

import * as React from "react";
import dynamic from 'next/dynamic';
import { Dashboard } from "@/components/dashboard";
import { Loader } from "lucide-react";

const MachiningCenterGuide = dynamic(() => import('@/components/machining-center-guide').then(m => m.MachiningCenterGuide), {
  loading: () => <div className="flex justify-center items-center p-4"><Loader className="animate-spin" /></div>,
  ssr: false,
});

export default function MachiningCenterPage() {
  return (
    <Dashboard initialCategoryId="informativos/centro-usinagem">
      <div className="container mx-auto p-4">
        <MachiningCenterGuide />
      </div>
    </Dashboard>
  );
}
