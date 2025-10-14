
"use client";

import * as React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Book, CheckCircle, Scale, PenRuler, Type, Layers, ZoomIn } from "lucide-react";
import { Dashboard } from "@/components/dashboard";

const informacoes = [
    {
        id: "vistas",
        title: "Vistas Ortográficas: A Base de Tudo",
        icon: PenRuler,
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
        icon: Type,
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
        icon: Scale,
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
        icon: CheckCircle,
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
        icon: Layers,
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
        icon: ZoomIn,
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
    {
        id: "normas",
        title: "Principais Normas Técnicas de Estruturas",
        icon: Book,
        content: (
            <div>
                <p className="mb-2">
                    Projetos estruturais em aço são guiados por normas rigorosas que garantem segurança e desempenho. As mais importantes no nosso contexto são:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                    <li><strong>ABNT NBR 8800 (Brasil):</strong> Norma brasileira para o projeto de estruturas de aço e de estruturas mistas de aço e concreto de edifícios. Ela define os critérios de dimensionamento, resistência, estabilidade e segurança.</li>
                    <li><strong>AISC (American Institute of Steel Construction):</strong> As especificações do AISC são a referência principal nos Estados Unidos e influenciam normas no mundo todo. Elas cobrem desde o projeto até a fabricação e montagem de estruturas de aço.</li>
                </ul>
            </div>
        )
    },
    {
        id: "tipos-aco",
        title: "Tipos de Aço Estrutural",
        icon: CheckCircle,
        content: (
             <div>
                <p className="mb-2">A resistência do perfil depende diretamente do tipo de aço utilizado. A propriedade mais importante é a tensão de escoamento (fy).</p>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Tipo de Aço</TableHead>
                            <TableHead>Tensão de Escoamento (fy)</TableHead>
                            <TableHead>Aplicação Comum</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell className="font-medium">ASTM A36</TableCell>
                            <TableCell>250 MPa (36 ksi)</TableCell>
                            <TableCell>Uso geral, perfis laminados, chapas.</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">ASTM A572 Grau 50</TableCell>
                            <TableCell>345 MPa (50 ksi)</TableCell>
                            <TableCell>Estruturas que exigem maior resistência, como pontes e grandes edifícios.</TableCell>
                        </TableRow>
                         <TableRow>
                            <TableCell className="font-medium">ASTM A992</TableCell>
                            <TableCell>345 a 450 MPa</TableCell>
                            <TableCell>Padrão atual para perfis W nos EUA, otimizado para bom desempenho sísmico.</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        )
    },
    {
        id: "conceitos",
        title: "Conceitos Chave de Dimensionamento Estrutural",
        icon: Scale,
        content: (
            <div className="space-y-2">
                 <p>Para entender qual perfil escolher, é essencial conhecer dois conceitos:</p>
                <div>
                    <h4 className="font-semibold">Momento de Inércia (Ix)</h4>
                    <p className="text-muted-foreground">
                        É a principal medida da <strong>resistência de uma viga à flexão (deformação)</strong>. Quanto maior o Ix, menos a viga irá "embarrigar" (defletir) sob uma carga. Perfis com mais material longe do centro (como as vigas "I" altas) possuem um momento de inércia maior e, portanto, são mais eficientes para vencer grandes vãos.
                    </p>
                </div>
                 <div>
                    <h4 className="font-semibold">Módulo de Resistência (Wx)</h4>
                    <p className="text-muted-foreground">
                        Está diretamente relacionado à <strong>resistência da viga à ruptura</strong> por excesso de carga. A tensão máxima em uma viga é calculada dividindo-se o momento fletor pelo Wx. Portanto, para um mesmo esforço, um perfil com maior Wx sofrerá uma tensão menor, tornando-o mais seguro. A calculadora de resistência usa o Wx para encontrar o perfil mais leve que suporta a carga.
                    </p>
                </div>
            </div>
        )
    }
]

function InfoComponent() {
  return (
    <div className="container mx-auto p-4">
        <Card className="mb-4">
            <CardHeader>
                <CardTitle>Informações Técnicas Essenciais</CardTitle>
                <CardDescription>
                    Contexto e conceitos fundamentais para o uso e dimensionamento de perfis de aço estrutural.
                </CardDescription>
            </CardHeader>
        </Card>
        
        <Accordion type="single" collapsible className="w-full" defaultValue="vistas">
            {informacoes.map(info => (
                <AccordionItem value={info.id} key={info.id}>
                    <AccordionTrigger className="text-lg font-semibold hover:bg-primary/10 px-1">
                        <div className="flex items-center gap-2">
                            <info.icon className="h-5 w-5 text-primary" />
                            {info.title}
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-1 py-2 border-t bg-primary/5 text-base">
                      {info.content}
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    </div>
  );
}

export default function Page() {
  return (
      <Dashboard initialCategoryId="perfis/informacoes">
          <InfoComponent />
      </Dashboard>
  );
}
