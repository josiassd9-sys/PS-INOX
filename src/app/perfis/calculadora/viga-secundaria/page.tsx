
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

const VigaSecundariaCalculator = dynamic(() => import('@/components/perfis/VigaSecundariaCalculator').then(mod => mod.VigaSecundariaCalculator), {
    ssr: false,
    loading: () => <LoadingComponent />,
});

export default function VigaSecundariaPage() {
  return <VigaSecundariaCalculator />;
}
