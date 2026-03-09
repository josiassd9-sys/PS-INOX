
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
        title: "A Importância da Logística e Armazenamento",
        icon: "PackageCheck",
        content: (
            <p>
                A logística e o armazenamento adequados de produtos de aço são tão cruciais quanto o próprio processo de fabricação. Um manuseio incorreto ou um armazenamento inadequado podem causar danos irreparáveis, como riscos, amassados, empenamentos e, no caso do aço carbono, corrosão. Além disso, uma logística eficiente garante a segurança dos operadores, a otimização do espaço e a preservação do valor do material.
            </p>
        ),
    },
    {
        id: "recebimento",
        title: "Recebimento e Inspeção",
        icon: "ClipboardList",
        content: (
            <p>
                O processo começa no recebimento do material. É essencial inspecionar visualmente cada lote em busca de danos de transporte, como cintas rompidas, embalagens rasgadas ou sinais de umidade. Verificar se as dimensões, espessuras e o tipo de aço correspondem ao pedido é um passo fundamental para evitar problemas futuros na produção.
            </p>
        ),
    },
    {
        id: "armazenamento",
        title: "Técnicas de Armazenamento por Tipo de Material",
        icon: "Layers",
        content: (
            <ul className="list-disc pl-5 space-y-3">
                <li>
                    <strong>Chapas:</strong> Devem ser armazenadas na horizontal, em paletes ou cavaletes planos e secos. É crucial evitar o contato direto com o chão para prevenir a absorção de umidade. Intercalar as chapas com separadores de madeira ou plástico ajuda a prevenir riscos e facilita o manuseio.
                </li>
                <li>
                    <strong>Tubos e Barras (Perfis Longos):</strong> O método ideal é o uso de estantes tipo <strong>Cantilever</strong>. Essas estantes possuem braços em balanço que suportam o material em vários pontos, evitando que ele envergue ou empene. Se não houver Cantilever, devem ser armazenados em feixes amarrados e apoiados em múltiplos pontos.
                </li>
                <li>
                    <strong>Conexões e Peças Pequenas:</strong> Devem ser organizadas em prateleiras, caixas ou gaveteiros, devidamente identificadas para facilitar a localização e o controle de estoque. Manter as peças em suas embalagens originais ajuda a protegê-las.
                </li>
            </ul>
        ),
    },
    {
        id: "manuseio",
        title: "Manuseio e Movimentação Segura",
        icon: "Forklift",
        content: (
             <ul className="list-disc pl-5 space-y-2">
                <li>
                    <strong>Equipamentos:</strong> Pontes rolantes com balancins e cintas de nylon (para evitar riscos) são ideais para chapas e feixes pesados. Empilhadeiras com garfos longos e bem posicionados são usadas para movimentar paletes.
                </li>
                <li>
                    <strong>Evitar Arrastar:</strong> Nunca se deve arrastar chapas ou perfis uns sobre os outros ou no chão. Isso causa riscos profundos que são difíceis e caros de remover.
                </li>
                <li>
                    <strong>Içamento:</strong> Ao içar feixes de tubos ou barras, usar cintas em pelo menos dois pontos de apoio para distribuir o peso e evitar que o material envergue.
                </li>
            </ul>
        ),
    },
    {
        id: "protecao",
        title: "Proteção Contra Corrosão e Contaminação",
        icon: "Shield",
        content: (
             <ul className="list-disc pl-5 space-y-2">
                <li>
                    <strong>Ambiente Seco:</strong> O principal inimigo, mesmo do aço inox, é a umidade prolongada, especialmente em ambientes com cloretos (maresia). O local de armazenamento deve ser coberto, seco e bem ventilado.
                </li>
                <li>
                    <strong>Segregação de Materiais:</strong> É fundamental separar o armazenamento de aço inoxidável do aço carbono. O contato direto pode causar "contaminação ferrosa", onde partículas de ferro do aço carbono se depositam no inox e enferrujam, manchando a superfície. Ferramentas de manuseio também devem ser exclusivas ou muito bem limpas.
                </li>
                <li>
                    <strong>PEPS (Primeiro que Entra, Primeiro que Sai):</strong> Também conhecido como FIFO (First-In, First-Out), é um princípio de controle de estoque onde o material mais antigo é usado primeiro. Isso evita que lotes fiquem parados por muito tempo no estoque, sujeitos à degradação.
                </li>
            </ul>
        ),
    }
];

export function SteelLogisticsGuide() {
  return (
    <>
      <Card className="mb-1 border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-xl">Guia de Logística e Armazenamento de Aço</CardTitle>
          <CardDescription>
            Aprenda as melhores práticas para manusear e armazenar produtos de aço para garantir a qualidade, segurança e eficiência.
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
