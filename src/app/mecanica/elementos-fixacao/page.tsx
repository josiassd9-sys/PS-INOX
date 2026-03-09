
"use client";

import * as React from "react";
import dynamic from 'next/dynamic';
import { Dashboard } from "@/components/dashboard";
import { Loader } from "lucide-react";

const FastenersGuide = dynamic(() => import('@/components/fasteners-guide').then(m => m.FastenersGuide), {
  loading: () => <div className="flex justify-center items-center p-4"><Loader className="animate-spin" /></div>,
  ssr: false,
});

export default function FastenersPage() {
  return (
    <Dashboard initialCategoryId="mecanica/elementos-fixacao">
      <div className="container mx-auto p-4">
        <FastenersGuide />
      </div>
    </Dashboard>
  );
}
