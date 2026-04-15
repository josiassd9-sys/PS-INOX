
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
import { perfisData, Perfil } from "@/lib/data/index";
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
    <div className="container mx-auto p-4">
        <Card>
            <CardHeader>
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
                 <div className="grid grid-cols-3 gap-1 pt-2">
                    <div className="space-y-0.5">
                        <Label htmlFor="minPeso" className="text-[10px] sm:text-xs font-normal line-clamp-2">Peso ≥ (kg/m)</Label>
                        <Input id="minPeso" type="number" placeholder="Ex: 20" value={filters.minPeso} onChange={handleFilterChange} className="h-8 text-xs p-1.5" />
                    </div>
                     <div className="space-y-0.5">
                        <Label htmlFor="minH" className="text-[10px] sm:text-xs font-normal line-clamp-2">Altura ≥ (mm)</Label>
                        <Input id="minH" type="number" placeholder="Ex: 250" value={filters.minH} onChange={handleFilterChange} className="h-8 text-xs p-1.5" />
                    </div>
                     <div className="space-y-0.5">
                        <Label htmlFor="minWx" className="text-[10px] sm:text-xs font-normal line-clamp-2">Wx ≥ (cm³)</Label>
                        <Input id="minWx" type="number" placeholder="Ex: 300" value={filters.minWx} onChange={handleFilterChange} className="h-8 text-xs p-1.5" />
                    </div>
                 </div>
                   <p className="pt-1 text-xs text-muted-foreground">
                    No celular, as colunas Perfil e Peso ficam fixas; arraste a tabela para ver os demais dados.
                   </p>
            </CardHeader>
                <CardContent>
                  <div className="max-h-[56vh] overflow-auto rounded-md border touch-pan-x sm:max-h-[62vh] [--col1:96px] [--col2:76px] [overscroll-behavior-x:contain] [scrollbar-gutter:stable] sm:[--col1:110px] sm:[--col2:88px]">
                  <Table className="min-w-[980px] text-xs">
                    <TableHeader className="sticky top-0 z-40 bg-card">
                        <TableRow className="text-xs">
                        <TableHead className="sticky left-0 z-30 w-[var(--col1)] min-w-[var(--col1)] whitespace-nowrap bg-card font-bold shadow-[2px_0_0_0_hsl(var(--border))]">Perfil</TableHead>
                        <TableHead className="sticky z-30 w-[var(--col2)] min-w-[var(--col2)] whitespace-nowrap bg-card shadow-[2px_0_0_0_hsl(var(--border))] [left:var(--col1)]">Peso (kg/m)</TableHead>
                            <TableHead>h (mm)</TableHead>
                            <TableHead>b (mm)</TableHead>
                            <TableHead>tw (mm)</TableHead>
                            <TableHead>tf (mm)</TableHead>
                            <TableHead>Ix (cm⁴)</TableHead>
                            <TableHead>Wx (cm³)</TableHead>
                            <TableHead>rx (cm)</TableHead>
                            <TableHead>Iy (cm⁴)</TableHead>
                            <TableHead>Wy (cm³)</TableHead>
                            <TableHead>ry (cm)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredData.map((perfil) => (
                            <TableRow key={perfil.nome} className="text-xs">
                          <TableCell className="sticky left-0 z-20 w-[var(--col1)] min-w-[var(--col1)] whitespace-nowrap bg-card font-medium shadow-[2px_0_0_0_hsl(var(--border))]">{perfil.nome}</TableCell>
                          <TableCell className="sticky z-20 w-[var(--col2)] min-w-[var(--col2)] whitespace-nowrap bg-card shadow-[2px_0_0_0_hsl(var(--border))] [left:var(--col1)]">{perfil.peso.toFixed(1)}</TableCell>
                                <TableCell>{perfil.h}</TableCell>
                                <TableCell>{perfil.b}</TableCell>
                                <TableCell>{perfil.tw}</TableCell>
                                <TableCell>{perfil.tf}</TableCell>
                                <TableCell>{perfil.Ix}</TableCell>
                                <TableCell>{perfil.Wx}</TableCell>
                                <TableCell>{perfil.rx}</TableCell>
                                <TableCell>{perfil.Iy}</TableCell>
                                <TableCell>{perfil.Wy}</TableCell>
                                <TableCell>{perfil.ry}</TableCell>
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
