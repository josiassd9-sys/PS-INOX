
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
import { perfisData, Perfil } from "@/lib/data/perfis";

export default function Page() {
  return (
    <div className="container mx-auto p-4">
        <Card>
            <CardHeader>
                <CardTitle>Tabela de Perfis W</CardTitle>
                <CardDescription>
                    Consulte as propriedades geométricas e físicas dos perfis de aço padrão W (Gerdau/Açominas).
                </CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
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
                        {perfisData.map((perfil) => (
                            <TableRow key={perfil.nome}>
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
