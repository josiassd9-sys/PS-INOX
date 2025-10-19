
"use client";

import dynamic from "next/dynamic";
import { Loader } from "lucide-react";

const LoadingComponent = () => (
    <div className="flex items-center justify-center p-8 gap-2">
        <Loader className="animate-spin h-5 w-5 text-primary"/>
        <span className="text-muted-foreground">Carregando calculadora...</span>
    </div>
)

const SteelDeckCalculator = dynamic(() => import('@/components/perfis/SteelDeckCalculator').then(mod => mod.SteelDeckCalculator), {
    ssr: false,
    loading: () => <LoadingComponent />,
});


function LajePage(props: any) {
  return <SteelDeckCalculator {...props} />;
}
LajePage.displayName = 'LajePage';

export default LajePage;
