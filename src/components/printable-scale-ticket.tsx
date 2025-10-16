
"use client";

import * as React from "react";

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

interface PrintableScaleTicketProps {
  weighingSets: WeighingSet[];
  headerData: {
    client: string;
    plate: string;
    driver: string;
  };
}

export function PrintableScaleTicket({ weighingSets, headerData }: PrintableScaleTicketProps) {
  const formatNumber = (num: number) =>
    isNaN(num) ? "0,00" : new Intl.NumberFormat("pt-BR").format(num);

  const totalGeral = weighingSets.reduce((sum, set) => {
    const subtotal = set.items.reduce((acc, i) => acc + i.liquido, 0);
    return sum + subtotal - set.descontoCacamba;
  }, 0);

  return (
    <div className="print:block hidden text-[11px] text-black font-sans bg-white">
      <style>
        {`
        @page {
          size: A4 portrait;
          margin: 12mm 10mm;
        }
        @media print {
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          padding: 4px 6px;
        }
        th {
          border-bottom: 1px solid #000;
        }
        td {
          border-bottom: 1px solid #ccc;
        }
      `}
      </style>

      {/* Cabeçalho */}
      <div className="text-center mb-2">
        <h1 className="text-xl font-bold tracking-wide leading-tight">PS INOX</h1>
        <h2 className="text-sm font-semibold leading-tight">
          PSINOX COMERCIO DE AÇO LTDA
        </h2>
      </div>

      {/* Linha com Motorista, Placa, Cliente */}
      <div className="grid grid-cols-3 border-b border-black pb-1 mb-2 text-[11px]">
        <div><strong>Motorista:</strong> {headerData.driver || "—"}</div>
        <div><strong>Placa:</strong> {headerData.plate || "—"}</div>
        <div><strong>Cidade/Cliente:</strong> {headerData.client || "—"}</div>
      </div>

      {/* Tabelas por Caçamba */}
      {weighingSets.map((set) => {
        const subtotal = set.items.reduce((s, i) => s + i.liquido, 0);
        const total = subtotal - set.descontoCacamba;

        return (
          <div key={set.id} className="mb-4 break-inside-avoid">
            <h3 className="text-[12px] font-bold mb-1">{set.name}</h3>
            <table>
              <thead>
                <tr className="font-semibold">
                  <th style={{ width: "35%" }}>PRODUTO</th>
                  <th style={{ width: "10%", textAlign: "right" }}>BRUTO</th>
                  <th style={{ width: "10%", textAlign: "right" }}>DESC KG</th>
                  <th style={{ width: "10%", textAlign: "right" }}>TARA</th>
                  <th style={{ width: "10%", textAlign: "right" }}>LÍQUIDO</th>
                  <th style={{ width: "10%", textAlign: "right" }}>CAÇAMBA</th>
                  <th style={{ width: "15%", textAlign: "right" }}>SUBTOTAL</th>
                </tr>
              </thead>
              <tbody>
                {set.items.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.material}</td>
                    <td style={{ textAlign: "right" }}>{formatNumber(item.bruto)}</td>
                    <td style={{ textAlign: "right" }}>{formatNumber(item.descontos)}</td>
                    <td style={{ textAlign: "right" }}>{formatNumber(item.tara)}</td>
                    <td style={{ textAlign: "right" }}>{formatNumber(item.liquido)}</td>
                    <td style={{ textAlign: "right" }}>{formatNumber(set.descontoCacamba)}</td>
                    <td style={{ textAlign: "right" }}>{formatNumber(subtotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Total por Caçamba */}
            <div className="flex justify-end mt-1 text-[11px] font-semibold border-b border-black pb-1">
              TOTAL CAÇAMBA: {formatNumber(total)} KG
            </div>
          </div>
        );
      })}

      {/* Rodapé Total */}
      <div className="text-right mt-4 border-t-2 border-black pt-2 font-bold text-[12px]">
        TOTAL LÍQUIDO QTD: {formatNumber(totalGeral)} KG
      </div>

      {/* Assinatura */}
      <div className="mt-8 text-center text-[10px] text-gray-700">
        ____________________________ <br />
        Assinatura do Motorista
      </div>
    </div>
  );
}
