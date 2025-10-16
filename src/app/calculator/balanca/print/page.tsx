
"use client";

import * as React from "react";
import { PrintableScaleTicket } from "@/components/printable-scale-ticket";

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

    React.useEffect(() => {
        try {
            const savedData = localStorage.getItem("scaleData");
            if (savedData) {
                const parsedData = JSON.parse(savedData);
                setData(parsedData);
                setTimeout(() => {
                    window.print();
                }, 100); 
            }
        } catch (error) {
            console.error("Failed to load scale data from localStorage", error);
        }
    }, []);

    if (!data) {
        // Render nothing or a minimal loader until data is ready for printing
        return null;
    }

    return (
        <div>
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
