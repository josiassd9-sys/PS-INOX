
"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { perfisData } from "@/lib/data/index";
import { Dashboard } from "@/components/dashboard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Label } from "@/components/ui/label";

function TableComponent() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filters, setFilters] = React.useState({
    minPeso: "",
    minH: "",
    minWx: "",
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFilters(prev => ({ ...prev, [id]: value }));
  };

  const filteredData = React.useMemo(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const minPeso = parseFloat(filters.minPeso) || 0;
    const minH = parseFloat(filters.minH) || 0;
    const minWx = parseFloat(filters.minWx) || 0;

    return perfisData.filter((perfil) => {
      const nameMatch = perfil.nome.toLowerCase().includes(lowercasedFilter);
      const pesoMatch = !minPeso || perfil.peso >= minPeso;
      const hMatch = !minH || perfil.h >= minH;
      const wxMatch = !minWx || perfil.Wx >= minWx;

      return nameMatch && pesoMatch && hMatch && wxMatch;
    });
  }, [searchTerm, filters]);

  return (
    <div className="h-full min-h-0 w-full min-w-0 overflow-x-hidden px-2 py-3 sm:px-4">
      <Card className="flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden">
        <CardHeader className="w-full min-w-0 shrink-0 overflow-x-hidden px-3 py-3 sm:p-4">
                <CardTitle>Tabela de Perfis W</CardTitle>
                <CardDescription>
                    Consulte as propriedades geométricas e físicas dos perfis de aço padrão W (Gerdau/Açominas).
                </CardDescription>
                 <div className="relative pt-2">
                  <Search className="absolute left-2.5 top-4 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Buscar perfil por nome..."
                    className="w-full rounded-lg bg-background pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                 </div>
                 <div className="grid w-full max-w-full grid-cols-3 gap-1 pt-2 sm:gap-2">
                  <div className="min-w-0 space-y-0.5">
                    <Label htmlFor="minPeso" className="block w-full truncate text-[9px] leading-tight sm:text-xs font-normal">Peso ≥ (kg/m)</Label>
                  <Input id="minPeso" type="number" placeholder="Ex: 20" value={filters.minPeso} onChange={handleFilterChange} className="h-8 w-full min-w-0 px-1.5 text-[11px] sm:px-2 sm:text-xs" />
                    </div>
                   <div className="min-w-0 space-y-0.5">
                    <Label htmlFor="minH" className="block w-full truncate text-[9px] leading-tight sm:text-xs font-normal">Altura ≥ (mm)</Label>
                  <Input id="minH" type="number" placeholder="Ex: 250" value={filters.minH} onChange={handleFilterChange} className="h-8 w-full min-w-0 px-1.5 text-[11px] sm:px-2 sm:text-xs" />
                    </div>
                   <div className="min-w-0 space-y-0.5">
                    <Label htmlFor="minWx" className="block w-full truncate text-[9px] leading-tight sm:text-xs font-normal">Wx ≥ (cm³)</Label>
                  <Input id="minWx" type="number" placeholder="Ex: 300" value={filters.minWx} onChange={handleFilterChange} className="h-8 w-full min-w-0 px-1.5 text-[11px] sm:px-2 sm:text-xs" />
                    </div>
                 </div>
                     <p className="pt-1 text-xs text-muted-foreground">
                    No celular, as colunas Perfil e Peso ficam fixas; arraste para ver as demais colunas.
                     </p>
            </CardHeader>
                <CardContent className="flex min-h-0 flex-1 flex-col px-2 pb-3 pt-0 sm:p-4 sm:pt-0">
                  <div className="relative w-full min-w-0 flex-1 min-h-0 max-h-[56vh] overflow-auto rounded-md border bg-card shadow-sm touch-pan-x sm:max-h-[62vh] [overscroll-behavior-x:contain]">
                    <Table className="w-full min-w-[1100px] table-fixed text-xs">
                    <TableHeader className="sticky top-0 z-50 bg-card">
                        <TableRow className="text-xs">
                        <TableHead className="sticky top-0 left-0 z-50 whitespace-nowrap bg-card font-bold border-r border-border shadow-[2px_0_8px_-2px_rgba(0,0,0,0.1)]" style={{ width: 96, minWidth: 96 }}>Perfil</TableHead>
                        <TableHead className="sticky top-0 z-50 whitespace-nowrap bg-card border-r border-border shadow-[2px_0_8px_-2px_rgba(0,0,0,0.1)]" style={{ left: 96, width: 76, minWidth: 76 }}>Peso (kg/m)</TableHead>
                      <TableHead className="sticky top-0 z-30 whitespace-nowrap bg-card">h (mm)</TableHead>
                      <TableHead className="sticky top-0 z-30 whitespace-nowrap bg-card">b (mm)</TableHead>
                        <TableHead className="sticky top-0 z-30 bg-card whitespace-nowrap">tw (mm)</TableHead>
                        <TableHead className="sticky top-0 z-30 bg-card whitespace-nowrap">tf (mm)</TableHead>
                        <TableHead className="sticky top-0 z-30 bg-card whitespace-nowrap">Ix (cm⁴)</TableHead>
                        <TableHead className="sticky top-0 z-30 bg-card whitespace-nowrap">Wx (cm³)</TableHead>
                        <TableHead className="sticky top-0 z-30 bg-card whitespace-nowrap">rx (cm)</TableHead>
                        <TableHead className="sticky top-0 z-30 bg-card whitespace-nowrap">Iy (cm⁴)</TableHead>
                        <TableHead className="sticky top-0 z-30 bg-card whitespace-nowrap">Wy (cm³)</TableHead>
                        <TableHead className="sticky top-0 z-30 bg-card whitespace-nowrap">ry (cm)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredData.map((perfil) => (
                            <TableRow key={perfil.nome} className="text-xs hover:bg-muted/50">
                          <TableCell className="sticky left-0 z-40 whitespace-nowrap bg-card font-medium border-r border-border shadow-[2px_0_8px_-2px_rgba(0,0,0,0.08)]" style={{ width: 96, minWidth: 96 }}>{perfil.nome}</TableCell>
                          <TableCell className="sticky z-40 whitespace-nowrap bg-card border-r border-border" style={{ left: 96, width: 76, minWidth: 76 }}>{perfil.peso.toFixed(1)}</TableCell>
                              <TableCell className="whitespace-nowrap">{perfil.h}</TableCell>
                              <TableCell className="whitespace-nowrap">{perfil.b}</TableCell>
                                <TableCell className="whitespace-nowrap">{perfil.tw}</TableCell>
                                <TableCell className="whitespace-nowrap">{perfil.tf}</TableCell>
                                <TableCell className="whitespace-nowrap">{perfil.Ix}</TableCell>
                                <TableCell className="whitespace-nowrap">{perfil.Wx}</TableCell>
                                <TableCell className="whitespace-nowrap">{perfil.rx}</TableCell>
                                <TableCell className="whitespace-nowrap">{perfil.Iy}</TableCell>
                                <TableCell className="whitespace-nowrap">{perfil.Wy}</TableCell>
                                <TableCell className="whitespace-nowrap">{perfil.ry}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                      </div>
                 {filteredData.length === 0 && (
                    <div className="text-center p-4 text-muted-foreground">Nenhum perfil encontrado com os critérios especificados.</div>
                )}
            </CardContent>
        </Card>
    </div>
  );
}

export default function Page() {
  return (
      <Dashboard initialCategoryId="perfis/tabela-w">
          <TableComponent />
      </Dashboard>
  )
}

