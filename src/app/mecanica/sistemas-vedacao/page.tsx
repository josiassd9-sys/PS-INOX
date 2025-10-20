
"use client";

import * as React from "react";
import dynamic from 'next/dynamic';
import { Dashboard } from "@/components/dashboard";
import { Loader } from "lucide-react";

const SealingSystemsGuide = dynamic(() => import('@/components/sealing-systems-guide').then(m => m.SealingSystemsGuide), {
  loading: () => <div className="flex justify-center items-center p-4"><Loader className="animate-spin" /></div>,
  ssr: false,
});

export default function SealingSystemsPage() {
  return (
    <Dashboard initialCategoryId="mecanica/sistemas-vedacao">
      <div className="container mx-auto p-4">
        <SealingSystemsGuide />
      </div>
    </Dashboard>
  );
}
