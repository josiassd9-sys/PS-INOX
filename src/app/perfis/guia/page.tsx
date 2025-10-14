
"use client";

import * as React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dashboard } from "@/components/dashboard";
import { Icon } from "@/components/icons";

const guideTopics = [
    {
        id: "fluxo",
        title: "1. O Fluxo de Trabalho Ideal",
        icon: "Workflow",
        content: (
            <div>
                <p className="mb-2">
                    A calculadora foi projetada para seguir o caminho natural das cargas em uma estrutura. Para um melhor aproveitamento, siga esta ordem:
                </p>
                <ol className="list-decimal pl-5 space-y-2">
                    <li>
                        <strong>Laje (Steel Deck):</strong> Comece aqui para definir o piso. O resultado principal é a <strong>Carga Total (kgf/m²)</strong>, que será usada no próximo passo. Adicione a chapa de aço ao orçamento se desejar.
                    </li>
                    <li>
                        <strong>Viga Secundária (IPE):</strong> Use a carga da laje calculada (ou informe uma carga linear manualmente). A calculadora dimensionará a viga IPE mais leve. Adicione-a ao orçamento. O resultado crucial aqui é a <strong>Reação de Apoio (kgf)</strong>.
                    </li>
                    <li>
                        <strong>Viga Principal (W):</strong> Aqui você pode dimensionar as vigas que receberão as cargas das vigas secundárias.
                    </li>
                     <li>
                        <strong>Pilar (Coluna):</strong> Use as reações de apoio calculadas nas vigas para dimensionar os pilares que sustentarão a estrutura. Adicione o pilar ao orçamento.
                    </li>
                </ol>
            </div>
        )
    },
    {
        id: "laje",
        title: "2. Aba Laje (Steel Deck)",
        icon: "Layers",
        content: (
            <div>
                <p className="mb-2">
                   O ponto de partida para sistemas de piso.
                </p>
                <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Como Usar:</strong> Escolha o modelo de Steel Deck, a espessura da camada de concreto e a sobrecarga (carga de uso, como pessoas e móveis).</li>
                    <li><strong>Resultado Principal:</strong> A <strong>Carga Total em kgf/m²</strong>. Este valor é a soma do peso próprio do deck, do concreto e da sobrecarga.</li>
                    <li><strong>Ação:</strong> Após o cálculo, você pode adicionar a quantidade de chapas de Steel Deck (em m²) ao seu orçamento.</li>
                </ul>
            </div>
        )
    },
    {
        id: "viga-secundaria",
        title: "3. Aba Viga Secundária (IPE)",
        icon: "Minus",
        content: (
            <div>
                <p className="mb-2">Dimensiona as vigas que suportam diretamente a laje.</p>
                <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Como Usar:</strong>
                        <ul className="list-disc pl-5 mt-1 space-y-1">
                             <li>O campo <strong>Carga da Laje (kgf/m²)</strong> pode ser preenchido automaticamente clicando no ícone de atualização (<Icon name="RefreshCw" className="inline h-4 w-4" />) se você já calculou na aba Laje.</li>
                             <li>Informe o <strong>Vão da Viga</strong> e o <strong>Espaçamento</strong> entre elas. A calculadora determinará a carga linear (em kgf/m).</li>
                             <li>Alternativamente, você pode digitar a <strong>Carga na Viga (kgf/m)</strong> diretamente.</li>
                        </ul>
                    </li>
                    <li><strong>Resultado Principal:</strong> O <strong>Perfil IPE Recomendado</strong> (o mais leve que atende à resistência e deformação) e a <strong>Reação de Apoio (kgf)</strong> em cada extremidade da viga.</li>
                     <li><strong>Ação:</strong> Adicione a viga ao orçamento. Use a Reação de Apoio para dimensionar a viga principal ou os pilares.</li>
                </ul>
            </div>
        )
    },
    {
        id: "viga-principal",
        title: "4. Aba Viga Principal (W)",
        icon: "Minus",
        content: (
            <div>
                <p className="mb-2">Dimensiona as vigas maiores que suportam as vigas secundárias.</p>
                <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Como Usar:</strong> O uso é similar ao da viga secundária, mas aqui a "Carga Distribuída" geralmente virá das reações das vigas secundárias que se apoiam nela.</li>
                    <li><strong>Resultado Principal:</strong> O <strong>Perfil W Recomendado</strong> e a <strong>Reação de Apoio (kgf)</strong>.</li>
                     <li><strong>Ação:</strong> Adicione a viga ao orçamento. Use a Reação de Apoio para dimensionar os pilares.</li>
                </ul>
            </div>
        )
    },
    {
        id: "pilar",
        title: "5. Aba Pilar (Coluna)",
        icon: "Square",
        content: (
            <div>
                <p className="mb-2">Dimensiona as colunas que sustentam as vigas.</p>
                 <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Como Usar:</strong>
                        <ul className="list-disc pl-5 mt-1 space-y-1">
                             <li>A <strong>Carga Axial (kgf)</strong> é a força total que o pilar deve suportar.</li>
                             <li>Você pode usar os botões "Enviar Reação" (<Icon name="Send" className="inline h-4 w-4" />) das abas de viga para somar automaticamente as reações de apoio a este campo.</li>
                             <li>Informe a <strong>Altura do Pilar</strong>.</li>
                        </ul>
                    </li>
                    <li><strong>Resultado Principal:</strong> O <strong>Perfil W Recomendado</strong> para o pilar, baseado em um cálculo simplificado de compressão.</li>
                     <li><strong>Ação:</strong> Adicione os pilares ao orçamento para ter a lista completa de materiais da sua estrutura.</li>
                </ul>
            </div>
        )
    },
    {
        id: "orcamento",
        title: "6. O Orçamento Final",
        icon: "Calculator",
        content: (
            <p>
                Todos os itens adicionados (Laje, Vigas e Pilares) são consolidados na tabela de orçamento na parte inferior da página. Ali, você pode ver o peso e o custo total do seu projeto, além de poder salvar ou imprimir um relatório limpo e profissional.
            </p>
        )
    }
];

function GuideComponent() {
  return (
    <div className="container mx-auto p-4">
        <Card className="mb-4">
            <CardHeader>
                <CardTitle>Guia da Calculadora de Estruturas</CardTitle>
                <CardDescription>
                    Aprenda passo a passo como dimensionar e orçar seu projeto de estrutura metálica.
                </CardDescription>
            </CardHeader>
        </Card>
        
        <Accordion type="single" collapsible className="w-full" defaultValue="fluxo">
            {guideTopics.map(topic => (
                <AccordionItem value={topic.id} key={topic.id}>
                    <AccordionTrigger className="text-lg font-semibold hover:bg-primary/10 px-1">
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
  );
}


export default function Page() {
    return (
        <Dashboard initialCategoryId="perfis/guia">
            <GuideComponent />
        </Dashboard>
    );
}
