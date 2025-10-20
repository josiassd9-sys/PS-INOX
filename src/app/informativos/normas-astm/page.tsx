
"use client";

import * as React from "react";
import dynamic from 'next/dynamic';
import { Dashboard } from "@/components/dashboard";
import { Loader } from "lucide-react";

const AstmStandards = dynamic(() => import('@/components/astm-standards').then(m => m.AstmStandards), {
  loading: () => <div className="flex justify-center items-center p-4"><Loader className="animate-spin" /></div>,
  ssr: false,
});

export default function AstmPage() {
  return (
    <Dashboard initialCategoryId="informativos/normas-astm">
      <div className="container mx-auto p-4">
        <AstmStandards />
      </div>
    </Dashboard>
  );
}
