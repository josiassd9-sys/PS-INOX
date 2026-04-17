
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

  type Perfil = (typeof perfisData)[0];

  const columns: ColumnDef<Perfil>[] = [
    {
      accessorKey: "nome",
      header: "Perfil",
      cell: ({ row }) => <div className="font-medium">{row.getValue("nome")}</div>,
      size: 160,
      enablePinning: true,
    },
    {
      accessorKey: "peso",
      header: "Peso (kg/m)",
      cell: ({ row }) => row.getValue("peso"),
      size: 110,
      enablePinning: true,
    },
    { accessorKey: "h", header: "h (mm)", size: 90 },
    { accessorKey: "b", header: "b (mm)", size: 90 },
    { accessorKey: "tw", header: "tw (mm)", size: 90 },
    { accessorKey: "tf", header: "tf (mm)", size: 90 },
    { accessorKey: "Ix", header: "Ix (cm⁴)", size: 110 },
    { accessorKey: "Wx", header: "Wx (cm³)", size: 110 },
    { accessorKey: "rx", header: "rx (cm)", size: 90 },
    { accessorKey: "Iy", header: "Iy (cm⁴)", size: 110 },
    { accessorKey: "Wy", header: "Wy (cm³)", size: 110 },
    { accessorKey: "ry", header: "ry (cm)", size: 90 },
  ];

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

    const tableData = React.useMemo(() => {
      const minPeso = parseFloat(filters.minPeso) || 0;
      const minH = parseFloat(filters.minH) || 0;
      const minWx = parseFloat(filters.minWx) || 0;

      return perfisData.filter((perfil) => {
        const nameMatch = perfil.nome.toLowerCase().includes(searchTerm.toLowerCase());
        const pesoMatch = !minPeso || perfil.peso >= minPeso;
        const hMatch = !minH || perfil.h >= minH;
        const wxMatch = !minWx || perfil.Wx >= minWx;
        return nameMatch && pesoMatch && hMatch && wxMatch;
      });
    }, [searchTerm, filters]);

    const table = useReactTable({
      data: tableData,
      columns,
      getCoreRowModel: getCoreRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      enablePinning: true,
      initialState: {
        columnPinning: { left: ["nome", "peso"] },
      },
    });

    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Tabela de Perfis W</CardTitle>
            <CardDescription>
              Consulte as propriedades geométricas e físicas dos perfis de aço padrão W (Gerdau/Açominas).
            </CardDescription>

            <div className="relative mt-4">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar perfil por nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div>
                <Label htmlFor="minPeso">Peso ≥ (kg/m)</Label>
                <Input id="minPeso" type="number" placeholder="Ex: 20" value={filters.minPeso} onChange={handleFilterChange} />
              </div>
              <div>
                <Label htmlFor="minH">Altura ≥ (mm)</Label>
                <Input id="minH" type="number" placeholder="Ex: 250" value={filters.minH} onChange={handleFilterChange} />
              </div>
              <div>
                <Label htmlFor="minWx">Wx ≥ (cm³)</Label>
                <Input id="minWx" type="number" placeholder="Ex: 300" value={filters.minWx} onChange={handleFilterChange} />
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="border border-border rounded-md overflow-auto max-h-[580px] bg-card">
              <table className="w-full table-fixed min-w-[1200px] text-sm border-collapse">
                <thead className="sticky top-0 z-50 bg-muted">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        const isPinned = header.column.getIsPinned();
                        return (
                          <th
                            key={header.id}
                            colSpan={header.colSpan}
                            className={`px-4 py-3 font-semibold border-r border-border text-left ${
                              isPinned === "left"
                                ? "sticky left-0 z-50 bg-muted shadow-[4px_0_8px_-4px_rgba(0,0,0,0.15)]"
                                : ""
                            }`}
                            style={{
                              width: header.getSize(),
                              minWidth: header.getSize(),
                            }}
                          >
                            {header.isPlaceholder
                              ? null
                              : flexRender(header.column.columnDef.header, header.getContext())}
                          </th>
                        );
                      })}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.length > 0 ? (
                    table.getRowModel().rows.map((row) => (
                      <tr key={row.id} className="hover:bg-muted/50 border-b">
                        {row.getVisibleCells().map((cell) => {
                          const isPinned = cell.column.getIsPinned();
                          return (
                            <td
                              key={cell.id}
                              className={`px-4 py-3 border-r border-border ${
                                isPinned === "left"
                                  ? "sticky left-0 z-40 bg-card shadow-[4px_0_8px_-4px_rgba(0,0,0,0.12)]"
                                  : ""
                              }`}
                              style={{
                                width: cell.column.getSize(),
                                minWidth: cell.column.getSize(),
                              }}
                            >
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                          );
                        })}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={12} className="h-32 text-center text-muted-foreground">
                        Nenhum perfil encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <p className="text-xs text-center text-muted-foreground mt-3 md:hidden">
              Arraste horizontalmente para ver todas as colunas →
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
}

export default function Page() {
  return (
      <Dashboard initialCategoryId="perfis/tabela-w">
          <TableComponent />
      </Dashboard>
  )
}

