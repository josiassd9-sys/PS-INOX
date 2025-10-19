
"use client";

import dynamic from "next/dynamic";
import { Loader } from "lucide-react";

const LoadingComponent = () => (
    <div className="flex items-center justify-center p-8 gap-2">
        <Loader className="animate-spin h-5 w-5 text-primary"/>
        <span className="text-muted-foreground">Carregando calculadora...</span>
    </div>
)

const PilarCalculator = dynamic(() => import('@/components/perfis/PilarCalculator').then(mod => mod.PilarCalculator), {
    ssr: false,
    loading: () => <LoadingComponent />,
});

export default function PilarPage(props: any) {
  return <PilarCalculator {...props} />;
}
