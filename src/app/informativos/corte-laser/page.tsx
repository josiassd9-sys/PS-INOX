
"use client";

import * as React from "react";
import dynamic from 'next/dynamic';
import { Dashboard } from "@/components/dashboard";
import { Loader } from "lucide-react";

const LaserCuttingGuide = dynamic(() => import('@/components/laser-cutting-guide').then(m => m.LaserCuttingGuide), {
  loading: () => <div className="flex justify-center items-center p-4"><Loader className="animate-spin" /></div>,
  ssr: false,
});

export default function LaserCuttingPage() {
  return (
    <Dashboard initialCategoryId="informativos/corte-laser">
      <div className="container mx-auto p-4">
        <LaserCuttingGuide />
      </div>
    </Dashboard>
  );
}
