
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
        title: "O que são Sistemas de Vedação?",
        icon: "Shield",
        content: (
            <p>
                Sistemas de vedação são conjuntos de componentes projetados para prevenir vazamentos de fluidos (líquidos ou gases) ou a entrada de contaminantes em um sistema mecânico. Eles são essenciais para a eficiência, segurança e durabilidade de equipamentos que operam sob pressão, como tubulações, bombas, válvulas e cilindros hidráulicos. A escolha do sistema de vedação correto depende da aplicação, da temperatura, da pressão e da compatibilidade química com o fluido.
            </p>
        ),
    },
    {
        id: "juntas",
        title: "Juntas (Gaskets)",
        icon: "Layers",
        content: (
            <div>
                <p className="mb-2">
                    Juntas são vedações estáticas, utilizadas entre duas superfícies fixas (como flanges de tubulação ou tampas de motores) para preencher as imperfeições microscópicas e criar uma barreira à prova de vazamentos.
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Como Funcionam:</strong> Quando os parafusos das flanges são apertados, a junta é comprimida e se molda às superfícies, preenchendo qualquer espaço e criando uma vedação.</li>
                    <li><strong>Materiais Comuns:</strong> Papelão hidráulico, borracha (nitrílica, EPDM, Viton), PTFE (Teflon), grafite e metais (espiraladas). A escolha do material é crítica e depende da temperatura, pressão e do fluido a ser vedado.</li>
                    <li><strong>Aplicações:</strong> Vedações de flanges em tubulações industriais, cabeçotes de motores, tampas de equipamentos.</li>
                </ul>
            </div>
        ),
    },
    {
        id: "gaxetas",
        title: "Gaxetas (Packings)",
        icon: "BookOpen",
        content: (
             <div>
                <p className="mb-2">
                    Gaxetas são anéis de material flexível, geralmente de seção quadrada, usados para vedar eixos ou hastes que possuem movimento (rotativo ou alternativo). Elas são instaladas em uma câmara chamada de "caixa de gaxetas" e comprimidas por uma peça chamada "sobreposta".
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Como Funcionam:</strong> A compressão da sobreposta expande as gaxetas radialmente contra o eixo e a parede da caixa, criando a vedação. Um pequeno vazamento controlado é muitas vezes desejável para lubrificação e refrigeração.</li>
                    <li><strong>Materiais Comuns:</strong> Fibras de PTFE, grafite, aramida (Kevlar), fibras de carbono.</li>
                    <li><strong>Aplicações:</strong> Vedações de eixos de bombas centrífugas, hastes de válvulas e cilindros.</li>
                </ul>
            </div>
        ),
    },
    {
        id: "o-rings",
        title: "Anéis de Vedação (O-Rings)",
        icon: "Circle",
        content: (
             <div>
                <p className="mb-2">
                   O-rings são anéis toroidais (formato de donut) de elastômero (borracha), um dos tipos de vedação mais comuns e versáteis do mundo.
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Como Funcionam:</strong> O O-ring é instalado em um canal (ranhura) e é comprimido durante a montagem. A pressão do próprio fluido atua sobre o anel, empurrando-o contra as paredes do canal e melhorando a eficácia da vedação. Podem ser usados em aplicações estáticas ou dinâmicas.</li>
                    <li><strong>Materiais Comuns:</strong> Borracha Nitrílica (Buna-N), Viton (FKM), Silicone (VMQ), EPDM. A escolha depende da compatibilidade química e da temperatura de trabalho.</li>
                    <li><strong>Aplicações:</strong> Praticamente infinitas. Vedações de tampas, conexões hidráulicas e pneumáticas, pistões, etc.</li>
                </ul>
            </div>
        ),
    },
    {
        id: "selos",
        title: "Selos Mecânicos",
        icon: "Cog",
        content: (
            <p>
                Selos mecânicos são dispositivos de vedação de alta performance para eixos rotativos, especialmente em bombas. Eles substituem as gaxetas em aplicações mais críticas onde vazamentos são inaceitáveis. Um selo mecânico consiste em um par de anéis (um fixo e um rotativo) com faces lapidadas e extremamente planas, que são mantidas em contato por molas e pela pressão do fluido. Uma película de fluido muito fina entre as faces garante a lubrificação e a vedação, com um vazamento praticamente nulo. São componentes complexos e de precisão, usados em indústrias químicas, petroquímicas e farmacêuticas.
            </p>
        ),
    }
];

export function SealingSystemsGuide() {
  return (
    <>
      <Card className="mb-1 border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-xl">Guia de Sistemas de Vedação</CardTitle>
          <CardDescription>
            Conheça os componentes que garantem a estanqueidade em sistemas mecânicos, prevenindo vazamentos de fluidos.
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
