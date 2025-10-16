
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
  name: string;
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
    return new Intl.NumberFormat('pt-BR', {useGrouping: true}).format(num);
  }

  const grandTotalLiquido = weighingSets.reduce((total, set) => {
    const setItemsTotal = set.items.reduce((acc, item) => acc + item.liquido, 0);
    return total + (setItemsTotal - set.descontoCacamba);
  }, 0);

  return (
    <div className="w-full p-6 text-xs font-sans text-black bg-white">
        <style>
          {`
            @page {
              size: A4;
              margin: 10mm;
            }
            @media print {
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              .no-print {
                display: none;
              }
            }
            table, th, td {
              border-collapse: collapse;
            }
          `}
        </style>

        {/* Logo + Cabeçalho */}
        <div className="text-center mb-3">
          <h1 className="text-lg font-bold tracking-wide mb-1">PS INOX</h1>
          <h2 className="text-sm font-semibold">PSINOX COMERCIO DE AÇO LTDA</h2>
        </div>

        {/* Ticket e Data */}
        <div className="flex justify-between text-[11px] mb-2">
          <span></span>
          <span>Data: <strong>{new Date().toLocaleDateString('pt-BR')}</strong></span>
        </div>

        {/* Linha 1: Motorista, Placa, Cidade */}
        <div className="grid grid-cols-3 gap-2 border-y border-black py-1 mb-2 text-[11px]">
          <div><strong>Motorista:</strong> {headerData.driver || 'N/A'}</div>
          <div><strong>Placa:</strong> {headerData.plate || 'N/A'}</div>
          <div><strong>Cliente:</strong> {headerData.client || 'N/A'}</div>
        </div>
        
        {weighingSets.map((set, setIndex) => {
             const subtotalLiquido = set.items.reduce((acc, item) => acc + item.liquido, 0);
             const totalLiquidoSet = subtotalLiquido - set.descontoCacamba;

            return (
                <div key={set.id} className="mb-3">
                     <h3 className="font-bold text-sm mb-1">{set.name}</h3>
                    <table className="w-full text-[11px] border-t border-black">
                        <thead>
                            <tr className="border-b border-black font-semibold">
                            <th className="text-left py-1 w-[40%]">PRODUTO</th>
                            <th className="text-right py-1">BRUTO</th>
                            <th className="text-right py-1">DESC KG</th>
                            <th className="text-right py-1">TARA</th>
                            <th className="text-right py-1">LÍQUIDO</th>
                            </tr>
                        </thead>
                        <tbody>
                            {set.items.map((item, idx) => (
                            <tr key={idx} className="border-b border-gray-300">
                                <td className="py-1">{item.material}</td>
                                <td className="text-right py-1">{formatNumber(item.bruto)}</td>
                                <td className="text-right py-1">{formatNumber(item.descontos)}</td>
                                <td className="text-right py-1">{formatNumber(item.tara)}</td>
                                <td className="text-right py-1 font-semibold">{formatNumber(item.liquido)}</td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                     <div className="flex justify-end gap-4 mt-1 text-[11px] pt-1">
                        <div>Subtotal: <span className="font-semibold">{formatNumber(subtotalLiquido)} kg</span></div>
                        <div>Caçamba: <span className="font-semibold">{formatNumber(set.descontoCacamba)} kg</span></div>
                        <div className="font-bold">Total Caçamba: <span className="font-bold">{formatNumber(totalLiquidoSet)} kg</span></div>
                    </div>
                </div>
            )
        })}


        {/* Rodapé com total */}
        <div className="text-right font-semibold text-[12px] mt-4 border-t-2 border-black pt-2">
          TOTAL LÍQUIDO QTD: {formatNumber(grandTotalLiquido)} KG
        </div>

        {/* Linha inferior */}
        <div className="mt-6 text-center text-[10px] text-gray-600">
          ____________________________  
          <br />
          Assinatura do Motorista
        </div>
      </div>
  );
}
