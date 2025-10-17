
"use client"

import * as React from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Icon } from "./icons"

const topics = [
    {
        id: "intro",
        title: "O que são Elementos de Fixação?",
        icon: "Link",
        content: (
            <p>
                Elementos de fixação são componentes usados para unir ou prender duas ou mais peças de forma não permanente (permitindo desmontagem) ou permanente. Eles são a base de praticamente toda a montagem mecânica, desde a construção de grandes estruturas metálicas até a fabricação de pequenos dispositivos eletrônicos. A escolha correta do fixador é crucial para garantir a segurança, a durabilidade e a funcionalidade do conjunto.
            </p>
        ),
    },
    {
        id: "parafusos",
        title: "Parafusos: Os Mais Comuns",
        icon: "Cog",
        content: (
            <div>
                <p className="mb-2">O parafuso é o elemento de fixação mais versátil. Ele consiste em uma haste com uma rosca externa e uma cabeça que permite aplicar o torque para apertá-lo.</p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Tipos de Cabeça:</strong>
                        <ul className="list-disc pl-5 mt-1">
                            <li><strong>Sextavada:</strong> A mais comum para aplicações estruturais, permite alto torque com uma chave de boca ou soquete.</li>
                            <li><strong>Allen (ou Cilíndrica com Sextavado Interno):</strong> Usada quando o parafuso precisa ficar embutido ou em locais com pouco espaço lateral.</li>
                            <li><strong>Fenda e Phillips:</strong> Comuns em aplicações mais leves, como em eletrônicos e montagem de móveis.</li>
                            <li><strong>Allen sem Cabeça (parafuso prisioneiro):</strong> Usado para travar uma peça contra outra, como uma polia em um eixo.</li>
                        </ul>
                    </li>
                    <li><strong>Tipos de Rosca:</strong>
                        <ul className="list-disc pl-5 mt-1">
                            <li><strong>Métrica (M):</strong> Padrão internacional (ISO), com passos de rosca em milímetros (ex: M8, M10).</li>
                            <li><strong>Polegada (UNC/UNF):</strong> Padrão americano, com roscas por polegada (ex: 1/4", 3/8").</li>
                        </ul>
                    </li>
                </ul>
            </div>
        ),
    },
    {
        id: "porcas-arruelas",
        title: "Porcas e Arruelas: O Conjunto Perfeito",
        icon: "Circle",
        content: (
             <ul className="list-disc pl-5 space-y-2">
                <li>
                    <strong>Porcas:</strong> Peças com um furo roscado interno que trabalham em conjunto com um parafuso para criar a união.
                    <ul className="list-disc pl-5 mt-1">
                        <li><strong>Porca Sextavada:</strong> A mais comum, para uso geral.</li>
                        <li><strong>Porca Autotravante (Nyloc):</strong> Possui um anel de nylon interno que deforma ao rosquear, criando atrito e impedindo que a porca se solte com vibrações.</li>
                        <li><strong>Porca Calota:</strong> Possui uma cúpula que cobre a ponta do parafuso, oferecendo acabamento e proteção.</li>
                    </ul>
                </li>
                <li>
                    <strong>Arruelas:</strong> Discos finos com um furo no centro, usados principalmente para duas funções:
                    <ul className="list-disc pl-5 mt-1">
                        <li><strong>Arruela Lisa:</strong> Distribui a força de aperto do parafuso e da porca sobre uma área maior, protegendo a superfície da peça.</li>
                        <li><strong>Arruela de Pressão:</strong> Uma arruela seccionada e com as pontas desalinhadas que age como uma mola, mantendo a pressão no conjunto e ajudando a prevenir o afrouxamento por vibração.</li>
                    </ul>
                </li>
            </ul>
        ),
    },
    {
        id: "materiais",
        title: "Materiais: Aço Carbono vs. Aço Inox",
        icon: "Shield",
        content: (
             <ul className="list-disc pl-5 space-y-2">
                <li>
                    <strong>Aço Carbono:</strong> É o material mais comum para parafusos devido ao seu baixo custo e alta resistência mecânica (definida por classes como 8.8, 10.9, 12.9). No entanto, ele enferruja facilmente. Para proteção, pode receber tratamentos como:
                    <ul className="list-disc pl-5 mt-1">
                        <li><strong>Zincado/Bicromatizado:</strong> Uma fina camada de zinco protege contra a corrosão em ambientes secos ou com pouca umidade.</li>
                    </ul>
                </li>
                <li>
                    <strong>Aço Inoxidável:</strong> A escolha ideal para ambientes corrosivos, úmidos ou que exigem higiene.
                     <ul className="list-disc pl-5 mt-1">
                        <li><strong>Inox 304 (A2):</strong> Excelente resistência à corrosão atmosférica geral. É o mais usado em aplicações externas, indústria alimentícia e equipamentos em geral.</li>
                        <li><strong>Inox 316 (A4):</strong> Contém molibdênio, o que lhe confere uma resistência superior à corrosão por cloretos (maresia, produtos químicos). Indispensável em ambientes marítimos, indústria química e farmacêutica.</li>
                    </ul>
                </li>
            </ul>
        ),
    },
    {
        id: "rebites",
        title: "Rebites: Uniões Permanentes",
        icon: "Lock",
        content: (
             <p>
                Diferente dos parafusos, os rebites são usados para criar uniões permanentes. O tipo mais comum é o <strong>rebite de repuxo</strong>, que consiste em um corpo e um mandril. Ele é inserido em um furo que atravessa as peças a serem unidas e, com uma ferramenta chamada rebitador, o mandril é puxado. Isso deforma a extremidade do corpo do rebite, criando uma segunda cabeça que prende as peças. O mandril então se quebra. É um método rápido e eficaz, muito usado na fabricação de chapas finas, calhas e carrocerias.
            </p>
        ),
    }
];

export function FastenersGuide() {
  return (
    <>
      <Card className="mb-1 border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-xl">Guia de Elementos de Fixação</CardTitle>
          <CardDescription>
            Conheça os componentes essenciais para montagens mecânicas, desde parafusos e porcas até os materiais mais adequados para cada aplicação.
          </CardDescription>
        </CardHeader>
      </Card>

      <Accordion type="single" collapsible className="w-full" defaultValue="intro">
          {topics.map(topic => (
              <AccordionItem value={topic.id} key={topic.id}>
                  <AccordionTrigger className="text-base font-semibold hover:bg-primary/10 px-1">
                    <div className="flex items-center gap-2">
                        <Icon name={topic.icon as any} className="h-5 w-5 text-primary" />
                        {topic.title}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-1 py-1 border-t bg-primary/5 text-base">
                      {topic.content}
                  </AccordionContent>
              </AccordionItem>
          ))}
      </Accordion>
    </>
  )
}
