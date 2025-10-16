"use client";

import React, { useState, useEffect } from "react";

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

interface ScaleData {
  weighingSets: WeighingSet[];
  headerData: {
    client: string;
    plate: string;
    driver: string;
  };
  operationType: "loading" | "unloading";
}

export default function PrintableScaleTicket() {
  const [data, setData] = useState<ScaleData | null>(null);

  useEffect(() => {
    try {
      const savedData = localStorage.getItem("scaleData");
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setData(parsedData);
        setTimeout(() => window.print(), 100);
      }
    } catch (error) {
      console.error("Failed to load scale data from localStorage", error);
    }
  }, []);

  if (!data) {
    return (
      <div className="p-4 text-center text-muted-foreground no-print">
        Carregando dados para impressão...
      </div>
    );
  }

  const { weighingSets, headerData } = data;

  const formatNumber = (num: number, useGrouping = false) => {
    if (isNaN(num)) return "0";
    return new Intl.NumberFormat("pt-BR", { useGrouping }).format(num);
  };

  const grandTotalLiquido = weighingSets.reduce((total, set) => {
    const setItemsTotal = set.items.reduce((acc, item) => acc + item.liquido, 0);
    return total + (setItemsTotal - set.descontoCacamba);
  }, 0);

  return (
    <div
      className="bg-white text-black font-sans text-xs w-full"
      style={{
        width: "210mm",
        minHeight: "297mm",
        padding: "20mm 15mm", // margens para afastar do topo e da esquerda
        boxSizing: "border-box",
      }}
    >
      <div className="p-0">
        {/* HEADER */}
        <div className="text-center mb-2">
          <div className="text-[10pt]">PS INOX</div>
          <h1 className="text-xl font-bold uppercase">
            PSINOX COMERCIO DE AÇO LTDA
          </h1>
          <p>Fone: (16) 3761-9564 - Cel:(16) 99788-7055</p>
        </div>

        {/* INFO */}
        <div className="border-t-2 border-b-2 border-black py-1 mb-2">
          <div className="flex justify-between text-sm">
            <span>CLIENTE: {headerData.client}</span>
            <span>PLACA: {headerData.plate}</span>
            <span>MOTORISTA: {headerData.driver}</span>
          </div>
        </div>

        {/* BODY */}
        <div className="space-y-3">
          {weighingSets.map((set) => {
            const subtotalLiquido = set.items.reduce(
              (acc, item) => acc + item.liquido,
              0
            );
            const totalLiquidoSet = subtotalLiquido - set.descontoCacamba;

            return (
              <div key={set.id} className="w-full">
                <h3 className="font-bold uppercase text-center mb-1">
                  {set.name}
                </h3>
                <table className="w-full table-fixed border-collapse">
                  <thead>
                    <tr className="border-t border-b border-dashed border-black">
                      <th className="text-left w-auto">PRODUTO</th>
                      <th className="text-right w-[15%]">BRUTO KG</th>
                      <th className="text-right w-[15%]">TARA KG</th>
                      <th className="text-right w-[12%]">DESC</th>
                      <th className="text-right w-[18%]">LÍQUIDO KG</th>
                    </tr>
                  </thead>
                  <tbody>
                    {set.items.map((item) => (
                      <tr key={item.id}>
                        <td className="text-left">{item.material}</td>
                        <td className="text-right">{formatNumber(item.bruto)}</td>
                        <td className="text-right">{formatNumber(item.tara)}</td>
                        <td className="text-right">
                          {formatNumber(item.descontos)}
                        </td>
                        <td className="text-right">
                          {formatNumber(item.liquido)}
                        </td>
                      </tr>
                    ))}

                    {/* Linha de Total da Caçamba */}
                    <tr className="border-t border-dashed border-black font-bold">
                      <td colSpan={3} className="text-left">
                        TOTAL CAÇAMBA
                      </td>
                      <td className="text-right"></td>
                      <td className="text-right">
                        {formatNumber(totalLiquidoSet)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>

        {/* FOOTER */}
        <div className="mt-4 border-t-2 border-black pt-1">
          <div className="flex justify-between font-bold text-sm">
            <span>PESO LÍQUIDO TOTAL:</span>
            <span>{formatNumber(grandTotalLiquido)} KG</span>
          </div>
        </div>
      </div>
    </div>
  );
}
