
"use client";

import dynamic from "next/dynamic";
import { Loader } from "lucide-react";
import * as React from "react";

const LoadingComponent = () => (
    <div className="flex items-center justify-center p-8 gap-2">
        <Loader className="animate-spin h-5 w-5 text-primary"/>
        <span className="text-muted-foreground">Carregando calculadora...</span>
    </div>
)

const SlabAnalysis = dynamic(() => import('@/components/perfis/SlabAnalysis').then(mod => mod.SlabAnalysis), {
    ssr: false,
    loading: () => <LoadingComponent />,
});


export default function GeometriaPage() {
  return <SlabAnalysis />;
}
