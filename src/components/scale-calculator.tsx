// components/ScaleCalculator.tsx
"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "./ui/button";
import { PlusCircle, Printer, Save, Sparkles, Trash2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Icon } from "./icons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Separator } from "./ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface MaterialItem {
  id: string;
  name: string;
  gross: string;
  waste: string;
  tare: string;
  net: number;
}

interface WeighingSet {
  id: string;
  items: MaterialItem[];
  containerWeight: string;
  subTotalNet: number;
  totalNet: number;
}

const LOCAL_STORAGE_KEY = "scaleCalculatorState_v4";
const TICKET_NUMBER_KEY = "scaleCalculator_ticketNumber_v1";

const createNewItem = (previousItem?: MaterialItem): MaterialItem => {
  const grossValue = previousItem ? previousItem.tare : "";
  return {
    id: uuidv4(),
    name: "",
    gross: grossValue,
    waste: "",
    tare: "",
    net: 0,
  };
};

const createNewWeighingSet = (): WeighingSet => ({
  id: uuidv4(),
  items: [createNewItem()],
  containerWeight: "",
  subTotalNet: 0,
  totalNet: 0,
});

const sanitizeState = (state: any): { weighingSets: WeighingSet[]; headerData: any } => {
  const headerData = state?.headerData || {
    client: "",
    plate: "",
    driver: "",
    city: "",
    logoUrl: "",
    ticketNumber: 1,
  };

  if (!state || !Array.isArray(state.weighingSets)) {
    return { weighingSets: [createNewWeighingSet()], headerData };
  }
  const sanitizedSets = state.weighingSets.map((set: any) => {
    if (!set || !set.id || !Array.isArray(set.items)) {
      return createNewWeighingSet();
    }
    const sanitizedItems = set.items.map((item: any) => ({
      id: item.id || uuidv4(),
      name: item.name || "",
      gross: item.gross || "",
      waste: item.waste || "",
      tare: item.tare || "",
      net: typeof item.net === "number" ? item.net : 0,
    }));
    return {
      id: set.id,
      items: sanitizedItems.length > 0 ? sanitizedItems : [createNewItem()],
      containerWeight: set.containerWeight || "",
      subTotalNet: typeof set.subTotalNet === "number" ? set.subTotalNet : 0,
      totalNet: typeof set.totalNet === "number" ? set.totalNet : 0,
    };
  });

  return {
    weighingSets: sanitizedSets.length > 0 ? sanitizedSets : [createNewWeighingSet()],
    headerData,
  };
};

