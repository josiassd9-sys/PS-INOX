
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
import { Dashboard } from "@/components/dashboard";

const parametros = [
    { variavel: "Altura total", simbolo: "h", unidade: "mm", explicacao: "Altura total da viga, da face externa de uma aba à outra." },
    { variavel: "Largura da aba", simbolo: "b", unidade: "mm", explicacao: "Largura total das abas horizontais do perfil." },
    { variavel: "Espessura da alma", simbolo: "tw", unidade: "mm", explicacao: "Espessura da parte vertical central que conecta as abas." },
    { variavel: "Espessura da aba", simbolo: "tf", unidade: "mm", explicacao: "Espessura das abas horizontais." },
    { variavel: "Área da seção", simbolo: "A", unidade: "cm²", explicacao: "Área total da seção transversal do perfil." },
    { variavel: "Peso por metro", simbolo: "G ou W", unidade: "kg/m", explicacao: "Peso linear do perfil, fundamental para cálculo de carga e custo." },
    { variavel: "Momento de Inércia (eixo x)", simbolo: "Ix", unidade: "cm⁴", explicacao: "Mede a resistência do perfil à flexão em torno do seu eixo forte (x-x). Quanto maior o Ix, maior a resistência a cargas verticais." },
    { variavel: "Momento de Inércia (eixo y)", simbolo: "Iy", unidade: "cm⁴", explicacao: "Mede a resistência do perfil à flexão em torno do seu eixo fraco (y-y). Importante para cargas laterais e análise de flambagem." },
    { variavel: "Módulo de Resistência (eixo x)", simbolo: "Wx", unidade: "cm³", explicacao: "Propriedade utilizada para o dimensionamento à flexão. Relaciona o momento de inércia com a altura do perfil." },
    { variavel: "Módulo de Resistência (eixo y)", simbolo: "Wy", unidade: "cm³", explicacao: "Propriedade utilizada para o dimensionamento à flexão em torno do eixo fraco." },
    { variavel: "Raio de Giração (eixo x)", simbolo: "rx", unidade: "cm", explicacao: "Utilizado principalmente para cálculos de estabilidade e flambagem da peça." },
    { variavel: "Raio de Giração (eixo y)", simbolo: "ry", unidade: "cm", explicacao: "Utilizado para cálculos de flambagem lateral." },
    { variavel: "Altura útil da alma", simbolo: "d", unidade: "mm", explicacao: "Distância interna entre as abas do perfil." },
    { variavel: "Número da bitola", simbolo: "-", unidade: "-", explicacao: "Nomenclatura comercial do perfil (ex: W200x21), indicando a série e o peso." },
];

function ParamsComponent() {
  return (
    <div className="container mx-auto p-4">
        <Card>
            <CardHeader>
                <CardTitle>Parâmetros e Variáveis das Vigas I</CardTitle>
                <CardDescription>
                    Entenda o significado de cada propriedade geométrica e física que define um perfil de aço estrutural.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Variável</TableHead>
                            <TableHead>Símbolo</TableHead>
                            <TableHead>Unidade</TableHead>
                            <TableHead>Explicação</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {parametros.map((param) => (
                            <TableRow key={param.simbolo}>
                                <TableCell className="font-medium">{param.variavel}</TableCell>
                                <TableCell>{param.simbolo}</TableCell>
                                <TableCell>{param.unidade}</TableCell>
                                <TableCell>{param.explicacao}</TableCell>
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
      <Dashboard initialCategoryId="perfis/parametros-vigas-i">
          <ParamsComponent />
      </Dashboard>
  )
}
