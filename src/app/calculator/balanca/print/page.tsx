
"use client";

import * as React from "react";
import { PrintableScaleTicket } from "@/components/printable-scale-ticket";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

type WeighingItem = {
  id: string;
  material: string;
  bruto: number;
  tara: number;
  descontos: number;
  liquido: number;
};

type WeighingSet = {
  id: string;
  items: WeighingItem[];
  descontoCacamba: number;
};

type OperationType = 'loading' | 'unloading';

interface ScaleData {
    weighingSets: WeighingSet[];
    headerData: {
        client: string;
        plate: string;
        driver: string;
        initialWeight: string;
    };
    operationType: OperationType;
}

export default function PrintPage() {
    const [data, setData] = React.useState<ScaleData | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        try {
            const savedData = localStorage.getItem("scaleData");
            if (savedData) {
                setData(JSON.parse(savedData));
            }
        } catch (error) {
            console.error("Failed to load scale data from localStorage", error);
        } finally {
            setIsLoading(false);
        }
    }, []);
    
    if (isLoading) {
        return (
            <div className="p-4 space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-40 w-full" />
            </div>
        )
    }

    if (!data) {
        return <div className="p-4 text-center">Nenhum dado de pesagem encontrado para imprimir.</div>;
    }

    return (
        <div>
            <div className="fixed top-4 right-4 print:hidden">
                <Button onClick={() => window.print()}>
                    <Printer className="mr-2 h-4 w-4" />
                    Imprimir Ticket
                </Button>
            </div>
            <PrintableScaleTicket {...data} />
            <style jsx global>{`
                @media print {
                  body {
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                  }
                }
            `}</style>
        </div>
    );
}
