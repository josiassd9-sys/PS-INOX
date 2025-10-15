import React, { useState, useEffect } from "react";

export default function ScaleCalculator() {
  const [ticketNumber, setTicketNumber] = useState(1);
  const [headerData, setHeaderData] = useState({
    logoUrl: "",
    client: "",
    driver: "",
    plate: "",
    city: "",
  });
  const [items, setItems] = useState([
    { product: "Sucata 304", bruto: 28540, descKg: 0, tara: 15680, liquido: 12860, caçamba: 3000, subtotal: 12860 },
  ]);

  useEffect(() => {
    const storedNumber = localStorage.getItem("ticketNumber");
    if (storedNumber) setTicketNumber(parseInt(storedNumber));
  }, []);

  const handleNewTicket = () => {
    const next = ticketNumber + 1;
    setTicketNumber(next);
    localStorage.setItem("ticketNumber", next);
  };

  const totalLiquido = items.reduce((acc, i) => acc + i.liquido, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full flex flex-col items-center p-4">
      {/* ==== VISUALIZAÇÃO NORMAL (NÃO IMPRIMIR) ==== */}
      <div className="w-full max-w-4xl bg-white shadow-md rounded-xl p-4 mb-6 print:hidden">
        <h2 className="text-xl font-bold mb-4 text-center">Ticket de Pesagem</h2>

        <div className="flex flex-col gap-2 mb-4">
          <input
            type="text"
            placeholder="Nome do Cliente"
            className="border p-2 rounded"
            value={headerData.client}
            onChange={(e) => setHeaderData({ ...headerData, client: e.target.value })}
          />
          <div className="grid grid-cols-3 gap-2">
            <input
              type="text"
              placeholder="Motorista"
              className="border p-2 rounded"
              value={headerData.driver}
              onChange={(e) => setHeaderData({ ...headerData, driver: e.target.value })}
            />
            <input
              type="text"
              placeholder="Placa"
              className="border p-2 rounded"
              value={headerData.plate}
              onChange={(e) => setHeaderData({ ...headerData, plate: e.target.value })}
            />
            <input
              type="text"
              placeholder="Cidade"
              className="border p-2 rounded"
              value={headerData.city}
              onChange={(e) => setHeaderData({ ...headerData, city: e.target.value })}
            />
          </div>
        </div>

        <button
          onClick={handleNewTicket}
          className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition mb-2"
        >
          Novo Ticket
        </button>

        <button
          onClick={handlePrint}
          className="bg-green-600 text-white rounded-lg px-4 py-2 hover:bg-green-700 transition"
        >
          Imprimir Ticket
        </button>
      </div>

      {/* ==== LAYOUT DE IMPRESSÃO (SOMENTE PRINT) ==== */}
      <div className="hidden print:block w-full max-w-3xl mx-auto text-sm text-gray-900">
        {/* Cabeçalho */}
        <div className="border border-black p-3">
          <div className="flex items-center justify-between border-b border-black pb-2 mb-2">
            <img
              src={headerData.logoUrl || "https://via.placeholder.com/100x40?text=LOGO"}
              alt="Logo"
              className="h-10 object-contain"
            />
            <h1 className="font-bold text-lg text-center flex-1">PS INOX</h1>
            <div className="text-right text-xs">
              <p className="font-semibold">TICKET DE PESAGEM Nº: {ticketNumber.toString().padStart(4, "0")}</p>
            </div>
          </div>

          <div className="mb-2">
            <div className="flex items-center mb-1">
              <span className="font-semibold mr-2">Nome:</span>
              <span className="flex-1 border-b border-black">{headerData.client || " "}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="flex items-center">
                <span className="font-semibold mr-1">Motorista:</span>
                <span className="border-b border-black flex-1">{headerData.driver || " "}</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold mr-1">Placa:</span>
                <span className="border-b border-black flex-1">{headerData.plate || " "}</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold mr-1">Cidade:</span>
                <span className="border-b border-black flex-1">{headerData.city || " "}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Corpo da Tabela */}
        <div className="border border-black border-t-0">
          <div className="grid grid-cols-7 font-bold text-xs border-b border-black bg-gray-100 text-center">
            <div className="p-1 border-r border-black">PRODUTO</div>
            <div className="p-1 border-r border-black">BRUTO</div>
            <div className="p-1 border-r border-black">DESC KG</div>
            <div className="p-1 border-r border-black">TARA</div>
            <div className="p-1 border-r border-black">LÍQUIDO</div>
            <div className="p-1 border-r border-black">CAÇAMBA</div>
            <div className="p-1">SUBTOTAL</div>
          </div>

          {items.map((item, idx) => (
            <div key={idx} className="grid grid-cols-7 text-xs text-center border-b border-black">
              <div className="p-1 border-r border-black">{item.product}</div>
              <div className="p-1 border-r border-black">{item.bruto.toLocaleString()}</div>
              <div className="p-1 border-r border-black">{item.descKg.toLocaleString()}</div>
              <div className="p-1 border-r border-black">{item.tara.toLocaleString()}</div>
              <div className="p-1 border-r border-black">{item.liquido.toLocaleString()}</div>
              <div className="p-1 border-r border-black">{item.caçamba.toLocaleString()}</div>
              <div className="p-1">{item.subtotal.toLocaleString()}</div>
            </div>
          ))}

          {/* Subtotal por grupo */}
          <div className="flex justify-end pr-4 py-1 text-xs font-semibold">
            <span>Subtotal Materiais (Subtotal): {totalLiquido.toLocaleString()} KG</span>
          </div>

          {/* Total final */}
          <div className="border-t border-black text-right pr-4 py-2 font-bold text-sm">
            TOTAL LÍQUIDO QTD: {totalLiquido.toLocaleString()} KG
          </div>
        </div>
      </div>
    </div>
  );
}
