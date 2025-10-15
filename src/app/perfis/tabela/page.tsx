
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
import { perfisData } from "@/lib/data/perfis";
import type { Perfil } from "@/lib/data/perfis";
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
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pt-2">
                    <div className="space-y-1">
                        <Label htmlFor="minPeso" className="text-xs font-normal">Peso ≥ (kg/m)</Label>
                        <Input id="minPeso" type="number" placeholder="Ex: 20" value={filters.minPeso} onChange={handleFilterChange} />
                    </div>
                     <div className="space-y-1">
                        <Label htmlFor="minH" className="text-xs font-normal">Altura ≥ (mm)</Label>
                        <Input id="minH" type="number" placeholder="Ex: 250" value={filters.minH} onChange={handleFilterChange} />
                    </div>
                     <div className="space-y-1">
                        <Label htmlFor="minWx" className="text-xs font-normal">Wx ≥ (cm³)</Label>
                        <Input id="minWx" type="number" placeholder="Ex: 300" value={filters.minWx} onChange={handleFilterChange} />
                    </div>
                 </div>
            </CardHeader>
            <CardContent className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="text-xs">
                            <TableHead className="font-bold">Perfil</TableHead>
                            <TableHead>Peso (kg/m)</TableHead>
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
                                <TableCell className="font-medium">{perfil.nome}</TableCell>
                                <TableCell>{perfil.peso.toFixed(1)}</TableCell>
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
