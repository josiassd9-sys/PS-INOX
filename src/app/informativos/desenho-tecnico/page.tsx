
"use client";

import * as React from "react";
import dynamic from 'next/dynamic';
import { Dashboard } from "@/components/dashboard";
import { Loader } from "lucide-react";

const TechnicalDrawingGuide = dynamic(() => import('@/components/technical-drawing-guide').then(m => m.TechnicalDrawingGuide), {
  loading: () => <div className="flex justify-center items-center p-4"><Loader className="animate-spin" /></div>,
  ssr: false,
});

export default function TechnicalDrawingPage() {
  return (
    <Dashboard initialCategoryId="informativos/desenho-tecnico">
      <div className="container mx-auto p-4">
        <TechnicalDrawingGuide />
      </div>
    </Dashboard>
  );
}
