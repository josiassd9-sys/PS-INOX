
"use client";

import dynamic from "next/dynamic";
import { Loader } from "lucide-react";

const LoadingComponent = () => (
    <div className="flex items-center justify-center p-8 gap-2">
        <Loader className="animate-spin h-5 w-5 text-primary"/>
        <span className="text-muted-foreground">Carregando calculadora...</span>
    </div>
)

const SapataCalculator = dynamic(() => import('@/components/perfis/SapataCalculator').then(mod => mod.SapataCalculator), {
    ssr: false,
    loading: () => <LoadingComponent />,
});

function SapataPage(props: any) {
  return <SapataCalculator {...props} />;
}
SapataPage.displayName = 'SapataPage';

export default SapataPage;
