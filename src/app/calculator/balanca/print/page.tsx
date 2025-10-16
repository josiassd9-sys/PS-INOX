

"use client";

import * as React from "react";
import { PrintableScaleTicket } from "@/components/printable-scale-ticket";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

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
  name: string;
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
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        try {
            const savedData = localStorage.getItem("scaleData");
            if (savedData) {
                const parsedData = JSON.parse(savedData);
                setData(parsedData);
            }
        } catch (error) {
            console.error("Failed to load scale data from localStorage", error);
        } finally {
            setLoading(false);
        }
    }, []);

    if (loading) {
        return (
             <div className="w-full p-6">
                <div className="space-y-4">
                    <Skeleton className="h-10 w-1/2 mx-auto" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-40 w-full" />
                    <Skeleton className="h-20 w-full" />
                </div>
            </div>
        );
    }

    if (!data) {
        return (
             <div className="p-4 text-center text-muted-foreground">
                Nenhum dado de pesagem encontrado para imprimir.
            </div>
        )
    }

    return (
        <div>
            <div className="fixed bottom-4 right-4 no-print">
                <Button onClick={() => window.print()} size="lg">
                    <Printer className="mr-2 h-5 w-5" />
                    Imprimir Ticket
                </Button>
            </div>
            <PrintableScaleTicket {...data} />
        </div>
    );
}
