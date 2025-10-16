
"use client";

import * as React from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow, TableHead } from "./ui/table";

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

interface PrintableScaleTicketProps {
    weighingSets: WeighingSet[];
    headerData: {
        client: string;
        plate: string;
        driver: string;
        initialWeight: string;
    };
    operationType: OperationType;
}

export function PrintableScaleTicket({ weighingSets, headerData, operationType }: PrintableScaleTicketProps) {
    
  const formatNumber = (num: number) => {
    if (isNaN(num)) return "0";
    return new Intl.NumberFormat('pt-BR', {useGrouping: false}).format(num);
  }

  const grandTotalLiquido = weighingSets.reduce((total, set) => {
    const setItemsTotal = set.items.reduce((acc, item) => acc + item.liquido, 0);
    return total + (setItemsTotal - set.descontoCacamba);
  }, 0);

  return (
    <div className="p-4 max-w-4xl mx-auto bg-white text-black font-sans">
      <header className="text-center mb-4">
        <h1 className="text-2xl font-bold">PS INOX</h1>
        <p className="text-sm">Comércio de Aços Inoxidáveis e Ligas Especiais</p>
      </header>

      <section className="mb-4 border-t border-b border-black py-2">
        <div className="flex justify-between text-sm">
          <div><span className="font-bold">Cliente:</span> {headerData.client || 'N/A'}</div>
          <div><span className="font-bold">Data:</span> {new Date().toLocaleDateString('pt-BR')}</div>
        </div>
        <div className="flex justify-between text-sm">
          <div><span className="font-bold">Motorista:</span> {headerData.driver || 'N/A'}</div>
          <div><span className="font-bold">Placa:</span> {headerData.plate || 'N/A'}</div>
        </div>
      </section>

      {weighingSets.map((set, setIndex) => {
        const subtotalLiquido = set.items.reduce((acc, item) => acc + item.liquido, 0);
        const totalLiquidoSet = subtotalLiquido - set.descontoCacamba;

        return (
          <div key={set.id} className="mb-4">
            <h2 className="text-lg font-bold border-b border-black mb-1">
              {setIndex === 0 ? "Caçamba 1" : "Bitrem / Caçamba 2"}
            </h2>
            <Table>
              <TableHeader>
                <TableRow className="text-xs">
                  <TableHead className="h-auto p-1 font-bold text-black">Material</TableHead>
                  <TableHead className="h-auto p-1 text-right font-bold text-black">Bruto (kg)</TableHead>
                  <TableHead className="h-auto p-1 text-right font-bold text-black">Tara (kg)</TableHead>
                  <TableHead className="h-auto p-1 text-right font-bold text-black">A/L (kg)</TableHead>
                  <TableHead className="h-auto p-1 text-right font-bold text-black">Líquido (kg)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {set.items.map(item => (
                  <TableRow key={item.id} className="text-xs">
                    <TableCell className="p-1">{item.material}</TableCell>
                    <TableCell className="p-1 text-right">{formatNumber(item.bruto)}</TableCell>
                    <TableCell className="p-1 text-right">{formatNumber(item.tara)}</TableCell>
                    <TableCell className="p-1 text-right">{formatNumber(item.descontos)}</TableCell>
                    <TableCell className="p-1 text-right font-semibold">{formatNumber(item.liquido)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex justify-end gap-4 mt-1 text-sm border-t border-dashed border-black pt-1">
                <div>Subtotal: <span className="font-semibold">{formatNumber(subtotalLiquido)} kg</span></div>
                <div>Caçamba: <span className="font-semibold">{formatNumber(set.descontoCacamba)} kg</span></div>
                <div className="font-bold">Total Caçamba: <span className="font-bold">{formatNumber(totalLiquidoSet)} kg</span></div>
            </div>
          </div>
        );
      })}

      <footer className="mt-4 border-t-2 border-black pt-2">
        <div className="flex justify-end">
            <div className="text-right">
                <p className="text-base font-bold">Peso Líquido Total</p>
                <p className="text-3xl font-bold">{formatNumber(grandTotalLiquido)} kg</p>
            </div>
        </div>
        <div className="mt-8 text-center">
            <p className="text-sm">_________________________________________</p>
            <p className="text-sm font-semibold">Assinatura do Motorista</p>
        </div>
      </footer>
    </div>
  );
}
