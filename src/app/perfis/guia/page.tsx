
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
        title: "1. O Fluxo de Trabalho Inteligente",
        icon: "Workflow",
        content: (
            <div>
                <p className="mb-2">
                    A calculadora foi projetada para seguir o caminho natural das cargas em uma estrutura. Para um melhor aproveitamento, siga esta ordem. A mágica acontece quando a carga de uma aba é <strong>automaticamente enviada para a próxima</strong>.
                </p>
                <ol className="list-decimal pl-5 space-y-2">
                    <li>
                        <strong>Laje (Steel Deck):</strong> Comece aqui. O resultado principal, a <strong>Carga Total (kgf/m²)</strong>, será usado no próximo passo.
                    </li>
                    <li>
                        <strong>Viga Secundária (IPE):</strong> A carga da laje calculada preencherá o campo aqui automaticamente. O resultado crucial, a <strong>Reação de Apoio (kgf)</strong>, será enviado para a viga principal.
                    </li>
                    <li>
                        <strong>Viga Principal (W):</strong> A reação da viga secundária se tornará uma <strong>Carga Pontual</strong> nesta aba. A reação de apoio da viga principal será, por sua vez, enviada ao pilar.
                    </li>
                     <li>
                        <strong>Pilar (Coluna):</strong> As reações das vigas compõem a carga final do pilar, que será dimensionado para resistir à compressão e flambagem. A carga total do pilar é enviada para a sapata.
                    </li>
                     <li>
                        <strong>Sapata (Fundação):</strong> A carga do pilar é recebida automaticamente. Informe o tipo de solo e o assistente de IA irá pré-dimensionar a sapata de concreto.
                    </li>
                </ol>
                <p className="mt-2 text-sm text-muted-foreground">
                    Após cada cálculo, um botão <strong>"Analisar com IA"</strong> aparecerá. Clique nele para obter insights sobre a seleção do perfil, otimização e segurança. Todos os itens podem ser adicionados ao <strong>Orçamento Final</strong> na parte inferior da página.
                </p>
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
                    <li><strong>Como Usar:</strong> Escolha o modelo de Steel Deck, a espessura do concreto e use o <strong>"Construtor de Sobrecarga"</strong> para definir as cargas de uso.</li>
                    <li><strong>Resultado Principal:</strong> A <strong>Carga Total em kgf/m²</strong>. Este valor será enviado automaticamente para a aba "Viga Secundária".</li>
                    <li><strong>Ação:</strong> Adicione a quantidade de chapas de Steel Deck (em m²) ao seu orçamento.</li>
                </ul>
            </div>
        )
    },
    {
        id: "vigas",
        title: "3. Abas de Viga (Secundária e Principal)",
        icon: "Minus",
        content: (
            <div className="space-y-4">
                <p>Dimensiona as vigas que suportam a laje ou outras vigas. A lógica é a mesma para vigas secundárias (IPE) e principais (W).</p>
                <div className="space-y-1">
                    <h4 className="font-semibold">Como Usar</h4>
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                         <li>Para vigas secundárias, o campo <strong>Carga da Laje (kgf/m²)</strong> é preenchido automaticamente com o resultado da aba Laje. Você só precisa informar o <strong>Espaçamento</strong> entre as vigas.</li>
                         <li>Para vigas principais, a <strong>Carga Pontual (kgf)</strong> é preenchida automaticamente com a reação da viga secundária.</li>
                         <li>O mais importante: selecione o <strong>Esquema da Viga</strong>. Isso é crucial, pois o cálculo dos esforços muda drasticamente.</li>
                    </ul>
                </div>
                <div className="space-y-2">
                    <h4 className="font-semibold">Entendendo os Esquemas de Viga e o Conceito de Viga Contínua</h4>
                     <ul className="list-disc pl-5 mt-1 space-y-2 text-sm">
                        <li><strong>Viga Bi-apoiada:</strong> É uma viga simples, apoiada em dois pilares. É o esquema menos eficiente, mas mais simples.</li>
                        <li><strong>Viga Contínua (2 ou mais vãos):</strong> É uma única viga longa que passa sobre 3 ou mais pilares, sendo um sistema muito mais eficiente. A continuidade faz com que surjam momentos negativos sobre os apoios internos, o que alivia o momento positivo no meio do vão, exigindo um perfil mais leve.</li>
                        <li><strong>Como a Calculadora Lida com Isso:</strong> Usamos esquemas que simulam os trechos de uma viga contínua:
                            <ul className="list-disc pl-5 mt-1 space-y-2 text-primary/90">
                                <li>
                                    <strong>Viga com um Balanço:</strong> Perfeito para simular o **vão da ponta** de uma viga contínua.
                                </li>
                                <li>
                                    <strong className="text-primary">Viga com Dois Balanços:</strong> Simula com excelente precisão um **vão interno** de uma viga contínua. Para isso, o **Vão Central** na calculadora é o vão que você quer dimensionar, e os **Balanços** representam a continuidade para os vãos vizinhos.
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
                 <div>
                     <p className="mt-2 text-sm text-muted-foreground">
                        <strong>Resultado Principal:</strong> O <strong>Perfil Recomendado</strong> e a <strong>Reação de Apoio (kgf)</strong>, que é enviada automaticamente para a próxima etapa (Viga Principal ou Pilar).
                     </p>
                 </div>
            </div>
        )
    },
    {
        id: "pilar",
        title: "4. Aba Pilar (Coluna)",
        icon: "Square",
        content: (
            <div>
                <p className="mb-2">Dimensiona as colunas que sustentam as vigas.</p>
                 <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Como Usar:</strong>
                        <ul className="list-disc pl-5 mt-1 space-y-1">
                             <li>A <strong>Carga Axial (kgf)</strong> é preenchida automaticamente com a reação de apoio calculada na aba "Viga Principal".</li>
                             <li>Informe a <strong>Altura do Pilar</strong>.</li>
                        </ul>
                    </li>
                    <li><strong>Resultado Principal:</strong> O <strong>Perfil W Recomendado</strong> para o pilar. A carga total do pilar é enviada automaticamente para a aba "Sapata".</li>
                     <li><strong>Ação:</strong> Adicione os pilares ao orçamento para ter a lista completa de materiais da sua estrutura.</li>
                </ul>
            </div>
        )
    },
    {
        id: "sapata",
        title: "5. Aba Sapata (Fundação)",
        icon: "Layers",
        content: (
            <div>
                <p className="mb-2">Pré-dimensiona a fundação de concreto para o pilar.</p>
                 <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Como Usar:</strong>
                        <ul className="list-disc pl-5 mt-1 space-y-1">
                             <li>O campo <strong>Carga Total do Pilar (kgf)</strong> é preenchido automaticamente.</li>
                             <li>Selecione o <strong>Tipo de Solo</strong> mais apropriado para o seu local.</li>
                             <li>Clique em "Analisar Fundação".</li>
                        </ul>
                    </li>
                    <li><strong>Resultado Principal:</strong> A IA fornecerá uma <strong>análise completa</strong>, o <strong>pré-dimensionamento da sapata</strong> e uma <strong>estimativa de custo</strong>.</li>
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
                Todos os itens adicionados (Laje, Vigas e Pilares) são consolidados na tabela de orçamento na parte inferior da página. Ali, você pode ver o peso e o custo total do seu projeto, além de poder salvar, limpar ou imprimir um relatório limpo e profissional para o seu cliente ou para registro.
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
                    Aprenda passo a passo como dimensionar e orçar seu projeto de estrutura metálica, da laje à fundação.
                </CardDescription>
            </CardHeader>
        </Card>
        
        <Accordion type="single" collapsible className="w-full" defaultValue="fluxo">
            {guideTopics.map(topic => (
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
  );
}


export default function Page() {
    return (
        <Dashboard initialCategoryId="perfis/guia">
            <GuideComponent />
        </Dashboard>
    );
}
