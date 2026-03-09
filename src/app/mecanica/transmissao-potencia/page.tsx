
"use client";

import * as React from "react";
import dynamic from 'next/dynamic';
import { Dashboard } from "@/components/dashboard";
import { Loader } from "lucide-react";

const PowerTransmissionGuide = dynamic(() => import('@/components/power-transmission-guide').then(m => m.PowerTransmissionGuide), {
  loading: () => <div className="flex justify-center items-center p-4"><Loader className="animate-spin" /></div>,
  ssr: false,
});


export default function PowerTransmissionPage() {
  return (
    <Dashboard initialCategoryId="mecanica/transmissao-potencia">
      <div className="container mx-auto p-4">
        <PowerTransmissionGuide />
      </div>
    </Dashboard>
  );
}
