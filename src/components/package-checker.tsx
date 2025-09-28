"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CATEGORIES, SteelItem } from "@/lib/data";
import { Search } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/lib/utils";

type LastEdited = "weight" | "length";

export function PackageChecker() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedItem, setSelectedItem] = React.useState<SteelItem | null>(null);
  const [packageWeight, setPackageWeight] = React.useState<string>("");
  const [totalPrice, setTotalPrice] = React.useState<string>("");
  const [invoicePercentage, setInvoicePercentage] = React.useState<string>("100");
  const [totalLength, setTotalLength] = React.useState<string>("");
  const [lastEdited, setLastEdited] = React.useState<LastEdited>("weight");

  const handleItemSelect = (item: SteelItem) => {
    setSelectedItem(item);
    setSearchTerm("");
  };

  const allItems = React.useMemo(() => {
    return CATEGORIES.flatMap((cat) =>
      cat.unit === "m" ? cat.items : []
    );
  }, []);

  const filteredItems = React.useMemo(() => {
    if (!searchTerm) return [];
    return allItems.filter((item) =>
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, allItems]);
  
  React.useEffect(() => {
    if (!selectedItem) {
        setPackageWeight("");
        setTotalLength("");
        return;
    };

    const weight = parseFloat(packageWeight.replace(',', '.')) || 0;
    const length = parseFloat(totalLength.replace(',', '.')) || 0;
    
    if (lastEdited === 'weight' && weight > 0) {
        const newLength = weight / selectedItem.weight;
        setTotalLength(newLength.toFixed(2).replace('.', ','));
    } else if (lastEdited === 'length' && length > 0) {
        const newWeight = length * selectedItem.weight;
        setPackageWeight(newWeight.toFixed(3).replace('.', ','));
    }

  }, [packageWeight, totalLength, selectedItem, lastEdited]);
  

  const { barCount, realPricePerMeter, pricePerBar } = React.useMemo(() => {
    const price = parseFloat(totalPrice.replace(',', '.')) || 0;
    const percentage = parseFloat(invoicePercentage.replace(',', '.')) || 0;
    const length = parseFloat(totalLength.replace(',', '.')) || 0;

    if (!selectedItem || length <= 0 || price <= 0 || percentage <= 0) {
      return { barCount: 0, realPricePerMeter: 0, pricePerBar: 0 };
    }
    
    const realTotalPrice = price / (percentage / 100);
    
    const barCount = length / 6;
    const realPricePerMeter = realTotalPrice / length;
    const pricePerBar = realPricePerMeter * 6;

    return { barCount, realPricePerMeter, pricePerBar };
  }, [selectedItem, totalPrice, invoicePercentage, totalLength]);


  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatNumber = (value: number, digits: number = 2) => {
    return new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    }).format(value);
  };
  
  const handleInputChange = (
    setter: React.Dispatch<React.SetStateAction<string>>,
    value: string,
    field?: LastEdited
  ) => {
    const sanitizedValue = value.replace(/[^0-9,]/g, '').replace(',', '.');
    if (/^\d*\.?\d*$/.test(sanitizedValue)) {
      setter(sanitizedValue.replace('.', ','));
      if(field) setLastEdited(field);
    }
  };

  return (
    <Card className="border-0 shadow-none bg-transparent">
      <CardHeader>
        <CardTitle>Conferência de KG/MT</CardTitle>
        <CardDescription className="mt-2">
          Selecione item e insira os dados para calculo de metragem e custo.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Item Selection */}
        <div className="space-y-2">
          <Label htmlFor="search-item">1. Selecione o Item</Label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search-item"
              placeholder={selectedItem ? selectedItem.description : "........Buscar item........"}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (selectedItem) setSelectedItem(null); // Clear selection when typing
              }}
              className="pl-8"
            />
             {searchTerm && filteredItems.length > 0 && (
                <Card className="absolute z-10 mt-1 w-full border-primary/20">
                    <ScrollArea className="h-60">
                        <div className="p-2">
                        {filteredItems.map(item => (
                            <div 
                                key={item.id}
                                onClick={() => handleItemSelect(item)}
                                className="cursor-pointer rounded-md p-2 text-sm hover:bg-primary/10"
                            >
                                {item.description}
                                <p className="text-xs text-muted-foreground">{formatNumber(item.weight, 3)} kg/m</p>
                            </div>
                        ))}
                        </div>
                    </ScrollArea>
                </Card>
            )}
          </div>
          {selectedItem && (
            <div className="mt-2 text-sm text-primary font-medium p-2 bg-primary/10 rounded-md">
                Item selecionado: {selectedItem.description} ({formatNumber(selectedItem.weight, 3)} kg/m)
            </div>
          )}
        </div>
        
        {/* Inputs */}
        <div className={cn("space-y-4", !selectedItem && "opacity-50 pointer-events-none")}>
            <div className="space-y-2">
                <Label htmlFor="package-weight">2. Insira os Dados </Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                        id="package-weight"
                        placeholder="Peso Total (kg)"
                        value={packageWeight}
                        onChange={(e) => handleInputChange(setPackageWeight, e.target.value, 'weight')}
                    />
                    <Input
                        id="total-price"
                        placeholder="Valor Total Pago (R$)"
                        value={totalPrice}
                        onChange={(e) => handleInputChange(setTotalPrice, e.target.value)}
                    />
                     <Input
                        id="invoice-percentage"
                        placeholder="% da Nota"
                        value={invoicePercentage}
                        onChange={(e) => handleInputChange(setInvoicePercentage, e.target.value)}
                    />
                </div>
            </div>
        </div>


        {/* Results */}
        <div className={cn("pt-4 border-t", !selectedItem && "opacity-50 pointer-events-none")}>
            <h3 className="text-lg font-medium mb-4">Resultados</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Qtd. MT</Label>
                    <Input
                        id="total-length"
                        placeholder="Metragem Total (m)"
                        value={totalLength}
                        onChange={(e) => handleInputChange(setTotalLength, e.target.value, 'length')}
                        className="font-semibold"
                    />
                </div>
                <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Qtd.Barras 6m</Label>
                    <div className="w-full rounded-md border border-input bg-muted/30 px-3 py-2 text-base md:text-sm font-semibold h-10 flex items-center">
                        {formatNumber(barCount, 3)}
                    </div>
                </div>
                <div className="space-y-1">
                    <Label className="text-xs text-accent-price font-semibold">R$/Metro</Label>
                    <div className="w-full rounded-md border border-accent-price/50 bg-accent-price/10 px-3 py-2 text-base md:text-sm font-bold text-accent-price h-10 flex items-center">
                      {realPricePerMeter > 0 ? `R$ ${realPricePerMeter.toFixed(5).replace('.', ',')}` : 'R$ 0,00'}
                    </div>
                </div>
                <div className="space-y-1">
                    <Label className="text-xs text-accent-price font-semibold">R$/Barra 6m</Label>
                    <div className="w-full rounded-md border border-accent-price/50 bg-accent-price/10 px-3 py-2 text-base md:text-sm font-bold text-accent-price h-10 flex items-center">
                        {formatCurrency(pricePerBar)}
                    </div>
                </div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
