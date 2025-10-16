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


export function PrintableScaleTicket({ weighingSets, headerData, operationType }: ScaleData) {
    
    const formatNumber = (num: number) => {
        if (isNaN(num)) return "0";
        return new Intl.NumberFormat('pt-BR').format(num);
    }

    const grandTotalLiquido = weighingSets.reduce((total, set) => {
      const setItemsTotal = set.items.reduce((acc, item) => acc + item.liquido, 0);
      return total + (setItemsTotal - set.descontoCacamba);
    }, 0);

  return (
    <div className="print-container p-4 font-sans text-xs">
      {/* Cabeçalho */}
      <div className="text-center mb-4">
        <h1 className="font-bold text-lg">PSINOX COMERCIO DE AÇO LTDA</h1>
        <p className="text-sm">TICKET DE PESAGEM - {operationType === 'loading' ? 'CARREGAMENTO' : 'DESCARREGAMENTO'}</p>
        <p className="text-xs">Data: {new Date().toLocaleDateString('pt-BR')}</p>
      </div>

      {/* Informações do Cliente */}
      <div className="border-y border-black py-1 mb-2">
        <div className="flex justify-between">
          <span>CLIENTE: <strong>{headerData.client || 'N/A'}</strong></span>
        </div>
        <div className="flex justify-between">
          <span>MOTORISTA: <strong>{headerData.driver || 'N/A'}</strong></span>
          <span>PLACA: <strong>{headerData.plate || 'N/A'}</strong></span>
        </div>
      </div>
      
      {/* Itens de Pesagem */}
      <div className="space-y-2">
        {weighingSets.map((set) => {
             const subtotalLiquido = set.items.reduce((acc, item) => acc + item.liquido, 0);
             const totalLiquidoSet = subtotalLiquido - set.descontoCacamba;

            return (
              <div key={set.id} className="break-inside-avoid">
                 <h3 className="font-bold text-center text-sm bg-gray-200 py-px">{set.name}</h3>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-black">
                      <th className="text-left font-bold w-[55%]">PRODUTO</th>
                      <th className="text-right font-bold">BRUTO</th>
                      <th className="text-right font-bold">TARA</th>
                      <th className="text-right font-bold">DESC</th>
                      <th className="text-right font-bold">LÍQUIDO</th>
                    </tr>
                  </thead>
                  <tbody>
                    {set.items.map((item) => (
                      <tr key={item.id}>
                        <td>{item.material}</td>
                        <td className="text-right">{formatNumber(item.bruto)}</td>
                        <td className="text-right">{formatNumber(item.tara)}</td>
                        <td className="text-right">{formatNumber(item.descontos)}</td>
                        <td className="text-right font-semibold">{formatNumber(item.liquido)}</td>
                      </tr>
                    ))}
                    {/* Linha de Subtotal */}
                     <tr className="border-t border-black">
                        <td colSpan={2} className="text-left font-bold pt-1">DESC CAÇAMBA</td>
                        <td className="text-right font-bold pt-1">{formatNumber(set.descontoCacamba)}</td>
                        <td className="text-right font-bold pt-1">TOTAL CAÇAMBA</td>
                        <td className="text-right font-bold pt-1">{formatNumber(totalLiquidoSet)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )
        })}
      </div>

      {/* Total Geral */}
      <div className="border-t-2 border-dashed border-black mt-4 pt-2 text-right">
        <span className="font-bold text-sm mr-2">PESO LÍQUIDO TOTAL:</span>
        <span className="font-bold text-lg">{formatNumber(grandTotalLiquido)} KG</span>
      </div>

      {/* Assinatura */}
      <div className="mt-20 flex justify-around">
          <div className="text-center w-1/2">
              <p className="border-t border-black pt-1 mx-4">CONFERIDO</p>
          </div>
          <div className="text-center w-1/2">
              <p className="border-t border-black pt-1 mx-4">MOTORISTA</p>
          </div>
      </div>
    </div>
  );
}
