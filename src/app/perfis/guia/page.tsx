
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
        title: "1. O Fluxo Completo da Calculadora",
        icon: "Workflow",
        content: (
            <div>
                <p className="mb-2">
                    A calculadora de estruturas hoje trabalha em <strong>8 etapas integradas</strong>, seguindo o caminho da geometria, das cargas e do orçamento da estrutura. Para aproveitar tudo, use nesta sequência:
                </p>
                <ol className="list-decimal pl-5 space-y-2">
                    <li>
                        <strong>Geometria:</strong> defina vãos principais, vãos secundários e balanços para entender o comportamento global da laje e da estrutura.
                    </li>
                    <li>
                        <strong>Laje (Steel Deck):</strong> calcule a carga total majorada da laje e os insumos de steel deck e concreto.
                    </li>
                    <li>
                        <strong>Viga Secundária (IPE):</strong> receba a carga da laje, informe espaçamento, esquema estrutural e dimensione o perfil IPE.
                    </li>
                    <li>
                        <strong>Viga Principal (W):</strong> receba automaticamente a reação da viga secundária como carga pontual e dimensione a viga principal.
                    </li>
                    <li>
                        <strong>Pilar:</strong> receba a carga axial da etapa anterior e dimensione o perfil do pilar com verificação de compressão.
                    </li>
                    <li>
                        <strong>Sapata:</strong> use a carga do pilar e o tipo de solo para pré-dimensionar a fundação e estimar o consumo de concreto.
                    </li>
                    <li>
                        <strong>Armadura da Sapata:</strong> com base na sapata calculada, obtenha uma sugestão inicial de aço, espaçamento e quantidade de barras.
                    </li>
                    <li>
                        <strong>Visualização:</strong> confira a estrutura em planta e elevações com base nos dados calculados nas etapas anteriores.
                    </li>
                </ol>
                <p className="mt-2 text-sm text-muted-foreground">
                    Ao longo do fluxo, a calculadora compartilha automaticamente cargas entre etapas, permite <strong>análises lógicas locais</strong>, em vários módulos oferece <strong>comparação com IA</strong>, e consolida materiais no <strong>Orçamento Final</strong> ao final da página.
                </p>
            </div>
        )
    },
    {
        id: "geometria",
        title: "2. Aba Geometria",
        icon: "Ruler",
        content: (
            <div>
                <p className="mb-2">
                   Esta é agora a etapa inicial da calculadora.
                </p>
                <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Como Usar:</strong> informe o vão em X, o vão em Y e os balanços em cada lado da laje.</li>
                    <li><strong>O que a etapa faz:</strong> gera uma <strong>análise textual da geometria</strong>, apontando relação entre vãos, comportamento em uma ou duas direções, risco de balanços excessivos e coerência estrutural do sistema.</li>
                    <li><strong>Quando usar:</strong> antes de escolher perfis, para validar se a distribuição estrutural faz sentido.</li>
                    <li><strong>Recurso extra:</strong> o texto pode ser copiado para uso em estudo preliminar, briefing técnico ou conferência rápida.</li>
                </ul>
            </div>
        )
    },
    {
        id: "laje",
        title: "3. Aba Laje (Steel Deck)",
        icon: "Layers",
        content: (
            <div>
                <p className="mb-2">Etapa para estimar a carga da laje colaborante e já preparar parte do orçamento.</p>
                <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Como Usar:</strong> selecione o tipo de steel deck, informe a espessura do concreto, o fator de segurança e monte a sobrecarga pelo <strong>Construtor de Sobrecarga</strong>.</li>
                    <li><strong>Resultado Principal:</strong> a <strong>Carga Total Majorada da Laje (kgf/m²)</strong>, usada na viga secundária.</li>
                    <li><strong>Análises disponíveis:</strong> análise lógica da seleção, verificação de coerência do vão e observações sobre concreto, carregamento e uso.</li>
                    <li><strong>Orçamento:</strong> permite lançar ao orçamento tanto o steel deck quanto o concreto da laje.</li>
                </ul>
            </div>
        )
    },
    {
        id: "vigas",
        title: "4. Abas de Viga Secundária e Principal",
        icon: "Minus",
        content: (
            <div className="space-y-4">
                <p>As duas abas de vigas compartilham a mesma lógica de pré-dimensionamento, com perfis e cargas adequados a cada função estrutural.</p>
                <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Viga Secundária:</strong> usa perfil <strong>IPE</strong>, recebe a carga da laje, aceita espaçamento entre vigas, carga distribuída adicional, carga pontual e posição da carga.</li>
                    <li><strong>Viga Principal:</strong> usa perfil <strong>W</strong>, recebe a reação da viga secundária como carga pontual e também aceita carga distribuída adicional.</li>
                    <li><strong>Esquemas de viga:</strong> ambas trabalham com <strong>bi-apoiada</strong>, <strong>com balanço</strong> e <strong>com dois balanços</strong>, com diagrama visual do esquema selecionado.</li>
                    <li><strong>Entradas configuráveis:</strong> vão central, balanços, tipo de aço, fator de segurança e dados para orçamento.</li>
                    <li><strong>Saídas principais:</strong> perfil recomendado, gráfico de utilização e <strong>reação de apoio máxima</strong>, usada nas próximas etapas.</li>
                    <li><strong>Extras:</strong> análise lógica local, comparação com IA e, no caso da viga secundária, sugestão de <strong>conectores de cisalhamento</strong>.</li>
                </ul>
            </div>
        )
    },
    {
        id: "pilar",
        title: "5. Aba Pilar",
        icon: "Square",
        content: (
            <div>
                <p className="mb-2">Dimensiona o perfil do pilar a partir da carga transferida pela estrutura superior.</p>
                <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Como Usar:</strong> informe pé-direito, comprimento adicional acima da estrutura, tipo de aço e fator de segurança.</li>
                    <li><strong>Carga automática:</strong> a <strong>carga axial</strong> vem da reação calculada na viga principal.</li>
                    <li><strong>Resultado Principal:</strong> perfil W recomendado, tensão atuante e tensão admissível.</li>
                    <li><strong>Extras:</strong> análise lógica local, comparação com IA e lançamento direto no orçamento.</li>
                </ul>
            </div>
        )
    },
    {
        id: "sapata",
        title: "6. Aba Sapata",
        icon: "Layers",
        content: (
            <div>
                <p className="mb-2">Pré-dimensiona a fundação de concreto a partir da carga do pilar e da tensão admissível do solo.</p>
                <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Como Usar:</strong> confirme a carga do pilar, selecione o tipo de solo e clique em <strong>Analisar Fundação</strong>.</li>
                    <li><strong>Resultado Principal:</strong> lado da sapata, altura recomendada e texto técnico de análise.</li>
                    <li><strong>Estimativa adicional:</strong> a tela calcula <strong>volume de concreto</strong> e <strong>custo estimado</strong> com base no preço informado.</li>
                    <li><strong>Observação:</strong> é um pré-dimensionamento para estudo preliminar e preparação da etapa de armadura.</li>
                </ul>
            </div>
        )
    },
    {
        id: "armadura",
        title: "7. Aba Armadura da Sapata",
        icon: "DraftingCompass",
        content: (
            <div>
                <p className="mb-2">Esta etapa foi adicionada e não estava refletida no guia anterior.</p>
                <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Pré-requisito:</strong> primeiro calcule a sapata na etapa anterior.</li>
                    <li><strong>Como Usar:</strong> escolha <strong>fck</strong>, classe do aço da armadura e diâmetro da barra.</li>
                    <li><strong>Resultado Principal:</strong> área de aço necessária, espaçamento sugerido e quantidade total de barras por direção.</li>
                    <li><strong>Análise adicional:</strong> a calculadora alerta quando o espaçamento fica apertado demais ou excessivo para uma solução prática.</li>
                </ul>
            </div>
        )
    },
    {
        id: "visualizacao",
        title: "8. Aba Visualização Estrutural",
        icon: "Eye",
        content: (
            <div>
                <p className="mb-2">Esta aba consolida visualmente os dados gerados nas etapas anteriores.</p>
                <ul className="list-disc pl-5 space-y-1">
                    <li><strong>O que mostra:</strong> planta, elevação frontal e elevação lateral da estrutura.</li>
                    <li><strong>Dados usados:</strong> geometria, laje, vigas, pilar e sapata já calculados.</li>
                    <li><strong>Utilidade:</strong> conferência rápida de vãos, balanços, posição dos pilares, altura do sistema e coerência geral da solução.</li>
                </ul>
            </div>
        )
    },
    {
        id: "orcamento",
        title: "9. Orçamento Final e Navegação",
        icon: "Calculator",
        content: (
            <div>
                <p className="mb-2">
                    Todos os itens adicionados nas etapas de laje, vigas e pilar são consolidados na tabela final de orçamento exibida abaixo da calculadora.
                </p>
                <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Na tabela final:</strong> você visualiza peso, custo por item, custo total, salva, limpa e imprime o relatório.</li>
                    <li><strong>Navegação:</strong> a calculadora também possui uma barra de etapas com avanço, retorno, menu completo de fases e indicador de progresso.</li>
                    <li><strong>Fluxo recomendado:</strong> sempre avance na ordem das abas para aproveitar o preenchimento automático entre etapas.</li>
                </ul>
            </div>
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
                    Aprenda o fluxo completo atual da calculadora, da geometria inicial até a visualização e o orçamento da estrutura.
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
