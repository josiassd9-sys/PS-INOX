
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
                        <strong>Laje (Steel Deck):</strong> Comece aqui para definir o piso. Use o "Construtor de Sobrecarga" para definir as cargas de uso. O resultado principal é a <strong>Carga Total (kgf/m²)</strong>, que será usada no próximo passo.
                    </li>
                    <li>
                        <strong>Viga Secundária (IPE):</strong> Use a carga da laje calculada (ou informe uma carga linear manualmente) e o espaçamento. A calculadora dimensionará a viga IPE mais leve. O resultado crucial aqui é a <strong>Reação de Apoio (kgf)</strong>.
                    </li>
                    <li>
                        <strong>Viga Principal (W):</strong> Dimensione as vigas que receberão as cargas das vigas secundárias. Lembre-se de escolher o esquema de viga correto (bi-apoiada, com balanços para simular viga contínua, etc.). O resultado também fornecerá a Reação de Apoio.
                    </li>
                     <li>
                        <strong>Pilar (Coluna):</strong> Use os botões <strong>"Enviar Reação"</strong> nas abas de viga para somar automaticamente as reações de apoio. Isso compõe a carga final do pilar, que será dimensionado para resistir à compressão e flambagem.
                    </li>
                     <li>
                        <strong>Sapata (Fundação):</strong> A carga do pilar será enviada para esta aba. Informe o tipo de solo e o assistente de IA irá pré-dimensionar a sapata de concreto necessária, incluindo uma estimativa de custo.
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
                    <li><strong>Como Usar:</strong> Escolha o modelo de Steel Deck, a espessura da camada de concreto e use o <strong>"Construtor de Sobrecarga"</strong> para selecionar as cargas de uso (residencial, escritório, etc.) conforme a norma NBR 6120.</li>
                    <li><strong>Resultado Principal:</strong> A <strong>Carga Total em kgf/m²</strong>. Este valor é a soma do peso próprio do deck, do concreto e da sobrecarga selecionada.</li>
                    <li><strong>Ação:</strong> Após o cálculo e a análise da IA, você pode adicionar a quantidade de chapas de Steel Deck (em m²) ao seu orçamento.</li>
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
                         <li>Para vigas secundárias, o campo <strong>Carga da Laje (kgf/m²)</strong> pode ser preenchido automaticamente clicando no ícone de atualização (<Icon name="RefreshCw" className="inline h-4 w-4" />) se você já calculou na aba Laje. Informe também o <strong>Espaçamento</strong> entre as vigas.</li>
                         <li>Alternativamente, você pode digitar a <strong>Carga na Viga (kgf/m)</strong> diretamente.</li>
                         <li>Para simular vigas que recebem outras vigas, ou equipamentos, você pode usar o campo <strong>Carga Pontual (kgf)</strong> e sua <strong>Posição (m)</strong>.</li>
                          <li>O mais importante: selecione o <strong>Esquema da Viga</strong>. Isso é crucial, pois o cálculo dos esforços muda drasticamente.</li>
                    </ul>
                </div>
                <div className="space-y-2">
                    <h4 className="font-semibold">Entendendo os Esquemas de Viga e o Conceito de Viga Contínua</h4>
                     <ul className="list-disc pl-5 mt-1 space-y-2 text-sm">
                        <li><strong>Viga Bi-apoiada:</strong> É uma viga simples, apoiada em dois pilares. Todo o esforço de flexão (momento fletor) é positivo, com o máximo no centro do vão (M = qL²/8). É o esquema menos eficiente, mas mais simples.</li>
                        <li><strong>Viga Contínua (2 ou mais vãos):</strong> É uma única viga longa que passa sobre 3 ou mais pilares. Este é um sistema muito mais eficiente. A continuidade faz com que surjam <strong>momentos negativos</strong> sobre os apoios internos, o que alivia o momento positivo no meio do vão. O resultado é que a viga sofre menos deformação e exige um perfil mais leve do que se usássemos várias vigas bi-apoiadas.</li>
                        <li><strong>Como a Calculadora Lida com Isso:</strong> A nossa calculadora não resolve uma viga contínua inteira, pois isso é muito complexo. Em vez disso, usamos esquemas que simulam os trechos mais importantes:
                            <ul className="list-disc pl-5 mt-1 space-y-2 text-primary/90">
                                <li>
                                    <strong>Viga com um Balanço:</strong> Perfeito para simular o **vão da ponta** de uma viga contínua que tem um beiral ou marquise.
                                </li>
                                <li>
                                    <strong className="text-primary">Viga com Dois Balanços:</strong> Esta é a ferramenta mais poderosa! Ela permite simular com excelente precisão um **vão interno** de uma viga contínua. Para isso:
                                    <br />- O **Vão Central** da calculadora é o vão que você quer dimensionar (entre dois pilares).
                                    <br />- Os **Balanços 1 e 2** representam a "continuidade" da viga para os vãos vizinhos. Um bom ponto de partida é usar cerca de 20-30% do comprimento do vão adjacente como o comprimento do balanço na calculadora.
                                    <br />- Ao fazer isso, a calculadora irá computar os momentos negativos nos apoios e o momento positivo aliviado no centro do vão, resultando em um perfil muito mais otimizado e realista.
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
                 <div>
                     <p className="mt-2 text-sm text-muted-foreground">
                        <strong>Resultado Principal:</strong> O <strong>Perfil Recomendado</strong> (o mais leve que atende à resistência e deformação), a verificação de <strong>Esforço Cortante</strong>, a quantidade de <strong>Conectores de Cisalhamento</strong> (para vigas secundárias) e a <strong>Reação de Apoio (kgf)</strong>.
                     </p>
                     <p className="mt-1 text-sm text-muted-foreground">
                        <strong>Ação:</strong> Após a análise da IA, adicione a viga ao orçamento. Use a Reação de Apoio para dimensionar a viga principal ou os pilares.
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
                             <li>A <strong>Carga Axial (kgf)</strong> é a força total que o pilar deve suportar.</li>
                             <li>Use os botões "Enviar Reação" (<Icon name="Send" className="inline h-4 w-4" />) que aparecem após calcular as vigas para somar automaticamente as reações de apoio a este campo. Você pode clicar várias vezes para somar reações de múltiplas vigas.</li>
                             <li>Informe a <strong>Altura do Pilar</strong>.</li>
                        </ul>
                    </li>
                    <li><strong>Resultado Principal:</strong> O <strong>Perfil W Recomendado</strong> para o pilar e uma <strong>análise final da IA</strong> sobre a coerência de todo o sistema, incluindo alertas sobre a necessidade de verificar as ligações viga-pilar. A carga do pilar será enviada automaticamente para a próxima aba.</li>
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
                             <li>O campo <strong>Carga Total do Pilar (kgf)</strong> será preenchido automaticamente com o valor calculado na aba "Pilar".</li>
                             <li>Selecione o <strong>Tipo de Solo</strong> mais apropriado para o seu local. A tensão admissível de cada solo é mostrada ao lado.</li>
                             <li>Clique em "Analisar Fundação".</li>
                        </ul>
                    </li>
                    <li><strong>Resultado Principal:</strong> A IA fornecerá uma <strong>análise completa</strong> e o <strong>pré-dimensionamento da sapata</strong> (área, dimensões e altura recomendada).</li>
                     <li><strong>Estimativa de Custo:</strong> Após a análise, você pode ajustar os preços do concreto e do aço para obter uma estimativa de custo para a sua fundação.</li>
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
