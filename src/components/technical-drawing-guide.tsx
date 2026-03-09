"use client"

import * as React from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHeader, TableRow, TableHead } from "@/components/ui/table"
import { Icon } from "./icons"

const topics = [
    {
        id: "vistas",
        title: "Vistas Ortográficas: A Base de Tudo",
        icon: "PenRuler",
        content: (
            <div>
                <p className="mb-2">
                    O método mais comum para representar um objeto tridimensional em um plano bidimensional é através das vistas ortográficas. Imagine colocar o objeto dentro de uma caixa de vidro (diedro). Cada face da caixa mostra uma vista do objeto.
                </p>
                <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Vista Frontal:</strong> É a vista principal, a que melhor representa o objeto.</li>
                    <li><strong>Vista Superior:</strong> O que se vê olhando o objeto de cima, posicionada abaixo da vista frontal.</li>
                    <li><strong>Vista Lateral Esquerda:</strong> O que se vê olhando pela esquerda, posicionada à direita da vista frontal.</li>
                </ul>
                <p className="mt-2">
                    Essas três vistas (Frontal, Superior e Lateral Esquerda) são geralmente suficientes para descrever a maioria das peças. A disposição delas no papel segue o padrão do <strong>1º Diedro</strong>, que é o padrão adotado no Brasil e na Europa.
                </p>
            </div>
        )
    },
    {
        id: "linhas",
        title: "O Alfabeto do Desenho: Tipos de Linhas",
        icon: "Type",
        content: (
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell className="font-medium">Linha Contínua Larga</TableCell>
                        <TableCell className="font-mono font-bold">━━━━</TableCell>
                        <TableCell>Arestas e contornos visíveis.</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-medium">Linha Tracejada</TableCell>
                        <TableCell className="font-mono font-bold">- - - -</TableCell>
                        <TableCell>Arestas e contornos não visíveis (escondidos).</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-medium">Linha Traço e Ponto Estreita</TableCell>
                        <TableCell className="font-mono font-bold">―·―·―</TableCell>
                        <TableCell>Linhas de centro de furos e peças, eixos de simetria.</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-medium">Linha Traço e Ponto (Larga nas extremidades)</TableCell>
                        <TableCell className="font-mono font-bold">━━·━·━━</TableCell>
                        <TableCell>Indicação de planos de corte.</TableCell>
                    </TableRow>
                     <TableRow>
                        <TableCell className="font-medium">Linha Contínua Estreita</TableCell>
                        <TableCell className="font-mono font-bold">----</TableCell>
                        <TableCell>Linhas de cota, linhas auxiliares, linhas de chamada, hachuras.</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        )
    },
    {
        id: "cotagem",
        title: "Dimensionamento (Cotagem): As Medidas da Peça",
        icon: "Scale",
        content: (
            <div>
                 <p className="mb-2">A cotagem é a parte do desenho que informa as dimensões e tolerâncias da peça. Elementos da cotagem:</p>
                <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Linha de Cota:</strong> Linha fina e contínua com setas nas extremidades, paralela à dimensão que está sendo medida.</li>
                    <li><strong>Linha Auxiliar (ou de Extensão):</strong> Linha fina que 'projeta' a aresta do objeto até a linha de cota.</li>
                    <li><strong>Valor da Cota:</strong> O número que indica a medida, geralmente posicionado acima e no meio da linha de cota.</li>
                </ul>
                 <p className="mt-2 font-semibold">Regras Importantes:</p>
                 <ul className="list-disc pl-5 space-y-1 mt-1">
                    <li>Não repetir cotas. Uma medida deve aparecer apenas uma vez no desenho.</li>
                    <li>As cotas devem ser posicionadas fora do contorno do objeto, sempre que possível.</li>
                    <li>As cotas devem ser claras e fáceis de ler, sem cruzamentos desnecessários de linhas.</li>
                </ul>
            </div>
        )
    },
     {
        id: "simbologia",
        title: "Simbologia Essencial",
        icon: "CheckCircle",
        content: (
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell className="font-mono font-bold text-lg">ø</TableCell>
                        <TableCell>Diâmetro. Usado para cotar formas circulares.</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-mono font-bold text-lg">R</TableCell>
                        <TableCell>Raio. Usado para cotar arcos e cantos arredondados.</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-mono font-bold text-lg">□</TableCell>
                        <TableCell>Quadrado. Colocado antes da cota de um perfil quadrado.</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-mono font-bold text-lg">±</TableCell>
                        <TableCell>Tolerância Dimensional. Ex: 50 ±0.1 significa que a medida pode variar de 49.9 a 50.1.</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-mono font-bold text-lg">√</TableCell>
                        <TableCell>Símbolo de Acabamento Superficial. Indica a rugosidade ou o tratamento da superfície (polido, usinado, etc.).</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        )
    },
    {
        id: "cortes",
        title: "Cortes e Seções: Vendo por Dentro",
        icon: "Layers",
        content: (
             <div>
                <p className="mb-2">
                    Quando uma peça tem muitos detalhes internos (furos, cavidades), as linhas tracejadas podem deixar o desenho confuso. Para resolver isso, usamos cortes.
                </p>
                <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Plano de Corte:</strong> É um plano imaginário que 'corta' a peça. É indicado por uma linha traço e ponto larga, com setas que indicam a direção em que se está olhando.</li>
                    <li><strong>Seção (ou Vista de Corte):</strong> É a vista que mostra o que o plano de corte tocou. As áreas que foram cortadas são preenchidas com <strong>hachuras</strong> (linhas finas e paralelas, geralmente a 45°).</li>
                </ul>
                 <p className="mt-2">
                    O corte permite ver os detalhes internos como se fossem contornos visíveis, tornando a interpretação muito mais fácil.
                </p>
            </div>
        )
    },
    {
        id: "escalas",
        title: "Escalas: A Proporção do Desenho",
        icon: "ZoomIn",
        content: (
            <div>
                <p className="mb-2">A escala indica a relação entre o tamanho do desenho e o tamanho real da peça. É expressa como uma razão (ex: 1:2).</p>
                <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Escala Natural (1:1):</strong> O desenho tem o mesmo tamanho do objeto real.</li>
                    <li><strong>Escala de Redução (ex: 1:2, 1:10, 1:100):</strong> O desenho é menor que o objeto. 1:2 significa que cada 1 unidade no desenho representa 2 unidades na peça real.</li>
                    <li><strong>Escala de Ampliação (ex: 2:1, 5:1, 10:1):</strong> O desenho é maior que o objeto. 2:1 significa que cada 2 unidades no desenho representam 1 unidade na peça real. Usado para peças muito pequenas.</li>
                </ul>
                <p className="mt-2 font-semibold">
                    Importante: A cotagem no desenho sempre indica a dimensão REAL da peça, independentemente da escala utilizada.
                </p>
            </div>
        )
    },
];

export function TechnicalDrawingGuide() {
  return (
    <div className="container mx-auto p-4">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Guia de Desenho Técnico Mecânico</CardTitle>
          <CardDescription>
            Aprenda os fundamentos da linguagem universal da engenharia e da indústria para ler e interpretar desenhos de peças e componentes.
          </CardDescription>
        </CardHeader>
      </Card>

      <Accordion type="single" collapsible className="w-full" defaultValue="vistas">
          {topics.map(topic => (
              <AccordionItem value={topic.id} key={topic.id}>
                  <AccordionTrigger className="text-lg font-semibold hover:bg-primary/10 px-1 text-left">
                     <div className="flex items-center gap-2">
                        <Icon name={topic.icon as any} className="h-5 w-5 text-primary" />
                        {topic.title}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-1 py-2 border-t bg-primary/5 text-base">
                      {topic.content}
                  </AccordionContent>
              </AccordionItem>
          ))}
      </Accordion>
    </div>
  )
}
