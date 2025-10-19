
"use client";

import dynamic from "next/dynamic";
import { Loader } from "lucide-react";

const LoadingComponent = () => (
    <div className="flex items-center justify-center p-8 gap-2">
        <Loader className="animate-spin h-5 w-5 text-primary"/>
        <span className="text-muted-foreground">Carregando calculadora...</span>
    </div>
)

const VigaPrincipalCalculator = dynamic(() => import('@/components/perfis/VigaPrincipalCalculator').then(mod => mod.VigaPrincipalCalculator), {
    ssr: false,
    loading: () => <LoadingComponent />,
});
VigaPrincipalCalculator.displayName = 'VigaPrincipalCalculator';


export default function VigaPrincipalPage(props: any) {
  return <VigaPrincipalCalculator {...props} />;
}
