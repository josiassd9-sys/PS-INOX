
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
import { perfisIpeData, PerfilIpe } from "@/lib/data/index";
import { Dashboard } from "@/components/dashboard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

function IpeTableComponent() {
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredData = React.useMemo(() => {
    if (!searchTerm) {
      return perfisIpeData;
    }
    const lowercasedFilter = searchTerm.toLowerCase();
    return perfisIpeData.filter((perfil) =>
      perfil.nome.toLowerCase().includes(lowercasedFilter)
    );
  }, [searchTerm]);

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Tabela de Perfis IPE</CardTitle>
          <CardDescription>
            Consulte as propriedades dos perfis de aço padrão IPE.
          </CardDescription>
          <div className="relative pt-2">
            <Search className="absolute left-2.5 top-4 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar perfil IPE por nome..."
              className="w-full rounded-lg bg-background pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
        </CardContent>
      </Card>
    </div>
  );
}

export default function Page() {
  return (
    <Dashboard initialCategoryId="perfis/tabela-ipe">
      <IpeTableComponent />
    </Dashboard>
  );
}
