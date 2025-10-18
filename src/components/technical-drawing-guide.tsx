"use client"

import * as React from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"

const topics = [
  {
    id: "vistas",
    title: "Vistas Ortográficas: A Base de Tudo",
    summary: "Como um objeto 3D é representado em um papel 2D.",
    details: "O método mais comum para representar um objeto tridimensional em um plano bidimensional é através das vistas ortográficas. Imagine colocar o objeto dentro de uma caixa de vidro (diedro). Cada face da caixa mostra uma vista do objeto.\n\n- Vista Frontal: É a vista principal, a que melhor representa o objeto.\n- Vista Superior: O que se vê olhando o objeto de cima, posicionada abaixo da vista frontal.\n- Vista Lateral Esquerda: O que se vê olhando pela esquerda, posicionada à direita da vista frontal.\n\nEssas três vistas (Frontal, Superior e Lateral Esquerda) são geralmente suficientes para descrever a maioria das peças. A disposição delas no papel segue o padrão do 1º Diedro, que é o padrão adotado no Brasil e na Europa."
  },
  {
    id: "linhas",
    title: "O Alfabeto do Desenho: Tipos de Linhas",
    summary: "Cada tipo de linha tem um significado específico.",
    content: (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Tipo de Linha</TableHead>
                    <TableHead>Aparência</TableHead>
                    <TableHead>Aplicação Principal</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableCell className="font-medium">Linha Contínua Larga</TableCell>
                    <TableCell className="font-mono text-xl font-bold">━━━━</TableCell>
                    <TableCell>Arestas e contornos visíveis.</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className="font-medium">Linha Contínua Estreita</TableCell>
                    <TableCell className="font-mono text-xl font-bold">────</TableCell>
                    <TableCell>Linhas de cota, linhas auxiliares, linhas de chamada, hachuras.</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className="font-medium">Linha Tracejada</TableCell>
                    <TableCell className="font-mono text-xl font-bold">- - - -</TableCell>
                    <TableCell>Arestas e contornos não visíveis (escondidos).</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className="font-medium">Linha Traço e Ponto Estreita</TableCell>
                    <TableCell className="font-mono text-xl font-bold">―·―·―</TableCell>
                    <TableCell>Linhas de centro de furos e peças, eixos de simetria.</TableCell>
                </TableRow>
                 <TableRow>
                    <TableCell className="font-medium">Linha Traço e Ponto (Larga nas extremidades)</TableCell>
                    <TableCell className="font-mono text-xl font-bold">━━·━·━━</TableCell>
                    <TableCell>Indicação de planos de corte.</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    )
  },
  {
    id: "cotagem",
    title: "Dimensionamento (Cotagem): As Medidas da Peça",
    summary: "Como ler e interpretar as dimensões de um objeto.",
    details: "A cotagem é a parte do desenho que informa as dimensões e tolerâncias da peça. Elementos da cotagem:\n\n- Linha de Cota: Linha fina e contínua com setas nas extremidades, paralela à dimensão que está sendo medida.\n- Linha Auxiliar (ou de Extensão): Linha fina que 'projeta' a aresta do objeto até a linha de cota.\n- Valor da Cota: O número que indica a medida, geralmente posicionado acima e no meio da linha de cota.\n\nRegras Importantes:\n1. Não repetir cotas. Uma medida deve aparecer apenas uma vez no desenho.\n2. As cotas devem ser posicionadas fora do contorno do objeto, sempre que possível.\n3. As cotas devem ser claras e fáceis de ler, sem cruzamentos desnecessários de linhas."
  },
  {
    id: "simbologia",
    title: "Simbologia Essencial",
    summary: "Símbolos que você encontrará com frequência.",
    content: (
         <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Símbolo</TableHead>
                    <TableHead>Significado</TableHead>
                </TableRow>
            </TableHeader>
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
    summary: "Revelando detalhes internos de uma peça.",
    details: "Quando uma peça tem muitos detalhes internos (furos, cavidades), as linhas tracejadas podem deixar o desenho confuso. Para resolver isso, usamos cortes.\n\n- Plano de Corte: É um plano imaginário que 'corta' a peça. É indicado por uma linha traço e ponto larga, com setas que indicam a direção em que se está olhando.\n- Seção (ou Vista de Corte): É a vista que mostra o que o plano de corte tocou. As áreas que foram cortadas são preenchidas com hachuras (linhas finas e paralelas, geralmente a 45°).\n\nO corte permite ver os detalhes internos como se fossem contornos visíveis, tornando a interpretação muito mais fácil."
  },
  {
    id: "escalas",
    title: "Escalas: A Proporção do Desenho",
    summary: "A relação entre o tamanho do desenho e o tamanho real da peça.",
    details: "A escala indica se o desenho está ampliado, reduzido ou em tamanho natural. É expressa como uma razão (ex: 1:2).\n\n- Escala Natural (1:1): O desenho tem o mesmo tamanho do objeto real.\n- Escala de Redução (ex: 1:2, 1:10, 1:100): O desenho é menor que o objeto. 1:2 significa que cada 1 unidade no desenho representa 2 unidades na peça real.\n- Escala de Ampliação (ex: 2:1, 5:1, 10:1): O desenho é maior que o objeto. 2:1 significa que cada 2 unidades no desenho representam 1 unidade na peça real. Usado para peças muito pequenas.\n\nImportante: A cotagem no desenho sempre indica a dimensão REAL da peça, independentemente da escala utilizada."
  },
];

export function TechnicalDrawingGuide() {
  return (
    <>
      <Card className="mb-1 border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-xl">Guia de Desenho Técnico Mecânico</CardTitle>
          <CardDescription>
            Aprenda os fundamentos da linguagem universal da engenharia e da indústria para ler e interpretar desenhos de peças e componentes.
          </CardDescription>
        </CardHeader>
      </Card>

      <Accordion type="single" collapsible className="w-full" defaultValue="vistas">
          {topics.map(topic => (
              <AccordionItem value={topic.id} key={topic.id}>
                  <AccordionTrigger className="text-base font-semibold hover:bg-primary/10 px-1 text-left">{topic.title}</AccordionTrigger>
                  <AccordionContent className="px-1 py-1 border-t bg-primary/5 text-base">
                      {topic.details && <p className="whitespace-pre-wrap">{topic.details}</p>}
                      {topic.content && <div className="">{topic.content}</div>}
                  </AccordionContent>
              </AccordionItem>
          ))}
      </Accordion>
    </>
  )
}