export function ScaleCalculator() {
  const { toast } = useToast();
  const [weighingSets, setWeighingSets] = React.useState<WeighingSet[]>([createNewWeighingSet()]);
  const [headerData, setHeaderData] = React.useState({
    client: "",
    plate: "",
    driver: "",
    city: "",
    logoUrl: "",
  });
  const [ticketNumber, setTicketNumber] = React.useState<number>(1);
  const [isClient, setIsClient] = React.useState(false);

  // Load from localStorage on mount
  React.useEffect(() => {
    setIsClient(true);
    try {
      const savedStateJSON = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedStateJSON) {
        const savedState = JSON.parse(savedStateJSON);
        const sanitized = sanitizeState(savedState);
        setWeighingSets(sanitized.weighingSets);
        setHeaderData({
          client: sanitized.headerData.client || "",
          plate: sanitized.headerData.plate || "",
          driver: sanitized.headerData.driver || "",
          city: sanitized.headerData.city || "",
          logoUrl: sanitized.headerData.logoUrl || "",
        });
      }

      const ticketRaw = localStorage.getItem(TICKET_NUMBER_KEY);
      if (ticketRaw) {
        const num = parseInt(ticketRaw, 10);
        if (!isNaN(num)) setTicketNumber(num);
      }
    } catch (error) {
      console.error("Failed to load from localStorage", error);
      setWeighingSets([createNewWeighingSet()]);
    }
  }, []);

  // Calculation effect: recalc when relevant fields change
  React.useEffect(() => {
    setWeighingSets((prev) =>
      prev.map((set) => {
        const newItems = set.items.map((item) => {
          const gross = parseFloat(item.gross.replace(",", ".").trim()) || 0;
          const waste = parseFloat(item.waste.replace(",", ".").trim()) || 0;
          const tare = parseFloat(item.tare.replace(",", ".").trim()) || 0;
          const net = gross - waste - tare;
          return { ...item, net: net > 0 ? net : 0 };
        });

        const subTotalNet = newItems.reduce((acc, item) => acc + item.net, 0);
        const containerDiscount = parseFloat(set.containerWeight.replace(",", ".").trim()) || 0;
        const totalNet = subTotalNet - containerDiscount;

        return { ...set, items: newItems, subTotalNet, totalNet };
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weighingSets.map((s) => `${s.containerWeight},` + s.items.map((i) => `${i.gross}${i.waste}${i.tare}`).join()).join()]);

  const handleItemChange = (
    setId: string,
    itemId: string,
    field: keyof Omit<MaterialItem, "id" | "net">,
    value: string
  ) => {
    setWeighingSets((prev) =>
      prev.map((set) => {
        if (set.id !== setId) return set;
        const newItems = set.items.map((item) => {
          if (item.id !== itemId) return item;

          if (field !== "name") {
            const sanitizedValue = value.replace(/[^0-9,.-]/g, "").replace(".", ",");
            if (!/^\d*\,?\d*$/.test(sanitizedValue) && sanitizedValue !== "") return item;
            return { ...item, [field]: sanitizedValue };
          }
          return { ...item, [field]: value };
        });
        return { ...set, items: newItems };
      })
    );
  };

  const handleContainerWeightChange = (setId: string, value: string) => {
    const sanitizedValue = value.replace(/[^0-9,.-]/g, "").replace(".", ",");
    if (!/^\d*\,?\d*$/.test(sanitizedValue) && sanitizedValue !== "") return;

    setWeighingSets((prev) => prev.map((set) => (set.id === setId ? { ...set, containerWeight: sanitizedValue } : set)));
  };

  const addItem = (setId: string) => {
    setWeighingSets((prev) =>
      prev.map((set) => {
        if (set.id !== setId) return set;
        const lastItem = set.items[set.items.length - 1];
        return { ...set, items: [...set.items, createNewItem(lastItem)] };
      })
    );
  };

  const removeItem = (setId: string, itemId: string) => {
    setWeighingSets((prev) =>
      prev.map((set) => {
        if (set.id !== setId) return set;
        const newItems = set.items.filter((item) => item.id !== itemId);
        if (newItems.length === 0) {
          return { ...set, items: [createNewItem()] };
        }
        return { ...set, items: newItems };
      })
    );
  };

  const addWeighingSet = () => {
    setWeighingSets((prev) => [...prev, createNewWeighingSet()]);
  };

  const removeWeighingSet = (setId: string) => {
    setWeighingSets((prev) => {
      const newSets = prev.filter((set) => set.id !== setId);
      if (newSets.length === 0) return [createNewWeighingSet()];
      return newSets;
    });
  };

  const handleClearAll = () => {
    setWeighingSets([createNewWeighingSet()]);
    setHeaderData({ client: "", plate: "", driver: "", city: "", logoUrl: "" });
    toast({ title: "Tudo limpo!", description: "Você pode iniciar uma nova pesagem." });
  };

  const handleHeaderChange = (field: keyof typeof headerData, value: string) => {
    setHeaderData((prev) => ({ ...prev, [field]: value }));
  };

  const grandTotalNet = weighingSets.reduce((acc, set) => acc + set.totalNet, 0);

  const formatNumber = (value: number) => {
    if (isNaN(value)) return "0,00";
    return new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Salvamento local + incremento do número do ticket
  const saveData = () => {
    if (!isClient) return;
    try {
      const stateToSave = { weighingSets, headerData, savedAt: new Date().toISOString(), ticketAssigned: ticketNumber };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));

      // incrementa ticket localmente para a próxima pesagem
      const nextTicket = ticketNumber + 1;
      localStorage.setItem(TICKET_NUMBER_KEY, String(nextTicket));
      setTicketNumber(nextTicket);

      toast({ title: "Pesagem Salva!", description: `Ticket nº ${ticketNumber} salvo localmente.` });
    } catch (error) {
      console.error("Failed to save to localStorage", error);
      toast({ title: "Erro ao Salvar", description: "Não foi possível salvar os dados.", variant: "destructive" });
    }
  };

  // Função para forçar nova pesagem (sem salvar) e incrementar ticket (opcional)
  const newWeighingSession = () => {
    handleClearAll();
    const nextTicket = ticketNumber + 1;
    localStorage.setItem(TICKET_NUMBER_KEY, String(nextTicket));
    setTicketNumber(nextTicket);
    toast({ title: "Nova Pesagem", description: `Ticket atualizado para ${nextTicket}.` });
  };

  // HTML + estilos de impressão embutidos para garantir A4
  return (
    <div className="space-y-2 p-1" id="scale-calculator-printable-area">
      {/* Print-specific inline styles to match A4 ticket layout similar ao anexo */}
      <style>{`
        @media print {
          @page { size: A4; margin: 10mm 12mm; }
          #scale-calculator-printable-area { width: 100%; max-width: 100%; }
          /* Esconder controles de UI */
          .print\\:hidden { display: none !important; }
          input.h-8 { display: none !important; }
          /* Exibir spans com valores em caixas */
          .print\\:block { display: block !important; }
          .print\\:border { border: 1px solid #333 !important; padding: 6px 8px; border-radius: 6px;}
          /* Cabeçalho estilo ticket */
          #print-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #111; padding-bottom: 8px; margin-bottom: 8px;}
          #print-header .title { font-size: 28px; font-weight: 700; letter-spacing: 2px; text-align: center; flex: 1; }
          #print-header .left, #print-header .right { width: 25%; }
          /* Caçambas layout */
          .print-cacamba { border-top: 1px solid #111; padding-top: 6px; margin-top: 6px; page-break-inside: avoid; }
          .print-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; }
          .print-table { width: 100%; border-collapse: collapse; margin-top: 6px; }
          .print-table th { text-align: left; font-weight: 700; padding: 6px 8px; border-bottom: 1px solid #ddd; font-size: 10pt; }
          .print-table td { padding: 6px 8px; font-size: 10pt; border-bottom: 1px solid #eee; }
          .box-subtotal, .box-desc, .box-total { border: 1px solid #111; padding: 8px 10px; border-radius: 8px; display: inline-block; min-width: 180px; text-align: left; }
          .box-total { min-width: 220px; text-align: center; }
          #total-geral { border: 2px solid #111; padding: 10px 14px; border-radius: 8px; display: inline-block; font-weight: 700; font-size: 14pt; background: #f7f7f7; }
        }
      `}</style>

      {/* Cabeçalho tela (inputs) */}
      <div className="mb-2 print:mb-2" id="scale-calculator-header">
        <div id="print-header" className="print:border-b print:pb-2">
          <div className="left print:hidden">
            <Label className="text-xs">Logo</Label>
            <Input
              placeholder="URL do logo"
              value={headerData.logoUrl}
              onChange={(e) => handleHeaderChange("logoUrl", e.target.value)}
              className="h-8"
            />
          </div>

          <div className="title">
            {/* Na impressão mostra o logo central ou texto "PS INOX" se não houver logo */}
            <span className="hidden print:block">
              {headerData.logoUrl ? (
                <img src={headerData.logoUrl} alt="Logo" style={{ maxHeight: 48 }} />
              ) : (
                <span style={{ fontWeight: 800, fontSize: 24 }}>PS INOX</span>
              )}
            </span>

            {/* Na tela mostra apenas o título simples */}
            <h1 className="text-3xl font-bold text-center mb-2 print:hidden">Balança</h1>
          </div>

          <div className="right text-right">
            <div className="print:hidden">
              <Label className="text-xs">Ticket Nº</Label>
              <div className="font-bold">{ticketNumber}</div>
            </div>

            {/* Versão de impressão do ticket */}
            <div className="hidden print:block">
              <div style={{ textAlign: "right", fontWeight: 700 }}>
                TICKET DE PESAGEM
              </div>
              <div style={{ textAlign: "right", marginTop: 4 }}>
                Nº: {ticketNumber.toString().padStart(4, "0")}
              </div>
            </div>
          </div>
        </div>

        {/* Inputs do cabeçalho (mantém formato do anexo) */}
        <Card className="p-2 print:border-none print:shadow-none print:p-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div className="space-y-1">
              <Label htmlFor="client" className="text-xs">NOME</Label>
              <Input id="client" value={headerData.client} onChange={(e) => handleHeaderChange("client", e.target.value)} placeholder="NP COMERCIAL E DISTRIBUIDORA DE VARIEDADES LTDA" className="h-8"/>
              <span className="hidden print:block print:text-black print:border">{headerData.client || " "}</span>
            </div>
            <div className="space-y-1">
              <Label htmlFor="driver" className="text-xs">MOTORISTA</Label>
              <Input id="driver" value={headerData.driver} onChange={(e) => handleHeaderChange("driver", e.target.value)} placeholder="Motorista" className="h-8"/>
              <span className="hidden print:block print:text-black print:border">{headerData.driver || " "}</span>
            </div>
            <div className="space-y-1">
              <Label htmlFor="plate" className="text-xs">PLACA</Label>
              <Input id="plate" value={headerData.plate} onChange={(e) => handleHeaderChange("plate", e.target.value)} placeholder="Placa" className="h-8"/>
              <span className="hidden print:block print:text-black print:border">{headerData.plate || " "}</span>
            </div>
            <div className="space-y-1">
              <Label htmlFor="city" className="text-xs">CIDADE</Label>
              <Input id="city" value={headerData.city} onChange={(e) => handleHeaderChange("city", e.target.value)} placeholder="Cidade - UF" className="h-8"/>
              <span className="hidden print:block print:text-black print:border">{headerData.city || " "}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Caçambas */}
      {weighingSets.map((set, setIndex) => (
        <Card key={set.id} className="bg-card/50 print:shadow-none print:border-border print:mb-2">
          <CardHeader className="flex-row items-center justify-between p-2">
            <CardTitle className="text-lg">Caçamba {setIndex + 1}</CardTitle>
            {weighingSets.length > 1 && (
              <Button variant="ghost" size="icon" onClick={() => removeWeighingSet(set.id)} className="print:hidden h-7 w-7 text-destructive/80 hover:text-destructive">
                <Icon name="Trash2" />
              </Button>
            )}
          </CardHeader>

          <CardContent className="p-0">
            {/* Tabela para tela (inputs) e para impressão (table layout) */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="text-xs">
                    <TableHead className="min-w-[150px] p-1">PRODUTO</TableHead>
                    <TableHead className="min-w-[100px] p-1">BRUTO</TableHead>
                    <TableHead className="min-w-[100px] p-1">DESC KG</TableHead>
                    <TableHead className="min-w-[100px] p-1">TARA</TableHead>
                    <TableHead className="min-w-[110px] p-1 font-bold text-accent-price text-center">LIQUIDO</TableHead>
                    <TableHead className="w-[40px] p-1 print:hidden"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {set.items.map((item, itemIndex) => {
                    const isGrossDisabled = itemIndex > 0 && set.items[itemIndex - 1]?.tare !== "";
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="p-1">
                          <Input value={item.name} onChange={(e) => handleItemChange(set.id, item.id, "name", e.target.value)} placeholder="1018-S-SUCATA INOX 201." className="h-8" />
                          <span className="hidden print:block print:text-black">{item.name || " "}</span>
                        </TableCell>
                        <TableCell className="p-1">
                          <Input value={item.gross} onChange={(e) => handleItemChange(set.id, item.id, "gross", e.target.value)} placeholder="0,00" className="h-8" disabled={isGrossDisabled} />
                          <span className="hidden print:block print:text-black">{item.gross || "0,00"}</span>
                        </TableCell>
                        <TableCell className="p-1">
                          <Input value={item.waste} onChange={(e) => handleItemChange(set.id, item.id, "waste", e.target.value)} placeholder="0,00" className="h-8" />
                          <span className="hidden print:block print:text-black">{item.waste || "0,00"}</span>
                        </TableCell>
                        <TableCell className="p-1">
                          <Input value={item.tare} onChange={(e) => handleItemChange(set.id, item.id, "tare", e.target.value)} placeholder="0,00" className="h-8"/>
                          <span className="hidden print:block print:text-black">{item.tare || "0,00"}</span>
                        </TableCell>
                        <TableCell className="p-1 text-center font-bold text-accent-price align-middle">{formatNumber(item.net)}</TableCell>
                        <TableCell className="p-1 print:hidden">
                          {set.items.length > 1 && <Button variant="ghost" size="icon" onClick={() => removeItem(set.id, item.id)} className="h-8 w-8 text-destructive/70 hover:text-destructive"><Icon name="X" className="h-4 w-4"/></Button>}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {/* Print-only formatted block (to match the ticket layout precisely) */}
              <div className="hidden print:block print-cacamba">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ width: "65%" }}>
                    <table className="print-table">
                      <thead>
                        <tr>
                          <th>PRODUTO</th>
                          <th>BRUTO</th>
                          <th>DESC KG</th>
                          <th>TARA</th>
                          <th>LIQUIDO</th>
                        </tr>
                      </thead>
                      <tbody>
                        {set.items.map((it) => (
                          <tr key={it.id}>
                            <td>{it.name || "-"}</td>
                            <td>{it.gross || "0,00"}</td>
                            <td>{it.waste || "0,00"}</td>
                            <td>{it.tare || "0,00"}</td>
                            <td style={{ fontWeight: 700 }}>{formatNumber(it.net)} KG</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div style={{ width: "32%", display: "flex", flexDirection: "column", gap: 8 }}>
                    <div className="box-subtotal">
                      <div style={{ fontWeight: 700 }}>Subtotal Materiais:</div>
                      <div style={{ fontWeight: 700 }}>{formatNumber(set.subTotalNet)} KG</div>
                    </div>
                    <div className="box-desc">
                      <div style={{ fontWeight: 700 }}>Desconto Caçamba:</div>
                      <div style={{ fontWeight: 700 }}>{set.containerWeight || "0,00"} KG</div>
                    </div>
                    <div className="box-total">
                      <div style={{ fontWeight: 700 }}>TOTAL LIQUIDO QTD:</div>
                      <div style={{ fontWeight: 700 }}>{formatNumber(set.totalNet)} KG</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <div className="p-2 space-y-2">
              <Button variant="outline" size="sm" onClick={() => addItem(set.id)} className="print:hidden">
                <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Material
              </Button>
              <Separator className="my-2" />
              <div className="flex justify-end items-end gap-2">
                <div className="space-y-1">
                  <span className="font-semibold text-sm">Subtotal Materiais:</span>
                  <div className="font-bold text-lg text-primary text-right">{formatNumber(set.subTotalNet)} kg</div>
                </div>
                <div className="space-y-1 w-40">
                  <Label htmlFor={`container-weight-${set.id}`} className="text-xs">Desconto Caçamba (kg)</Label>
                  <Input
                    id={`container-weight-${set.id}`}
                    value={set.containerWeight}
                    onChange={(e) => handleContainerWeightChange(set.id, e.target.value)}
                    placeholder="0,00"
                    className="h-9"
                  />
                </div>
                <div className="space-y-1">
                  <span className="font-semibold">Total Líquido:</span>
                  <div className="font-bold text-xl text-primary text-right">{formatNumber(set.totalNet)} kg</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="flex flex-col sm:flex-row gap-2 print:hidden">
        <Button variant="secondary" onClick={addWeighingSet} className="flex-1">
          <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Bitrem
        </Button>
      </div>

      <Separator className="my-2" />

      <div className="flex justify-end items-center gap-2 pt-2">
        <h3 className="text-lg font-semibold">TOTAL GERAL LÍQUIDO:</h3>
        <div className="text-2xl font-bold text-primary min-w-[150px] text-right">
          {formatNumber(grandTotalNet)} kg
        </div>
      </div>

      {/* Rodapé de impressão com total geral (print-only) */}
      <div className="hidden print:block" style={{ marginTop: 10, display: "flex", justifyContent: "flex-end" }}>
        <div id="total-geral">TOTAL GERAL LIQUIDO: {formatNumber(grandTotalNet)} KG</div>
      </div>

      <div className="flex justify-end pt-2 gap-1 print:hidden">
        <TooltipProvider>
          <AlertDialog>
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Sparkles />
                  </Button>
                </AlertDialogTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Limpar Tudo</p>
              </TooltipContent>
            </Tooltip>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não pode ser desfeita. Isso limpará todos os campos da pesagem atual.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearAll}>Continuar</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={saveData}>
                <Save />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Salvar Pesagem (incrementa ticket)</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={() => window.print()}>
                <Printer />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Imprimir</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={newWeighingSession}>
                <Trash2 />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Nova Pesagem (limpa e avança ticket)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
